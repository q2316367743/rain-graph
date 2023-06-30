import GraphTypeEnum from '@/enumeration/GraphTypeEnum';
import {MindMapSubType, WhiteBoardSubType} from "@/enumeration/GraphSubTypeEnum";

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

    /**
     * 思维导图默认引擎
     */
    mindMapType: MindMapSubType;

    /**
     * 白板默认引擎
     */
    whiteBoardType: WhiteBoardSubType;

}
