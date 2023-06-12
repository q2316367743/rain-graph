import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import { useGlobalStore } from "@/store/GlobalStore";

export async function localExecute(localPath: string) {
    let index = 1;
    let count = 7;
    let timestamp = new Date().getTime() + '';
    // 查询全部索引文件
    useGlobalStore().startLoading("查询全部索引文件");

    let mindsRes = await utools.db.promises.get(LocalNameEnum.MIND);
    let minds = mindsRes ? mindsRes.value : [];
    count += minds.length;
    useGlobalStore().startLoading("简约思维导图数量：" + minds.length);

    let simpleMindMapsRes = await utools.db.promises.get(LocalNameEnum.SIMPLE_MIND_MAP);
    let simpleMindMaps = simpleMindMapsRes ? simpleMindMapsRes.value : [];
    count += simpleMindMaps.length;
    useGlobalStore().startLoading("完整思维导图数量：" + simpleMindMaps.length);

    let diagramsRes = await utools.db.promises.get(LocalNameEnum.DIAGRAM);
    let diagrams = diagramsRes ? diagramsRes.value : [];
    count += diagrams.length;
    useGlobalStore().startLoading("流程图数量：" + diagrams.length);

    let whiteBoardsRes = await utools.db.promises.get(LocalNameEnum.WHITE_BOARD);
    let whiteBoards = whiteBoardsRes ? whiteBoardsRes.value : [];
    count += whiteBoards.length;
    useGlobalStore().startLoading("白板数量：" + whiteBoards.length);

    // 保存索引文件
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (mindsRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            mindsRes._id,
            mindsRes.value
        );
    }
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (simpleMindMapsRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            simpleMindMapsRes._id,
            simpleMindMapsRes.value
        );
    }
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (diagramsRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            diagramsRes._id,
            diagramsRes.value
        );
    }
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (whiteBoardsRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            whiteBoardsRes._id,
            whiteBoardsRes.value
        );
    }

    // 开始保存
    for (let mind of minds) {
        useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
        index += 1;
        let mindRes = await utools.db.promises.get('/mind/' + mind.id);
        if (!mindRes) {
            continue;
        }
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            mindRes._id,
            mindRes.value
        )
    }
    for (let simpleMindMap of simpleMindMaps) {
        useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
        index += 1;
        let simpleMindMapRes = await utools.db.promises.get('/simple-mind-map/' + simpleMindMap.id);
        if (!simpleMindMapRes) {
            continue;
        }
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            simpleMindMapRes._id,
            simpleMindMapRes.value
        )
    }
    for (let diagram of diagrams) {
        useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
        index += 1;
        let diagramRes = await utools.db.promises.get('/diagram/' + diagram.id);
        if (!diagramRes) {
            continue;
        }
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            diagramRes._id,
            diagramRes.value
        )
    }
    for (let whiteBoard of whiteBoards) {
        useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
        index += 1;
        let whiteBoardRes = await utools.db.promises.get('/white-board/' + whiteBoard.id);
        if (!whiteBoardRes) {
            continue;
        }
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            whiteBoardRes._id,
            whiteBoardRes.value
        )
    }

    // 保存设置
    let settingBaseRes = await utools.db.promises.get(LocalNameEnum.SETTING_BASE);
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (settingBaseRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            settingBaseRes._id,
            settingBaseRes.value
        );
    }
    let settingSimpleMindMapRes = await utools.db.promises.get(LocalNameEnum.SETTING_SIMPLE_MIND_MAP);
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (settingSimpleMindMapRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            settingSimpleMindMapRes._id,
            settingSimpleMindMapRes.value
        );
    }
    let settingMindRes = await utools.db.promises.get(LocalNameEnum.SETTING_MIND);
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (settingMindRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            settingMindRes._id,
            settingMindRes.value
        );
    }
    let settingBackupRes = await utools.db.promises.get(LocalNameEnum.SETTING_BACKUP);
    useGlobalStore().startLoading(`正在处理【${index}/${count}】`);
    index += 1;
    if (settingBackupRes) {
        await window.api.backup.writeBackup(
            localPath,
            `${Constant.id}@${Constant.version}@${timestamp}`,
            settingBackupRes._id,
            settingBackupRes.value
        );
    }

}