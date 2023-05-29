import { useMindStore } from "@/store/MindStore";
import { SimpleMindMapConfig } from "./domain/SimpleMindMapConfig";
import MindMap from "simple-mind-map";
import MindEngineEnum from "@/enumeration/MindEngineEnum";
import BrowserUtil from "@/utils/BrowserUtil";
import { getDefaultConfig, getDefaultData } from "./data/config";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";

//  思维导图
export default class SimpleMindMapWrap {

    private readonly config;
    private readonly mindMap: any;

    private id = '0';
    private _rev = undefined as string | undefined;

    private node = undefined as any;
    private activeNodeList = [] as any[];

    /**
     * 初始化
     * @param config 配置
     * @param data 数据
     */
    constructor(el: string, config: Partial<SimpleMindMapConfig>, data?: any) {
        this.config = Object.assign(getDefaultConfig(), config);
        this.mindMap = new MindMap({
            el: document.querySelector(el),
            data: data ? data : getDefaultData(),
            ...this.config
        });
    }

    init(id: string, _rev?: string) {
        this.id = id;
        this._rev = _rev;
    }

    // ------ 事件 ------

    /**
     * 数据变更
     * @param event 事件名
     * @param callback 回调函数
     */
    onDataChange(callback: (data: any) => void) {
        this.mindMap.on('data_change', callback);
    }

    onBackForward(callback: (index: number, len: number) => void) {
        this.mindMap.on('back_forward', callback);
    }

    onNodeActive(callback: (has: boolean) => void) {
        this.mindMap.on('node_active', (node: any, activeNodeList: any[]) => {
            this.node = node;
            this.activeNodeList = activeNodeList;
            callback(activeNodeList.length > 0);
        });
    }

    // ------ 操作 ------

    setTheme(theme: string) {
        this.mindMap.setTheme(theme);
        this.config.theme = theme;
    }

    setLayout(layout: string) {
        this.mindMap.setLayout(layout);
        this.config.layout = layout;
    }

    back() {
        this.mindMap.execCommand('BACK')
    }

    forward() {
        this.mindMap.execCommand('FORWARD')
    }

    async save() {
        let id = await useMindStore().addMind(this.id);
        this.id = id;
        let res = await utools.db.promises.put({
            _id: '/mind/' + id,
            _rev: this._rev,
            value: {
                engine: MindEngineEnum.SIMPLE_MIND_MAP,
                config: this.config,
                record: this.mindMap.getData(false)
            }
        });
        if (res.error) {
            return Promise.reject(res.message || "新增失败");
        }
        return Promise.resolve();
    }

    saveAs(title: string) {
        BrowserUtil.download(JSON.stringify({
            engine: MindEngineEnum.SIMPLE_MIND_MAP,
            config: this.config,
            record: this.mindMap.getData(false)
        }), title + '.json', 'text/json');
    }

    export(type: ExportTypeEnum, download: boolean, fileName: string, withConfig: boolean) {
        this.mindMap.export(type, download, fileName, withConfig);
    }

    // ------ 节点操作 ------

    setNode(node: any) {
        this.mindMap.renderer.moveNodeToCenter(node);
    }

    addChildNode() {
        this.mindMap.execCommand('INSERT_CHILD_NODE')
    }

    addBothNode() {
        this.mindMap.execCommand('INSERT_NODE')
    }

    removeNode() {
        this.mindMap.execCommand('REMOVE_NODE')
    }

    // ------ 节点附加操作 ------

    setLink(name: string, href: string) {
        this.activeNodeList.forEach(node => {
            node.setHyperlink(href, name);
        });
    }

}