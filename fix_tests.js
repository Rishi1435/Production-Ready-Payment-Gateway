const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./frontend/src').filter(f => f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/data-test-id/g, 'data-testid');
    content = content.replace(/data-testid="webhook-config"/g, 'data-testid="webhook-config-form"');
    fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed data-testid');
