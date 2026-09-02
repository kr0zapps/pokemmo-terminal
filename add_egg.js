const fs = require('fs');
let js = fs.readFileSync('js/breeding.js', 'utf8');

js = js.replace('let currentGenderCost = 0;', 'let currentGenderCost = 0;\nlet currentEggGroup = "";');
js = js.replace('currentGenderCost = cost;', 'currentGenderCost = cost;\n        currentEggGroup = eggGroups.toUpperCase();');
js = js.replace('currentGenderCost = 0;\n    }', 'currentGenderCost = 0;\n        currentEggGroup = "";\n    }');

const targetLine = "let name = stat === 'Nature' ? 'Pokémon con Naturaleza' : `Pokémon 1x31 en ${stat}`;";
const replaceLine = "let eggSuffix = currentEggGroup ? ` (${currentEggGroup})` : '';\n        let name = stat === 'Nature' ? `Pokémon con Naturaleza${eggSuffix}` : `Pokémon 1x31 en ${stat}${eggSuffix}`;";

js = js.replace(targetLine, replaceLine);
fs.writeFileSync('js/breeding.js', js);
