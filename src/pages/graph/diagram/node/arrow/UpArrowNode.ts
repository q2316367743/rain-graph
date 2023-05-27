import { h } from '@logicflow/core'
import { RectNode, RectNodeModel } from "@logicflow/core";

// 上箭头
class UpArrowModel extends RectNodeModel {
  initNodeData(data: any) {
    super.initNodeData(data)
    this.width = 50
    this.height = 80
  }
}

class UpArrowView extends RectNode {
  getShape() {
    const { x, y, width, height } = this.props.model
    const style = this.props.model.getNodeStyle()
    const ArrowWidth = 1 / 3 * width;
    const upY = y - 1 / 2 * height;
    const upY2 = y - 1 / 5 * height;
    const downY = y + 1 / 2 * height;
    const attrs = {
      ...style,
      x,
      y,
      width,
      height,
      points: [
        [x - 1 / 2 * ArrowWidth, upY2],
        [x - 1 / 2 * width, upY2],
        [x, upY],
        [x + 1 / 2 * width, upY2],
        [x + 1 / 2 * ArrowWidth, upY2],
        [x + 1 / 2 * ArrowWidth, downY],
        [x - 1 / 2 * ArrowWidth, downY],
      ]
    }

    return h('g', {}, [
      h('polygon', { ...attrs })
    ]
    );
  }
}

export default {
  type: 'up-arrow',
  view: UpArrowView,
  model: UpArrowModel
}