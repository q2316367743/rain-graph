const { readdir, writeFile, rmdir } = require('fs/promises');
const { join, sep, basename } = require('path');
const { existsSync, mkdirSync, lstatSync, readdirSync, unlinkSync } = require('fs');


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

/**
 * 删除备份
 * @param {string} path 备份目录
 * @param {string} name 备份名称
 * @returns {Promise<void>} 返回结果
 */
async function removeBackup(path, name) {
    let realPath = join(path, name);
    await deleteFolderRecursive(realPath);
}

async function deleteFolderRecursive(folderPath) {
    //判断文件夹是否存在
    if (existsSync(folderPath)) {
        //读取文件夹下的文件目录，以数组形式输出
        readdirSync(folderPath).forEach((file) => {
            //拼接路径
            const curPath = join(folderPath, file);
            //判断是不是文件夹，如果是，继续递归
            if (lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                //删除文件或文件夹
                unlinkSync(curPath);
            }
        });
        //仅可用于删除空目录
        await rmdir(folderPath);
    }
}

module.exports = { listBackup, writeBackup, removeBackup }