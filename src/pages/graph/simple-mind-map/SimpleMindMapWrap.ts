import {SimpleMindMapConfig} from "./domain/SimpleMindMapConfig";
import MindMap from "simple-mind-map";
// 工具类
import {download} from "@/utils/BrowserUtil";
import {saveTemplate} from "@/utils/utools/DbUtil";
import MessageUtil from "@/utils/MessageUtil";
// 枚举
import {MindMapSubType} from "@/enumeration/GraphSubTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

import {getDefaultConfig, getDefaultData} from "./data/config";
import {extraImages} from "./data/icon";
import {MindMapNode} from "./domain/MindMapNode";
import {useMindMapStore} from "@/store/graph/MindMapStore";

type commandType = 'INSERT_CHILD_NODE' | 'INSERT_NODE' | 'REMOVE_NODE' | 'BACK' | 'FORWARD' | 'ADD_GENERALIZATION';

//  思维导图
export default class SimpleMindMapWrap {

    private readonly mindMap: any;
    private readonly el;
    private data: MindMapNode;

    // 代理属性
    readonly view: any;
    readonly miniMap: any;
    readonly renderer: any;

    private id = '0';
    private _rev = undefined as string | undefined;

    private config;
    private node = undefined as any;
    private activeNodeList = [] as any[];
    // 是否保存锁定
    private lock = false;
    // 是否有待办
    private todo = false;
    // 初始化是否完成
    private initComplete = false;

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
            if (this.initComplete &&
                this.id !== '0' &&
                this.id !== '-1') {
                this.save();
            }
        });

    }

    init(id: string, _rev?: string) {
        this.id = id;
        this._rev = _rev;
    }

    complete() {
        setTimeout(() => this.initComplete = true, 100);
    }

    setSize(width: number, height: number, resize: boolean = true) {
        let el = this.mindMap.opt.el as HTMLDivElement;
        let svg = el.querySelector(this.el + '>svg') as SVGElement;
        svg.setAttribute('width', width + 'px');
        svg.setAttribute('height', height + 'px');
        if (resize) {
            this.mindMap.resize();
        }
    }

    // ------ 内容 ------

    getConfig(): SimpleMindMapConfig {
        return this.config;
    }

    setConfig(config: SimpleMindMapConfig) {
        this.config = config;
        this.mindMap.updateConfig(config);
        if (this.id !== '0' && this.id !== '-1') {
            this.save();
        }
    }

    setData(data: any) {
        this.data = data;
        this.mindMap.setData(this.data);
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

    getThemeConfig(key: string): any {
        return this.mindMap.getThemeConfig(key);
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
        let id = await useMindMapStore().add(this.id, MindMapSubType.SIMPLE_MIND_MAP);
        this.id = id;
        let res = await utools.db.promises.put({
            _id: `/${GraphTypeEnum.MIND_MAP}/${id}`,
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
        download(JSON.stringify({
            config: this.config,
            record: this.mindMap.getData(false)
        }), title + '.json', 'text/json');
    }

    saveToTemplate() {
        saveTemplate(GraphTypeEnum.MIND_MAP, {
            config: this.config,
            record: this.mindMap.getData(false)
        }, MindMapSubType.SIMPLE_MIND_MAP)
            .then(() => MessageUtil.success("保存模板成功"))
            .catch(e => {
                if (e === 'cancel') {
                    return;
                }
                MessageUtil.error("保存模板失败", e);
            })
    }

    export(type: string, download: boolean, fileName: string, withConfig?: string | boolean) {
        if (type === 'json') {
            this.saveAs(fileName);
            return;
        }
        this.mindMap.export(type, download, fileName, withConfig);
    }

    readonly(readonly: boolean) {
        this.mindMap.updateConfig({
            readonly
        })
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
