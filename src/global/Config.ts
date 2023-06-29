import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";
import {DiagramSubType, MindMapSubType, WhiteBoardSubType} from "@/enumeration/GraphSubTypeEnum";

function renderGraph(path: string, target: string, name: string): {
    operate: string;
    additional: string
} {
    if (path === target + '/0') {
        return {
            operate: name,
            additional: '新建'
        };
    } else {
        return {
            operate: name,
            additional: '编辑'
        };
    }
}

export default {
    // 导出
    export: {
        mind: [ExportTypeEnum.HTML],
        diagram: [ExportTypeEnum.PNG, ExportTypeEnum.XML],
        "simple-mind-map": [ExportTypeEnum.JSON, ExportTypeEnum.SVG, ExportTypeEnum.PNG, ExportTypeEnum.PDF, ExportTypeEnum.MD]
    } as Record<GraphTypeEnum, ExportTypeEnum[]>,
    // 撤销、清空
    edit: {
        mind: [true, true],
        "simple-mind-map": [true, true],
        diagram: [true, true]
    } as Record<GraphTypeEnum, Array<boolean>>,
    // 标题配置
    title: {
        "mind-map": {
            title: '思维导图',
            color: '#c88077'
        },
        diagram: {
            title: '流程图',
            color: '#a59866'
        },
        echarts: {
            title: '可视化图表',
            color: '#e43a62'
        },
        "white-board": {
            title: '白板',
            color: '#409eff'
        }
    } as Record<GraphTypeEnum, {
        title: string;
        color: string;
    }>,
    routeToTag(path: string): {
        operate: string;
        additional: string
    } {
        if (path.startsWith("/graph/")) {
            path = path.substring(7);
            if (path.startsWith("mind")) {
                return renderGraph(path, 'mind', '简易思维导图');
            } else if (path.startsWith("simple-mind-map")) {
                return renderGraph(path, 'simple-mind-map', '完整思维导图');
            } else if (path.startsWith("diagram")) {
                return renderGraph(path, 'diagram', '流程图');
            } else if (path.startsWith("white-board")) {
                return renderGraph(path, 'white-board', '白板');
            }
        }
        return {
            operate: path,
            additional: ''
        };
    },
    subTitle(graphType: any, type: any) {
        if (graphType === GraphTypeEnum.MIND_MAP) {
            if (type === MindMapSubType.MIND_ELIXIR) {
                return "简易思维导图";
            }else if (type === MindMapSubType.SIMPLE_MIND_MAP) {
                return "完整思维导图"
            }
        }else if (graphType === GraphTypeEnum.DIAGRAM) {
            if (type === DiagramSubType.LOGIC_FLOW) {
                return "流程图"
            }
        } else if (graphType === GraphTypeEnum.WHITE_BOARD) {
            if (type === WhiteBoardSubType.TINY_WHITEBOARD) {
                return "白板"
            }
        }
    }
}
