import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'
import { CircleNode, CircleNodeModel } from "@logicflow/core";

// 圆形
class CircleNewModel extends CircleNodeModel {
  initNodeData(data: any) {
    super.initNodeData(data)
    this.rx = 35
    this.ry = 35
  }

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
  type: 'pro-circle',
  view: CircleNode,
  model: CircleNewModel
}
