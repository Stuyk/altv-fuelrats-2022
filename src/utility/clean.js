const fs = require('fs-extra');
const path = require('path');

const endPath = path.join('../../', 'resources');

fs.rmSync(endPath, { force: true, recursive: true });