import {fabric} from "fabric";
import {IEvent, IObjectOptions, IRectOptions, ITextOptions, Object} from "fabric/fabric-impl";
import MessageUtil from "@/utils/MessageUtil";
import ArrowNode from "./node/ArrowNode";
import {FabricWbMode} from "./node/constants";
import {useGlobalStore} from "@/store/GlobalStore";

export default class FabricWbWrap {

    private readonly canvas: fabric.Canvas;
    private readonly options: IObjectOptions;
    private currentShape: Object | null;
    private mode: FabricWbMode = "selection";

    // 是否处于绘制状态
    private isDrawing = false;
    // 鼠标起点坐标x
    private startX = 0;
    // 鼠标起点多表y
    private startY = 0;

    constructor(element: HTMLCanvasElement | null, width: number, height: number) {
        // 初始化画布，默认可绘制
        this.canvas = new fabric.Canvas(element, {
            width,
            height
        });
        this.currentShape = null;
        this.options = {
            width: 100,
            height: 100
        };
        this.canvas.on('mouse:down', e => this.onMouseDown(e));
        this.canvas.on('mouse:move', e => this.onMouseMove(e));
        this.canvas.on('mouse:up', e => this.onMouseUp());
    }

    setWidth(width: number) {
        this.canvas.setWidth(width);
    }

    setHeight(height: number) {
        this.canvas.setHeight(height);
    }

    setMode(mode: FabricWbMode) {
        this.mode = mode;
        switch (mode) {
            case "free-draw":
                this.setFreeDraw();
                return;
            case "selection":
                this.setSelection();
                this.canvas.defaultCursor = 'auto';
                return;
            case "text":
                this.canvas.defaultCursor = 'text'
                return;
        }
    }

    private onMouseDown(e: IEvent<MouseEvent>) {
        if (this.currentShape) {
            if (typeof this.currentShape.text !== 'undefined') {
                // 文本
                if (this.currentShape.text.trim() === "") {
                    this.canvas.remove(this.currentShape);
                    this.currentShape = null;
                }
            }else {
                this.currentShape = null;
            }
        }
        // 如果当前有活动的元素则不进行后续绘制
        const activeObject = this.canvas.getActiveObject();
        if (!e.pointer || activeObject) return;
        // 切换成绘制状态
        this.isDrawing = true;
        // 记录当前坐标点
        const {x, y} = e.pointer;
        this.startX = x;
        this.startY = y;
        // 在当前坐标绘制一个矩形
        if (this.mode== "rectangle") {
            this.currentShape = this.drawRect({
                left: x,
                top: y,
                width: 0,
                height: 0,
            });
        }else if (this.mode === "text") {
            this.currentShape = this.drawText("", {
                left: x,
                top: y,
                height: 100
            })
        }
    }

    private onMouseMove(event: IEvent<MouseEvent>) {
        if (!this.isDrawing || !event.pointer || !this.currentShape) return;

        // 计算宽高
        const {x, y} = event.pointer;
        const width = x - this.startX;
        const height = y - this.startY;

        // 设置宽高
        this.currentShape.set({
            width,
            height,
        });

        // 更新画布
        this.canvas.renderAll();
    }

    private onMouseUp() {
        this.isDrawing = false;
    }


    /**
     * 设置为选择模式
     */
    setSelection() {
        this.canvas.isDrawingMode = false;
        this.canvas.selection = true;
        // 设置鼠标光标
        this.canvas.defaultCursor = 'auto';
    }

    /**
     * 自由画笔
     */
    private setFreeDraw() {
        this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
        this.canvas.freeDrawingBrush.color = '#ff0000'
        this.canvas.freeDrawingBrush.width = 5
        this.canvas.freeDrawingCursor = 'default'
        this.canvas.isDrawingMode = true;
    }

    /**
     * 文字模式
     * @param text 字符串
     * @param options 选项
     */
    public drawText(text: string, options?: ITextOptions): Object {
        let color =  '#000000';
        if (useGlobalStore().isDark) {
            color = "#ffffff"
        }
        const textObj = new fabric.IText(text, {
            editingBorderColor: '#ff0000',
            padding: 5,
            cursorColor: color,
            fill: color,
            ...options
        });
        this.canvas.add(textObj);
        this.currentShape = textObj;
        // 文本打开编辑模式
        textObj.enterEditing();
        // 文本编辑框获取焦点
        if (textObj.hiddenTextarea) {
            textObj.hiddenTextarea.focus();
        }
        this.canvas.setActiveObject(textObj);
        return textObj;
    }

    public setEraser(options?: any): void {
        MessageUtil.warning("橡皮擦功能咱不可用");
    }

    /**
     * 设置矩形
     * @param options 参数
     */
    public drawRect(options: IRectOptions): Object {
        const rect = new fabric.Rect({...this.options, ...options});
        this.canvas.add(rect);
        this.currentShape = rect;
        return rect;
    }

    public setArrow() {
        const arrow = new ArrowNode(this.options);
        this.canvas.add(arrow);
    }

    public clear() {
        this.canvas.clear();

    }

}
