import GraphTypeEnum from '@/enumeration/GraphTypeEnum';

export default interface Setting {

    /**
     * 默认视图
     */
    defaultView: GraphTypeEnum;

    /**
     * 显示的视图
     */
    showViews: GraphTypeEnum[];

    /**
     * drauu是否可以附加到diagram
     */
    drauuAppendToDiagram: boolean;

}