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
import {useMagicKeys} from "@vueuse/core";

export default class FabricWbWrap {

    private readonly canvas: fabric.Canvas;
    private options: IObjectOptions;
    private currentShape: Object | null;
    private mode: FabricWbMode = "selection";
    private space = useMagicKeys().space

    // 基础属性
    private width: number = 0;
    private height: number = 0;

    // 是否处于绘制状态
    private isDrawing = false;
    // 鼠标起点坐标x
    private startX = 0;
    // 鼠标起点多表y
    private startY = 0;
    // 是否处于拖动状态
    private isDragging = false;
    // 最后的坐标x
    private lastPosX = 0;
    // 最后的坐标y
    private lastPosY = 0;

    // 缩放
    private zoom = 1;
    // 偏移X
    private offsetX = 0;
    // 偏移Y
    private offsetY = 0;

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
        this.canvas.on('mouse:down', e => this.onMouseDown(e));
        this.canvas.on('mouse:move', e => this.onMouseMove(e));
        this.canvas.on('mouse:up', e => this.onMouseUp(e));
        // 监听鼠标滚轮事件
        // this.canvas.on('mouse:wheel', e => this.onMouseWheel(e));
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

    public clear() {
        this.canvas.clear();
    }

    // ======================================================================================
    // --------------------------------------- 事件监听 ---------------------------------------
    // ======================================================================================

    private onMouseDown(e: IEvent<MouseEvent>) {
        if (this.space.value) {
            let evt = e.e
            this.isDragging = true
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
            return;
        }
        // 动画
        this.animate(e, 1);
        // 如果当前有活动的元素则不进行后续绘制
        const activeObject = this.canvas.getActiveObject();
        if (!e.pointer || activeObject) return;
        // 切换成绘制状态
        this.isDrawing = true;
        // 记录当前坐标点
        const pointer = e.pointer;
        const x = pointer.x - this.offsetX;
        const y = pointer.y - this.offsetY;
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
                height: 100,
                fontFamily: "JetBrainsMono,微软雅黑"
            })
        } else if (this.mode === 'circle') {
            this.drawCircle({
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
        if (this.isDragging) {
            // 处于拖拽模式
            let evt = event.e
            let vpt = this.canvas.viewportTransform!; // 聚焦视图的转换
            vpt[4] += evt.clientX - this.lastPosX;
            vpt[5] += evt.clientY - this.lastPosY;
            this.offsetX = vpt[4];
            this.offsetY = vpt[5];
            this.canvas.requestRenderAll(); // 重新渲染
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
            return;
        }


        if (!this.isDrawing || !event.pointer || !this.currentShape) return;

        // 计算宽高
        const {x, y} = event.pointer;
        const width = x - this.startX - this.offsetX;
        const height = y - this.startY - this.offsetY;

        const tx = x - this.offsetX;
        const ty = y - this.offsetY;
        const isRight = width > 0;
        const isBottom = height > 0;

        const options = {
            width: Math.abs(width),
            height: Math.abs(height),
        } as Record<string, any>;

        // 位置
        if (!isRight) {
            options['left'] = tx
            options['top'] = ty - options['height'];
            if (!isBottom) {
                options['top'] = ty;
            }
        }else {
            if (!isBottom) {
                options['top'] = ty;
            }
        }

        if (this.mode === "circle") {
            options['rx'] = options['width'] / 2;
            options['ry'] = options['height'] / 2;
            options['radius'] = Math.min(options['width'], options['height']) / 2;
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

    private onMouseUp(e: IEvent<MouseEvent>) {
        if (this.isDragging) {
            this.canvas.setViewportTransform(this.canvas.viewportTransform || []);
        }
        // 动画
        this.animate(e, 0);
        this.isDragging = false // 关闭移动状态
        this.isDrawing = false;
        this.currentShape = null;
    }

    private onMouseWheel(e: IEvent<WheelEvent>) {
        if (!e.e.ctrlKey) {
            // 如果没有按住ctrl，不处理
            return;
        }
        let delta = e.e.deltaY // 滚轮向上滚一下是 -100，向下滚一下是 100
        let zoom = this.canvas.getZoom() // 获取画布当前缩放值

        // 控制缩放范围在 0.01~20 的区间内
        zoom *= 0.999 ** delta
        if (zoom > 20) zoom = 20
        if (zoom < 0.01) zoom = 0.01;

        this.zoom = zoom;

        // 设置画布缩放比例
        // 关键点！！！
        // 参数1：将画布的所放点设置成鼠标当前位置
        // 参数2：传入缩放值
        this.canvas.zoomToPoint(
            {
                x: e.e.offsetX, // 鼠标x轴坐标
                y: e.e.offsetY  // 鼠标y轴坐标
            },
            zoom // 最后要缩放的值
        )
    }

    private animate(e: IEvent<MouseEvent>, dir: number) {
        if (e.target) {
            fabric.util.animate({
                startValue: e.target.get('angle'),
                endValue: (e.target.get('angle') || 0) + (dir ? 2 : -2),
                duration: 100
            })
            fabric.util.animate({
                startValue: e.target.get('scaleX'),
                endValue: (e.target.get('scaleX') || 0) + (dir ? 0.1 : -0.1),
                duration: 100,
                onChange: (value) => {
                    if (e.target) {
                        e.target.scale(value);
                    }
                    this.canvas.renderAll()
                },
                onComplete: () => {
                    if (e.target) {
                        e.target.setCoords();
                    }
                }
            })
        }
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
            editingBorderColor: color,
            padding: 5,
            cursorColor: color,
            ...this.options,
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
        const rect = new fabric.Rect({
            rx: 20, // x轴的半径
            ry: 20, // y轴的半径
            ...this.options,
            ...options
        });
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

    public appendImage(url: string) {
        // 加载图片
        fabric.Image.fromURL(url, image => {
            image.scale(0.5)
            this.canvas.add(image);
            this.currentShape = image;
        })
    }

}
