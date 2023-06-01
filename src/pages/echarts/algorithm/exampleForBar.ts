// 基础柱状图
export function getBaseBar() {
    return {
        title: {
            text: "听雨图编辑器",
            subtext: "使用echarts实现听雨图编辑器",
            left: "center"
        },
        "xAxis": {
            "type": "category",
            "data": [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ]
        },
        "yAxis": {
            "type": "value"
        },
        "series": [
            {
                "data": [
                    111,
                    222,
                    333,
                    444,
                    123,
                    324,
                    "213"
                ],
                "type": "bar"
            }
        ]
    }
}