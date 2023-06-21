import {TextNode, TextNodeModel} from '@logicflow/core'
import {getShapeStyleFunction, getTextStyleFunction} from '../getShapeStyleUtil'

// 文本节点
class TextNewNode extends TextNode {
}

class TextNewModel extends TextNodeModel {
    getNodeStyle() {
        const style = super.getNodeStyle()
        const properties = this.getProperties()
        return getShapeStyleFunction(style, properties)
    }

    getTextStyle() {
        const style = super.getTextStyle()
        const properties = this.getProperties()
        if (properties.backgroundColor) {
            style.backgroundStyle = {
                fill: 'var(--color-neutral-2);',
            }
        }
        return getTextStyleFunction(style, {
            ...properties,
            fontColor: 'var(--color-text-1)'
        })
    }

    setAttributes() {
        super.setAttributes()
        if (!this.text.value) {
            this.text.value = 'text'
        }
    }
}

export default {
    type: 'pro-text',
    view: TextNewNode,
    model: TextNewModel
}
