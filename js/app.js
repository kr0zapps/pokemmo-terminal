// js/app.js - PokéMMO Terminal v3.0 Entry Point

import { supabase } from './db.js';
import { getSession, onAuthStateChange, renderAuthUI, migrateLocalStorage, logout, isGuestMode, setGuestMode } from './auth.js';
import { loadInitialState, state } from './state.js';
import { initRealtimeSync, renderSyncBadge } from './sync.js';
import { switchTab, initRouter } from './router.js';
import * as gyms from './modules/gyms.js';
import * as berries from './modules/berries.js';
import * as pokedex from './modules/pokedex.js';
import { getPokeMMOClock } from './utils/pokemmo-time.js';

// Attach UI functions to window for inline HTML onclick handlers
window.switchTab = switchTab;
window.logout = logout;
window.showAuthModal = () => {
    setGuestMode(false);
    isAppInitialized = false;
    isAppInitializing = false;
    renderAuthUI(initApp);
};
Object.assign(window, gyms, berries, pokedex);

let isAppInitialized = false;
let isAppInitializing = false;

async function initApp() {
    if (isAppInitializing || isAppInitialized) return;
    isAppInitializing = true;

    try {
        await migrateLocalStorage();
        await loadInitialState();

    const main = document.getElementById('app-main');
    
    // Inject views
    let viewsHtml = '';
    if (gyms.renderGymView) viewsHtml += `<div id="view-gyms" class="block animate-fade-in">${gyms.renderGymView()}</div>`;
    if (berries.renderBerryView) viewsHtml += berries.renderBerryView();
    if (pokedex.renderPokédexView) viewsHtml += pokedex.renderPokédexView();
    
    // Attempt dynamic breeding import
    let breedingModule = null;
    try {
        const breeding = await import('./modules/breeding.js');
        if (breeding.renderBreedingView) {
            viewsHtml += breeding.renderBreedingView();
        }
        Object.assign(window, breeding);
        if (breeding.renderEggGroupModal) {
            document.body.insertAdjacentHTML('beforeend', breeding.renderEggGroupModal());
        }
        breedingModule = breeding;
    } catch(e) {
        console.warn('Breeding module not yet available', e);
        viewsHtml += `<div id="view-breeding" class="hidden animate-fade-in"><div class="panel p-6 text-center text-os-muted">Módulo de Crianza en construcción...</div></div>`;
    }

    main.innerHTML = viewsHtml;

    // Inject modals
    if (berries.renderWaterModal) document.body.insertAdjacentHTML('beforeend', berries.renderWaterModal());
    if (pokedex.renderCaughtModal) document.body.insertAdjacentHTML('beforeend', pokedex.renderCaughtModal());

    // Initialize modules
    if (gyms.initGyms) gyms.initGyms();
    if (berries.initBerries) berries.initBerries();
    if (pokedex.initPokédex) pokedex.initPokédex();
    if (breedingModule && breedingModule.initBreeding) breedingModule.initBreeding();

    initRouter();
    initRealtimeSync();

    // Update Header
    updateHeaderAuth();
    isAppInitialized = true;
  } finally {
    isAppInitializing = false;
  }
}

// Theme Manager (Modo Claro / Modo Oscuro)
export function initTheme() {
    const saved = localStorage.getItem('pokemmo_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved ? saved : (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}

export function applyTheme(theme) {
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    const themeText = document.getElementById('themeToggleText');
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        if (sunIcon) sunIcon.classList.remove('hidden');
        if (moonIcon) moonIcon.classList.add('hidden');
        if (themeText) themeText.textContent = 'Claro';
    } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        if (sunIcon) sunIcon.classList.add('hidden');
        if (moonIcon) moonIcon.classList.remove('hidden');
        if (themeText) themeText.textContent = 'Oscuro';
    }
    localStorage.setItem('pokemmo_theme', theme);
}

window.toggleTheme = function() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
};

async function updateHeaderAuth() {
    const authArea = document.getElementById('auth-area');
    if (!authArea) return;
    
    const session = await getSession();
    if (session) {
        const rawEmail = session.user.email || '';
        const userDisplay = rawEmail.includes('@pokemmo.app') ? rawEmail.split('@')[0] : rawEmail;

        authArea.innerHTML = `
            <div class="flex items-center gap-2 bg-[#D8D3C3] dark:bg-[#2E2E28] border border-[#2B2B2B] dark:border-[#4A4A42] px-2.5 sm:px-3 py-1 rounded shadow-inner">
                <span class="font-tech font-bold text-[10px] text-[#5F5A4D] dark:text-[#B5B1A4]">ID Entrenador:</span>
                <span class="font-mono font-bold text-xs text-[#1C1C17] dark:text-[#F4F1E8] tracking-wider bg-[#EDE8D8] dark:bg-[#1E1E1A] px-1.5 py-0.5 rounded border border-[#81765F]/40 dark:border-[#4A4A42]">${userDisplay}</span>
                <span class="text-[#81765F] dark:text-[#666] text-[10px]">|</span>
                <button onclick="logout()" class="font-tech font-bold text-[10px] text-[#b7102a] dark:text-[#FFA8A8] hover:underline uppercase cursor-pointer" title="Cerrar sesión">Cerrar sesión</button>
            </div>
            <div id="sync-badge-container" class="hidden sm:block">
                ${renderSyncBadge()}
            </div>
        `;
        
        // Listen to sync status changes to update the badge
        document.addEventListener('syncStatusChanged', () => {
            const container = document.getElementById('sync-badge-container');
            if (container) container.innerHTML = renderSyncBadge();
        });
    } else if (isGuestMode()) {
        authArea.innerHTML = `
            <div class="flex items-center gap-1.5 sm:gap-2">
                <div class="flex items-center gap-1.5 bg-[#D8D3C3] dark:bg-[#2E2E28] border border-[#2B2B2B] dark:border-[#4A4A42] px-2.5 py-1 rounded shadow-inner">
                    <span class="font-tech font-bold text-[10px] text-[#5F5A4D] dark:text-[#B5B1A4]">Modo:</span>
                    <span class="font-mono font-bold text-[11px] text-[#5C3800] dark:text-[#FFDF92] bg-[#FFDF92] dark:bg-[#473200] px-1.5 py-0.5 rounded border border-[#755B00]/40">Invitado</span>
                </div>
                <button onclick="window.showAuthModal()" class="text-[10px] sm:text-[11px] text-[#241A00] bg-[#FFC800] hover:bg-[#ffe066] border-2 border-[#2B2B2B] px-2.5 py-1 rounded shadow-[1px_2px_0px_#2B2B2B] active:translate-y-0.5 font-tech uppercase font-bold flex items-center gap-1 cursor-pointer" title="Inicia sesión para sincronizar tu progreso entre PC y móvil">
                    <svg class="w-3.5 h-3.5 text-[#241A00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    <span>Sincronizar</span>
                </button>
            </div>
        `;
    } else {
        authArea.innerHTML = '';
    }
}

export function initPokeMMOClock() {
    function tick() {
        const clock = getPokeMMOClock();
        
        // Reloj digital en juego en el encabezado
        const clockEl = document.getElementById('headerInGameClock');
        if (clockEl) clockEl.textContent = clock.timeStr;

        // Badge de Fase del Día (Mañana / Día / Noche)
        const phaseBadge = document.getElementById('headerDayPhaseBadge');
        const phaseIcon = document.getElementById('headerDayPhaseIcon');
        const phaseText = document.getElementById('headerDayPhaseText');
        if (phaseBadge && phaseText) {
            phaseBadge.className = `flex items-center gap-1 font-tech text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${clock.phaseBadgeClass}`;
            if (phaseIcon) phaseIcon.innerHTML = clock.phaseIconSvg;
            phaseText.textContent = clock.phase;
            phaseBadge.title = `Fase en PokéMMO: ${clock.phase}`;
        }

        // Badge de Estación Oficial (Primavera / Verano / Otoño / Invierno)
        const seasonBadge = document.getElementById('headerSeasonBadge');
        const seasonIcon = document.getElementById('headerSeasonIcon');
        const seasonText = document.getElementById('headerSeasonText');
        if (seasonBadge && seasonText) {
            seasonBadge.className = `flex items-center gap-1 font-tech text-[10px] font-bold px-2 py-0.5 rounded shadow-sm ${clock.seasonBadgeClass}`;
            if (seasonIcon) seasonIcon.innerHTML = clock.seasonIconSvg;
            seasonText.textContent = clock.season;
            seasonBadge.title = `Estación en PokéMMO: ${clock.season} (${clock.seasonDesc})`;
        }

        // Temporizador de reinicio de ciclo de 6 horas en el pie de página
        const footerReset = document.getElementById('footerResetTimer');
        if (footerReset) {
            footerReset.textContent = clock.timeUntilResetStr;
        }
    }

    tick();
    setInterval(tick, 1000);
}

async function main() {
    initTheme();
    initPokeMMOClock();
    const session = await getSession();
    if (!session && !isGuestMode()) {
        renderAuthUI(initApp);
    } else {
        await initApp();
    }

    onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            setGuestMode(false);
            if (!isAppInitialized) initApp();
        } else if (event === 'SIGNED_OUT') {
            setGuestMode(false);
            isAppInitialized = false;
            isAppInitializing = false;
            const main = document.getElementById('app-main');
            if (main) main.innerHTML = '';
            renderAuthUI(initApp);
            const authArea = document.getElementById('auth-area');
            if (authArea) authArea.innerHTML = '';
            
            // Clean up old modals if any exist (to avoid duplicates on re-login)
            document.querySelectorAll('.modal-injected').forEach(el => el.remove());
        }
    });
}

// Start app
document.addEventListener('DOMContentLoaded', main);

