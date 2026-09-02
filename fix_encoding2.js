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
  [/Pok.mon/g, 'Pokémon'],
  [/Pok.dex/g, 'Pokédex'],
  [/PokMMO/g, 'PokéMMO'],
  [/M.todo/g, 'Método'],
  [/P.gina/g, 'Página'],
  [/P.g\./g, 'Pág.'],
  [/A.n/g, 'Aún'],
  [/ning.n/g, 'ningún'],
  [/b.squeda/g, 'búsqueda'],
  [/qu. est. mal/g, 'qué está mal'],
  [/n.mero/g, 'número'],
  [/regi.n/g, 'región'],
  [/Paginaci.n/g, 'Paginación'],
  [/Se.uelo/g, 'Señuelo'],
  [/D.a/g, 'Día'],
  [/Ma.ana/g, 'Mañana'],
  [/correcci.n/g, 'corrección'],
  [/Sesi.n/g, 'Sesión'],
  [/Contrase.a/g, 'Contraseña'],
  [/M.dulo/g, 'Módulo'],
  [/construcci.n/g, 'construcción'],
  [/Electr.nico/g, 'Electrónico'],
  [/Copiados/g, '¡Copiados'],
  [/Sugerencia/g, '¡Sugerencia'],
  [/Borrar/g, '¿Borrar'],
  [/l.deres/g, 'líderes'],
  [/compensaci.n/g, 'compensación'],
];

files.forEach(f => {
  let p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    for (const [bad, good] of replacements) {
      content = content.replace(bad, good);
    }
    
    if (f === 'js/router.js') {
        content = content.replace(/icon: '.*?'/g, (match) => {
            if (match.includes('Gimnasios')) return "icon: '🏆'";
            if (match.includes('Cultivos')) return "icon: '🌱'";
            if (match.includes('Pok')) return "icon: '📱'";
            if (match.includes('Crianza')) return "icon: '🥚'";
            return match;
        });
    }

    fs.writeFileSync(p, content, 'utf-8');
  }
});
