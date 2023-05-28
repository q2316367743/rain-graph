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
    } as Record<GraphTypeEnum, Array<boolean>>
}