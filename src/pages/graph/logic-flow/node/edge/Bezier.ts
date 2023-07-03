import { BezierEdge, BezierEdgeModel, EdgeConfig, GraphModel } from '@logicflow/core'
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 贝塞尔曲线
class Model extends BezierEdgeModel {
  constructor(data: EdgeConfig, graphModel: GraphModel) {
    super(data, graphModel)
    this.strokeWidth = 4
  }
  getTextStyle() {
    const style = super.getTextStyle()
    return getTextStyleFunction(style, this.properties)
  }

  getEdgeStyle() {
    const attributes = super.getEdgeStyle()
    const properties = this.properties;
    const style = getShapeStyleFunction(attributes, properties)
    return { ...style, fill: 'none', stroke: 'rgb(24, 125, 255)', strokeWidth: 4 }
  }
}
export default {
  type: 'pro-bezier',
  view: BezierEdge,
  model: Model
}
