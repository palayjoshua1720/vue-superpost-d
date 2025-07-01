const fs = require('fs');
const path = require('path');

const manifestPath = path.resolve(__dirname, '../public/manifest.json');
let manifestContent = fs.readFileSync(manifestPath, 'utf8');

manifestContent = manifestContent
  .replace(/<%= VUE_APP_TITLE %>/g, process.env.VUE_APP_TITLE || 'Vue Template')
  .replace(/<%= VUE_APP_DESCRIPTION %>/g, process.env.VUE_APP_DESCRIPTION || 'A Vue.js template with modern features')
  .replace(/<%= VUE_APP_THEME_COLOR %>/g, process.env.VUE_APP_THEME_COLOR || '#4338CA');

fs.writeFileSync(manifestPath, manifestContent);
