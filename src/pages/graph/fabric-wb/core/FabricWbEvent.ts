import {fabric} from "fabric";
import {IEvent} from "fabric/fabric-impl";
import {useMagicKeys} from "@vueuse/core";
import FabricWbWrap from "@/pages/graph/fabric-wb/core/FabricWbWrap";
import FabricWbNode from "@/pages/graph/fabric-wb/core/FabricWbNode";

export default class FabricWbEvent {

    private readonly canvas: fabric.Canvas;
    private readonly instance: FabricWbWrap;
    private readonly node: FabricWbNode;
    private space = useMagicKeys().space

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


    constructor(canvas: fabric.Canvas, instance: FabricWbWrap, node: FabricWbNode) {
        this.canvas = canvas;
        this.instance = instance;
        this.node = node;
        // 事件
        this.canvas.on('mouse:down', e => this.onMouseDown(e));
        this.canvas.on('mouse:move', e => this.onMouseMove(e));
        this.canvas.on('mouse:up', () => this.onMouseUp());
        // 监听鼠标滚轮事件
        // this.canvas.on('mouse:wheel', e => this.onMouseWheel(e));
    }

    private onMouseDown(e: IEvent<MouseEvent>) {
        if (this.space.value) {
            let evt = e.e
            this.isDragging = true
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
            return;
        }
        // 动画
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
        if (this.instance.getMode() == "rectangle") {
            this.node.drawRect({
                left: x,
                top: y,
                width: 0,
                height: 0,
            });
        } else if (this.instance.getMode() === "text") {
            this.node.drawText("", {
                left: x,
                top: y,
                height: 100,
                fontFamily: "JetBrainsMono,微软雅黑"
            })
        } else if (this.instance.getMode() === 'circle') {
            this.node.drawCircle({
                left: x,
                top: y,
                width: 0,
                height: 0,
            });
        } else if (this.instance.getMode() === "triangle") {
            this.node.drawTriangle({
                left: x,
                top: y,
                width: 0,
                height: 0,
            })
        } else if (this.instance.getMode() === "line") {
            this.node.drawLine({
                x1: x,
                y1: y,
                x2: x,
                y2: y
            })
        } else if (this.instance.getMode() === "arrow") {
            this.node.drawArrow({
                x1: x,
                y1: y,
                x2: x,
                y2: y
            })
        } else if (this.instance.getMode() === 'diamond') {
            this.node.drawDiamond(x, y, {});
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

        let currentShape = this.instance.getCurrentShape();
        if (!this.isDrawing || !event.pointer || !currentShape) return;

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
        } else {
            if (!isBottom) {
                options['top'] = ty;
            }
        }

        if (this.instance.getMode() === "circle") {
            options['rx'] = options['width'] / 2;
            options['ry'] = options['height'] / 2;
            options['radius'] = Math.min(options['width'], options['height']) / 2;
        } else if (this.instance.getMode() === 'line' || this.instance.getMode() === 'arrow') {
            options['x2'] = x;
            options['y2'] = y;
        } else if (this.instance.getMode() === 'diamond') {
            options['points'] = this.node.renderDiamond(this.startX, this.startY, width, height);
        }
        // 设置宽高
        currentShape.set(options);

        // 更新画布
        this.canvas.renderAll();
    }

    private onMouseUp() {
        if (this.isDragging) {
            this.canvas.setViewportTransform(this.canvas.viewportTransform || []);
        }
        this.isDragging = false // 关闭移动状态
        this.isDrawing = false;
        this.instance.setCurrentShape(null);
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

}
