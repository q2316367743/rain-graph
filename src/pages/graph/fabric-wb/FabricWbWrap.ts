import {fabric} from "fabric";
import {
    ICircleOptions, IEllipseOptions,
    IEvent, ILineOptions,
    IObjectOptions, IPoint, IPolylineOptions,
    IRectOptions,
    ITextOptions,
    ITriangleOptions,
    Object
} from "fabric/fabric-impl";
import {FabricWbMode} from "./node/constants";
import {useGlobalStore} from "@/store/GlobalStore";
import Arrow from "./node/ArrowNode";

export default class FabricWbWrap {

    private readonly canvas: fabric.Canvas;
    private options: IObjectOptions;
    private currentShape: Object | null;
    private mode: FabricWbMode = "selection";

    // 是否处于绘制状态
    private isDrawing = false;
    // 鼠标起点坐标x
    private startX = 0;
    // 鼠标起点多表y
    private startY = 0;

    constructor(element: HTMLCanvasElement | null, width: number, height: number, options: IObjectOptions = {}) {
        // 初始化画布，默认可绘制
        this.canvas = new fabric.Canvas(element, {
            width,
            height
        });
        this.currentShape = null;
        this.options = {
            width: 100,
            height: 100,
            fill: "transparent",
            stroke: "#000000",
            ...options
        };
        this.canvas.on('mouse:down', e => this.onMouseDown(e));
        this.canvas.on('mouse:move', e => this.onMouseMove(e));
        this.canvas.on('mouse:up', () => this.onMouseUp());
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

    public clear() {
        this.canvas.clear();
    }

    private onMouseDown(e: IEvent<MouseEvent>) {
        // 如果当前有活动的元素则不进行后续绘制
        const activeObject = this.canvas.getActiveObject();
        if (!e.pointer || activeObject) return;
        // 切换成绘制状态
        this.isDrawing = true;
        // 记录当前坐标点
        const {x, y} = e.pointer;
        this.startX = x;
        this.startY = y;
        if (this.mode == "rectangle") {
            this.drawRect({
                left: x,
                top: y,
                width: 0,
                height: 0,
            });
        } else if (this.mode === "text") {
            this.drawText("", {
                left: x,
                top: y,
                height: 100
            })
        } else if (this.mode === 'circle') {
            this.drawEllipse({
                left: x,
                top: y,
                width: 0,
                height: 0,
            });
        } else if (this.mode === "triangle") {
            this.drawTriangle({
                left: x,
                top: y,
                width: 0,
                height: 0,
            })
        } else if (this.mode === "line") {
            this.drawLine({
                x1: x,
                y1: y,
                x2: x,
                y2: y
            })
        } else if (this.mode === "arrow") {
            this.drawArrow({
                x1: x,
                y1: y,
                x2: x,
                y2: y
            })
        } else if (this.mode === 'diamond') {
            this.drawDiamond(x, y, {});
        }
    }

    private onMouseMove(event: IEvent<MouseEvent>) {
        if (!this.isDrawing || !event.pointer || !this.currentShape) return;

        // 计算宽高
        const {x, y} = event.pointer;
        const width = x - this.startX;
        const height = y - this.startY;

        const options = {
            width,
            height,
        } as Record<string, any>;
        if (this.mode === "circle") {
            options['rx'] = options['width'] / 2;
            options['ry'] = options['height'] / 2;
        } else if (this.mode === 'line' || this.mode === 'arrow') {
            options['x2'] = x;
            options['y2'] = y;
        } else if (this.mode === 'diamond') {
            options['points'] = this.renderDiamond(this.startX, this.startY, width, height);
        }

        // 设置宽高
        this.currentShape.set(options);

        // 更新画布
        this.canvas.renderAll();
    }

    private onMouseUp() {
        this.isDrawing = false;
        this.currentShape = null;
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

    // ===================================================================================
    // --------------------------------------- 绘制 ---------------------------------------
    // ===================================================================================

    /**
     * 绘制文字
     * @param text 字符串
     * @param options 选项
     */
    private drawText(text: string, options?: ITextOptions) {
        let color = '#000000';
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
    }

    /**
     * 绘制矩形
     * @param options 参数
     */
    private drawRect(options: IRectOptions) {
        const rect = new fabric.Rect({...this.options, ...options});
        this.canvas.add(rect);
        this.currentShape = rect;
    }

    /**
     * 绘制圆形
     * @param options 参数
     */
    private drawCircle(options: ICircleOptions) {
        const circle = new fabric.Circle({
            radius: Math.min(options.height || 0, options.width || 0) / 2, // 圆的半径 50
            ...this.options,
            ...options
        });
        this.canvas.add(circle);
        this.currentShape = circle;
    }

    /**
     * 绘制椭圆
     * @param options 参数
     */
    private drawEllipse(options: IEllipseOptions) {
        const ellipse = new fabric.Ellipse({
            ...this.options,
            ...options
        });
        this.canvas.add(ellipse);
        this.currentShape = ellipse;
    }

    /**
     * 绘制三角形
     * @param options 参数
     */
    private drawTriangle(options: ITriangleOptions) {
        const triangle = new fabric.Triangle({
            ...this.options,
            ...options
        });
        this.canvas.add(triangle);
        this.currentShape = triangle;
    }

    /**
     * 绘制菱形
     * @param x 起始x
     * @param y 起始y
     * @param options 参数
     */
    private drawDiamond(x: number, y: number, options: IPolylineOptions) {
        const polygon = new fabric.Polygon(
            this.renderDiamond(x, y, options.width || 0, options.height || 0), {
                ...this.options,
                ...options
            })
        this.canvas.add(polygon);
        this.currentShape = polygon;
    }

    private renderDiamond(x: number, y: number, width: number, height: number): IPoint[] {
        return [{
            x,
            y: y - height / 2
        }, {
            x: x + width / 2,
            y
        }, {
            x,
            y: y + height / 2
        }, {
            x: x - width / 2,
            y
        }]
    }

    private drawLine(option: ILineOptions) {
        const line = new fabric.Line([
            option.x1 || 0, option.y1 || 0,
            option.x2 || 0, option.y2 || 0
        ], {
            ...this.options,
            ...option
        });
        this.canvas.add(line);
        this.currentShape = line;
    }

    private drawArrow(option: ILineOptions) {
        const arrow = new Arrow([
            option.x1 || 0, option.y1 || 0,
            option.x2 || 0, option.y2 || 0
        ], {
            ...this.options,
            ...option
        });
        this.canvas.add(arrow);
        this.currentShape = arrow;
    }


}
