// 描边颜色
export const strokeColorList = [
    '#000000',
    '#343a40',
    '#495057',
    '#c92a2a',
    '#a61e4d',
    '#862e9c',
    '#5f3dc4',
    '#364fc7',
    '#1864ab',
    '#0b7285',
    '#087f5b',
    '#2b8a3e',
    '#5c940d',
    '#e67700',
    '#d9480f'
]

// 填充颜色
export const fillColorList = [
    'transparent',
    '#ced4da',
    '#868e96',
    '#fa5252',
    '#e64980',
    '#be4bdb',
    '#7950f2',
    '#4c6ef5',
    '#228be6',
    '#15aabf',
    '#12b886',
    '#40c057',
    '#82c91e',
    '#fab005',
    '#fd7e14'
]


// 字体列表
export const fontFamilyList = [
    {
        name: '微软雅黑',
        value: '微软雅黑, Microsoft YaHei'
    },
    {
        name: '宋体',
        value: '宋体, SimSun, Songti SC'
    },
    {
        name: '楷体',
        value: '楷体, 楷体_GB2312, SimKai, STKaiti'
    },
    {
        name: '黑体',
        value: '黑体, SimHei, Heiti SC'
    },
    {
        name: '隶书',
        value: '隶书, SimLi'
    },
    {
        name: 'Andale Mono',
        value: 'andale mono'
    },
    {
        name: 'Arial',
        value: 'arial, helvetica, sans-serif'
    },
    {
        name: 'arialBlack',
        value: 'arial black, avant garde'
    },
    {
        name: 'Comic Sans Ms',
        value: 'comic sans ms'
    },
    {
        name: 'Impact',
        value: 'impact, chicago'
    },
    {
        name: 'Times New Roman',
        value: 'times new roman'
    },
    {
        name: 'Sans-Serif',
        value: 'sans-serif'
    },
    {
        name: 'serif',
        value: 'serif'
    }
]

// 字号
export const fontSizeList = [10, 12, 16, 18, 24, 32, 48].map(item => {
    return {
        name: item,
        value: item
    }
})