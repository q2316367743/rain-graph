import { RectNode, RectNodeModel } from "@logicflow/core";
import { getShapeStyleFunction, getTextStyleFunction } from "../getShapeStyleUtil";

// 带圆角的矩形
class RectRadiusModel extends RectNodeModel {
  setAttributes () {
    super.setAttributes()
    this.radius = 20;
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
  type: 'rect-radius',
  view: RectNode,
  model: RectRadiusModel
}
