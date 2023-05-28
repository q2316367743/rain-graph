import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

export default {
    // 导出
    export: {
        mind: [ExportTypeEnum.HTML],
        atrament: [],
        bpmn: [ExportTypeEnum.PNG, ExportTypeEnum.XML],
        diagram: [ExportTypeEnum.PNG, ExportTypeEnum.XML],
    } as Record<GraphTypeEnum, ExportTypeEnum[]>,
    // 撤销、清空
    edit: {
        mind: [true, true],
        atrament: [false, true],
        bpmn: [true, true],
        diagram: [true, true]
    } as Record<GraphTypeEnum, Array<boolean>>,
    // 标题配置
    title: {
        mind: {
            title: '思维导图',
            color: '#c88077'
        },
        atrament: {
            title: '手绘图',
            color: '#a07c6a'
        },
        bpmn: {
            title: 'BPMN',
            color: '#ebab79'
        },
        diagram: {
            title: '流程图',
            color: '#a59866'
        }
    } as Record<GraphTypeEnum, {
        title: string;
        color: string;
    }>
}