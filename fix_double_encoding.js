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

// UTF-8 double encoded characters
const replacements = {
  'Ã¡': 'á',
  'Ã©': 'é',
  'Ã­': 'í',
  'Ã³': 'ó',
  'Ãº': 'ú',
  'Ã±': 'ñ',
  'Ã‘': 'Ñ',
  'Ã ': 'Á',
  'Ã‰': 'É',
  'Ã': 'Í',
  'Ã“': 'Ó',
  'Ãš': 'Ú',
  'Â¿': '¿',
  'Â¡': '¡',
  // Some emojis
  'ðŸ†': '🏆',
  'ðŸŒ±': '🌱',
  'ðŸ“±': '📱',
  'ðŸ¥š': '🥚',
  'ðŸ”': '🔍',
  'â—€': '◀',
  'â–¶': '▶',
  'ðŸŒ…': '🌅',
  'â˜€ï¸': '☀️',
  'ðŸŒ™': '🌙',
  'ðŸŽ£': '🎣',
  'ðŸ’¾': '💾',
  'ðŸ“‹': '📋',
  'âœ–': '✖',
  // And the weird character from earlier
  '': ''
};

files.forEach(f => {
  let p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    for (const [bad, good] of Object.entries(replacements)) {
      content = content.split(bad).join(good);
    }
    
    // Some residual manual ones just in case
    content = content.split('PokMMO').join('PokéMMO');
    
    fs.writeFileSync(p, content, 'utf-8');
  }
});
