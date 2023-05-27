import ImageNode from './ImageNode'


// 图片-用户节点
class UserNode extends ImageNode.view {
  getImageHref () {
    return '/image/user.png';
  }
}


export default {
  type: 'image-user',
  view: UserNode,
  model: ImageNode.model
}