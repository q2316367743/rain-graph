import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil';

// 左箭头
class LeftArrowModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.width = 80
        this.height = 50
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
        const { width, x, y, id } = this;
        return [
            {
                x: x - width / 2,
                y,
                name: 'left',
                id: `${id}_0`
            },
            {
                x: x + width / 2,
                y,
                name: 'right',
                id: `${id}_1`,
            },
        ]
    }
}
class LeftArrowView extends ResizableRectView {
    getResizeShape() {
        const { x, y, width, height } = this.props.model
        const style = this.props.model.getNodeStyle()
        const ArrowHeight = 1 / 3 * height;
        const leftX = x - 1 / 2 * width;
        const leftX2 = x - 1 / 5 * width;
        const rightX = x + 1 / 2 * width;
        const attrs = {
            ...style,
            x,
            y,
            width,
            height,
            points: [
                [leftX2, y - 1 / 2 * ArrowHeight],
                [leftX2, y - 1 / 2 * height],
                [leftX, y],
                [leftX2, y + 1 / 2 * height],
                [leftX2, y + 1 / 2 * ArrowHeight],
                [rightX, y + 1 / 2 * ArrowHeight],
                [rightX, y - 1 / 2 * ArrowHeight],
            ]
        }

        return h('g', {}, [
            h('polygon', { ...attrs })
        ]
        );
    }
}

export default {
    type: 'left-arrow',
    view: LeftArrowView,
    model: LeftArrowModel
}