const { execSync } = require('child_process');
const fs = require('fs');

try {
  execSync('npx ng build --configuration production --base-href /', { stdio: 'pipe' });
  const a = fs.statSync('dist/portfolio-malbahor/browser/assets/docs/manuel_alba_cv_en.pdf');
  const b = fs.statSync('dist/portfolio-malbahor/browser/assets/docs/manuel_alba_cv_es.pdf');
  fs.writeFileSync('validate.out', 'BUILD OK\nmanuel_alba_cv_en.pdf: ' + a.size + ' bytes\nmanuel_alba_cv_es.pdf: ' + b.size + ' bytes');
} catch (e) {
  fs.writeFileSync('validate.out', 'BUILD FAIL\n' + String(e.stderr || e).split('\n').filter(l => /error/i.test(l)).slice(0, 15).join('\n'));
}