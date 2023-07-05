import {fabric} from "fabric";
import FabricWbWrap from "@/pages/graph/fabric-wb/core/FabricWbWrap";
import {
    ICircleOptions,
    IEllipseOptions, ILineOptions, IPoint,
    IPolylineOptions,
    IRectOptions,
    ITextOptions,
    ITriangleOptions, Transform, Object, Canvas, IObjectOptions
} from "fabric/fabric-impl";
import {useGlobalStore} from "@/store/GlobalStore";
import Arrow from "@/pages/graph/fabric-wb/core/node/ArrowNode";
import {deleteIcon, cloneIcon} from "@/pages/graph/fabric-wb/core/constants";

const deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;

const cloneImg = document.createElement('img');
cloneImg.src = cloneIcon;

const cornerSize = 20;

function renderIcon(icon: HTMLImageElement) {
    return function renderIcon(ctx: any, left: number, top: number, _styleOverride: any, fabricObject: Object) {
        let size = cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    // @ts-ignore
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 24
});

fabric.Object.prototype.controls.clone = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: -16,
    cursorStyle: 'pointer',
    // @ts-ignore
    mouseUpHandler: cloneObject,
    render: renderIcon(cloneImg),
    cornerSize: 24
});


function deleteObject(eventData: MouseEvent, transformData: Transform) {
    let target = transformData.target;
    let canvas = target.canvas;
    if (canvas) {
        canvas.getActiveObjects().forEach(obj => {
            if (canvas) {
                canvas.remove(obj)
            }
        });
        canvas.requestRenderAll();
        canvas.discardActiveObject();
    }
}

function cloneObject(eventData: MouseEvent, transformData: Transform) {
    let target = transformData.target;
    let canvas = target.canvas;
    target.clone(function (cloned: Object) {
        cloned.left = (cloned.left || 0) + 10;
        cloned.top = (cloned.top || 0) + 10;
        if (canvas) {
            canvas.add(cloned);
        }
    });
}

export default class FabricWbNode {

    private readonly canvas: fabric.Canvas;
    private readonly instance: FabricWbWrap;


    constructor(canvas: fabric.Canvas, instance: FabricWbWrap) {
        this.canvas = canvas;
        this.instance = instance;
    }

    /**
     * 绘制文字
     * @param text 字符串
     * @param options 选项
     */
    drawText(text: string, options?: ITextOptions) {
        let color = '#000000';
        if (useGlobalStore().isDark) {
            color = "#ffffff"
        }
        const textObj = new fabric.IText(text, {
            editingBorderColor: color,
            padding: 5,
            cursorColor: color,
            ...this.instance.getOptions(),
            fill: color,
            ...options
        });
        this.canvas.add(textObj);
        this.instance.setCurrentShape(textObj);
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
    drawRect(options: IRectOptions) {
        const rect = new fabric.Rect({
            rx: 20, // x轴的半径
            ry: 20, // y轴的半径
            ...this.instance.getOptions(),
            ...options
        });

        this.canvas.add(rect);
        this.instance.setCurrentShape(rect);
    }

    /**
     * 绘制圆形
     * @param options 参数
     */
    drawCircle(options: ICircleOptions) {
        const circle = new fabric.Circle({
            radius: Math.min(options.height || 0, options.width || 0) / 2, // 圆的半径 50
            ...this.instance.getOptions(),
            ...options
        });
        this.canvas.add(circle);
        this.instance.setCurrentShape(circle);
    }

    /**
     * 绘制椭圆
     * @param options 参数
     */
    drawEllipse(options: IEllipseOptions) {
        const ellipse = new fabric.Ellipse({
            ...this.instance.getOptions(),
            ...options
        });
        this.canvas.add(ellipse);
        this.instance.setCurrentShape(ellipse);
    }

    /**
     * 绘制三角形
     * @param options 参数
     */
    drawTriangle(options: ITriangleOptions) {
        const triangle = new fabric.Triangle({
            ...this.instance.getOptions(),
            ...options
        });
        this.canvas.add(triangle);
        this.instance.setCurrentShape(triangle);
    }

    /**
     * 绘制菱形
     * @param x 起始x
     * @param y 起始y
     * @param options 参数
     */
    drawDiamond(x: number, y: number, options: IPolylineOptions) {
        const polygon = new fabric.Polygon(
            this.renderDiamond(x, y, options.width || 0, options.height || 0), {
                ...this.instance.getOptions(),
                ...options
            })
        this.canvas.add(polygon);
        this.instance.setCurrentShape(polygon);
    }

    renderDiamond(x: number, y: number, width: number, height: number): IPoint[] {
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

    drawLine(option: ILineOptions) {
        const line = new fabric.Line([
            option.x1 || 0, option.y1 || 0,
            option.x2 || 0, option.y2 || 0
        ], {
            ...this.instance.getOptions(),
            ...option
        });
        this.canvas.add(line);
        this.instance.setCurrentShape(line);
    }

    drawArrow(option: ILineOptions) {
        const arrow = new Arrow([
            option.x1 || 0, option.y1 || 0,
            option.x2 || 0, option.y2 || 0
        ], {
            ...this.instance.getOptions(),
            ...option
        });
        this.canvas.add(arrow);
        this.instance.setCurrentShape(arrow);
    }

    appendImage(url: string) {
        // 加载图片
        fabric.Image.fromURL(url, image => {
            image.scale(0.5)
            this.canvas.add(image);
            this.instance.setCurrentShape(image);
        })
    }

    appendSvg(svgStr: string, options?: IObjectOptions) {
        fabric.loadSVGFromString(svgStr, (results: Object[], opt) => {
            const option = {
                ...options,
                ...opt,
            };
            option['top'] = (option['top'] || 0) - this.instance.getEvent().offsetY
            option['left'] = (option['left'] || 0) - this.instance.getEvent().offsetX
            const group =  new fabric.Group(results, option);

            this.canvas.add(group);
            this.instance.setCurrentShape(group);
        })
    }

}
