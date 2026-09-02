// js/app.js - PokéMMO Terminal v3.0 Entry Point

import { supabase } from './db.js';
import { getSession, onAuthStateChange, renderAuthUI, migrateLocalStorage, logout, isGuestMode, setGuestMode } from './auth.js';
import { loadInitialState, state } from './state.js';
import { initRealtimeSync, renderSyncBadge } from './sync.js';
import { switchTab, initRouter } from './router.js';
import * as gyms from './modules/gyms.js';
import * as berries from './modules/berries.js';
import * as pokedex from './modules/pokedex.js';

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

async function updateHeaderAuth() {
    const authArea = document.getElementById('auth-area');
    if (!authArea) return;
    
    const session = await getSession();
    if (session) {
        authArea.innerHTML = `
            <div class="flex items-center gap-2 sm:gap-4">
                <div class="flex flex-col items-end text-right">
                    <span class="hidden md:inline text-xs text-os-muted">${session.user.email}</span>
                    <button onclick="logout()" class="text-[11px] text-os-red hover:text-white border border-os-red/30 hover:border-os-red px-2 py-0.5 rounded transition font-mono uppercase font-semibold">Cerrar Sesión</button>
                </div>
                <div id="sync-badge-container" class="hidden sm:block panel px-3 py-1.5 rounded-sm">
                    ${renderSyncBadge()}
                </div>
            </div>
        `;
        
        // Listen to sync status changes to update the badge
        document.addEventListener('syncStatusChanged', () => {
            const container = document.getElementById('sync-badge-container');
            if (container) container.innerHTML = renderSyncBadge();
        });
    } else if (isGuestMode()) {
        authArea.innerHTML = `
            <div class="flex items-center gap-2 sm:gap-3">
                <span class="text-[11px] font-mono text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-sm">
                    🎮 Invitado (Local)
                </span>
                <button onclick="window.showAuthModal()" class="text-[11px] text-os-blue hover:text-white border border-os-blue/40 hover:bg-os-blue px-2 py-0.5 rounded transition font-mono uppercase font-semibold">
                    Iniciar Sesión
                </button>
            </div>
        `;
    } else {
        authArea.innerHTML = '';
    }
}

async function main() {
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

