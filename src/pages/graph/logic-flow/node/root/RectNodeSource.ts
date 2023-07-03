import {h} from "@logicflow/core";
import {RectResize} from "@logicflow/extension";
import {getShapeStyleFunction, getTextStyleFunction} from "../getShapeStyleUtil";

class ResizableRectModel extends RectResize.model {
    initNodeData(data: any) {
        super.initNodeData(data);
        this.width = 100;
        this.height = 100;
        this.text.draggable = false;
    }

    setToBottom() {
        this.zIndex = 0
    }

    getNodeStyle() {
        const style = super.getNodeStyle()
        const properties = this.getProperties()
        return getShapeStyleFunction(style, properties)
    }

    getTextStyle() {
        const style = super.getTextStyle()
        const properties = this.getProperties()
        return getTextStyleFunction(style, properties)
    }
}

class ResizableRectView extends RectResize.view {
    /**
     * 此方法替代自定义节点的getShape方法。
     */
    getResizeShape() {
        const {model} = this.props;
        const {x, y, width, height, radius} = model;
        const style = model.getNodeStyle();
        return h("g", {}, [
            h("rect", {
                ...style,
                x: x - width / 2,
                y: y - height / 2,
                rx: radius,
                ry: radius,
                width,
                height,
            }),
        ]);
    }
}

export {ResizableRectView, ResizableRectModel}