import { state } from '../state.js';
import { formatTime } from '../utils/format.js';
import { toggleGym, resetAllGyms } from '../db.js';
export const GYM_DATA = {
    "Teselia / Unova": [
        { name: "Ciudad Gres (Striaton): Millo/Zeo/Maíz", reward: 9000 },
        { name: "Ciudad Esmalte (Nacrene): Aloe", reward: 9000 },
        { name: "Ciudad Porcelana (Castelia): Camus", reward: 9000 },
        { name: "Ciudad Mayólica (Nimbasa): Camila", reward: 9000 },
        { name: "Ciudad Fayenza (Driftveil): Yakón", reward: 9000 },
        { name: "Ciudad Loza (Mistralton): Gerania", reward: 9000 },
        { name: "Ciudad Teja (Icirrus): Junco", reward: 9000 },
        { name: "Ciudad Caolín (Opelucid): Lirio/Iris", reward: 9000 }
    ],
    "Kanto": [
        { name: "Ciudad Plateada (Pewter): Brock", reward: 9000 },
        { name: "Ciudad Celeste (Cerulean): Misty", reward: 9000 },
        { name: "Ciudad Carmín (Vermilion): Lt. Surge", reward: 9000 },
        { name: "Ciudad Azulona (Celadon): Erika", reward: 9000 },
        { name: "Ciudad Fucsia (Fuchsia): Koga/Sachiko", reward: 9000 },
        { name: "Ciudad Azafrán (Saffron): Sabrina", reward: 9000 },
        { name: "Isla Canela (Cinnabar): Blaine", reward: 9000 },
        { name: "Ciudad Verde (Viridian): Giovanni/Azul", reward: 9000 }
    ],
    "Sinnoh": [
        { name: "Ciudad Pirita (Oreburgh): Roco", reward: 9000 },
        { name: "Ciudad Vetusta (Eterna): Gardenia", reward: 9000 },
        { name: "Ciudad Corazón (Hearthome): Fantina", reward: 9000 },
        { name: "Ciudad Rocavelo (Veilstone): Brega", reward: 9000 },
        { name: "Ciudad Pradera (Pastoria): Mananti", reward: 9000 },
        { name: "Ciudad Canal (Canalave): Acerón", reward: 9000 },
        { name: "Ciudad Puntaneva (Snowpoint): Inverna", reward: 9000 },
        { name: "Ciudad Marina (Sunyshore): Lectro", reward: 9000 }
    ],
    "Hoenn": [
        { name: "Ciudad Férrica (Rustboro): Petra", reward: 9000 },
        { name: "Pueblo Azuliza (Dewford): Marcial", reward: 9000 },
        { name: "Ciudad Malvalona (Mauville): Erico", reward: 9000 },
        { name: "Pueblo Lavacalda (Lavaridge): Candela", reward: 9000 },
        { name: "Ciudad Petalia (Petalburg): Norman", reward: 9000 },
        { name: "Ciudad Arborada (Fortree): Alana", reward: 9000 },
        { name: "Ciudad Algaria (Mossdeep): Vito y Leti", reward: 9000 },
        { name: "Arrecípolis (Sootopolis): Plubio/Galano", reward: 9000 }
    ],
    "Johto": [
        { name: "Ciudad Malva (Violet): Pegaso", reward: 9000 },
        { name: "Pueblo Azalea (Azalea): Antón", reward: 9000 },
        { name: "Ciudad Trigal (Goldenrod): Blanca", reward: 9000 },
        { name: "Ciudad Iris (Ecruteak): Morti", reward: 9000 },
        { name: "Ciudad Orquídea (Cianwood): Aníbal", reward: 9000 },
        { name: "Ciudad Olivo (Olivine): Yasmina", reward: 9000 },
        { name: "Pueblo Caoba (Mahogany): Fredo", reward: 9000 },
        { name: "Ciudad Endrino (Blackthorn): Débora", reward: 9000 }
    ]
};

export const COOLDOWN_GYM_MS = 18 * 60 * 60 * 1000;
const AMULET_DURATION_MS = 60 * 60 * 1000;

export function renderGymView() {
    return `
        <!-- TOP SECTION: PAYOUT FLOATING TELEMETRY & AMULET LCD COOLDOWN -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-4">
            <!-- (A) PAYOUT: ULTRA DOMINANT (>72px), FLOATING DIRECTLY ON CHASSIS -->
            <div class="lg:col-span-7 relative flex flex-col justify-between py-2 px-1">
                <!-- Technical Inset Line with Sentence Case & Dash -->
                <div class="w-full h-1 bg-[#D8D4C7] border-b border-white mb-3 flex items-center justify-between">
                    <div class="w-16 h-1 bg-[#2B2B2B]"></div>
                    <span class="font-['Space_Mono'] text-[10px] text-[#81765F] font-bold tracking-wide bg-[#F4F1E8] px-2">Gross arbitrage protocol — yield</span>
                    <div class="w-28 h-1 bg-[#FFC800]"></div>
                </div>
                <!-- Header Row with Toggle Switch -->
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="font-['Space_Grotesk'] font-bold text-xs tracking-wide text-[#5F5A4D]">Session revenue estimate</span>
                        <span class="w-2 h-2 rounded-full bg-[#526600]"></span>
                    </div>
                    <!-- Tactile Mechanical Slide Toggle: Amulet coin +50% active -->
                    <label class="flex items-center gap-2 bg-[#E2DDCF] border-2 border-[#2B2B2B] px-3 py-1.5 rounded-lg shadow-sm cursor-pointer select-none">
                        <span class="font-['Space_Grotesk'] font-extrabold text-[11px] tracking-wide text-[#2B2B2B]">Amulet coin +50% active</span>
                        <input type="checkbox" id="amuletCoinToggle" checked class="sr-only">
                        <div id="amuletToggleKnob" class="w-11 h-6 bg-[#2B2B2B] rounded-full p-0.5 flex items-center transition-all shadow-inner">
                            <div class="w-5 h-5 rounded-full bg-[#FFC800] border border-[#2B2B2B] transform translate-x-5 transition-transform shadow-md flex items-center justify-center">
                                <div class="w-1.5 h-1.5 rounded-full bg-[#2B2B2B]"></div>
                            </div>
                        </div>
                    </label>
                </div>
                <!-- ULTRA DOMINANT PAYOUT NUMBER -->
                <div class="my-2 relative flex flex-col">
                    <div class="flex items-baseline gap-2 flex-wrap">
                        <span class="font-['Space_Grotesk'] font-black text-6xl sm:text-7xl lg:text-[84px] leading-none text-[#1C1C17] tracking-tight drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]" id="gymEarningsTotal">
                            $0
                        </span>
                        <span class="font-['Space_Mono'] font-black text-2xl lg:text-3xl text-[#755B00] tracking-wider">
                            Poké$
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-xs font-['Space_Mono'] font-bold text-[#5F5A4D] mt-1 flex-wrap">
                        <span class="bg-[#E4DFD0] px-2 py-0.5 rounded border border-[#81765F]/30" id="payoutBaseText">Base: $0</span>
                        <span class="text-[#2B2B2B] font-black">+</span>
                        <span class="bg-[#FFDF92] text-[#6E5500] px-2 py-0.5 rounded border border-[#755B00]/40 font-black" id="payoutBonusText">Bonus: +$0</span>
                        <span class="text-[#526600] font-black tracking-wide ml-auto">● Realtime auto-ledger</span>
                    </div>
                </div>
                <!-- Recessed Gauge Bar -->
                <div class="w-full bg-[#E5E0D0] h-2.5 rounded-full overflow-hidden border border-[#2B2B2B] shadow-inner mt-2">
                    <div id="gymEarningsBar" class="h-full bg-[#FFC800] w-0 border-r border-[#2B2B2B] transition-all duration-500"></div>
                </div>
            </div>

            <!-- (B) AMULET COOLDOWN: INCUBATED BEVELED LCD WITH OLIVE/DARK PIXELS (#9BBC0F / #0F380F) -->
            <div class="lg:col-span-5 bg-[#2B2B2B] p-3 md:p-4 rounded-xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_6px_0px_#1A1A18] relative flex flex-col justify-between border-2 border-[#1A1A18]">
                <!-- Screws -->
                <div class="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#444] border border-[#222] flex items-center justify-center">
                    <div class="w-1.5 h-0.5 bg-[#888] rotate-45"></div>
                </div>
                <div class="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#444] border border-[#222] flex items-center justify-center">
                    <div class="w-1.5 h-0.5 bg-[#888] -rotate-45"></div>
                </div>
                <div class="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#444] border border-[#222] flex items-center justify-center">
                    <div class="w-1.5 h-0.5 bg-[#888] -rotate-12"></div>
                </div>
                <div class="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#444] border border-[#222] flex items-center justify-center">
                    <div class="w-1.5 h-0.5 bg-[#888] rotate-90"></div>
                </div>

                <div class="flex items-center justify-between mb-1.5 px-1">
                    <span class="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#A8A495] tracking-wider flex items-center gap-1.5">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png" class="w-4 h-4 pokemon-sprite" alt="">
                        Amulet Coin Telemetry
                    </span>
                    <div class="flex items-center gap-1">
                        <span class="text-[9px] font-['Space_Mono'] text-[#A8A495]">Comp:</span>
                        <input type="number" id="gymCompHours" value="0" min="0" max="18" step="0.5" class="w-10 p-0.5 text-[10px] text-center bg-[#1C1C17] border border-[#444] text-[#9BBC0F] font-mono rounded" title="Horas de compensación previa">
                        <span class="text-[9px] font-['Space_Mono'] text-[#A8A495]">h</span>
                    </div>
                </div>

                <!-- The Real Olive Green Game Boy LCD Screen -->
                <div class="lcd-screen-gb p-3 rounded border-2 border-[#181816] flex flex-col justify-between my-1">
                    <div class="flex justify-between text-[10px] font-bold opacity-80 border-b border-[#0F380F]/30 pb-1">
                        <span>AMULET 1H RUNTIME</span>
                        <span id="amuletStatusText">INACTIVO</span>
                    </div>
                    <div class="flex items-baseline justify-between my-2">
                        <span id="amuletTimerText" class="text-4xl font-black tracking-widest leading-none">60:00</span>
                        <span class="text-xs font-bold uppercase tracking-wider">+50% BUFF</span>
                    </div>
                    <div class="flex justify-between text-[9px] font-bold opacity-75 pt-1 border-t border-[#0F380F]/30">
                        <span>RELOAD: 18H GYM CYCLE</span>
                        <span>SILPH-BUS: SYNCED</span>
                    </div>
                </div>

                <!-- Control Buttons -->
                <div class="flex items-center justify-between mt-2 pt-1 gap-2">
                    <button id="amuletBtnStart" class="flex-1 py-1.5 bg-[#FFC800] text-[#241A00] hover:bg-[#FFE066] border-2 border-[#181816] font-['Space_Grotesk'] font-black text-xs uppercase tracking-wider rounded shadow-[1px_2px_0px_#181816] active:translate-y-0.5 cursor-pointer">
                        Iniciar Cronómetro
                    </button>
                    <button id="amuletBtnReset" class="px-3 py-1.5 bg-[#3B3B3B] text-[#A8A495] hover:text-white border-2 border-[#181816] font-mono text-xs rounded hover:bg-[#4B4B4B] cursor-pointer" title="Reiniciar">
                        Reset
                    </button>
                </div>
            </div>
        </div>

        <!-- COMBAT HP BAR: GYM TARGETS SYSTEM -->
        <section class="w-full bg-[#E5E0D0] border-2 border-[#2B2B2B] rounded-xl p-3 md:p-4 shadow-[2px_3px_0px_#2B2B2B] flex flex-col gap-2.5 mb-6">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <span class="font-['Space_Grotesk'] font-bold text-sm text-[#1C1C17] tracking-wide">Total gym target clearance (daily 24h cycle)</span>
                </div>
                <div class="flex items-center gap-3 font-['Space_Mono'] font-bold text-xs">
                    <span class="text-[#2B2B2B]">Active combat: <strong id="gymsReadyCount" class="text-[#526600]">40</strong> / 40 ready</span>
                    <span id="gymsCooldownBadge" class="bg-[#D2CDBC] px-2 py-0.5 rounded border border-[#2B2B2B]/40 text-[#b7102a]">0 cooldown</span>
                </div>
            </div>
            <!-- The Wide Combat Health Gauge -->
            <div class="relative w-full h-8 bg-[#2B2B2B] rounded-md p-1 border-2 border-[#181816] shadow-inner flex items-center">
                <div class="w-full h-full rounded bg-[#1C1C17] overflow-hidden flex relative">
                    <div id="gymHpReadyBar" class="h-full w-[100%] bg-gradient-to-r from-[#9BBC0F] via-[#CDF14B] to-[#FFC800] rounded-l flex items-center justify-end pr-2 transition-all duration-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.6)]">
                        <span id="gymHpClearanceText" class="font-['Space_Mono'] font-black text-xs text-[#241A00] tracking-wider">100% ready</span>
                    </div>
                    <div id="gymHpCooldownBar" class="h-full w-[0%] bg-[#4B1218] flex items-center justify-center transition-all duration-500">
                        <span class="font-['Space_Mono'] font-bold text-[10px] text-[#FFA8A8] tracking-wider">Cooldown</span>
                    </div>
                </div>
                <div class="absolute inset-x-1 inset-y-1 pointer-events-none grid grid-cols-8 divide-x-2 divide-[#2B2B2B]/70">
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
            </div>
            <!-- Subtext Route Bar -->
            <div class="flex flex-wrap items-center justify-between text-[11px] font-['Space_Mono'] text-[#5F5A4D] pt-0.5">
                <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-[#755B00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    Optimal re-run sequence: <strong>Celadon &gt; Saffron &gt; Vermilion &gt; Cerulean &gt; Fuchsia</strong>
                </span>
                <button id="btn-reset-gyms" class="font-bold text-[#b7102a] hover:underline cursor-pointer uppercase text-[10px] tracking-wider">
                    [ Reset All Gyms ]
                </button>
            </div>
        </section>

        <!-- REGIONAL CIRCUIT DECK CONTAINER -->
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                    <span class="font-['Space_Grotesk'] font-black text-base text-[#1C1C17] tracking-wide">Regional circuit deck</span>
                    <span class="font-['Space_Mono'] text-[10px] bg-[#E2DDCF] border border-[#2B2B2B] px-1.5 py-0.5 rounded font-bold">Asymmetric loadout</span>
                </div>
                <span class="font-['Space_Mono'] text-xs font-bold text-[#526600]">VS-Seeker synchronized</span>
            </div>

            <!-- Kanto Top Deck -->
            <div id="kantoDeckContainer"></div>

            <!-- Subordinated Regions Deck -->
            <div id="subRegionsDeckContainer" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"></div>
        </div>
    `;
}

export function initGyms() {
    // 1. Sync from state.gyms (which loadInitialState fetched from Supabase)
    if (state.gyms && Array.isArray(state.gyms) && state.gyms.length > 0) {
        state.gyms.forEach(g => {
            const key = g.gym_id.startsWith('gym-') ? g.gym_id : `gym-${g.gym_id}`;
            if (g.completed) {
                localStorage.setItem(key, 'true');
                if (g.completed_at) {
                    localStorage.setItem(`time-${key}`, new Date(g.completed_at).getTime());
                }
            } else {
                localStorage.removeItem(key);
                localStorage.removeItem(`time-${key}`);
            }
        });
    }

    renderGyms();
    updateGymStats();
    updateAmuletUI();
    
    document.getElementById('btn-reset-gyms')?.addEventListener('click', resetGyms);
    document.getElementById('amuletBtnStart')?.addEventListener('click', startAmuletTimer);
    document.getElementById('amuletBtnReset')?.addEventListener('click', resetAmuletTimer);
    
    // Amulet Toggle handler with animated knob
    const amuletToggle = document.getElementById('amuletCoinToggle');
    if (amuletToggle) {
        amuletToggle.addEventListener('change', () => {
            const knob = document.getElementById('amuletToggleKnob')?.firstElementChild;
            if (knob) {
                if (amuletToggle.checked) {
                    knob.classList.add('translate-x-5');
                    knob.classList.remove('translate-x-0');
                } else {
                    knob.classList.remove('translate-x-5');
                    knob.classList.add('translate-x-0');
                }
            }
            updateGymStats();
        });
    }
    
    // Listen for realtime cross-device gym updates
    document.addEventListener('gymUpdated', (e) => {
        const payload = e.detail;
        if (payload && payload.new) {
            const row = payload.new;
            const key = row.gym_id.startsWith('gym-') ? row.gym_id : `gym-${row.gym_id}`;
            if (row.completed) {
                localStorage.setItem(key, 'true');
                if (row.completed_at) {
                    localStorage.setItem(`time-${key}`, new Date(row.completed_at).getTime());
                }
            } else {
                localStorage.removeItem(key);
                localStorage.removeItem(`time-${key}`);
            }
            renderGyms();
            updateGymStats();
            updateTimers();
        }
    });

    // Start global timers for gyms
    setInterval(updateTimers, 1000);
}

export function renderGyms() {
    const kantoContainer = document.getElementById('kantoDeckContainer');
    const subContainer = document.getElementById('subRegionsDeckContainer');
    if (!kantoContainer || !subContainer) return;

    kantoContainer.innerHTML = '';
    subContainer.innerHTML = '';

    for (const [regionName, list] of Object.entries(GYM_DATA)) {
        const cleanRegion = regionName.replace(/[^a-zA-Z]/g, '');
        let completedInRegion = 0;
        list.forEach((_, idx) => {
            if (localStorage.getItem(`gym-${cleanRegion}-${idx}`) === 'true') completedInRegion++;
        });
        const isRegionCleared = completedInRegion === list.length;

        if (regionName === 'Kanto') {
            // Render KANTO FULL WIDTH 8-COL HORIZONTAL LEADER STRIP
            kantoContainer.innerHTML = `
                <div class="w-full bg-[#FAF8F2] border-[3px] border-[#2B2B2B] rounded-2xl p-4 shadow-[4px_5px_0px_#2B2B2B] relative overflow-hidden flex flex-col justify-between">
                    <!-- Corner Rivets -->
                    <div class="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#D8D4C7] border border-[#2B2B2B] flex items-center justify-center">
                        <div class="w-1.5 h-0.5 bg-[#2B2B2B]"></div>
                    </div>
                    <div class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#D8D4C7] border border-[#2B2B2B] flex items-center justify-center">
                        <div class="w-1.5 h-0.5 bg-[#2B2B2B]"></div>
                    </div>
                    
                    <!-- Physical Rotated Inked Stamp -->
                    ${isRegionCleared ? `
                        <div class="absolute right-6 top-6 z-20 pointer-events-none stamp-cleared bg-[#FAF8F2]/95 px-3 py-1 font-['Space_Mono'] font-black text-xs md:text-sm tracking-widest shadow-sm">
                            ★ VERIFIED CLEARED ★
                        </div>
                    ` : `
                        <div class="absolute right-6 top-6 z-20 pointer-events-none stamp-progress bg-[#FAF8F2]/95 px-2.5 py-0.5 font-['Space_Mono'] font-bold text-[10px] md:text-xs tracking-tight shadow-sm">
                            PENDING ${list.length - completedInRegion}/${list.length}
                        </div>
                    `}

                    <!-- Kanto Header -->
                    <div class="flex flex-wrap items-center justify-between border-b-2 border-[#2B2B2B] pb-2 mb-3 gap-2">
                        <div class="flex items-center gap-2">
                            <span class="bg-[#FFC800] text-[#241A00] font-['Space_Grotesk'] font-black text-xs px-2 py-0.5 rounded border border-[#2B2B2B]">R-01</span>
                            <span class="font-['Space_Grotesk'] font-black text-base md:text-lg text-[#1C1C17]">Kanto League</span>
                            <span class="font-['Space_Grotesk'] font-bold text-[11px] text-[#755B00] bg-[#FFDF92] px-2 py-0.5 rounded">Home circuit</span>
                        </div>
                        <div class="flex items-center gap-1.5 z-10 mr-0 sm:mr-36">
                            <button data-region="${regionName}" data-action="mark-all" class="text-[10px] font-mono uppercase bg-[#2B2B2B] text-white hover:bg-[#444] px-2.5 py-1 rounded font-bold transition cursor-pointer">
                                Completar
                            </button>
                            <button data-region="${regionName}" data-action="unmark-all" class="text-[10px] font-mono uppercase bg-[#E4DFD0] text-[#5F5A4D] hover:text-[#b7102a] border border-[#2B2B2B] px-2 py-1 rounded transition cursor-pointer">
                                Reset
                            </button>
                        </div>
                    </div>

                    <!-- All 8 Kanto Leaders in a SINGLE HORIZONTAL ROW of 8 Columns -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 z-10">
                        ${list.map((gym, idx) => {
                            const id = `gym-${cleanRegion}-${idx}`;
                            const isChecked = localStorage.getItem(id) === 'true';
                            const [city, leader] = gym.name.includes(':') ? gym.name.split(':') : [gym.name, ''];
                            return `
                                <div class="leader-tile bg-[#F0ECE1] border border-[#2B2B2B] p-2 rounded-lg flex flex-col justify-between cursor-pointer hover:border-[#FFC800] transition select-none ${isChecked ? 'ring-1 ring-[#2B2B2B]' : ''}" data-gym-id="${id}">
                                    <div class="flex items-center justify-between">
                                        <span class="w-4 h-4 rounded-full ${isChecked ? 'bg-[#526600]' : 'bg-[#2B2B2B]'} text-white text-[9px] font-black flex items-center justify-center">${idx + 1}</span>
                                        <span id="timer-${id}" class="font-['Space_Mono'] text-[9px] font-bold ${isChecked ? 'text-[#b7102a]' : 'text-[#526600]'}">
                                            ${isChecked ? '--:--:--' : 'Ready'}
                                        </span>
                                    </div>
                                    <span id="label-${id}" class="font-['Space_Grotesk'] font-bold text-xs text-[#1C1C17] mt-1.5 truncate ${isChecked ? 'line-through text-[#81765F]' : ''}">
                                        ${leader ? leader.trim() : city.trim()}
                                    </span>
                                    <span class="font-['Space_Mono'] text-[8px] text-[#81765F] truncate">${city.replace(/\(.*?\)/, '').trim()}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        } else {
            // Subordinated Region Card (Unova, Sinnoh, Hoenn, Johto)
            const regionNumber = regionName.includes('Teselia') ? 'R-02' : regionName.includes('Sinnoh') ? 'R-03' : regionName.includes('Hoenn') ? 'R-04' : 'R-05';
            const card = document.createElement('div');
            card.className = "bg-[#F6F4EB] border-2 border-[#2B2B2B] rounded-xl p-3 shadow-[2px_3px_0px_#2B2B2B] relative overflow-hidden flex flex-col justify-between";
            card.innerHTML = `
                <!-- Dynamic Stamp -->
                ${isRegionCleared ? `
                    <div class="absolute -right-2 top-6 z-20 pointer-events-none stamp-cleared bg-[#F6F4EB]/95 px-2 py-0.5 font-['Space_Mono'] font-bold text-[10px] tracking-tight shadow-sm">
                        ★ VERIFIED ★
                    </div>
                ` : `
                    <div class="absolute -right-2 top-6 z-20 pointer-events-none stamp-progress bg-[#F6F4EB]/90 px-2 py-0.5 font-['Space_Mono'] font-bold text-[10px] tracking-tight shadow-sm">
                        PENDING ${list.length - completedInRegion}/${list.length}
                    </div>
                `}

                <div class="flex items-center justify-between border-b border-[#2B2B2B]/30 pb-1.5 mb-2">
                    <div class="flex items-center gap-1.5">
                        <span class="bg-[#E4DFD0] text-[#2B2B2B] font-['Space_Grotesk'] font-bold text-[10px] px-1.5 py-0.5 rounded border border-[#2B2B2B]">${regionNumber}</span>
                        <span class="font-['Space_Grotesk'] font-bold text-xs text-[#1C1C17]">${regionName}</span>
                    </div>
                    <div class="flex items-center gap-1 z-10 mr-16">
                        <button data-region="${regionName}" data-action="mark-all" class="text-[9px] font-mono uppercase bg-[#2B2B2B] text-white hover:bg-[#444] px-2 py-0.5 rounded transition cursor-pointer font-bold">
                            Completar
                        </button>
                        <button data-region="${regionName}" data-action="unmark-all" class="text-[9px] font-mono uppercase bg-[#E4DFD0] text-[#5F5A4D] hover:text-[#b7102a] border border-[#2B2B2B]/40 px-1.5 py-0.5 rounded transition cursor-pointer">
                            Reset
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-1.5 text-[11px] z-10">
                    ${list.map((gym, idx) => {
                        const id = `gym-${cleanRegion}-${idx}`;
                        const isChecked = localStorage.getItem(id) === 'true';
                        const [city, leader] = gym.name.includes(':') ? gym.name.split(':') : [gym.name, ''];
                        return `
                            <div class="leader-tile ${isChecked ? 'bg-[#FFDFDE] border border-[#E63946]/30' : 'bg-[#EDE9DE]'} p-1.5 rounded flex justify-between items-center cursor-pointer hover:border-[#FFC800] transition select-none" data-gym-id="${id}">
                                <span id="label-${id}" class="font-medium truncate mr-1 text-[11px] ${isChecked ? 'text-[#7A131C] line-through' : 'text-[#1C1C17]'}">
                                    ${leader ? leader.trim() : city.trim()}
                                </span>
                                <span id="timer-${id}" class="font-['Space_Mono'] text-[8px] font-bold ${isChecked ? 'text-[#E63946]' : 'text-[#526600]'}">
                                    ${isChecked ? '--:--:--' : 'Ready'}
                                </span>
                            </div>
                        `;
                    }).join('')}
                </div>

                <div class="mt-2 pt-1.5 border-t border-[#D8D4C7] flex items-center justify-between font-['Space_Mono'] text-[9px] text-[#81765F]">
                    <span>${completedInRegion}/${list.length} completados</span>
                    <span class="text-[#526600] font-bold">Circuit active</span>
                </div>
            `;
            subContainer.appendChild(card);
        }
    }

    // Attach click handlers to leader tiles
    document.querySelectorAll('.leader-tile').forEach(tile => {
        tile.addEventListener('click', (e) => {
            const gymId = tile.dataset.gymId;
            const currentlyChecked = localStorage.getItem(gymId) === 'true';
            toggleGymState(gymId, !currentlyChecked);
        });
    });

    // Attach mark-all and unmark-all handlers
    document.querySelectorAll('button[data-action="mark-all"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWholeRegion(btn.dataset.region, true);
        });
    });
    document.querySelectorAll('button[data-action="unmark-all"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleWholeRegion(btn.dataset.region, false);
        });
    });
}

export function toggleGymState(id, isChecked) {
    const label = document.getElementById(`label-${id}`);
    const timerEl = document.getElementById(`timer-${id}`);
    const compHours = parseFloat(document.getElementById('gymCompHours')?.value) || 0;
    const compMs = compHours * 60 * 60 * 1000;
    const targetTimestamp = Date.now() - compMs;

    if (isChecked) {
        localStorage.setItem(id, 'true');
        localStorage.setItem(`time-${id}`, targetTimestamp);
    } else {
        localStorage.removeItem(id);
        localStorage.removeItem(`time-${id}`);
    }
    renderGyms();
    updateGymStats();
    updateTimers();

    // Async sync to Supabase in background
    try {
        const completedAt = isChecked ? new Date(targetTimestamp).toISOString() : null;
        toggleGym(id, isChecked, completedAt).catch(err => {
            console.warn('Could not sync gym to Supabase:', err);
        });
    } catch(err) {
        console.warn('Error initiating gym sync:', err);
    }
}

export function toggleWholeRegion(regionName, checkAll) {
    const list = GYM_DATA[regionName] || [];
    const cleanRegion = regionName.replace(/[^a-zA-Z]/g, '');
    const compHours = parseFloat(document.getElementById('gymCompHours')?.value) || 0;
    const compMs = compHours * 60 * 60 * 1000;
    const targetTime = Date.now() - compMs;
    const completedAt = checkAll ? new Date(targetTime).toISOString() : null;

    list.forEach((_, index) => {
        const id = `gym-${cleanRegion}-${index}`;
        if (checkAll) {
            localStorage.setItem(id, 'true');
            localStorage.setItem(`time-${id}`, targetTime);
        } else {
            localStorage.removeItem(id);
            localStorage.removeItem(`time-${id}`);
        }
        toggleGym(id, checkAll, completedAt).catch(() => {});
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

    for (const [regionName, list] of Object.entries(GYM_DATA)) {
        const cleanRegion = regionName.replace(/[^a-zA-Z]/g, '');
        list.forEach((gym, idx) => {
            maxBaseEarnings += gym.reward;
            if (localStorage.getItem(`gym-${cleanRegion}-${idx}`) === 'true') {
                completedCount++;
                baseEarnings += gym.reward;
            }
        });
    }

    const readyCount = totalLeaders - completedCount;
    const useAmulet = document.getElementById('amuletCoinToggle')?.checked ?? true;
    const multiplier = useAmulet ? 1.5 : 1.0;
    const earnings = Math.round(baseEarnings * multiplier);
    const bonus = earnings - baseEarnings;

    const earningsTextEl = document.getElementById('gymEarningsTotal');
    const payoutBaseEl = document.getElementById('payoutBaseText');
    const payoutBonusEl = document.getElementById('payoutBonusText');
    const earningsBarEl = document.getElementById('gymEarningsBar');
    
    const readyCountEl = document.getElementById('gymsReadyCount');
    const cooldownBadgeEl = document.getElementById('gymsCooldownBadge');
    const hpReadyBarEl = document.getElementById('gymHpReadyBar');
    const hpCooldownBarEl = document.getElementById('gymHpCooldownBar');
    const hpClearanceTextEl = document.getElementById('gymHpClearanceText');

    if (earningsTextEl) earningsTextEl.innerText = `$${earnings.toLocaleString()}`;
    if (payoutBaseEl) payoutBaseEl.innerText = `Base: $${baseEarnings.toLocaleString()}`;
    if (payoutBonusEl) payoutBonusEl.innerText = `Bonus: +$${bonus.toLocaleString()}`;
    if (earningsBarEl) earningsBarEl.style.width = `${(completedCount / totalLeaders) * 100}%`;

    const readyPct = Math.round((readyCount / totalLeaders) * 100);
    const cooldownPct = 100 - readyPct;

    if (readyCountEl) readyCountEl.innerText = `${readyCount}`;
    if (cooldownBadgeEl) cooldownBadgeEl.innerText = `${completedCount} cooldown`;
    if (hpReadyBarEl) hpReadyBarEl.style.width = `${readyPct}%`;
    if (hpCooldownBarEl) hpCooldownBarEl.style.width = `${cooldownPct}%`;
    if (hpClearanceTextEl) hpClearanceTextEl.innerText = `${readyPct}% ready`;
}

export function resetGyms() {
    if (confirm('¿Borrar TODO el progreso de gimnasios?')) {
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

        // Sync reset to Supabase
        resetAllGyms().catch(err => console.warn('Could not reset gyms on Supabase:', err));
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
        if (statusEl) statusEl.innerText = 'INACTIVO';
        if (btnEl) {
            btnEl.innerText = 'Iniciar Cronómetro';
            btnEl.className = 'flex-1 py-1.5 bg-[#FFC800] text-[#241A00] hover:bg-[#FFE066] border-2 border-[#181816] font-[\'Space_Grotesk\'] font-black text-xs uppercase tracking-wider rounded shadow-[1px_2px_0px_#181816] active:translate-y-0.5 cursor-pointer';
        }
        return;
    }

    const elapsed = Date.now() - start;
    const remaining = AMULET_DURATION_MS - elapsed;

    if (remaining <= 0) {
        if (timerEl) {
            timerEl.innerText = 'AGOTADO';
            timerEl.className = 'text-3xl font-black text-[#E63946] animate-pulse';
        }
        if (statusEl) statusEl.innerText = 'BUFF FINALIZADO';
        if (btnEl) btnEl.innerText = 'Reiniciar';
    } else {
        const m = Math.floor(remaining / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        if (timerEl) {
            timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            timerEl.className = 'text-4xl font-black tracking-widest leading-none';
        }
        if (statusEl) statusEl.innerText = 'BUFF ACTIVO';
        if (btnEl) {
            btnEl.innerText = 'En Curso (Activo)';
            btnEl.className = 'flex-1 py-1.5 bg-[#526600] text-white border-2 border-[#181816] font-[\'Space_Grotesk\'] font-black text-xs uppercase tracking-wider rounded shadow-[1px_2px_0px_#181816]';
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
                    timerEl.innerText = 'Ready';
                    timerEl.className = "font-['Space_Mono'] text-[9px] font-bold text-[#526600]";
                    const label = document.getElementById(`label-${id}`);
                    if (label) {
                        label.classList.remove('line-through', 'text-[#81765F]', 'text-os-muted');
                        label.classList.add('text-[#1C1C17]');
                    }
                }
            } else if (timerEl) {
                const fmt = (typeof formatTime === 'function') ? formatTime(remaining) : _formatTimeStr(remaining);
                timerEl.innerText = fmt;
                timerEl.className = "font-['Space_Mono'] text-[9px] font-bold text-[#b7102a]";
            }
        }
    }
    // Amulet timer update
    const amuletStart = parseInt(localStorage.getItem('pokemmo_amulet_start'));
    if (amuletStart && !isNaN(amuletStart)) {
        updateAmuletUI();
    }
}


