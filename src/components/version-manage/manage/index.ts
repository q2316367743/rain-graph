import updateTo1_2_0 from './120';


const versionMap = new Map<string, () => Promise<void>>();

// 注册版本
versionMap.set("1.2.0", updateTo1_2_0);

export default versionMap;
