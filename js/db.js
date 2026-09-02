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
  const { data, error } = await supabase
    .from('gym_progress')
    .upsert({ gym_id: gymId, completed, completed_at: completed ? new Date().toISOString() : null }, { onConflict: 'user_id, gym_id' })
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
  return data;
}

export async function addCrop(crop) {
  const { data, error } = await supabase.from('berry_crops').insert([crop]).select();
  if (error) throw error;
  return data[0];
}

export async function updateCrop(id, updateData) {
  const { data, error } = await supabase.from('berry_crops').update(updateData).eq('id', id).select();
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
  const { data, error } = await supabase
    .from('pokemon_caught')
    .insert([{ pokemon_id: pokemonId }])
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
  const { data, error } = await supabase.from('user_preferences').upsert(prefs).select();
  if (error) throw error;
  return data[0];
}

// --- Suggestions ---
export async function submitSuggestion(suggestion) {
  const { data, error } = await supabase.from('pokedex_suggestions').insert([suggestion]).select();
  if (error) throw error;
  return data[0];
}

export async function getMySuggestions() {
  const { data, error } = await supabase.from('pokedex_suggestions').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

