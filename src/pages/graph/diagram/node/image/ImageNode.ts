import { h } from '@logicflow/core'
import { RectNode, RectNodeModel } from "@logicflow/core";

// 图片-基础节点
class ImageModel extends RectNodeModel {
  initNodeData(data: any) {
    super.initNodeData(data)
    this.width = 80
    this.height = 60
  }
}


class ImageNode extends RectNode {
  getImageHref() {
    return "";
  }
  getShape() {
    const { x, y, width, height } = this.props.model
    const href = this.getImageHref()
    const attrs = {
      x: x - 1 / 2 * width,
      y: y - 1 / 2 * height,
      width,
      height,
      href,
      // 根据宽高缩放
      preserveAspectRatio: 'none meet'
    }
    return h('g', {}, [
      h('image', { ...attrs })
    ]
    );
  }
}

export default {
  type: 'image-node',
  view: ImageNode,
  model: ImageModel
}