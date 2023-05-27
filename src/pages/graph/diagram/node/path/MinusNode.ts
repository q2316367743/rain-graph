import { h } from '@logicflow/core'
import { RectNode, RectNodeModel } from "@logicflow/core";
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil'

// 减号
class MinusModel extends RectNodeModel {
  initNodeData(data: any) {
    super.initNodeData(data)
    this.width = 80
    this.height = 20
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

class MinusView extends RectNode {
  getShape() {
    const { x, y, width, height } = this.props.model
    const style = this.props.model.getNodeStyle()
    const pointList = [
      [x - 1 / 2 * width, y - 1 / 2 * height],
      [x + 1 / 2 * width, y - 1 / 2 * height],
      [x + 1 / 2 * width, y + 1 / 2 * height],
      [x - 1 / 2 * width, y + 1 / 2 * height],
    ]
    const points = pointList.map(item => {
      return `${item[0]},${item[1]}`
    })
    const attrs = {
      ...style,
      x,
      y,
      width,
      height,
      points: points.join(' ')
    }

    return h('g', {}, [
      h('polygon', { ...attrs })
    ])
  }

}

export default {
  type: 'minus',
  view: MinusView,
  model: MinusModel
}