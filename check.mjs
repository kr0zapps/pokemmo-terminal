import fs from 'fs';
import path from 'path';

const files = [
  './js/utils/dom.js',
  './js/utils/format.js',
  './js/utils/api.js',
  './js/db.js',
  './js/state.js',
  './js/auth.js',
  './js/sync.js',
  './js/router.js',
  './js/modules/gyms.js',
  './js/modules/berries.js',
  './js/modules/pokedex.js',
  './js/modules/breeding.js',
  './js/app.js'
];

async function check() {
  for (const file of files) {
    try {
      await import('file://' + path.resolve(file));
      console.log('OK: ' + file);
    } catch (e) {
      console.log('ERROR in ' + file + ':', e.message);
    }
  }
}
check();
