import {fabric} from "fabric";
import {IObjectOptions, Object} from "fabric/fabric-impl";
import {FabricWbMode} from "./constants";
import {useGlobalStore} from "@/store/GlobalStore";
import FabricWbEvent from "@/pages/graph/fabric-wb/core/FabricWbEvent";
import FabricWbNode from "@/pages/graph/fabric-wb/core/FabricWbNode";

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


    constructor(element: HTMLCanvasElement | null, width: number, height: number, options: IObjectOptions = {}) {
        this.width = width;
        this.height = height;
        // 初始化画布，默认可绘制
        this.canvas = new fabric.Canvas(element, {
            width,
            height
        });
        this.currentShape = null;
        this.options = options;
        this.canvas.selectionBorderColor = "#6965db";

        // 事件
        this.node = new FabricWbNode(this.canvas, this);
        this.event = new FabricWbEvent(this.canvas, this, this.node);
        // 监听鼠标滚轮事件
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
        if (mode !== 'free-draw') {
            this.canvas.isDrawingMode = false;
        }
        switch (mode) {
            case "free-draw":
                this.setFreeDraw();
                return;
            case "selection":
                this.setSelection();
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

}
