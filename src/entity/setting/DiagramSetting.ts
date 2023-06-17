import { EdgeType, KeyboardDef, OverlapMode } from "@logicflow/core";
import { BackgroundConfig } from "@logicflow/core/types/view/overlay/BackgroundOverlay";
import { GridOptions } from "@logicflow/core/types/view/overlay/Grid";

export default interface DiagramSetting {

    /**
     * 背景图
     */
    background: false | BackgroundConfig;

    /**
     * 网格
     */
    grid: boolean | GridOptions;

    /**
     * 键盘快捷操作
     */
    keyboard: KeyboardDef;

    /**
     * 默认边类型
     */
    edgeType: EdgeType;

    /**
     * 是否开启对齐线，默认开启
     */
    snapline: boolean;

    /**
     * 是否开启历史记录功能，默认开启
     */
    history: boolean;

    /**
     * 是否开启局部渲染，默认不开启
     */
    partial: boolean;

    /**
     * 表示节点在上，边在下，点击元素时选择元素显示在最顶部。
     * 表示安装元素创建顺序排序，点击元素也不会将其置顶。要置顶需要调用置顶API。
     */
    overlapMode: OverlapMode;

    /**
     * 控制是否开启动画
     * false: 关闭所有动画
     * true: 开启所有动画
     * AnimationConfig: 配置部分动画开启
     */
    animation: boolean;

}