import { RectNode, RectNodeModel } from "@logicflow/core";

// 带圆角的矩形
class RectRadiusModel extends RectNodeModel {
  setAttributes () {
    super.setAttributes()
    this.radius = 20;
  }
}
export default {
  type: 'rect-radius',
  view: RectNode,
  model: RectRadiusModel
}
