import { EllipseNode, EllipseNodeModel } from "@logicflow/core";

// 椭圆
class EllipseNewModel extends EllipseNodeModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.rx = 60
        this.ry = 30
    }
    getNodeStyle() {
        const style = super.getNodeStyle()
        return {
            ...style,
            stroke: 'rgb(24, 125, 255)'
        }
    }
}
export default {
    type: 'pro-ellipse',
    view: EllipseNode,
    model: EllipseNewModel
}
