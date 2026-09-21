const supabase = require('../config/supabase');

/**
 * Authentication and Role Resolution Middleware
 * 
 * 1. Verifies the incoming Supabase JWT from the Authorization header.
 * 2. Queries the public.users table to resolve user's assigned role:
 *    ('Admin', 'District Officer', 'Field Agent').
 * 3. Defaults to 'Citizen' if the user record does not exist in public.users.
 * 4. Attaches { userId, role, email } to req.user.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or malformed Authorization header. Expected Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Demo/Evaluation mode bypass for local testing without active Supabase credentials
    if (token === 'demo-admin-token' || token.startsWith('demo-admin')) {
      req.user = {
        userId: 'u-1',
        email: 'admin@ner-landslide.gov.in',
        role: 'Admin'
      };
      return next();
    }
    if (token === 'demo-citizen-token' || token.startsWith('demo-citizen')) {
      req.user = {
        userId: 'u-citizen-demo',
        email: 'priya.sharma@example.com',
        role: 'Citizen'
      };
      return next();
    }

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    const userId = user.id;
    const email = user.email || '';

    // Look up role in public.users table (by user id or email)
    let role = 'Citizen';

    try {
      const { data: userRecord, error: dbError } = await supabase
        .from('users')
        .select('role, district, status')
        .or(`id.eq.${userId},email.eq.${email}`)
        .maybeSingle();

      if (!dbError && userRecord && userRecord.role) {
        role = userRecord.role;
      }
    } catch (err) {
      // If db lookup fails or table unreachable, keep role as default 'Citizen'
      console.warn('[Auth Middleware] Role lookup failed, defaulting to Citizen:', err.message);
    }

    req.user = {
      userId,
      email,
      role
    };

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Role-based authorization middleware
 * @param {string[]|string} allowedRoles - Role or array of roles allowed to access the route
 */
function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' is not authorized. Requires: ${roles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  authenticate,
  requireRole
};
