import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'
import { DiamondNode, DiamondNodeModel } from "@logicflow/core";

// 菱形
/**
 * model控制初始化的值
 */
class DiamondModel extends DiamondNodeModel {
  initNodeData(data: any) {
    super.initNodeData(data)
    this.rx = 35
    this.ry = 35
  }
  getNodeStyle() {
    const style = super.getNodeStyle()
    const properties = this.getProperties();
    properties.borderColor = 'rgb(24, 125, 255)';
    return getShapeStyleFunction(style, properties)
  }

  getTextStyle() {
    const style = super.getTextStyle()
    const properties = this.getProperties()
    return getTextStyleFunction(style, properties)
  }

  setToBottom() {
    this.zIndex = 0
  }
}

export default {
  type: 'pro-diamond',
  view: DiamondNode,
  model: DiamondModel
}
