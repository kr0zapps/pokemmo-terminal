import { getGymProgress, getCrops, getCaughtPokemon, getPreferences } from './db.js';

export const state = {
  gyms: [],
  crops: [],
  caught: [],
  preferences: {}
};

const subscribers = {};

export function subscribe(key, callback) {
  if (!subscribers[key]) subscribers[key] = [];
  subscribers[key].push(callback);
}

export function setState(key, value) {
  state[key] = value;
  if (subscribers[key]) {
    subscribers[key].forEach(cb => cb(value));
  }
}

export async function loadInitialState() {
  try {
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Supabase request timeout')), 5000)
    );

    const [gyms, crops, caught, prefs] = await Promise.race([
      Promise.all([
        getGymProgress(),
        getCrops(),
        getCaughtPokemon(),
        getPreferences()
      ]),
      timeoutPromise
    ]);
    
    setState('gyms', gyms || []);
    setState('crops', crops || []);
    setState('caught', caught || []);
    setState('preferences', prefs || {});
  } catch (err) {
    console.warn('Initial state loaded with fallback:', err.message);
  }
}

