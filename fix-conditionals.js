const fs = require('fs');
const path = './src/app/trips/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Fix all {someCondition && ( ... )} patterns
// Replace with {someCondition ? ( ... ) : null}
content = content.replace(/\{([^}]+) && \(/g, '{$1 ? (');
content = content.replace(/\)\}/g, ') : null}');

// Fix back incorrectly modified ones (like copied === item.id)
content = content.replace(/\? \(\s*<Check/g, '&& (<Check');
content = content.replace(/: null\}\s*\)\s*:\s*\(/g, ') : (');

fs.writeFileSync(path, content);
console.log('Fixed conditional rendering');
