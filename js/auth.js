import { supabase, addCrop, catchPokemon, savePreferences, toggleGym } from './db.js';
import { safeHTML, h, text, $ } from './utils/dom.js';

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function register(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export function onAuthStateChange(callback) {
  supabase.auth.onAuthStateChange((event, session) => callback(event, session));
}

export async function migrateLocalStorage() {
  const migrated = localStorage.getItem('pokemmo_migrated');
  if (migrated === 'true') return;

  try {
    // Migrate preferences
    const prefs = {
      active_tab: localStorage.getItem('pokemmo_active_tab') || 'gyms',
      dex_regiÃ³n: 'Kanto'
    };
    const savedPrefs = localStorage.getItem('pokemmo_dex_prefs');
    if (savedPrefs) {
      try { Object.assign(prefs, JSON.parse(savedPrefs)); } catch(e) {}
    }
    await savePreferences(prefs);

    // Migrate caught pokemon
    const dexCaught = localStorage.getItem('pokemmo_dex_caught');
    if (dexCaught) {
      const caughtList = JSON.parse(dexCaught);
      for (const pid of caughtList) {
        await catchPokemon(pid).catch(() => {}); // ignore duplicates
      }
    }

    // Migrate crops
    const crops = localStorage.getItem('pokemmo_crops');
    if (crops) {
      const cropsList = JSON.parse(crops);
      for (const c of cropsList) {
        await addCrop({
          berry_type: c.type || 'Unknown',
          location: c.location || 'Unknown',
          planted_at: c.plantedAt ? new DÃ­ate(c.plantedAt).toISOString() : new Date().toISOString(),
          water_count: c.waterCount || 0,
          last_watered_at: c.lastWateredAt ? new DÃ­ate(c.lastWateredAt).toISOString() : null,
          harvested: c.harvested || false
        });
      }
    }

    // Migrate gyms
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gym-')) {
        const gymId = key.substring(4);
        const completed = localStorage.getItem(key) === 'true';
        await toggleGym(gymId, completed);
      }
    }

    localStorage.setItem('pokemmo_migrated', 'true');
  } catch (err) {
    console.error('Error during migration:', err);
  }
}

export function renderAuthUI(onSuccess) {
  const main = $('main');
  if (!main) return;

  const html = safeHTML`
    <div class="flex items-center justify-center min-h-screen" style="background-color: var(--os-bg, #090A0F); font-family: 'Inter', sans-serif;">
      <div class="w-full max-w-md p-8 rounded-xl shadow-2xl" style="background-color: var(--os-panel, #13151F); border: 1px solid var(--os-border, #262A3D);">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold mb-2" style="color: var(--os-blue, #3B82F6);">PokÃ©MMO Terminal</h1>
          <p class="text-sm" style="color: var(--os-muted, #82889E);">Inicia sesiÃ³n para continuar</p>
        </div>
        
        <form id="auth-form" class="space-y-6">
          <div id="auth-error" class="hidden p-3 text-sm rounded" style="background-color: rgba(249,56,34,0.1); color: var(--os-red, #F93822); border: 1px solid var(--os-red, #F93822);"></div>
          
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--os-text, #EDEDED);">Correo ElectrÃ³nico</label>
            <input type="email" id="auth-email" required
              class="w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style="background-color: var(--os-bg, #090A0F); border: 1px solid var(--os-border, #262A3D); color: var(--os-text, #EDEDED);" />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1" style="color: var(--os-text, #EDEDED);">ContraseÃ±a</label>
            <input type="password" id="auth-password" required
              class="w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style="background-color: var(--os-bg, #090A0F); border: 1px solid var(--os-border, #262A3D); color: var(--os-text, #EDEDED);" />
          </div>

          <div class="flex items-center">
            <input type="checkbox" id="auth-remember" class="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900">
            <label for="auth-remember" class="ml-2 text-sm" style="color: var(--os-muted, #82889E);">Recordar sesiÃ³n</label>
          </div>
          
          <div class="flex gap-4 pt-2">
            <button type="submit" id="btn-login" class="flex-1 py-2 px-4 rounded font-medium transition-colors hover:opacity-90" style="background-color: var(--os-blue, #3B82F6); color: white;">
              Iniciar SesiÃ³n
            </button>
            <button type="button" id="btn-register" class="flex-1 py-2 px-4 rounded font-medium transition-colors hover:opacity-90" style="background-color: transparent; border: 1px solid var(--os-blue, #3B82F6); color: var(--os-blue, #3B82F6);">
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  main.innerHTML = html;

  const form = $('#auth-form');
  const errorDiv = $('#auth-error');
  const emailInput = $('#auth-email');
  const passwordInput = $('#auth-password');
  const btnRegister = $('#btn-register');

  const showError = (msg) => {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    try {
      await login(emailInput.value, passwordInput.value);
      if (onSuccess) onSuccess();
    } catch (err) {
      showError(err.message || 'Error al iniciar sesiÃ³n');
    }
  });

  btnRegister.addEventListener('click', async () => {
    if (!emailInput.value || !passwordInput.value) {
      showError('Por favor ingrese correo y contraseÃ±a para registrarse');
      return;
    }
    errorDiv.classList.add('hidden');
    try {
      await register(emailInput.value, passwordInput.value);
      showError('Registro exitoso. Puede iniciar sesiÃ³n.');
      errorDiv.style.color = 'var(--os-green, #10B981)';
      errorDiv.style.borderColor = 'var(--os-green, #10B981)';
      errorDiv.style.backgroundColor = 'rgba(16,185,129,0.1)';
    } catch (err) {
      showError(err.message || 'Error al registrarse');
    }
  });
}




