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

export function renderBreedingView() {
    return `
<div id="view-breeding" class="hidden animate-fade-in pb-20">
    <div class="flex justify-between items-end mb-8 pb-4 border-b border-os-border">
        <div>
            <h1 class="text-2xl font-semibold text-os-text flex items-center gap-2">🥚 Calculadora de Crianza Maestra</h1>
            <p class="text-sm text-os-muted mt-1">Selecciona tus IVs deseados para generar la lista de compras exacta del GTL.</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Controles -->
        <div class="lg:col-span-1 space-y-6">
            <div class="panel p-5 border border-os-border rounded-md bg-os-bg shadow-lg">
                
                <div class="mb-4 border-b border-os-border/50 pb-4">
                    <label class="block text-xs font-mono text-os-muted mb-2">Pokémon Objetivo (Opcional):</label>
                    <div class="flex gap-2">
                        <input type="text" id="breeding-target" list="pokedex-list-breeding" class="w-full bg-os-bg border border-os-border text-sm p-2 rounded text-os-text focus:border-os-blue outline-none" placeholder="Ej. Garchomp">
                        <button id="btn-fetch-pokemon" class="px-3 bg-os-border hover:bg-os-blue text-os-text rounded">🔍</button>
                    </div>
                    <div id="target-info" class="text-xs text-os-muted mt-2 hidden flex flex-col gap-1">
                        <div>Grupos Huevo: <span id="target-egg-group" class="text-white font-bold"></span></div>
                        <div>Costo Género: <span id="target-gender-cost" class="text-amber-400 font-bold"></span> por cruce</div>
                    </div>
                </div>
                <datalist id="pokedex-list-breeding"></datalist>

                <h2 class="text-sm font-bold text-os-text mb-4 uppercase tracking-wider border-b border-os-border/50 pb-2">Selección de IVs a 31</h2>
                
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="HP" checked>
                        <span class="text-sm font-mono">Salud (HP)</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Atk" checked>
                        <span class="text-sm font-mono">Ataque</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Def" checked>
                        <span class="text-sm font-mono">Defensa</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="SpA">
                        <span class="text-sm font-mono">Atq. Esp</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="SpD" checked>
                        <span class="text-sm font-mono">Def. Esp</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Spe" checked>
                        <span class="text-sm font-mono">Velocidad</span>
                    </label>
                </div>

                <div class="border-t border-os-border/50 pt-4">
                    <label class="flex items-center gap-2 p-2 border border-amber-500/30 bg-amber-500/10 rounded cursor-pointer transition mb-4">
                        <input type="checkbox" id="breeding-nature" class="w-4 h-4 rounded border-os-border bg-os-bg accent-amber-500" checked>
                        <span class="text-sm font-mono text-amber-300">Heredar Naturaleza</span>
                    </label>
                    
                    <label class="block text-xs font-mono text-os-muted mb-2">Ahorro: Ya poseo en mi caja...</label>
                    <select id="owned-breeder" class="w-full bg-os-bg border border-os-border text-sm p-2 rounded text-os-text focus:border-os-blue outline-none cursor-pointer font-mono">
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

            <div class="panel p-5 border border-os-border rounded-md bg-[#0a192f] border-blue-900/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <h2 class="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider border-b border-blue-900 pb-2">🛒 Lista de Compras GTL</h2>
                <div id="shopping-list" class="space-y-3 font-mono text-xs text-os-text"></div>
                <div class="mt-6 pt-4 border-t border-os-border/50 text-right">
                    <div class="text-os-muted mb-1 text-[10px]">Presupuesto Estimado</div>
                    <div id="cost-total-pokeyen" class="text-xl font-bold text-emerald-400">$0</div>
                </div>
            </div>
        </div>

        <!-- Diagrama -->
        <div class="lg:col-span-3">
            <div class="panel p-5 border border-os-border rounded-md bg-[#1e1e1e] min-h-[600px] overflow-auto relative shadow-lg">
                <div class="flex justify-between items-center mb-4 border-b border-os-border/50 pb-2">
                    <h2 class="text-sm font-bold text-os-text uppercase tracking-wider">Diagrama Genético (Bottom-Up)</h2>
                    <button id="btn-update-tree" class="px-3 py-1 bg-os-border hover:bg-os-blue text-xs font-mono rounded transition shadow">Actualizar Árbol</button>
                </div>
                <div id="mermaid-container" class="w-full flex justify-center mt-4">
                    <div class="text-os-muted text-sm mt-10">Selecciona entre 2 y 6 IVs para generar el árbol...</div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
}

export function renderEggGroupModal() {
    return `
<div id="egg-group-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4 backdrop-blur-sm">
    <div class="bg-os-bg border border-os-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col relative" id="egg-group-modal-content-wrapper">
        <button id="btn-close-egg-group-modal" class="absolute top-4 right-4 text-os-muted hover:text-white transition cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="p-5 border-b border-os-border flex-shrink-0 bg-os-border/10 rounded-t-lg">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">🥚 Grupo Huevo: <span id="egg-group-modal-title" class="text-os-blue uppercase"></span></h3>
            <p class="text-xs text-os-muted mt-1">Lista de Pokémon que pertenecen a este grupo huevo.</p>
        </div>
        <div id="egg-group-modal-content" class="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm font-mono flex-1">
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

    try {
        let db = JSON.parse(localStorage.getItem('pokemmo_custom_db')) || [];
        if(db.length > 0) {
            const datalist = $('#pokedex-list-breeding');
            if (datalist) {
                let uniqueNames = [...new Set(db.map(p => p.name))];
                datalist.innerHTML = uniqueNames.map(n => `<option value="${n}">`).join('');
            }
        }
    } catch(e) {}

    const btnFetch = $('#btn-fetch-pokemon');
    if (btnFetch) btnFetch.addEventListener('click', fetchPokemonData);
    
    const targetInput = $('#breeding-target');
    if (targetInput) targetInput.addEventListener('change', fetchPokemonData);

    const btnUpdateTree = $('#btn-update-tree');
    if (btnUpdateTree) btnUpdateTree.addEventListener('click', generateBreedingTree);
    
    const ivCheckboxes = document.querySelectorAll('.iv-checkbox');
    ivCheckboxes.forEach(cb => cb.addEventListener('change', generateBreedingTree));
    
    const natureCheckbox = $('#breeding-nature');
    if (natureCheckbox) natureCheckbox.addEventListener('change', generateBreedingTree);
    
    const ownedBreeder = $('#owned-breeder');
    if (ownedBreeder) ownedBreeder.addEventListener('change', generateBreedingTree);

    // Initial generate
    setTimeout(generateBreedingTree, 800);
}

export async function fetchPokemonData() {
    const inputEl = $('#breeding-target');
    const input = inputEl ? inputEl.value.trim().toLowerCase() : '';
    if (!input) {
        currentEggGroup = "";
        currentGenderCost = 0;
        const targetInfo = $('#target-info');
        if(targetInfo) targetInfo.classList.add('hidden');
        generateBreedingTree();
        return;
    }

    const infoDiv = $('#target-info');
    const eggGroupSpan = $('#target-egg-group');
    const genderCostSpan = $('#target-gender-cost');

    if(eggGroupSpan) eggGroupSpan.innerText = 'Cargando...';
    if(infoDiv) infoDiv.classList.remove('hidden');

    try {
        const data = await fetchPokemonSpecies(input);
        if (!data) throw new Error('No encontrado');
        
        const eggGroupsStr = data.egg_groups.map(eg => eg.name).join(', ').toUpperCase();
        
        // Build buttons manually and bind events after innerHTML
        if(eggGroupSpan) {
            eggGroupSpan.innerHTML = data.egg_groups.map(eg => 
                `<button data-egggroup="${eg.name}" class="egg-group-btn text-[10px] bg-blue-900/40 hover:bg-blue-500/60 border border-blue-500/30 text-blue-100 px-2 py-0.5 rounded transition uppercase mr-1 cursor-pointer shadow-sm">${eg.name}</button>`
            ).join('');
            
            document.querySelectorAll('.egg-group-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const group = e.target.getAttribute('data-egggroup');
                    if (group) showEggGroupModal(group);
                });
            });
        }

        let cost = 0;
        let rate = data.gender_rate;
        let costText = "";

        if (rate === -1) {
            cost = 0;
            costText = "Sin género (Requiere Ditto)";
        } else if (rate === 4) {
            cost = 5000;
            costText = "5,000¥ (50% M/H)";
        } else if (rate === 2 || rate === 6) {
            cost = 9000;
            costText = "9,000¥ (25% / 75%)";
        } else if (rate === 1 || rate === 7) {
            cost = 21000;
            costText = "21,000¥ (12.5% / 87.5%)";
        } else if (rate === 0 || rate === 8) {
            cost = 0;
            costText = "100% un género";
        } else {
            cost = 5000;
            costText = "5,000¥";
        }

        currentGenderCost = cost;
        currentEggGroup = eggGroupsStr;
        
        if(genderCostSpan) genderCostSpan.innerText = costText;

        generateBreedingTree();
    } catch (e) {
        if(eggGroupSpan) eggGroupSpan.innerText = 'Error / Nombre no válido';
        if(genderCostSpan) genderCostSpan.innerText = '-';
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

    try {
        if(window.mermaid) {
            const { svg } = await window.mermaid.render('breeding-mermaid-svg', mGraph);
            container.innerHTML = svg;
            
            const svgElement = container.querySelector('svg');
            if (svgElement && typeof window.svgPanZoom !== 'undefined') {
                svgElement.style.width = '100%';
                svgElement.style.height = '600px'; 
                svgElement.style.maxWidth = 'none';
                
                window.svgPanZoom(svgElement, {
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
        container.innerHTML = `<div class="text-red-400 p-4 bg-red-900/30 rounded border border-red-500">Error renderizando el diagrama.</div>`;
    }
}

export function closeEggGroupModal() {
    const modal = $('#egg-group-modal');
    if(modal) modal.classList.add('hidden');
}

export async function showEggGroupModal(groupName) {
    const modal = $('#egg-group-modal');
    const title = $('#egg-group-modal-title');
    const content = $('#egg-group-modal-content');
    
    if(modal) modal.classList.remove('hidden');
    if(title) title.innerText = groupName;
    if(content) content.innerHTML = '<div class="col-span-full text-center text-os-blue py-10 animate-pulse">Cargando Pokémon del grupo...</div>';
    
    try {
        const data = await fetchEggGroup(groupName);
        if (!data) throw new Error('Error al cargar');
        
        let species = data.pokemon_species.map(p => p.name);
        species.sort();
        
        if (species.length === 0) {
            if(content) content.innerHTML = '<div class="col-span-full text-center text-os-muted py-8">No hay Pokémon en este grupo.</div>';
            return;
        }

        if(content) {
            content.innerHTML = species.map(name => 
                `<div class="bg-os-border/20 hover:bg-os-border/60 border border-os-border/50 px-2 py-2 rounded text-os-text capitalize text-center cursor-default transition-colors text-xs flex items-center justify-center min-h-[36px] break-words" title="${name}">${name.replace('-', ' ')}</div>`
            ).join('');
        }
        
    } catch (e) {
        if(content) content.innerHTML = '<div class="col-span-full text-center text-red-400 py-8">Error de red al obtener datos de PokeAPI.</div>';
    }
}




