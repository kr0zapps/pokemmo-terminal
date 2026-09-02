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

            <!-- Lista de Compras -->
            <div class="panel p-5 border border-os-border rounded-md bg-[#0a192f] border-blue-900/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <h2 class="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider border-b border-blue-900 pb-2">🛒 Lista de Compras GTL</h2>
                
                <div id="shopping-list" class="space-y-3 font-mono text-xs text-os-text">
                    <!-- Dinámico -->
                </div>
                
                <div class="mt-6 pt-4 border-t border-os-border/50 text-right">
                    <div class="text-os-muted mb-1 text-[10px]">Costo Base (Sin coste de género)</div>
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
                
                <!-- Mermaid Container -->
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

// Inicializar Mermaid
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

const BRACER_NAMES = {
    'HP': 'Pesa Recia',
    'Atk': 'Brazal Recio',
    'Def': 'Cinto Recio',
    'SpA': 'Lente Recia',
    'SpD': 'Banda Recia',
    'Spe': 'Franja Recia'
};

const STAT_COLORS = {
    'HP': '#4ade80',
    'Atk': '#f87171',
    'Def': '#fb923c',
    'SpA': '#60a5fa',
    'SpD': '#a78bfa',
    'Spe': '#f472b6',
    'Nature': '#fbbf24'
};

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
    
    // Algoritmo matemático exacto para Crianza PokeMMO
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

    // ==========================================
    // RENDERIZAR LISTA DE COMPRAS
    // ==========================================
    let costBracers = 0;
    let htmlList = '';
    
    // Brazales
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
    
    // Piedraeternas
    if (everstones > 0) {
        htmlList += `
            <div class="flex justify-between border-b border-os-border/50 pb-2">
                <span>${everstones}x Piedraeterna</span>
                <span class="text-amber-300">~${(everstones*5).toLocaleString()}k</span>
            </div>
        `;
    }

    // Criadores (Solo informativo)
    htmlList += `<div class="mt-4 pt-2 mb-2 font-bold text-white uppercase">Criadores Base (1x31):</div>`;
    for (const stat of Object.keys(breeders)) {
        let count = breeders[stat];
        let name = stat === 'Nature' ? 'Pokémon con Naturaleza' : `Pokémon 1x31 en ${stat}`;
        htmlList += `
            <div class="flex justify-between text-[11px] text-os-muted">
                <span>- ${count}x ${name}</span>
            </div>
        `;
    }

    const totalCost = costBracers + (everstones * 5000);
    listContainer.innerHTML = htmlList;
    document.getElementById('cost-total-pokeyen').innerText = '$' + totalCost.toLocaleString();

    // ==========================================
    // RENDERIZAR GRÁFICO MERMAID
    // ==========================================
    let mGraph = 'graph TD\\n';
    
    // Para simplificar la visualización y no colgar el navegador con 64 nodos, 
    // mostraremos un gráfico resumen de los cruces maestros si es mayor a 3 IVs
    const label = useNature ? `${targetStats.length}x31 + Nat` : `${targetStats.length}x31`;
    
    if (targetStats.length <= 3) {
        // Árbol completo para 2x y 3x
        if (targetStats.length === 2) {
            if(useNature) {
                mGraph += `A["Naturaleza\\n(Piedraeterna)"] --> C["2x31 + Nat"]\\n`;
                mGraph += `B["1x31 ${targetStats[0]}\\n(${BRACER_NAMES[targetStats[0]]})"] --> C\\n`;
            } else {
                mGraph += `A["1x31 ${targetStats[0]}\\n(${BRACER_NAMES[targetStats[0]]})"] --> C["2x31"]\\n`;
                mGraph += `B["1x31 ${targetStats[1]}\\n(${BRACER_NAMES[targetStats[1]]})"] --> C\\n`;
            }
        } else {
            // 3x31
            if(useNature) {
                mGraph += `A["1x31 ${targetStats[0]}\\n+ Naturaleza"] --> |"${BRACER_NAMES[targetStats[0]]} + Piedra"| D["2x31 + Nat"]\\n`;
                mGraph += `B["1x31 ${targetStats[1]}"] --> D\\n`;
                mGraph += `C["2x31 (${targetStats[1]}, ${targetStats[2]})"] --> |"2 Brazales"| E["3x31"]\\n`;
                mGraph += `D --> |"${BRACER_NAMES[targetStats[1]]} + Piedra"| E\\n`;
            } else {
                mGraph += `A["2x31 (${targetStats[0]}, ${targetStats[1]})"] --> |"Brazales ${targetStats[0]}+${targetStats[1]}"| C["3x31"]\\n`;
                mGraph += `B["2x31 (${targetStats[1]}, ${targetStats[2]})"] --> |"Brazales ${targetStats[1]}+${targetStats[2]}"| C\\n`;
            }
        }
    } else {
        // Resumen para árboles gigantes (4x31, 5x31, 6x31)
        mGraph += `Master["Meta:\\n${label}"]\\nstyle Master fill:#1e3a8a,stroke:#3b82f6,stroke-width:4px\\n`;
        
        let p1Label = `Padre:\\n${targetStats.length-1}x31${useNature ? ' + Nat' : ''}`;
        let p2Label = `Madre:\\n${targetStats.length-1}x31`;
        
        let item1 = useNature ? 'Piedraeterna' : BRACER_NAMES[targetStats[targetStats.length-2]];
        let item2 = BRACER_NAMES[targetStats[targetStats.length-1]];

        mGraph += `P1["${p1Label}"] --> |"${item1}"| Master\\n`;
        mGraph += `P2["${p2Label}"] --> |"${item2}"| Master\\n`;
        
        mGraph += `GP1["Rama:\\n${targetStats.length-2}x31"] -.-> P1\\n`;
        mGraph += `GP2["Rama:\\n${targetStats.length-2}x31"] -.-> P2\\n`;
    }

    try {
        const { svg } = await mermaid.render('breeding-mermaid-svg', mGraph);
        container.innerHTML = svg;
    } catch (e) {
        console.error('Mermaid render error:', e);
        container.innerHTML = `<div class="text-red-400 p-4 bg-red-900/30 rounded border border-red-500">Error renderizando el diagrama.</div>`;
    }
}

// Ejecutar una vez al cargar si la pestaña está activa o después de un delay
setTimeout(generateBreedingTree, 800);
