import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 平行四边形
class ParallelogramModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.width = 100
        this.height = 60
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

class ParallelogramView extends ResizableRectView {
    getResizeShape() {
        const { x, y, width, height } = this.props.model;
        const style = this.props.model.getNodeStyle();
        const pointList = [
            [x - width / 2, y + height / 2],
            [x - width / 5, y - height / 2],
            [x + width / 2, y - height / 2],
            [x + width / 5, y + height / 2]
        ];
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
        ]
        )
    }
}

export default {
    type: 'parallelogram',
    view: ParallelogramView,
    model: ParallelogramModel
}