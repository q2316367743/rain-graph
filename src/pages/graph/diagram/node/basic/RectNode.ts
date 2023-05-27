import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'
import { RectNode, RectNodeModel } from "@logicflow/core";

// 矩形
class RectNewModel extends RectNodeModel {

  setToBottom() {
    this.zIndex = 0
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

export default {
  type: 'pro-rect',
  view: RectNode,
  model: RectNewModel
}
