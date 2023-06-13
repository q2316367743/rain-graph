// 基础这想吐
export function getBaseLine() {
    return {
        "title": {
            "text": "听雨图编辑器",
            "subtext": "使用echarts实现听雨图编辑器",
            "left": "center"
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
                "type": "line"
            }
        ]
    }
}

export function getSmoothLine() {
    return {
        title: {
            text: "听雨图编辑器",
            subtext: "使用echarts实现听雨图编辑器",
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
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true
            }
        ]
    }
}

export function getAreaLine() {
    return {
        title: {
            text: "听雨图编辑器",
            subtext: "使用echarts实现听雨图编辑器",
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
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                areaStyle: {}
            }
        ]
    };
}

export function getStockLine() {
    return {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
            itemStyle: {
                color: 'var(--color-text-1)'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Email',
                type: 'line',
                stack: 'Total',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: 'Union Ads',
                type: 'line',
                stack: 'Total',
                data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
                name: 'Video Ads',
                type: 'line',
                stack: 'Total',
                data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
                name: 'Direct',
                type: 'line',
                stack: 'Total',
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
                name: 'Search Engine',
                type: 'line',
                stack: 'Total',
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        ]
    }
}

export function getStyleLine() {
    return {
        title: {
            text: "听雨图编辑器",
            subtext: "使用echarts实现听雨图编辑器",
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
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'line',
                symbol: 'triangle',
                symbolSize: 20,
                lineStyle: {
                    color: '#5470C6',
                    width: 4,
                    type: 'dashed'
                },
                itemStyle: {
                    borderWidth: 3,
                    borderColor: '#EE6666',
                    color: 'yellow'
                }
            }
        ]
    }
}
