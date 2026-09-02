const fs = require('fs');
let lines = fs.readFileSync('js/breeding.js', 'utf8').split('\n');
lines[260] = "    document.getElementById('cost-total-pokeyen').innerText = '$' + totalCost.toLocaleString();";
fs.writeFileSync('js/breeding.js', lines.join('\n'));
