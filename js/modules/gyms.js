import { state } from '../state.js';
import { db } from '../db.js';
import { formatTime } from '../utils/format.js';
import { el } from '../utils/dom.js';

export const GYM_DATA = {
    "Teselia / Unova": [
        { name: "Ciudad Gres (Striaton): Millo/Zeo/MaÃƒÂ­z", reward: 9000 },
        { name: "Ciudad Esmalte (Nacrene): Aloe", reward: 9000 },
        { name: "Ciudad Porcelana (Castelia): Camus", reward: 9000 },
        { name: "Ciudad MayÃƒÂ³lica (Nimbasa): Camila", reward: 9000 },
        { name: "Ciudad Fayenza (Driftveil): YakÃƒÂ³n", reward: 9000 },
        { name: "Ciudad Loza (Mistralton): Gerania", reward: 9000 },
        { name: "Ciudad Teja (Icirrus): Junco", reward: 9000 },
        { name: "Ciudad CaolÃƒÂ­n (Opelucid): Lirio/Iris", reward: 9000 }
    ],
    "Kanto": [
        { name: "Ciudad Plateada (Pewter): Brock", reward: 9000 },
        { name: "Ciudad Celeste (Cerulean): Misty", reward: 9000 },
        { name: "Ciudad CarmÃƒÂ­n (Vermilion): Lt. Surge", reward: 9000 },
        { name: "Ciudad Azulona (Celadon): Erika", reward: 9000 },
        { name: "Ciudad Fucsia (Fuchsia): Koga/Sachiko", reward: 9000 },
        { name: "Ciudad AzafrÃƒÂ¡n (Saffron): Sabrina", reward: 9000 },
        { name: "Isla Canela (Cinnabar): Blaine", reward: 9000 },
        { name: "Ciudad Verde (Viridian): Giovanni/Azul", reward: 9000 }
    ],
    "Sinnoh": [
        { name: "Ciudad Pirita (Oreburgh): Roco", reward: 9000 },
        { name: "Ciudad Vetusta (Eterna): Gardenia", reward: 9000 },
        { name: "Ciudad CorazÃƒÂ³n (Hearthome): Fantina", reward: 9000 },
        { name: "Ciudad Rocavelo (Veilstone): Brega", reward: 9000 },
        { name: "Ciudad Pradera (Pastoria): Mananti", reward: 9000 },
        { name: "Ciudad Canal (Canalave): AcerÃƒÂ³n", reward: 9000 },
        { name: "Ciudad Puntaneva (Snowpoint): Inverna", reward: 9000 },
        { name: "Ciudad Marina (Sunyshore): Lectro", reward: 9000 }
    ],
    "Hoenn": [
        { name: "Ciudad FÃƒÂ©rrica (Rustboro): Petra", reward: 9000 },
        { name: "Pueblo Azuliza (Dewford): Marcial", reward: 9000 },
        { name: "Ciudad Malvalona (Mauville): Erico", reward: 9000 },
        { name: "Pueblo Lavacalda (Lavaridge): Candela", reward: 9000 },
        { name: "Ciudad Petalia (Petalburg): Norman", reward: 9000 },
        { name: "Ciudad Arborada (Fortree): Alana", reward: 9000 },
        { name: "Ciudad Algaria (Mossdeep): Vito y Leti", reward: 9000 },
        { name: "ArrecÃƒÂ­polis (Sootopolis): Plubio/Galano", reward: 9000 }
    ],
    "Johto": [
        { name: "Ciudad Malva (Violet): Pegaso", reward: 9000 },
        { name: "Pueblo Azalea (Azalea): AntÃƒÂ³n", reward: 9000 },
        { name: "Ciudad Trigal (Goldenrod): Blanca", reward: 9000 },
        { name: "Ciudad Iris (Ecruteak): Morti", reward: 9000 },
        { name: "Ciudad OrquÃƒÂ­dea (Cianwood): AnÃƒÂ­bal", reward: 9000 },
        { name: "Ciudad Olivo (Olivine): Yasmina", reward: 9000 },
        { name: "Pueblo Caoba (Mahogany): Fredo", reward: 9000 },
        { name: "Ciudad Endrino (Blackthorn): DÃƒÂ©bora", reward: 9000 }
    ]
};

export const COOLDOWN_GYM_MS = 18 * 60 * 60 * 1000;
const AMULET_DURATION_MS = 60 * 60 * 1000;

export function renderGymView() {
    return `
        <!-- Header principal de gimnasios -->
        <div class="flex flex-wrap justify-between items-end mb-6 pb-4 border-b border-os-border gap-4">
            <div>
                <h1 class="text-2xl font-semibold text-os-text flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png" class="w-8 h-8 pokemon-sprite">
                    Ruta de Gimnasios (Gym Reruns)
                </h1>
                <p class="text-sm text-os-muted mt-1">Temporizador de enfriamiento de 18 horas y calculadora de ganancias.</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
                <button id="btn-reset-gyms" class="text-xs font-mono uppercase text-os-red hover:text-white border border-os-red/30 hover:border-os-red px-3 py-1.5 transition rounded-sm">
                    Ã¢Å¡Â Ã¯Â¸Â Reiniciar Todo
                </button>
            </div>
        </div>

        <!-- DASHBOARD DE RERUNS: Ganancias, Progreso y Moneda Amuleto -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <!-- Ganancias Estimadas -->
            <div class="panel p-4 flex flex-col justify-between">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-mono uppercase tracking-widest text-os-muted">Ganancias Estimadas</span>
                    <label class="flex items-center gap-1.5 text-[10px] font-mono text-amber-400 cursor-pointer select-none">
                        <input type="checkbox" id="amuletCoinToggle" checked class="w-3.5 h-3.5 accent-amber-400">
                        Moneda Amuleto (+50%)
                    </label>
                </div>
                <div class="flex items-baseline gap-2">
                    <span id="gymEarningsTotal" class="text-2xl font-mono font-bold text-amber-400">$0</span>
                    <span class="text-xs font-mono text-os-muted">/ $540,000 mÃƒÂ¡x</span>
                </div>
                <div class="w-full bg-os-bg h-1.5 rounded-full overflow-hidden border border-os-border mt-3">
                    <div id="gymEarningsBar" class="bg-amber-400 h-full w-0 transition-all duration-500 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
                </div>
            </div>

            <!-- Progreso de LÃƒÂ­deres -->
            <div class="panel p-4 flex flex-col justify-between">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-mono uppercase tracking-widest text-os-muted">LÃƒÂ­deres Vencidos</span>
                    <span id="gymsReadyCount" class="text-[10px] font-mono text-os-green font-bold">40 Listos</span>
                </div>
                <div class="flex items-baseline gap-2">
                    <span id="gymCountText" class="text-2xl font-mono font-bold text-os-blue">0 / 40</span>
                    <span class="text-xs font-mono text-os-muted">completados</span>
                </div>
                <div class="w-full bg-os-bg h-1.5 rounded-full overflow-hidden border border-os-border mt-3">
                    <div id="gymCountBar" class="bg-os-blue h-full w-0 transition-all duration-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                </div>
            </div>

            <!-- Temporizador Moneda Amuleto (1 hora) & CompensaciÃƒÂ³n -->
            <div class="panel p-4 flex flex-col justify-between">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-mono uppercase tracking-widest text-os-muted">Temporizador Amuleto (1h)</span>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-mono text-os-muted">Compensar:</span>
                        <input type="number" id="gymCompHours" value="0" min="0" max="18" step="0.5" class="w-12 p-1 text-[10px] text-center bg-os-bg border border-os-border text-os-green font-mono rounded" title="Horas que ya pasaron desde que hiciste el rerun">
                        <span class="text-[9px] font-mono text-os-muted">h</span>
                    </div>
                </div>
                <div class="flex items-center justify-between mt-1">
                    <div>
                        <span id="amuletTimerText" class="text-2xl font-mono font-bold text-amber-400">60:00</span>
                        <p id="amuletStatusText" class="text-[10px] text-os-muted">Inactivo</p>
                    </div>
                    <div class="flex gap-2">
                        <button id="amuletBtnStart" class="px-3 py-1.5 text-xs font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500 hover:text-black transition rounded-sm">
                            Iniciar
                        </button>
                        <button id="amuletBtnReset" class="px-2 py-1.5 text-xs font-mono text-os-muted hover:text-os-red transition">
                            Ã¢â€ Âº
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONTENEDOR DE GIMNASIOS -->
        <div id="gymsContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    `;
}

export function initGyms() {
    renderGyms();
    updateGymStats();
    updateAmuletUI();
    
    document.getElementById('btn-reset-gyms')?.addEventListener('click', resetGyms);
    document.getElementById('amuletBtnStart')?.addEventListener('click', startAmuletTimer);
    document.getElementById('amuletBtnReset')?.addEventListener('click', resetAmuletTimer);
    document.getElementById('amuletCoinToggle')?.addEventListener('change', updateGymStats);
    
    // Start global timers for gyms
    setInterval(updateTimers, 1000);
}

export function renderGyms() {
    const container = document.getElementById('gymsContainer');
    if(!container) return;
    container.innerHTML = '';

    for (const [region, list] of Object.entries(GYM_DATA)) {
        const regionClean = region.replace(/[^a-zA-Z]/g, '');
        const card = document.createElement('div');
        card.className = "panel p-5 flex flex-col gap-4";

        let completedInRegion = 0;
        list.forEach((_, idx) => {
            if (localStorage.getItem(`gym-${regionClean}-${idx}`) === 'true') completedInRegion++;
        });

        let html = `
            <div class="flex items-center justify-between border-b border-os-border pb-2">
                <h2 class="text-sm font-semibold text-os-blue flex items-center gap-2">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png" class="w-5 h-5 pokemon-sprite -ml-1">
                    ${region}
                    <span class="text-[10px] font-mono font-normal text-os-muted">(${completedInRegion}/8)</span>
                </h2>
                <div class="flex gap-1.5">
                    <button data-region="${region}" data-action="mark-all" class="text-[10px] font-mono uppercase bg-os-blue/10 hover:bg-os-blue hover:text-white text-os-blue px-2 py-0.5 border border-os-blue/30 rounded transition" title="Marcar los 8 lideres con compensacion de hora">
                        Marcar Toda
                    </button>
                    <button data-region="${region}" data-action="unmark-all" class="text-[10px] font-mono uppercase bg-os-bg hover:text-os-red text-os-muted px-1.5 py-0.5 border border-os-border rounded transition" title="Desmarcar region">
                        Desmarcar
                    </button>
                </div>
            </div>
            <div class="space-y-3">
        `;

        list.forEach((gym, index) => {
            const id = `gym-${regionClean}-${index}`;
            const isChecked = localStorage.getItem(id) === 'true';
            const textClass = isChecked ? "checked-label text-os-muted line-through" : "text-os-text";
            html += `
                <div class="flex items-center justify-between group">
                    <label class="flex items-center gap-3 cursor-pointer w-3/4">
                        <input type="checkbox" id="${id}" ${isChecked ? 'checked' : ''} data-gym-id="${id}"
                               class="w-4 h-4 accent-os-red cursor-pointer gym-checkbox">
                        <span id="label-${id}" class="text-[11px] font-medium ${textClass}">${gym.name}</span>
                    </label>
                    <span id="timer-${id}" class="text-[11px] font-mono tabular-nums ${isChecked ? 'text-os-red block' : 'text-os-muted hidden'}">--:--:--</span>
                </div>`;
        });

        html += `</div>`;
        card.innerHTML = html;
        container.appendChild(card);
    }
    
    // Add event listeners for region buttons
    container.querySelectorAll('button[data-action="mark-all"]').forEach(btn => {
        btn.addEventListener('click', (e) => toggleWholeRegion(e.target.dataset.region, true));
    });
    container.querySelectorAll('button[data-action="unmark-all"]').forEach(btn => {
        btn.addEventListener('click', (e) => toggleWholeRegion(e.target.dataset.region, false));
    });
    
    // Add event listeners for individual gym checkboxes
    container.querySelectorAll('.gym-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => toggleGymState(e.target.dataset.gymId, e.target.checked));
    });
}

export function toggleGymState(id, isChecked) {
    const label = document.getElementById(`label-${id}`);
    const timerEl = document.getElementById(`timer-${id}`);
    const compHours = parseFloat(document.getElementById('gymCompHours')?.value) || 0;
    const compMs = compHours * 60 * 60 * 1000;

    if (isChecked) {
        localStorage.setItem(id, 'true');
        localStorage.setItem(`time-${id}`, Date.now() - compMs);
        if (label) {
            label.classList.add('checked-label', 'text-os-muted', 'line-through');
            label.classList.remove('text-os-text');
        }
        if (timerEl) {
            timerEl.classList.remove('hidden');
            timerEl.classList.add('block');
        }
    } else {
        localStorage.removeItem(id);
        localStorage.removeItem(`time-${id}`);
        if (label) {
            label.classList.remove('checked-label', 'text-os-muted', 'line-through');
            label.classList.add('text-os-text');
        }
        if (timerEl) {
            timerEl.classList.add('hidden');
            timerEl.classList.remove('block');
        }
    }
    updateGymStats();
    updateTimers();
}

export function toggleWholeRegion(region, checkAll) {
    const list = GYM_DATA[region] || [];
    const regionClean = region.replace(/[^a-zA-Z]/g, '');
    const compHours = parseFloat(document.getElementById('gymCompHours')?.value) || 0;
    const compMs = compHours * 60 * 60 * 1000;
    const targetTime = Date.now() - compMs;

    list.forEach((_, index) => {
        const id = `gym-${regionClean}-${index}`;
        if (checkAll) {
            localStorage.setItem(id, 'true');
            localStorage.setItem(`time-${id}`, targetTime);
        } else {
            localStorage.removeItem(id);
            localStorage.removeItem(`time-${id}`);
        }
    });

    renderGyms();
    updateGymStats();
    updateTimers();
}

export function updateGymStats() {
    let completedCount = 0;
    let baseEarnings = 0;
    const totalLeaders = 40;
    let maxBaseEarnings = 0;

    for (const [region, list] of Object.entries(GYM_DATA)) {
        const regionClean = region.replace(/[^a-zA-Z]/g, '');
        list.forEach((gym, idx) => {
            maxBaseEarnings += gym.reward;
            if (localStorage.getItem(`gym-${regionClean}-${idx}`) === 'true') {
                completedCount++;
                baseEarnings += gym.reward;
            }
        });
    }

    const readyCount = totalLeaders - completedCount;
    const useAmulet = document.getElementById('amuletCoinToggle')?.checked ?? true;
    const multiplier = useAmulet ? 1.5 : 1.0;
    const earnings = Math.round(baseEarnings * multiplier);
    const maxEarnings = Math.round(maxBaseEarnings * multiplier);

    const countTextEl = document.getElementById('gymCountText');
    const countBarEl = document.getElementById('gymCountBar');
    const earningsTextEl = document.getElementById('gymEarningsTotal');
    const earningsBarEl = document.getElementById('gymEarningsBar');
    const readyCountEl = document.getElementById('gymsReadyCount');

    if (countTextEl) countTextEl.innerText = `${completedCount} / ${totalLeaders}`;
    if (countBarEl) countBarEl.style.width = `${(completedCount / totalLeaders) * 100}%`;
    if (earningsTextEl) earningsTextEl.innerText = `$${earnings.toLocaleString()}`;
    if (earningsBarEl) earningsBarEl.style.width = `${(completedCount / totalLeaders) * 100}%`;
    if (readyCountEl) {
        readyCountEl.innerText = `${readyCount} Listos para Rerun`;
        readyCountEl.className = readyCount > 0 ? "text-[10px] font-mono text-os-green font-bold" : "text-[10px] font-mono text-os-muted";
    }
}

export function resetGyms() {
    if (confirm('Ã‚Â¿Borrar TODO el progreso de gimnasios?')) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith('gym-') || key.startsWith('time-gym-'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        renderGyms();
        updateGymStats();
    }
}

export function startAmuletTimer() {
    localStorage.setItem('pokemmo_amulet_start', Date.now());
    localStorage.setItem('pokemmo_amulet_duration', AMULET_DURATION_MS);
    updateAmuletUI();
}

export function resetAmuletTimer() {
    localStorage.removeItem('pokemmo_amulet_start');
    localStorage.removeItem('pokemmo_amulet_duration');
    updateAmuletUI();
}

export function updateAmuletUI() {
    const start = parseInt(localStorage.getItem('pokemmo_amulet_start'));
    const timerEl = document.getElementById('amuletTimerText');
    const statusEl = document.getElementById('amuletStatusText');
    const btnEl = document.getElementById('amuletBtnStart');

    if (!start || isNaN(start)) {
        if (timerEl) timerEl.innerText = '60:00';
        if (statusEl) statusEl.innerText = 'Inactivo';
        if (btnEl) {
            btnEl.innerText = 'Iniciar';
            btnEl.className = 'px-3 py-1.5 text-xs font-mono uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500 hover:text-black transition rounded-sm';
        }
        return;
    }

    const elapsed = Date.now() - start;
    const remaining = AMULET_DURATION_MS - elapsed;

    if (remaining <= 0) {
        if (timerEl) {
            timerEl.innerText = 'Ã‚Â¡AGOTADO!';
            timerEl.className = 'text-2xl font-mono font-bold text-os-red animate-pulse';
        }
        if (statusEl) statusEl.innerText = 'Bono de dinero terminado';
        if (btnEl) btnEl.innerText = 'Reiniciar';
    } else {
        const m = Math.floor(remaining / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        if (timerEl) {
            timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            timerEl.className = 'text-2xl font-mono font-bold text-amber-400';
        }
        if (statusEl) statusEl.innerText = 'Ã°Å¸Âªâ„¢ Bono +50% activo';
        if (btnEl) {
            btnEl.innerText = 'Activo';
            btnEl.className = 'px-3 py-1.5 text-xs font-mono uppercase bg-amber-500 text-black font-bold border border-amber-500 rounded-sm';
        }
    }
}

export function _formatTimeStr(ms) {
    if (ms <= 0) return "00:00:00";
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function updateTimers() {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('time-gym-')) {
            const id = key.substring(5);
            const savedTime = parseInt(localStorage.getItem(key));
            const remaining = COOLDOWN_GYM_MS - (now - savedTime);
            const timerEl = document.getElementById(`timer-${id}`);
            
            if (remaining <= 0) {
                localStorage.removeItem(id);
                localStorage.removeItem(key);
                if (timerEl) {
                    const cb = document.getElementById(id);
                    if (cb) cb.checked = false;
                    const label = document.getElementById(`label-${id}`);
                    if (label) {
                        label.classList.remove('checked-label', 'text-os-muted', 'line-through');
                        label.classList.add('text-os-text');
                    }
                    timerEl.classList.remove('block');
                    timerEl.classList.add('hidden');
                }
            } else if (timerEl) {
                // If formatTime from format.js is available we can use it, else use local one
                const fmt = (typeof formatTime === 'function') ? formatTime(remaining) : _formatTimeStr(remaining);
                timerEl.innerText = fmt;
            }
        }
    }
    // Amulet timer update
    const amuletStart = parseInt(localStorage.getItem('pokemmo_amulet_start'));
    if (amuletStart && !isNaN(amuletStart)) {
        updateAmuletUI();
    }
}

