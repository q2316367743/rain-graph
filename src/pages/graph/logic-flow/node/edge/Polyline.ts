import { PolylineEdge, PolylineEdgeModel, EdgeConfig, GraphModel } from '@logicflow/core'
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 折线
class Model extends PolylineEdgeModel {
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
  type: 'pro-polyline',
  view: PolylineEdge,
  model: Model
}
