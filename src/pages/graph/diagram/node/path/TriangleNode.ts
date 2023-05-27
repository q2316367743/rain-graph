import { h } from '@logicflow/core'
import { RectNode, RectNodeModel } from "@logicflow/core";
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 三角形
class TriangleModel extends RectNodeModel {
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

class TriangleView extends RectNode {
    getShape() {
        const { x, y, width, height } = this.props.model
        const style = this.props.model.getNodeStyle()
        const attrs = {
            ...style,
            x,
            y,
            width,
            height,
            points: [
                [x - width / 2, y + height / 2],
                [x - width / 2, y - height / 2],
                [x + width / 2, y]
            ]
        }
        return h('g', {}, [
            h('polygon', { ...attrs })
        ]
        )
    }
}

export default {
    type: 'triangle',
    view: TriangleView,
    model: TriangleModel
}