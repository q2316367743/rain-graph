import ExportTypeEnum from "@/enumeration/ExportTypeEnum";

export default {
    export: {
        mind: [ExportTypeEnum.HTML],
        atrament: [],
        bpmn: [ExportTypeEnum.PNG, ExportTypeEnum.XML]
    } as Record<string, ExportTypeEnum[]>
}