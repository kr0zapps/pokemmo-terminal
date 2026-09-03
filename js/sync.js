import { supabase } from './db.js';

let currentStatus = 'disconnected';

export function initRealtimeSync() {
  currentStatus = 'connecting';
  document.dispatchEvent(new CustomEvent('syncStatusChanged', { detail: currentStatus }));

  supabase.removeAllChannels();
  const channel = supabase.channel('schema-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gym_progress' }, payload => {
      document.dispatchEvent(new CustomEvent('gymUpdated', { detail: payload }));
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'berry_crops' }, payload => {
      document.dispatchEvent(new CustomEvent('cropUpdated', { detail: payload }));
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pokemon_caught' }, payload => {
      document.dispatchEvent(new CustomEvent('pokedexUpdated', { detail: payload }));
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        currentStatus = 'connected';
      } else {
        currentStatus = 'disconnected';
      }
      document.dispatchEvent(new CustomEvent('syncStatusChanged', { detail: currentStatus }));
    });

  return channel;
}

export function getConnectionStatus() {
  return currentStatus;
}

export function renderSyncBadge() {
  return '';
}


