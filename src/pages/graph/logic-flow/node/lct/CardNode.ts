// 注释
import {ResizableRectModel, ResizableRectView} from '../root/RectNodeSource';
import {h} from "@logicflow/core";

class LctCardModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data);
        this.height = this.height * 0.7
    }
}

class LctCardView extends ResizableRectView {

    getResizeShape() {
        const {model} = this.props;
        const {x, y, width, height} = model;
        const style = model.getNodeStyle();
        return h("svg", {
            x: x - 1 / 2 * width,
            y: y - 1 / 2 * height,
            width,
            height
        }, [
            h("polygon", {
                ...style,
                points: `${width},0 ${width/4},0 0,${height/4} 0,${height} ${width},${height} ${width},0`
            }),
        ]);
    }

}

export default {
    type: "lct-card",
    tip: '卡片',
    view: LctCardView,
    model: LctCardModel,
};