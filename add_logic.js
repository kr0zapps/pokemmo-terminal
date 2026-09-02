const fs = require('fs');
let js = fs.readFileSync('js/breeding.js', 'utf8');

const logic = `
// ==========================================
// LÓGICA DE POKEMON Y GÉNERO
// ==========================================
let currentGenderCost = 0;
let estimatedGenderSelections = 0;

async function fetchPokemonData() {
    const input = document.getElementById('breeding-target').value.trim().toLowerCase();
    if (!input) return;

    const infoDiv = document.getElementById('target-info');
    const eggGroupSpan = document.getElementById('target-egg-group');
    const genderCostSpan = document.getElementById('target-gender-cost');

    eggGroupSpan.innerText = 'Cargando...';
    infoDiv.classList.remove('hidden');

    try {
        const res = await fetch(\`https://pokeapi.co/api/v2/pokemon-species/\${input}\`);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        
        // Extraer grupos huevo
        const eggGroups = data.egg_groups.map(eg => eg.name).join(', ');
        
        // Extraer costo de género
        // gender_rate en PokeAPI es la probabilidad de ser hembra en octavos (0 a 8). -1 es sin género.
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
            costText = "100% un género (Usa el otro género del grupo huevo)";
        } else {
            cost = 5000;
            costText = "5,000¥";
        }

        currentGenderCost = cost;
        
        eggGroupSpan.innerText = eggGroups.toUpperCase();
        genderCostSpan.innerText = costText;

        // Actualizar el árbol para reflejar el nuevo costo total
        generateBreedingTree();
    } catch (e) {
        eggGroupSpan.innerText = 'Error / Nombre no válido';
        genderCostSpan.innerText = '-';
        currentGenderCost = 0;
    }
}

// Cargar datalist de Pokémon al iniciar
setTimeout(() => {
    try {
        let db = JSON.parse(localStorage.getItem('pokemmo_custom_db')) || [];
        if(db.length > 0) {
            const datalist = document.getElementById('pokedex-list-breeding');
            let uniqueNames = [...new Set(db.map(p => p.name))];
            datalist.innerHTML = uniqueNames.map(n => \`<option value="\${n}">\`).join('');
        }
    } catch(e) {}
}, 2000);
`;

js += logic;

// Now we need to modify generateBreedingTree to inject the gender cost into the UI.
const costReplaceTarget = `
    const totalCost = costBracers + (everstones * 5000);
    listContainer.innerHTML = htmlList;
    document.getElementById('cost-total-pokeyen').innerText = '$' + totalCost.toLocaleString();
`;

const costReplaceWith = `
    // Calcular costo de género estimado. 
    // En PokeMMO, normalmente pagas género en casi todos los cruces excepto en el final (si no te importa el género final).
    // Una estimación segura es pagar género por cada criador base menos 1, o más o menos la cantidad total de cruces menos 1.
    // Número total de nodos de cruce = cantidad de bracers / 2 (aprox) o simplemente (breeders - 1).
    let totalBaseBreeders = Object.values(breeders).reduce((a,b)=>a+b, 0);
    let totalBreedingSteps = totalBaseBreeders - 1;
    let genderSelections = Math.max(0, totalBreedingSteps - 1); 
    
    let totalGenderCost = currentGenderCost * genderSelections;
    
    if (currentGenderCost > 0) {
        htmlList += \`
            <div class="flex justify-between border-b border-amber-900/50 pb-2 mt-4">
                <span class="text-amber-400">\${genderSelections}x Selección de Género (\${(currentGenderCost/1000)}k)</span>
                <span class="text-amber-300">~\${(totalGenderCost/1000).toLocaleString()}k</span>
            </div>
        \`;
    }

    const totalCost = costBracers + (everstones * 5000) + totalGenderCost;
    listContainer.innerHTML = htmlList;
    document.getElementById('cost-total-pokeyen').innerText = '$' + totalCost.toLocaleString();
`;

js = js.replace(costReplaceTarget, costReplaceWith);
fs.writeFileSync('js/breeding.js', js);
