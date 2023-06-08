import { LAYOUT, MOUSE_WHEEL_ACTION } from "../data/constants";

export interface SimpleMindMapConfig {
    // 是否只读
    readonly:                              boolean;
    // 布局
    layout:                                string;
    // 如果结构为鱼骨图，那么可以通过该选项控制倾斜角度
    fishboneDeg:                           number;
    // 主题
    theme:                                 string;
    // 主题配置，会和所选择的主题进行合并
    themeConfig:                           Record<string, any>;
    // 放大缩小的增量比例
    scaleRatio:                            number;
    // 最多显示几个标签
    maxTag:                                number;
    // 导出图片时的内边距
    exportPadding:                         number;
    // 展开收缩按钮尺寸
    expandBtnSize:                         number;
    // 节点里图片和文字的间距
    imgTextMargin:                         number;
    // 节点里各种文字信息的间距，如图标和文字的间距
    textContentMargin:                     number;
    // 多选节点时鼠标移动到边缘时的画布移动偏移量
    selectTranslateStep:                   number;
    // 多选节点时鼠标移动距边缘多少距离时开始偏移
    selectTranslateLimit:                  number;
    // 自定义节点备注内容显示
    customNoteContentShow:                 string;
    // 是否开启节点自由拖拽
    enableFreeDrag:                        boolean;
    // 水印配置
    watermarkConfig:                       WatermarkConfig;
    // 达到该宽度文本自动换行
    textAutoWrapWidth:                     number;
    // 自定义鼠标滚轮事件处理
    // 可以传一个函数，回调参数为事件对象
    customHandleMousewheel:                null;
    // 鼠标滚动的行为，如果customHandleMousewheel传了自定义函数，这个属性不生效
    mousewheelAction:                      MOUSE_WHEEL_ACTION;
    // 当mousewheelAction设为move时，可以通过该属性控制鼠标滚动一下视图移动的步长，单位px
    mousewheelMoveStep:                    number;
    // 默认插入的二级节点的文字
    defaultInsertSecondLevelNodeText:      string;
    // 默认插入的二级以下节点的文字
    defaultInsertBelowSecondLevelNodeText: string;
    // 展开收起按钮的颜色
    expandBtnStyle:                        ExpandBtnStyle;
    // 自定义展开收起按钮的图标
    expandBtnIcon:                         ExpandBtnIcon;
    // 是否只有当鼠标在画布内才响应快捷键事件
    enableShortcutOnlyWhenMouseInSvg:      boolean;
    // 是否开启节点动画过渡
    enableNodeTransitionMove:              boolean;
    // 如果开启节点动画过渡，可以通过该属性设置过渡的时间，单位ms
    nodeTransitionMoveDuration:            number;
    // 初始根节点的位置
    initRootNodePosition:                  string[];
    // 导出png、svg、pdf时的图形内边距
    exportPaddingX:                        number;
    exportPaddingY:                        number;
    // 节点文本编辑框的z-index
    nodeTextEditZIndex:                    number;
    // 节点备注浮层的z-index
    nodeNoteTooltipZIndex:                 number;
    // 是否在点击了画布外的区域时结束节点文本的编辑状态
    isEndNodeTextEditOnClickOuter:         boolean;
    // 最大历史记录数
    maxHistoryCount:                       number;
    // 是否一直显示节点的展开收起按钮，默认为鼠标移上去和激活时才显示
    alwaysShowExpandBtn:                   boolean;
    // 扩展节点可插入的图标
    iconList:                              any[];
    // 节点最大缓存数量
    maxNodeCacheCount:                     number;
    // 关联线默认文字
    defaultAssociativeLineText:            string;
}

export interface ExpandBtnIcon {
    open:  string;
    close: string;
}

export interface ExpandBtnStyle {
    color: string;
    fill:  string;
}


export interface WatermarkConfig {
    text:        string;
    lineSpacing: number;
    textSpacing: number;
    angle:       number;
    textStyle:   TextStyle;
}

export interface TextStyle {
    color:    string;
    opacity:  number;
    fontSize: number;
}
