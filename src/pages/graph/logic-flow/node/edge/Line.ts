import { LineEdge, LineEdgeModel, EdgeConfig, GraphModel } from '@logicflow/core'
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 直线
class Model extends LineEdgeModel {
  constructor(data: EdgeConfig, graphModel: GraphModel) {
    super(data, graphModel)
    this.strokeWidth = 1
  }
  getTextStyle() {
    const style = super.getTextStyle()
    return getTextStyleFunction(style, this.properties)
  }

  getEdgeStyle() {
    const attributes = super.getEdgeStyle()
    const properties = this.properties;
    const style = getShapeStyleFunction(attributes, properties)
    return { ...style, fill: 'none' }
  }
}
export default {
  type: 'pro-line',
  view: LineEdge,
  model: Model
}
