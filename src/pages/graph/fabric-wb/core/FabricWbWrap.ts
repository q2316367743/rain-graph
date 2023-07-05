import {fabric} from "fabric";
import {IObjectOptions, Object} from "fabric/fabric-impl";
import {FabricWbMode} from "./constants";
import {useGlobalStore} from "@/store/GlobalStore";
import FabricWbEvent from "@/pages/graph/fabric-wb/core/FabricWbEvent";
import FabricWbNode from "@/pages/graph/fabric-wb/core/FabricWbNode";
import {initAligningGuidelines} from "@/pages/graph/fabric-wb/core/event/initAligningGuidelines";
import initControls from "@/pages/graph/fabric-wb/core/event/initControls";
import {useWhiteBoardStore} from "@/store/graph/WhiteBoardStore";
import {WhiteBoardSubType} from "@/enumeration/GraphSubTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import MessageUtil from "@/utils/MessageUtil";
import {StoreRecordCore} from "@/utils/utools/DbUtil";
import {download} from "@/utils/BrowserUtil";

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = '#b4b2ed';
fabric.Object.prototype.cornerStyle = 'circle';


export default class FabricWbWrap {

    private readonly canvas: fabric.Canvas;
    private readonly event: FabricWbEvent;
    private readonly node: FabricWbNode;
    private options: IObjectOptions;
    private currentShape: Object | null;
    private mode: FabricWbMode = "selection";

    // 基础属性
    private width: number = 0;
    private height: number = 0;

    // 序列化
    private id: string = '0';
    private _rev: undefined | string;
    private lock: boolean = false;
    private title: string = "未命名白板";


    constructor(element: HTMLCanvasElement | null, width: number, height: number, options: IObjectOptions = {}) {
        this.width = width;
        this.height = height;
        // 初始化画布，默认可绘制
        this.canvas = new fabric.Canvas(element, {
            width,
            height,
            fireRightClick: true, // 启用右键
            stopContextMenu: true, // 禁止默认右键菜单
        });
        this.currentShape = null;
        this.options = options;
        this.canvas.selectionBorderColor = "#6965db";

        // 节点
        this.node = new FabricWbNode(this.canvas, this);
        // 事件
        this.event = new FabricWbEvent(this.canvas, this, this.node);
        // 处理辅助线
        initAligningGuidelines(this.canvas);
        // 控制器
        initControls(this.canvas);
    }

    setWidth(width: number) {
        this.canvas.setWidth(width);
    }

    setHeight(height: number) {
        this.canvas.setHeight(height);
    }

    setOptions(options: IObjectOptions) {
        this.options = options;
    }

    getOptions(): IObjectOptions {
        return this.options;
    }

    getNode(): FabricWbNode {
        return this.node;
    }

    setMode(mode: FabricWbMode) {
        this.mode = mode;
        if (mode !== 'text') {
            this.canvas.defaultCursor = 'auto';
        } else {
            this.canvas.defaultCursor = 'text';
        }
        // 默认关闭绘画模式
        this.canvas.isDrawingMode = false;
        switch (mode) {
            case "free-draw":
                this.setFreeDraw();
                return;
            case "selection":
                this.setSelection();
                return;
            case "spray-brush":
                this.setSprayBrush();
                return;
        }
    }

    getMode(): FabricWbMode {
        return this.mode;
    }

    getCurrentShape(): Object | null {
        return this.currentShape;
    }

    setCurrentShape(currentShape: Object | null) {
        this.currentShape = currentShape;
    }

    getEvent(): FabricWbEvent {
        return this.event;
    }

    getCanvas(): fabric.Canvas {
        return this.canvas;
    }

    public clear() {
        this.canvas.clear();
    }


    // ======================================================================================
    // --------------------------------------- 模式选择 ---------------------------------------
    // ======================================================================================


    /**
     * 设置为选择模式
     */
    private setSelection() {
        this.canvas.isDrawingMode = false;
        this.canvas.selection = true;
        // 设置鼠标光标
        this.canvas.defaultCursor = 'auto';
    }

    /**
     * 自由画笔
     */
    private setFreeDraw() {
        let color = '#000000';
        if (useGlobalStore().isDark) {
            color = "#ffffff"
        }
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.color = color
        this.canvas.freeDrawingBrush.width = 5
        this.canvas.freeDrawingCursor = 'default'
        this.canvas.isDrawingMode = true;
        // 画笔投影
        // this.canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        //     blur: 10,
        //     offsetX: 10,
        //     offsetY: 10,
        //     affectStroke: true,
        //     color: '#30e3ca',
        // })
    }

    private setSprayBrush() {
        let color = '#000000';
        if (useGlobalStore().isDark) {
            color = "#ffffff"
        }
        this.canvas.isDrawingMode = true;
        // @ts-ignore
        let sprayBrush = new fabric.SprayBrush(this.canvas);
        sprayBrush.color = color;
        sprayBrush.width = 5
        this.canvas.freeDrawingBrush = sprayBrush;
    }

    // =================================================================================
    // ------------------------------------- 序列化 -------------------------------------
    // =================================================================================

    async save(focus: boolean = false) {
        if (this.lock) {
            return;
        }
        if (this.id === '0' && !focus) {
            return;
        }
        this.id = await useWhiteBoardStore().add(this.id, WhiteBoardSubType.FABRIC);
        const res = await utools.db.promises.put({
            _id: '/' + GraphTypeEnum.WHITE_BOARD + '/' + this.id,
            _rev: this._rev,
            value: {
                record: this.canvas.toJSON(),
                config: this.options
            }
        })
        if (res.error) {
            MessageUtil.error(res.message || "保存失败");
        }
        this._rev = res.rev;
        return Promise.resolve();
    }

    open(record: StoreRecordCore, callback: Function) {
        if (!record.record) {
            return;
        }
        // 覆盖操作
        this.options = record.config;
        // 加载json
        this.canvas.loadFromJSON(record.record, callback);
    }

    saveAs() {
        download(JSON.stringify({
            record: this.canvas.toJSON(),
            config: this.options
        }), this.title + '.json', "application/json");
    }

}
