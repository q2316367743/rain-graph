const {existsSync} = require('fs');
const {readFile} = require('fs/promises');

const BackupApi = require('./lib/BackupApi');

window.preload = {};

/**
 * 打开文件
 * @param {string} path 文件路径
 * @returns {Promise<Buffer>} 文件内容
 */
function openFile(path) {
    if (!existsSync(path)) {
        return Promise.reject("文件不存在");
    }
    return readFile(path);
}

async function openFileToString(path) {
    const b = await openFile(path);
    return b.toString('utf-8');
}

window.preload['openFile'] = openFile;
window.preload['openFileToString'] = openFileToString;

window.api = {};
window.api['backup'] = BackupApi;