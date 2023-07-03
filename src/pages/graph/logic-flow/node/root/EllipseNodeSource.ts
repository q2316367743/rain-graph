import { EllipseResize } from "@logicflow/extension";
import { getShapeStyleFunction, getTextStyleFunction } from "../getShapeStyleUtil";

// 椭圆
class ResizeEllipseModel extends EllipseResize.model {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.rx = 60
        this.ry = 30
        this.text.draggable = false;
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

class ResizeEllipseView extends EllipseResize.view {
}

export { ResizeEllipseView, ResizeEllipseModel }

