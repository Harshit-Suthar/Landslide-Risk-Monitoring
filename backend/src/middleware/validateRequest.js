/**
 * Schema-based body validation middleware.
 * Usage:
 *   validateBody({
 *     location_id: { type: 'string', required: true },
 *     severity: { type: 'string', required: true, enum: ['Minor', 'Moderate', 'Severe'] }
 *   })
 */
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    const body = req.body || {};

    for (const [field, rules] of Object.entries(schema)) {
      const val = body[field];

      if (rules.required && (val === undefined || val === null || val === '')) {
        errors.push(`Field '${field}' is required`);
        continue;
      }

      if (val !== undefined && val !== null) {
        if (rules.type && typeof val !== rules.type) {
          errors.push(`Field '${field}' must be of type ${rules.type}`);
        }

        if (rules.enum && !rules.enum.includes(val)) {
          errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}`);
        }

        if (rules.custom && typeof rules.custom === 'function') {
          const customError = rules.custom(val);
          if (customError) {
            errors.push(customError);
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
}

module.exports = {
  validateBody
};
