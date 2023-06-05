import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil';

// 水平双箭头
class HorizontalArrowModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.width = 80
        this.height = 40
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

class HorizontalArrowView extends ResizableRectView {
    getResizeShape() {
        const { x, y, width, height } = this.props.model
        const style = this.props.model.getNodeStyle()
        const ArrowHeight = 1 / 3 * height;
        const leftX = x - 1 / 2 * width;
        const leftX2 = x - 1 / 5 * width;
        const rightX = x + 1 / 2 * width;
        const rightX2 = x + 1 / 5 * width;
        const attrs = {
            ...style,
            x,
            y,
            width,
            height,
            points: [
                // 右箭头
                [rightX2, y - 1 / 2 * ArrowHeight],
                [rightX2, y - 1 / 2 * height],
                [rightX, y],
                [rightX2, y + 1 / 2 * height],
                [rightX2, y + 1 / 2 * ArrowHeight],
                // 左箭头
                [leftX2, y + 1 / 2 * ArrowHeight],
                [leftX2, y + 1 / 2 * height],
                [leftX, y],
                [leftX2, y - 1 / 2 * height],
                [leftX2, y - 1 / 2 * ArrowHeight],
            ]
        }

        return h('g', {}, [
            h('polygon', { ...attrs })
        ]
        );
    }
}

export default {
    type: 'horizontal-arrow',
    view: HorizontalArrowView,
    model: HorizontalArrowModel
}