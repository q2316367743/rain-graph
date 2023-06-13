import EchartsBase from "../domain/EchartsBase";
import EchartsSetting from "../domain/EchartsSetting";

export function renderByLine(
    base: EchartsBase,
    setting: EchartsSetting,
    items: any[][]
): any | null {
    if (items.length === 0) {
        return null;
    }
    let headers = items[0].slice(1).filter(e => e !== '');
    // 表头
    return {
        title: {
            text: base.title,
            subtext: base.subtitle,
            left: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            textStyle: {
                color: 'white'
            },
            bottom: '20',
        },
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
                    type: base.type,
                    name: e[0],
                    label: {
                        show: setting.labelShow,
                        position: "top",
                        distance: 10
                    }
                }
            })
    }
}