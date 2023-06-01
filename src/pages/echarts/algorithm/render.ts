import EchartsConfig from "../domain/EchartsConfig";
import EchartsTypeEnum from "../enumeration/EchartsTypeEnum";

export function renderData(
    type: EchartsTypeEnum,
    items: Array<Record<string, any>>,
    headers: Array<string>,
    config: EchartsConfig
): any {
    return {
        title: renderTitle(config),
        xAxis: {
            type: 'category',
            data: headers
        },
        yAxis: {
            type: 'value'
        },
        series: items.map(item => ({
            data: Object.values(item),
            type
        }))
    }
}

function renderTitle(config: EchartsConfig) {
    return {
        text: config.title,
        subtext: config.subtitle,
        left: "center",
    };
}