import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 七边形
class HeptagonModel extends ResizableRectModel {
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

class HeptagonView extends ResizableRectView {
    getResizeShape() {
        const { x, y, width, height } = this.props.model
        const style = this.props.model.getNodeStyle()
        const pointList = [
            [x, y - 0.5 * height],
            [x + 0.395 * width, y - 0.3 * height],
            [x + 0.5 * width, y + 0.145 * height],
            [x + 0.225 * width, y + 0.5 * height],
            [x - 0.225 * width, y + 0.5 * height],
            [x - 0.5 * width, y + 0.145 * height],
            [x - 0.395 * width, y - 0.3 * height]
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
    type: 'heptagon',
    view: HeptagonView,
    model: HeptagonModel
}