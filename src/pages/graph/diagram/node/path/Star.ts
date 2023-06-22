import { h } from '@logicflow/core'
import { ResizableRectModel, ResizableRectView } from '../root/RectNodeSource';

// 五角星
class StarModel extends ResizableRectModel {
    initNodeData(data: any) {
        super.initNodeData(data)
        this.width = 80;
        this.height = 80;
    }
}

class StarView extends ResizableRectView {
    getResizeShape() {
        const { x, y, width, height } = this.props.model
        const style = this.props.model.getNodeStyle()
        const svgAttr = {
            x: x - 1 / 2 * width,
            y: y - 1 / 2 * height,
            width,
            height,
        }
        const pathAAttrs = {
            ...style,
            d: 'm0.36922,13.46587l12.98695,0l4.01307,-13.36885l4.01307,13.36885l12.98694,0l-10.50664,8.26231l4.01327,13.36885l-10.50665,-8.26253l-10.50664,8.26253l4.01327,-13.36885l-10.50665,-8.26231l0,0z'
        }

        return h('svg', { ...svgAttr, viewBox: '0 0 37 37' }, [
            h('path', {
                ...pathAAttrs,
            })
        ])
    }
}

export default {
    type: 'star',
    tip: '五角星',
    view: StarView,
    model: StarModel
}