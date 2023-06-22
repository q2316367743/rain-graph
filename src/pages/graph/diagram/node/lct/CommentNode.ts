// 注释
import {ResizableRectModel, ResizableRectView} from '../root/RectNodeSource';
import {h} from "@logicflow/core";

class LctCommentModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data);
        this.width = 50;
        this.setProperties({
            borderWidth: 3
        })
    }
}

class LctCommentView extends ResizableRectView {

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
            h("path", {
                ...style,
                fill: 'transparent',
                d: `M ${width} 0 L 0 0 L 0 ${height} L ${width} ${height}`
            }),
        ]);
    }

}

export default {
    type: "lct-comment",
    tip: '注释',
    view: LctCommentView,
    model: LctCommentModel,
};