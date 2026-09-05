import { state, setState, subscribe } from '../state.js';
import { addCrop, updateCrop, removeCrop, getCrops } from '../db.js';
import { formatTime, formatMoney } from '../utils/format.js';
import { t, currentLang } from '../i18n.js';
// We're importing DOM functions if they existed, but we'll manipulate directly for now

export const BERRY_DB = {
    zanama: { 
        name: 'Zanama (Leppa)', 
        totalHours: 20, 
        stageHours: 5.0,
        dropDurationHours: 2.35,   // En PokéMMO 5 gotas duran ~11.75h (1 gota cada 2h 21m)
        initialDryHours: 4.7,      // Las 2 gotas base duran ~4.7h
        fullMoistureHours: 11.75,  // Las 5 gotas llenas duran ~11.75h antes de secarse
        yield: '5-7 bayas',
        effect: 'Restaura 10 PP',
        sprite: 'leppa-berry'
    },
    basicas: { 
        name: 'Básicas (Oran, Cheri, Pecha...)', 
        totalHours: 16, 
        stageHours: 4.0,
        dropDurationHours: 1.9,    // 5 gotas duran ~9.5h
        initialDryHours: 3.8,      // Las 2 gotas base duran ~3.8h
        fullMoistureHours: 9.5,    // Las 5 gotas duran 9.5h
        yield: '3-6 bayas',
        effect: 'Cura Estados / 10 HP',
        sprite: 'cheri-berry'
    },
    curativas: { 
        name: 'Ziuela (Lum) / Zidra (Sitrus)', 
        totalHours: 44, 
        stageHours: 11.0,
        dropDurationHours: 3.5,    // 5 gotas duran ~17.5h
        initialDryHours: 7.0,      // Las 2 gotas base duran 7.0h
        fullMoistureHours: 17.5,   // Las 5 gotas duran 17.5h
        yield: '7-10 bayas',
        effect: 'Cura todos los estados / 25% PS',
        sprite: 'sitrus-berry'
    },
    ev: { 
        name: 'Reductoras EVs (Grana, Algama...)', 
        totalHours: 44, 
        stageHours: 11.0,
        dropDurationHours: 3.5,    // 5 gotas duran ~17.5h
        initialDryHours: 7.0,      // Las 2 gotas base duran 7.0h
        fullMoistureHours: 17.5,   // Las 5 gotas duran 17.5h
        yield: '7-9 bayas',
        effect: '-10 EVs en Stat + Felicidad',
        sprite: 'pomeg-berry'
    },
    resistencias: { 
        name: 'Resistencias Tipo (Occa, Yache...)', 
        totalHours: 42, 
        stageHours: 10.5,
        dropDurationHours: 3.35,   // 5 gotas duran ~16.75h
        initialDryHours: 6.7,      // Las 2 gotas base duran 6.7h
        fullMoistureHours: 16.75,  // Las 5 gotas duran 16.75h
        yield: '7-9 bayas',
        effect: 'Debilita ataques supereficaces',
        sprite: 'yache-berry'
    },
    raras: { 
        name: 'Estadísticas / Raras (Liechi, Salac...)', 
        totalHours: 67, 
        stageHours: 16.75,
        dropDurationHours: 4.5,    // 5 gotas duran ~22.5h
        initialDryHours: 9.0,      // Las 2 gotas base duran 9.0h
        fullMoistureHours: 22.5,   // Las 5 gotas duran 22.5h
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

export const SEED_NAMES_EN = {
    picante: 'Plain Spicy Seed',
    dulce: 'Plain Sweet Seed',
    seca: 'Plain Dry Seed',
    amarga: 'Plain Bitter Seed',
    acida: 'Plain Sour Seed',
    v_picante: 'Very Spicy Seed',
    v_dulce: 'Very Sweet Seed',
    v_seca: 'Very Dry Seed',
    v_amarga: 'Very Bitter Seed',
    v_acida: 'Very Sour Seed'
};

export function getSeedName(id) {
    if (typeof currentLang !== 'undefined' && currentLang === 'en') {
        return SEED_NAMES_EN[id] || id;
    }
    return SEED_NAMES[id] || id;
};

export const SEED_NAMES = {
    picante: 'Semilla Picante',
    dulce: 'Semilla Dulce',
    seca: 'Semilla Seca',
    amarga: 'Semilla Amarga',
    acida: 'Semilla Ácida',
    v_picante: 'Semilla Muy Picante',
    v_dulce: 'Semilla Muy Dulce',
    v_seca: 'Semilla Muy Seca',
    v_amarga: 'Semilla Muy Amarga',
    v_acida: 'Semilla Muy Ácida'
};

export const SEED_COLORS = {
    picante: 'text-red-500 dark:text-red-400',
    dulce: 'text-pink-500 dark:text-pink-400',
    seca: 'text-blue-500 dark:text-blue-400',
    amarga: 'text-green-600 dark:text-green-400',
    acida: 'text-yellow-600 dark:text-yellow-400',
    v_picante: 'text-red-600 dark:text-red-300 font-bold',
    v_dulce: 'text-pink-600 dark:text-pink-300 font-bold',
    v_seca: 'text-blue-600 dark:text-blue-300 font-bold',
    v_amarga: 'text-green-700 dark:text-green-300 font-bold',
    v_acida: 'text-yellow-700 dark:text-yellow-300 font-bold'
};

export const DEFAULT_SEED_PRICES = {
    picante: 750,
    dulce: 750,
    seca: 750,
    amarga: 750,
    acida: 750,
    v_picante: 1800,
    v_dulce: 1200,
    v_seca: 1200,
    v_amarga: 1200,
    v_acida: 1200
};

export const DEFAULT_BERRY_PRICES = {
    leppa: 1050,
    lum: 1500,
    sitrus: 1300,
    pomeg: 950,
    kelpsy: 950,
    qualot: 950,
    hondew: 950,
    grepa: 950,
    tamato: 950,
    cheri: 550,
    pecha: 550,
    rawst: 550,
    chesto: 550,
    aspear: 550
};

export const EXTRACTION_PROFILES = {
    leppa: {
        picante: 0.26,
        v_picante: 0.12,
        dulce: 0.30,
        v_dulce: 0.05,
        amarga: 0.23,
        v_amarga: 0.04
    },
    lum: {
        seca: 0.23,
        v_seca: 0.10,
        picante: 0.23,
        v_picante: 0.10,
        dulce: 0.24,
        v_dulce: 0.10
    },
    sitrus: {
        dulce: 0.23,
        v_dulce: 0.10,
        amarga: 0.23,
        v_amarga: 0.10,
        acida: 0.24,
        v_acida: 0.10
    },
    pomeg: {
        picante: 0.38,
        v_picante: 0.15,
        amarga: 0.37,
        v_amarga: 0.10
    },
    kelpsy: {
        seca: 0.38,
        v_seca: 0.15,
        acida: 0.37,
        v_acida: 0.10
    },
    qualot: {
        dulce: 0.38,
        v_dulce: 0.15,
        picante: 0.37,
        v_picante: 0.10
    },
    hondew: {
        amarga: 0.38,
        v_amarga: 0.15,
        seca: 0.37,
        v_seca: 0.10
    },
    grepa: {
        acida: 0.38,
        v_acida: 0.15,
        dulce: 0.37,
        v_dulce: 0.10
    },
    tamato: {
        picante: 0.38,
        v_picante: 0.15,
        seca: 0.37,
        v_seca: 0.10
    },
    cheri: {
        picante: 0.70,
        v_picante: 0.30
    },
    pecha: {
        dulce: 0.70,
        v_dulce: 0.30
    },
    rawst: {
        amarga: 0.70,
        v_amarga: 0.30
    },
    chesto: {
        seca: 0.70,
        v_seca: 0.30
    },
    aspear: {
        acida: 0.70,
        v_acida: 0.30
    }
};

export const BERRY_GROWTH_HOURS = {
    leppa: 20,
    lum: 44,
    sitrus: 44,
    pomeg: 44,
    kelpsy: 44,
    qualot: 44,
    hondew: 44,
    grepa: 44,
    tamato: 44,
    cheri: 16,
    pecha: 16,
    rawst: 16,
    chesto: 16,
    aspear: 16
};

export function getSavedGTLPrices() {
    try {
        const saved = localStorage.getItem('pokemmo_berry_gtl_prices');
        if (saved) return { ...DEFAULT_SEED_PRICES, ...JSON.parse(saved) };
    } catch(e) {}
    return { ...DEFAULT_SEED_PRICES };
}

export function saveGTLPrices(prices) {
    try {
        localStorage.setItem('pokemmo_berry_gtl_prices', JSON.stringify(prices));
    } catch(e) {}
}

export function getSavedBerryPrices() {
    try {
        const saved = localStorage.getItem('pokemmo_berry_raw_prices');
        if (saved) return { ...DEFAULT_BERRY_PRICES, ...JSON.parse(saved) };
    } catch(e) {}
    return { ...DEFAULT_BERRY_PRICES };
}

export function saveBerryPrices(prices) {
    try {
        localStorage.setItem('pokemmo_berry_raw_prices', JSON.stringify(prices));
    } catch(e) {}
}

export function getSavedCalcConfig() {
    try {
        const saved = localStorage.getItem('pokemmo_berry_calc_config');
        if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
        berry: 'leppa',
        plots: 156,
        yield: 6.0,
        toolCost: 350,
        gtlFee: 5
    };
}

export function saveCalcConfig(config) {
    try {
        const current = getSavedCalcConfig();
        localStorage.setItem('pokemmo_berry_calc_config', JSON.stringify({ ...current, ...config }));
    } catch(e) {}
}

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
                        <span class="text-xl font-pokemon text-amber-400">${t('berry_header_title')}</span>
                        <span class="text-[13px] font-mono uppercase bg-os-elevated border border-os-border text-os-green px-2 py-0.5 rounded font-semibold">${t('berry_header_badge')}</span>
                    </div>
                    <p class="text-xs text-os-muted mt-1">${t('berry_header_desc')}</p>
                </div>
                <div class="text-right flex items-center gap-3">
                    <div class="bg-os-surface border border-os-border px-3.5 py-1.5 rounded-xl text-right">
                        <p class="text-[13px] text-os-muted uppercase font-mono font-semibold tracking-wider">${t('berry_rounds_harvested')}</p>
                        <p class="text-xl font-mono font-bold text-os-green tabular-nums" id="totalHarvested">0</p>
                    </div>
                    <button id="btnResetHarvest" class="text-xs font-mono text-os-muted hover:text-os-red transition border border-os-border hover:border-os-red/40 p-2.5 rounded-lg cursor-pointer flex items-center justify-center" title="${t('btn_reset_harvest')}">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <!-- SEED CALCULATOR -->
                <section class="panel p-5 rounded-xl">
                    <h2 class="text-xs font-mono text-os-muted uppercase tracking-wider mb-4 font-semibold">${t('seed_inventory')}</h2>
                    
                    <div class="grid grid-cols-5 gap-2 mb-5">
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">${currentLang === 'en' ? 'Spicy' : 'Picante'}</label><input type="number" id="inv_picante" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">${currentLang === 'en' ? 'Sweet' : 'Dulce'}</label><input type="number" id="inv_dulce" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">${currentLang === 'en' ? 'Dry' : 'Seca'}</label><input type="number" id="inv_seca" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">${currentLang === 'en' ? 'Bitter' : 'Amarga'}</label><input type="number" id="inv_amarga" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        <div><label class="block text-[13px] uppercase text-os-muted mb-1 truncate">${currentLang === 'en' ? 'Sour' : 'Ácida'}</label><input type="number" id="inv_acida" min="0" value="0" class="w-full p-2 text-xs text-center font-mono"></div>
                        
                        <div><label class="block text-[13px] uppercase text-os-red mb-1 truncate font-bold">${currentLang === 'en' ? 'V. Spicy' : 'M. Picante'}</label><input type="number" id="inv_v_picante" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-os-red/40"></div>
                        <div><label class="block text-[13px] uppercase text-pink-400 mb-1 truncate font-bold">${currentLang === 'en' ? 'V. Sweet' : 'M. Dulce'}</label><input type="number" id="inv_v_dulce" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-pink-500/40"></div>
                        <div><label class="block text-[13px] uppercase text-blue-400 mb-1 truncate font-bold">${currentLang === 'en' ? 'V. Dry' : 'M. Seca'}</label><input type="number" id="inv_v_seca" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-blue-500/40"></div>
                        <div><label class="block text-[13px] uppercase text-green-400 mb-1 truncate font-bold">${currentLang === 'en' ? 'V. Bitter' : 'M. Amarga'}</label><input type="number" id="inv_v_amarga" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-green-500/40"></div>
                        <div><label class="block text-[13px] uppercase text-yellow-400 mb-1 truncate font-bold">${currentLang === 'en' ? 'V. Sour' : 'M. Ácida'}</label><input type="number" id="inv_v_acida" min="0" value="0" class="w-full p-2 text-xs text-center font-mono border-yellow-500/40"></div>
                    </div>
                    
                    <button id="btnCalculateInventory" class="w-full btn-primary py-2.5 text-xs font-mono uppercase tracking-wider mb-4 cursor-pointer">
                        Calcular Producción
                    </button>
                    
                    <div id="inventoryResults" class="grid grid-cols-2 gap-3 hidden border-t border-os-border pt-4">
                        <!-- Resultados generados por JS -->
                    </div>
                </section>

                <div class="flex flex-col gap-6">
                    <!-- RECIPE LOOKUP -->
                    <section class="panel p-5 rounded-xl">
                        <h2 class="text-xs font-mono text-os-muted uppercase tracking-wider mb-4 font-semibold">${t('berry_recipes')}</h2>
                        <select id="recipeSelect" class="w-full p-2.5 text-xs mb-4 cursor-pointer rounded-lg bg-os-bg border border-os-border text-os-text font-mono">
                            <option value="" disabled selected>${t('berry_consult')}</option>
                            <optgroup label="${currentLang === 'en' ? 'Most Profitable' : 'Más Rentables'}">
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
                            <optgroup label="${currentLang === 'en' ? 'Basic Status Berries' : 'Básicas (Estados)'}">
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
                    <section class="panel p-4 sm:p-5 rounded-xl">
                        <h2 class="text-xs font-tech text-os-muted uppercase tracking-wider mb-4 font-bold">Plantación de Bayas</h2>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div>
                                <label class="block text-[13px] uppercase text-os-muted mb-1 font-mono">Especie</label>
                                <select id="berryType" class="w-full p-2.5 text-sm cursor-pointer min-h-[44px]">
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
                                <input type="text" id="berryLocation" placeholder="Ej. Ruta 104, Loza..." class="w-full p-2.5 text-sm min-h-[44px]">
                            </div>
                            <div>
                                <label class="block text-[13px] uppercase text-os-muted mb-1 font-mono">Tiempo Ya Transcurrido (Hrs)</label>
                                <input type="number" id="berryElapsed" placeholder="${currentLang === 'en' ? '0 (just planted)' : '0 (recién plantada)'}" min="0" step="0.5" class="w-full p-2.5 text-sm min-h-[44px]" title="${currentLang === 'en' ? 'If planted a few hours ago, enter elapsed hours' : 'Si la plantaste hace algunas horas, ingresa cuántas horas han pasado'}">
                            </div>
                            <div class="flex items-end">
                                <label class="flex items-center gap-2.5 p-2.5 bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] rounded-lg cursor-pointer w-full min-h-[44px] select-none hover:border-[#FFC800] transition">
                                    <input type="checkbox" id="berryWateredAtPlant" checked class="w-4 h-4 rounded accent-[#10B981] cursor-pointer">
                                    <span class="text-xs font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8]">Regada al plantar (5 gotas llenas)</span>
                                </label>
                            </div>
                        </div>
                        <button id="btnPlantBerry" class="w-full min-h-[44px] border border-os-green text-os-green hover:bg-os-green hover:text-white transition py-2.5 text-sm uppercase tracking-wide font-tech font-bold rounded-lg cursor-pointer flex items-center justify-center">
                            Plantar Baya
                        </button>
                    </section>
                </div>
            </div>

            <!-- ACTIVE CROPS -->
            <div class="flex items-center justify-between px-1 mb-2">
                <span class="font-tech font-bold text-sm uppercase text-[#1C1C17] dark:text-[#F4F1E8] tracking-wider">${t('berry_active_plots', 'Active Berry Plots')}</span>
            </div>
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
// CALCULADORA DE RENTABILIDAD GTL (Trituración vs Venta)
// ==========================================
export function renderProfitCalculatorHTML() {
    return `
        <section id="panel-berry-profit" class="panel p-5 sm:p-6 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[3px_4px_0px_#2B2B2B] dark:shadow-[3px_4px_0px_#000] mb-8">
            <!-- Header -->
            <div class="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-[#2B2B2B]/20 dark:border-[#35352E]">
                <div class="flex items-center gap-2.5">
                    <div class="p-2 rounded-lg bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E]">
                        <svg class="w-5 h-5 text-[#D97706] dark:text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 class="text-sm sm:text-base font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8]">
                            ${t('calc_title')}
                        </h2>
                        <p class="text-xs font-sans text-[#5F5A4D] dark:text-[#A8A594]">
                            Simulador económico de trituración ($350/herramienta), reserva de semillas para replantar y venta de excedentes en el mercado.
                        </p>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs font-mono uppercase bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] px-2.5 py-1 rounded-md font-bold">
                        ${t('calc_economic_module')}
                    </span>
                </div>
            </div>

            <!-- Parámetros Principales de Cultivo -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <!-- ${t('param_berry')} -->
                <div>
                    <label class="block text-[13px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                        Especie de Baya
                    </label>
                    <select id="profitBerrySelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                        <optgroup label="${currentLang === 'en' ? 'Most Popular / Lucrative' : 'Más Populares / Lucrativas'}">
                            <option value="leppa" selected>Zanama (Leppa) - PP / 20h</option>
                            <option value="lum">Ziuela (Lum) - Estados / 44h</option>
                            <option value="sitrus">Zidra (Sitrus) - PS / 44h</option>
                        </optgroup>
                        <optgroup label="Reductoras de EVs (44h)">
                            <option value="pomeg">Grana (Pomeg) - HP</option>
                            <option value="kelpsy">Algama (Kelpsy) - Ataque</option>
                            <option value="qualot">Ispero (Qualot) - Defensa</option>
                            <option value="hondew">Meluce (Hondew) - Atq. Esp.</option>
                            <option value="grepa">Uva (Grepa) - Def. Esp.</option>
                            <option value="tamato">Tamate (Tamato) - Velocidad</option>
                        </optgroup>
                        <optgroup label="${currentLang === 'en' ? 'Basic (16h)' : 'Básicas (16h)'}">
                            <option value="cheri">Zreza (Cheri) - Picante</option>
                            <option value="pecha">Meloc (Pecha) - Dulce</option>
                            <option value="rawst">Safre (Rawst) - Amarga</option>
                            <option value="chesto">Atania (Chesto) - Seca</option>
                            <option value="aspear">Perasi (Aspear) - Ácida</option>
                        </optgroup>
                    </select>
                </div>

                <!-- Parcelas Sembradas con Presets -->
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-[13px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594]">
                            Parcelas
                        </label>
                        <div class="flex gap-1">
                            <button type="button" onclick="window.setProfitPlots(156)" class="text-[11px] font-tech font-bold uppercase px-2 py-0.5 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer shadow-sm">
                                156 Loza
                            </button>
                            <button type="button" onclick="window.setProfitPlots(84)" class="text-[11px] font-tech font-bold uppercase px-2 py-0.5 rounded bg-[#EDE8DC] dark:bg-[#2E2E27] text-[#1C1C17] dark:text-[#F4F1E8] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] cursor-pointer shadow-sm">
                                84 Hoenn
                            </button>
                        </div>
                    </div>
                    <input type="number" id="profitPlots" value="156" min="1" max="2000" class="w-full p-2.5 text-xs font-mono text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                </div>

                <!-- Rendimiento Promedio -->
                <div>
                    <label class="block text-[13px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                        Rendimiento (Bayas/Planta)
                    </label>
                    <select id="profitYieldSelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                        <option value="5.0">5.0 bayas (Mínimo sin regar)</option>
                        <option value="5.5">5.5 bayas (Riego moderado)</option>
                        <option value="6.0" selected>6.0 bayas (Promedio normal regado)</option>
                        <option value="6.5">6.5 bayas (Riego regular constante)</option>
                        <option value="7.0">7.0 bayas (Máximo perfecto)</option>
                    </select>
                </div>

                <!-- Costos Operativos -->
                <div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <label class="block text-[13px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1 truncate" title="Costo por cada herramienta de extracción en floristerías NPC">
                                Herramienta ($)
                            </label>
                            <input type="number" id="profitToolCost" value="350" min="0" step="10" class="w-full p-2 text-xs font-mono text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                        </div>
                        <div>
                            <label class="block text-[13px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1 truncate" title="Comisión o retención de venta en el GTL">
                                Tasa GTL (%)
                            </label>
                            <input type="number" id="profitGTLFee" value="5" min="0" max="20" step="1" class="w-full p-2 text-xs font-mono text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fila de Precios de Mercado GTL para las Semillas y la Baya -->
            <div class="bg-[#EDE8DC] dark:bg-[#1E1E1A] border border-[#2B2B2B] dark:border-[#33332D] p-4 rounded-xl mb-5 shadow-inner">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-1.5">
                            <span>${t('gtl_prices_title')}</span>
                        </span>
                        <span id="profitSaveStatus" class="text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded font-medium transition">
                            ${t('gtl_saved_tag')}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <button type="button" id="btnSaveGTLPrices" class="text-[11px] font-tech font-bold uppercase tracking-wider text-[#10B981] hover:bg-[#10B981] hover:text-black border border-[#10B981]/40 px-2.5 py-1 rounded transition cursor-pointer">
                            Guardar Precios
                        </button>
                        <button type="button" id="btnResetGTLPrices" class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#E63946] underline cursor-pointer">
                            Restablecer Precios Sugeridos
                        </button>
                    </div>
                </div>
                
                <div id="seedPricesInputsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                    <!-- Se inyecta dinámicamente según la baya seleccionada -->
                </div>
            </div>

            <!-- Contenedor Dinámico de Resultados -->
            <div id="profitResultsContainer">
                <!-- Se inyectan métricas, veredicto y desglose financiero -->
            </div>
        </section>
    `;
}

export function showSaveIndicator(msg = 'Precios guardados en memoria') {
    const status = document.getElementById('profitSaveStatus');
    if (status) {
        status.innerText = msg;
        status.className = 'text-[11px] font-mono text-[#10B981] bg-[#10B981]/25 border border-[#10B981]/60 px-2 py-0.5 rounded font-bold transition';
        if (status._timer) clearTimeout(status._timer);
        status._timer = setTimeout(() => {
            status.innerText = 'Precios guardados en memoria';
            status.className = 'text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded font-medium transition';
        }, 2200);
    }
}

export function renderSeedPriceInputs(berryKey) {
    const container = document.getElementById('seedPricesInputsGrid');
    if (!container) return;

    const recipe = RECIPES[berryKey];
    const extraction = EXTRACTION_PROFILES[berryKey] || EXTRACTION_PROFILES.leppa;
    const savedSeedPrices = getSavedGTLPrices();
    const savedBerryPrices = getSavedBerryPrices();

    const berryPrice = savedBerryPrices[berryKey] !== undefined ? savedBerryPrices[berryKey] : (DEFAULT_BERRY_PRICES[berryKey] || 1000);

    // Semillas involucradas (las necesarias para replantar + las producidas al triturar)
    const seedIds = Array.from(new Set([
        ...(recipe ? recipe.reqs.map(r => r.id) : []),
        ...Object.keys(extraction)
    ]));

    let html = `
        <!-- Baya Cruda en GTL -->
        <div class="bg-[#FAF8F2] dark:bg-[#242420] p-2.5 rounded-lg border border-[#2B2B2B]/30 dark:border-[#35352E]">
            <label class="block text-[11px] font-mono uppercase font-bold text-[#D97706] dark:text-[#F59E0B] mb-1 truncate" title="Precio estimado de venta por unidad de baya cruda en el GTL">
                ${recipe ? recipe.name.split(' ')[0] : 'Baya'} (GTL)
            </label>
            <div class="relative">
                <span class="absolute left-2 top-1 text-xs font-mono text-[#5F5A4D]">$</span>
                <input type="number" id="price_berry_${berryKey}" value="${berryPrice}" min="1" step="1"
                    class="w-full pl-5 pr-1 py-1 text-xs font-mono text-center rounded bg-[#EDE8DC] dark:bg-[#1E1E1A] border border-[#2B2B2B]/40 dark:border-[#33332D] text-[#1C1C17] dark:text-[#F4F1E8]">
            </div>
        </div>
    `;

    seedIds.forEach(id => {
        const name = SEED_NAMES[id] || id;
        const color = SEED_COLORS[id] || 'text-[#1C1C17]';
        const price = savedSeedPrices[id] !== undefined ? savedSeedPrices[id] : (DEFAULT_SEED_PRICES[id] || 750);

        html += `
            <div class="bg-[#FAF8F2] dark:bg-[#242420] p-2.5 rounded-lg border border-[#2B2B2B]/30 dark:border-[#35352E]">
                <label class="block text-[11px] font-mono uppercase font-bold mb-1 truncate ${color}" title="${name}">
                    ${name.replace('Semilla ', '')}
                </label>
                <div class="relative">
                    <span class="absolute left-2 top-1 text-xs font-mono text-[#5F5A4D]">$</span>
                    <input type="number" id="price_seed_${id}" value="${price}" min="1" step="1"
                        class="w-full pl-5 pr-1 py-1 text-xs font-mono text-center rounded bg-[#EDE8DC] dark:bg-[#1E1E1A] border border-[#2B2B2B]/40 dark:border-[#33332D] text-[#1C1C17] dark:text-[#F4F1E8]">
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    container.querySelectorAll('input').forEach(input => {
        ['input', 'change', 'blur'].forEach(evt => {
            input.addEventListener(evt, () => calculateProfitability());
        });
    });
}

export function calculateProfitability(triggerSaveNotice = false) {
    const berryKey = document.getElementById('profitBerrySelect')?.value || 'leppa';
    const plots = parseInt(document.getElementById('profitPlots')?.value) || 156;
    const avgYield = parseFloat(document.getElementById('profitYieldSelect')?.value) || 6.0;
    const toolCost = parseFloat(document.getElementById('profitToolCost')?.value) || 350;
    const gtlFeePercent = parseFloat(document.getElementById('profitGTLFee')?.value) || 5;

    // Guardar toda la configuración operativa de la calculadora
    saveCalcConfig({
        berry: berryKey,
        plots,
        yield: avgYield,
        toolCost,
        gtlFee: gtlFeePercent
    });

    const recipe = RECIPES[berryKey];
    if (!recipe) return;

    const extraction = EXTRACTION_PROFILES[berryKey] || EXTRACTION_PROFILES.leppa;
    const growthHours = BERRY_GROWTH_HOURS[berryKey] || 20;

    // Leer precios vigentes de los inputs
    const savedSeedPrices = getSavedGTLPrices();
    const savedBerryPrices = getSavedBerryPrices();

    const berryInput = document.getElementById(`price_berry_${berryKey}`);
    const currentBerryPrice = berryInput ? (parseFloat(berryInput.value) || 1000) : (savedBerryPrices[berryKey] || 1000);
    savedBerryPrices[berryKey] = currentBerryPrice;
    saveBerryPrices(savedBerryPrices);

    const currentSeedPrices = { ...savedSeedPrices };
    Object.keys(extraction).forEach(seedId => {
        const inputEl = document.getElementById(`price_seed_${seedId}`);
        if (inputEl) {
            currentSeedPrices[seedId] = parseFloat(inputEl.value) || savedSeedPrices[seedId] || 750;
        }
    });
    recipe.reqs.forEach(req => {
        const inputEl = document.getElementById(`price_seed_${req.id}`);
        if (inputEl) {
            currentSeedPrices[req.id] = parseFloat(inputEl.value) || savedSeedPrices[req.id] || 750;
        }
    });
    saveGTLPrices(currentSeedPrices);

    if (triggerSaveNotice) {
        showSaveIndicator(currentLang === 'en' ? 'Prices & settings saved!' : '¡Precios y configuración guardados!');
    }

    // 1. Total de bayas cosechadas
    const totalBerries = Math.round(plots * avgYield);

    // 2. Costo de triturar todas las bayas con herramientas ($350 c/u)
    const totalToolExpense = totalBerries * toolCost;

    // 3. Semillas necesarias para replantar el 100% de las parcelas
    const seedsNeeded = {};
    recipe.reqs.forEach(req => {
        seedsNeeded[req.id] = req.qty * plots;
    });

    // 4. Semillas producidas al triturar todas las bayas
    const seedsProduced = {};
    Object.keys(extraction).forEach(seedId => {
        seedsProduced[seedId] = Math.round(totalBerries * extraction[seedId]);
    });

    // 5. Balance de semillas: Excedentes vendibles vs Faltantes para replantar
    const seedBalance = {};
    const allRelevantSeeds = Array.from(new Set([...Object.keys(seedsNeeded), ...Object.keys(seedsProduced)]));
    
    let gtlSurplusRevenue = 0;
    let missingSeedsCost = 0;

    allRelevantSeeds.forEach(seedId => {
        const needed = seedsNeeded[seedId] || 0;
        const produced = seedsProduced[seedId] || 0;
        const diff = produced - needed;
        const price = currentSeedPrices[seedId] || 750;

        seedBalance[seedId] = {
            needed,
            produced,
            diff,
            price,
            value: diff * price
        };

        if (diff > 0) {
            gtlSurplusRevenue += diff * price;
        } else if (diff < 0) {
            missingSeedsCost += Math.abs(diff) * price;
        }
    });

    const feeMultiplier = (1 - gtlFeePercent / 100);

    // ESTRATEGIA A: Triturar todo con herramientas ($350) + Replantar parcelas + Vender semillas excedentes
    const netRevenueGTL_A = Math.round(gtlSurplusRevenue * feeMultiplier);
    const totalCosts_A = totalToolExpense + missingSeedsCost;
    const netProfit_A = Math.round(netRevenueGTL_A - totalCosts_A);
    const roi_A = totalCosts_A > 0 ? ((netProfit_A / totalCosts_A) * 100).toFixed(1) : 0;
    const profitPerHour_A = Math.round(netProfit_A / growthHours);
    const profitPerPlot_A = Math.round(netProfit_A / plots);

    // ESTRATEGIA B: Venta directa de bayas crudas en GTL (sin triturar)
    const grossBerryRevenue_B = Math.round((totalBerries * currentBerryPrice) * feeMultiplier);
    let totalReplantCost_B = 0;
    recipe.reqs.forEach(req => {
        const price = currentSeedPrices[req.id] || 750;
        totalReplantCost_B += req.qty * plots * price;
    });
    const netProfit_B = Math.round(grossBerryRevenue_B - totalReplantCost_B);
    const roi_B = totalReplantCost_B > 0 ? ((netProfit_B / totalReplantCost_B) * 100).toFixed(1) : 0;
    const profitPerHour_B = Math.round(netProfit_B / growthHours);
    const profitPerPlot_B = Math.round(netProfit_B / plots);

    // Comparativa
    const profitDifference = netProfit_A - netProfit_B;
    const isCrushingBetter = profitDifference > 0;

    renderProfitResults({
        berryKey,
        recipeName: recipe.name,
        plots,
        avgYield,
        totalBerries,
        toolCost,
        totalToolExpense,
        seedBalance,
        gtlSurplusRevenue,
        missingSeedsCost,
        netRevenueGTL_A,
        totalCosts_A,
        netProfit_A,
        roi_A,
        profitPerHour_A,
        profitPerPlot_A,
        currentBerryPrice,
        grossBerryRevenue_B,
        totalReplantCost_B,
        netProfit_B,
        roi_B,
        profitPerHour_B,
        profitPerPlot_B,
        profitDifference,
        isCrushingBetter,
        growthHours
    });
}

export function renderProfitResults(data) {
    const container = document.getElementById('profitResultsContainer');
    if (!container) return;

    const {
        plots,
        avgYield,
        totalBerries,
        toolCost,
        totalToolExpense,
        seedBalance,
        missingSeedsCost,
        netRevenueGTL_A,
        netProfit_A,
        roi_A,
        profitPerHour_A,
        profitPerPlot_A,
        currentBerryPrice,
        grossBerryRevenue_B,
        totalReplantCost_B,
        netProfit_B,
        profitDifference,
        isCrushingBetter,
        growthHours
    } = data;

    // 1. Banner de Veredicto Inteligente
    let verdictHtml = '';
    if (netProfit_A <= 0 && netProfit_B <= 0) {
        verdictHtml = `
            <div class="p-4 rounded-xl border-2 border-red-500/50 bg-red-500/10 text-red-500 mb-5">
                <div class="flex items-center gap-2 font-tech font-bold uppercase text-sm">
                    <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
                    <span>Alerta: Operación en Pérdida</span>
                </div>
                <p class="text-xs font-sans mt-1 text-[#1C1C17] dark:text-[#F4F1E8]">
                    A los precios actuales del GTL, el costo de las herramientas ($${formatMoney(totalToolExpense)}) supera los ingresos de venta. Te recomendamos no triturar hasta que suban los precios de las semillas.
                </p>
            </div>
        `;
    } else if (isCrushingBetter) {
        verdictHtml = `
            <div class="p-4 rounded-xl border-2 border-[#10B981]/50 bg-[#10B981]/10 text-[#10B981] mb-5">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2 font-tech font-bold uppercase text-sm sm:text-base">
                        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                        <span>Estrategia Rentable: Triturar y Vender Semillas Excedentes</span>
                    </div>
                    <span class="text-xs font-mono font-bold bg-[#10B981] text-black px-2.5 py-1 rounded shadow-sm">
                        +${formatMoney(profitDifference)} extra vs Venta Cruda
                    </span>
                </div>
                <p class="text-xs font-sans mt-1.5 text-[#1C1C17] dark:text-[#F4F1E8]">
                    Triturar las <strong>${totalBerries} bayas</strong> con herramientas de $${toolCost} y vender las semillas excedentes te genera <strong>${formatMoney(netProfit_A)}</strong> limpios (un <strong>${roi_A}% de ROI</strong>), superando la venta directa de bayas crudas.
                </p>
            </div>
        `;
    } else {
        verdictHtml = `
            <div class="p-4 rounded-xl border-2 border-[#D97706]/50 bg-[#D97706]/10 text-[#D97706] dark:text-[#F59E0B] mb-5">
                <div class="flex items-center justify-between flex-wrap gap-2">
                    <div class="flex items-center gap-2 font-tech font-bold uppercase text-sm sm:text-base">
                        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                        <span>Recomendación: Vender Bayas Crudas en el GTL</span>
                    </div>
                    <span class="text-xs font-mono font-bold bg-[#D97706] text-black px-2.5 py-1 rounded shadow-sm">
                        +${formatMoney(Math.abs(profitDifference))} extra vs Triturar
                    </span>
                </div>
                <p class="text-xs font-sans mt-1.5 text-[#1C1C17] dark:text-[#F4F1E8]">
                    El costo de $${toolCost} por herramienta es alto comparado con las semillas. Vendiendo las bayas crudas a <strong>${formatMoney(currentBerryPrice)}</strong> y comprando las semillas para replantar obtienes <strong>${formatMoney(netProfit_B)}</strong> limpios.
                </p>
            </div>
        `;
    }

    // 2. Tarjetas de métricas
    const metricsHtml = `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div class="bg-[#EDE8DC] dark:bg-[#1E1E1A] p-3 rounded-xl border border-[#2B2B2B] dark:border-[#35352E] text-center shadow-sm">
                <p class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase font-bold">Cosecha Estimada</p>
                <p class="text-lg sm:text-xl font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8]">${totalBerries} <span class="text-xs font-normal text-[#5F5A4D]">bayas</span></p>
                <p class="text-[10px] font-mono text-[#5F5A4D] mt-0.5">${plots} parcelas &times; ${avgYield} prom.</p>
            </div>

            <div class="bg-[#EDE8DC] dark:bg-[#1E1E1A] p-3 rounded-xl border border-[#2B2B2B] dark:border-[#35352E] text-center shadow-sm">
                <p class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase font-bold">Gasto Herramientas</p>
                <p class="text-lg sm:text-xl font-mono font-bold text-[#E63946]">-${formatMoney(totalToolExpense)}</p>
                <p class="text-[10px] font-mono text-[#5F5A4D] mt-0.5">${totalBerries} herram. &times; $${toolCost}</p>
            </div>

            <div class="bg-[#EDE8DC] dark:bg-[#1E1E1A] p-3 rounded-xl border border-[#2B2B2B] dark:border-[#35352E] text-center shadow-sm">
                <p class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase font-bold">Ganancia Neta (Triturar)</p>
                <p class="text-lg sm:text-xl font-mono font-bold ${netProfit_A >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'}">${formatMoney(netProfit_A)}</p>
                <p class="text-[10px] font-mono text-[#5F5A4D] mt-0.5">ROI: <strong>${roi_A}%</strong></p>
            </div>

            <div class="bg-[#EDE8DC] dark:bg-[#1E1E1A] p-3 rounded-xl border border-[#2B2B2B] dark:border-[#35352E] text-center shadow-sm">
                <p class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase font-bold">Rendimiento Temporal</p>
                <p class="text-lg sm:text-xl font-mono font-bold text-[#2563EB] dark:text-[#60A5FA]">${formatMoney(profitPerHour_A)}<span class="text-xs font-normal text-[#5F5A4D]">/h</span></p>
                <p class="text-[10px] font-mono text-[#5F5A4D] mt-0.5">${formatMoney(profitPerPlot_A)} por parcela (${growthHours}h)</p>
            </div>
        </div>
    `;

    // 3. Tabla de balance de semillas
    let seedRowsHtml = '';
    Object.keys(seedBalance).forEach(seedId => {
        const item = seedBalance[seedId];
        const name = SEED_NAMES[seedId] || seedId;
        const color = SEED_COLORS[seedId] || 'text-[#1C1C17]';

        let surplusCol = '';
        if (item.diff > 0) {
            surplusCol = `
                <span class="font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded text-xs">
                    +${item.diff} excedentes
                </span>
            `;
        } else if (item.diff < 0) {
            surplusCol = `
                <span class="font-mono font-bold text-[#E63946] bg-[#E63946]/10 px-2 py-0.5 rounded text-xs" title="Faltan para cubrir el 100% de la siembra">
                    ${item.diff} (comprar en GTL)
                </span>
            `;
        } else {
            surplusCol = `<span class="font-mono text-[#5F5A4D] text-xs">Exacto (0)</span>`;
        }

        let valueCol = '';
        if (item.diff > 0) {
            valueCol = `<span class="font-mono font-bold text-[#10B981]">+${formatMoney(item.value)}</span>`;
        } else if (item.diff < 0) {
            valueCol = `<span class="font-mono font-bold text-[#E63946]">-${formatMoney(Math.abs(item.value))}</span>`;
        } else {
            valueCol = `<span class="font-mono text-[#5F5A4D]">$0</span>`;
        }

        seedRowsHtml += `
            <tr class="border-b border-[#2B2B2B]/10 dark:border-[#35352E]/40 hover:bg-[#EDE8DC]/50 dark:hover:bg-[#2A2A24] transition text-xs">
                <td class="py-2.5 px-3 font-tech font-bold ${color}">
                    ${name}
                </td>
                <td class="py-2.5 px-3 text-center font-mono">
                    ${item.produced} u.
                </td>
                <td class="py-2.5 px-3 text-center font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                    ${item.needed > 0 ? `${item.needed} u.` : '--'}
                </td>
                <td class="py-2.5 px-3 text-center">
                    ${surplusCol}
                </td>
                <td class="py-2.5 px-3 text-center font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                    $${item.price}
                </td>
                <td class="py-2.5 px-3 text-right">
                    ${valueCol}
                </td>
            </tr>
        `;
    });

    const balanceTableHtml = `
        <div class="mb-5">
            <h3 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] mb-2 flex items-center justify-between">
                <span>Balance de Semillas (Trituración vs Replantación Autosuficiente)</span>
                <span class="text-[11px] font-mono text-[#5F5A4D] font-normal">Replantado 100% cubierto</span>
            </h3>
            <div class="overflow-x-auto rounded-xl border border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#1E1E1A]">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-[#EDE8DC] dark:bg-[#2E2E27] border-b border-[#2B2B2B] dark:border-[#35352E] text-[11px] font-mono uppercase text-[#5F5A4D] dark:text-[#A8A594]">
                            <th class="py-2 px-3">Semilla</th>
                            <th class="py-2 px-3 text-center">Trituradas</th>
                            <th class="py-2 px-3 text-center">Reservadas Replantar</th>
                            <th class="py-2 px-3 text-center">Excedente Vendible</th>
                            <th class="py-2 px-3 text-center">Precio GTL</th>
                            <th class="py-2 px-3 text-right">Subtotal GTL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${seedRowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    // 4. Comparativa detallada lado a lado
    const comparisonHtml = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Estrategia A -->
            <div class="p-4 rounded-xl border-2 ${isCrushingBetter ? 'border-[#10B981] shadow-[2px_2px_0px_#10B981]' : 'border-[#2B2B2B] dark:border-[#35352E]'} bg-[#EDE8DC] dark:bg-[#20201C]">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-tech font-bold uppercase text-xs text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full ${isCrushingBetter ? 'bg-[#10B981]' : 'bg-[#5F5A4D]'}"></span>
                        <span>${t('strat_a_title')}</span>
                    </h4>
                    ${isCrushingBetter ? '<span class="text-[10px] font-mono font-bold bg-[#10B981] text-black px-1.5 py-0.5 rounded uppercase">Recomendada</span>' : ''}
                </div>
                <div class="space-y-1.5 text-xs font-mono">
                    <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                        <span>Venta Semillas Excedentes:</span>
                        <span class="text-[#10B981] font-bold">+${formatMoney(netRevenueGTL_A)}</span>
                    </div>
                    <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                        <span>Herramientas de extracción ($${toolCost}):</span>
                        <span class="text-[#E63946]">-${formatMoney(totalToolExpense)}</span>
                    </div>
                    ${missingSeedsCost > 0 ? `
                    <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                        <span>Comprar Semillas Faltantes en GTL:</span>
                        <span class="text-[#E63946]">-${formatMoney(missingSeedsCost)}</span>
                    </div>` : ''}
                    <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                        <span>Semillas para Replantar el Huerto:</span>
                        <span class="text-[#10B981] font-bold">100% Cubiertas ($0)</span>
                    </div>
                    <div class="pt-2 border-t border-[#2B2B2B]/20 dark:border-[#35352E] flex justify-between items-baseline font-bold text-sm">
                        <span class="font-tech uppercase text-[#1C1C17] dark:text-[#F4F1E8]">Ganancia Neta:</span>
                        <span class="${netProfit_A >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'} text-base">${formatMoney(netProfit_A)}</span>
                    </div>
                </div>
            </div>

            <!-- Estrategia B -->
            <div class="p-4 rounded-xl border-2 ${!isCrushingBetter ? 'border-[#D97706] shadow-[2px_2px_0px_#D97706]' : 'border-[#2B2B2B] dark:border-[#35352E]'} bg-[#EDE8DC] dark:bg-[#20201C]">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-tech font-bold uppercase text-xs text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full ${!isCrushingBetter ? 'bg-[#D97706]' : 'bg-[#5F5A4D]'}"></span>
                        <span>${t('strat_b_title')}</span>
                    </h4>
                    ${!isCrushingBetter ? '<span class="text-[10px] font-mono font-bold bg-[#D97706] text-black px-1.5 py-0.5 rounded uppercase">Recomendada</span>' : ''}
                </div>
                <div class="space-y-1.5 text-xs font-mono">
                    <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                        <span>Venta de ${totalBerries} bayas @ ${formatMoney(currentBerryPrice)}:</span>
                        <span class="text-[#10B981] font-bold">+${formatMoney(grossBerryRevenue_B)}</span>
                    </div>
                    <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                        <span>Herramientas de extracción:</span>
                        <span class="text-[#5F5A4D]">$0 (Sin triturar)</span>
                    </div>
                    <div class="flex justify-between text-[#5F5A4D] dark:text-[#A8A594]">
                        <span>Comprar Semillas para Replantar GTL:</span>
                        <span class="text-[#E63946]">-${formatMoney(totalReplantCost_B)}</span>
                    </div>
                    <div class="pt-2 border-t border-[#2B2B2B]/20 dark:border-[#35352E] flex justify-between items-baseline font-bold text-sm">
                        <span class="font-tech uppercase text-[#1C1C17] dark:text-[#F4F1E8]">Ganancia Neta:</span>
                        <span class="${netProfit_B >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'} text-base">${formatMoney(netProfit_B)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = `
        ${verdictHtml}
        ${metricsHtml}
        ${balanceTableHtml}
        ${comparisonHtml}
    `;
}

export function initProfitCalculator() {
    const berrySelect = document.getElementById('profitBerrySelect');
    const plotsInput = document.getElementById('profitPlots');
    const yieldSelect = document.getElementById('profitYieldSelect');
    const toolCostInput = document.getElementById('profitToolCost');
    const feeInput = document.getElementById('profitGTLFee');
    const btnReset = document.getElementById('btnResetGTLPrices');
    const btnSave = document.getElementById('btnSaveGTLPrices');

    // Restaurar configuración previamente guardada
    const savedConfig = getSavedCalcConfig();
    if (berrySelect && savedConfig.berry) berrySelect.value = savedConfig.berry;
    if (plotsInput && savedConfig.plots) plotsInput.value = savedConfig.plots;
    if (yieldSelect && savedConfig.yield) yieldSelect.value = savedConfig.yield;
    if (toolCostInput && savedConfig.toolCost !== undefined) toolCostInput.value = savedConfig.toolCost;
    if (feeInput && savedConfig.gtlFee !== undefined) feeInput.value = savedConfig.gtlFee;

    if (berrySelect) {
        berrySelect.addEventListener('change', () => {
            renderSeedPriceInputs(berrySelect.value);
            calculateProfitability(false);
        });
    }

    [plotsInput, yieldSelect, toolCostInput, feeInput].forEach(el => {
        if (el) {
            el.addEventListener('input', () => calculateProfitability(false));
            el.addEventListener('change', () => calculateProfitability(false));
        }
    });

    if (btnSave) {
        btnSave.addEventListener('click', () => {
            calculateProfitability(true);
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            localStorage.removeItem('pokemmo_berry_gtl_prices');
            localStorage.removeItem('pokemmo_berry_raw_prices');
            const currentBerry = berrySelect ? berrySelect.value : 'leppa';
            renderSeedPriceInputs(currentBerry);
            calculateProfitability(false);
            showSaveIndicator('Precios sugeridos restaurados');
        });
    }

    if (typeof window !== 'undefined') {
        window.setProfitPlots = (num) => {
            const input = document.getElementById('profitPlots');
            if (input) {
                input.value = num;
                calculateProfitability(true);
            }
        };
        window.calculateProfitability = calculateProfitability;
    }

    const currentBerry = berrySelect ? berrySelect.value : 'leppa';
    renderSeedPriceInputs(currentBerry);
    calculateProfitability(false);
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
    initProfitCalculator();
    
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
        resultsDiv.innerHTML = `<div class="col-span-full text-center text-gray-400 py-4">${currentLang === 'en' ? 'You do not have enough seeds to plant any of the listed berries.' : 'No tienes suficientes semillas para plantar ningúna de las bayas listadas.'}</div>`;
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
    const location = (document.getElementById('berryLocation')?.value || '').trim() || (currentLang === 'en' ? 'No Location' : 'Sin ubicación');
    const elapsedHours = parseFloat(document.getElementById('berryElapsed')?.value) || 0;
    const isWateredAtPlant = document.getElementById('berryWateredAtPlant') ? document.getElementById('berryWateredAtPlant').checked : true;
    const dbInfo = BERRY_DB[type] || BERRY_DB.zanama;
    
    const elapsedMs = elapsedHours * 60 * 60 * 1000;
    const simulatedPlantTime = Date.now() - elapsedMs;

    const cropId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString();

    const newCrop = { 
        id: cropId, 
        type: type, 
        location: location, 
        initialDryHours: dbInfo.initialDryHours,
        plantedAt: simulatedPlantTime, 
        watered: isWateredAtPlant,
        wateredAt: isWateredAtPlant ? simulatedPlantTime : null,
        waterCount: isWateredAtPlant ? 1 : 0
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
    if(confirm(currentLang === 'en' ? 'Reset your harvest record to zero?' : '¿Reiniciar tu récord de cosechas a cero?')) {
        harvestCounter = 0;
        const totalHarvestedEl = document.getElementById('totalHarvested');
        if (totalHarvestedEl) totalHarvestedEl.innerText = harvestCounter;
        localStorage.setItem('pokemmo_harvest_count', harvestCounter);
    }
}

export function renderMoistureGauge(cropId, currentDrops, maxDrops = 5) {
    let pips = '';
    for (let i = 1; i <= maxDrops; i++) {
        const filled = i <= currentDrops;
        pips += `
            <button type="button" onclick="window.calibrateCrop('${cropId}', ${i})" 
                class="inline-block w-3.5 h-3.5 rounded-sm mx-0.5 cursor-pointer transition-transform hover:scale-125 focus:outline-none ${filled ? 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)]' : 'bg-[#181816] border border-[#444] opacity-40 hover:opacity-100 hover:border-sky-400'}"
                title="Sincronizar: Fijar en ${i} gota${i > 1 ? 's' : ''}">
            </button>
        `;
    }
    const colorClass = currentDrops === 0 ? 'text-[#E63946]' : (currentDrops === 1 ? 'text-amber-400 font-bold' : 'text-sky-400');
    return `
        <div class="flex items-center gap-1.5" title="Haz clic en cualquier gota para sincronizar con tu juego">
            <div class="flex items-center">${pips}</div>
            <span class="text-xs font-mono font-bold ${colorClass} ml-1 tabular-nums">${currentDrops}/${maxDrops}</span>
        </div>
    `;
}

export async function calibrateCropDrops(cropId, targetDrops) {
    const crops = state.crops || [];
    const index = crops.findIndex(c => c.id == cropId);
    if (index === -1) return;
    const crop = crops[index];
    const dbInfo = BERRY_DB[crop.type] || BERRY_DB.zanama;
    const dropMs = dbInfo.dropDurationHours * 60 * 60 * 1000;
    
    if (targetDrops >= 5) {
        crop.watered = true;
        crop.wateredAt = Date.now();
        crop.waterCount = (crop.waterCount || 0) + 1;
    } else if (targetDrops <= 0) {
        crop.watered = true;
        crop.wateredAt = Date.now() - Math.floor(5.1 * dropMs);
    } else {
        // Establecer exactamente targetDrops restantes en base al consumo de (5 - targetDrops) gotas
        crop.watered = true;
        crop.wateredAt = Date.now() - Math.floor((5 - targetDrops + 0.1) * dropMs);
    }
    
    setState('crops', [...crops]);
    saveCropsToLocal();
    try {
        await updateCrop(crop.id, { watered: crop.watered, wateredAt: crop.wateredAt, waterCount: crop.waterCount || 0 });
    } catch (e) {
        console.error("Failed to calibrate crop in DB", e);
    }
    updateTimers();
}

if (typeof window !== 'undefined') {
    window.calibrateCrop = calibrateCropDrops;
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
                        <span class="font-tech text-[13px] text-[#A8A495] uppercase font-bold tracking-wider">${t('moisture_remaining')}</span>
                        <div id="crop-drops-${crop.id}"></div>
                    </div>
                    <p id="crop-advice-${crop.id}" class="text-xs text-[#D8D4C7] leading-tight font-mono">Calculando estado de hidratación...</p>
                </div>

                <div class="grid grid-cols-2 gap-2 mb-3">
                    <div class="bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] p-2 rounded-lg text-center shadow-sm">
                        <p id="crop-water-label-${crop.id}" class="text-[13px] text-[#5F5A4D] dark:text-[#A8A594] uppercase tracking-wider mb-0.5 font-tech font-bold">${t('moisture_remaining')}</p>
                        <p id="crop-water-time-${crop.id}" class="font-lcd text-lg font-black text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums tracking-wider">--:--:--</p>
                    </div>
                    <div class="bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] p-2 rounded-lg text-center shadow-sm">
                        <p class="text-[13px] text-[#5F5A4D] dark:text-[#A8A594] uppercase tracking-wider mb-0.5 font-tech font-bold">${currentLang === 'en' ? 'Harvest In' : 'Cosecha Total'}</p>
                        <p id="crop-harvest-time-${crop.id}" class="font-lcd text-lg font-black text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums tracking-wider">--:--:--</p>
                    </div>
                </div>

                <div class="w-full bg-[#E5E0D0] dark:bg-[#22221D] border border-[#2B2B2B] dark:border-[#35352E] h-2.5 rounded-full overflow-hidden mb-2 shadow-inner">
                    <div id="crop-progress-${crop.id}" class="h-2.5 progress-bar-transition w-0 bg-[#10B981] rounded-full"></div>
                </div>
            </div>
            <div class="flex gap-2 mt-auto z-10 relative pt-2">
                <button id="btn-water-${crop.id}" class="flex-1 bg-[#EDE8DC] dark:bg-[#2E2E27] hover:border-[#FFC800] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] py-2 px-2 text-xs font-tech font-bold uppercase transition rounded-lg shadow-[1px_2px_0px_#2B2B2B] cursor-pointer">${t('btn_water')}</button>
                <button id="btn-harvest-${crop.id}" class="flex-1 bg-[#E4DFD0] dark:bg-[#2E2E27] border-2 border-[#2B2B2B] dark:border-[#35352E] text-[#2B2B2B] dark:text-[#F4F1E8] hover:text-[#E63946] py-2 px-2 text-xs font-tech font-bold uppercase transition rounded-lg cursor-pointer">${t('btn_cancel_crop')}</button>
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
                if (dropsText) dropsText.innerHTML = `<span class="text-xs font-mono text-os-red font-bold">${currentLang === 'en' ? 'Withered Crop (Exceeded 8h)' : 'Planta Marchita (Excedió 8h)'}</span>`;
                if (adviceText) {
                    adviceText.innerText = currentLang === 'en' ? 'More than 8 hours have passed since maturity. The crop has withered.' : 'Han pasado más de 8 horas desde la maduración. La planta se marchitó.';
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
            if (dropsText) dropsText.innerHTML = renderMoistureGauge(crop.id, 0, 5);
            if (adviceText) {
                adviceText.innerText = currentLang === 'en' ? 'Soil is dry. Water with Wailmer Pail or click drops above to sync moisture.' : 'Suelo seco. Riega con el Cubo Wailmer o haz clic en las gotas de arriba para sincronizar con el juego si aún tiene agua.';
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
            if (dropsText) dropsText.innerHTML = renderMoistureGauge(crop.id, currentDrops, 5);
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
                dropsText.innerHTML = renderMoistureGauge(crop.id, currentDrops, 5);
            }

            if (adviceText) {
                if (!crop.watered) {
                    adviceText.innerText = `Consumiendo las 2 gotas base. Se agotarán en ${formatTime(timeToZeroDropsMs)} (1 gota cada ~${dbInfo.dropDurationHours}h).`;
                } else if (isCritical) {
                    adviceText.innerText = `¡Última gota restante! Tienes ~${formatTime(timeToZeroDropsMs)} para regar antes de que el suelo quede seco.`;
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



