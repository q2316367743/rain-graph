import {fabric} from "fabric";

export default class FabricWbWrap {

    private readonly canvas: fabric.Canvas;

    constructor(element: HTMLCanvasElement | null, width: number, height: number) {
        // 初始化画布，默认可绘制
        this.canvas = new fabric.Canvas(element, {
            isDrawingMode: true,
            selection: false,
            includeDefaultValues: false,
            width,
            height
        });
    }

    setWidth(width: number) {
        this.canvas.setWidth(width);
    }
    setHeight(height: number) {
        this.canvas.setHeight(height);
    }
}
