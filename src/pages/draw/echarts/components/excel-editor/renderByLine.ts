import EchartsDataSetting from "../../domain/EchartsDataSetting";

export function renderByLine(
    setting: EchartsDataSetting,
    items: any[][]
): any | null {
    if (items.length === 0) {
        return null;
    }
    let headers = items[0].slice(1).filter(e => e !== '');
    // 表头
    return {
        xAxis: {
            "type": "category",
            "data": headers
        },
        yAxis: {
            "type": "value"
        },
        series: items.splice(1)
            .filter(e => e[0] !== '')
            .map(e => {
                return {
                    data: e.splice(1, headers.length),
                    type: setting.type,
                    name: e[0],
                    label: {
                        show: setting.labelShow,
                        position: "top",
                        distance: 10
                    },
                    smooth: setting.smooth
                }
            })
    }
}