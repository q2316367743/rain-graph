import { RectResize } from "@logicflow/extension";
import { getShapeStyleFunction, getTextStyleFunction } from "../getShapeStyleUtil";

// 带圆角的矩形
class RectRadiusModel extends RectResize.model {
  setAttributes() {
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

class ResizableRectView extends RectResize.view { }

export default {
  type: 'rect-radius',
  tip: '带圆角的矩形',
  view: ResizableRectView,
  model: RectRadiusModel
}
