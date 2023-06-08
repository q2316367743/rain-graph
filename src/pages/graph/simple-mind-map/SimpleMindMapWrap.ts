import { SimpleMindMapConfig } from "./domain/SimpleMindMapConfig";
import MindMap from "simple-mind-map";
import BrowserUtil from "@/utils/BrowserUtil";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import { useSimpleMindMapStore } from "@/store/graph/SimpleMindMapStore";

import { getDefaultConfig, getDefaultData } from "./data/config";
import { extraImages } from "./data/icon";
import { MindMapNode } from "./domain/MindMapNode";

type commandType = 'INSERT_CHILD_NODE' | 'INSERT_NODE' | 'REMOVE_NODE' | 'BACK' | 'FORWARD' | 'ADD_GENERALIZATION';

//  思维导图
export default class SimpleMindMapWrap {

    private readonly config;
    private readonly mindMap: any;
    private readonly el;
    private data: MindMapNode;

    // 代理属性
    readonly view: any;
    readonly miniMap: any;
    readonly renderer: any;

    private id = '0';
    private _rev = undefined as string | undefined;

    private node = undefined as any;
    private activeNodeList = [] as any[];
    // 是否保存锁定
    private lock = false;
    // 是否有待办
    private todo = false;

    /**
     * 初始化
     * @param config 配置
     * @param data 数据
     */
    constructor(el: string, config: Partial<SimpleMindMapConfig>, data?: MindMapNode) {
        this.el = el;
        this.data = Object.assign(getDefaultData(), data);
        this.config = Object.assign(getDefaultConfig(), config);
        if (!el) {
            return;
        }
        this.mindMap = new MindMap({
            el: document.querySelector(el),
            data: this.data,
            ...this.config,
            iconList: extraImages
        });
        this.view = this.mindMap.view;
        this.miniMap = this.mindMap.miniMap;
        this.renderer = this.mindMap.renderer;

        this.on('data_change', (data: MindMapNode) => {
            this.data = data;
            // 自动保存
            this.save();
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

    // ------ 内容 ------

    getConfig(): SimpleMindMapConfig {
        return this.config;
    }

    setConfig(config: SimpleMindMapConfig) {
        this.mindMap.updateConfig(config);
        this.save();
    }

    // ------ 事件 ------

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

    off(name: string, callback: (...args: any[]) => void) {
        if (!this.mindMap) {
            return;
        }
        this.mindMap.off(name, callback)
    }

    execCommand(command: commandType, ...args: any[]) {
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

    async save() {
        if (this.lock) {
            this.todo = true;
            return;
        }
        this.lock = true;
        let id = await useSimpleMindMapStore().addMind(this.id);
        this.id = id;
        let res = await utools.db.promises.put({
            _id: `/${GraphTypeEnum.SIMPLE_MIND_MAP}/${id}`,
            _rev: this._rev,
            value: {
                config: this.config,
                record: this.data
            }
        });
        if (res.error) {
            return Promise.reject(res.message || "新增失败");
        }
        this._rev = res.rev;
        this.lock = false;
        if (this.todo) {
            this.todo = false;
            await this.save();
        }
        return Promise.resolve();
    }

    saveAs(title: string) {
        BrowserUtil.download(JSON.stringify({
            config: this.config,
            record: this.mindMap.getData(false)
        }), title + '.json', 'text/json');
    }

    export(type: string, download: boolean, fileName: string, withConfig?: string | boolean) {
        this.mindMap.export(type, download, fileName, withConfig);
    }

    // ------ 节点操作 ------

    setNode(node: any) {
        this.mindMap.renderer.moveNodeToCenter(node);
    }

    getRenderTree(): any {
        return this.mindMap.renderer.renderTree;
    }

    // ------ 代理操作 ------

    viewReset() {
        this.mindMap.view.reset();
    }

    copyNode(): any {
        return this.mindMap.renderer.copyNode();
    }

    createAssociativeLine() {
        this.mindMap.associativeLine.createLineFromActiveNode();
    }

}