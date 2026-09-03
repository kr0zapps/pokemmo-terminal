import { supabase, addCrop, catchPokemon, savePreferences, toggleGym } from './db.js';
import { safeHTML, h, text, $ } from './utils/dom.js';

export function normalizeAuthInput(input) {
  const trimmed = (input || '').trim();
  if (!trimmed) return '';
  if (!trimmed.includes('@')) {
    return `${trimmed.toLowerCase()}@pokemmo.app`;
  }
  return trimmed.toLowerCase();
}

export async function login(input, password) {
  const email = normalizeAuthInput(input);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function register(input, password) {
  const email = normalizeAuthInput(input);
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
  const session = await getSession();
  if (!session) return;

  try {
    // 1. Migrate preferences
    try {
      const prefs = {
        active_tab: localStorage.getItem('pokemmo_active_tab') || 'gyms',
        dex_region: 'Kanto'
      };
      const savedPrefs = localStorage.getItem('pokemmo_dex_prefs');
      if (savedPrefs) {
        try { Object.assign(prefs, JSON.parse(savedPrefs)); } catch(e) {}
      }
      await savePreferences(prefs);
    } catch(e) {
      console.warn('Preferences migration error:', e);
    }

    // 2. Migrate caught pokemon
    try {
      const dexCaught = localStorage.getItem('pokemmo_dex_caught');
      if (dexCaught) {
        const caughtList = JSON.parse(dexCaught);
        if (Array.isArray(caughtList)) {
          for (const pid of caughtList) {
            await catchPokemon(pid).catch(() => {});
          }
        }
      }
    } catch(e) {
      console.warn('Caught pokemon migration error:', e);
    }

    // 3. Migrate crops
    try {
      const crops = localStorage.getItem('pokemmo_crops');
      if (crops) {
        const cropsList = JSON.parse(crops);
        if (Array.isArray(cropsList)) {
          for (const c of cropsList) {
            await addCrop({
              type: c.type || 'Unknown',
              location: c.location || 'Unknown',
              plantedAt: c.plantedAt ? new Date(c.plantedAt).toISOString() : new Date().toISOString(),
              waterCount: c.waterCount || 0,
              wateredAt: c.lastWateredAt ? new Date(c.lastWateredAt).toISOString() : null,
              harvested: c.harvested || false
            }).catch(() => {});
          }
        }
      }
    } catch(e) {
      console.warn('Crops migration error:', e);
    }

    // 4. Migrate gyms
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gym-')) {
          const completed = localStorage.getItem(key) === 'true';
          if (completed) {
            const savedTime = localStorage.getItem(`time-${key}`);
            const completedAt = savedTime ? new Date(parseInt(savedTime)).toISOString() : new Date().toISOString();
            await toggleGym(key, true, completedAt).catch(() => {});
          }
        }
      }
    } catch(e) {
      console.warn('Gyms migration error:', e);
    }
  } catch (err) {
    console.error('Error during migration:', err);
  }
}

export function renderAuthUI(onSuccess) {
  const main = $('main');
  if (!main) return;

  const html = safeHTML`
    <div class="flex items-center justify-center min-h-[80vh] px-4">
      <div class="w-full max-w-md p-8 rounded-2xl shadow-2xl border border-os-border bg-os-surface">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-os-elevated border border-os-border mb-3 shadow-inner">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokeball" class="w-7 h-7 pokemon-sprite">
          </div>
          <div class="flex items-baseline justify-center gap-2 mb-1">
            <span class="text-3xl font-pokemon tracking-wide text-[#FFCC00]">PokéMMO</span>
            <span class="text-xs font-mono tracking-wider uppercase px-2 py-0.5 rounded bg-os-elevated border border-os-border text-os-blue font-semibold">Terminal v3.0</span>
          </div>
          <p class="text-xs text-os-muted mt-1">Cockpit de control táctico para entrenadores</p>
        </div>
        
        <form id="auth-form" class="space-y-4">
          <div id="auth-error" class="hidden p-3 text-xs rounded-lg bg-os-red/10 border border-os-red/30 text-os-red font-mono"></div>
          
          <div>
            <label class="block text-xs font-mono text-os-muted mb-1 uppercase font-semibold">Usuario o Correo</label>
            <input type="text" id="auth-email" required autocomplete="username"
              class="w-full px-3.5 py-2.5 rounded-lg text-xs font-mono bg-os-bg border border-os-border text-os-text focus:outline-none focus:border-os-blue focus:ring-2 focus:ring-os-blue/20 transition" placeholder="zedsuaj o entrenador@pokemmo.com" />
            <p class="text-[13px] text-os-muted mt-1 font-mono">Usa el mismo usuario en tu PC y móvil para sincronizar todo.</p>
          </div>
          
          <div>
            <label class="block text-xs font-mono text-os-muted mb-1 uppercase font-semibold">Contraseña</label>
            <input type="password" id="auth-password" required
              class="w-full px-3.5 py-2.5 rounded-lg text-xs font-mono bg-os-bg border border-os-border text-os-text focus:outline-none focus:border-os-blue focus:ring-2 focus:ring-os-blue/20 transition" placeholder="••••••••" />
          </div>

          <div class="flex items-center pt-1">
            <input type="checkbox" id="auth-remember" class="w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue cursor-pointer">
            <label for="auth-remember" class="ml-2 text-xs text-os-muted select-none cursor-pointer">Recordar sesión</label>
          </div>
          
          <div class="flex gap-3 pt-2">
            <button type="submit" id="btn-login" class="flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-colors hover:opacity-90 bg-blue-600 hover:bg-blue-500 text-white cursor-pointer shadow-sm">
              Iniciar Sesión
            </button>
            <button type="button" id="btn-register" class="flex-1 py-2.5 px-4 rounded-lg font-semibold text-xs transition-colors hover:bg-os-elevated border border-os-border text-os-text cursor-pointer">
              Registrarse
            </button>
          </div>

          <div class="relative flex py-2 items-center">
            <div class="flex-grow border-t border-os-border"></div>
            <span class="flex-shrink mx-3 text-[13px] font-mono uppercase text-os-muted font-bold">O sin registrarte</span>
            <div class="flex-grow border-t border-os-border"></div>
          </div>

          <button type="button" id="btn-guest" class="w-full py-2.5 px-4 rounded-lg font-medium text-xs transition-all hover:bg-os-elevated border border-os-border hover:border-os-border-strong text-os-text flex items-center justify-center gap-2 cursor-pointer shadow-sm font-mono">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/fame-checker.png" alt="Invitado" class="w-4 h-4 pokemon-sprite">
            <span>Continuar como Invitado (Guardado Local)</span>
          </button>
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
  const btnGuest = $('#btn-guest');

  const showError = (msg) => {
    errorDiv.textContent = msg;
    errorDiv.classList.remove('hidden');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');
    try {
      await login(emailInput.value, passwordInput.value);
      setGuestMode(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      showError(err.message || 'Error al iniciar sesión');
    }
  });

  btnRegister.addEventListener('click', async () => {
    if (!emailInput.value || !passwordInput.value) {
      showError('Por favor ingrese correo y contraseña para registrarse');
      return;
    }
    errorDiv.classList.add('hidden');
    try {
      await register(emailInput.value, passwordInput.value);
      setGuestMode(false);
      showError('Registro exitoso. Puede iniciar sesión.');
      errorDiv.style.color = 'var(--os-green, #10B981)';
      errorDiv.style.borderColor = 'var(--os-green, #10B981)';
      errorDiv.style.backgroundColor = 'rgba(16,185,129,0.1)';
    } catch (err) {
      showError(err.message || 'Error al registrarse');
    }
  });

  if (btnGuest) {
    btnGuest.addEventListener('click', () => {
      setGuestMode(true);
      if (onSuccess) onSuccess();
    });
  }
}

export function isGuestMode() {
  return localStorage.getItem('pokemmo_guest_mode') === 'true';
}

export function setGuestMode(val) {
  if (val) {
    localStorage.setItem('pokemmo_guest_mode', 'true');
  } else {
    localStorage.removeItem('pokemmo_guest_mode');
  }
}




