import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'
import { DiamondResize } from "@logicflow/extension";

// 菱形
/**
 * model控制初始化的值
 */
class ResizableDiamondModel extends DiamondResize.model {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.rx = 35
        this.ry = 35
        this.text.draggable = false;
    }
    getNodeStyle() {
        const style = super.getNodeStyle()
        const properties = this.getProperties();
        properties.borderColor = 'rgb(24, 125, 255)';
        return getShapeStyleFunction(style, properties)
    }

    getTextStyle() {
        const style = super.getTextStyle()
        const properties = this.getProperties()
        return getTextStyleFunction(style, properties)
    }

    setToBottom() {
        this.zIndex = 0
    }
}
class ResizableDiamondView extends DiamondResize.view { }

export {ResizableDiamondView, ResizableDiamondModel}

