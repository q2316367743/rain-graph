import {HtmlResize} from "@logicflow/extension";
import {getShapeStyleFunction, getTextStyleFunction} from "../getShapeStyleUtil";

class HtmlResizeModel extends HtmlResize.model {
    initNodeData(data: any) {
        super.initNodeData(data);
        this.width = 100;
        this.height = 100;
        this.text.draggable = false;
    }

    setToBottom() {
        this.zIndex = 0
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

class HtmlResizeView extends HtmlResize.view {
}

export {HtmlResizeView, HtmlResizeModel}