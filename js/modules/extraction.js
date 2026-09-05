import { formatMoney, formatDate } from '../utils/format.js';
import { t, currentLang } from '../i18n.js';
import { 
    SEED_NAMES,
    getSeedName, 
    SEED_COLORS, 
    DEFAULT_SEED_PRICES, 
    EXTRACTION_PROFILES, 
    RECIPES, 
    getSavedGTLPrices, 
    saveGTLPrices 
} from './berries.js';

// Claves de persistencia
const STORAGE_HISTORY_KEY = 'pokemmo_crusher_history';
const STORAGE_CURRENT_BATCH_KEY = 'pokemmo_crusher_current_batch';

export function getCrusherHistory() {
    try {
        const data = localStorage.getItem(STORAGE_HISTORY_KEY);
        if (data) return JSON.parse(data);
    } catch(e) {}
    return [];
}

export function saveCrusherHistory(history) {
    try {
        localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch(e) {}
}

export function getSavedBatch() {
    try {
        const data = localStorage.getItem(STORAGE_CURRENT_BATCH_KEY);
        if (data) return JSON.parse(data);
    } catch(e) {}
    return {
        berry: 'leppa',
        toolsCount: 100,
        toolCost: 350,
        gtlFee: 5,
        drops: {}
    };
}

export function saveBatch(batch) {
    try {
        localStorage.setItem(STORAGE_CURRENT_BATCH_KEY, JSON.stringify(batch));
    } catch(e) {}
}

// ==========================================
// RENDER VIEW
// ==========================================
export function renderExtractionView() {
    return `
        <div id="view-extraction" class="hidden animate-fade-in space-y-6">
            <!-- Header del Módulo -->
            <div class="flex flex-wrap justify-between items-center pb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-4">
                <div class="flex items-center gap-3">
                    <div class="p-2 rounded-xl bg-[#EDE8DC] dark:bg-[#2E2E27] border border-[#2B2B2B] dark:border-[#35352E] shadow-sm">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/miracle-seed.png" class="w-8 h-8 pokemon-sprite" alt="Triturador de Semillas">
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="text-xl sm:text-2xl font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8]">
                                ${t('ext_header_title')}
                            </h1>
                            <span class="text-xs font-mono uppercase bg-[#FFC800]/10 border border-[#FFC800]/40 text-[#B45309] dark:text-[#FFC800] px-2 py-0.5 rounded font-bold">
                                ${t('ext_audit_badge')}
                            </span>
                        </div>
                        <p class="text-xs font-sans text-[#5F5A4D] dark:text-[#A8A594] mt-0.5">
                            ${t('ext_header_desc')}
                        </p>
                    </div>
                </div>

                <!-- Métricas Acumuladas Globales -->
                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <div class="bg-[#FAF8F2] dark:bg-[#242420] border border-[#2B2B2B] dark:border-[#35352E] px-3.5 py-1.5 rounded-xl text-right shadow-sm">
                        <p class="text-[11px] text-[#5F5A4D] dark:text-[#A8A594] uppercase font-mono font-semibold">${t('ext_tools_used')}</p>
                        <p class="text-base sm:text-lg font-mono font-bold text-[#1C1C17] dark:text-[#F4F1E8] tabular-nums" id="crusherTotalTools">0 u.</p>
                    </div>
                    <div class="bg-[#FAF8F2] dark:bg-[#242420] border border-[#2B2B2B] dark:border-[#35352E] px-3.5 py-1.5 rounded-xl text-right shadow-sm">
                        <p class="text-[11px] text-[#5F5A4D] dark:text-[#A8A594] uppercase font-mono font-semibold">${t('ext_spent_shop')}</p>
                        <p class="text-base sm:text-lg font-mono font-bold text-[#E63946] tabular-nums" id="crusherTotalSpent">$0</p>
                    </div>
                    <div class="bg-[#FAF8F2] dark:bg-[#242420] border border-[#2B2B2B] dark:border-[#35352E] px-3.5 py-1.5 rounded-xl text-right shadow-sm">
                        <p class="text-[11px] text-[#5F5A4D] dark:text-[#A8A594] uppercase font-mono font-semibold">${t('ext_net_profit_lifetime')}</p>
                        <p class="text-base sm:text-lg font-mono font-bold text-[#10B981] tabular-nums" id="crusherTotalProfit">$0</p>
                    </div>
                </div>
            </div>

            <!-- Contenedor Principal: Entrada de Datos del Lote -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <!-- Panel Izquierdo: Parámetros del Lote y Herramientas (4 Cols) -->
                <section class="lg:col-span-4 panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000] flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E]">
                            <h2 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-1.5">
                                <span class="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                                <span>${t('ext_batch_params')}</span>
                            </h2>
                            <span class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">${t('ext_session_active')}</span>
                        </div>

                        <div class="space-y-4">
                            <!-- Selector de Baya -->
                            <div>
                                <label class="block text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1">
                                    ${t('ext_crushed_berry')}
                                </label>
                                <select id="crusherBerrySelect" class="w-full p-2.5 text-xs font-mono rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px] cursor-pointer">
                                    <optgroup label="${currentLang === 'en' ? 'Most Common / Lucrative' : 'Más Comunes / Lucrativas'}">
                                        <option value="leppa" selected>Zanama (Leppa) - Picante, Dulce, Amarga</option>
                                        <option value="lum">Ziuela (Lum) - Seca, Picante, Dulce</option>
                                        <option value="sitrus">Zidra (Sitrus) - Dulce, Amarga, Ácida</option>
                                    </optgroup>
                                    <optgroup label="${currentLang === 'en' ? 'EV-Reducing Berries' : 'Reductoras de EVs'}">
                                        <option value="pomeg">Grana (Pomeg) - Picante, Amarga</option>
                                        <option value="kelpsy">Algama (Kelpsy) - Seca, Ácida</option>
                                        <option value="qualot">Ispero (Qualot) - Dulce, Picante</option>
                                        <option value="hondew">Meluce (Hondew) - Amarga, Seca</option>
                                        <option value="grepa">Uva (Grepa) - Ácida, Dulce</option>
                                        <option value="tamato">Tamate (Tamato) - Picante, Seca</option>
                                    </optgroup>
                                    <optgroup label="${currentLang === 'en' ? 'Basic Status Berries' : 'Básicas (Estados)'}">
                                        <option value="cheri">Zreza (Cheri) - Picante</option>
                                        <option value="pecha">Meloc (Pecha) - Dulce</option>
                                        <option value="rawst">Safre (Rawst) - Amarga</option>
                                        <option value="chesto">Atania (Chesto) - Seca</option>
                                        <option value="aspear">Perasi (Aspear) - Ácida</option>
                                    </optgroup>
                                </select>
                            </div>

                            <!-- ${t('ext_tools_count')} -->
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <label class="text-[12px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594]">
                                        ${t('ext_tools_count', 'Herramientas Compradas / Usadas')}
                                    </label>
                                    <span class="text-[11px] font-mono text-[#D97706] dark:text-[#F59E0B]">1 tool = 1 baya</span>
                                </div>
                                <input type="number" id="crusherToolsCount" value="100" min="1" max="50000" step="1"
                                    class="w-full p-2.5 text-sm font-mono font-bold text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                            </div>

                            <!-- Costos Unitarios y Tasa GTL -->
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="block text-[11px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1 truncate" title="Costo oficial por herramienta en tiendas NPC">
                                        ${t('ext_tool_unit')}
                                    </label>
                                    <input type="number" id="crusherToolCost" value="350" min="0" step="10"
                                        class="w-full p-2 text-xs font-mono text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                                </div>
                                <div>
                                    <label class="block text-[11px] font-mono uppercase font-bold text-[#5F5A4D] dark:text-[#A8A594] mb-1 truncate" title="Comisión de venta en el GTL">
                                        ${t('ext_gtl_commission')}
                                    </label>
                                    <input type="number" id="crusherGTLFee" value="5" min="0" max="20" step="1"
                                        class="w-full p-2 text-xs font-mono text-center rounded-lg bg-[#EDE8DC] dark:bg-[#20201C] border border-[#2B2B2B] dark:border-[#35352E] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[42px]">
                                </div>
                            </div>

                            <!-- Resumen Inversión en Herramientas -->
                            <div class="bg-[#EDE8DC] dark:bg-[#1E1E1A] p-3 rounded-lg border border-[#2B2B2B]/30 dark:border-[#35352E] flex justify-between items-center">
                                <span class="text-xs font-mono text-[#5F5A4D] dark:text-[#A8A594] uppercase font-bold">${t('ext_total_expense')}</span>
                                <span id="crusherBatchExpense" class="text-sm font-mono font-bold text-[#E63946] tabular-nums">$35,000</span>
                            </div>
                        </div>
                    </div>

                    <!-- Botones Rápidos de Asistencia -->
                    <div class="pt-4 mt-4 border-t border-[#2B2B2B]/20 dark:border-[#35352E] space-y-2">
                        <button type="button" id="btnFillExpectedDrops" class="w-full py-2.5 px-3 rounded-lg text-xs font-tech font-bold uppercase tracking-wider bg-[#EDE8DC] dark:bg-[#2E2E27] hover:bg-[#FFC800] hover:text-black text-[#1C1C17] dark:text-[#F4F1E8] border border-[#2B2B2B] dark:border-[#35352E] transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            <span>${t('btn_fill_theoretical')}</span>
                        </button>
                        <button type="button" id="btnClearCrusherDrops" class="w-full py-2 px-3 rounded-lg text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#E63946] transition text-center cursor-pointer">
                            ${currentLang === 'en' ? 'Reset Count to 0' : 'Reiniciar Conteo a 0'}
                        </button>
                    </div>
                </section>

                <!-- Panel Derecho: Conteo Real de Semillas Dropeadas (8 Cols) -->
                <section class="lg:col-span-8 panel p-5 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000] flex flex-col justify-between">
                    <div>
                        <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-2">
                            <div>
                                <h2 class="text-xs font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-1.5">
                                    <span class="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                                    <span>${t('ext_seed_drops', '2. Semillas Dropeadas Reales')}</span>
                                </h2>
                                <p class="text-[11px] font-sans text-[#5F5A4D] dark:text-[#A8A594]">
                                    ${t('ext_seed_drops_desc', 'Ingresa la cantidad exacta de semillas que te arrojó el juego al triturar.')}
                                </p>
                            </div>
                            <span id="crusherDropsSavedTag" class="text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded font-medium">
                                ${currentLang === 'en' ? 'Auto-saved' : 'Guardado automático'}
                            </span>
                        </div>

                        <!-- Grilla Dinámica de Semillas Dropeadas -->
                        <div id="crusherDropsInputsGrid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            <!-- Inyectado por JS según la baya elegida -->
                        </div>
                    </div>

                    <!-- Resumen de Drops Obtenidos -->
                    <div class="pt-3 border-t border-[#2B2B2B]/20 dark:border-[#35352E] flex flex-wrap justify-between items-center gap-2 text-xs font-mono">
                        <div class="text-[#5F5A4D] dark:text-[#A8A594]">
                            ${t('ext_total_gathered', 'Total seeds gathered:')} <span id="crusherTotalSeedsGathered" class="font-bold text-[#1C1C17] dark:text-[#F4F1E8]">0 u.</span>
                        </div>
                        <div class="text-[#5F5A4D] dark:text-[#A8A594]">
                            ${t('ext_gross_val', 'Gross GTL value:')} <span id="crusherGrossSeedValue" class="font-bold text-[#10B981]">$0</span>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Panel de Análisis Financiero: ¿ES A CUENTA? (VEREDICTO) -->
            <section id="crusherVerdictSection" class="p-5 sm:p-6 rounded-xl border-2 transition-all">
                <!-- Se inyecta dinámicamente con calculateCrusherProfitability() -->
            </section>

            <!-- Bitácora Histórica de Sesiones de Trituración -->
            <section class="panel p-5 sm:p-6 rounded-xl border-2 border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#242420] shadow-[2px_3px_0px_#2B2B2B] dark:shadow-[2px_3px_0px_#000]">
                <div class="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#2B2B2B]/20 dark:border-[#35352E] gap-2">
                    <div>
                        <h2 class="text-sm font-tech font-bold uppercase tracking-wider text-[#1C1C17] dark:text-[#F4F1E8] flex items-center gap-2">
                            <svg class="w-4 h-4 text-[#D97706]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                            <span>${t('ext_history_title', 'Crushed Batches Ledger')}</span>
                        </h2>
                        <p class="text-xs font-sans text-[#5F5A4D] dark:text-[#A8A594]">
                            ${t('ext_history_desc', 'Permanent ledger of crushed sessions to audit cumulative economic performance.')}
                        </p>
                    </div>
                    <button type="button" id="btnClearCrusherHistory" class="text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594] hover:text-[#E63946] underline cursor-pointer">
                        ${t('btn_clear_history', 'Clear Ledger')}
                    </button>
                </div>

                <!-- Tabla de Historial -->
                <div class="overflow-x-auto rounded-xl border border-[#2B2B2B] dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#1E1E1A] mb-4">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#EDE8DC] dark:bg-[#2E2E27] border-b border-[#2B2B2B] dark:border-[#35352E] text-[11px] font-mono uppercase text-[#5F5A4D] dark:text-[#A8A594]">
                                <th class="py-2.5 px-3">${t('th_date')}</th>
                                <th class="py-2.5 px-3">${t('th_berry')}</th>
                                <th class="py-2.5 px-3 text-center">${t('th_tools')}</th>
                                <th class="py-2.5 px-3 text-center">${t('th_flower_spent')}</th>
                                <th class="py-2.5 px-3 text-center">${t('th_seeds_received')}</th>
                                <th class="py-2.5 px-3 text-center">${t('th_net_gtl')}</th>
                                <th class="py-2.5 px-3 text-right">${t('th_net_profit')}</th>
                                <th class="py-2.5 px-3 text-center">${t('th_roi')}</th>
                                <th class="py-2.5 px-3 text-center">${t('th_action')}</th>
                            </tr>
                        </thead>
                        <tbody id="crusherHistoryTableBody">
                            <!-- Inyectado por JS -->
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    `;
}

// ==========================================
// SEED INPUTS RENDERER
// ==========================================
export function renderCrusherSeedInputs(berryKey) {
    const container = document.getElementById('crusherDropsInputsGrid');
    if (!container) return;

    const extraction = EXTRACTION_PROFILES[berryKey] || EXTRACTION_PROFILES.leppa;
    const savedBatch = getSavedBatch();
    const savedPrices = getSavedGTLPrices();
    const toolsCount = parseInt(document.getElementById('crusherToolsCount')?.value) || 100;

    let html = '';
    const seedIds = Object.keys(extraction);

    seedIds.forEach(id => {
        const name = (typeof getSeedName === 'function' ? getSeedName(id) : (SEED_NAMES[id] || id));
        const color = SEED_COLORS[id] || 'text-[#1C1C17]';
        const expectedRatio = extraction[id] || 0;
        const expectedCount = Math.round(toolsCount * expectedRatio);
        const currentVal = savedBatch.drops && savedBatch.drops[id] !== undefined ? savedBatch.drops[id] : 0;
        const price = savedPrices[id] || DEFAULT_SEED_PRICES[id] || 750;

        html += `
            <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-3 rounded-xl border border-[#2B2B2B]/30 dark:border-[#35352E] shadow-sm flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-xs font-tech font-bold ${color} truncate" title="${name}">
                            ${name.replace('Semilla ', '')}
                        </span>
                        <span class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594] bg-[#EDE8DC] dark:bg-[#2E2E27] px-1.5 py-0.5 rounded" title="Probabilidad promedio de drop">
                            ~${(expectedRatio * 100).toFixed(0)}%
                        </span>
                    </div>
                    <p class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594] mb-2">
                        ${currentLang === 'en' ? 'Expected:' : 'Esperado:'} <span class="font-bold text-[#1C1C17] dark:text-[#F4F1E8]">${expectedCount} u.</span> (@ ${price}/u)
                    </p>
                </div>

                <div class="space-y-1.5">
                    <label class="block text-[10px] font-mono uppercase text-[#5F5A4D] dark:text-[#A8A594]">
                        ${currentLang === 'en' ? 'Obtained Count:' : 'Cantidad Obtenida:'}
                    </label>
                    <div class="flex items-center gap-1.5">
                        <input type="number" id="drop_seed_${id}" value="${currentVal}" min="0" max="100000" step="1"
                            class="w-full p-2 text-sm font-mono font-bold text-center rounded-lg bg-[#EDE8DC] dark:bg-[#1E1E1A] border border-[#2B2B2B]/40 dark:border-[#33332D] text-[#1C1C17] dark:text-[#F4F1E8] min-h-[38px]">
                        <span class="text-xs font-mono text-[#5F5A4D] font-bold">u.</span>
                    </div>
                    <div class="text-right text-[11px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                        Subtotal: <span id="subtotal_seed_${id}" class="font-bold text-[#10B981]">$0</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    container.querySelectorAll('input').forEach(input => {
        ['input', 'change', 'blur'].forEach(evt => {
            input.addEventListener(evt, () => calculateCrusherProfitability());
        });
    });
}

// ==========================================
// FINANCIAL CALCULATOR
// ==========================================
export function calculateCrusherProfitability() {
    const berryKey = document.getElementById('crusherBerrySelect')?.value || 'leppa';
    const toolsCount = parseInt(document.getElementById('crusherToolsCount')?.value) || 0;
    const toolCost = parseFloat(document.getElementById('crusherToolCost')?.value) || 350;
    const gtlFeePercent = parseFloat(document.getElementById('crusherGTLFee')?.value) || 5;

    const extraction = EXTRACTION_PROFILES[berryKey] || EXTRACTION_PROFILES.leppa;
    const savedPrices = getSavedGTLPrices();

    // 1. Costo total de herramientas
    const totalToolExpense = toolsCount * toolCost;
    const expenseEl = document.getElementById('crusherBatchExpense');
    if (expenseEl) expenseEl.innerText = formatMoney(totalToolExpense);

    // 2. Conteo de drops ingresados por el usuario
    const drops = {};
    let totalSeedsGathered = 0;
    let grossSeedRevenue = 0;

    Object.keys(extraction).forEach(id => {
        const input = document.getElementById(`drop_seed_${id}`);
        const count = input ? (parseInt(input.value) || 0) : 0;
        drops[id] = count;
        totalSeedsGathered += count;

        const price = savedPrices[id] || DEFAULT_SEED_PRICES[id] || 750;
        const subtotal = count * price;
        grossSeedRevenue += subtotal;

        const subtotalEl = document.getElementById(`subtotal_seed_${id}`);
        if (subtotalEl) subtotalEl.innerText = formatMoney(subtotal);
    });

    // Guardar lote en memoria local
    saveBatch({
        berry: berryKey,
        toolsCount,
        toolCost,
        gtlFee: gtlFeePercent,
        drops
    });

    // Actualizar contadores del header del panel
    const seedsCountEl = document.getElementById('crusherTotalSeedsGathered');
    if (seedsCountEl) seedsCountEl.innerText = `${totalSeedsGathered} u.`;

    const grossValEl = document.getElementById('crusherGrossSeedValue');
    if (grossValEl) grossValEl.innerText = formatMoney(grossSeedRevenue);

    // 3. Finanzas netas
    const feeMultiplier = (1 - gtlFeePercent / 100);
    const netSeedRevenue = Math.round(grossSeedRevenue * feeMultiplier);
    const netProfit = netSeedRevenue - totalToolExpense;
    const roi = totalToolExpense > 0 ? ((netProfit / totalToolExpense) * 100).toFixed(1) : 0;
    const revenuePerTool = toolsCount > 0 ? Math.round(netSeedRevenue / toolsCount) : 0;
    const netProfitPerTool = toolsCount > 0 ? Math.round(netProfit / toolsCount) : 0;

    const isProfitable = netProfit > 0;
    const isBreakEven = netProfit === 0 && totalToolExpense > 0;

    // 4. Renderizar veredicto
    renderVerdict({
        berryKey,
        toolsCount,
        toolCost,
        totalToolExpense,
        totalSeedsGathered,
        grossSeedRevenue,
        gtlFeePercent,
        netSeedRevenue,
        netProfit,
        roi,
        revenuePerTool,
        netProfitPerTool,
        isProfitable,
        isBreakEven,
        drops,
        extraction
    });
}

function renderVerdict(data) {
    const container = document.getElementById('crusherVerdictSection');
    if (!container) return;

    if (data.toolsCount <= 0) {
        container.className = 'p-5 sm:p-6 rounded-xl border-2 border-[#2B2B2B]/30 dark:border-[#35352E] bg-[#FAF8F2] dark:bg-[#20201C] text-center';
        container.innerHTML = `
            <p class="font-tech text-sm uppercase text-[#5F5A4D] dark:text-[#A8A594]">
                Ingresa la cantidad de herramientas usadas para auditar la rentabilidad.
            </p>
        `;
        return;
    }

    let verdictTheme = '';
    let verdictTitle = '';
    let verdictSubtitle = '';
    let verdictBadge = '';

    if (data.isProfitable) {
        verdictTheme = 'border-[#10B981] bg-[#10B981]/5 shadow-[3px_4px_0px_#10B981]';
        verdictTitle = currentLang === 'en' ? 'WORTH IT // PROFITABLE OPERATION' : 'ES A CUENTA // OPERACIÓN RENTABLE';
        verdictBadge = `<span class="text-xs font-mono font-bold uppercase bg-[#10B981] text-black px-2.5 py-1 rounded">${currentLang === 'en' ? 'Profitable' : 'Rentable'} (+ ${data.roi}% ROI)</span>`;
        verdictSubtitle = currentLang === 'en' ? `Profitable operation! You earned ${formatMoney(data.netSeedRevenue)} net in seeds after paying ${formatMoney(data.toolCost)} per tool, achieving a net profit of +${formatMoney(data.netProfit)} (${data.netProfitPerTool >= 0 ? '+' : ''}${formatMoney(data.netProfitPerTool)} net per tool used).` : `¡Operación provechosa! Obtuviste ${formatMoney(data.netSeedRevenue)} limpios en semillas tras pagar $350 por herramienta, logrando una ganancia neta de +${formatMoney(data.netProfit)} (${data.netProfitPerTool >= 0 ? '+' : ''}${formatMoney(data.netProfitPerTool)} limpios por cada herramienta usada).`;
    } else if (data.isBreakEven) {
        verdictTheme = 'border-[#FFC800] bg-[#FFC800]/5 shadow-[3px_4px_0px_#FFC800]';
        verdictTitle = currentLang === 'en' ? 'BREAK-EVEN // ZERO PROFIT/LOSS' : 'PUNTO DE EQUILIBRIO // NI GANANCIA NI PÉRDIDA';
        verdictBadge = `<span class="text-xs font-mono font-bold uppercase bg-[#FFC800] text-black px-2.5 py-1 rounded">${currentLang === 'en' ? 'Break-even' : 'Equilibrio'} (0% ROI)</span>`;
        verdictSubtitle = currentLang === 'en' ? `You broke even, recovering exactly the ${formatMoney(data.totalToolExpense)} invested in tools.` : `Recuperaste exactamente los ${formatMoney(data.totalToolExpense)} invertidos en herramientas.`;
    } else {
        verdictTheme = 'border-[#E63946] bg-[#E63946]/5 shadow-[3px_4px_0px_#E63946]';
        verdictTitle = currentLang === 'en' ? 'NOT WORTH IT // LOSS DETECTED' : 'NO ES A CUENTA // OPERACIÓN EN PÉRDIDA';
        verdictBadge = `<span class="text-xs font-mono font-bold uppercase bg-[#E63946] text-white px-2.5 py-1 rounded">${currentLang === 'en' ? 'Loss' : 'Pérdida'} (${data.roi}% ROI)</span>`;
        verdictSubtitle = currentLang === 'en' ? `Loss warning: Seed proceeds (${formatMoney(data.netSeedRevenue)} net) do not cover the ${formatMoney(data.totalToolExpense)} spent on tools. You are losing -${formatMoney(Math.abs(data.netProfit))} (${formatMoney(data.netProfitPerTool)} per tool).` : `Alerta: Las semillas obtenidas (${formatMoney(data.netSeedRevenue)} limpios) no cubren los ${formatMoney(data.totalToolExpense)} gastados en herramientas. Estás perdiendo -${formatMoney(Math.abs(data.netProfit))} (${formatMoney(data.netProfitPerTool)} por herramienta).`;
    }

    container.className = `p-5 sm:p-6 rounded-xl border-2 ${verdictTheme} transition-all`;
    container.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#2B2B2B]/20 dark:border-[#35352E]">
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="text-base sm:text-lg font-tech font-bold uppercase tracking-wider ${data.isProfitable ? 'text-[#10B981]' : data.isBreakEven ? 'text-[#D97706]' : 'text-[#E63946]'}">
                        ${verdictTitle}
                    </h3>
                </div>
                <p class="text-xs font-sans text-[#1C1C17] dark:text-[#F4F1E8]">
                    ${verdictSubtitle}
                </p>
            </div>
            <div class="flex items-center gap-2">
                ${verdictBadge}
                <button type="button" id="btnSaveBatchToHistory" class="px-3.5 py-2 rounded-lg font-tech font-bold text-xs uppercase tracking-wider bg-[#1C1C17] dark:bg-[#F4F1E8] text-white dark:text-black hover:bg-[#FFC800] hover:text-black transition shadow-sm cursor-pointer flex items-center gap-1.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    <span>${t('btn_save_batch', 'Save to Ledger')}</span>
                </button>
            </div>
        </div>

        <!-- Métricas Financieras Desglosadas -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-3 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                <p class="text-[11px] font-mono uppercase text-[#5F5A4D] dark:text-[#A8A594] font-semibold">${t('tool_expenses', 'Tool Expenses')}</p>
                <p class="text-base sm:text-lg font-mono font-bold text-[#E63946] tabular-nums">-${formatMoney(data.totalToolExpense)}</p>
                <p class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">${data.toolsCount} tools @ $${data.toolCost}</p>
            </div>

            <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-3 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                <p class="text-[11px] font-mono uppercase text-[#5F5A4D] dark:text-[#A8A594] font-semibold">${currentLang === 'en' ? 'Seed Sales (Net)' : 'Venta Semillas (Neto)'}</p>
                <p class="text-base sm:text-lg font-mono font-bold text-[#10B981] tabular-nums">+${formatMoney(data.netSeedRevenue)}</p>
                <p class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">${currentLang === 'en' ? `After ${data.gtlFeePercent}% GTL fee` : `Descontado ${data.gtlFeePercent}% GTL`}</p>
            </div>

            <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-3 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                <p class="text-[11px] font-mono uppercase text-[#5F5A4D] dark:text-[#A8A594] font-semibold">${currentLang === 'en' ? 'Clean Net Profit' : 'Ganancia Neta Limpia'}</p>
                <p class="text-lg sm:text-2xl font-mono font-extrabold ${data.netProfit >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'} tabular-nums">
                    ${data.netProfit >= 0 ? '+' : ''}${formatMoney(data.netProfit)}
                </p>
                <p class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">${currentLang === 'en' ? 'Total net gain' : 'Beneficio total'}</p>
            </div>

            <div class="bg-[#FAF8F2] dark:bg-[#20201C] p-3 rounded-lg border border-[#2B2B2B]/20 dark:border-[#35352E]">
                <p class="text-[11px] font-mono uppercase text-[#5F5A4D] dark:text-[#A8A594] font-semibold">${currentLang === 'en' ? 'Return / Tool' : 'Retorno / Tool'}</p>
                <p class="text-base sm:text-lg font-mono font-bold ${data.netProfitPerTool >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'} tabular-nums">
                    ${data.netProfitPerTool >= 0 ? '+' : ''}${formatMoney(data.netProfitPerTool)}
                </p>
                <p class="text-[10px] font-mono text-[#5F5A4D] dark:text-[#A8A594]">${currentLang === 'en' ? `Per $${data.toolCost} spent` : `Por cada $${data.toolCost} gastados`}</p>
            </div>
        </div>
    `;

    // Hook botón de guardar en bitácora
    const btnSaveBatch = document.getElementById('btnSaveBatchToHistory');
    if (btnSaveBatch) {
        btnSaveBatch.onclick = () => saveCurrentBatchToHistory(data);
    }
}

// ==========================================
// HISTORY & LEDGER MANAGEMENT
// ==========================================
export function saveCurrentBatchToHistory(data) {
    const history = getCrusherHistory();
    const recipe = RECIPES[data.berryKey];
    const berryName = recipe ? recipe.name.split(' ')[0] : data.berryKey;

    const newEntry = {
        id: 'crush_' + Date.now(),
        date: new Date().toISOString(),
        berryKey: data.berryKey,
        berryName,
        toolsCount: data.toolsCount,
        toolCost: data.toolCost,
        totalToolExpense: data.totalToolExpense,
        totalSeedsGathered: data.totalSeedsGathered,
        netSeedRevenue: data.netSeedRevenue,
        netProfit: data.netProfit,
        roi: data.roi,
        drops: { ...data.drops }
    };

    history.unshift(newEntry);
    saveCrusherHistory(history);
    renderCrusherHistory();
    updateCumulativeStats();

    // Feedback visual
    const btn = document.getElementById('btnSaveBatchToHistory');
    if (btn) {
        const oldHtml = btn.innerHTML;
        btn.innerHTML = `<span>${currentLang === 'en' ? 'Batch Saved to Ledger!' : '¡Lote Guardado en Bitácora!'}</span>`;
        btn.className = 'px-3.5 py-2 rounded-lg font-tech font-bold text-xs uppercase tracking-wider bg-[#10B981] text-black transition shadow-sm';
        setTimeout(() => {
            btn.innerHTML = oldHtml;
            btn.className = 'px-3.5 py-2 rounded-lg font-tech font-bold text-xs uppercase tracking-wider bg-[#1C1C17] dark:bg-[#F4F1E8] text-white dark:text-black hover:bg-[#FFC800] hover:text-black transition shadow-sm cursor-pointer flex items-center gap-1.5';
        }, 2000);
    }
}

export function deleteHistoryEntry(id) {
    let history = getCrusherHistory();
    history = history.filter(item => item.id !== id);
    saveCrusherHistory(history);
    renderCrusherHistory();
    updateCumulativeStats();
}

export function clearCrusherHistory() {
    if (!confirm(currentLang === 'en' ? 'Are you sure you want to clear the entire crusher batch ledger?' : '¿Seguro que deseas vaciar toda la bitácora de lotes triturados?')) return;
    saveCrusherHistory([]);
    renderCrusherHistory();
    updateCumulativeStats();
}

export function renderCrusherHistory() {
    const tbody = document.getElementById('crusherHistoryTableBody');
    if (!tbody) return;

    const history = getCrusherHistory();

    if (history.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="py-8 text-center text-xs font-mono text-[#5F5A4D] dark:text-[#A8A594]">
                    ${currentLang === 'en' ? 'No batches recorded in the ledger yet. Complete a batch above and click "Save Batch to Ledger".' : 'Aún no has registrado lotes en la bitácora. Completa una tanda arriba y pulsa "Guardar en Bitácora".'}
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    history.forEach(item => {
        // Resumen de drops
        let dropsSummary = [];
        if (item.drops) {
            Object.keys(item.drops).forEach(seedId => {
                const count = item.drops[seedId];
                if (count > 0) {
                    const shortName = (getSeedName(seedId)).replace('Semilla ', '').replace(' Seed', '');
                    dropsSummary.push(`${count} ${shortName}`);
                }
            });
        }
        const dropsText = dropsSummary.length > 0 ? dropsSummary.join(', ') : `${item.totalSeedsGathered} semillas`;

        html += `
            <tr class="border-b border-[#2B2B2B]/10 dark:border-[#35352E]/40 hover:bg-[#EDE8DC]/40 dark:hover:bg-[#2A2A24] transition text-xs font-mono">
                <td class="py-2.5 px-3 whitespace-nowrap text-[#5F5A4D] dark:text-[#A8A594]">
                    ${formatDate(item.date)}
                </td>
                <td class="py-2.5 px-3 font-tech font-bold uppercase text-[#1C1C17] dark:text-[#F4F1E8]">
                    ${item.berryName}
                </td>
                <td class="py-2.5 px-3 text-center">
                    ${item.toolsCount} u.
                </td>
                <td class="py-2.5 px-3 text-center text-[#E63946]">
                    -${formatMoney(item.totalToolExpense)}
                </td>
                <td class="py-2.5 px-3 text-center text-[#5F5A4D] dark:text-[#A8A594] max-w-[200px] truncate" title="${dropsText}">
                    ${dropsText}
                </td>
                <td class="py-2.5 px-3 text-center text-[#10B981]">
                    +${formatMoney(item.netSeedRevenue)}
                </td>
                <td class="py-2.5 px-3 text-right font-bold ${item.netProfit >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'}">
                    ${item.netProfit >= 0 ? '+' : ''}${formatMoney(item.netProfit)}
                </td>
                <td class="py-2.5 px-3 text-center font-bold ${item.netProfit >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'}">
                    ${item.roi}%
                </td>
                <td class="py-2.5 px-3 text-center">
                    <button type="button" onclick="window.deleteCrusherEntry('${item.id}')" class="text-xs text-[#5F5A4D] hover:text-[#E63946] transition p-1 cursor-pointer" title="Eliminar este registro">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

export function updateCumulativeStats() {
    const history = getCrusherHistory();
    let totalTools = 0;
    let totalSpent = 0;
    let totalProfit = 0;

    history.forEach(item => {
        totalTools += (item.toolsCount || 0);
        totalSpent += (item.totalToolExpense || 0);
        totalProfit += (item.netProfit || 0);
    });

    const toolsEl = document.getElementById('crusherTotalTools');
    if (toolsEl) toolsEl.innerText = `${totalTools} u.`;

    const spentEl = document.getElementById('crusherTotalSpent');
    if (spentEl) spentEl.innerText = formatMoney(totalSpent);

    const profitEl = document.getElementById('crusherTotalProfit');
    if (profitEl) {
        profitEl.innerText = `${totalProfit >= 0 ? '+' : ''}${formatMoney(totalProfit)}`;
        profitEl.className = `text-base sm:text-lg font-mono font-bold tabular-nums ${totalProfit >= 0 ? 'text-[#10B981]' : 'text-[#E63946]'}`;
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
export function initExtraction() {
    const berrySelect = document.getElementById('crusherBerrySelect');
    const toolsInput = document.getElementById('crusherToolsCount');
    const toolCostInput = document.getElementById('crusherToolCost');
    const feeInput = document.getElementById('crusherGTLFee');
    const btnFill = document.getElementById('btnFillExpectedDrops');
    const btnClear = document.getElementById('btnClearCrusherDrops');
    const btnClearHistory = document.getElementById('btnClearCrusherHistory');

    // Cargar lote guardado previamente
    const savedBatch = getSavedBatch();
    if (berrySelect && savedBatch.berry) berrySelect.value = savedBatch.berry;
    if (toolsInput && savedBatch.toolsCount) toolsInput.value = savedBatch.toolsCount;
    if (toolCostInput && savedBatch.toolCost !== undefined) toolCostInput.value = savedBatch.toolCost;
    if (feeInput && savedBatch.gtlFee !== undefined) feeInput.value = savedBatch.gtlFee;

    // Listeners para cambio de parámetros
    if (berrySelect) {
        berrySelect.addEventListener('change', () => {
            renderCrusherSeedInputs(berrySelect.value);
            calculateCrusherProfitability();
        });
    }

    [toolsInput, toolCostInput, feeInput].forEach(el => {
        if (el) {
            ['input', 'change'].forEach(evt => {
                el.addEventListener(evt, () => calculateCrusherProfitability());
            });
        }
    });

    // Botón para cargar estimación teórica
    if (btnFill) {
        btnFill.addEventListener('click', () => {
            const currentBerry = berrySelect ? berrySelect.value : 'leppa';
            const tools = parseInt(toolsInput?.value) || 100;
            const extraction = EXTRACTION_PROFILES[currentBerry] || EXTRACTION_PROFILES.leppa;

            Object.keys(extraction).forEach(id => {
                const input = document.getElementById(`drop_seed_${id}`);
                if (input) {
                    input.value = Math.round(tools * extraction[id]);
                }
            });
            calculateCrusherProfitability();
        });
    }

    // Botón para reiniciar drops a 0
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            const currentBerry = berrySelect ? berrySelect.value : 'leppa';
            const extraction = EXTRACTION_PROFILES[currentBerry] || EXTRACTION_PROFILES.leppa;

            Object.keys(extraction).forEach(id => {
                const input = document.getElementById(`drop_seed_${id}`);
                if (input) input.value = 0;
            });
            calculateCrusherProfitability();
        });
    }

    // Botón para vaciar historial
    if (btnClearHistory) {
        btnClearHistory.addEventListener('click', clearCrusherHistory);
    }

    // Exponer a window para llamadas inline
    if (typeof window !== 'undefined') {
        window.deleteCrusherEntry = deleteHistoryEntry;
        window.calculateCrusherProfitability = calculateCrusherProfitability;
    }

    // Renderizado inicial
    const currentBerry = berrySelect ? berrySelect.value : 'leppa';
    renderCrusherSeedInputs(currentBerry);
    calculateCrusherProfitability();
    renderCrusherHistory();
    updateCumulativeStats();
}
