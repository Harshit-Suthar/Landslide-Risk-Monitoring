import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Seed data for immediate local preview/evaluation
const INITIAL_USERS = [
  {
    id: 'u-1',
    name: 'Dr. Arindam Sarmah',
    email: 'admin@ner-landslide.gov.in',
    role: 'Admin',
    district: 'Guwahati',
    status: 'Active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'u-2',
    name: 'Tsering Lhamo',
    email: 't.lhamo@arunachal.gov.in',
    role: 'District Officer',
    district: 'Itanagar',
    status: 'Active',
    created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
  },
  {
    id: 'u-3',
    name: 'Lalremruata Sailo',
    email: 'l.sailo@mizoram.gov.in',
    role: 'District Officer',
    district: 'Aizawl',
    status: 'Active',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'u-4',
    name: 'Kevisenuo Angami',
    email: 'k.angami@nagaland.gov.in',
    role: 'Field Agent',
    district: 'Kohima',
    status: 'Active',
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
  {
    id: 'u-5',
    name: 'Bantei Kharkongor',
    email: 'b.kharkongor@meghalaya.gov.in',
    role: 'District Officer',
    district: 'Shillong',
    status: 'Active',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'u-6',
    name: 'Chinglen Meitei',
    email: 'c.meitei@manipur.gov.in',
    role: 'Field Agent',
    district: 'Imphal',
    status: 'Inactive',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const INITIAL_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'Nongthymmai Ridge',
    district: 'Shillong',
    latitude: 25.5682,
    longitude: 91.8933,
    risk_level: 'Critical',
    description: 'Steep slope with heavy seepage observed following pre-monsoon downpour.',
    status: 'Monitored',
    last_reported: new Date(Date.now() - 2 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'loc-2',
    name: 'NH-29 Kohima By-Pass',
    district: 'Kohima',
    latitude: 25.6747,
    longitude: 94.1103,
    risk_level: 'High',
    description: 'Active subsidence along the highway corridor. Sinking zone active.',
    status: 'Monitored',
    last_reported: new Date(Date.now() - 5 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'loc-3',
    name: 'Banderdewa Slope',
    district: 'Itanagar',
    latitude: 27.1264,
    longitude: 93.8188,
    risk_level: 'Medium',
    description: 'Vegetation clearings on hillside causing mild erosion during rainfall.',
    status: 'Monitored',
    last_reported: new Date(Date.now() - 24 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'loc-4',
    name: 'Kamakhya Hill Western Flank',
    district: 'Guwahati',
    latitude: 26.1664,
    longitude: 91.7056,
    risk_level: 'High',
    description: 'Dense settlement along fragile sandstone escarpment. Soil displacement detected.',
    status: 'Monitored',
    last_reported: new Date(Date.now() - 8 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'loc-5',
    name: 'Durtlang Hills Sector 4',
    district: 'Aizawl',
    latitude: 23.7712,
    longitude: 92.7303,
    risk_level: 'Critical',
    description: 'Massive vertical fractures visible in shale rock layers above road.',
    status: 'Monitored',
    last_reported: new Date(Date.now() - 45 * 60000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'loc-6',
    name: 'Baramura Hill Range',
    district: 'Agartala',
    latitude: 23.8315,
    longitude: 91.5645,
    risk_level: 'Low',
    description: 'Stabilized roadside embankments with retaining walls intact.',
    status: 'Resolved',
    last_reported: new Date(Date.now() - 72 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'loc-7',
    name: 'Kangchup Foothills',
    district: 'Imphal',
    latitude: 24.8732,
    longitude: 93.8190,
    risk_level: 'Medium',
    description: 'Seasonal stream overflow causing toe erosion at slope base.',
    status: 'Monitored',
    last_reported: new Date(Date.now() - 18 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 12 * 86400000).toISOString(),
  },
  {
    id: 'loc-8',
    name: 'Tathangchen Ward',
    district: 'Gangtok',
    latitude: 27.3389,
    longitude: 88.6186,
    risk_level: 'High',
    description: 'Perched water table causing pore pressure build-up along slope.',
    status: 'Monitored',
    last_reported: new Date(Date.now() - 4 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

const LOCAL_USERS_KEY = 'ner_dashboard_users';
const LOCAL_LOCS_KEY = 'ner_dashboard_locations';

function getLocalUsers() {
  const data = localStorage.getItem(LOCAL_USERS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  }
  return JSON.parse(data);
}

function saveLocalUsers(users) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function getLocalLocations() {
  const data = localStorage.getItem(LOCAL_LOCS_KEY);
  if (!data) {
    localStorage.setItem(LOCAL_LOCS_KEY, JSON.stringify(INITIAL_LOCATIONS));
    return INITIAL_LOCATIONS;
  }
  return JSON.parse(data);
}

function saveLocalLocations(locs) {
  localStorage.setItem(LOCAL_LOCS_KEY, JSON.stringify(locs));
}

export const landslideService = {
  // ================= USERS CRUD =================
  async getUsers() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
      console.warn('Supabase getUsers failed or empty, using local data:', error?.message);
    }
    return getLocalUsers();
  },

  async createUser(user) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          name: user.name,
          email: user.email,
          role: user.role,
          district: user.district,
          status: user.status || 'Active',
        }])
        .select();

      if (!error && data && data[0]) return data[0];
      console.warn('Supabase createUser failed, saving locally:', error?.message);
    }

    const current = getLocalUsers();
    const newUser = {
      id: 'u-' + Date.now(),
      name: user.name,
      email: user.email,
      role: user.role,
      district: user.district,
      status: user.status || 'Active',
      created_at: new Date().toISOString(),
    };
    saveLocalUsers([newUser, ...current]);
    return newUser;
  },

  async updateUser(id, user) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: user.name,
          email: user.email,
          role: user.role,
          district: user.district,
          status: user.status,
        })
        .eq('id', id)
        .select();

      if (!error && data && data[0]) return data[0];
      console.warn('Supabase updateUser failed, updating locally:', error?.message);
    }

    const current = getLocalUsers();
    const updated = current.map(u => (u.id === id ? { ...u, ...user } : u));
    saveLocalUsers(updated);
    return updated.find(u => u.id === id);
  },

  async deleteUser(id) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (!error) return true;
      console.warn('Supabase deleteUser failed, deleting locally:', error?.message);
    }

    const current = getLocalUsers();
    saveLocalUsers(current.filter(u => u.id !== id));
    return true;
  },

  async toggleUserStatus(id, currentStatus) {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    return this.updateUser(id, { status: nextStatus });
  },

  // ================= LOCATIONS CRUD =================
  async getLocations() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return data;
      console.warn('Supabase getLocations failed or empty, using local data:', error?.message);
    }
    return getLocalLocations();
  },

  async createLocation(loc) {
    const payload = {
      name: loc.name,
      district: loc.district,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
      risk_level: loc.risk_level,
      description: loc.description || '',
      status: loc.status || 'Monitored',
      last_reported: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('locations')
        .insert([payload])
        .select();

      if (!error && data && data[0]) return data[0];
      console.warn('Supabase createLocation failed, saving locally:', error?.message);
    }

    const current = getLocalLocations();
    const newLoc = {
      id: 'loc-' + Date.now(),
      ...payload,
      created_at: new Date().toISOString(),
    };
    saveLocalLocations([newLoc, ...current]);
    return newLoc;
  },

  async updateLocation(id, loc) {
    const payload = {
      name: loc.name,
      district: loc.district,
      latitude: parseFloat(loc.latitude),
      longitude: parseFloat(loc.longitude),
      risk_level: loc.risk_level,
      description: loc.description || '',
      status: loc.status,
      last_reported: loc.last_reported || new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('locations')
        .update(payload)
        .eq('id', id)
        .select();

      if (!error && data && data[0]) return data[0];
      console.warn('Supabase updateLocation failed, updating locally:', error?.message);
    }

    const current = getLocalLocations();
    const updated = current.map(l => (l.id === id ? { ...l, ...payload } : l));
    saveLocalLocations(updated);
    return updated.find(l => l.id === id);
  },

  async deleteLocation(id) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (!error) return true;
      console.warn('Supabase deleteLocation failed, deleting locally:', error?.message);
    }

    const current = getLocalLocations();
    saveLocalLocations(current.filter(l => l.id !== id));
    return true;
  }
};

export default landslideService;
