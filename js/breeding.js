const breedingViewHTML = `
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
                        <input type="text" id="breeding-target" list="pokedex-list-breeding" class="w-full bg-os-bg border border-os-border text-sm p-2 rounded text-os-text focus:border-os-blue outline-none" placeholder="Ej. Garchomp" onchange="fetchPokemonData()">
                        <button onclick="fetchPokemonData()" class="px-3 bg-os-border hover:bg-os-blue text-os-text rounded">🔍</button>
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
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="HP" checked onchange="generateBreedingTree()">
                        <span class="text-sm font-mono">Salud (HP)</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Atk" checked onchange="generateBreedingTree()">
                        <span class="text-sm font-mono">Ataque</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Def" checked onchange="generateBreedingTree()">
                        <span class="text-sm font-mono">Defensa</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="SpA" onchange="generateBreedingTree()">
                        <span class="text-sm font-mono">Atq. Esp</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="SpD" checked onchange="generateBreedingTree()">
                        <span class="text-sm font-mono">Def. Esp</span>
                    </label>
                    <label class="flex items-center gap-2 p-2 border border-os-border rounded hover:bg-os-border/30 cursor-pointer transition">
                        <input type="checkbox" class="iv-checkbox w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" value="Spe" checked onchange="generateBreedingTree()">
                        <span class="text-sm font-mono">Velocidad</span>
                    </label>
                </div>

                <div class="border-t border-os-border/50 pt-4">
                    <label class="flex items-center gap-2 p-2 border border-amber-500/30 bg-amber-500/10 rounded cursor-pointer transition">
                        <input type="checkbox" id="breeding-nature" class="w-4 h-4 rounded border-os-border bg-os-bg accent-amber-500" onchange="generateBreedingTree()" checked>
                        <span class="text-sm font-mono text-amber-300">Heredar Naturaleza</span>
                    </label>
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
                    <button onclick="generateBreedingTree()" class="px-3 py-1 bg-os-border hover:bg-os-blue text-xs font-mono rounded transition shadow">Actualizar Árbol</button>
                </div>
                <div id="mermaid-container" class="w-full flex justify-center mt-4">
                    <div class="text-os-muted text-sm mt-10">Selecciona entre 2 y 6 IVs para generar el árbol...</div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

if (!document.getElementById('view-breeding')) {
    document.querySelector('main').insertAdjacentHTML('beforeend', breedingViewHTML);
}

try {
    mermaid.initialize({
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
} catch(e){}

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

async function fetchPokemonData() {
    const input = document.getElementById('breeding-target').value.trim().toLowerCase();
    if (!input) {
        currentEggGroup = "";
        currentGenderCost = 0;
        document.getElementById('target-info').classList.add('hidden');
        generateBreedingTree();
        return;
    }

    const infoDiv = document.getElementById('target-info');
    const eggGroupSpan = document.getElementById('target-egg-group');
    const genderCostSpan = document.getElementById('target-gender-cost');

    eggGroupSpan.innerText = 'Cargando...';
    infoDiv.classList.remove('hidden');

    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${input}`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        
        const eggGroups = data.egg_groups.map(eg => eg.name).join(', ').toUpperCase();
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
        currentEggGroup = eggGroups;
        
        eggGroupSpan.innerText = eggGroups;
        genderCostSpan.innerText = costText;

        generateBreedingTree();
    } catch (e) {
        eggGroupSpan.innerText = 'Error / Nombre no válido';
        genderCostSpan.innerText = '-';
        currentGenderCost = 0;
        currentEggGroup = "";
        generateBreedingTree();
    }
}

setTimeout(() => {
    try {
        let db = JSON.parse(localStorage.getItem('pokemmo_custom_db')) || [];
        if(db.length > 0) {
            const datalist = document.getElementById('pokedex-list-breeding');
            let uniqueNames = [...new Set(db.map(p => p.name))];
            datalist.innerHTML = uniqueNames.map(n => `<option value="${n}">`).join('');
        }
    } catch(e) {}
}, 2000);

async function generateBreedingTree() {
    const checkboxes = document.querySelectorAll('.iv-checkbox:checked');
    const targetStats = Array.from(checkboxes).map(cb => cb.value);
    const useNature = document.getElementById('breeding-nature').checked;
    
    const container = document.getElementById('mermaid-container');
    const listContainer = document.getElementById('shopping-list');
    
    if (targetStats.length < 2) {
        container.innerHTML = '<div class="text-os-muted text-sm mt-10">Debes seleccionar al menos 2 IVs para criar.</div>';
        listContainer.innerHTML = '<div class="text-os-muted">Sin datos.</div>';
        document.getElementById('cost-total-pokeyen').innerText = '$0';
        return;
    }

    if (targetStats.length > 6) {
        container.innerHTML = '<div class="text-red-400 text-sm mt-10">No puedes seleccionar más de 6 IVs.</div>';
        return;
    }

    let bracers = {};
    let breeders = {};
    let everstones = 0;
    
    function addBracer(s) { bracers[s] = (bracers[s]||0) + 1; }
    function addBreeder(s) { breeders[s] = (breeders[s]||0) + 1; }
    
    function calculateNeeds(stats, hasNature) {
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
    document.getElementById('cost-total-pokeyen').innerText = '$' + totalCost.toLocaleString();

    let mGraph = 'graph TD\n';
    const label = useNature ? `${targetStats.length}x31 + Nat` : `${targetStats.length}x31`;
    
    if (targetStats.length <= 3) {
        if (targetStats.length === 2) {
            if(useNature) {
                mGraph += `A["Naturaleza<br/>(Piedraeterna)"] --> C["2x31 + Nat"]\n`;
                mGraph += `B["1x31 ${targetStats[0]}<br/>(${BRACER_NAMES[targetStats[0]]})"] --> C\n`;
            } else {
                mGraph += `A["1x31 ${targetStats[0]}<br/>(${BRACER_NAMES[targetStats[0]]})"] --> C["2x31"]\n`;
                mGraph += `B["1x31 ${targetStats[1]}<br/>(${BRACER_NAMES[targetStats[1]]})"] --> C\n`;
            }
        } else {
            if(useNature) {
                mGraph += `A["1x31 ${targetStats[0]}<br/>+ Naturaleza"] --> |"${BRACER_NAMES[targetStats[0]]} + Piedra"| D["2x31 + Nat"]\n`;
                mGraph += `B["1x31 ${targetStats[1]}"] --> D\n`;
                mGraph += `C["2x31 (${targetStats[1]}, ${targetStats[2]})"] --> |"2 Brazales"| E["3x31"]\n`;
                mGraph += `D --> |"${BRACER_NAMES[targetStats[1]]} + Piedra"| E\n`;
            } else {
                mGraph += `A["2x31 (${targetStats[0]}, ${targetStats[1]})"] --> |"Brazales ${targetStats[0]}+${targetStats[1]}"| C["3x31"]\n`;
                mGraph += `B["2x31 (${targetStats[1]}, ${targetStats[2]})"] --> |"Brazales ${targetStats[1]}+${targetStats[2]}"| C\n`;
            }
        }
    } else {
        mGraph += `Master["Meta:<br/>${label}"]\nstyle Master fill:#1e3a8a,stroke:#3b82f6,stroke-width:4px\n`;
        let p1Label = `Padre:<br/>${targetStats.length-1}x31${useNature ? ' + Nat' : ''}`;
        let p2Label = `Madre:<br/>${targetStats.length-1}x31`;
        let item1 = useNature ? 'Piedraeterna' : BRACER_NAMES[targetStats[targetStats.length-2]];
        let item2 = BRACER_NAMES[targetStats[targetStats.length-1]];

        mGraph += `P1["${p1Label}"] --> |"${item1}"| Master\n`;
        mGraph += `P2["${p2Label}"] --> |"${item2}"| Master\n`;
        mGraph += `GP1["Rama:<br/>${targetStats.length-2}x31"] -.-> P1\n`;
        mGraph += `GP2["Rama:<br/>${targetStats.length-2}x31"] -.-> P2\n`;
    }

    try {
        const { svg } = await mermaid.render('breeding-mermaid-svg', mGraph);
        container.innerHTML = svg;
    } catch (e) {
        console.error('Mermaid render error:', e);
        container.innerHTML = `<div class="text-red-400 p-4 bg-red-900/30 rounded border border-red-500">Error renderizando el diagrama.</div>`;
    }
}

setTimeout(generateBreedingTree, 800);
