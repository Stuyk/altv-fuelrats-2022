const fs = require('fs-extra');
const path = require('path');

const endPath = path.join('../../', 'resources');

// Purpose
// Copy all mods into the resources folder after resources cleanup.
// Only consideres directories and not individual files.

const results = fs.readdirSync(__dirname);
for (let i = 0; i < results.length; i++) {
    const fileOrFolderName = results[i];
    const fullPath = path.join(__dirname, fileOrFolderName)
    const stats = fs.lstatSync(fullPath);

    if (!stats.isDirectory()) {
        continue;
    }

    fs.copySync(fullPath, path.join(endPath, fileOrFolderName), { recursive: true, overwrite: true });
}
