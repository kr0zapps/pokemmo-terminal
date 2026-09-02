import { fetchPokemonSpecies, fetchEggGroup } from '../utils/api.js';
import { formatMoney } from '../utils/format.js';
import { $ } from '../utils/dom.js';

const BRACER_NAMES = {
    'HP': 'Pesa Recia',
    'Atk': 'Brazal Recio',
    'Def': 'Cinto Recio',
    'SpA': 'Lente Recia',
    'SpD': 'Banda Recia',
    'Spe': 'Franja Recia'
};

let currentGenderCost = 0;
let currentEggGroup = "";
let panZoomInstance = null;
let currentEggGroupSpecies = [];

export function renderBreedingView() {
    return `
<div id="view-breeding" class="hidden animate-fade-in pb-20">
    <div class="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-os-border gap-4">
        <div>
            <div class="flex items-center gap-2.5">
                <span class="text-xl font-pokemon text-amber-400">Crianza Maestra</span>
                <span class="text-[10px] font-mono uppercase bg-os-elevated border border-os-border text-os-blue px-2 py-0.5 rounded font-semibold">Simulador IVs</span>
            </div>
            <p class="text-xs text-os-muted mt-1">Generador de árboles genealógicos y presupuesto exacto de brazales para el GTL.</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Controles -->
        <div class="lg:col-span-1 space-y-6">
            <div class="panel p-5 rounded-xl">
                
                <div class="mb-4 border-b border-os-border pb-4">
                    <label class="block text-xs font-mono text-os-muted mb-2">Pokémon Objetivo (Opcional):</label>
                    <div class="flex gap-2">
                        <input type="text" id="breeding-target" list="pokedex-list-breeding" class="w-full bg-os-bg border border-os-border text-xs p-2.5 rounded-lg text-os-text focus:border-os-blue outline-none font-mono" placeholder="Ej. Garchomp">
                        <button id="btn-fetch-pokemon" class="px-3 bg-os-elevated hover:bg-os-blue hover:text-black border border-os-border text-os-text rounded-lg transition cursor-pointer">🔍</button>
                    </div>
                    <div id="target-info" class="text-xs text-os-muted mt-2.5 hidden flex-col gap-1.5 bg-os-bg p-2.5 rounded-lg border border-os-border">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-os-muted font-mono">Grupos Huevo:</span>
                            <span id="target-egg-group" class="text-white font-bold flex flex-wrap gap-1"></span>
                        </div>
                        <div class="font-mono">Costo Género: <span id="target-gender-cost" class="text-amber-400 font-bold tabular-nums"></span> por cruce</div>
                    </div>
                </div>
                <datalist id="pokedex-list-breeding"></datalist>

                <h2 class="text-xs font-mono font-semibold text-os-text mb-3 uppercase tracking-wider border-b border-os-border pb-2">Selección de IVs a 31</h2>
                
                <div class="grid grid-cols-2 gap-2.5 mb-4">
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded-lg hover:bg-os-elevated cursor-pointer transition select-none">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="HP" checked>
                        <span class="text-xs font-mono">Salud (HP)</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded-lg hover:bg-os-elevated cursor-pointer transition select-none">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Atk" checked>
                        <span class="text-xs font-mono">Ataque</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded-lg hover:bg-os-elevated cursor-pointer transition select-none">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Def" checked>
                        <span class="text-xs font-mono">Defensa</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded-lg hover:bg-os-elevated cursor-pointer transition select-none">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="SpA">
                        <span class="text-xs font-mono">Atq. Esp</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded-lg hover:bg-os-elevated cursor-pointer transition select-none">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="SpD" checked>
                        <span class="text-xs font-mono">Def. Esp</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded-lg hover:bg-os-elevated cursor-pointer transition select-none">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Spe" checked>
                        <span class="text-xs font-mono">Velocidad</span>
                    </label>
                </div>

                <div class="border-t border-os-border pt-4">
                    <label class="flex items-center gap-2 p-2 border border-amber-500/30 bg-amber-500/10 rounded-lg cursor-pointer transition mb-4 select-none">
                        <input type="checkbox" id="breeding-nature" class="w-4 h-4 rounded border-os-border bg-os-bg accent-amber-500" checked>
                        <span class="text-xs font-mono text-amber-300 font-semibold">Heredar Naturaleza</span>
                    </label>
                    
                    <label class="block text-xs font-mono text-os-muted mb-2">Ahorro: Ya poseo en mi caja...</label>
                    <select id="owned-breeder" class="w-full bg-os-bg border border-os-border text-xs p-2.5 rounded-lg text-os-text focus:border-os-blue outline-none cursor-pointer font-mono">
                        <option value="none">Ninguno (Desde cero)</option>
                        <option value="2_false">Un 2x31</option>
                        <option value="2_true">Un 2x31 + Naturaleza</option>
                        <option value="3_false">Un 3x31</option>
                        <option value="3_true">Un 3x31 + Naturaleza</option>
                        <option value="4_false">Un 4x31</option>
                        <option value="4_true">Un 4x31 + Naturaleza</option>
                        <option value="5_false">Un 5x31</option>
                    </select>
                </div>
            </div>

            <div class="panel p-5 rounded-xl border border-os-border flex flex-col justify-between">
                <div>
                    <h2 class="text-xs font-mono font-semibold text-os-blue mb-3 uppercase tracking-wider border-b border-os-border pb-2 flex items-center justify-between">
                        <span>🛒 Compras GTL</span>
                        <span class="text-[10px] text-os-muted font-normal">Insumos</span>
                    </h2>
                    <div id="shopping-list" class="space-y-2 font-mono text-xs text-os-text"></div>
                </div>
                <div class="mt-6 pt-4 border-t border-os-border text-right">
                    <div class="text-os-muted mb-1 text-[10px] uppercase font-mono font-semibold tracking-wider">Presupuesto Estimado</div>
                    <div id="cost-total-pokeyen" class="text-2xl font-mono font-bold text-amber-400 tabular-nums">$0</div>
                </div>
            </div>
        </div>

        <!-- Diagrama -->
        <div class="lg:col-span-3">
            <div class="panel p-5 rounded-xl border border-os-border min-h-[600px] overflow-auto relative">
                <div class="flex justify-between items-center mb-4 border-b border-os-border pb-3">
                    <h2 class="text-xs font-mono font-semibold text-os-text uppercase tracking-wider">Diagrama Genético (Bottom-Up)</h2>
                    <button id="btn-update-tree" class="px-3 py-1.5 bg-os-elevated hover:bg-os-blue hover:text-black border border-os-border text-xs font-mono rounded-lg transition font-semibold cursor-pointer">Actualizar Árbol</button>
                </div>
                <div id="mermaid-container" class="w-full flex justify-center mt-4">
                    <div class="text-os-muted text-xs font-mono mt-10">Selecciona entre 2 y 6 IVs para generar el árbol...</div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
}

export function renderEggGroupModal() {
    return `
<div id="egg-group-modal" class="fixed inset-0 bg-black/70 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-os-bg border border-os-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col relative" id="egg-group-modal-content-wrapper">
        <button id="btn-close-egg-group-modal" class="absolute top-4 right-4 text-os-muted hover:text-white transition cursor-pointer p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="p-5 border-b border-os-border flex-shrink-0 bg-os-border/10 rounded-t-xl">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">🥚 Grupo Huevo: <span id="egg-group-modal-title" class="text-os-blue uppercase"></span></h3>
            <p class="text-xs text-os-muted mt-1 mb-3">Toca cualquier Pokémon para seleccionarlo como objetivo de crianza.</p>
            <div class="relative">
                <input type="text" id="egg-group-search-input" placeholder="🔍 Filtrar Pokémon de este grupo huevo..." class="w-full bg-os-bg border border-os-border text-xs p-2.5 rounded text-os-text focus:border-os-blue outline-none font-mono">
            </div>
        </div>
        <div id="egg-group-modal-content" class="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm font-mono flex-1">
        </div>
    </div>
</div>
`;
}

export function initBreeding() {
    try {
        if (window.mermaid) {
            window.mermaid.initialize({
                startOnLoad: false,
                theme: 'dark',
                themeVariables: {
                    fontFamily: 'JetBrains Mono',
                    primaryColor: '#0f172a',
                    primaryTextColor: '#e2e8f0',
                    primaryBorderColor: '#3b82f6',
                    lineColor: '#64748b',
                    secondaryColor: '#1e293b',
                    tertiaryColor: '#334155',
                    edgeLabelBackground: '#000000'
                }
            });
        }
    } catch(e) {
        console.error("Mermaid init error", e);
    }

    const modal = $('#egg-group-modal');
    if (modal) {
        modal.addEventListener('click', closeEggGroupModal);
    }
    const modalWrapper = $('#egg-group-modal-content-wrapper');
    if (modalWrapper) {
        modalWrapper.addEventListener('click', (e) => e.stopPropagation());
    }
    const btnCloseModal = $('#btn-close-egg-group-modal');
    if (btnCloseModal) {
        btnCloseModal.addEventListener('click', closeEggGroupModal);
    }

    getPokedexDb().then(db => {
        if (Array.isArray(db)) {
            const datalist = $('#pokedex-list-breeding');
            if (datalist) {
                const uniqueNames = [...new Set(db.map(p => p.name))].sort();
                datalist.innerHTML = uniqueNames.map(n => `<option value="${n}">`).join('');
            }
        }
    });

    const eggSearch = $('#egg-group-search-input');
    if (eggSearch) {
        eggSearch.addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            renderEggGroupFiltered(q);
        });
    }

    const btnFetch = $('#btn-fetch-pokemon');
    if (btnFetch) {
        btnFetch.addEventListener('click', (e) => {
            e.preventDefault();
            fetchPokemonData();
        });
    }
    
    const targetInput = $('#breeding-target');
    if (targetInput) {
        targetInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchPokemonData();
            }
        });
        targetInput.addEventListener('change', fetchPokemonData);
        targetInput.addEventListener('input', (e) => {
            const val = e.target.value.trim().toLowerCase();
            const datalist = $('#pokedex-list-breeding');
            if (datalist && val.length >= 2) {
                const isExactMatch = Array.from(datalist.options).some(o => o.value.toLowerCase() === val);
                if (isExactMatch) fetchPokemonData();
            }
        });
    }

    const btnUpdateTree = $('#btn-update-tree');
    if (btnUpdateTree) btnUpdateTree.addEventListener('click', generateBreedingTree);
    
    const ivCheckboxes = document.querySelectorAll('.iv-checkbox');
    ivCheckboxes.forEach(cb => cb.addEventListener('change', generateBreedingTree));
    
    const natureCheckbox = $('#breeding-nature');
    if (natureCheckbox) natureCheckbox.addEventListener('change', generateBreedingTree);
    
    const ownedBreeder = $('#owned-breeder');
    if (ownedBreeder) ownedBreeder.addEventListener('change', generateBreedingTree);

    // Initial generate if tab is active
    setTimeout(generateBreedingTree, 800);
}

let POKEMMO_DB_CACHE = null;

async function getPokedexDb() {
    if (POKEMMO_DB_CACHE && POKEMMO_DB_CACHE.length > 0) return POKEMMO_DB_CACHE;
    try {
        const res = await fetch('data/pokemmo_db.json');
        POKEMMO_DB_CACHE = await res.json();
        return POKEMMO_DB_CACHE;
    } catch(e) {
        console.warn('Could not load pokemmo_db.json', e);
        return [];
    }
}

export async function fetchPokemonData() {
    const inputEl = $('#breeding-target');
    const rawVal = inputEl ? inputEl.value.trim() : '';
    if (!rawVal) {
        currentEggGroup = "";
        currentGenderCost = 0;
        const targetInfo = $('#target-info');
        if (targetInfo) {
            targetInfo.classList.add('hidden');
            targetInfo.classList.remove('flex');
        }
        generateBreedingTree();
        return;
    }

    const infoDiv = $('#target-info');
    const eggGroupSpan = $('#target-egg-group');
    const genderCostSpan = $('#target-gender-cost');

    if (eggGroupSpan) eggGroupSpan.innerHTML = '<span class="text-os-muted font-mono animate-pulse">Buscando...</span>';
    if (infoDiv) {
        infoDiv.classList.remove('hidden');
        infoDiv.classList.add('flex');
    }

    try {
        const db = await getPokedexDb();
        let queryTarget = rawVal;

        if (Array.isArray(db) && db.length > 0) {
            const found = db.find(p => p.name.toLowerCase() === rawVal.toLowerCase() || p.id.toString() === rawVal);
            if (found) {
                queryTarget = found.id;
                if (inputEl && inputEl.value !== found.name && isNaN(rawVal)) {
                    inputEl.value = found.name;
                }
            }
        }

        const data = await fetchPokemonSpecies(queryTarget);
        if (!data) throw new Error('No encontrado');

        const eggGroups = data.egg_groups || [];
        const eggGroupsStr = eggGroups.map(eg => eg.name).join(', ').toUpperCase();

        if (eggGroupSpan) {
            if (eggGroups.length === 0) {
                eggGroupSpan.innerHTML = '<span class="text-os-muted font-mono">Ninguno (No cría)</span>';
            } else {
                eggGroupSpan.innerHTML = eggGroups.map(eg => 
                    `<button type="button" data-egggroup="${eg.name}" class="egg-group-btn text-xs bg-os-blue/15 hover:bg-os-blue hover:text-black border border-os-blue/40 text-os-blue font-semibold px-2 py-0.5 rounded transition uppercase mr-1.5 cursor-pointer shadow-sm font-mono">${eg.name}</button>`
                ).join('');

                eggGroupSpan.querySelectorAll('.egg-group-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const group = e.currentTarget.getAttribute('data-egggroup');
                        if (group) showEggGroupModal(group);
                    });
                });
            }
        }

        let cost = 0;
        let rate = data.gender_rate;
        let costText = "";

        if (rate === -1) {
            cost = 0;
            costText = "Sin género (Requiere Ditto)";
        } else if (rate === 4) {
            cost = 5000;
            costText = "5,000¥ (50% M / 50% H)";
        } else if (rate === 2 || rate === 6) {
            cost = 9000;
            costText = "9,000¥ (25% / 75%)";
        } else if (rate === 1 || rate === 7) {
            cost = 21000;
            costText = "21,000¥ (12.5% / 87.5%)";
        } else if (rate === 0 || rate === 8) {
            cost = 0;
            costText = "100% un solo género";
        } else {
            cost = 5000;
            costText = "5,000¥";
        }

        currentGenderCost = cost;
        currentEggGroup = eggGroupsStr;

        if (genderCostSpan) genderCostSpan.innerText = costText;

        generateBreedingTree();
    } catch (e) {
        console.error('Error in fetchPokemonData:', e);
        if (eggGroupSpan) eggGroupSpan.innerHTML = '<span class="text-os-red font-mono">No encontrado</span>';
        if (genderCostSpan) genderCostSpan.innerText = '-';
        currentGenderCost = 0;
        currentEggGroup = "";
        generateBreedingTree();
    }
}

export async function generateBreedingTree() {
    const checkboxes = document.querySelectorAll('.iv-checkbox:checked');
    const targetStats = Array.from(checkboxes).map(cb => cb.value);
    const useNatureEl = $('#breeding-nature');
    const useNature = useNatureEl ? useNatureEl.checked : false;
    
    const container = $('#mermaid-container');
    const listContainer = $('#shopping-list');
    const costTotalEl = $('#cost-total-pokeyen');
    
    if (!container || !listContainer) return;

    if (targetStats.length < 2) {
        container.innerHTML = '<div class="text-os-muted text-sm mt-10">Debes seleccionar al menos 2 IVs para criar.</div>';
        listContainer.innerHTML = '<div class="text-os-muted">Sin datos.</div>';
        if(costTotalEl) costTotalEl.innerText = '$0';
        return;
    }

    if (targetStats.length > 6) {
        container.innerHTML = '<div class="text-red-400 text-sm mt-10">No puedes seleccionar más de 6 IVs.</div>';
        return;
    }

    let bracers = {};
    let breeders = {};
    let everstones = 0;
    
    const ownedBreederEl = $('#owned-breeder');
    const ownedBreeder = ownedBreederEl ? ownedBreederEl.value : 'none';
    let ownedUsed = false;
    
    function addBracer(s) { bracers[s] = (bracers[s]||0) + 1; }
    function addBreeder(s) { breeders[s] = (breeders[s]||0) + 1; }
    
    function calculateNeeds(stats, hasNature) {
         if (!ownedUsed && ownedBreeder !== 'none' && stats.length >= 2) {
             const parts = ownedBreeder.split('_');
             const ownN = parseInt(parts[0]);
             const ownNat = parts[1] === 'true';
             if (stats.length === ownN && hasNature === ownNat) {
                 let label = `Propio: ${stats.length}x31${hasNature ? ' + Nat' : ''}`;
                 addBreeder(label);
                 ownedUsed = true;
                 return;
             }
         }

         if (stats.length === 1 && !hasNature) {
             addBreeder(stats[0]);
             return;
         }
         if (stats.length === 0 && hasNature) {
             addBreeder('Nature');
             return;
         }
         
         if (hasNature) {
             let overlap = stats.slice(0, stats.length - 1);
             let forcedStat = stats[stats.length - 1];
             addBracer(forcedStat);
             everstones++;
             
             calculateNeeds(stats, false);
             calculateNeeds(overlap, true);
         } else {
             let overlap = stats.slice(0, stats.length - 2);
             let f1 = stats[stats.length - 2];
             let f2 = stats[stats.length - 1];
             addBracer(f1);
             addBracer(f2);
             
             calculateNeeds(overlap.concat([f1]), false);
             calculateNeeds(overlap.concat([f2]), false);
         }
    }
    
    calculateNeeds(targetStats, useNature);

    let costBracers = 0;
    let htmlList = '';
    
    for (const stat of Object.keys(bracers)) {
        let count = bracers[stat];
        costBracers += (count * 10000);
        htmlList += `
            <div class="flex justify-between border-b border-os-border/50 pb-2">
                <span>${count}x ${BRACER_NAMES[stat]} (${stat})</span>
                <span class="text-blue-300">${(count*10).toLocaleString()}k</span>
            </div>
        `;
    }
    
    if (everstones > 0) {
        htmlList += `
            <div class="flex justify-between border-b border-os-border/50 pb-2">
                <span>${everstones}x Piedraeterna</span>
                <span class="text-amber-300">~${(everstones*5).toLocaleString()}k</span>
            </div>
        `;
    }

    htmlList += `<div class="mt-4 pt-2 mb-2 font-bold text-white uppercase">Criadores Base (1x31):</div>`;
    for (const stat of Object.keys(breeders)) {
        let count = breeders[stat];
        let eggSuffix = currentEggGroup ? ` (${currentEggGroup})` : '';
        let name = stat === 'Nature' ? `Pokémon con Naturaleza${eggSuffix}` : `Pokémon 1x31 en ${stat}${eggSuffix}`;
        htmlList += `
            <div class="flex justify-between text-[11px] text-os-muted">
                <span>- ${count}x ${name}</span>
            </div>
        `;
    }

    let totalBaseBreeders = Object.values(breeders).reduce((a,b)=>a+b, 0);
    let totalBreedingSteps = totalBaseBreeders - 1;
    let genderSelections = Math.max(0, totalBreedingSteps - 1); 
    let totalGenderCost = currentGenderCost * genderSelections;
    
    if (currentGenderCost > 0) {
        htmlList += `
            <div class="flex justify-between border-b border-amber-900/50 pb-2 mt-4">
                <span class="text-amber-400">${genderSelections}x Selección de Género (${(currentGenderCost/1000)}k)</span>
                <span class="text-amber-300">~${(totalGenderCost/1000).toLocaleString()}k</span>
            </div>
        `;
    }

    const totalCost = costBracers + (everstones * 5000) + totalGenderCost;
    listContainer.innerHTML = htmlList;
    if(costTotalEl) costTotalEl.innerText = formatMoney(totalCost);

    let mGraph = 'graph BT\n';
    let nodeId = 0;
    let ownedGraphUsed = false;
    
    function buildGraph(stats, hasNature) {
        let currentId = `N${nodeId++}`;
        let label = '';
        let isBase = false;

        if (!ownedGraphUsed && ownedBreeder !== 'none' && stats.length >= 2) {
             const parts = ownedBreeder.split('_');
             const ownN = parseInt(parts[0]);
             const ownNat = parts[1] === 'true';
             if (stats.length === ownN && hasNature === ownNat) {
                 label = `(TU CAJA)<br/>${stats.length}x31${hasNature ? '<br/>+ Nat' : ''}`;
                 isBase = true;
                 ownedGraphUsed = true;
             }
        }

        if (!isBase) {
            if (stats.length === 1 && !hasNature) {
                label = `1x31 ${stats[0]}`;
                isBase = true;
            } else if (stats.length === 0 && hasNature) {
                label = `Naturaleza`;
                isBase = true;
            } else {
                label = `${stats.length}x31${hasNature ? '<br/>+ Nat' : ''}`;
            }
        }

        mGraph += `${currentId}["${label}"]\n`;

        if (isBase) {
            return currentId;
        }

        if (hasNature) {
            let overlap = stats.slice(0, stats.length - 1);
            let forcedStat = stats[stats.length - 1];
            
            let child1 = buildGraph(stats, false);
            let child2 = buildGraph(overlap, true);
            
            mGraph += `${child1} -->|"${BRACER_NAMES[forcedStat]}"| ${currentId}\n`;
            mGraph += `${child2} -->|"Piedraeterna"| ${currentId}\n`;
        } else {
            let overlap = stats.slice(0, stats.length - 2);
            let f1 = stats[stats.length - 2];
            let f2 = stats[stats.length - 1];
            
            let child1 = buildGraph(overlap.concat([f1]), false);
            let child2 = buildGraph(overlap.concat([f2]), false);
            
            mGraph += `${child1} -->|"${BRACER_NAMES[f1]}"| ${currentId}\n`;
            mGraph += `${child2} -->|"${BRACER_NAMES[f2]}"| ${currentId}\n`;
        }
        
        return currentId;
    }

    buildGraph(targetStats, useNature);
    mGraph += `style N0 fill:#1e3a8a,stroke:#3b82f6,stroke-width:3px,color:#fff\n`;

    const viewBreeding = $('#view-breeding');
    if (viewBreeding && viewBreeding.classList.contains('hidden')) {
        // Tab is hidden, skip SVG bounding-box calculation until tab becomes active
        return;
    }

    try {
        if (window.mermaid) {
            if (panZoomInstance) {
                try {
                    panZoomInstance.destroy();
                } catch(err) {
                    console.warn('panZoom cleanup:', err);
                }
                panZoomInstance = null;
            }

            container.innerHTML = '';

            const uniqueId = 'mermaid-tree-' + Math.random().toString(36).substring(2, 9);
            const { svg } = await window.mermaid.render(uniqueId, mGraph);
            container.innerHTML = svg;
            
            const svgElement = container.querySelector('svg');
            if (svgElement && typeof window.svgPanZoom !== 'undefined') {
                svgElement.style.width = '100%';
                svgElement.style.height = '600px'; 
                svgElement.style.maxWidth = 'none';
                
                panZoomInstance = window.svgPanZoom(svgElement, {
                    zoomEnabled: true,
                    controlIconsEnabled: true,
                    fit: true,
                    center: true,
                    minZoom: 0.1,
                    maxZoom: 10,
                    zoomScaleSensitivity: 0.2
                });
            }
        }
    } catch (e) {
        console.error('Mermaid render error:', e);
        container.innerHTML = `<div class="text-red-400 p-4 bg-red-900/30 rounded border border-red-500 text-xs">Error renderizando el diagrama: ${e.message || e}</div>`;
    }
}

export function closeEggGroupModal() {
    const modal = $('#egg-group-modal');
    if (modal) modal.classList.add('hidden');
}

export function renderEggGroupFiltered(filter = '') {
    const content = $('#egg-group-modal-content');
    if (!content) return;
    
    const query = filter.trim().toLowerCase();
    const filtered = query 
        ? currentEggGroupSpecies.filter(name => name.toLowerCase().includes(query))
        : currentEggGroupSpecies;

    if (filtered.length === 0) {
        content.innerHTML = '<div class="col-span-full text-center text-os-muted py-8 text-xs">No se encontraron Pokémon con ese nombre en este grupo.</div>';
        return;
    }

    content.innerHTML = filtered.map(name => 
        `<button type="button" data-pokename="${name}" class="btn-select-egg-pokemon bg-os-border/20 hover:bg-os-blue/30 hover:border-os-blue/60 border border-os-border/50 px-2 py-2.5 rounded text-os-text capitalize text-center cursor-pointer transition-colors text-xs flex items-center justify-center min-h-[38px] break-words active:scale-95" title="Seleccionar ${name}">
            ${name.replace(/-/g, ' ')}
        </button>`
    ).join('');

    content.querySelectorAll('.btn-select-egg-pokemon').forEach(btn => {
        btn.addEventListener('click', () => {
            const pokename = btn.getAttribute('data-pokename');
            if (pokename) {
                const targetInput = $('#breeding-target');
                if (targetInput) targetInput.value = pokename;
                closeEggGroupModal();
                fetchPokemonData();
            }
        });
    });
}

export async function showEggGroupModal(groupName) {
    const modal = $('#egg-group-modal');
    const title = $('#egg-group-modal-title');
    const content = $('#egg-group-modal-content');
    const searchInput = $('#egg-group-search-input');
    
    if (searchInput) searchInput.value = '';
    if (modal) modal.classList.remove('hidden');
    if (title) title.innerText = groupName;
    if (content) content.innerHTML = '<div class="col-span-full text-center text-os-blue py-10 animate-pulse text-xs">Cargando Pokémon del grupo huevo...</div>';
    
    try {
        const data = await fetchEggGroup(groupName);
        if (!data) throw new Error('Error al cargar');
        
        currentEggGroupSpecies = data.pokemon_species.map(p => p.name).sort();
        renderEggGroupFiltered('');
        if (searchInput) searchInput.focus();
    } catch (e) {
        if (content) content.innerHTML = '<div class="col-span-full text-center text-red-400 py-8 text-xs">Error de red al obtener datos de PokeAPI.</div>';
    }
}




