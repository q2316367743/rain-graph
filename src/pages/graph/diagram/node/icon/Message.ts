import IconNode from './IconNode'

// 左上角ICON为消息的节点
class MessageNode extends IconNode.view {
  getImageHref () {
    return '/image/message.png';
  }
}


export default {
  type: 'icon-message',
  view: MessageNode,
  model: IconNode.model
}