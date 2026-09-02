const fs = require('fs');
let html = fs.readFileSync('js/breeding.js', 'utf8');

const targetUI = `
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
`;

html = html.replace('<h2 class="text-sm font-bold text-os-text mb-4 uppercase tracking-wider border-b border-os-border/50 pb-2">Selección de IVs a 31</h2>', 
targetUI + '\n                <h2 class="text-sm font-bold text-os-text mb-4 uppercase tracking-wider border-b border-os-border/50 pb-2">Selección de IVs a 31</h2>');

fs.writeFileSync('js/breeding.js', html);
