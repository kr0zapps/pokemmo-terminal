import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const SUPABASE_URL = 'https://gbgfickifhnshhulsxwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZ2ZpY2tpZmhuc2hodWxzeHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTc1ODcsImV4cCI6MjEwMzkzMzU4N30.5wO0lmX5arxaZxiOWGIMOB1aSYKkrJU4ZO7IgD1E6L8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Gym ---
export async function getGymProgress() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data, error } = await supabase.from('gym_progress').select('*').eq('user_id', session.user.id);
  if (error) throw error;
  return data;
}

export async function toggleGym(gymId, completed, customCompletedAt = null) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const user_id = session.user.id;
  const completed_at = completed ? (customCompletedAt || new Date().toISOString()) : null;
  const { data, error } = await supabase
    .from('gym_progress')
    .upsert({ user_id, gym_id: gymId, completed, completed_at }, { onConflict: 'user_id, gym_id' })
    .select();
  if (error) throw error;
  return data[0];
}

export async function batchToggleGyms(gymEntries) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !gymEntries || gymEntries.length === 0) return;
  const user_id = session.user.id;
  const rows = gymEntries.map(g => ({
    user_id,
    gym_id: g.gymId,
    completed: g.completed,
    completed_at: g.completedAt || new Date().toISOString()
  }));
  const { error } = await supabase
    .from('gym_progress')
    .upsert(rows, { onConflict: 'user_id, gym_id' });
  if (error) console.warn('Batch gym toggle error:', error);
}

export async function resetAllGyms() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { error } = await supabase.from('gym_progress').update({ completed: false, completed_at: null }).eq('user_id', session.user.id);
  if (error) throw error;
}

// --- Berry ---
export async function getCrops() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return JSON.parse(localStorage.getItem('pokemmo_crops') || '[]');
  }
  const { data, error } = await supabase.from('berry_crops').select('*').eq('user_id', session.user.id).order('created_at', { ascending: true });
  if (error) throw error;

  // Deduplicate duplicate ghost crops created by repeated migration loops
  const seen = new Set();
  const uniqueRows = [];
  const duplicateIds = [];

  for (const row of (data || [])) {
    const plantMinute = Math.floor(new Date(row.planted_at).getTime() / 60000);
    const key = `${row.berry_type}_${row.location || ''}_${plantMinute}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRows.push(row);
    } else {
      duplicateIds.push(row.id);
    }
  }

  // Purge duplicate rows from Supabase in the background
  if (duplicateIds.length > 0) {
    supabase.from('berry_crops').delete().in('id', duplicateIds).then(() => {
      console.log(`Cleaned up ${duplicateIds.length} duplicate crops from Supabase`);
    }).catch(e => console.warn('Could not purge duplicates:', e));
  }

  return uniqueRows.map(row => ({
    id: row.id,
    type: row.berry_type,
    location: row.location,
    plantedAt: new Date(row.planted_at).getTime(),
    waterCount: row.water_count,
    watered: row.water_count > 0,
    wateredAt: row.last_watered_at ? new Date(row.last_watered_at).getTime() : null,
    initialDryHours: 2
  }));
}

export async function addCrop(crop) {
  const { data: { session } } = await supabase.auth.getSession();
  let validId = crop.id;
  if (!validId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(validId)) {
    validId = crypto.randomUUID();
  }

  if (!session) {
    crop.id = validId;
    return crop;
  }

  const dbCrop = {
    id: validId,
    user_id: session.user.id,
    berry_type: crop.type,
    location: crop.location || '',
    planted_at: new Date(crop.plantedAt).toISOString(),
    water_count: crop.waterCount || (crop.watered ? 1 : 0),
    last_watered_at: crop.wateredAt ? new Date(crop.wateredAt).toISOString() : null,
    harvested: false
  };

  const { data, error } = await supabase.from('berry_crops').insert([dbCrop]).select();
  if (error) throw error;
  return data[0];
}

export async function updateCrop(id, updateData) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const dbData = {};
  if (updateData.type !== undefined) dbData.berry_type = updateData.type;
  if (updateData.location !== undefined) dbData.location = updateData.location;
  if (updateData.plantedAt !== undefined) dbData.planted_at = new Date(updateData.plantedAt).toISOString();
  if (updateData.waterCount !== undefined) dbData.water_count = updateData.waterCount;
  if (updateData.watered !== undefined && updateData.waterCount === undefined) dbData.water_count = updateData.watered ? 1 : 0;
  if (updateData.wateredAt !== undefined) dbData.last_watered_at = updateData.wateredAt ? new Date(updateData.wateredAt).toISOString() : null;

  const { data, error } = await supabase.from('berry_crops').update(dbData).eq('id', id).select();
  if (error) throw error;
  return data[0];
}

export async function removeCrop(id) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { error } = await supabase.from('berry_crops').delete().eq('id', id);
  if (error) throw error;
}

// --- Pokemon ---
export async function getCaughtPokemon() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return JSON.parse(localStorage.getItem('pokemmo_dex_caught') || '[]');
  }
  const { data, error } = await supabase.from('pokemon_caught').select('pokemon_id').eq('user_id', session.user.id);
  if (error) throw error;
  return data.map(row => row.pokemon_id);
}

export async function catchPokemon(pokemonId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  const user_id = session.user.id;
  const { data, error } = await supabase
    .from('pokemon_caught')
    .upsert([{ user_id, pokemon_id: pokemonId }], { onConflict: 'user_id, pokemon_id' })
    .select();
  if (error) throw error;
  return data[0];
}

export async function batchCatchPokemon(pokemonIds) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session || !pokemonIds || pokemonIds.length === 0) return;
  const user_id = session.user.id;
  const rows = pokemonIds.map(pid => ({ user_id, pokemon_id: pid }));
  const { error } = await supabase
    .from('pokemon_caught')
    .upsert(rows, { onConflict: 'user_id, pokemon_id' });
  if (error) console.warn('Batch catch error:', error);
}

export async function uncatchPokemon(pokemonId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;
  const { error } = await supabase.from('pokemon_caught').delete().match({ user_id: session.user.id, pokemon_id: pokemonId });
  if (error) throw error;
}

// --- Preferences ---
export async function getPreferences() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return JSON.parse(localStorage.getItem('pokemmo_dex_prefs') || '{}');
  }
  const { data, error } = await supabase.from('user_preferences').select('*').single();
  if (error && error.code !== 'PGRST116') throw error; // ignore row not found
  return data || {};
}

export async function savePreferences(prefs) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    localStorage.setItem('pokemmo_dex_prefs', JSON.stringify(prefs));
    return prefs;
  }
  
  const cleanPrefs = { user_id: session.user.id };
  const allowed = ['active_tab', 'dex_region', 'dex_filters', 'amulet_coin_enabled', 'breeding_config'];
  for (const k of allowed) {
    if (prefs[k] !== undefined) cleanPrefs[k] = prefs[k];
  }
  
  const { data, error } = await supabase.from('user_preferences').upsert(cleanPrefs).select();
  if (error) throw error;
  return data[0];
}

// --- Suggestions ---
export async function submitSuggestion(suggestion) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Debes iniciar sesión para enviar sugerencias.');
  suggestion.user_id = session.user.id;
  const { data, error } = await supabase.from('pokedex_suggestions').insert([suggestion]).select();
  if (error) throw error;
  return data[0];
}

export async function getMySuggestions() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return [];
  const { data, error } = await supabase.from('pokedex_suggestions').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
