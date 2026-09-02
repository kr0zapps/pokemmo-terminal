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

const regexReplacements = [
  [/Pok.mon/g, 'Pokémon'],
  [/Pok.dex/g, 'Pokédex'],
  [/Pok.MMO/g, 'PokéMMO'],
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
  [/l.deres/g, 'líderes'],
  [/compensaci.n/g, 'compensación'],
  [/\?\? Copiados/g, '¡Copiados'],
  [/\?Sugerencia/g, '¡Sugerencia'],
  [/\?Borrar/g, '¿Borrar'],
  [/import.*importedD.ata/g, 'importedData'],
  [/importedD.ata/g, 'importedData'],
  [/parsePokemonD.ata/g, 'parsePokemonData'],
  [/new D.ate\(\)/g, 'new Date()'],
  [/fetchPokemonD.ata/g, 'fetchPokemonData']
];

files.forEach(f => {
  let p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    
    // Specifically protect function names
    content = content.replace(/catchPok.mon/g, 'catchPokemon');
    
    for (const [bad, good] of regexReplacements) {
      content = content.replace(bad, good);
    }
    
    // Fix emojis corrupted into ? or Y" etc
    content = content.replace(/<option value="rate_desc" selected>.*?Mayor/g, '<option value="rate_desc" selected>📈 Mayor');
    content = content.replace(/<option value="id_asc">.*?N/g, '<option value="id_asc">🔢 N');
    content = content.replace(/<option value="name_asc">.*?Nombre/g, '<option value="name_asc">🔤 Nombre');
    content = content.replace(/<option value="all" selected>.*?Horario/g, '<option value="all" selected>🕒 Horario');
    
    content = content.replace(/>.*?Mañana</g, '>🌅 Mañana<');
    content = content.replace(/>.*?Día</g, '>☀️ Día<');
    content = content.replace(/>.*?Noche</g, '>🌙 Noche<');
    content = content.replace(/>.*?Con Señuelo/g, '>🎣 Con Señuelo');
    content = content.replace(/>.*?Lure</g, '>🎣 Lure<');
    
    content = content.replace(/placeholder=".*?Filtrar/g, 'placeholder="🔍 Filtrar');
    content = content.replace(/>.*?Exportar/g, '>💾 Exportar');
    content = content.replace(/>.*?Copiar Lista/g, '>📋 Copiar Lista');
    content = content.replace(/>.*?Liberar</g, '>✖ Liberar<');
    
    content = content.replace(/>.*?Anterior</g, '>◀ Anterior<');
    content = content.replace(/>Siguiente.*?<\//g, '>Siguiente ▶</');
    content = content.replace(/>.*?Cerrar Sesión</g, '>Cerrar Sesión<');

    if (f === 'js/router.js') {
        content = content.replace(/label: 'Gimnasios', icon: '.*?'/, "label: 'Gimnasios', icon: '🏆'");
        content = content.replace(/label: 'Cultivos', icon: '.*?'/, "label: 'Cultivos', icon: '🌱'");
        content = content.replace(/label: 'Pokédex', icon: '.*?'/, "label: 'Pokédex', icon: '📱'");
        content = content.replace(/label: 'Crianza', icon: '.*?'/, "label: 'Crianza', icon: '🥚'");
    }

    fs.writeFileSync(p, content, 'utf-8');
  }
});
