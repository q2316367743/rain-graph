import ImageNode from './ImageNode'

// 云形状的图片节点
class CloudNode extends ImageNode.view {
  getImageHref () {
    return '/image/cloud.png';
  }
}


export default {
  type: 'image-cloud',
  view: CloudNode,
  model: ImageNode.model
}