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
  const colors = {
    'connected': 'var(--os-green, #10B981)',
    'connecting': 'var(--os-blue, #3B82F6)',
    'disconnected': 'var(--os-red, #F93822)'
  };
  
  const labels = {
    'connected': 'Conectado',
    'connecting': 'Conectando...',
    'disconnected': 'Desconectado'
  };

  const color = colors[currentStatus] || colors['disconnected'];
  const label = labels[currentStatus] || labels['disconnected'];

  return `
    <div class="flex items-center gap-2 text-sm" style="color: var(--os-text, #EDEDED); font-family: 'Inter', sans-serif;">
      <span class="w-2 h-2 rounded-full" style="background-color: ${color}; box-shadow: 0 0 8px ${color};"></span>
      <span style="color: var(--os-muted, #82889E);">${label}</span>
    </div>
  `;
}


