import { h } from '@logicflow/core'
import { RectNode, RectNodeModel } from "@logicflow/core";
import { getShapeStyleFunction, getTextStyleFunction } from '../getShapeStyleUtil';


// 水平双箭头
class IconModel extends RectNodeModel {
  initNodeData(data: any) {
    super.initNodeData(data)
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

// 左上角带ICON的节点
class IconNode extends RectNode {
  getImageHref() {
    return "";
  }
  getShape() {
    const { x, y, width, height } = this.props.model
    const style = this.props.model.getNodeStyle()
    const href = this.getImageHref();
    const iconAttrs = {
      x: x - 1 / 2 * width + 5,
      y: y - 1 / 2 * height + 5, // icon在左上角
      width: 25,
      height: 18,
      href,
      // // 根据宽高缩放
      preserveAspectRatio: 'none meet'
    }
    const rectAttrs = {
      ...style,
      strokeWidth: 1,
      rx: 5,
      ry: 5,
      x: x - 1 / 2 * width,
      y: y - 1 / 2 * height,
      width,
      height,
    }
    return h('g', {},
      [
        h('rect', { ...rectAttrs }),
        h('image', {
          ...iconAttrs
        })
      ]
    );
  }
}

export default {
  type: 'image-node',
  view: IconNode,
  model: IconModel
}