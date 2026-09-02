import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// REPLACE THESE WITH YOUR ACTUAL SUPABASE URL AND ANON KEY
const SUPABASE_URL = 'https://gbgfickifhnshhulsxwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZ2ZpY2tpZmhuc2hodWxzeHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNTc1ODcsImV4cCI6MjEwMzkzMzU4N30.5wO0lmX5arxaZxiOWGIMOB1aSYKkrJU4ZO7IgD1E6L8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Gym ---
export async function getGymProgress() {
  const { data, error } = await supabase.from('gym_progress').select('*');
  if (error) throw error;
  return data;
}

export async function toggleGym(gymId, completed) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session');
  const user_id = session.user.id;
  const { data, error } = await supabase
    .from('gym_progress')
    .upsert({ user_id, gym_id: gymId, completed, completed_at: completed ? new Date().toISOString() : null }, { onConflict: 'user_id, gym_id' })
    .select();
  if (error) throw error;
  return data[0];
}

export async function resetAllGyms() {
  const { error } = await supabase.from('gym_progress').update({ completed: false, completed_at: null }).neq('gym_id', '');
  if (error) throw error;
}

// --- Berry ---
export async function getCrops() {
  const { data, error } = await supabase.from('berry_crops').select('*');
  if (error) throw error;
  return data.map(row => ({
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
  if (!session) throw new Error('No session');
  
  let validId = crop.id;
  if (!validId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(validId)) {
    validId = crypto.randomUUID();
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
  const { error } = await supabase.from('berry_crops').delete().eq('id', id);
  if (error) throw error;
}

// --- Pokemon ---
export async function getCaughtPokemon() {
  const { data, error } = await supabase.from('pokemon_caught').select('pokemon_id');
  if (error) throw error;
  return data.map(row => row.pokemon_id);
}

export async function catchPokemon(pokemonId) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session');
  const user_id = session.user.id;
  const { data, error } = await supabase
    .from('pokemon_caught')
    .insert([{ user_id, pokemon_id: pokemonId }])
    .select();
  if (error) throw error;
  return data[0];
}

export async function uncatchPokemon(pokemonId) {
  const { error } = await supabase.from('pokemon_caught').delete().eq('pokemon_id', pokemonId);
  if (error) throw error;
}

// --- Preferences ---
export async function getPreferences() {
  const { data, error } = await supabase.from('user_preferences').select('*').single();
  if (error && error.code !== 'PGRST116') throw error; // ignore row not found
  return data || {};
}

export async function savePreferences(prefs) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No session');
  
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
  if (!session) throw new Error('No session');
  suggestion.user_id = session.user.id;
  const { data, error } = await supabase.from('pokedex_suggestions').insert([suggestion]).select();
  if (error) throw error;
  return data[0];
}

export async function getMySuggestions() {
  const { data, error } = await supabase.from('pokedex_suggestions').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
