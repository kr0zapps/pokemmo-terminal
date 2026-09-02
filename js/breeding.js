const breedingViewHTML = `
<div id="view-breeding" class="hidden animate-fade-in">
    <div class="flex justify-between items-end mb-8 pb-4 border-b border-os-border">
        <div>
            <h1 class="text-2xl font-semibold text-os-text flex items-center gap-2">🥚 Calculadora de Crianza</h1>
            <p class="text-sm text-os-muted mt-1">Genera el árbol óptimo y la lista de compras para criar IVs perfectos.</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- Controles -->
        <div class="lg:col-span-1 space-y-6">
            <div class="panel p-5 border border-os-border rounded-md bg-os-bg">
                <h2 class="text-sm font-bold text-os-text mb-4 uppercase tracking-wider">Configuración de Crianza</h2>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-mono text-os-muted mb-2">Objetivo (IVs a 31):</label>
                        <select id="breeding-ivs" class="w-full bg-os-bg border border-os-border text-sm p-2 rounded text-os-text focus:border-os-blue outline-none" onchange="generateBreedingTree()">
                            <option value="2">2x31 IVs perfectos</option>
                            <option value="3">3x31 IVs perfectos</option>
                            <option value="4">4x31 IVs perfectos</option>
                            <option value="5" selected>5x31 IVs perfectos</option>
                            <option value="6">6x31 IVs perfectos</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-mono text-os-muted mb-2">¿Heredar Naturaleza?</label>
                        <div class="flex items-center gap-2">
                            <input type="checkbox" id="breeding-nature" class="w-4 h-4 rounded border-os-border bg-os-bg accent-os-blue" onchange="generateBreedingTree()" checked>
                            <span class="text-sm text-os-text">Sí, cruzar con Piedraeterna</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Lista de Compras -->
            <div class="panel p-5 border border-os-border rounded-md bg-[#0a192f] border-blue-900/50">
                <h2 class="text-sm font-bold text-blue-400 mb-4 uppercase tracking-wider">🛒 Lista de Compras (GTL)</h2>
                
                <div class="space-y-3 font-mono text-xs text-os-text">
                    <div class="flex justify-between border-b border-os-border/50 pb-2">
                        <span>Brazales (10,000¥ c/u):</span>
                        <span id="cost-bracers-qty" class="font-bold text-blue-300">0</span>
                    </div>
                    <div class="flex justify-between border-b border-os-border/50 pb-2">
                        <span>Piedraeternas (~5,000¥ c/u):</span>
                        <span id="cost-everstones-qty" class="font-bold text-amber-300">0</span>
                    </div>
                    <div class="flex justify-between border-b border-os-border/50 pb-2">
                        <span>Pokémon (Criadores 1x31):</span>
                        <span id="cost-breeders-qty" class="font-bold text-white">0</span>
                    </div>
                    <div class="flex justify-between border-b border-os-border/50 pb-2">
                        <span>Criadores con Naturaleza:</span>
                        <span id="cost-nature-qty" class="font-bold text-white">0</span>
                    </div>
                    
                    <div class="pt-2 text-right">
                        <div class="text-os-muted mb-1 text-[10px]">Costo Estimado Materiales (Sin Género)</div>
                        <div id="cost-total-pokeyen" class="text-lg font-bold text-emerald-400">$0</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Diagrama -->
        <div class="lg:col-span-3">
            <div class="panel p-5 border border-os-border rounded-md bg-[#1e1e1e] min-h-[600px] overflow-auto relative">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-sm font-bold text-os-text uppercase tracking-wider">Árbol de Crianza Óptimo</h2>
                    <button onclick="generateBreedingTree()" class="px-3 py-1 bg-os-border hover:bg-os-blue text-xs font-mono rounded transition">Refrescar Diagrama</button>
                </div>
                
                <!-- Mermaid Container -->
                <div id="mermaid-container" class="w-full flex justify-center mt-8">
                    <!-- Diagram will be injected here -->
                </div>
            </div>
        </div>

    </div>
</div>
`;

// Inyectar HTML antes del cierre del MAIN
document.querySelector('main').insertAdjacentHTML('beforeend', breedingViewHTML);

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
        tertiaryColor: '#334155'
    }
});

// Generar Árbol y Costos
async function generateBreedingTree() {
    const targetIvs = parseInt(document.getElementById('breeding-ivs').value);
    const useNature = document.getElementById('breeding-nature').checked;

    // Cálculo matemático estricto de PokeMMO
    let breeders1x31 = Math.pow(2, targetIvs - 1); // 2x31 = 2, 3x31 = 4, 4x31 = 8, 5x31 = 16, 6x31 = 32
    let bracers = (Math.pow(2, targetIvs) - 2); // 2x31 = 2, 3x31 = 6, 4x31 = 14, 5x31 = 30, 6x31 = 62
    
    let natureBreeders = 0;
    let everstones = 0;

    if (useNature) {
        // Reemplazamos un criador 1x31 normal por uno que tenga la Naturaleza deseada.
        breeders1x31 -= 1;
        natureBreeders = 1;
        // En cada "piso" del árbol, el lado que lleva la naturaleza usa Piedraeterna en vez de un Brazal normal
        everstones = targetIvs - 1; 
        bracers -= (targetIvs - 1);
    }

    const bracerCost = 10000;
    const everstoneCost = 5000; // Aprox GTL
    const totalMaterialCost = (bracers * bracerCost) + (everstones * everstoneCost);

    // Actualizar UI Costos
    document.getElementById('cost-bracers-qty').innerText = bracers;
    document.getElementById('cost-everstones-qty').innerText = everstones;
    document.getElementById('cost-breeders-qty').innerText = breeders1x31;
    document.getElementById('cost-nature-qty').innerText = natureBreeders;
    document.getElementById('cost-total-pokeyen').innerText = '$' + totalMaterialCost.toLocaleString();

    // Generar Sintaxis Mermaid (Simplificada para demostración visual de los cruces finales)
    let mermaidGraph = 'graph TD\n';
    
    if (targetIvs === 2) {
        if(useNature) {
            mermaidGraph += 'A["Naturaleza<br/>(Piedraeterna)"] --> C["2x31 + Nat"]\n';
            mermaidGraph += 'B["1x31 (Stat 1)<br/>(Brazal)"] --> C\n';
        } else {
            mermaidGraph += 'A["1x31 (Stat 1)<br/>(Brazal)"] --> C["2x31"]\n';
            mermaidGraph += 'B["1x31 (Stat 2)<br/>(Brazal)"] --> C\n';
        }
    } else if (targetIvs === 3) {
        if(useNature) {
            mermaidGraph += 'A["1x31 (Stat 1)<br/>+ Naturaleza"] --> |"Brazal + Piedra"| D["2x31 + Nat"]\n';
            mermaidGraph += 'B["1x31 (Stat 2)"] --> D\n';
            mermaidGraph += 'C["2x31 (Stat 2, 3)"] --> |"2 Brazales"| E["3x31"]\n';
            mermaidGraph += 'D --> |"Brazal + Piedra"| E\n';
        } else {
            mermaidGraph += 'A["2x31 (Stat 1, 2)"] --> |"2 Brazales"| C["3x31"]\n';
            mermaidGraph += 'B["2x31 (Stat 2, 3)"] --> |"2 Brazales"| C\n';
        }
    } else if (targetIvs >= 4) {
        // En niveles altos simplificamos el gráfico para no colapsar la vista, mostrando el cruce maestro
        const label = useNature ? `${targetIvs}x31 + Naturaleza` : `${targetIvs}x31`;
        mermaidGraph += `Master["Meta: ${label}"]\n`;
        mermaidGraph += `A["Padre: ${targetIvs-1}x31${useNature ? ' + Nat' : ''}"] --> |"${useNature ? 'Piedraeterna' : 'Brazal'}"| Master\n`;
        mermaidGraph += `B["Madre: ${targetIvs-1}x31"] --> |"Brazal"| Master\n`;
        mermaidGraph += `C["Abuelos: ${targetIvs-2}x31"] -.-> A\n`;
        mermaidGraph += `D["Abuelos: ${targetIvs-2}x31"] -.-> B\n`;
    }

    // Renderizar
    const container = document.getElementById('mermaid-container');
    try {
        const { svg } = await mermaid.render('breeding-mermaid-svg', mermaidGraph);
        container.innerHTML = svg;
    } catch (e) {
        console.error('Mermaid render error:', e);
        container.innerHTML = `<div class="text-red-400 p-4 bg-red-900/30 rounded border border-red-500">Error renderizando el diagrama. Asegúrate de tener conexión a internet para descargar Mermaid.</div>`;
    }
}

// Ejecutar una vez al cargar
setTimeout(generateBreedingTree, 500);
