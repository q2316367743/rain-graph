import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

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
        mind: {
            title: '简易思维导图',
            color: '#c88077'
        },
        "simple-mind-map": {
            title: '完整思维导图',
            color: '#c88077'
        },
        diagram: {
            title: '流程图',
            color: '#a59866'
        },
        echarts: {
            title: '可视化图表',
            color: '#e43a62'
        }
    } as Record<GraphTypeEnum, {
        title: string;
        color: string;
    }>
}