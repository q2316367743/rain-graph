import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 六边形
class HexagonModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.width = 80
        this.height = 80
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

class HexagonView extends ResizableRectView {
    getResizeShape() {
        const { x, y, width, height } = this.props.model
        const style = this.props.model.getNodeStyle()
        const pointList = [
            [x - 0.28 * width, y - 0.5 * height],
            [x + 0.28 * width, y - 0.5 * height],
            [x + 0.5 * width, y],
            [x + 0.28 * width, y + 0.5 * height],
            [x - 0.28 * width, y + 0.5 * height],
            [x - 0.5 * width, y]
        ]
        const points = pointList.map(item => {
            return `${item[0]},${item[1]}`
        })
        const attrs = {
            ...style,
            x,
            y,
            width,
            height,
            points: points.join(' ')
        }

        return h('g', {}, [
            h('polygon', { ...attrs })
        ])
    }

}

export default {
    type: 'hexagon',
    tip: '六边形',
    view: HexagonView,
    model: HexagonModel
}