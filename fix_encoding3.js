const fs = require('fs');
const path = require('path');

const files = [
  'js/modules/pokedex.js',
  'js/modules/gyms.js',
  'js/modules/berries.js',
  'js/modules/breeding.js',
  'js/auth.js',
  'js/app.js',
  'js/router.js',
  'index.html'
];

const replacements = [
  ['PokǸmon', 'Pokémon'],
  ['PokǸdex', 'Pokédex'],
  ['Pok%MON', 'POKÉMON'],
  ['MǸtodo', 'Método'],
  ['Pǭgina', 'Página'],
  ['Pǭg.', 'Pág.'],
  ['Aǧn', 'Aún'],
  ['ningǧn', 'ningún'],
  ['bǧsqueda', 'búsqueda'],
  ['quǸ estǭ mal', 'qué está mal'],
  ['nǧmero', 'número'],
  ['regin', 'región'],
  ['Paginacin', 'Paginación'],
  ['Seuelo', 'Señuelo'],
  ['Da', 'Día'],
  ['Maana', 'Mañana'],
  ['correccin', 'corrección'],
  ['Sesin', 'Sesión'],
  ['Contrasea', 'Contraseña'],
  ['Mdulo', 'Módulo'],
  ['construccin', 'construcción'],
  ['Electrnico', 'Electrónico'],
  ['Copiados', '¡Copiados'],
  ['Sugerencia', '¡Sugerencia'],
  ['Borrar', '¿Borrar'],
  ['lderes', 'líderes'],
  ['compensacin', 'compensación']
];

files.forEach(f => {
  let p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    for (const [bad, good] of replacements) {
      // bad might contain unicode replacement character, so exact string replacement
      content = content.split(bad).join(good);
    }
    
    if (f === 'js/router.js') {
        content = content.replace(/label: 'Gimnasios', icon: '.*?'/, "label: 'Gimnasios', icon: '🏆'");
        content = content.replace(/label: 'Cultivos', icon: '.*?'/, "label: 'Cultivos', icon: '🌱'");
        content = content.replace(/label: 'PokǸdex', icon: '.*?'/, "label: 'Pokédex', icon: '📱'");
        content = content.replace(/label: 'Crianza', icon: '.*?'/, "label: 'Crianza', icon: '🥚'");
    }

    fs.writeFileSync(p, content, 'utf-8');
  }
});
