import { h } from '@logicflow/core'
import { RectNode, RectNodeModel } from "@logicflow/core";
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil';

// 左箭头
class LeftArrowModel extends RectNodeModel {
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
}
class LeftArrowView extends RectNode {
  getShape() {
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