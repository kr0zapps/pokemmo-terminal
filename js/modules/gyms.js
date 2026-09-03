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
        <!-- SECCIÓN SUPERIOR: TELEMETRÍA DE INGRESOS & CRONÓMETRO LCD AMULETO -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-4">
            <!-- (A) INGRESOS: ULTRA DOMINANTE, FLOTANDO EN EL CHASIS -->
            <div class="lg:col-span-7 relative flex flex-col justify-between py-2 px-1">
                <!-- Línea Técnica con Título en Español -->
                <div class="w-full h-1 bg-[#D8D4C7] dark:bg-[#3A3A34] border-b border-white/20 mb-3 flex items-center justify-between">
                    <div class="w-16 h-1 bg-[#2B2B2B] dark:bg-[#FFC800]"></div>
                    <span class="font-mono text-[13px] text-[#5F5A4D] dark:text-[#A8A594] font-bold tracking-wide bg-[#F4F1E8] dark:bg-[#1A1A16] px-2">Estimación de ganancias de circuito</span>
                    <div class="w-28 h-1 bg-[#FFC800]"></div>
                </div>
                <!-- Fila de Encabezado con Interruptor Deslizante -->
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-2">
                        <span class="font-tech font-bold text-xs tracking-wide text-[#5F5A4D] dark:text-[#A8A594]">Estimado de ingresos</span>
                    </div>
                    <!-- Interruptor Deslizante Mecánico: Moneda Amuleto +50% activa -->
                    <label class="flex items-center gap-2 bg-[#E2DDCF] dark:bg-[#242420] border-2 border-[#2B2B2B] dark:border-[#35352E] px-3 py-1.5 rounded-lg shadow-sm cursor-pointer select-none">
                        <span class="font-tech font-extrabold text-[13px] tracking-wide text-[#2B2B2B] dark:text-[#F4F1E8]">Moneda Amuleto +50% activa</span>
                        <input type="checkbox" id="amuletCoinToggle" checked class="sr-only">
                        <div id="amuletToggleKnob" class="w-11 h-6 bg-[#2B2B2B] dark:bg-[#161614] rounded-full p-0.5 flex items-center transition-all shadow-inner">
                            <div class="w-5 h-5 rounded-full bg-[#FFC800] border border-[#2B2B2B] transform translate-x-5 transition-transform shadow-md flex items-center justify-center">
                                <div class="w-1.5 h-1.5 rounded-full bg-[#2B2B2B]"></div>
                            </div>
                        </div>
                    </label>
                </div>
                <!-- CIFRA ULTRA DOMINANTE DE GANANCIAS -->
                <div class="my-2 relative flex flex-col overflow-hidden">
                    <div class="flex items-baseline gap-2 flex-wrap">
                        <span class="font-tech font-black text-4xl xs:text-5xl sm:text-7xl lg:text-[84px] leading-none text-[#1C1C17] dark:text-[#F4F1E8] tracking-tight" id="gymEarningsTotal">
                            $0
                        </span>
                        <span class="font-tech font-extrabold text-2xl lg:text-3xl text-[#755B00] dark:text-[#FFC800] tracking-wide">
                            Poké$
                        </span>
                    </div>
                    <div class="flex items-center gap-2 text-[13px] font-mono font-bold text-[#5F5A4D] dark:text-[#A8A594] mt-1 flex-wrap">
                        <span class="bg-[#E4DFD0] dark:bg-[#242420] px-2 py-0.5 rounded border border-[#81765F]/30 dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8]" id="payoutBaseText">Base: $0</span>
                        <span class="text-[#2B2B2B] dark:text-[#F4F1E8] font-black">+</span>
                        <span class="bg-[#FFDF92] dark:bg-[#473200] text-[#5C3800] dark:text-[#FFDF92] px-2 py-0.5 rounded border border-[#755B00]/40 font-black" id="payoutBonusText">Bono: +$0</span>
                    </div>
                </div>
                <!-- Barra Recesiva de Progreso -->
                <div class="w-full bg-[#E5E0D0] dark:bg-[#22221D] h-2.5 rounded-full overflow-hidden border border-[#2B2B2B] dark:border-[#35352E] shadow-inner mt-2">
                    <div id="gymEarningsBar" class="h-full bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#10B981] w-0 border-r border-[#2B2B2B] transition-all duration-500"></div>
                </div>
            </div>

            <!-- (B) CRONÓMETRO AMULETO: PANTALLA LCD GAME BOY VERDE OLIVA (#9BBC0F / #0F380F) -->
            <div class="lg:col-span-5 bg-[#2B2B2B] dark:bg-[#1E1E1A] p-3 md:p-4 rounded-xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_6px_0px_#1A1A18] relative flex flex-col justify-between border-2 border-[#1A1A18] dark:border-[#33332D]">
                <!-- Tornillos Esquineros -->
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

                <div class="flex items-center justify-between mb-2 px-1">
                    <span class="font-tech text-[14px] uppercase font-bold text-[#1C1C17] dark:text-[#F4F1E8] tracking-wider flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png" class="w-5 h-5 pokemon-sprite" alt="">
                        Cronómetro de Moneda Amuleto
                    </span>
                    <span class="font-mono text-[13px] text-[#1B5E20] dark:text-[#10B981] font-bold">1 HORA</span>
                </div>

                <!-- Pantalla LCD Verde Fósforo (Siempre activa con el mismo brillo retro) -->
                <div class="lcd-screen-gb p-3 rounded border-2 border-[#181816] flex flex-col justify-between my-1">
                    <div class="flex justify-between text-[13px] font-bold opacity-80 border-b border-[#0F380F]/30 pb-1">
                        <span>DURACIÓN AMULETO 1H</span>
                        <span id="amuletStatusText">INACTIVO</span>
                    </div>
                    <div class="flex items-baseline justify-between my-2">
                        <span id="amuletTimerText" class="text-4xl font-black tracking-widest leading-none font-lcd">60:00</span>
                        <span class="text-[13px] font-bold uppercase tracking-wider font-tech">+50% BONO</span>
                    </div>
                    <div class="flex justify-between text-[13px] font-bold opacity-75 pt-1 border-t border-[#0F380F]/30">
                        <span>RECARGA: CICLO 18H</span>
                        <span>ESTADO: LISTO</span>
                    </div>
                </div>

                <!-- Botones de Control con touch target mínimo 44px -->
                <div class="flex items-center justify-between mt-2 pt-1 gap-2">
                    <button id="amuletBtnStart" class="flex-1 min-h-[44px] py-2 px-3 bg-[#FFC800] text-[#241A00] hover:bg-[#FFE066] border-2 border-[#181816] font-tech font-black text-[13px] uppercase tracking-wider rounded-lg shadow-[1px_2px_0px_#181816] active:translate-y-0.5 cursor-pointer flex items-center justify-center">
                        Iniciar cronómetro
                    </button>
                    <button id="amuletBtnReset" class="min-h-[44px] px-3.5 py-2 bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] border-2 border-[#2B2B2B] dark:border-[#35352E] font-tech font-bold text-[13px] rounded-lg cursor-pointer flex items-center justify-center shadow-sm" title="Reiniciar cronómetro">
                        Reiniciar
                    </button>
                </div>
            </div>
        </div>

        <!-- BARRA DE SALUD DE COMBATE: SISTEMA DE OBJETIVOS DE GIMNASIO -->
        <section class="w-full bg-[#E5E0D0] dark:bg-[#242420] border-2 border-[#2B2B2B] dark:border-[#35352E] rounded-xl p-3 md:p-4 shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000] flex flex-col gap-2.5 mb-6 transition-colors">
            <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <span class="font-tech font-bold text-sm text-[#1C1C17] dark:text-[#F4F1E8] tracking-wide">Despeje total de gimnasios (ciclo diario 24h)</span>
                </div>
                <div class="flex items-center gap-3 font-mono font-bold text-xs">
                    <span class="text-[#2B2B2B] dark:text-[#F4F1E8]">Combate activo: <strong id="gymsReadyCount" class="text-[#1B5E20] dark:text-[#C3F400]">40</strong> / 40 listos</span>
                    <span id="gymsCooldownBadge" class="bg-[#D2CDBC] dark:bg-[#2E2E27] px-2 py-0.5 rounded border border-[#2B2B2B]/40 dark:border-[#35352E] text-[#5F5A4D] dark:text-[#A8A594]">0 en enfriamiento</span>
                </div>
            </div>
            <!-- Medidor de Combate Segmentado en 8 partes -->
            <div class="relative w-full h-8 bg-[#2B2B2B] dark:bg-[#161614] rounded-md p-1 border-2 border-[#181816] dark:border-[#35352E] shadow-inner flex items-center">
                <div class="w-full h-full rounded bg-[#1C1C17] overflow-hidden flex relative">
                    <div id="gymHpReadyBar" class="h-full w-[100%] bg-gradient-to-r from-[#9BBC0F] via-[#CDF14B] to-[#FFC800] rounded-l flex items-center justify-end pr-2 transition-all duration-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.6)]">
                        <span id="gymHpClearanceText" class="font-mono font-black text-xs text-[#241A00] tracking-wider">100% listos</span>
                    </div>
                    <div id="gymHpCooldownBar" class="h-full w-[0%] bg-[#3D1B1E] flex items-center justify-center transition-all duration-500">
                        <span class="font-mono font-bold text-[13px] text-[#FFA8A8] tracking-wider">Enfriamiento</span>
                    </div>
                </div>
                <div class="absolute inset-x-1 inset-y-1 pointer-events-none grid grid-cols-8 divide-x-2 divide-[#2B2B2B]/70 dark:divide-[#161614]">
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div>
            </div>
            <!-- Barra de Ruta Óptima -->
            <div class="flex flex-wrap items-center justify-between text-[13px] font-mono text-[#5F5A4D] dark:text-[#A8A594] pt-0.5">
                <span class="flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-[#755B00] dark:text-[#FFC800]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    Secuencia óptima de rutas: <strong class="text-[#1C1C17] dark:text-[#F4F1E8]">Azulona &gt; Azafrán &gt; Carmín &gt; Celeste &gt; Fucsia</strong>
                </span>
                <button id="btn-reset-gyms" class="font-bold text-[#b7102a] dark:text-[#FFA8A8] hover:underline cursor-pointer uppercase text-[13px] tracking-wider">
                    [ Reiniciar todos los gimnasios ]
                </button>
            </div>
        </section>

        <!-- MAZO DE CIRCUITOS REGIONALES -->
        <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between px-1">
                <div class="flex items-center gap-2">
                    <span class="font-tech font-black text-base text-[#1C1C17] dark:text-[#F4F1E8] tracking-wide">Mazo de circuitos regionales</span>
                    <span class="font-mono text-[13px] bg-[#E2DDCF] dark:bg-[#242420] border border-[#2B2B2B] dark:border-[#35352E] px-1.5 py-0.5 rounded font-bold text-[#5F5A4D] dark:text-[#A8A594]">Carga asimétrica</span>
                </div>
                <span class="font-mono text-xs font-bold text-[#1B5E20] dark:text-[#C3F400]">VS-Buscador sincronizado</span>
            </div>

            <!-- Tarjeta Principal de Kanto -->
            <div id="kantoDeckContainer"></div>

            <!-- Regiones Subordinadas -->
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
    
    // Manejador de interruptor amuleto con perilla animada
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
    
    // Escuchar actualizaciones en tiempo real entre dispositivos
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

    // Iniciar temporizador global de gimnasios
    setInterval(updateTimers, 1000);
}

export let focusedRegion = localStorage.getItem('pokemmo_focused_region') || 'Kanto';

export function setFocusedRegion(regionName) {
    if (!GYM_DATA[regionName]) return;
    focusedRegion = regionName;
    localStorage.setItem('pokemmo_focused_region', regionName);
    renderGyms();
    updateTimers();
    
    // Suave desplazamiento hacia la tarjeta grande
    const container = document.getElementById('kantoDeckContainer');
    if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
window.setFocusedRegion = setFocusedRegion;

export function getRegionCode(name) {
    if (name.includes('Kanto')) return 'R-01';
    if (name.includes('Teselia') || name.includes('Unova')) return 'R-02';
    if (name.includes('Sinnoh')) return 'R-03';
    if (name.includes('Hoenn')) return 'R-04';
    if (name.includes('Johto')) return 'R-05';
    return 'R-00';
}

export const OPTIMAL_ROUTES = {
    "Kanto": "Azulona > Azafrán > Carmín > Celeste > Fucsia",
    "Teselia / Unova": "Gres > Esmalte > Porcelana > Mayólica > Fayenza > Loza > Teja > Caolín",
    "Sinnoh": "Pirita > Vetusta > Corazón > Rocavelo > Pradera > Canal > Puntaneva > Marina",
    "Hoenn": "Férrica > Azuliza > Malvalona > Lavacalda > Petalia > Arborada > Algaria > Arrecípolis",
    "Johto": "Malva > Azalea > Trigal > Iris > Orquídea > Olivo > Caoba > Endrino"
};

export function renderGyms() {
    const kantoContainer = document.getElementById('kantoDeckContainer');
    const subContainer = document.getElementById('subRegionsDeckContainer');
    if (!kantoContainer || !subContainer) return;

    // Si la región en foco guardada no existe, volver a Kanto por defecto
    if (!GYM_DATA[focusedRegion]) {
        focusedRegion = 'Kanto';
    }

    // Actualizar texto de secuencia óptima de rutas según la región en foco
    const optimalRouteEl = document.getElementById('gymOptimalRouteText');
    if (optimalRouteEl) {
        optimalRouteEl.textContent = OPTIMAL_ROUTES[focusedRegion] || OPTIMAL_ROUTES['Kanto'];
    }

    kantoContainer.innerHTML = '';
    subContainer.innerHTML = '';

    // 1. RENDERIZAR LA REGIÓN EN FOCO EN EL PANEL GRANDE (COCKPIT PRINCIPAL)
    const focusedList = GYM_DATA[focusedRegion] || [];
    const cleanFocusedRegion = focusedRegion.replace(/[^a-zA-Z]/g, '');
    let focusedCompleted = 0;
    focusedList.forEach((_, idx) => {
        if (localStorage.getItem(`gym-${cleanFocusedRegion}-${idx}`) === 'true') focusedCompleted++;
    });
    const isFocusedCleared = focusedCompleted === focusedList.length;
    const focusedProgressPct = Math.round((focusedCompleted / focusedList.length) * 100);
    const focusedRegionNumber = getRegionCode(focusedRegion);

    kantoContainer.innerHTML = `
        <div class="w-full bg-[#FAF8F2] dark:bg-[#242420] border-[3px] border-[#2B2B2B] dark:border-[#35352E] rounded-2xl p-4 shadow-[4px_5px_0px_#2B2B2B] dark:shadow-[4px_5px_0px_#000] relative overflow-hidden flex flex-col justify-between transition-colors animate-fade-in">
            <!-- Remaches Esquineros -->
            <div class="absolute top-2 left-2 w-2.5 h-2.5 rounded-full bg-[#D8D4C7] dark:bg-[#3E3E36] border border-[#2B2B2B] dark:border-[#35352E] flex items-center justify-center">
                <div class="w-1.5 h-0.5 bg-[#2B2B2B] dark:bg-[#20201C]"></div>
            </div>
            <div class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#D8D4C7] dark:bg-[#3E3E36] border border-[#2B2B2B] dark:border-[#35352E] flex items-center justify-center">
                <div class="w-1.5 h-0.5 bg-[#2B2B2B] dark:bg-[#20201C]"></div>
            </div>
            
            <!-- Sello Dinámico Físico Rotado -->
            ${isFocusedCleared ? `
                <div class="absolute right-4 sm:right-6 top-4 sm:top-6 z-20 pointer-events-none stamp-cleared bg-[#FAF8F2]/95 dark:bg-[#242420]/95 px-3 py-1 font-mono font-black text-xs md:text-sm tracking-widest shadow-sm">
                    ★ COMPLETADO Y VERIFICADO ★
                </div>
            ` : `
                <div class="absolute right-4 sm:right-6 top-4 sm:top-6 z-20 pointer-events-none stamp-progress bg-[#FAF8F2]/95 dark:bg-[#242420]/95 px-2.5 py-0.5 font-mono font-bold text-[13px] md:text-xs tracking-tight shadow-sm">
                    PENDIENTE ${focusedList.length - focusedCompleted}/${focusedList.length}
                </div>
            `}

            <!-- Encabezado de Región Principal en Foco -->
            <div class="flex flex-wrap items-center justify-between border-b-2 border-[#2B2B2B] dark:border-[#35352E] pb-2 mb-3 gap-2">
                <div class="flex items-center gap-2">
                    <span class="bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] font-tech font-bold text-[13px] px-2 py-0.5 rounded border border-[#2B2B2B] dark:border-[#35352E]">${focusedRegionNumber}</span>
                    <span class="font-tech font-black text-base md:text-lg text-[#1C1C17] dark:text-[#F4F1E8]">Liga de ${focusedRegion}</span>
                    <span class="font-tech font-bold text-[13px] text-[#5C3800] dark:text-[#FFDF92] bg-[#FFDF92] dark:bg-[#473200] px-2 py-0.5 rounded">Circuito en foco</span>
                </div>
                <div class="flex items-center gap-1.5 z-10 mr-0 sm:mr-36 flex-wrap">
                    <button data-region="${focusedRegion}" data-action="mark-all" class="text-[13px] font-tech uppercase bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#10B981] border border-[#2B2B2B] dark:border-[#35352E] px-3 py-2 rounded-lg font-bold transition cursor-pointer min-h-[44px] flex items-center justify-center shadow-sm" title="Marcar todos los líderes de esta región como completados">
                        ${isFocusedCleared ? 'Completado ✓' : 'Completar circuito'}
                    </button>
                    <button data-region="${focusedRegion}" data-action="unmark-all" class="text-[13px] font-tech uppercase bg-[#E4DFD0] dark:bg-[#2E2E27] text-[#2B2B2B] dark:text-[#F4F1E8] hover:text-[#b7102a] dark:hover:text-[#FFA8A8] border border-[#2B2B2B] dark:border-[#35352E] px-3 py-2 rounded-lg transition cursor-pointer min-h-[44px] flex items-center justify-center shadow-sm" title="Reiniciar circuito de ${focusedRegion}">
                        Reiniciar
                    </button>
                </div>
            </div>

            <!-- Cuadrícula de los 8 Líderes en Vista Amplia Horizontal (Con nombres de gimnasio y ciudades) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 z-10">
                ${focusedList.map((gym, idx) => {
                    const id = `gym-${cleanFocusedRegion}-${idx}`;
                    const isChecked = localStorage.getItem(id) === 'true';
                    const [city, leader] = gym.name.includes(':') ? gym.name.split(':') : [gym.name, ''];
                    return `
                        <div class="leader-tile ${isChecked ? 'bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B]/40 dark:border-[#35352E]' : 'bg-[#F0ECE1] dark:bg-[#242420] border border-[#2B2B2B] dark:border-[#35352E]'} p-2.5 rounded-xl flex flex-col justify-between cursor-pointer hover:border-[#FFC800] transition select-none min-h-[76px]" data-gym-id="${id}">
                            <div class="flex items-center justify-between">
                                ${isChecked ? `
                                    <span class="w-4 h-4 rounded-full bg-[#1B5E20]/15 dark:bg-[#C3F400]/20 text-[#1B5E20] dark:text-[#C3F400] text-[13px] font-bold flex items-center justify-center">✓</span>
                                ` : `
                                    <span class="w-4 h-4 rounded-full bg-[#2B2B2B] dark:bg-[#3E3E36] text-white text-[13px] font-black flex items-center justify-center">${idx + 1}</span>
                                `}
                                <span id="timer-${id}" class="font-mono text-[13px] ${isChecked ? 'text-[#5F5A4D] dark:text-[#A8A594] font-medium' : 'text-[#1B5E20] dark:text-[#C3F400] font-bold'}">
                                    ${isChecked ? '--:--:--' : 'Listo'}
                                </span>
                            </div>
                            <div class="mt-1.5 flex flex-col overflow-hidden">
                                <span id="label-${id}" class="font-tech font-bold text-[14px] truncate leading-tight ${isChecked ? 'text-[#5F5A4D] dark:text-[#A8A594]' : 'text-[#1C1C17] dark:text-[#F4F1E8]'}">
                                    ${leader ? leader.trim() : city.trim()}
                                </span>
                                <span class="font-sans text-[13px] text-[#5F5A4D] dark:text-[#A8A594] truncate leading-tight mt-0.5 font-medium" title="${city.trim()}">
                                    ${city.replace(/\(.*?\)/, '').trim()}
                                </span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Barra Delgada de Progreso Integrada en el Borde Inferior -->
            <div class="w-full bg-[#D8D4C7] dark:bg-[#1E1E1A] h-[3px] rounded-full overflow-hidden mt-3" title="Progreso del circuito: ${focusedProgressPct}%">
                <div class="h-full bg-[#10B981] transition-all duration-300" style="width: ${focusedProgressPct}%"></div>
            </div>
        </div>
    `;

    // 2. RENDERIZAR LAS REGIONES SUBORDINADAS (TODAS EXCEPTO LA REGIÓN EN FOCO)
    for (const [regionName, list] of Object.entries(GYM_DATA)) {
        if (regionName === focusedRegion) continue;

        const cleanRegion = regionName.replace(/[^a-zA-Z]/g, '');
        let completedInRegion = 0;
        list.forEach((_, idx) => {
            if (localStorage.getItem(`gym-${cleanRegion}-${idx}`) === 'true') completedInRegion++;
        });
        const isRegionCleared = completedInRegion === list.length;
        const progressPct = Math.round((completedInRegion / list.length) * 100);
        const regionNumber = getRegionCode(regionName);

        // Botón dinámico que permite enfocar / continuar la región en el panel grande
        let actionBtnHtml = '';
        if (completedInRegion === 0) {
            actionBtnHtml = `
                <button data-region="${regionName}" data-action="focus-region" class="text-[13px] font-tech uppercase bg-[#2B2B2B] dark:bg-[#3E3E36] text-white hover:bg-[#444] px-3 py-2 rounded-lg font-bold transition cursor-pointer min-h-[44px] flex items-center justify-center shadow-sm" title="Ver esta región en grande arriba">
                    Ver en grande
                </button>
            `;
        } else if (completedInRegion < list.length) {
            actionBtnHtml = `
                <button data-region="${regionName}" data-action="focus-region" class="text-[13px] font-tech uppercase bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] px-3 py-2 rounded-lg font-bold transition cursor-pointer min-h-[44px] flex items-center justify-center shadow-sm" title="Ver esta región en grande arriba y continuar">
                    Continuar (${completedInRegion}/${list.length})
                </button>
            `;
        } else {
            actionBtnHtml = `
                <button data-region="${regionName}" data-action="focus-region" class="text-[13px] font-tech uppercase bg-[#1B5E20]/20 text-[#1B5E20] dark:text-[#C3F400] border border-[#1B5E20]/40 px-3 py-2 rounded-lg font-bold transition cursor-pointer min-h-[44px] flex items-center justify-center" title="Ver esta región en grande arriba">
                    Ver en grande ★
                </button>
            `;
        }

        const resetBtnHtml = `
            <button data-region="${regionName}" data-action="unmark-all" class="text-[13px] font-tech uppercase bg-[#E4DFD0] dark:bg-[#2E2E27] text-[#2B2B2B] dark:text-[#F4F1E8] hover:text-[#b7102a] dark:hover:text-[#FFA8A8] border border-[#2B2B2B] dark:border-[#35352E] px-3 py-2 rounded-lg transition cursor-pointer min-h-[44px] flex items-center justify-center shadow-sm" title="Reiniciar circuito">
                Reiniciar
            </button>
        `;

        const card = document.createElement('div');
        card.className = "bg-[#F6F4EB] dark:bg-[#262622] border-2 border-[#2B2B2B] dark:border-[#35352E] rounded-xl p-3 sm:p-4 shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000] relative overflow-hidden flex flex-col justify-between transition-colors";
        card.innerHTML = `
            <div class="flex flex-wrap items-center justify-between border-b border-[#2B2B2B]/30 dark:border-[#35352E] pb-2 mb-3 gap-2">
                <div class="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition" data-region="${regionName}" data-action="focus-region" title="Clic para ver esta región en grande arriba">
                    <span class="bg-[#E4DFD0] dark:bg-[#2E2E27] text-[#2B2B2B] dark:text-[#F4F1E8] font-tech font-bold text-[13px] px-2 py-0.5 rounded border border-[#2B2B2B] dark:border-[#35352E]">${regionNumber}</span>
                    <span class="font-tech font-bold text-sm text-[#1C1C17] dark:text-[#F4F1E8] hover:underline">${regionName}</span>
                </div>
                <div class="flex items-center gap-1.5 z-10 flex-wrap">
                    ${actionBtnHtml}
                    ${resetBtnHtml}
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] z-10">
                ${list.map((gym, idx) => {
                    const id = `gym-${cleanRegion}-${idx}`;
                    const isChecked = localStorage.getItem(id) === 'true';
                    const [city, leader] = gym.name.includes(':') ? gym.name.split(':') : [gym.name, ''];
                    return `
                        <div class="leader-tile ${isChecked ? 'bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B]/30 dark:border-[#35352E]' : 'bg-[#EDE9DE] dark:bg-[#242420] border border-transparent'} px-3 py-2 rounded-lg flex justify-between items-center cursor-pointer hover:border-[#FFC800] transition select-none min-h-[44px]" data-gym-id="${id}">
                            <div class="flex items-center gap-2 truncate mr-2">
                                ${isChecked ? `<span class="text-[#1B5E20] dark:text-[#C3F400] text-[13px] font-bold">✓</span>` : ''}
                                <span id="label-${id}" class="font-medium truncate text-[13px] ${isChecked ? 'text-[#5F5A4D] dark:text-[#A8A594]' : 'text-[#1C1C17] dark:text-[#F4F1E8]'}">
                                    ${leader ? leader.trim() : city.trim()}
                                </span>
                            </div>
                            <span id="timer-${id}" class="font-mono text-[13px] font-bold flex-shrink-0 ${isChecked ? 'text-[#5F5A4D] dark:text-[#A8A594] font-medium' : 'text-[#1B5E20] dark:text-[#C3F400] font-bold'}">
                                ${isChecked ? '--:--:--' : 'Listo'}
                            </span>
                        </div>
                    `;
                }).join('')}
            </div>

            <!-- Barra Delgada de Progreso Integrada en el Borde Inferior -->
            <div class="w-full bg-[#D8D4C7] dark:bg-[#1E1E1A] h-[3px] rounded-full overflow-hidden mt-3" title="Progreso del circuito: ${progressPct}%">
                <div class="h-full bg-[#10B981] transition-all duration-300" style="width: ${progressPct}%"></div>
            </div>

            <div class="mt-2 pt-2 border-t border-[#D8D4C7]/40 dark:border-[#33332D] flex items-center justify-between font-mono text-[13px] text-[#5F5A4D] dark:text-[#A8A594]">
                <span>${completedInRegion}/${list.length} completados</span>
                <span class="${isRegionCleared ? 'text-[#10B981] font-black' : 'text-[#5F5A4D] dark:text-[#A8A594] font-bold'}">
                    ${isRegionCleared ? '★ Circuito Completado' : 'Circuito activo'}
                </span>
            </div>
        `;
        subContainer.appendChild(card);
    }

    // Vincular controladores de clics a las tarjetas de líderes
    document.querySelectorAll('.leader-tile').forEach(tile => {
        tile.addEventListener('click', () => {
            const gymId = tile.dataset.gymId;
            const currentlyChecked = localStorage.getItem(gymId) === 'true';
            toggleGymState(gymId, !currentlyChecked);
        });
    });

    // Vincular controladores para cambiar la región en foco (Ver en grande / Continuar)
    document.querySelectorAll('[data-action="focus-region"]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetRegion = el.dataset.region;
            if (targetRegion) {
                setFocusedRegion(targetRegion);
            }
        });
    });

    // Vincular controladores de marcar todos y reiniciar
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
    const targetTimestamp = Date.now();

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
    const targetTime = Date.now();
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
    if (payoutBonusEl) payoutBonusEl.innerText = `Bono: +$${bonus.toLocaleString()}`;
    if (earningsBarEl) earningsBarEl.style.width = `${(completedCount / totalLeaders) * 100}%`;

    const readyPct = Math.round((readyCount / totalLeaders) * 100);
    const cooldownPct = 100 - readyPct;

    if (readyCountEl) readyCountEl.innerText = `${readyCount}`;
    if (cooldownBadgeEl) cooldownBadgeEl.innerText = `${completedCount} en enfriamiento`;
    if (hpReadyBarEl) hpReadyBarEl.style.width = `${readyPct}%`;
    if (hpCooldownBarEl) hpCooldownBarEl.style.width = `${cooldownPct}%`;
    if (hpClearanceTextEl) hpClearanceTextEl.innerText = `${readyPct}% listos`;
}

export function resetGyms() {
    if (confirm('¿Reiniciar TODO el progreso de gimnasios?')) {
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
            btnEl.innerText = 'Iniciar cronómetro';
            btnEl.className = 'flex-1 py-1.5 bg-[#FFC800] text-[#241A00] hover:bg-[#FFE066] border-2 border-[#181816] font-tech font-black text-xs uppercase tracking-wider rounded shadow-[1px_2px_0px_#181816] active:translate-y-0.5 cursor-pointer';
        }
        return;
    }

    const elapsed = Date.now() - start;
    const remaining = AMULET_DURATION_MS - elapsed;

    if (remaining <= 0) {
        if (timerEl) {
            timerEl.innerText = 'AGOTADO';
            timerEl.className = 'text-3xl font-black text-[#E63946] animate-pulse font-lcd';
        }
        if (statusEl) statusEl.innerText = 'BONO FINALIZADO';
        if (btnEl) btnEl.innerText = 'Reiniciar';
    } else {
        const m = Math.floor(remaining / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        if (timerEl) {
            timerEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            timerEl.className = 'text-4xl font-black tracking-widest leading-none font-lcd';
        }
        if (statusEl) statusEl.innerText = 'BONO ACTIVO';
        if (btnEl) {
            btnEl.innerText = 'En curso (Activo)';
            btnEl.className = 'flex-1 py-1.5 bg-[#1B5E20] dark:bg-[#C3F400] text-white dark:text-[#181816] border-2 border-[#181816] font-tech font-black text-xs uppercase tracking-wider rounded shadow-[1px_2px_0px_#181816]';
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
                    timerEl.innerText = 'Listo';
                    timerEl.className = "font-mono text-[13px] font-bold text-[#1B5E20] dark:text-[#C3F400]";
                    const label = document.getElementById(`label-${id}`);
                    if (label) {
                        label.classList.remove('line-through', 'text-[#5F5A4D]', 'dark:text-[#A8A594]', 'text-os-muted');
                        label.classList.add('text-[#1C1C17]', 'dark:text-[#F4F1E8]');
                    }
                }
            } else if (timerEl) {
                const fmt = (typeof formatTime === 'function') ? formatTime(remaining) : _formatTimeStr(remaining);
                timerEl.innerText = fmt;
                timerEl.className = "font-mono text-[13px] font-medium text-[#5F5A4D] dark:text-[#A8A594]";
            }
        }
    }
    // Amulet timer update
    const amuletStart = parseInt(localStorage.getItem('pokemmo_amulet_start'));
    if (amuletStart && !isNaN(amuletStart)) {
        updateAmuletUI();
    }
}


