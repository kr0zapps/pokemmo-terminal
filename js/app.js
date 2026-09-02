// js/app.js - PokeMMO Terminal v3.0 Entry Point

import { supabase } from './db.js';
import { getSession, onAuthStateChange, renderAuthUI, migrateLocalStorage, logout } from './auth.js';
import { loadInitialState, state } from './state.js';
import { initRealtimeSync, renderSyncBadge } from './sync.js';
import { switchTab, initRouter } from './router.js';
import * as gyms from './modules/gyms.js';
import * as berries from './modules/berries.js';
import * as pokedex from './modules/pokedex.js';

// Attach UI functions to window for inline HTML onclick handlers
window.switchTab = switchTab;
window.logout = logout;
Object.assign(window, gyms, berries, pokedex);

async function initApp() {
    await migrateLocalStorage();
    await loadInitialState();

    const main = document.getElementById('app-main');
    
    // Inject views
    let viewsHtml = '';
    if (gyms.renderGymView) viewsHtml += `<div id="view-gyms" class="block animate-fade-in">${gyms.renderGymView()}</div>`;
    if (berries.renderBerryView) viewsHtml += berries.renderBerryView();
    if (pokedex.renderPokedexView) viewsHtml += pokedex.renderPokedexView();
    
    // Attempt dynamic breeding import
    try {
        const breeding = await import('./modules/breeding.js');
        if (breeding.renderBreedingView) {
            viewsHtml += breeding.renderBreedingView();
        }
        Object.assign(window, breeding);
        if (breeding.initBreeding) breeding.initBreeding();
        if (breeding.renderEggGroupModal) {
            document.body.insertAdjacentHTML('beforeend', breeding.renderEggGroupModal());
        }
    } catch(e) {
        console.warn('Breeding module not yet available');
        viewsHtml += `<div id="view-breeding" class="hidden animate-fade-in"><div class="panel p-6 text-center text-os-muted">MÃ³dulo de Crianza en construcciÃ³n...</div></div>`;
    }

    main.innerHTML = viewsHtml;

    // Inject modals
    if (berries.renderWaterModal) document.body.insertAdjacentHTML('beforeend', berries.renderWaterModal());
    if (pokedex.renderCaughtModal) document.body.insertAdjacentHTML('beforeend', pokedex.renderCaughtModal());

    // Initialize modules
    if (gyms.initGyms) gyms.initGyms();
    if (berries.initBerries) berries.initBerries();
    if (pokedex.initPokedex) pokedex.initPokedex();

    initRouter();
    initRealtimeSync();

    // Update Header
    updateHeaderAuth();
}

async function updateHeaderAuth() {
    const authArea = document.getElementById('auth-area');
    if (!authArea) return;
    
    const session = await getSession();
    if (session) {
        authArea.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="hidden md:flex flex-col text-right">
                    <span class="text-xs text-os-muted">${session.user.email}</span>
                    <button onclick="logout()" class="text-[10px] text-os-red hover:text-white text-right transition font-mono uppercase">Cerrar SesiÃ³n</button>
                </div>
                <div id="sync-badge-container" class="panel px-3 py-1.5 rounded-sm">
                    ${renderSyncBadge()}
                </div>
            </div>
        `;
        
        // Listen to sync status changes to update the badge
        document.addEventListener('syncStatusChanged', () => {
            const container = document.getElementById('sync-badge-container');
            if (container) container.innerHTML = renderSyncBadge();
        });
    } else {
        authArea.innerHTML = '';
    }
}

async function main() {
    const session = await getSession();
    if (!session) {
        renderAuthUI(initApp);
    } else {
        await initApp();
    }

    onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            initApp();
        } else if (event === 'SIGNED_OUT') {
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
