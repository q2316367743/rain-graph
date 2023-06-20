import {fabric} from "fabric";
import {ICanvasOptions} from "fabric/fabric-impl";
import {utools} from "@/plugin/utools";


export default class FabricWrap {

    readonly canvas: fabric.Canvas;

    constructor(element?: HTMLCanvasElement, config?: ICanvasOptions) {
        if (!element) {
            this.canvas = {} as any;
            return
        }
        this.canvas = new fabric.Canvas(element, {
            ...config,
            width: 420,
            height: 595,
            backgroundColor: utools.isDarkColors() ? "#000000" : "#ffffff",
            fireRightClick: true,
            stopContextMenu: false
        });
        this.canvas.renderAll();
    }

    destroy() {
        this.canvas.clear();
    }

    // ========================================================
    // ------------------------ 配置设置 ------------------------
    // ========================================================

    updateBackground(config: { width: number, height: number, color: string }) {
        this.canvas.setWidth(config.width);
        this.canvas.setHeight(config.height);
        this.canvas.setBackgroundColor(config.color, () => {
        });
        this.canvas.renderAll();
    }


}