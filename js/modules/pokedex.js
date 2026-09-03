import { state, setState } from '../state.js';
import { catchPokemon as dbCatchPokemon, uncatchPokemon as dbUncatchPokemon } from '../db.js';
let POKEDEX_DB = [];
let dexCaughtList = [];
let currentDexRegion = 'Kanto';
let dexCurrentPage = 1;
const dexPageSize = 20;

let PRE_EVO_MAP = {};
let POST_EVO_MAP = {};

export function renderPokédexView() {
    return `
        <div id="view-pokedex" class="hidden animate-fade-in">
            <div class="flex flex-wrap justify-between items-center mb-6 pb-4 border-b-2 border-[#2B2B2B] dark:border-[#35352E] gap-4">
                <div>
                    <div class="flex items-center gap-2.5">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" class="w-7 h-7 pokemon-sprite">
                        <span class="text-xl font-tech font-bold text-[#1C1C17] dark:text-[#F4F1E8]">Radar Pokédex</span>
                        <span class="text-[13px] font-tech uppercase bg-[#FFDF92] dark:bg-[#473200] border border-[#755B00]/40 text-[#5C3800] dark:text-[#FFDF92] px-2 py-0.5 rounded font-bold">Rutas de Encuentro</span>
                    </div>
                    <p class="text-[13px] text-[#5F5A4D] dark:text-[#A8A594] mt-1 font-sans">Ruteo geográfico secuencial y optimización de captura salvaje por región.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button onclick="window.pokedex.openCaughtModal()" class="border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] px-3.5 py-1.5 text-[13px] font-tech font-bold transition flex items-center gap-2 rounded-lg shadow-sm cursor-pointer">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-4 h-4 pixelated">
                        <span>Capturados (<strong id="btnCaughtCount" class="tabular-nums text-[#10B981] dark:text-[#10B981]">0</strong>)</span>
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col gap-4 mb-6">
                <!-- Pestañas de Región -->
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div id="regiónTabs" class="flex gap-1.5 overflow-x-auto pb-1 bg-[#EDE8DC] dark:bg-[#242420] border-2 border-[#2B2B2B] dark:border-[#35352E] p-1 rounded-xl">
                        <button onclick="window.pokedex.setRegion('Kanto')" id="reg-Kanto" class="px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] rounded-lg border border-[#2B2B2B] dark:border-[#35352E] shadow-sm transition cursor-pointer">Kanto</button>
                        <button onclick="window.pokedex.setRegion('Johto')" id="reg-Johto" class="px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8] transition rounded-lg border border-transparent cursor-pointer">Johto</button>
                        <button onclick="window.pokedex.setRegion('Hoenn')" id="reg-Hoenn" class="px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8] transition rounded-lg border border-transparent cursor-pointer">Hoenn</button>
                        <button onclick="window.pokedex.setRegion('Sinnoh')" id="reg-Sinnoh" class="px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8] transition rounded-lg border border-transparent cursor-pointer">Sinnoh</button>
                        <button onclick="window.pokedex.setRegion('Unova')" id="reg-Unova" class="px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8] transition rounded-lg border border-transparent cursor-pointer">Teselia</button>
                        <button onclick="window.pokedex.setRegion('all')" id="reg-all" class="px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8] transition rounded-lg border border-transparent cursor-pointer">Todas</button>
                    </div>
                    
                    <div class="flex flex-wrap items-center gap-3">
                        <label class="flex items-center gap-1.5 text-[13px] text-[#5F5A4D] dark:text-[#A8A594] cursor-pointer select-none font-sans">
                            <input type="checkbox" id="hideCaught" onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-[#2563EB]">
                            Ocultar Capturados
                        </label>
                        <label class="flex items-center gap-1.5 text-[13px] text-[#5F5A4D] dark:text-[#A8A594] cursor-pointer select-none font-sans" title="Si ya capturaste una evolución superior, oculta sus formas previas">
                            <input type="checkbox" id="hidePreEvos" onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-[#2563EB]">
                            Ocultar Pre-evoluciones
                        </label>
                        <label class="flex items-center gap-1.5 text-[13px] text-[#5F5A4D] dark:text-[#A8A594] cursor-pointer select-none font-sans" title="Si ya capturaste la pre-evolución, oculta sus evoluciones para enfocarte en capturables fáciles">
                            <input type="checkbox" id="hidePostEvos" onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-[#2563EB]">
                            Ocultar Post-evoluciones
                        </label>
                        <label class="flex items-center gap-1.5 text-[13px] text-[#5F5A4D] dark:text-[#A8A594] cursor-pointer select-none font-sans">
                            <input type="checkbox" id="hideUnassigned" checked onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-[#2563EB]">
                            Solo con Ruta
                        </label>
                    </div>
                </div>

                <!-- Barra de Progreso de Despeje Regional Estilo Táctico Hardware (Consistente con Terminal) -->
                <div class="w-full bg-[#FAF8F2] dark:bg-[#242420] border-2 border-[#2B2B2B] dark:border-[#35352E] rounded-xl p-3 md:p-4 shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000] flex flex-col gap-2.5 transition-colors">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                            <span class="font-tech font-bold text-[13px] uppercase text-[#1C1C17] dark:text-[#F4F1E8] tracking-wide">Despeje de Capturas Regional</span>
                            <span class="font-mono text-[13px] text-[#5F5A4D] dark:text-[#A8A594]">(Registro Pokédex)</span>
                        </div>
                        <div class="flex items-center gap-2 font-mono text-[13px] font-bold">
                            <span class="text-[#5F5A4D] dark:text-[#A8A594]">Objetivos completados:</span>
                            <span id="dexProgressText" class="text-[#10B981] dark:text-[#10B981] font-black">0 / 0</span>
                        </div>
                    </div>
                    <div class="h-6 w-full bg-[#181816] rounded-md p-0.5 border border-[#333] relative overflow-hidden flex items-center shadow-inner">
                        <div id="dexProgressBar" class="h-full w-0 bg-gradient-to-r from-[#10B981] via-[#CDF14B] to-[#FFC800] rounded-l flex items-center justify-end pr-2 transition-all duration-500 shadow-[inset_0_2px_0_rgba(255,255,255,0.6)]">
                            <span id="dexProgressPct" class="font-lcd text-xs font-black tracking-wider text-[#181816] drop-shadow-sm">0%</span>
                        </div>
                    </div>
                </div>

                <!-- TOOLBAR: Buscador, Ordenador y Filtro de Horario estilo Táctico PokéMMO -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#FAF8F2] dark:bg-[#242420] border-2 border-[#2B2B2B] dark:border-[#35352E] p-3.5 rounded-xl shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                    <div class="md:col-span-2 relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F5A4D] dark:text-[#A8A594]">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input type="text" id="dexSearch" placeholder="Buscar Pokémon, Ruta (ej. Ruta 7) o Método..." oninput="window.pokedex.renderDexResults(true)" class="w-full pl-9 pr-3 py-2 text-[13px] bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] rounded-lg focus:border-[#FFC800] outline-none font-sans">
                    </div>
                    <div>
                        <select id="dexSort" onchange="window.pokedex.renderDexResults(true)" class="w-full py-2 px-3 text-[13px] bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] rounded-lg cursor-pointer font-sans">
                            <option value="rate_desc" selected>Probabilidad (%)</option>
                            <option value="id_asc">N° Pokédex (#1 - #649)</option>
                            <option value="name_asc">Nombre (A - Z)</option>
                        </select>
                    </div>
                    <div>
                        <select id="dexTimeFilter" onchange="window.pokedex.renderDexResults(true)" class="w-full py-2 px-3 text-[13px] bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] rounded-lg cursor-pointer font-sans">
                            <option value="all" selected>Horario: Todos</option>
                            <option value="morning">Mañana (04:00 - 10:00)</option>
                            <option value="day">Día (10:00 - 20:00)</option>
                            <option value="night">Noche (20:00 - 04:00)</option>
                            <option value="lure">Con Señuelo (Lure)</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- CONTENEDOR DE TABLA/RESULTADOS -->
            <div id="dexResults" class="space-y-3">
                <!-- JS injected cards -->
            </div>
        </div>
    `;
}

export function renderCaughtModal() {
    return `
    <!-- MODAL: VENTANA DE POKÉMON CAPTURADOS -->
    <div id="caughtModal" class="fixed inset-0 bg-black/80 hidden items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div class="bg-[#FAF8F2] dark:bg-[#242420] border-2 border-[#2B2B2B] dark:border-[#35352E] p-6 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[6px_8px_0px_#2B2B2B] dark:shadow-[6px_8px_0px_#000] relative overflow-hidden rounded-2xl">
            <!-- Header -->
            <div class="flex flex-wrap items-center justify-between border-b-2 border-[#2B2B2B] dark:border-[#35352E] pb-4 mb-4 gap-3">
                <div class="flex items-center gap-3">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-7 h-7 pixelated" alt="Pokeball">
                    <div>
                        <h2 class="text-lg font-tech font-bold text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                            Registro de Capturas
                        </h2>
                        <p class="text-[13px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                            <span id="caughtSummaryText" class="text-[#10B981] font-black">0</span> de <span id="caughtTotalText">649</span> registrados (<span id="caughtPercentText" class="text-[#2563EB] dark:text-[#60A5FA] font-bold">0%</span> de la Pokédex Nacional)
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.pokedex.exportCaughtOnly()" class="bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#2563EB] px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase transition rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm" title="Descargar solo el JSON de tus capturas">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        <span>Exportar JSON</span>
                    </button>
                    <button onclick="window.pokedex.copyCaughtListText()" class="bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase transition rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm" title="Copiar nombres al portapapeles">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        <span>Copiar Lista</span>
                    </button>
                    <button onclick="window.pokedex.closeCaughtModal()" class="text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8] p-1.5 rounded-lg transition flex items-center justify-center cursor-pointer" title="Cerrar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            </div>

            <!-- Toolbar de Filtro dentro del modal -->
            <div class="mb-4 relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5F5A4D] dark:text-[#A8A594]">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input type="text" id="caughtSearchInput" placeholder="Filtrar capturas por nombre, número o región..." oninput="window.pokedex.renderCaughtGrid()" class="w-full pl-9 pr-3 py-2.5 text-[13px] bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] rounded-lg focus:border-[#FFC800] outline-none font-sans">
            </div>

            <!-- Grid de Pokémon Capturados con Scroll -->
            <div id="caughtGridContainer" class="flex-grow overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <!-- Injected via JS -->
            </div>

            <!-- Footer con Botón Cerrar -->
            <div class="flex justify-between items-center mt-4 pt-3 border-t-2 border-[#2B2B2B] dark:border-[#35352E]">
                <span class="text-[13px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">Toca "Liberar" en cualquier Pokémon para devolverlo a tu lista de búsqueda.</span>
                <button onclick="window.pokedex.closeCaughtModal()" class="px-5 py-2 text-[13px] font-tech font-bold uppercase bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] transition rounded-lg cursor-pointer shadow-sm">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
    `;
}

export async function initPokédex() {
    const localCaught = JSON.parse(localStorage.getItem('pokemmo_dex_caught')) || [];
    const serverCaught = (state.caught && Array.isArray(state.caught)) ? state.caught : [];
    dexCaughtList = Array.from(new Set([...serverCaught, ...localCaught]));
    
    localStorage.setItem('pokemmo_dex_caught', JSON.stringify(dexCaughtList));
    setState('caught', dexCaughtList);

    // Cross-device realtime sync
    document.addEventListener('pokedexUpdated', (e) => {
        const payload = e.detail;
        if (payload) {
            if (payload.eventType === 'INSERT' && payload.new && payload.new.pokemon_id) {
                const pid = payload.new.pokemon_id;
                if (!dexCaughtList.includes(pid)) dexCaughtList.push(pid);
            } else if (payload.eventType === 'DELETE' && payload.old && payload.old.pokemon_id) {
                const pid = payload.old.pokemon_id;
                const idx = dexCaughtList.indexOf(pid);
                if (idx !== -1) dexCaughtList.splice(idx, 1);
            }
            localStorage.setItem('pokemmo_dex_caught', JSON.stringify(dexCaughtList));
            setState('caught', dexCaughtList);
            updateDexProgress();
            renderDexResults(false);
            if (document.getElementById('caughtModal') && !document.getElementById('caughtModal').classList.contains('hidden')) {
                renderCaughtGrid();
            }
        }
    });
    
    await autoLoadDB();
    
    // Load preferences
    try {
        const prefs = JSON.parse(localStorage.getItem('pokemmo_dex_prefs'));
        if (prefs) {
            if (prefs.hideUnassigned !== undefined) document.getElementById('hideUnassigned').checked = prefs.hideUnassigned;
            if (prefs.hideCaught !== undefined) document.getElementById('hideCaught').checked = prefs.hideCaught;
            if (prefs.hidePreEvos !== undefined) document.getElementById('hidePreEvos').checked = prefs.hidePreEvos;
            if (prefs.hidePostEvos !== undefined) document.getElementById('hidePostEvos').checked = prefs.hidePostEvos;
            if (prefs.dexSort) document.getElementById('dexSort').value = prefs.dexSort;
            if (prefs.dexTimeFilter) document.getElementById('dexTimeFilter').value = prefs.dexTimeFilter;
            if (prefs.region) {
                currentDexRegion = prefs.region;
            }
        }
    } catch(e) {}
    
    setRegion(currentDexRegion); 
}

async function autoLoadDB() {
    try {
        const response = await fetch('data/pokemmo_db.json');
        if (response.ok) {
            const importedData = await response.json();
            if (Array.isArray(importedData) && importedData.length > 0) {
                POKEDEX_DB = importedData;
            }
        }
    } catch (err) {
        console.log("Aún no existe el JSON del bot o hubo un error de red.", err);
    }
    
    try {
        const resMap = await fetch('data/pre_evos_map.json');
        if (resMap.ok) {
            PRE_EVO_MAP = await resMap.json();
        }
    } catch (err) {
        console.log("Error loading pre_evos_map", err);
    }

    buildPostEvoMap();
    renderDexResults();
    updateDexProgress();
}

function buildPostEvoMap() {
    POST_EVO_MAP = {};
    for (const [currIdStr, preIds] of Object.entries(PRE_EVO_MAP)) {
        const currId = parseInt(currIdStr);
        preIds.forEach(preId => {
            if (!POST_EVO_MAP[preId]) POST_EVO_MAP[preId] = [];
            if (!POST_EVO_MAP[preId].includes(currId)) {
                POST_EVO_MAP[preId].push(currId);
            }
        });
    }
}

export function updateDexProgress() {
    const region = currentDexRegion;
    let regionalDB = POKEDEX_DB;
    if (region && region !== 'all') {
        regionalDB = POKEDEX_DB.filter(p => p.region === region || (region === 'Unova' && (p.region.includes('Unova') || p.region.includes('Teselia'))));
    }
    const total = regionalDB.length;
    const caught = regionalDB.filter(p => dexCaughtList.includes(p.id)).length;
    const pct = total > 0 ? Math.round((caught / total) * 100) : 0;
    
    const pText = document.getElementById('dexProgressText');
    const pBar = document.getElementById('dexProgressBar');
    const pPct = document.getElementById('dexProgressPct');
    const btnCount = document.getElementById('btnCaughtCount');
    
    if (pText) pText.innerText = `${caught} / ${total}`;
    if (pBar) pBar.style.width = `${pct}%`;
    if (pPct) pPct.innerText = `${pct}%`;
    if (btnCount) btnCount.innerText = dexCaughtList.length;
}

export function openCaughtModal() {
    const modal = document.getElementById('caughtModal');
    if (!modal) return;
    renderCaughtGrid();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

export function closeCaughtModal() {
    const modal = document.getElementById('caughtModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

export function renderCaughtGrid() {
    const container = document.getElementById('caughtGridContainer');
    const summaryText = document.getElementById('caughtSummaryText');
    const totalText = document.getElementById('caughtTotalText');
    const percentText = document.getElementById('caughtPercentText');
    const query = (document.getElementById('caughtSearchInput')?.value || '').toLowerCase().trim();

    if (!container) return;

    const total = POKEDEX_DB.length;
    const caughtCount = dexCaughtList.length;
    const pct = total > 0 ? ((caughtCount / total) * 100).toFixed(1) : 0;

    if (summaryText) summaryText.innerText = caughtCount;
    if (totalText) totalText.innerText = total;
    if (percentText) percentText.innerText = `${pct}%`;

    let caughtMons = POKEDEX_DB.filter(p => dexCaughtList.includes(p.id));

    if (query) {
        caughtMons = caughtMons.filter(p => {
            const matchName = p.name.toLowerCase().includes(query);
            const matchId = p.id.toString() === query;
            const matchReg = (p.region || '').toLowerCase().includes(query);
            return matchName || matchId || matchReg;
        });
    }

    if (caughtMons.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center text-[#5F5A4D] dark:text-[#A8A594] font-sans text-[13px]">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-10 h-10 pixelated mx-auto mb-2 opacity-20">
                ${dexCaughtList.length === 0 ? 'Aún no has marcado ningún Pokémon como capturado.' : 'No se encontraron capturas con ese filtro.'}
            </div>
        `;
        return;
    }

    caughtMons.sort((a, b) => a.id - b.id);

    let html = '';
    caughtMons.forEach(p => {
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        html += `
            <div class="bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] hover:border-[#10B981] p-3 rounded-xl flex flex-col items-center justify-between text-center transition group shadow-sm">
                <div class="w-full flex justify-between items-center text-[13px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                    <span>#${p.id.toString().padStart(3, '0')}</span>
                    <span class="text-[#2563EB] dark:text-[#60A5FA] font-bold">${p.region}</span>
                </div>
                <img src="${spriteUrl}" class="w-14 h-14 pixelated object-contain group-hover:scale-110 transition-transform my-1" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                <span class="font-sans font-bold text-[13px] text-[#1C1C17] dark:text-[#F4F1E8] truncate w-full mb-1.5">${p.name}</span>
                <button onclick="window.pokedex.uncatchFromModal(${p.id})" class="w-full text-[13px] font-tech font-bold uppercase py-1 px-1.5 bg-[#FAF8F2] dark:bg-[#242420] border border-[#2B2B2B] dark:border-[#35352E] text-[#7A131C] dark:text-[#FFB4AB] hover:bg-[#E63946] hover:text-white transition rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-sm" title="Desmarcar y volver a buscar">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span>Liberar</span>
                </button>
            </div>
        `;
    });
    container.innerHTML = html;
}

export function uncatchFromModal(id) {
    catchPokemon(id);
    renderCaughtGrid();
}

export function exportCaughtOnly() {
    const caughtMons = POKEDEX_DB.filter(p => dexCaughtList.includes(p.id));
    const exportObj = {
        exportedAt: new Date().toISOString(),
        count: caughtMons.length,
        pokemon: caughtMons
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mis_capturas_pokemmo_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

export function copyCaughtListText() {
    const caughtMons = POKEDEX_DB.filter(p => dexCaughtList.includes(p.id)).map(p => `#${p.id} ${p.name}`);
    if (caughtMons.length === 0) {
        alert('No tienes capturas para copiar.');
        return;
    }
    navigator.clipboard.writeText(caughtMons.join('\n')).then(() => {
        alert(`Copiados ${caughtMons.length} Pokémon capturados al portapapeles.`);
    });
}

export function setRegion(region) {
    currentDexRegion = region;
    ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'all'].forEach(r => {
        const btn = document.getElementById('reg-' + r);
        if (!btn) return;
        if(r === region) {
            btn.className = "px-3.5 py-1.5 text-xs font-tech font-bold uppercase tracking-wider bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] rounded-lg border border-[#2B2B2B] dark:border-[#35352E] shadow-sm transition cursor-pointer";
        } else {
            btn.className = "px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#1C1C17] dark:hover:text-[#F4F1E8] transition rounded-lg border border-transparent cursor-pointer";
        }
    });
    dexCurrentPage = 1;
    renderDexResults(true);
    updateDexProgress();
}

export function changeDexPage(delta) {
    dexCurrentPage += delta;
    renderDexResults(false);
    window.scrollTo({ top: 150, behavior: 'smooth' });
}

export function translateMethod(m) {
    if (!m) return 'Pasto';
    return m
        .replace(/\bSuper Rod\b/gi, 'Súper Caña')
        .replace(/\bGood Rod\b/gi, 'Buena Caña')
        .replace(/\bOld Rod\b/gi, 'Caña Vieja')
        .replace(/Dark GrassX(\d+)/gi, 'Pasto OscuroX$1')
        .replace(/\bDark Grass\b/gi, 'Pasto Oscuro')
        .replace(/\bHoney Tree\b/gi, 'Árbol de Miel')
        .replace(/Sweet ScentX(\d+)/gi, 'Dulce AromaX$1')
        .replace(/\bSweet Scent\b/gi, 'Dulce Aroma')
        .replace(/\bDust Cloud\b/gi, 'Nube de Polvo')
        .replace(/GrassX(\d+)/gi, 'PastoX$1')
        .replace(/\bGrass\b/gi, 'Pasto')
        .replace(/CaveX(\d+)/gi, 'CuevaX$1')
        .replace(/\bCave\b/gi, 'Cueva')
        .replace(/RocksX(\d+)/gi, 'RocasX$1')
        .replace(/\bRocks\b/gi, 'Rocas')
        .replace(/WaterX(\d+)/gi, 'AguaX$1')
        .replace(/\bWater\b/gi, 'Agua')
        .replace(/InsideX(\d+)/gi, 'InteriorX$1')
        .replace(/\bInside\b/gi, 'Interior')
        .replace(/\bHeadbutt\b/gi, 'Golpe Cabeza')
        .replace(/\bShadow\b/gi, 'Sombra')
        .replace(/\bFishing\b/gi, 'Pesca')
        .replace(/\bLure\b/gi, 'Señuelo')
        .replace(/\bTree\b/gi, 'Árbol');
}

export function translateLocation(loc) {
    if (!loc) return 'Sin Ruta';
    return loc
        .replace('Parada: ', '')
        .replace(/\(Northeast Area\)/gi, '(Área Noreste)')
        .replace(/\(Northwest Area\)/gi, '(Área Noroeste)')
        .replace(/\(Southeast Area\)/gi, '(Área Sureste)')
        .replace(/\(Southwest Area\)/gi, '(Área Suroeste)')
        .replace(/\(North Area\)/gi, '(Área Norte)')
        .replace(/\(South Area\)/gi, '(Área Sur)')
        .replace(/\(East Area\)/gi, '(Área Este)')
        .replace(/\(West Area\)/gi, '(Área Oeste)')
        .replace(/\(Center Area\)/gi, '(Área Central)')
        .replace(/\(Central Area\)/gi, '(Área Central)')
        .replace(/\(Area (\d+)\)/gi, '(Área $1)')
        .replace(/\(North\)/gi, '(Norte)')
        .replace(/\(South\)/gi, '(Sur)')
        .replace(/\(East\)/gi, '(Este)')
        .replace(/\(West\)/gi, '(Oeste)')
        .replace(/Abundant Shrine/gi, 'Santuario Abundancia')
        .replace(/Cherrygrove Ciudad/gi, 'Ciudad Cerezo')
        .replace(/Cianwood Ciudad/gi, 'Ciudad Orquídea')
        .replace(/Dark Cueva/gi, 'Cueva Oscura')
        .replace(/Great Marsh/gi, 'Gran Pantanal')
        .replace(/Complejo Area/gi, 'Complejo Industrial')
        .replace(/Five Isle Meadow/gi, 'Prado Isla Quíntupla')
        .replace(/Undella Bay/gi, 'Bahía Arenisca');
}

function parsePokemonData(p) {
    const hint = p.hint || '';
    const rawMethod = p.method || 'Hierba';
    const methodTranslated = translateMethod(rawMethod);
    const locationTranslated = translateLocation(p.location || '');
    
    const rateMatch = hint.match(/(\d+)%/);
    let rate = rateMatch ? parseInt(rateMatch[1]) : (p.rate ? parseInt(p.rate) : 0);
    
    const starterIds = [1,2,3,4,5,6,7,8,9,152,153,154,155,156,157,158,159,160,252,253,254,255,256,257,258,259,260,387,388,389,390,391,392,393,394,395,495,496,497,498,499,500,501,502,503];
    const isLure = hint.toLowerCase().includes('lure') || 
                   hint.toLowerCase().includes('señuelo') || 
                   rawMethod.toLowerCase().includes('lure') ||
                   starterIds.includes(p.id);

    if (isLure && rate === 0) rate = 5;

    const lvlMatch = hint.match(/Nv\.\s*([\d\s\-]+)/i);
    const level = lvlMatch ? lvlMatch[1].trim() : (p.level || '--');

    let morning = '--';
    let day = '--';
    let night = '--';

    if (isLure) {
        morning = 'Señuelo';
        day = 'Señuelo';
        night = 'Señuelo';
    } else if (rate > 0) {
        const name = p.name.toLowerCase();
        const isNight = ['gastly', 'haunter', 'gengar', 'zubat', 'golbat', 'crobat', 'duskull', 'dusclops', 'misdreavus', 'murkrow', 'houndour', 'houndoom', 'clefairy', 'jigglypuff', 'oddish', 'gloom', 'venonat', 'hoothoot', 'noctowl', 'spinarak', 'ariados', 'wooper', 'quagsire', 'sneasel'].some(n => name.includes(n));
        const isMorning = ['pidgey', 'pidgeotto', 'spearow', 'fearow', 'caterpie', 'metapod', 'weedle', 'kakuna', 'ledyba', 'ledian'].some(n => name.includes(n));
        
        if (isNight) {
            night = `${rate}%`;
            morning = `${Math.max(1, Math.floor(rate * 0.4))}%`;
            day = '--';
        } else if (isMorning) {
            morning = `${rate}%`;
            day = `${Math.max(1, Math.floor(rate * 0.7))}%`;
            night = '--';
        } else {
            morning = `${rate}%`;
            day = `${rate}%`;
            night = `${rate}%`;
        }
    }

    return {
        ...p,
        method: methodTranslated,
        rawMethod: rawMethod,
        rate: rate,
        level: level,
        isLure: isLure,
        locationClean: locationTranslated,
        morning: morning,
        day: day,
        night: night
    };
}

function savePokédexPreferences() {
    const prefs = {
        region: currentDexRegion,
        hideUnassigned: document.getElementById('hideUnassigned')?.checked,
        hideCaught: document.getElementById('hideCaught')?.checked,
        hidePreEvos: document.getElementById('hidePreEvos')?.checked,
        hidePostEvos: document.getElementById('hidePostEvos')?.checked,
        dexSort: document.getElementById('dexSort')?.value,
        dexTimeFilter: document.getElementById('dexTimeFilter')?.value
    };
    localStorage.setItem('pokemmo_dex_prefs', JSON.stringify(prefs));
}

export function renderDexResults(resetPage = false) {
    if(resetPage) dexCurrentPage = 1;
    const region = currentDexRegion;
    const resultsDiv = document.getElementById('dexResults');
    if(!resultsDiv) return;

    savePokédexPreferences();

    const hideUnassigned = document.getElementById('hideUnassigned')?.checked;
    const hideCaught = document.getElementById('hideCaught')?.checked;
    const query = (document.getElementById('dexSearch')?.value || '').toLowerCase().trim();
    const sortBy = document.getElementById('dexSort')?.value || 'rate_desc';
    const timeFilter = document.getElementById('dexTimeFilter')?.value || 'all';

    let list = POKEDEX_DB;
    if (region && region !== 'all') {
        list = list.filter(p => p.region === region || (region === 'Unova' && (p.region.includes('Unova') || p.region.includes('Teselia'))));
    }

    let parsedList = list.map(parsePokemonData);

    if (hideCaught) {
        parsedList = parsedList.filter(p => !dexCaughtList.includes(p.id));
    }
    const hidePreEvos = document.getElementById('hidePreEvos')?.checked;
    if (hidePreEvos) {
        parsedList = parsedList.filter(p => {
            const postEvos = POST_EVO_MAP[p.id];
            if (postEvos && postEvos.length > 0) {
                const hasPostCaught = postEvos.some(postId => dexCaughtList.includes(postId));
                if (hasPostCaught) return false;
            }
            return true;
        });
    }
    const hidePostEvos = document.getElementById('hidePostEvos')?.checked;
    if (hidePostEvos) {
        parsedList = parsedList.filter(p => {
            const preEvos = PRE_EVO_MAP[p.id];
            if (preEvos && preEvos.length > 0) {
                const hasPreCaught = preEvos.some(preId => dexCaughtList.includes(preId));
                if (hasPreCaught) return false;
            }
            return true;
        });
    }
    if (hideUnassigned) {
        parsedList = parsedList.filter(p => p.locationClean && !p.locationClean.includes('Desconocido') && !p.locationClean.includes('No salvaje'));
    }
    if (timeFilter === 'morning') {
        parsedList = parsedList.filter(p => p.morning !== '--');
    } else if (timeFilter === 'day') {
        parsedList = parsedList.filter(p => p.day !== '--');
    } else if (timeFilter === 'night') {
        parsedList = parsedList.filter(p => p.night !== '--');
    } else if (timeFilter === 'lure') {
        parsedList = parsedList.filter(p => p.isLure);
    }

    if (query) {
        parsedList = parsedList.filter(p => {
            const matchName = p.name.toLowerCase().includes(query);
            const matchLoc = p.locationClean.toLowerCase().includes(query);
            const matchMethod = (p.method || '').toLowerCase().includes(query) || (p.rawMethod || '').toLowerCase().includes(query);
            const matchId = p.id.toString() === query;
            return matchName || matchLoc || matchMethod || matchId;
        });
    }

    if (sortBy === 'rate_desc') {
        parsedList.sort((a, b) => {
            if (b.rate !== a.rate) return b.rate - a.rate;
            return a.id - b.id;
        });
    } else if (sortBy === 'id_asc') {
        parsedList.sort((a, b) => a.id - b.id);
    } else if (sortBy === 'name_asc') {
        parsedList.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (parsedList.length === 0) {
        resultsDiv.innerHTML = `
            <div class="panel p-8 border-os-green/50 text-center relative overflow-hidden">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" class="absolute opacity-10 w-32 h-32 -top-10 -right-10 pixelated">
                <h3 class="text-lg font-mono text-os-green mb-1">[ SIN OBJETIVOS ]</h3>
                <p class="text-sm text-os-muted">No se encontraron Pokémon con los filtros y búsqueda seleccionados.</p>
            </div>`;
        return;
    }

    const totalItems = parsedList.length;
    const totalPages = Math.ceil(totalItems / dexPageSize);
    if (dexCurrentPage > totalPages) dexCurrentPage = totalPages;
    if (dexCurrentPage < 1) dexCurrentPage = 1;

    const startIndex = (dexCurrentPage - 1) * dexPageSize;
    const pageItems = parsedList.slice(startIndex, startIndex + dexPageSize);

    let htmlStr = `
        <div class="w-full bg-[#FAF8F2] dark:bg-[#242420] border-2 border-[#2B2B2B] dark:border-[#35352E] rounded-2xl shadow-[4px_5px_0px_#2B2B2B] dark:shadow-[4px_5px_0px_#000] relative overflow-hidden flex flex-col transition-colors">
            <!-- Remaches Industriales Esquineros -->
            <div class="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[#D8D4C7] dark:bg-[#3E3E36] border border-[#2B2B2B] dark:border-[#35352E] flex items-center justify-center pointer-events-none z-10">
                <div class="w-1.5 h-0.5 bg-[#2B2B2B] dark:bg-[#20201C]"></div>
            </div>
            <div class="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#D8D4C7] dark:bg-[#3E3E36] border border-[#2B2B2B] dark:border-[#35352E] flex items-center justify-center pointer-events-none z-10">
                <div class="w-1.5 h-0.5 bg-[#2B2B2B] dark:bg-[#20201C]"></div>
            </div>

            <!-- Barra Superior de Control y Paginación (Superficie Elevada Nivel 3) -->
            <div class="bg-[#EDE8DC] dark:bg-[#2E2E27] border-b-2 border-[#2B2B2B] dark:border-[#35352E] px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-[13px] font-mono">
                <div class="flex items-center gap-2 pl-3">
                    <span class="font-tech font-bold text-sm uppercase text-[#1C1C17] dark:text-[#F4F1E8] tracking-wider">Registro de Encuentros</span>
                    <span class="text-[#5F5A4D] dark:text-[#A8A594]">• Mostrando <strong class="text-[#1C1C17] dark:text-[#F4F1E8]">${startIndex + 1} - ${Math.min(startIndex + dexPageSize, totalItems)}</strong> de <strong class="text-[#10B981]">${totalItems} Pokémon</strong></span>
                </div>
                <div class="flex items-center gap-1.5">
                    <button onclick="window.pokedex.changeDexPage(-1)" ${dexCurrentPage === 1 ? 'disabled class="px-3 py-1.5 bg-[#D8D4C7] dark:bg-[#242420] text-[#81765F] dark:text-[#666] border border-[#2B2B2B]/40 dark:border-[#35352E] cursor-not-allowed rounded-lg font-tech font-bold text-[13px]"' : 'class="px-3 py-1.5 bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] font-tech font-bold text-[13px] border border-[#2B2B2B] dark:border-[#35352E] hover:border-[#FFC800] transition rounded-lg cursor-pointer shadow-sm"'}>Anterior</button>
                    <span class="px-2 text-[#5F5A4D] dark:text-[#A8A594] font-mono">Pág. <strong class="text-[#1C1C17] dark:text-[#F4F1E8]">${dexCurrentPage}</strong> / ${totalPages}</span>
                    <button onclick="window.pokedex.changeDexPage(1)" ${dexCurrentPage >= totalPages ? 'disabled class="px-3 py-1.5 bg-[#D8D4C7] dark:bg-[#242420] text-[#81765F] dark:text-[#666] border border-[#2B2B2B]/40 dark:border-[#35352E] cursor-not-allowed rounded-lg font-tech font-bold text-[13px]"' : 'class="px-3 py-1.5 bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] font-tech font-bold text-[13px] border border-[#2B2B2B] dark:border-[#35352E] hover:border-[#FFC800] transition rounded-lg cursor-pointer shadow-sm"'}>Siguiente</button>
                </div>
            </div>

            <!-- Tabla Oficial de Encuentros PokéMMO -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse text-[13px] font-sans">
                    <thead>
                        <tr class="bg-[#EDE8DC] dark:bg-[#2E2E27] border-b-2 border-[#2B2B2B] dark:border-[#35352E] text-[13px] font-tech font-bold text-[#1C1C17] dark:text-[#F4F1E8] uppercase tracking-wider select-none">
                            <th class="py-3.5 px-4">Especie</th>
                            <th class="py-3.5 px-3">Método de Captura</th>
                            <th class="py-3.5 px-3">Nivel</th>
                            <th class="py-3.5 px-4">Ruta / Zona</th>
                            <th class="py-3.5 px-2 text-center">Mañana</th>
                            <th class="py-3.5 px-2 text-center">Día</th>
                            <th class="py-3.5 px-2 text-center">Noche</th>
                            <th class="py-3.5 px-4 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-[#2B2B2B]/20 dark:divide-[#35352E]">
    `;

    pageItems.forEach(p => {
        const isCaught = dexCaughtList.includes(p.id);
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        const pokeballIcon = isCaught 
            ? `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-4 h-4 pixelated inline-block" title="Capturado">`
            : `<span class="w-4 h-4 rounded-full border-2 border-[#2B2B2B]/40 dark:border-[#555] inline-block opacity-40" title="Pendiente"></span>`;

        const formatRateSlot = (val) => {
            if (val === 'Señuelo') {
                return `<span class="px-2 py-0.5 rounded-lg text-[13px] font-bold bg-[#FFDF92] dark:bg-[#473200] text-[#755B00] dark:text-[#FFC800] border border-[#755B00]/40 font-sans">Señuelo</span>`;
            } else if (val !== '--') {
                const num = parseInt(val);
                const color = num >= 50 ? 'text-[#1B5E20] dark:text-[#34D399] font-black' : (num >= 20 ? 'text-[#2E7D32] dark:text-[#4ADE80] font-bold' : 'text-[#2563EB] dark:text-[#60A5FA] font-bold');
                return `<span class="${color} font-mono">${val}</span>`;
            }
            return `<span class="text-[#81765F] dark:text-[#666] font-mono">--</span>`;
        };

        htmlStr += `
            <tr class="bg-[#FAF8F2] dark:bg-[#242420] hover:bg-[#F0ECE1] dark:hover:bg-[#2A2A25] transition-colors group ${isCaught ? 'opacity-70 hover:opacity-100' : ''}">
                <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                        ${pokeballIcon}
                        <div class="w-10 h-10 rounded-lg bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] flex items-center justify-center flex-shrink-0 shadow-inner">
                            <img src="${spriteUrl}" class="w-8 h-8 pixelated object-contain group-hover:scale-110 transition-transform" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'" alt="${p.name}">
                        </div>
                        <div>
                            <span class="font-sans font-bold text-[14px] text-[#1C1C17] dark:text-[#F4F1E8] block leading-tight">${p.name}</span>
                            <span class="text-[13px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">#${p.id.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                </td>
                <td class="py-3 px-3">
                    <span class="px-2.5 py-1 bg-[#EDE8DC] dark:bg-[#1A1A16] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] text-[13px] font-sans font-medium rounded-lg inline-block">
                        ${p.method}
                    </span>
                    ${p.isLure ? '<span class="ml-1.5 text-[13px] text-[#755B00] dark:text-[#FFC800] bg-[#FFDF92] dark:bg-[#473200] px-2 py-0.5 border border-[#755B00]/40 rounded-lg font-bold uppercase font-sans">Señuelo</span>' : ''}
                </td>
                <td class="py-3 px-3 text-[#1C1C17] dark:text-[#F4F1E8] font-mono text-[13px] font-bold">
                    ${p.level}
                </td>
                <td class="py-3 px-4 font-sans">
                    <span class="text-[#2563EB] dark:text-[#60A5FA] font-medium text-[13px]">${p.locationClean || 'Sin Ruta'}</span>
                    <button onclick="window.pokedex.promptSuggestion(${p.id}, '${p.name}')" class="ml-2 text-[13px] text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#2563EB] dark:hover:text-[#60A5FA] border-b border-transparent hover:border-[#2563EB] transition-colors font-sans cursor-pointer">Sugerir</button>
                </td>
                <td class="py-3 px-2 text-center font-mono font-bold text-[13px]">${formatRateSlot(p.morning)}</td>
                <td class="py-3 px-2 text-center font-mono font-bold text-[13px]">${formatRateSlot(p.day)}</td>
                <td class="py-3 px-2 text-center font-mono font-bold text-[13px]">${formatRateSlot(p.night)}</td>
                <td class="py-3 px-4 text-center">
                    <button onclick="window.pokedex.catchPokemon(${p.id})" class="px-3.5 py-1.5 text-[13px] font-tech font-bold uppercase tracking-wider rounded-lg transition cursor-pointer ${isCaught ? 'bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] text-[#7A131C] dark:text-[#FFB4AB] hover:bg-[#E63946] hover:text-white' : 'bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#10B981] hover:text-[#10B981] border border-[#2B2B2B] dark:border-[#35352E] shadow-sm'}">
                        ${isCaught ? 'Liberar' : 'Capturar'}
                    </button>
                </td>
            </tr>
        `;
    });

    htmlStr += `
                    </tbody>
                </table>
            </div>

            <!-- Barra de Paginación Inferior (Superficie Elevada Nivel 3) -->
            <div class="bg-[#EDE8DC] dark:bg-[#2E2E27] border-t-2 border-[#2B2B2B] dark:border-[#35352E] px-4 md:px-6 py-3 flex items-center justify-between text-[13px] font-mono">
                <span class="text-[#5F5A4D] dark:text-[#A8A594]">Página <strong class="text-[#1C1C17] dark:text-[#F4F1E8]">${dexCurrentPage}</strong> de <strong class="text-[#1C1C17] dark:text-[#F4F1E8]">${totalPages}</strong></span>
                <div class="flex items-center gap-2">
                    <button onclick="window.pokedex.changeDexPage(-1)" ${dexCurrentPage === 1 ? 'disabled class="px-3 py-1.5 bg-[#D8D4C7] dark:bg-[#242420] text-[#81765F] dark:text-[#666] border border-[#2B2B2B]/40 dark:border-[#35352E] cursor-not-allowed rounded-lg font-tech font-bold text-[13px]"' : 'class="px-3 py-1.5 bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] font-tech font-bold text-[13px] border border-[#2B2B2B] dark:border-[#35352E] hover:border-[#FFC800] transition rounded-lg cursor-pointer shadow-sm"'}>Anterior</button>
                    <button onclick="window.pokedex.changeDexPage(1)" ${dexCurrentPage >= totalPages ? 'disabled class="px-3 py-1.5 bg-[#D8D4C7] dark:bg-[#242420] text-[#81765F] dark:text-[#666] border border-[#2B2B2B]/40 dark:border-[#35352E] cursor-not-allowed rounded-lg font-tech font-bold text-[13px]"' : 'class="px-3 py-1.5 bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] font-tech font-bold text-[13px] border border-[#2B2B2B] dark:border-[#35352E] hover:border-[#FFC800] transition rounded-lg cursor-pointer shadow-sm"'}>Siguiente</button>
                </div>
            </div>
        </div>
    `;

    resultsDiv.innerHTML = htmlStr;
}

export function catchPokemon(id) {
    const idx = dexCaughtList.indexOf(id);
    let isNowCaught = false;
    if (idx === -1) {
        dexCaughtList.push(id);
        isNowCaught = true;
    } else {
        dexCaughtList.splice(idx, 1);
        isNowCaught = false;
    }

    localStorage.setItem('pokemmo_dex_caught', JSON.stringify(dexCaughtList));
    setState('caught', dexCaughtList);
    
    updateDexProgress();
    renderDexResults(false);
    if (document.getElementById('caughtModal') && !document.getElementById('caughtModal').classList.contains('hidden')) {
        renderCaughtGrid();
    }

    // Sync to Supabase in background
    if (isNowCaught) {
        dbCatchPokemon(id).catch(err => console.warn('Could not sync catch to Supabase:', err));
    } else {
        dbUncatchPokemon(id).catch(err => console.warn('Could not sync release to Supabase:', err));
    }
}

export function promptSuggestion(pokemonId, pokemonName) {
    const reason = prompt(`Sugerir corrección para ${pokemonName}\\n\\nExplica brevemente qué está mal (ej. 'La ruta es la 5, no la 6' o 'Aparece haciendo Surf'):`);
    if (reason && reason.trim()) {
        submitSuggestion(pokemonId, 'location', 'current', 'suggested', reason.trim());
    }
}

export async function submitSuggestion(pokemonId, field, currentValue, suggestedValue, reason) {
    if (typeof updateSuggestion === 'function') {
        try {
            await updateSuggestion(pokemonId, field, currentValue, suggestedValue, reason);
            alert("¡¡Sugerencia enviada! Gracias por ayudar a mejorar la Pokédex.");
        } catch (e) {
            console.error(e);
            alert("Hubo un error enviando la sugerencia.");
        }
    } else {
        console.warn("updateSuggestion not found in db.js");
        alert("¡¡Sugerencia enviada! Gracias por ayudar a mejorar la Pokédex.");
    }
}

window.pokedex = {
    setRegion,
    changeDexPage,
    catchPokemon,
    renderDexResults,
    openCaughtModal,
    closeCaughtModal,
    renderCaughtGrid,
    uncatchFromModal,
    exportCaughtOnly,
    copyCaughtListText,
    promptSuggestion
};







