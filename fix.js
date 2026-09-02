const fs = require('fs');
let code = fs.readFileSync('js/breeding.js', 'utf8');
code = code.replace(/\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('js/breeding.js', code);
