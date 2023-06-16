import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil';

// 上箭头
class UpArrowModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.width = 50
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
    // 定义节点只有左右两个锚点. 锚点位置通过中心点和宽度算出来。
    getDefaultAnchor() {
        const { height, x, y, id } = this;
        return [
            {
                x: x,
                y: y - height / 2,
                name: 'left',
                id: `${id}_0`
            },
            {
                x: x,
                y: y + height / 2,
                name: 'right',
                id: `${id}_1`,
            },
        ]
    }
}

class UpArrowView extends ResizableRectView {
    getResizeShape() {
        const { x, y, width, height } = this.props.model
        const style = this.props.model.getNodeStyle()
        const ArrowWidth = 1 / 3 * width;
        const upY = y - 1 / 2 * height;
        const upY2 = y - 1 / 5 * height;
        const downY = y + 1 / 2 * height;
        const attrs = {
            ...style,
            x,
            y,
            width,
            height,
            points: [
                [x - 1 / 2 * ArrowWidth, upY2],
                [x - 1 / 2 * width, upY2],
                [x, upY],
                [x + 1 / 2 * width, upY2],
                [x + 1 / 2 * ArrowWidth, upY2],
                [x + 1 / 2 * ArrowWidth, downY],
                [x - 1 / 2 * ArrowWidth, downY],
            ]
        }

        return h('g', {}, [
            h('polygon', { ...attrs })
        ]
        );
    }
}

export default {
    type: 'up-arrow',
    view: UpArrowView,
    model: UpArrowModel
}