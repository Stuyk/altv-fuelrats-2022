const fs = require('fs-extra');
const path = require('path');

const endPath = path.join('../../', 'resources');

// Purpose
// Copy resource.cfg's to their respective folders after wipe.

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
