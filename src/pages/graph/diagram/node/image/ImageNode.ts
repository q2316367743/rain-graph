import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';

// 图片-基础节点
class ImageModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.width = 80
        this.height = 60
    }
}


class ImageNode extends ResizableRectView {
    getImageHref() {
        return "";
    }
    getResizeShape() {
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