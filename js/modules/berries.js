import { state, setState, subscribe } from '../state.js';
import { addCrop, updateCrop, removeCrop } from '../db.js';
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
        { id: 'v_acida', qty: 1, name: 'Semilla Muy Ãcida', color: 'bg-yellow-500' }
    ]},
    pomeg: { name: 'Grana (Pomeg)', reqs: [
        { id: 'v_picante', qty: 1, name: 'Semilla Muy Picante', color: 'bg-red-500' },
        { id: 'picante', qty: 1, name: 'Semilla Picante', color: 'bg-red-400' },
        { id: 'amarga', qty: 1, name: 'Semilla Amarga', color: 'bg-green-500' }
    ]},
    kelpsy: { name: 'Algama (Kelpsy)', reqs: [
        { id: 'v_seca', qty: 1, name: 'Semilla Muy Seca', color: 'bg-blue-500' },
        { id: 'seca', qty: 1, name: 'Semilla Seca', color: 'bg-blue-400' },
        { id: 'acida', qty: 1, name: 'Semilla Ãcida', color: 'bg-yellow-400' }
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
        { id: 'v_acida', qty: 1, name: 'Semilla Muy Ãcida', color: 'bg-yellow-500' },
        { id: 'acida', qty: 1, name: 'Semilla Ãcida', color: 'bg-yellow-400' },
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
    aspear: { name: 'Perasi (Aspear)', reqs: [{ id: 'acida', qty: 1, name: 'Semilla Ãcida', color: 'bg-yellow-400' }]}
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
            <div class="flex justify-between items-end mb-8 pb-4 border-b border-os-border">
                <div>
                    <h1 class="text-2xl font-semibold text-os-text">Módulo Botánico</h1>
                    <p class="text-sm text-os-muted mt-1">Cálculo de inventario y monitoreo de suelo.</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] text-os-muted uppercase tracking-widest">Rondas Completadas</p>
                    <p class="text-2xl data-value text-os-green" id="totalHarvested">0</p>
                    <button id="btnResetHarvest" class="text-[10px] text-os-muted hover:text-os-red underline mt-1">Reset</button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- SEED CALCULATOR -->
                <section class="panel p-6">
                    <h2 class="text-sm font-mono text-os-muted uppercase tracking-widest mb-4">Inventario de Semillas</h2>
                    
                    <div class="grid grid-cols-5 gap-2 mb-6">
                        <div><label class="block text-[10px] uppercase text-os-muted mb-1 truncate">Picante</label><input type="number" id="inv_picante" min="0" value="0" class="w-full p-2 text-sm text-center"></div>
                        <div><label class="block text-[10px] uppercase text-os-muted mb-1 truncate">Dulce</label><input type="number" id="inv_dulce" min="0" value="0" class="w-full p-2 text-sm text-center"></div>
                        <div><label class="block text-[10px] uppercase text-os-muted mb-1 truncate">Seca</label><input type="number" id="inv_seca" min="0" value="0" class="w-full p-2 text-sm text-center"></div>
                        <div><label class="block text-[10px] uppercase text-os-muted mb-1 truncate">Amarga</label><input type="number" id="inv_amarga" min="0" value="0" class="w-full p-2 text-sm text-center"></div>
                        <div><label class="block text-[10px] uppercase text-os-muted mb-1 truncate">Ãcida</label><input type="number" id="inv_acida" min="0" value="0" class="w-full p-2 text-sm text-center"></div>
                        
                        <div><label class="block text-[10px] uppercase text-os-red mb-1 truncate font-bold">M. Picante</label><input type="number" id="inv_v_picante" min="0" value="0" class="w-full p-2 text-sm text-center border-os-red/30"></div>
                        <div><label class="block text-[10px] uppercase text-pink-500 mb-1 truncate font-bold">M. Dulce</label><input type="number" id="inv_v_dulce" min="0" value="0" class="w-full p-2 text-sm text-center border-pink-500/30"></div>
                        <div><label class="block text-[10px] uppercase text-blue-500 mb-1 truncate font-bold">M. Seca</label><input type="number" id="inv_v_seca" min="0" value="0" class="w-full p-2 text-sm text-center border-blue-500/30"></div>
                        <div><label class="block text-[10px] uppercase text-green-500 mb-1 truncate font-bold">M. Amarga</label><input type="number" id="inv_v_amarga" min="0" value="0" class="w-full p-2 text-sm text-center border-green-500/30"></div>
                        <div><label class="block text-[10px] uppercase text-yellow-500 mb-1 truncate font-bold">M. Ãcida</label><input type="number" id="inv_v_acida" min="0" value="0" class="w-full p-2 text-sm text-center border-yellow-500/30"></div>
                    </div>
                    
                    <button id="btnCalculateInventory" class="w-full btn-primary py-2 text-sm uppercase tracking-wide mb-6">
                        Procesar Rendimiento
                    </button>
                    
                    <div id="inventoryResults" class="grid grid-cols-2 gap-3 hidden border-t border-os-border pt-4">
                        <!-- Resultados generados por JS -->
                    </div>
                </section>

                <div class="flex flex-col gap-6">
                    <!-- RECIPE LOOKUP -->
                    <section class="panel p-6">
                        <h2 class="text-sm font-mono text-os-muted uppercase tracking-widest mb-4">Base de Díatos Genética</h2>
                        <select id="recipeSelect" class="w-full p-2.5 text-sm mb-4 cursor-pointer">
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
                        <div id="recipeResult" class="bg-os-bg border border-os-border p-3 text-sm text-os-muted min-h-[80px] flex items-center justify-center">
                            Esperando selección...
                        </div>
                    </section>

                    <!-- PLANT BERRY -->
                    <section class="panel p-6">
                        <h2 class="text-sm font-mono text-os-muted uppercase tracking-widest mb-4">Registro de Cultivo</h2>
                        <div class="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label class="block text-[10px] uppercase text-os-muted mb-1 font-mono">Especie</label>
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
                                <label class="block text-[10px] uppercase text-os-muted mb-1 font-mono">Coordenadas / Parcela</label>
                                <input type="text" id="berryLocation" placeholder="Ej. Ruta 104, Loza..." class="w-full p-2 text-sm">
                            </div>
                            <div>
                                <label class="block text-[10px] uppercase text-os-green mb-1 font-mono font-bold">Duración 2 Gotas Base (Hrs)</label>
                                <input type="number" id="berryWaterHours" value="4.0" min="0.5" max="44" step="0.5" class="w-full p-2 text-sm text-center border-os-green/40 font-mono text-os-green" title="Horas antes de que las 2 gotas iniciales se consuman por completo">
                            </div>
                            <div>
                                <label class="block text-[10px] uppercase text-os-muted mb-1 font-mono">Tiempo Ya Transcurrido (Hrs)</label>
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
            <div class="panel p-6 w-full max-w-lg border border-os-border shadow-2xl relative overflow-hidden">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-os-border pb-3 mb-4">
                    <div class="flex items-center gap-2.5">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wailmer-pail.png" class="w-7 h-7 pokemon-sprite">
                        <div>
                            <h2 class="text-sm font-bold text-os-text" id="waterSimTitle">Simulación de Riego // Silph Corp</h2>
                            <p class="text-[10px] font-mono text-os-muted" id="waterSimSubtitle">Análisis de hidratación del suelo</p>
                        </div>
                    </div>
                    <button id="btnCloseWaterPreview1" class="text-os-muted hover:text-white font-mono text-xs">âœ•</button>
                </div>

                <!-- Dynamic Content -->
                <div id="waterSimContent" class="space-y-4 text-xs font-sans">
                    <!-- Injected via JS -->
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-os-border">
                    <button id="btnCloseWaterPreview2" class="px-4 py-2 text-xs font-mono uppercase text-os-muted hover:text-white border border-os-border hover:border-os-muted transition rounded-sm">
                        Esperar / Cancelar
                    </button>
                    <button id="btnConfirmWater" class="px-4 py-2 text-xs font-mono uppercase bg-os-blue hover:bg-blue-600 text-white font-bold transition rounded-sm shadow-md">
                        Regar de Todos Modos
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
                    <div class="flex items-center gap-1 text-[10px] text-gray-400">
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
                        <p class="text-[10px] text-gray-500 uppercase mt-1 mb-1">Plantas</p>
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
    const simulatedPlantTime = Díate.now() - elapsedMs;

    const newCrop = { 
        id: Díate.now().toString(), // Ensure string if DB expects uuid, or keep as number if preferred. Let's use Díate.now() 
        type: type, 
        location: location, 
        initialDryHours: initialDryHours,
        plantedAt: simulatedPlantTime, 
        watered: false,
        wateredAt: null
    };

    const currentCrops = state.crops || [];
    currentCrops.push(newCrop);
    setState('crops', currentCrops); // This will trigger UI update
    
    try {
        await addCrop(newCrop);
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
    const now = Díate.now();
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
            <div class="bg-emerald-950/30 border border-emerald-500/40 p-4 rounded-sm">
                <div class="flex items-center gap-2 mb-2 text-emerald-400 font-bold text-sm">
                    <span>ðŸ›¡ï¸ ¡PROTECCIÓN TOTAL HASTA LA COSECHA!</span>
                </div>
                <p class="text-os-text leading-relaxed mb-3">
                    Como a tu planta le faltan <strong>${formatTime(remainingHarvestMs)}</strong> para cosechar y las 5 gotas duran <strong>${dbInfo.fullMoistureHours} horas</strong>, <strong>el agua cubrirá el 100% del tiempo restante</strong>.
                </p>
                <div class="grid grid-cols-2 gap-2 text-center font-mono text-[11px] bg-os-bg p-2.5 border border-emerald-500/20 mb-2">
                    <div>
                        <span class="text-os-muted block text-[9px] uppercase">Gotas tras regar</span>
                        <span class="text-emerald-400 font-bold">ðŸ’§ðŸ’§ðŸ’§ðŸ’§ðŸ’§ (5/5 Máx)</span>
                    </div>
                    <div>
                        <span class="text-os-muted block text-[9px] uppercase">Próximo riego requerido</span>
                        <span class="text-emerald-400 font-bold">¡NINGUNO! (100% Protegido)</span>
                    </div>
                </div>
            </div>
        `;
        btnConfirm.className = "px-4 py-2 text-xs font-mono uppercase bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition rounded-sm shadow-md";
        btnConfirm.innerText = "Confirmar Riego (100% Protegido)";
    } else {
        const nextWaterInHours = dbInfo.fullMoistureHours;
        content.innerHTML = `
            <div class="bg-amber-950/30 border border-amber-500/40 p-4 rounded-sm">
                <div class="flex items-center gap-2 mb-2 text-amber-400 font-bold text-sm">
                    <span>âš ï¸ ATENCIÓN: NECESITARÃ OTRO RIEGO EN ~${nextWaterInHours} HORAS</span>
                </div>
                <p class="text-os-text leading-relaxed mb-3">
                    En PokéMMO las 5 gotas duran <strong>${nextWaterInHours} horas</strong> (~${dbInfo.dropDurationHours}h por gota). Como aún faltan <strong>${formatTime(remainingHarvestMs)}</strong> para cosechar, el agua se agotará antes de la cosecha.
                </p>
                <div class="grid grid-cols-2 gap-2 text-center font-mono text-[11px] bg-os-bg p-2.5 border border-amber-500/20 mb-3">
                    <div>
                        <span class="text-os-muted block text-[9px] uppercase">Duración de 5 Gotas</span>
                        <span class="text-amber-400 font-bold">~${nextWaterInHours} horas</span>
                    </div>
                    <div>
                        <span class="text-os-muted block text-[9px] uppercase">Siguiente ▶</span>
                        <span class="text-os-red font-bold">En ~${nextWaterInHours} horas</span>
                    </div>
                </div>
                <div class="bg-os-bg/80 border border-os-blue/30 p-2.5 rounded-sm">
                    <p class="text-[11px] text-os-blue leading-relaxed">
                        ðŸ’¡ <strong>Gotas actuales:</strong> Tiene <strong>${currentDrops}/5 gotas</strong> (~${formatTime(timeToZeroDropsMs)} de humedad). Si riegas ahora, restaurarás a 5 gotas inmediatamente.
                    </p>
                </div>
            </div>
        `;
        btnConfirm.className = "px-4 py-2 text-xs font-mono uppercase bg-os-blue hover:bg-blue-600 text-white font-bold transition rounded-sm shadow-md";
        btnConfirm.innerText = "Regar Ahora a 5 Gotas";
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
            crop.wateredAt = Díate.now();
            
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
        if (Díate.now() - crop.plantedAt >= dbInfo.totalHours * 60 * 60 * 1000) {
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

export function renderCrops() {
    const container = document.getElementById('berriesContainer');
    if(!container) return;
    
    const crops = state.crops || [];
    container.innerHTML = '';
    
    crops.forEach(crop => {
        const dbInfo = BERRY_DB[crop.type] || BERRY_DB.zanama;
        const card = document.createElement('div');
        card.id = `crop-card-${crop.id}`;
        card.className = `panel p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden`;
        
        card.innerHTML = `
            <div class="z-10 relative">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${dbInfo.sprite}.png" class="w-8 h-8 pokemon-sprite -ml-1" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'">
                        <div>
                            <h3 class="text-sm font-semibold text-os-text">${dbInfo.name}</h3>
                            <p class="text-[10px] text-os-muted font-mono">ðŸ“ ${crop.location} <span class="text-os-green">(${dbInfo.yield || '5-7'})</span></p>
                        </div>
                    </div>
                    <div id="crop-badge-${crop.id}"></div>
                </div>

                <!-- Indicador de Fase / Etapa -->
                <div id="crop-stage-${crop.id}" class="text-[10px] font-mono mb-2"></div>

                <!-- DROplets & Moisture status -->
                <div class="bg-os-bg border border-os-border p-2 mb-3 rounded-sm">
                    <div class="flex justify-between items-center text-[10px] font-mono mb-1">
                        <span class="text-os-muted uppercase">Humedad Suelo:</span>
                        <span id="crop-drops-${crop.id}" class="text-os-blue font-bold">ðŸ’§ðŸ’§âšªâšªâšª (2/5)</span>
                    </div>
                    <p id="crop-advice-${crop.id}" class="text-[10px] text-os-muted leading-tight">Calculando estado de hidratación...</p>
                </div>

                <div class="grid grid-cols-2 gap-px bg-os-border mb-3 text-center border border-os-border">
                    <div class="bg-os-bg p-2">
                        <p id="crop-water-label-${crop.id}" class="text-[9px] text-os-muted uppercase tracking-widest mb-1">Humedad Restante</p>
                        <p id="crop-water-time-${crop.id}" class="font-mono text-xs font-bold text-os-text">--:--:--</p>
                    </div>
                    <div class="bg-os-bg p-2">
                        <p class="text-[9px] text-os-muted uppercase tracking-widest mb-1">Cosecha Total</p>
                        <p id="crop-harvest-time-${crop.id}" class="font-mono text-xs font-bold text-os-text">--:--:--</p>
                    </div>
                </div>

                <div class="w-full bg-os-bg border border-os-border h-1.5 mb-4">
                    <div id="crop-progress-${crop.id}" class="h-1.5 progress-bar-transition w-0 bg-os-green"></div>
                </div>
            </div>
            <div class="flex gap-2 mt-auto z-10 relative">
                <button id="btn-water-${crop.id}" class="flex-1 border border-os-blue text-os-blue hover:bg-os-blue hover:text-white py-1.5 px-2 text-xs font-mono uppercase transition">Regar</button>
                <button id="btn-harvest-${crop.id}" class="flex-1 border border-os-border text-os-muted hover:border-os-red hover:text-os-red py-1.5 px-2 text-xs font-mono uppercase transition">Cancelar</button>
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
    const now = Díate.now();
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
                stageText.innerHTML = `<span class="text-os-green font-bold">ðŸŒ¾ ¡COSECHA LISTA!</span>`;
            } else if (progressPercent < 25) {
                stageText.innerHTML = `<span class="text-os-muted">🌱 Fase 1/4: Semilla (${progressPercent.toFixed(0)}%)</span>`;
            } else if (progressPercent < 50) {
                stageText.innerHTML = `<span class="text-emerald-400">ðŸŒ¿ Fase 2/4: Brote (${progressPercent.toFixed(0)}%)</span>`;
            } else if (progressPercent < 75) {
                stageText.innerHTML = `<span class="text-blue-400">ðŸŒ³ Fase 3/4: Crecimiento (${progressPercent.toFixed(0)}%)</span>`;
            } else {
                stageText.innerHTML = `<span class="text-pink-400">ðŸŒ¸ Fase 4/4: Floración (${progressPercent.toFixed(0)}%)</span>`;
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
            if (badge) badge.innerHTML = `<span class="text-[9px] font-mono text-os-green bg-os-green/10 border border-os-green/30 px-1.5 py-0.5 rounded animate-bounce">ðŸŒ¾ COSECHAR</span>`;

            if (remainingWiltMs <= 0) {
                if (waterTimeText) {
                    waterTimeText.innerText = '¡PODRIDA!';
                    waterTimeText.className = 'font-mono text-xs font-bold text-os-red';
                }
                if (dropsText) dropsText.innerHTML = '<span class="text-os-red">ðŸ’€ Planta Muerta (Excedió 8h)</span>';
                if (adviceText) {
                    adviceText.innerText = 'âŒ Han pasado más de 8 horas desde la maduración. La planta se marchitó.';
                    adviceText.className = 'text-[10px] text-os-red font-bold';
                }
            } else {
                if (waterTimeText) {
                    waterTimeText.innerText = formatTime(remainingWiltMs);
                    waterTimeText.className = remainingWiltMs < (2 * 3600 * 1000) ? 'font-mono text-xs font-bold text-os-red animate-pulse' : 'font-mono text-xs font-bold text-amber-400';
                }
                if (dropsText) dropsText.innerHTML = '<span class="text-os-green font-bold">âœ¨ Frutos Listos (' + (dbInfo.yield || '5-7') + ')</span>';
                if (adviceText) {
                    adviceText.innerText = `ðŸŒ¾ ¡Cosecha lista! Tienes ${formatTime(remainingWiltMs)} antes de que empiece a marchitarse.`;
                    adviceText.className = 'text-[10px] text-os-green font-medium';
                }
            }

            if (btnWater) {
                btnWater.className = 'flex-1 py-1.5 px-2 text-xs font-mono uppercase bg-os-green text-black font-bold border border-os-green animate-pulse';
                btnWater.innerText = 'ðŸŒ¾ Cosechar';
                btnWater.disabled = false;
                btnWater.onclick = () => harvestCrop(crop.id);
            }
            if (btnHarvest) {
                card.className = "panel p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden border-os-green shadow-[0_0_15px_rgba(16,185,129,0.2)]";
                btnHarvest.className = "flex-1 border border-os-border text-os-muted hover:border-os-red hover:text-os-red py-1.5 px-2 text-xs font-mono uppercase transition";
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

        let dropsIcons = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= currentDrops) {
                dropsIcons += 'ðŸ’§';
            } else {
                dropsIcons += 'âšª';
            }
        }

        const isMoistureCoveringHarvest = timeToZeroDropsMs >= remainingHarvestMs;

        if (currentDrops === 0) {
            if (waterLabel) waterLabel.innerText = '¡SUELO SECO!';
            if (badge) badge.innerHTML = `<span class="text-[9px] font-mono text-os-red bg-os-red/10 border border-os-red/40 px-1.5 py-0.5 rounded animate-pulse">ðŸš¨ SECO (0/5)</span>`;
            if (dropsText) dropsText.innerHTML = `<span class="text-os-red font-bold animate-pulse">${dropsIcons} (0/5 ¡SECO!)</span>`;
            if (adviceText) {
                adviceText.innerText = 'ðŸš¨ ¡EL SUELO ESTÃ SECO! Riega ahora para no perder rendimiento ni arriesgar la cosecha.';
                adviceText.className = 'text-[10px] text-os-red font-bold animate-pulse';
            }
            if (waterTimeText) {
                waterTimeText.innerText = '¡REGAR YA!';
                waterTimeText.className = 'font-mono text-xs font-bold text-os-red animate-pulse';
            }
            if (btnWater) {
                btnWater.className = 'flex-1 py-1.5 px-2 text-xs font-mono uppercase bg-os-red text-white font-bold border border-os-red animate-bounce';
                btnWater.innerText = 'ðŸ’§ Regar (5 Gotas)';
                btnWater.disabled = false;
                btnWater.onclick = () => openWaterPreviewModal(crop.id);
            }
        }
        else if (isMoistureCoveringHarvest) {
            if (waterLabel) waterLabel.innerText = 'Estado Riego';
            if (badge) badge.innerHTML = `<span class="text-[9px] font-mono text-os-green bg-os-green/10 border border-os-green/30 px-1.5 py-0.5 rounded">ðŸ›¡ï¸ PROTEGIDO</span>`;
            if (dropsText) dropsText.innerHTML = `<span class="text-os-green font-bold">${dropsIcons} (${currentDrops}/5 Gotas)</span>`;
            if (adviceText) {
                adviceText.innerText = `ðŸ›¡ï¸ ¡PROTEGIDO! Las ${currentDrops} gotas duran ${formatTime(timeToZeroDropsMs)} y cosechas en ${formatTime(remainingHarvestMs)}. ¡No requerirá más agua!`;
                adviceText.className = 'text-[10px] text-os-green font-medium';
            }
            if (waterTimeText) {
                waterTimeText.innerText = 'PROTEGIDO';
                waterTimeText.className = 'font-mono text-xs font-bold text-os-green';
            }
            if (btnWater) {
                btnWater.className = 'flex-1 py-1.5 px-2 text-xs font-mono uppercase bg-os-border/20 text-os-muted cursor-not-allowed border border-os-border';
                btnWater.innerText = 'Protegido';
                btnWater.disabled = true;
            }
        }
        else {
            const isCritical = currentDrops === 1;
            if (waterLabel) waterLabel.innerText = isCritical ? '¡Riego Urgente en!' : 'Humedad Restante';
            
            if (badge) {
                if (!crop.watered) {
                    badge.innerHTML = `<span class="text-[9px] font-mono text-os-blue bg-os-blue/10 border border-os-blue/30 px-1.5 py-0.5 rounded">â³ 2 GOTAS BASE</span>`;
                } else {
                    badge.innerHTML = `<span class="text-[9px] font-mono ${isCritical ? 'text-amber-400 bg-amber-400/10 border border-amber-400/30' : 'text-os-blue bg-os-blue/10 border border-os-blue/30'} px-1.5 py-0.5 rounded">ðŸ’§ HIDRATADO (${currentDrops}/5)</span>`;
                }
            }

            if (dropsText) {
                const colorClass = isCritical ? 'text-amber-400 font-bold' : (currentDrops >= 3 ? 'text-os-blue font-bold' : 'text-cyan-400 font-bold');
                dropsText.innerHTML = `<span class="${colorClass}">${dropsIcons} (${currentDrops}/5 Gotas)</span>`;
            }

            if (adviceText) {
                if (!crop.watered) {
                    adviceText.innerText = `â³ Consumiendo las 2 gotas base. Se agotarán en ${formatTime(timeToZeroDropsMs)} (1 gota se pierde cada ${dbInfo.dropDurationHours}h).`;
                } else {
                    adviceText.innerText = `ðŸ’§ Quedan ${currentDrops} gotas (~${formatTime(timeToZeroDropsMs)} de humedad). Como faltan ${formatTime(remainingHarvestMs)} para cosechar, requerirá otro riego en ${formatTime(timeToZeroDropsMs)}.`;
                }
                adviceText.className = isCritical ? 'text-[10px] text-amber-400 font-bold' : 'text-[10px] text-os-muted';
            }

            if (waterTimeText) {
                waterTimeText.innerText = formatTime(timeToZeroDropsMs);
                waterTimeText.className = isCritical ? 'font-mono text-xs font-bold text-amber-400 animate-pulse' : 'font-mono text-xs font-bold text-os-blue';
            }

            if (btnWater) {
                btnWater.className = 'flex-1 border border-os-blue text-os-blue hover:bg-os-blue hover:text-white py-1.5 px-2 text-xs font-mono uppercase transition';
                btnWater.innerText = 'Regar Ahora';
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



