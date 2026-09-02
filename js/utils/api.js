const POKEAPI_BASE = 'https://pokeapi.co/api/v2';
const cache = new Map();

export async function fetchPokemonSpecies(nameOrId) {
  const cacheKey = `species-${nameOrId}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`${POKEAPI_BASE}/pokemon-species/${nameOrId}`);
    if (!res.ok) throw new Error(`PokeAPI error: ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`Error fetching species ${nameOrId}:`, err);
    return null;
  }
}

export async function fetchEggGroup(groupName) {
  const cacheKey = `egg-${groupName}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`${POKEAPI_BASE}/egg-group/${groupName}`);
    if (!res.ok) throw new Error(`PokeAPI error: ${res.status}`);
    const data = await res.json();
    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`Error fetching egg group ${groupName}:`, err);
    return null;
  }
}

