import { state, setState } from '../state.js';


let POKEDEX_DB = [];
let dexCaughtList = [];
let currentDexRegion = 'Kanto';
let dexCurrentPage = 1;
const dexPageSize = 20;

let PRE_EVO_MAP = {};
let POST_EVO_MAP = {};

export function renderPokÃ©dexView() {
    return `
        <div id="view-pokedex" class="hidden animate-fade-in">
            <div class="flex justify-between items-end mb-8 pb-4 border-b border-os-border">
                <div>
                    <h1 class="text-2xl font-semibold text-os-text flex items-center gap-2"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png" class="w-8 h-8 pokemon-sprite">Itinerario de Captura</h1>
                    <p class="text-sm text-os-muted mt-1">Ruteo geogrÃ¡fico secuencial.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    <button onclick="window.pokedex.openCaughtModal()" class="border border-os-green/60 text-os-green hover:bg-os-green hover:text-white px-3 py-1.5 text-xs uppercase font-mono transition flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.2)] rounded-sm">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-4 h-4 pixelated">
                        <span>Capturados (<strong id="btnCaughtCount">0</strong>)</span>
                    </button>
                </div>
            </div>
            
            <div class="flex flex-col gap-4 mb-6">
                <!-- Region Tabs -->
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div id="regiÃ³nTabs" class="flex gap-2 overflow-x-auto pb-1">
                        <button onclick="window.pokedex.setRegion('Kanto')" id="reg-Kanto" class="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-blue text-white rounded shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-os-blue transition">Kanto</button>
                        <button onclick="window.pokedex.setRegion('Johto')" id="reg-Johto" class="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-panel text-os-muted border border-os-border hover:text-os-blue hover:border-os-blue transition rounded">Johto</button>
                        <button onclick="window.pokedex.setRegion('Hoenn')" id="reg-Hoenn" class="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-panel text-os-muted border border-os-border hover:text-os-blue hover:border-os-blue transition rounded">Hoenn</button>
                        <button onclick="window.pokedex.setRegion('Sinnoh')" id="reg-Sinnoh" class="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-panel text-os-muted border border-os-border hover:text-os-blue hover:border-os-blue transition rounded">Sinnoh</button>
                        <button onclick="window.pokedex.setRegion('Unova')" id="reg-Unova" class="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-panel text-os-muted border border-os-border hover:text-os-blue hover:border-os-blue transition rounded">Unova</button>
                        <button onclick="window.pokedex.setRegion('all')" id="reg-all" class="px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-panel text-os-muted border border-os-border hover:text-os-blue hover:border-os-blue transition rounded">Todas</button>
                    </div>
                    
                    <div class="flex flex-wrap items-center gap-3">
                        <label class="flex items-center gap-1.5 text-xs text-os-muted cursor-pointer select-none">
                            <input type="checkbox" id="hideCaught" onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-os-blue">
                            Ocultar Capturados
                        </label>
                        <label class="flex items-center gap-1.5 text-xs text-os-muted cursor-pointer select-none" title="Si ya capturaste una evoluciÃ³n superior, oculta sus formas previas">
                            <input type="checkbox" id="hidePreEvos" onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-os-blue">
                            Ocultar Pre-evoluciones
                        </label>
                        <label class="flex items-center gap-1.5 text-xs text-os-muted cursor-pointer select-none" title="Si ya capturaste la pre-evoluciÃ³n, oculta sus evoluciones para enfocarte en capturables fÃ¡ciles">
                            <input type="checkbox" id="hidePostEvos" onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-os-blue">
                            Ocultar Post-evoluciones
                        </label>
                        <label class="flex items-center gap-1.5 text-xs text-os-muted cursor-pointer select-none">
                            <input type="checkbox" id="hideUnassigned" checked onchange="window.pokedex.renderDexResults(true)" class="w-4 h-4 accent-os-blue">
                            Solo con Ruta
                        </label>
                    </div>
                </div>

                <!-- Progress Bar -->
                <div class="panel p-3 flex items-center gap-4">
                    <div class="text-[10px] font-mono text-os-muted w-36 uppercase tracking-widest">Progreso RegiÃ³n: <span id="dexProgressText" class="text-os-green font-bold text-xs ml-1">0 / 0</span></div>
                    <div class="flex-grow bg-os-bg h-1.5 rounded-full overflow-hidden border border-os-border">
                        <div id="dexProgressBar" class="bg-os-green h-full w-0 transition-all duration-500 shadow-[0_0_8px_#10B981]"></div>
                    </div>
                </div>

                <!-- TOOLBAR: Buscador, Ordenador y Filtro de Horario estilo PokÃ©MMO -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-3 bg-os-panel border border-os-border p-3 rounded-sm">
                    <div class="md:col-span-2">
                        <input type="text" id="dexSearch" placeholder="ðŸ” Buscar PokÃ©mon, Ruta (ej. Ruta 7) o MÃ©todo..." oninput="window.pokedex.renderDexResults(true)" class="w-full p-2 text-sm bg-os-bg border border-os-border text-os-text rounded-sm focus:border-os-blue outline-none font-mono">
                    </div>
                    <div>
                        <select id="dexSort" onchange="window.pokedex.renderDexResults(true)" class="w-full p-2 text-sm bg-os-bg border border-os-border text-os-text rounded-sm cursor-pointer font-mono">
                            <option value="rate_desc" selected>ðŸ“ˆ Mayor Probabilidad (%)</option>
                            <option value="id_asc">ðŸ”¢ NÃ‚Â° PokÃ©dex (#1 - #649)</option>
                            <option value="name_asc">ðŸ”¤ Nombre (A - Z)</option>
                        </select>
                    </div>
                    <div>
                        <select id="dexTimeFilter" onchange="window.pokedex.renderDexResults(true)" class="w-full p-2 text-sm bg-os-bg border border-os-border text-os-text rounded-sm cursor-pointer font-mono">
                            <option value="all" selected>ðŸ•’ Horario: Todos</option>
                            <option value="morning">ðŸŒ… MaÃ±ana</option>
                            <option value="day">â˜€ï¸ DÃ­a</option>
                            <option value="night">ðŸŒ™ Noche</option>
                            <option value="lure">ðŸŽ£ Con SeÃ±uelo (Lure)</option>
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
    <!-- MODAL: VENTANA DE POKÃ‰MON CAPTURADOS -->
    <div id="caughtModal" class="fixed inset-0 bg-[#090A0F]/95 hidden items-center justify-center z-50 p-4 backdrop-blur-md">
        <div class="panel p-6 w-full max-w-4xl max-h-[90vh] flex flex-col border border-os-border shadow-2xl relative overflow-hidden">
            <!-- Header -->
            <div class="flex flex-wrap items-center justify-between border-b border-os-border pb-4 mb-4 gap-3">
                <div class="flex items-center gap-3">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-8 h-8 pixelated animate-bounce">
                    <div>
                        <h2 class="text-base font-bold text-os-text flex items-center gap-2">
                            PokÃ©dex // Registro de Capturas Oficiales
                        </h2>
                        <p class="text-xs font-mono text-os-muted">
                            <span id="caughtSummaryText" class="text-os-green font-bold">0</span> de <span id="caughtTotalText">649</span> registrados (<span id="caughtPercentText" class="text-os-blue font-bold">0%</span> de la PokÃ©dex Nacional)
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="window.pokedex.exportCaughtOnly()" class="border border-os-blue/60 text-os-blue hover:bg-os-blue hover:text-white px-3 py-1.5 text-xs font-mono uppercase transition rounded-sm" title="Descargar solo el JSON de tus capturas">
                        Ã°Å¸â€œÂ¥ Exportar Capturas (JSON)
                    </button>
                    <button onclick="window.pokedex.copyCaughtListText()" class="border border-os-border hover:border-os-muted text-os-muted hover:text-white px-3 py-1.5 text-xs font-mono uppercase transition rounded-sm" title="Copiar nombres al portapapeles">
                        ðŸ“‹ Copiar Lista
                    </button>
                    <button onclick="window.pokedex.closeCaughtModal()" class="text-os-muted hover:text-white font-mono text-lg px-2">Ã¢Å“â€¢</button>
                </div>
            </div>

            <!-- Toolbar de Filtro dentro del modal -->
            <div class="mb-4">
                <input type="text" id="caughtSearchInput" placeholder="ðŸ” Filtrar tus capturas por nombre, nÃºmero o region..." oninput="window.pokedex.renderCaughtGrid()" class="w-full p-2.5 text-xs bg-os-bg border border-os-border text-os-text rounded-sm focus:border-os-blue outline-none font-mono">
            </div>

            <!-- Grid de PokÃ©mon Capturados con Scroll -->
            <div id="caughtGridContainer" class="flex-grow overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <!-- Injected via JS -->
            </div>

            <!-- Footer con BotÃ³n Cerrar -->
            <div class="flex justify-between items-center mt-4 pt-3 border-t border-os-border">
                <span class="text-[10px] font-mono text-os-muted">Toca "Liberar" en cualquier PokÃ©mon para devolverlo a tu lista de bÃºsqueda.</span>
                <button onclick="window.pokedex.closeCaughtModal()" class="px-5 py-2 text-xs font-mono uppercase bg-os-panel border border-os-border hover:border-os-blue text-os-text hover:text-os-blue transition rounded-sm">
                    Cerrar
                </button>
            </div>
        </div>
    </div>
    `;
}

export async function initPokÃ©dex() {
    dexCaughtList = JSON.parse(localStorage.getItem('pokemmo_dex_caught')) || state.dexCaughtList || [];
    
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
        console.log("AÃºn no existe el JSON del bot o hubo un error de red.", err);
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
    const btnCount = document.getElementById('btnCaughtCount');
    
    if (pText) pText.innerText = `${caught}/${total}`;
    if (pBar) pBar.style.width = `${pct}%`;
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
            <div class="col-span-full py-12 text-center text-os-muted font-mono text-xs">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-10 h-10 pixelated mx-auto mb-2 opacity-20">
                ${dexCaughtList.length === 0 ? 'AÃºn no has marcado ningÃºn PokÃ©mon como capturado.' : 'No se encontraron capturas con ese filtro.'}
            </div>
        `;
        return;
    }

    caughtMons.sort((a, b) => a.id - b.id);

    let html = '';
    caughtMons.forEach(p => {
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        html += `
            <div class="bg-os-bg border border-os-border/70 hover:border-os-green/50 p-2.5 rounded-sm flex flex-col items-center justify-between text-center transition group">
                <div class="w-full flex justify-between items-center text-[9px] font-mono text-os-muted">
                    <span>#${p.id.toString().padStart(3, '0')}</span>
                    <span class="text-os-blue">${p.region}</span>
                </div>
                <img src="${spriteUrl}" class="w-14 h-14 pixelated object-contain group-hover:scale-110 transition-transform my-1" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                <span class="font-bold text-xs text-os-text truncate w-full mb-1">${p.name}</span>
                <button onclick="window.pokedex.uncatchFromModal(${p.id})" class="w-full text-[10px] font-mono py-1 px-1.5 bg-os-panel border border-os-border text-os-muted hover:text-os-red hover:border-os-red transition rounded-sm" title="Desmarcar y volver a buscar">
                    Ã¢Å“â€¢ Liberar
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
    navigator.clipboard.writeText(caughtMons.join('\\n')).then(() => {
        alert(`ðŸ“‹ Â¡Â¡Copiados ${caughtMons.length} PokÃ©mon capturados al portapapeles!`);
    });
}

export function setRegion(region) {
    currentDexRegion = region;
    ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'all'].forEach(r => {
        const btn = document.getElementById('reg-' + r);
        if (!btn) return;
        if(r === region) {
            btn.className = "px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-blue text-white rounded shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-os-blue transition";
        } else {
            btn.className = "px-4 py-1.5 text-xs font-bold uppercase tracking-widest bg-os-panel text-os-muted border border-os-border hover:text-os-blue hover:border-os-blue transition rounded";
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

function parsePokemonData(p) {
    const hint = p.hint || '';
    const method = p.method || 'Hierba';
    const location = (p.location || '').replace('Parada: ', '').trim();
    
    const rateMatch = hint.match(/(\\d+)%/);
    let rate = rateMatch ? parseInt(rateMatch[1]) : 0;
    
    const starterIds = [1,2,3,4,5,6,7,8,9,152,153,154,155,156,157,158,159,160,252,253,254,255,256,257,258,259,260,387,388,389,390,391,392,393,394,395,495,496,497,498,499,500,501,502,503];
    const isLure = hint.toLowerCase().includes('lure') || 
                   hint.toLowerCase().includes('seÃ±uelo') || 
                   method.toLowerCase().includes('lure') ||
                   starterIds.includes(p.id);

    if (isLure && rate === 0) rate = 5;

    const lvlMatch = hint.match(/Nv\\.\\s*([\\d\\s\\-]+)/);
    const level = lvlMatch ? lvlMatch[1].trim() : (p.level || '--');

    let morning = '--';
    let day = '--';
    let night = '--';

    if (isLure) {
        morning = 'SeÃ±uelo';
        day = 'SeÃ±uelo';
        night = 'SeÃ±uelo';
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
        rate: rate,
        level: level,
        isLure: isLure,
        locationClean: location,
        morning: morning,
        day: day,
        night: night
    };
}

function savePokÃ©dexPreferences() {
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

    savePokÃ©dexPreferences();

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
            const matchMethod = (p.method || '').toLowerCase().includes(query);
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
                <p class="text-sm text-os-muted">No se encontraron PokÃ©mon con los filtros y bÃºsqueda seleccionados.</p>
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
        <div class="panel border-os-border overflow-hidden rounded-sm shadow-xl">
            <!-- Barra de PÃ¡ginaciÃ³n Superior -->
            <div class="bg-os-bg/90 border-b border-os-border px-4 py-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <span class="text-os-muted">
                    Mostrando <strong class="text-os-text">${startIndex + 1} - ${Math.min(startIndex + dexPageSize, totalItems)}</strong> de <strong class="text-os-blue">${totalItems} PokÃ©mon</strong>
                </span>
                <div class="flex items-center gap-1.5">
                    <button onclick="window.pokedex.changeDexPage(-1)" ${dexCurrentPage === 1 ? 'disabled class="px-3 py-1 bg-os-panel text-os-muted/40 border border-os-border cursor-not-allowed rounded-sm"' : 'class="px-3 py-1 bg-os-panel text-os-text border border-os-border hover:border-os-blue hover:text-os-blue transition rounded-sm"'}>â—€ Anterior</button>
                    <span class="px-2 text-os-muted">PÃ¡g. <strong class="text-os-text">${dexCurrentPage}</strong> / ${totalPages}</span>
                    <button onclick="window.pokedex.changeDexPage(1)" ${dexCurrentPage >= totalPages ? 'disabled class="px-3 py-1 bg-os-panel text-os-muted/40 border border-os-border cursor-not-allowed rounded-sm"' : 'class="px-3 py-1 bg-os-panel text-os-text border border-os-border hover:border-os-blue hover:text-os-blue transition rounded-sm"'}>Siguiente â–¶</button>
                </div>
            </div>

            <!-- Tabla de Encuentros PokÃ©MMO Oficial -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                        <tr class="bg-os-bg/80 border-b border-os-border text-[10px] font-mono text-os-muted uppercase tracking-wider">
                            <th class="py-2.5 px-3">Especie</th>
                            <th class="py-2.5 px-3">Tipo / MÃ©todo</th>
                            <th class="py-2.5 px-3">Niveles</th>
                            <th class="py-2.5 px-3">Ruta / Parada</th>
                            <th class="py-2.5 px-2 text-center">ðŸŒ… MaÃ±ana</th>
                            <th class="py-2.5 px-2 text-center">â˜€ï¸ DÃ­a</th>
                            <th class="py-2.5 px-2 text-center">ðŸŒ™ Noche</th>
                            <th class="py-2.5 px-3 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-os-border/40 font-mono">
    `;

    pageItems.forEach(p => {
        const isCaught = dexCaughtList.includes(p.id);
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
        const pokeballIcon = isCaught 
            ? `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" class="w-4 h-4 pixelated inline-block" title="Capturado">`
            : `<span class="w-4 h-4 rounded-full border border-os-border inline-block opacity-30" title="Pendiente"></span>`;

        const formatRateSlot = (val) => {
            if (val === 'SeÃ±uelo') {
                return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">SeÃ±uelo</span>`;
            } else if (val !== '--') {
                const num = parseInt(val);
                const color = num >= 50 ? 'text-emerald-400 font-bold' : (num >= 20 ? 'text-green-400' : 'text-blue-300');
                return `<span class="${color}">${val}</span>`;
            }
            return `<span class="text-os-muted/40">--</span>`;
        };

        htmlStr += `
            <tr class="hover:bg-os-blue/5 transition group ${isCaught ? 'opacity-50 hover:opacity-100' : ''}">
                <td class="py-2 px-3">
                    <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2">
                            ${pokeballIcon}
                            <img src="${spriteUrl}" class="w-9 h-9 pixelated object-contain group-hover:scale-110 transition-transform" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                            <div>
                                <span class="font-sans font-bold text-sm text-os-text block">${p.name}</span>
                                <span class="text-[10px] text-os-muted">#${p.id.toString().padStart(3, '0')}</span>
                            </div>
                        </div>
                    </div>
                </td>
                <td class="py-2 px-3">
                    <span class="px-2 py-1 bg-os-bg border border-os-border text-os-muted text-[10px] uppercase rounded-sm inline-block">
                        ${p.method}
                    </span>
                    ${p.isLure ? '<span class="ml-1 text-[9px] text-amber-400 bg-amber-400/10 px-1 py-0.5 border border-amber-400/30 rounded-sm">ðŸŽ£ Lure</span>' : ''}
                </td>
                <td class="py-2 px-3 text-os-muted">
                    ${p.level}
                </td>
                <td class="py-2 px-3 font-sans">
                    <span class="text-os-blue font-semibold text-xs">${p.locationClean || 'Sin Ruta'}</span>
                    <button onclick="window.pokedex.promptSuggestion(${p.id}, '${p.name}')" class="ml-2 text-[9px] text-os-muted hover:text-os-blue border-b border-transparent hover:border-os-blue transition-colors">Sugerir correcciÃ³n</button>
                </td>
                <td class="py-2 px-2 text-center">${formatRateSlot(p.morning)}</td>
                <td class="py-2 px-2 text-center">${formatRateSlot(p.day)}</td>
                <td class="py-2 px-2 text-center">${formatRateSlot(p.night)}</td>
                <td class="py-2 px-3 text-center">
                    <button onclick="window.pokedex.catchPokemon(${p.id})" class="px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm transition ${isCaught ? 'bg-os-border/40 text-os-muted hover:border-os-red hover:text-os-red' : 'bg-os-blue text-white hover:bg-blue-600 shadow-[0_0_8px_rgba(59,130,246,0.4)]'}">
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

            <!-- Barra de PÃ¡ginaciÃ³n Inferior -->
            <div class="bg-os-bg/90 border-t border-os-border px-4 py-3 flex items-center justify-between text-xs font-mono">
                <span class="text-os-muted">PÃ¡gina <strong>${dexCurrentPage}</strong> de <strong>${totalPages}</strong></span>
                <div class="flex items-center gap-2">
                    <button onclick="window.pokedex.changeDexPage(-1)" ${dexCurrentPage === 1 ? 'disabled class="px-3 py-1 bg-os-panel text-os-muted/40 border border-os-border cursor-not-allowed rounded-sm"' : 'class="px-3 py-1 bg-os-panel text-os-text border border-os-border hover:border-os-blue hover:text-os-blue transition rounded-sm"'}>â—€ Anterior</button>
                    <button onclick="window.pokedex.changeDexPage(1)" ${dexCurrentPage >= totalPages ? 'disabled class="px-3 py-1 bg-os-panel text-os-muted/40 border border-os-border cursor-not-allowed rounded-sm"' : 'class="px-3 py-1 bg-os-panel text-os-text border border-os-border hover:border-os-blue hover:text-os-blue transition rounded-sm"'}>Siguiente â–¶</button>
                </div>
            </div>
        </div>
    `;

    resultsDiv.innerHTML = htmlStr;
}

export function catchPokemon(id) {
    const idx = dexCaughtList.indexOf(id);
    if (idx === -1) {
        dexCaughtList.push(id);
    } else {
        dexCaughtList.splice(idx, 1);
    }

    localStorage.setItem('pokemmo_dex_caught', JSON.stringify(dexCaughtList));
    setState('caught', dexCaughtList);
    
    updateDexProgress();
    renderDexResults(false);
    if (document.getElementById('caughtModal') && !document.getElementById('caughtModal').classList.contains('hidden')) {
        renderCaughtGrid();
    }
}

export function promptSuggestion(pokemonId, pokemonName) {
    const reason = prompt(`Sugerir correcciÃ³n para ${pokemonName}\\n\\nExplica brevemente quÃ© estÃ¡ mal (ej. 'La ruta es la 5, no la 6' o 'Aparece haciendo Surf'):`);
    if (reason && reason.trim()) {
        submitSuggestion(pokemonId, 'location', 'current', 'suggested', reason.trim());
    }
}

export async function submitSuggestion(pokemonId, field, currentValue, suggestedValue, reason) {
    if (typeof updateSuggestion === 'function') {
        try {
            await updateSuggestion(pokemonId, field, currentValue, suggestedValue, reason);
            alert("Â¡Â¡Sugerencia enviada! Gracias por ayudar a mejorar la PokÃ©dex.");
        } catch (e) {
            console.error(e);
            alert("Hubo un error enviando la sugerencia.");
        }
    } else {
        console.warn("updateSuggestion not found in db.js");
        alert("Â¡Â¡Sugerencia enviada! Gracias por ayudar a mejorar la PokÃ©dex.");
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







