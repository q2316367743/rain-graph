import ImageNode from './ImageNode'

// 图片-设置节点
class SettingModel extends ImageNode.model {
  initNodeData(data: any) {
    super.initNodeData(data)
    this.width = 60
    this.height = 60
  }
}
class SettingNode extends ImageNode.view {
  getImageHref () {
    return '/image/setting.png';
  }
}


export default {
  type: 'image-setting',
  view: SettingNode,
  model: SettingModel,
}