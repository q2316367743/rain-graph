export interface Contrast {

    /**
     * 功能
     */
    func: string;

    /**
     * 免费
     */
    free: string;

    /**
     * 付费
     */
    vip: string;

}

export const data = [{
    func: "简易思维导图",
    free: "✅",
    vip: "✅"
}, {
    func: "完整思维导图",
    free: "✅",
    vip: "✅"
}, {
    func: "流程图",
    free: "✅",
    vip: "✅"
}, {
    func: "白板",
    free: "✅",
    vip: "✅"
}, {
    func: "画板",
    free: "✅",
    vip: "✅"
}, {
    func: "可视化图表",
    free: "✅",
    vip: "✅"
}, {
    func: "二维码",
    free: "✅",
    vip: "✅"
}, {
    func: "图片裁剪",
    free: "✅",
    vip: "✅"
}, {
    func: "另存为、打开",
    free: "✅",
    vip: "❌"
}, {
    func: "模板管理",
    free: "✅",
    vip: "❌"
}, {
    func: "本地备份、WebDAV备份",
    free: "✅",
    vip: "❌"
}] as Contrast[];

export const columns = [{
    title: '功能',
    dataIndex: "func"
}, {
    title: '免费版',
    dataIndex: "free"
}, {
    title: '高级版',
    dataIndex: "vip"
}]