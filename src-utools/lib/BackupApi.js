const { readdir, writeFile } = require('fs/promises');
const { join, sep, basename } = require('path');
const { existsSync, mkdirSync } = require('fs');


/**
 * 列出备份列表
 * 
 * @param {string} path 路径
 * @returns {Promise<string[]>} 全部目录
 */
function listBackup(path) {
    return readdir(path, {
        encoding: 'utf-8'
    })
}

/**
 * 写入文件
 * 
 * @param {string} path 基础路径
 * @param {string} name 备份文件名
 * @param {string} file 文件名
 * @param {string} content 文件内容
 * @returns {Promise<void>} 结果
 */
function writeBackup(path, name, file, content) {
    file = file.replace('/', sep);
    // 基础目录
    let basePath = join(path, name);
    if (!existsSync(basePath)) {
        mkdirSync(basePath);
    }
    // 真实路径
    let realPath = join(path, name, file + '.json');
    let baseName = basename(realPath);
    let index = realPath.lastIndexOf(baseName);
    let subPath = realPath.substring(0, index - 1);
    if (!existsSync(subPath)) {
        mkdirSync(subPath);
    }
    return writeFile(
        realPath,
        JSON.stringify(content),
        {
            encoding: 'utf-8',
            flag: 'w',
        });
}

module.exports = { listBackup, writeBackup }