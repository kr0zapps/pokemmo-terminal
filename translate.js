const fs = require('fs');
let db = JSON.parse(fs.readFileSync('pokemmo_db.json', 'utf8'));

const replacements = [
  ['Rock Tunnel', 'Túnel Roca'],
  ['Cerulean Cave', 'Cueva Celeste'],
  ['Seafoam Islands', 'Islas Espuma'],
  ['Pattern Bush', 'Bosque Diseño'],
  ['Berry Forest', 'Bosque Baya'],
  ['Pinwheel Forest', 'Bosque Azulejo'],
  ['Bond Bridge', 'Puente Villa'],
  ['Pokémon Mansion', 'Mansión Pokémon'],
  ['Cape Brink', 'Cabo Extremo'],
  ['Kindle Road', 'Camino Candente'],
  ['Canyon Entrance', 'Entrada al Cañón'],
  ['Power Plant', 'Central Energía'],
  ['Victory Road', 'Calle Victoria'],
  ['Mt. Moon', 'Monte Moon'],
  ["Diglett's Cave", 'Cueva Diglett'],
  ['Safari Zone', 'Zona Safari'],
  ['Viridian Forest', 'Bosque Verde'],
  ['Sevault Canyon', 'Cañón Siete'],
  ['Route ', 'Ruta '],
  ['Forest', 'Bosque'],
  ['Route', 'Ruta'],
  ['Cave', 'Cueva'],
  ['Mountain', 'Montaña'],
  ['Lake', 'Lago'],
  ['River', 'Río'],
  ['Town', 'Pueblo'],
  ['City', 'Ciudad'],
  ['Islands', 'Islas'],
  ['Island', 'Isla'],
  ['Path', 'Camino'],
  ['Tower', 'Torre'],
  ['Ruins', 'Ruinas'],
  ['Valley', 'Valle'],
  ['Park', 'Parque'],
  ['Sea', 'Mar'],
  ['Mansion', 'Mansión'],
  ['Tunnel', 'Túnel'],
  ['Bridge', 'Puente'],
  ['Woods', 'Bosque'],
  ['Desert', 'Desierto'],
  ['Beach', 'Playa'],
  ['Canyon', 'Cañón'],
  ['Resort', 'Complejo'],
  ['(B1F)', '(Sótano 1)'],
  ['(B2F)', '(Sótano 2)'],
  ['(B3F)', '(Sótano 3)'],
  ['(B4F)', '(Sótano 4)'],
  ['(B5F)', '(Sótano 5)'],
  ['(1F)', '(Piso 1)'],
  ['(2F)', '(Piso 2)'],
  ['(3F)', '(Piso 3)'],
  ['(4F)', '(Piso 4)'],
  ['(5F)', '(Piso 5)'],
  ['(6F)', '(Piso 6)'],
  ['(7F)', '(Piso 7)'],
  ['(Inner)', '(Interior)'],
  ['(Outer)', '(Exterior)']
];

db.forEach(p => {
    let loc = p.location;
    for (const [eng, esp] of replacements) {
        loc = loc.split(eng).join(esp);
    }
    p.location = loc;
});

fs.writeFileSync('pokemmo_db.json', JSON.stringify(db, null, 2));
