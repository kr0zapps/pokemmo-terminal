import { state, setState, subscribe } from '../state.js';
import { addCrop, updateCrop, removeCrop, getCrops } from '../db.js';
import { formatTime } from '../utils/format.js';
// We're importing DOM functions if they existed, but we'll manipulate directly for now

export const BERRY_DB = {
    zanama: { 
        name: 'Zanama (Leppa)', 
        totalHours: 20, 
        stageHours: 5.0,
        dropDurationHours: 2.0,    // 1 gota se consume cada 2.0h
        initialDryHours: 4.0,      // Las 2 gotas base duran 4.0h
        fullMoistureHours: 10.0,   // Las 5 gotas llenas duran 10.0h
        yield: '5-7 bayas',
        effect: 'Restaura 10 PP',
        sprite: 'leppa-berry'
    },
    basicas: { 
        name: 'Básicas (Oran, Cheri, Pecha...)', 
        totalHours: 16, 
        stageHours: 4.0,
        dropDurationHours: 1.8,    // 1 gota cada 1.8h
        initialDryHours: 3.6,      // Las 2 gotas base duran 3.6h
        fullMoistureHours: 9.0,    // Las 5 gotas duran 9.0h
        yield: '3-6 bayas',
        effect: 'Cura Estados / 10 HP',
        sprite: 'cheri-berry'
    },
    curativas: { 
        name: 'Ziuela (Lum) / Zidra (Sitrus)', 
        totalHours: 44, 
        stageHours: 11.0,
        dropDurationHours: 3.2,
        initialDryHours: 6.4,      // Las 2 gotas base duran 6.4h
        fullMoistureHours: 16.0,   // Las 5 gotas duran 16.0h
        yield: '7-10 bayas',
        effect: 'Cura todos los estados / 25% PS',
        sprite: 'sitrus-berry'
    },
    ev: { 
        name: 'Reductoras EVs (Grana, Algama...)', 
        totalHours: 44, 
        stageHours: 11.0,
        dropDurationHours: 3.2,
        initialDryHours: 6.4,      // Las 2 gotas base duran 6.4h
        fullMoistureHours: 16.0,   // Las 5 gotas duran 16.0h
        yield: '7-9 bayas',
        effect: '-10 EVs en Stat + Felicidad',
        sprite: 'pomeg-berry'
    },
    resistencias: { 
        name: 'Resistencias Tipo (Occa, Yache...)', 
        totalHours: 42, 
        stageHours: 10.5,
        dropDurationHours: 3.0,
        initialDryHours: 6.0,      // Las 2 gotas base duran 6.0h
        fullMoistureHours: 15.0,   // Las 5 gotas duran 15.0h
        yield: '7-9 bayas',
        effect: 'Debilita ataques supereficaces',
        sprite: 'yache-berry'
    },
    raras: { 
        name: 'Estadísticas / Raras (Liechi, Salac...)', 
        totalHours: 67, 
        stageHours: 16.75,
        dropDurationHours: 4.0,
        initialDryHours: 8.0,      // Las 2 gotas base duran 8.0h
        fullMoistureHours: 20.0,   // Las 5 gotas duran 20.0h
        yield: '10-13 bayas',
        effect: 'Sube Stat con PS < 25%',
        sprite: 'salac-berry'
    }
};

export const RECIPES = {
    leppa: { name: 'Zanama (Leppa)', reqs: [
        { id: 'v_picante', qty: 1, name: 'Semilla Muy Picante', color: 'bg-red-500' },
        { id: 'dulce', qty: 1, name: 'Semilla Dulce', color: 'bg-pink-400' },
        { id: 'amarga', qty: 1, name: 'Semilla Amarga', color: 'bg-green-500' }
    ]},
    lum: { name: 'Ziuela (Lum)', reqs: [
        { id: 'v_seca', qty: 1, name: 'Semilla Muy Seca', color: 'bg-blue-500' },
        { id: 'v_picante', qty: 1, name: 'Semilla Muy Picante', color: 'bg-red-500' },
        { id: 'v_dulce', qty: 1, name: 'Semilla Muy Dulce', color: 'bg-pink-500' }
    ]},
    sitrus: { name: 'Zidra (Sitrus)', reqs: [
        { id: 'v_dulce', qty: 1, name: 'Semilla Muy Dulce', color: 'bg-pink-500' },
        { id: 'v_amarga', qty: 1, name: 'Semilla Muy Amarga', color: 'bg-green-600' },
        { id: 'v_acida', qty: 1, name: 'Semilla Muy Ácida', color: 'bg-yellow-500' }
    ]},
    pomeg: { name: 'Grana (Pomeg)', reqs: [
        { id: 'v_picante', qty: 1, name: 'Semilla Muy Picante', color: 'bg-red-500' },
        { id: 'picante', qty: 1, name: 'Semilla Picante', color: 'bg-red-400' },
        { id: 'amarga', qty: 1, name: 'Semilla Amarga', color: 'bg-green-500' }
    ]},
    kelpsy: { name: 'Algama (Kelpsy)', reqs: [
        { id: 'v_seca', qty: 1, name: 'Semilla Muy Seca', color: 'bg-blue-500' },
        { id: 'seca', qty: 1, name: 'Semilla Seca', color: 'bg-blue-400' },
        { id: 'acida', qty: 1, name: 'Semilla Ácida', color: 'bg-yellow-400' }
    ]},
    qualot: { name: 'Ispero (Qualot)', reqs: [
        { id: 'v_dulce', qty: 1, name: 'Semilla Muy Dulce', color: 'bg-pink-500' },
        { id: 'dulce', qty: 1, name: 'Semilla Dulce', color: 'bg-pink-400' },
        { id: 'picante', qty: 1, name: 'Semilla Picante', color: 'bg-red-400' }
    ]},
    hondew: { name: 'Meluce (Hondew)', reqs: [
        { id: 'v_amarga', qty: 1, name: 'Semilla Muy Amarga', color: 'bg-green-600' },
        { id: 'amarga', qty: 1, name: 'Semilla Amarga', color: 'bg-green-500' },
        { id: 'seca', qty: 1, name: 'Semilla Seca', color: 'bg-blue-400' }
    ]},
    grepa: { name: 'Uva (Grepa)', reqs: [
        { id: 'v_acida', qty: 1, name: 'Semilla Muy Ácida', color: 'bg-yellow-500' },
        { id: 'acida', qty: 1, name: 'Semilla Ácida', color: 'bg-yellow-400' },
        { id: 'dulce', qty: 1, name: 'Semilla Dulce', color: 'bg-pink-400' }
    ]},
    tamato: { name: 'Tamate (Tamato)', reqs: [
        { id: 'v_picante', qty: 1, name: 'Semilla Muy Picante', color: 'bg-red-500' },
        { id: 'picante', qty: 1, name: 'Semilla Picante', color: 'bg-red-400' },
        { id: 'seca', qty: 1, name: 'Semilla Seca', color: 'bg-blue-400' }
    ]},
    pecha: { name: 'Meloc (Pecha)', reqs: [{ id: 'dulce', qty: 1, name: 'Semilla Dulce', color: 'bg-pink-400' }]},
    cheri: { name: 'Zreza (Cheri)', reqs: [{ id: 'picante', qty: 1, name: 'Semilla Picante', color: 'bg-red-400' }]},
    chesto: { name: 'Atania (Chesto)', reqs: [{ id: 'seca', qty: 1, name: 'Semilla Seca', color: 'bg-blue-400' }]},
    rawst: { name: 'Safre (Rawst)', reqs: [{ id: 'amarga', qty: 1, name: 'Semilla Amarga', color: 'bg-green-500' }]},
    aspear: { name: 'Perasi (Aspear)', reqs: [{ id: 'acida', qty: 1, name: 'Semilla Ácida', color: 'bg-yellow-400' }]}
};

let harvestCounter = 0;
let pendingWaterCropId = null;
let timerInterval = null;

// ==========================================
// RENDER VIEWS
// ==========================================
export function renderBerryView() {
    return `
        <div id="view-berries" class="hidden animate-fade-in">
            <div class="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-os-border gap-4">
                <div>
                    <div class="flex items-center gap-2.5">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wailmer-pail.png" class="w-7 h-7 pokemon-sprite">
                        <span class="text-xl font-pokemon text-amber-400">Cultivo de Bayas</span>
                        <span class="text-[13px] font-mono uppercase bg-os-elevated border border-os-border text-os-green px-2 py-0.5 rounded font-semibold">Riego y Cosecha</span>
                    </div>
                    <p class="text-xs text-os-muted mt-1">Monitoreo de hidratación de suelo, temporizadores de maduración y calculadora de rendimiento.</p>
                </div>
                <div class="text-right flex items-center gap-3">
                    <div class="bg-os-surface border border-os-border px-3.5 py-1.5 rounded-xl text-right">
                        <p class="text-[13px] text-os-muted uppercase font-mono font-semibold tracking-wider">Rondas Cosechadas</p>
                        <p class="text-xl font-mono font-bold text-os-green tabular-nums" id="totalHarvested">0</p>
                    </div>
                    <button id="btnResetHarvest" class="text-xs font-mono text-os-muted hover:text-os-red transition border border-os-border hover:border-os-red/40 p-2.5 rounded-lg cursor-pointer flex items-center justify-center" title="Reiniciar contador">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- SEED CALCULATOR -->
                <section class="panel p-5 rounded-xl">
                    <h2 class="text-xs font-mono text-os-muted uppercase tracking-wider mb-4 font-semibold">Inventario de Semillas</h2>
                    
                    <div class="grid grid-cols-5 gap-2 mb-5">
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">Picante</label><input type="number" id="inv_picante" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">Dulce</label><input type="number" id="inv_dulce" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">Seca</label><input type="number" id="inv_seca" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">Amarga</label><input type="number" id="inv_amarga" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">Ácida</label><input type="number" id="inv_acida" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        
                        <div><label class="block text-[13px] uppercase text-os-red mb-1 truncate font-bold">M. Picante</label><input type="number" id="inv_v_picante" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-os-red/40"></div>
                        <div><label class="block text-[13px] uppercase text-pink-400 mb-1 truncate font-bold">M. Dulce</label><input type="number" id="inv_v_dulce" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-pink-500/40"></div>
                        <div><label class="block text-[13px] uppercase text-blue-400 mb-1 truncate font-bold">M. Seca</label><input type="number" id="inv_v_seca" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-blue-500/40"></div>
                        <div><label class="block text-[13px] uppercase text-green-400 mb-1 truncate font-bold">M. Amarga</label><input type="number" id="inv_v_amarga" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-green-500/40"></div>
                        <div><label class="block text-[13px] uppercase text-yellow-400 mb-1 truncate font-bold">M. Ácida</label><input type="number" id="inv_v_acida" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-yellow-500/40"></div>
                    </div>
                    
                    <button id="btnCalculateInventory" class="w-full btn-primary py-2.5 text-xs font-mono uppercase tracking-wider mb-4 cursor-pointer">
                        Procesar Rendimiento
                    </button>
                    
                    <div id="inventoryResults" class="grid grid-cols-2 gap-3 hidden border-t border-os-border pt-4">
                        <!-- Resultados generados por JS -->
                    </div>
                </section>

                <div class="flex flex-col gap-6">
                    <!-- RECIPE LOOKUP -->
                    <section class="panel p-5 rounded-xl">
                        <h2 class="text-xs font-mono text-os-muted uppercase tracking-wider mb-4 font-semibold">Recetario de Semillas</h2>
                        <select id="recipeSelect" class="w-full p-2.5 text-xs mb-4 cursor-pointer rounded-lg bg-os-bg border border-os-border text-os-text font-mono">
                            <option value="" disabled selected>Consultar Baya...</option>
                            <optgroup label="Más Rentables">
                                <option value="leppa">Zanama (Leppa) - Restaura PP</option>
                                <option value="lum">Ziuela (Lum) - Cura todo</option>
                                <option value="sitrus">Zidra (Sitrus) - Cura PS</option>
                            </optgroup>
                            <optgroup label="Reductoras de EVs">
                                <option value="pomeg">Grana (Pomeg) - Baja HP</option>
                                <option value="kelpsy">Algama (Kelpsy) - Baja Atq</option>
                                <option value="qualot">Ispero (Qualot) - Baja Def</option>
                                <option value="hondew">Meluce (Hondew) - Baja AtqEsp</option>
                                <option value="grepa">Uva (Grepa) - Baja DefEsp</option>
                                <option value="tamato">Tamate (Tamato) - Baja Vel</option>
                            </optgroup>
                            <optgroup label="Básicas (Estados)">
                                <option value="cheri">Zreza (Cheri) - Parálisis</option>
                                <option value="chesto">Atania (Chesto) - Sueño</option>
                                <option value="pecha">Meloc (Pecha) - Veneno</option>
                                <option value="rawst">Safre (Rawst) - Quemadura</option>
                                <option value="aspear">Perasi (Aspear) - Congelación</option>
                            </optgroup>
                        </select>
                        <div id="recipeResult" class="bg-os-bg border border-os-border p-3 text-xs font-mono text-os-muted min-h-[80px] flex items-center justify-center rounded-lg">
                            Selecciona una baya para ver sus semillas requeridas
                        </div>
                    </section>

                    <!-- PLANT BERRY -->
                    <section class="panel p-5 rounded-xl">
                        <h2 class="text-xs font-mono text-os-muted uppercase tracking-wider mb-4 font-semibold">Plantación de Bayas</h2>
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label class="block text-[13px] uppercase text-os-muted mb-1 font-mono">Especie</label>
                                <select id="berryType" class="w-full p-2 text-sm cursor-pointer">
                                    <option value="zanama" selected>Zanama (Leppa) / 20h (PP)</option>
                                    <option value="basicas">Básicas (Oran, Cheri...) / 16h</option>
                                    <option value="curativas">Ziuela (Lum) / Zidra (Sitrus) / 44h</option>
                                    <option value="ev">Reductoras EVs (Grana, Algama...) / 44h</option>
                                    <option value="resistencias">Resistencias Tipo (Occa, Yache...) / 42h</option>
                                    <option value="raras">Estadísticas / Raras (Liechi, Salac...) / 67h</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-[13px] uppercase text-os-muted mb-1 font-mono">Coordenadas / Parcela</label>
                                <input type="text" id="berryLocation" placeholder="Ej. Ruta 104, Loza..." class="w-full p-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-[13px] uppercase text-os-green mb-1 font-mono font-bold">Duración 2 Gotas Base (Hrs)</label>
                                <input type="number" id="berryWaterHours" value="4.0" min="0.5" max="44" step="0.5" class="w-full p-2 text-sm text-center border-os-green/40 font-mono text-os-green" title="Horas antes de que las 2 gotas iniciales se consuman por completo">
                            </div>
                            <div>
                                <label class="block text-[13px] uppercase text-os-muted mb-1 font-mono">Tiempo Ya Transcurrido (Hrs)</label>
                                <input type="number" id="berryElapsed" placeholder="0 (recién plantada)" min="0" step="0.5" class="w-full p-2 text-sm">
                            </div>
                        </div>
                        <button id="btnPlantBerry" class="w-full border border-os-green text-os-green hover:bg-os-green hover:text-white transition py-2 text-sm uppercase tracking-wide">
                            Iniciar Monitoreo
                        </button>
                    </section>
                </div>
            </div>

            <!-- ACTIVE CROPS -->
            <div id="berriesContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
        </div>
    `;
}

export function renderWaterModal() {
    return `
        <!-- MODAL DE VISTA PREVIA Y SIMULACIÓN DE RIEGO -->
        <div id="waterPreviewModal" class="fixed inset-0 bg-[#090A0F]/90 hidden items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div class="panel p-6 w-full max-w-lg border border-os-border shadow-2xl relative overflow-hidden rounded-2xl">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-os-border pb-3 mb-4">
                    <div class="flex items-center gap-2.5">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wailmer-pail.png" class="w-7 h-7 pokemon-sprite" alt="Cubo Wailmer">
                        <div>
                            <h2 class="text-sm font-bold text-os-text" id="waterSimTitle">Confirmación de Riego</h2>
                            <p class="text-[13px] font-mono text-os-muted" id="waterSimSubtitle">Análisis de hidratación del suelo</p>
                        </div>
                    </div>
                    <button id="btnCloseWaterPreview1" class="text-os-muted hover:text-white p-1 rounded-md transition flex items-center justify-center cursor-pointer" title="Cerrar">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <!-- Dynamic Content -->
                <div id="waterSimContent" class="space-y-4 text-xs font-sans">
                    <!-- Injected via JS -->
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-os-border">
                    <button id="btnCloseWaterPreview2" class="px-4 py-2 text-xs font-mono uppercase text-os-muted hover:text-white border border-os-border hover:border-os-border-strong transition rounded-lg cursor-pointer">
                        Cancelar
                    </button>
                    <button id="btnConfirmWater" class="px-4 py-2 text-xs font-mono uppercase bg-os-blue hover:bg-blue-600 text-white font-bold transition rounded-lg shadow-sm cursor-pointer">
                        Confirmar Riego
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ==========================================
// INITIALIZATION
// ==========================================
export function initBerries() {
    // Load local storage fallback first
    harvestCounter = parseInt(localStorage.getItem('pokemmo_harvest_count')) || 0;
    if (state.crops && state.crops.length > 0) {
        // state has crops loaded from DB
    } else {
        const localCrops = JSON.parse(localStorage.getItem('pokemmo_crops')) || [];
        setState('crops', localCrops);
    }
    
    // Subscribe to state changes to update UI
    subscribe('crops', () => {
        renderCrops();
        saveCropsToLocal(); // fallback
    });

    // Cross-device realtime crop sync
    document.addEventListener('cropUpdated', async () => {
        try {
            const crops = await getCrops();
            setState('crops', crops);
            renderCrops();
        } catch (e) {
            console.warn('Error reloading crops on realtime sync:', e);
        }
    });

    const totalHarvestedEl = document.getElementById('totalHarvested');
    if (totalHarvestedEl) totalHarvestedEl.innerText = harvestCounter;

    // Attach Event Listeners
    const recipeSelect = document.getElementById('recipeSelect');
    if (recipeSelect) recipeSelect.addEventListener('change', showRecipe);

    const btnCalc = document.getElementById('btnCalculateInventory');
    if (btnCalc) btnCalc.addEventListener('click', calculateInventory);

    const berryType = document.getElementById('berryType');
    if (berryType) berryType.addEventListener('change', updateBerryDefaults);

    const btnPlant = document.getElementById('btnPlantBerry');
    if (btnPlant) btnPlant.addEventListener('click', plantBerry);
    
    const btnReset = document.getElementById('btnResetHarvest');
    if (btnReset) btnReset.addEventListener('click', resetHarvestCount);
    
    const btnCloseWater1 = document.getElementById('btnCloseWaterPreview1');
    if (btnCloseWater1) btnCloseWater1.addEventListener('click', closeWaterPreviewModal);
    const btnCloseWater2 = document.getElementById('btnCloseWaterPreview2');
    if (btnCloseWater2) btnCloseWater2.addEventListener('click', closeWaterPreviewModal);
    
    const btnConfirm = document.getElementById('btnConfirmWater');
    if (btnConfirm) btnConfirm.addEventListener('click', confirmExecuteWatering);

    // Initial renders
    renderCrops();
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimers, 1000);
}

// ==========================================
// CORE FUNCTIONS
// ==========================================
function saveCropsToLocal() {
    localStorage.setItem('pokemmo_crops', JSON.stringify(state.crops || []));
    localStorage.setItem('pokemmo_harvest_count', harvestCounter);
}

export function showRecipe() {
    const key = document.getElementById('recipeSelect').value;
    const res = document.getElementById('recipeResult');
    if (!key || !RECIPES[key]) return;
    
    const reqs = RECIPES[key].reqs;
    let html = '<div class="w-full"><div class="text-sm text-gray-300 mb-3 border-b border-gray-700 pb-2">Debes plantar exactamente estas semillas en un solo hueco:</div><div class="flex flex-col gap-2">';
    
    reqs.forEach(r => {
        html += `
            <div class="flex items-center gap-3 bg-gray-800 p-2 rounded border border-gray-700">
                <span class="w-4 h-4 rounded-full ${r.color} shadow-sm border border-gray-900"></span>
                <span class="font-bold text-gray-200">${r.qty}x</span>
                <span class="text-gray-300">${r.name}</span>
            </div>
        `;
    });
    
    html += '</div></div>';
    res.innerHTML = html;
}

export function calculateInventory() {
    const inv = {
        picante: parseInt(document.getElementById('inv_picante').value) || 0,
        dulce: parseInt(document.getElementById('inv_dulce').value) || 0,
        seca: parseInt(document.getElementById('inv_seca').value) || 0,
        amarga: parseInt(document.getElementById('inv_amarga').value) || 0,
        acida: parseInt(document.getElementById('inv_acida').value) || 0,
        v_picante: parseInt(document.getElementById('inv_v_picante').value) || 0,
        v_dulce: parseInt(document.getElementById('inv_v_dulce').value) || 0,
        v_seca: parseInt(document.getElementById('inv_v_seca').value) || 0,
        v_amarga: parseInt(document.getElementById('inv_v_amarga').value) || 0,
        v_acida: parseInt(document.getElementById('inv_v_acida').value) || 0,
    };

    const resultsDiv = document.getElementById('inventoryResults');
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('hidden');

    let hasResults = false;

    Object.keys(RECIPES).forEach(key => {
        const recipe = RECIPES[key];
        let maxCrafts = Infinity;

        recipe.reqs.forEach(req => {
            const available = inv[req.id] || 0;
            const crafts = Math.floor(available / req.qty);
            if (crafts < maxCrafts) {
                maxCrafts = crafts;
            }
        });

        if (maxCrafts > 0) {
            hasResults = true;
            
            let seedsHtml = '<div class="mt-2 pt-2 border-t border-gray-800 text-left space-y-1">';
            recipe.reqs.forEach(req => {
                seedsHtml += `
                    <div class="flex items-center gap-1 text-[13px] text-gray-400">
                        <span class="w-2 h-2 rounded-full ${req.color}"></span>
                        <span>${req.qty}x ${req.name.replace('Semilla ', '')}</span>
                    </div>
                `;
            });
            seedsHtml += '</div>';

            resultsDiv.innerHTML += `
                <div class="bg-gray-900 border border-purple-900/50 p-3 rounded-lg text-center shadow flex flex-col justify-between">
                    <div>
                        <p class="text-sm text-gray-300 font-bold mb-1">${recipe.name}</p>
                        <p class="text-2xl font-black text-purple-400">x${maxCrafts}</p>
                        <p class="text-[13px] text-gray-500 uppercase mt-1 mb-1">Plantas</p>
                    </div>
                    ${seedsHtml}
                </div>
            `;
        }
    });

    if (!hasResults) {
        resultsDiv.innerHTML = '<div class="col-span-full text-center text-gray-400 py-4">No tienes suficientes semillas para plantar ningúna de las bayas listadas.</div>';
    }
}

export function updateBerryDefaults() {
    const typeEl = document.getElementById('berryType');
    const hoursEl = document.getElementById('berryWaterHours');
    if (!typeEl || !hoursEl) return;
    const dbInfo = BERRY_DB[typeEl.value] || BERRY_DB.zanama;
    hoursEl.value = dbInfo.initialDryHours;
}

export async function plantBerry() {
    const typeEl = document.getElementById('berryType');
    if(!typeEl) return;
    const type = typeEl.value;
    const location = (document.getElementById('berryLocation')?.value || '').trim() || 'Sin ubicación';
    const elapsedHours = parseFloat(document.getElementById('berryElapsed')?.value) || 0;
    const dbInfo = BERRY_DB[type] || BERRY_DB.zanama;
    
    const customInput = parseFloat(document.getElementById('berryWaterHours')?.value);
    const initialDryHours = (!isNaN(customInput) && customInput > 0) ? customInput : dbInfo.initialDryHours;
    
    const elapsedMs = elapsedHours * 60 * 60 * 1000;
    const simulatedPlantTime = Date.now() - elapsedMs;

    const cropId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString();

    const newCrop = { 
        id: cropId, 
        type: type, 
        location: location, 
        initialDryHours: initialDryHours,
        plantedAt: simulatedPlantTime, 
        watered: false,
        wateredAt: null
    };

    const currentCrops = state.crops || [];
    currentCrops.push(newCrop);
    setState('crops', [...currentCrops]);
    
    try {
        const saved = await addCrop(newCrop);
        if (saved && saved.id) {
            newCrop.id = saved.id;
            saveCropsToLocal();
        }
    } catch (e) {
        console.error("Failed to sync crop with DB", e);
    }

    if(document.getElementById('berryLocation')) document.getElementById('berryLocation').value = '';
    if(document.getElementById('berryElapsed')) document.getElementById('berryElapsed').value = '';
}

export function openWaterPreviewModal(id) {
    const crops = state.crops || [];
    const crop = crops.find(c => c.id == id); // Loose equality in case id is string vs number
    if (!crop) return;
    pendingWaterCropId = id;

    const dbInfo = BERRY_DB[crop.type] || BERRY_DB.zanama;
    const now = Date.now();
    const totalMs = dbInfo.totalHours * 60 * 60 * 1000;
    const elapsedMs = now - crop.plantedAt;
    const remainingHarvestMs = Math.max(0, totalMs - elapsedMs);
    const fullMoistureMs = (dbInfo.fullMoistureHours || 10.0) * 60 * 60 * 1000;
    const dropMs = dbInfo.dropDurationHours * 60 * 60 * 1000;

    let startDrops = 2;
    let refTime = crop.plantedAt;
    if (crop.watered && crop.wateredAt) {
        startDrops = 5;
        refTime = crop.wateredAt;
    }
    const elapsedSinceRef = Math.max(0, now - refTime);
    const dropsConsumed = Math.floor(elapsedSinceRef / dropMs);
    const currentDrops = Math.max(0, startDrops - dropsConsumed);
    const timeToZeroDropsMs = Math.max(0, (startDrops * dropMs) - elapsedSinceRef);

    const modal = document.getElementById('waterPreviewModal');
    const subTitle = document.getElementById('waterSimSubtitle');
    const content = document.getElementById('waterSimContent');
    const btnConfirm = document.getElementById('btnConfirmWater');

    subTitle.innerText = `${dbInfo.name} | ${crop.location} | Cosecha en ${formatTime(remainingHarvestMs)}`;

    // ¿Regar ahora cubre completamente hasta la cosecha?
    if (remainingHarvestMs <= fullMoistureMs) {
        content.innerHTML = `
            <div class="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-xl">
                <div class="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-xs uppercase font-mono">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Cobertura de Riego Completa</span>
                </div>
                <p class="text-os-text leading-relaxed mb-3 text-xs">
                    A tu cultivo le restan <strong>${formatTime(remainingHarvestMs)}</strong> para cosechar y las 5 gotas duran <strong>${dbInfo.fullMoistureHours} horas</strong>. El agua cubrirá el 100% del tiempo restante.
                </p>
                <div class="grid grid-cols-2 gap-2 text-center font-mono text-xs bg-os-bg p-2.5 border border-emerald-500/20 rounded-lg mb-2">
                    <div>
                        <span class="text-os-muted block text-[13px] uppercase tracking-wider">Gotas tras regar</span>
                        <span class="text-emerald-400 font-bold">5 / 5 Gotas (Máx)</span>
                    </div>
                    <div>
                        <span class="text-os-muted block text-[13px] uppercase tracking-wider">Próximo riego</span>
                        <span class="text-emerald-400 font-bold">Ninguno (Protegido)</span>
                    </div>
                </div>
            </div>
        `;
        btnConfirm.className = "px-4 py-2 text-xs font-mono uppercase bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition rounded-lg shadow-sm cursor-pointer";
        btnConfirm.innerText = "Confirmar Riego (Protegido)";
    } else {
        const nextWaterInHours = dbInfo.fullMoistureHours;
        content.innerHTML = `
            <div class="bg-amber-950/30 border border-amber-500/40 p-4 rounded-xl">
                <div class="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-xs uppercase font-mono">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Riego Adicional Requerido en ~${nextWaterInHours} Horas</span>
                </div>
                <p class="text-os-text leading-relaxed mb-3 text-xs">
                    Las 5 gotas duran <strong>${nextWaterInHours} horas</strong> (~${dbInfo.dropDurationHours}h por gota). Como aún faltan <strong>${formatTime(remainingHarvestMs)}</strong> para cosechar, la humedad se agotará antes de la cosecha.
                </p>
                <div class="grid grid-cols-2 gap-2 text-center font-mono text-xs bg-os-bg p-2.5 border border-amber-500/20 rounded-lg mb-3">
                    <div>
                        <span class="text-os-muted block text-[13px] uppercase tracking-wider">Duración de 5 Gotas</span>
                        <span class="text-amber-400 font-bold">~${nextWaterInHours} horas</span>
                    </div>
                    <div>
                        <span class="text-os-muted block text-[13px] uppercase tracking-wider">Próximo Riego</span>
                        <span class="text-os-red font-bold">En ~${nextWaterInHours} horas</span>
                    </div>
                </div>
                <div class="bg-os-bg/80 border border-os-border p-2.5 rounded-lg">
                    <p class="text-xs text-os-muted font-mono leading-relaxed">
                        <span class="text-os-blue font-semibold">Estado actual:</span> Tiene <strong>${currentDrops}/5 gotas</strong> (~${formatTime(timeToZeroDropsMs)} de humedad). Si riegas ahora, restaurarás a 5 gotas inmediatamente.
                    </p>
                </div>
            </div>
        `;
        btnConfirm.className = "px-4 py-2 text-xs font-mono uppercase bg-os-blue hover:bg-blue-600 text-white font-bold transition rounded-lg shadow-sm cursor-pointer";
        btnConfirm.innerText = "Regar a 5 Gotas";
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

export function closeWaterPreviewModal() {
    const modal = document.getElementById('waterPreviewModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
    pendingWaterCropId = null;
}

export async function confirmExecuteWatering() {
    if (pendingWaterCropId) {
        const crops = state.crops || [];
        const index = crops.findIndex(c => c.id == pendingWaterCropId);
        if (index !== -1) {
            const crop = crops[index];
            crop.watered = true;
            crop.waterCount = (crop.waterCount || 0) + 1;
            crop.wateredAt = Date.now();
            
            setState('crops', [...crops]);
            
            try {
                await updateCrop(crop.id, { watered: true, waterCount: crop.waterCount, wateredAt: crop.wateredAt });
            } catch (e) {
                console.error("Failed to update crop in DB", e);
            }
        }
    }
    closeWaterPreviewModal();
}

export async function harvestCrop(id) {
    const crops = state.crops || [];
    const crop = crops.find(c => c.id == id);
    if (crop) {
        const dbInfo = BERRY_DB[crop.type] || BERRY_DB.zanama;
        if (Date.now() - crop.plantedAt >= dbInfo.totalHours * 60 * 60 * 1000) {
            harvestCounter++;
            const totalHarvestedEl = document.getElementById('totalHarvested');
            if (totalHarvestedEl) totalHarvestedEl.innerText = harvestCounter;
            localStorage.setItem('pokemmo_harvest_count', harvestCounter);
        }
    }
    
    const newCrops = crops.filter(c => c.id != id);
    setState('crops', newCrops);
    
    try {
        await removeCrop(id);
    } catch (e) {
        console.error("Failed to remove crop from DB", e);
    }
}

export function resetHarvestCount() {
    if(confirm('¿Reiniciar tu récord de cosechas a cero?')) {
        harvestCounter = 0;
        const totalHarvestedEl = document.getElementById('totalHarvested');
        if (totalHarvestedEl) totalHarvestedEl.innerText = harvestCounter;
        localStorage.setItem('pokemmo_harvest_count', harvestCounter);
    }
}

export function renderMoistureGauge(currentDrops, maxDrops = 5) {
    let pips = '';
    for (let i = 1; i <= maxDrops; i++) {
        if (i <= currentDrops) {
            pips += `<span class="inline-block w-3 h-3.5 rounded-sm bg-sky-400 mx-0.5 shadow-[0_0_6px_rgba(56,189,248,0.5)]"></span>`;
        } else {
            pips += `<span class="inline-block w-3 h-3.5 rounded-sm bg-[#07090E] border border-os-border mx-0.5 opacity-60"></span>`;
        }
    }
    const colorClass = currentDrops === 0 ? 'text-os-red' : (currentDrops === 1 ? 'text-amber-400' : 'text-sky-400');
    return `<div class="flex items-center gap-1">${pips}<span class="text-xs font-mono font-bold ${colorClass} ml-2 tabular-nums">${currentDrops}/${maxDrops}</span></div>`;
}

export function renderCrops() {
    const container = document.getElementById('berriesContainer');
    if(!container) return;
    
    const crops = state.crops || [];
    container.innerHTML = '';
    
    crops.forEach(crop => {
        const dbInfo = BERRY_DB[crop.type] || BERRY_DB.zanama;
        const card = document.createElement('div');
        card.id = `crop-card-${crop.id}`;
        card.className = `panel p-4 flex flex-col justify-between transition-all duration-200 relative overflow-hidden rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[3px_4px_0px_#2B2B2B] dark:shadow-[3px_4px_0px_#000]`;
        
        card.innerHTML = `
            <div class="z-10 relative">
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                        <div class="berry-pedestal flex-shrink-0 bg-[#E5E0D0] dark:bg-[#20201C] border-2 border-[#2B2B2B] dark:border-[#35352E] rounded-lg p-1">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${dbInfo.sprite}.png" class="w-8 h-8 pokemon-sprite" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'" alt="${dbInfo.name}">
                        </div>
                        <div>
                            <h3 class="font-tech text-sm sm:text-base font-bold text-[#1C1C17] dark:text-[#F4F1E8]">${dbInfo.name}</h3>
                            <p class="font-mono text-xs text-[#5F5A4D] dark:text-[#A8A594]"><span class="text-[#2563EB] dark:text-[#60A5FA] font-bold">${crop.location}</span> &bull; <span class="text-[#1B5E20] dark:text-[#C3F400] font-bold">${dbInfo.yield || '5-7'} u.</span></p>
                        </div>
                    </div>
                    <div id="crop-badge-${crop.id}"></div>
                </div>

                <!-- Indicador de Fase / Etapa -->
                <div id="crop-stage-${crop.id}" class="font-mono text-xs mb-2 text-[#5F5A4D] dark:text-[#A8A594]"></div>

                <!-- Estado de Humedad (Caja de Hardware Recesiva) -->
                <div class="bg-[#2B2B2B] dark:bg-[#1E1E1A] border-2 border-[#181816] dark:border-[#33332D] p-3 mb-3 rounded-xl shadow-inner text-[#F4F1E8]">
                    <div class="flex justify-between items-center text-xs font-mono mb-1.5">
                        <span class="font-tech text-[13px] text-[#A8A495] uppercase font-bold tracking-wider">Humedad de Suelo</span>
                        <div id="crop-drops-${crop.id}"></div>
                    </div>
                    <p id="crop-advice-${crop.id}" class="text-xs text-[#D8D4C7] leading-tight font-mono">Calculando estado de hidratación...</p>
                </div>

                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div class="bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] p-2 rounded-lg text-center shadow-sm">
                        <p id="crop-water-label-${crop.id}" class="text-[13px] text-[#5F5A4D] dark:text-[#A8A594] uppercase tracking-wider mb-0.5 font-tech font-bold">Humedad Restante</p>
                        <p id="crop-water-time-${crop.id}" class="font-lcd text-lg font-black text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums tracking-wider">--:--:--</p>
                    </div>
                    <div class="bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] p-2 rounded-lg text-center shadow-sm">
                        <p class="text-[13px] text-[#5F5A4D] dark:text-[#A8A594] uppercase tracking-wider mb-0.5 font-tech font-bold">Cosecha Total</p>
                        <p id="crop-harvest-time-${crop.id}" class="font-lcd text-lg font-black text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums tracking-wider">--:--:--</p>
                    </div>
                </div>

                <div class="w-full bg-[#E5E0D0] dark:bg-[#22221D] border border-[#2B2B2B] dark:border-[#35352E] h-2.5 rounded-full overflow-hidden mb-2 shadow-inner">
                    <div id="crop-progress-${crop.id}" class="h-2.5 progress-bar-transition w-0 bg-[#10B981] rounded-full"></div>
                </div>
            </div>
            <div class="flex gap-2 mt-auto z-10 relative pt-2">
                <button id="btn-water-${crop.id}" class="flex-1 bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] py-2 px-2 text-xs font-tech font-bold uppercase transition rounded-lg shadow-[1px_2px_0px_#2B2B2B] cursor-pointer">Regar</button>
                <button id="btn-harvest-${crop.id}" class="flex-1 bg-[#E4DFD0] dark:bg-[#2E2E27] border-2 border-[#2B2B2B] dark:border-[#35352E] text-[#2B2B2B] dark:text-[#F4F1E8] hover:text-[#E63946] py-2 px-2 text-xs font-tech font-bold uppercase transition rounded-lg cursor-pointer">Cancelar</button>
            </div>
        `;
        container.appendChild(card);

        // Add event listeners securely
        document.getElementById(`btn-water-${crop.id}`)?.addEventListener('click', () => openWaterPreviewModal(crop.id));
        document.getElementById(`btn-harvest-${crop.id}`)?.addEventListener('click', () => harvestCrop(crop.id));
    });
    
    updateTimers();
}

export function updateTimers() {
    const now = Date.now();
    const crops = state.crops || [];
    
    crops.forEach(crop => {
        const dbInfo = BERRY_DB[crop.type] || BERRY_DB.zanama;
        const totalMs = dbInfo.totalHours * 60 * 60 * 1000;
        const elapsedMs = now - crop.plantedAt;
        const remainingHarvestMs = totalMs - elapsedMs;
        const isHarvestReady = remainingHarvestMs <= 0;
        const wiltingWindowMs = 8 * 60 * 60 * 1000; // 8 horas oficiales de PokéMMO

        let progressPercent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

        const card = document.getElementById(`crop-card-${crop.id}`);
        if (!card) return;
        
        const waterLabel = document.getElementById(`crop-water-label-${crop.id}`);
        const waterTimeText = document.getElementById(`crop-water-time-${crop.id}`);
        const harvestTimeText = document.getElementById(`crop-harvest-time-${crop.id}`);
        const progressBar = document.getElementById(`crop-progress-${crop.id}`);
        const btnWater = document.getElementById(`btn-water-${crop.id}`);
        const btnHarvest = document.getElementById(`btn-harvest-${crop.id}`);
        const dropsText = document.getElementById(`crop-drops-${crop.id}`);
        const adviceText = document.getElementById(`crop-advice-${crop.id}`);
        const badge = document.getElementById(`crop-badge-${crop.id}`);
        const stageText = document.getElementById(`crop-stage-${crop.id}`);

        if (progressBar) progressBar.style.width = `${progressPercent}%`;

        // Calcular etapa actual de PokéMMO (1 a 4)
        if (stageText) {
            if (isHarvestReady) {
                stageText.innerHTML = `<span class="text-xs font-mono font-bold text-os-green uppercase tracking-wide">Cosecha Lista (${progressPercent.toFixed(0)}%)</span>`;
            } else if (progressPercent < 25) {
                stageText.innerHTML = `<span class="text-xs font-mono text-os-muted">Fase 1/4: Semilla (${progressPercent.toFixed(0)}%)</span>`;
            } else if (progressPercent < 50) {
                stageText.innerHTML = `<span class="text-xs font-mono text-emerald-400">Fase 2/4: Brote (${progressPercent.toFixed(0)}%)</span>`;
            } else if (progressPercent < 75) {
                stageText.innerHTML = `<span class="text-xs font-mono text-blue-400">Fase 3/4: Crecimiento (${progressPercent.toFixed(0)}%)</span>`;
            } else {
                stageText.innerHTML = `<span class="text-xs font-mono text-pink-400">Fase 4/4: Floración (${progressPercent.toFixed(0)}%)</span>`;
            }
        }

        if (isHarvestReady) {
            const timeSinceReady = -remainingHarvestMs;
            const remainingWiltMs = wiltingWindowMs - timeSinceReady;

            if (harvestTimeText) {
                harvestTimeText.innerText = '¡LISTO!';
                harvestTimeText.className = 'font-mono text-xs font-bold text-os-green animate-pulse';
            }

            if (waterLabel) waterLabel.innerText = 'Tiempo Marchitar';
            if (badge) badge.innerHTML = `<span class="text-[13px] font-mono text-os-green bg-os-green/10 border border-os-green/30 px-2 py-0.5 rounded font-semibold uppercase">Listo</span>`;

            if (remainingWiltMs <= 0) {
                if (waterTimeText) {
                    waterTimeText.innerText = '¡MARCHITO!';
                    waterTimeText.className = 'font-mono text-xs font-bold text-os-red';
                }
                if (dropsText) dropsText.innerHTML = '<span class="text-xs font-mono text-os-red font-bold">Planta Marchita (Excedió 8h)</span>';
                if (adviceText) {
                    adviceText.innerText = 'Han pasado más de 8 horas desde la maduración. La planta se marchitó.';
                    adviceText.className = 'text-[13px] text-os-red font-semibold';
                }
            } else {
                if (waterTimeText) {
                    waterTimeText.innerText = formatTime(remainingWiltMs);
                    waterTimeText.className = remainingWiltMs < (2 * 3600 * 1000) ? 'font-mono text-xs font-bold text-os-red animate-pulse' : 'font-mono text-xs font-bold text-amber-400';
                }
                if (dropsText) dropsText.innerHTML = '<span class="text-xs font-mono text-os-green font-bold">Frutos Listos (' + (dbInfo.yield || '5-7') + ' u.)</span>';
                if (adviceText) {
                    adviceText.innerText = `Cosecha lista. Tienes ${formatTime(remainingWiltMs)} antes de que empiece a marchitarse.`;
                    adviceText.className = 'text-[13px] text-os-green font-medium';
                }
            }

            if (btnWater) {
                btnWater.className = 'flex-1 py-2 px-2 text-xs font-mono uppercase bg-os-green text-black font-bold border border-os-green transition rounded-lg cursor-pointer';
                btnWater.innerText = 'Cosechar';
                btnWater.disabled = false;
                btnWater.onclick = () => harvestCrop(crop.id);
            }
            if (btnHarvest) {
                card.className = "panel p-5 flex flex-col justify-between transition-all duration-200 relative overflow-hidden rounded-xl border border-os-green/50";
                btnHarvest.className = "flex-1 border border-os-border text-os-muted hover:border-os-red/40 hover:text-os-red py-2 px-2 text-xs font-mono uppercase transition rounded-lg cursor-pointer";
                btnHarvest.innerText = "Eliminar";
            }
            return;
        }

        if (harvestTimeText) {
            harvestTimeText.innerText = formatTime(remainingHarvestMs);
            harvestTimeText.className = 'font-mono text-xs font-bold text-os-text';
        }

        const dropMs = dbInfo.dropDurationHours * 60 * 60 * 1000;
        let startDrops = 2;
        let refTime = crop.plantedAt;

        if (crop.watered && crop.wateredAt) {
            startDrops = 5;
            refTime = crop.wateredAt;
        }

        const elapsedSinceRef = Math.max(0, now - refTime);
        const dropsConsumed = Math.floor(elapsedSinceRef / dropMs);
        const currentDrops = Math.max(0, startDrops - dropsConsumed);
        const timeToZeroDropsMs = Math.max(0, (startDrops * dropMs) - elapsedSinceRef);

        const isMoistureCoveringHarvest = timeToZeroDropsMs >= remainingHarvestMs;

        if (currentDrops === 0) {
            if (waterLabel) waterLabel.innerText = 'Suelo Seco';
            if (badge) badge.innerHTML = `<span class="text-[13px] font-mono text-os-red bg-os-red/10 border border-os-red/40 px-2 py-0.5 rounded font-bold uppercase animate-pulse">Seco (0/5)</span>`;
            if (dropsText) dropsText.innerHTML = renderMoistureGauge(0, 5);
            if (adviceText) {
                adviceText.innerText = 'Suelo completamente seco. Riega ahora para no perder rendimiento ni arriesgar la cosecha.';
                adviceText.className = 'text-[13px] text-os-red font-semibold';
            }
            if (waterTimeText) {
                waterTimeText.innerText = '¡REGAR YA!';
                waterTimeText.className = 'font-mono text-xs font-bold text-os-red animate-pulse';
            }
            if (btnWater) {
                btnWater.className = 'flex-1 py-2 px-2 text-xs font-mono uppercase bg-os-red text-white font-bold border border-os-red rounded-lg transition cursor-pointer';
                btnWater.innerText = 'Regar (5 Gotas)';
                btnWater.disabled = false;
                btnWater.onclick = () => openWaterPreviewModal(crop.id);
            }
        }
        else if (isMoistureCoveringHarvest) {
            if (waterLabel) waterLabel.innerText = 'Estado Riego';
            if (badge) badge.innerHTML = `<span class="text-[13px] font-mono text-os-green bg-os-green/10 border border-os-green/30 px-2 py-0.5 rounded font-bold uppercase">Protegido</span>`;
            if (dropsText) dropsText.innerHTML = renderMoistureGauge(currentDrops, 5);
            if (adviceText) {
                adviceText.innerText = `Las ${currentDrops} gotas duran ${formatTime(timeToZeroDropsMs)} y cosechas en ${formatTime(remainingHarvestMs)}. No requiere más agua.`;
                adviceText.className = 'text-[13px] text-os-green font-medium';
            }
            if (waterTimeText) {
                waterTimeText.innerText = 'PROTEGIDO';
                waterTimeText.className = 'font-mono text-xs font-bold text-os-green';
            }
            if (btnWater) {
                btnWater.className = 'flex-1 py-2 px-2 text-xs font-mono uppercase bg-os-elevated text-os-muted cursor-not-allowed border border-os-border rounded-lg';
                btnWater.innerText = 'Protegido';
                btnWater.disabled = true;
            }
        }
        else {
            const isCritical = currentDrops === 1;
            if (waterLabel) waterLabel.innerText = isCritical ? 'Riego Urgente en' : 'Humedad Restante';
            
            if (badge) {
                if (!crop.watered) {
                    badge.innerHTML = `<span class="text-[13px] font-mono text-os-blue bg-os-blue/10 border border-os-blue/30 px-2 py-0.5 rounded font-semibold uppercase">2 Gotas Base</span>`;
                } else {
                    badge.innerHTML = `<span class="text-[13px] font-mono ${isCritical ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30' : 'text-os-blue bg-os-blue/10 border border-os-blue/30'} px-2 py-0.5 rounded font-semibold uppercase">Hidratado (${currentDrops}/5)</span>`;
                }
            }

            if (dropsText) {
                dropsText.innerHTML = renderMoistureGauge(currentDrops, 5);
            }

            if (adviceText) {
                if (!crop.watered) {
                    adviceText.innerText = `Consumiendo las 2 gotas base. Se agotarán en ${formatTime(timeToZeroDropsMs)} (1 gota cada ${dbInfo.dropDurationHours}h).`;
                } else {
                    adviceText.innerText = `Quedan ${currentDrops} gotas (~${formatTime(timeToZeroDropsMs)} de humedad). Como faltan ${formatTime(remainingHarvestMs)} para cosechar, requerirá otro riego en ${formatTime(timeToZeroDropsMs)}.`;
                }
                adviceText.className = isCritical ? 'text-[13px] text-amber-400 font-semibold' : 'text-[13px] text-os-muted';
            }

            if (waterTimeText) {
                waterTimeText.innerText = formatTime(timeToZeroDropsMs);
                waterTimeText.className = isCritical ? 'font-mono text-xs font-bold text-amber-400 animate-pulse' : 'font-mono text-xs font-bold text-os-blue';
            }

            if (btnWater) {
                btnWater.className = 'flex-1 bg-os-blue/10 border border-os-blue/40 text-os-blue hover:bg-os-blue hover:text-black py-2 px-2 text-xs font-mono uppercase font-semibold transition rounded-lg cursor-pointer';
                btnWater.innerText = 'Regar';
                btnWater.disabled = false;
                btnWater.onclick = () => openWaterPreviewModal(crop.id);
            }
        }

        if (btnHarvest) {
            btnHarvest.className = "flex-1 border border-os-border text-os-muted hover:border-os-red hover:text-os-red py-1.5 px-2 text-xs font-mono uppercase transition";
            btnHarvest.innerText = "Cancelar";
            btnHarvest.onclick = () => harvestCrop(crop.id);
        }
    });
}



