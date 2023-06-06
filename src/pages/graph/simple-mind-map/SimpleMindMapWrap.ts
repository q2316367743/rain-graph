import { SimpleMindMapConfig } from "./domain/SimpleMindMapConfig";
import MindMap from "simple-mind-map";
import BrowserUtil from "@/utils/BrowserUtil";
import { getDefaultConfig, getDefaultData } from "./data/config";
import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useSimpleMindMapStore } from "@/store/graph/SimpleMindMapStore";

//  思维导图
export default class SimpleMindMapWrap {

    private readonly config;
    private readonly mindMap: any;
    private readonly el;

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
        this.el = el;
        this.config = Object.assign(getDefaultConfig(), config);
        if (!el) {
            return;
        }
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

    setSize(width: number, height: number) {
        let el = this.mindMap.opt.el as HTMLDivElement;
        let svg = el.querySelector(this.el + '>svg') as SVGElement;
        svg.setAttribute('width', width + 'px');
        svg.setAttribute('height', height + 'px');
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

    // ------ 原生操作 ------

    on(name: string, callback: (...args: any[]) => void) {
        if (!this.mindMap) {
            return;
        }
        this.mindMap.on(name, callback)
    }

    execCommand(command: string, ...args: any[]) {
        this.mindMap.execCommand(command, args)
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
        let id = await useSimpleMindMapStore().addMind(this.id);
        this.id = id;
        let res = await utools.db.promises.put({
            _id: `/${GraphTypeEnum.SIMPLE_MIND_MAP}/${id}`,
            _rev: this._rev,
            value: {
                config: this.config,
                record: this.mindMap.getData(false)
            }
        });
        if (res.error) {
            return Promise.reject(res.message || "新增失败");
        }
        this._rev = res.rev;
        return Promise.resolve();
    }

    saveAs(title: string) {
        BrowserUtil.download(JSON.stringify({
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

    // ------ 代理操作 ------

    viewReset() {
        this.mindMap.view.reset();
    }

    copyNode(): any {
        return this.mindMap.renderer.copyNode();
    }

    // ------ 节点附加操作 ------

    addLink(name: string, href: string) {
        this.activeNodeList.forEach(node => {
            node.setHyperlink(href, name);
        });
    }

}