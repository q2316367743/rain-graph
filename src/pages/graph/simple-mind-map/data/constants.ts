//  标签颜色列表
export const tagColorList = [
    {
        color: 'rgb(77, 65, 0)',
        background: 'rgb(255, 244, 179)'
    },
    {
        color: 'rgb(0, 50, 77)',
        background: 'rgb(179, 229, 255)'
    },
    {
        color: 'rgb(77, 0, 73)',
        background: 'rgb(255, 179, 251)'
    },
    {
        color: 'rgb(57, 77, 0)',
        background: 'rgb(236, 255, 179)'
    },
    {
        color: 'rgb(0, 77, 47)',
        background: 'rgb(179, 255, 226)'
    }
]

//  主题列表
export const themeByLightList = [
    {
        name: '默认',
        value: 'default',
    },
    {
        name: '天清绿',
        value: 'skyGreen',
    },
    {
        name: '脑图经典2',
        value: 'classic2',
    },
    {
        name: '脑图经典3',
        value: 'classic3',
    },
    {
        name: '经典绿',
        value: 'classicGreen',
    },
    {
        name: '经典蓝',
        value: 'classicBlue',
    },
    {
        name: '天空蓝',
        value: 'blueSky',
    },
    {
        name: '脑残粉',
        value: 'brainImpairedPink',
    },
    {
        name: '泥土黄',
        value: 'earthYellow',
    },
    {
        name: '清新绿',
        value: 'freshGreen',
    },
    {
        name: '清新红',
        value: 'freshRed',
    },
    {
        name: '浪漫紫',
        value: 'romanticPurple',
    },
    {
        name: '粉红葡萄',
        value: 'pinkGrape',
    },
    {
        name: '薄荷',
        value: 'mint',
    },
    {
        name: '金色vip',
        value: 'gold',
    },
    {
        name: '活力橙',
        value: 'vitalityOrange',
    },
    {
        name: '绿叶',
        value: 'greenLeaf',
    },
    {
        name: '脑图经典4',
        value: 'classic4',
    },
    {
        name: '小黄人',
        value: 'minions',
    },
    {
        name: '简约黑',
        value: 'simpleBlack',
    },
    {
        name: '课程绿',
        value: 'courseGreen',
    },
    {
        name: '咖啡',
        value: 'coffee',
    },
    {
        name: '红色精神',
        value: 'redSpirit',
    },
    {
        name: '牛油果',
        value: 'avocado',
    },
    {
        name: '秋天',
        value: 'autumn',
    }
]

export const themeByDarkList = [
    {
        name: '暗色',
        value: 'dark',
    },
    {
        name: '暗色2',
        value: 'dark2',
    },
    {
        name: '脑图经典',
        value: 'classic',
    },
    {
        name: '黑色幽默',
        value: 'blackHumour',
    },
    {
        name: '深夜办公室',
        value: 'lateNightOffice',
    },
    {
        name: '黑金',
        value: 'blackGold',
    },
    {
        name: '橙汁',
        value: 'orangeJuice',
    }
]

export enum LAYOUT {
    LOGICAL_STRUCTURE = 'logicalStructure',
    MIND_MAP = 'mindMap',
    ORGANIZATION_STRUCTURE = 'organizationStructure',
    CATALOG_ORGANIZATION = 'catalogOrganization',
    TIMELINE = 'timeline',
    TIMELINE2 = 'timeline2',
    FISHBONE = 'fishbone'
}

// zoom（放大缩小）、move（上下移动）
export enum MOUSE_WHEEL_ACTION {
    ZOOM = 'zoom',
    MOVE = 'move'
}

// 常量
export const CONSTANTS = {
    CHANGE_THEME: 'changeTheme',
    SET_DATA: 'setData',
    TRANSFORM_TO_NORMAL_NODE: 'transformAllNodesToNormalNode',
    MODE: {
        READONLY: 'readonly',
        EDIT: 'edit'
    },
    DIR: {
        UP: 'up',
        LEFT: 'left',
        DOWN: 'down',
        RIGHT: 'right'
    },
    KEY_DIR: {
        LEFT: 'Left',
        UP: 'Up',
        RIGHT: 'Right',
        DOWN: 'Down'
    },
    SHAPE: {
        RECTANGLE: 'rectangle',
        DIAMOND: 'diamond',
        PARALLELOGRAM: 'parallelogram',
        ROUNDED_RECTANGLE: 'roundedRectangle',
        OCTAGONAL_RECTANGLE: 'octagonalRectangle',
        OUTER_TRIANGULAR_RECTANGLE: 'outerTriangularRectangle',
        INNER_TRIANGULAR_RECTANGLE: 'innerTriangularRectangle',
        ELLIPSE: 'ellipse',
        CIRCLE: 'circle'
    },
    MOUSE_WHEEL_ACTION: {
        ZOOM: 'zoom',
        MOVE: 'move'
    },
    INIT_ROOT_NODE_POSITION: {
        LEFT: 'left',
        TOP: 'top',
        RIGHT: 'right',
        BOTTOM: 'bottom',
        CENTER: 'center'
    },
    TIMELINE_DIR: {
        TOP: 'top',
        BOTTOM: 'bottom'
    }
}

export const initRootNodePositionMap = {
    [CONSTANTS.INIT_ROOT_NODE_POSITION.LEFT]: 0,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.TOP]: 0,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.RIGHT]: 1,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.BOTTOM]: 1,
    [CONSTANTS.INIT_ROOT_NODE_POSITION.CENTER]: 0.5,
}

//  布局结构列表
export const layoutList = [
    {
        name: '逻辑结构图',
        value: LAYOUT.LOGICAL_STRUCTURE,
    },
    {
        name: '思维导图',
        value: LAYOUT.MIND_MAP,
    },
    {
        name: '组织结构图',
        value: LAYOUT.ORGANIZATION_STRUCTURE,
    },
    {
        name: '目录组织图',
        value: LAYOUT.CATALOG_ORGANIZATION,
    },
    {
        name: '时间轴',
        value: LAYOUT.TIMELINE,
    },
    {
        name: '时间轴2',
        value: LAYOUT.TIMELINE2,
    },
    {
        name: '鱼骨图',
        value: LAYOUT.FISHBONE,
    }
]
export const layoutValueList = [
    LAYOUT.LOGICAL_STRUCTURE,
    LAYOUT.MIND_MAP,
    LAYOUT.CATALOG_ORGANIZATION,
    LAYOUT.ORGANIZATION_STRUCTURE,
    LAYOUT.TIMELINE,
    LAYOUT.TIMELINE2,
    LAYOUT.FISHBONE
];

// 全部的事件
export const events = [
    'node_active',
    'data_change',
    'view_data_change',
    'back_forward',
    'node_contextmenu',
    'node_click',
    'draw_click',
    'expand_btn_click',
    'svg_mousedown',
    'mouseup',
    'mode_change',
    'node_tree_render_end',
    'rich_text_selection_change',
    'transforming-dom-to-images',
    'generalization_node_contextmenu'
];

// 下载类型列表
export const downTypeList = [
    {
        name: '专有文件',
        type: 'smm',
        icon: 'iconwenjian',
        desc: '可用于导入'
    },
    {
        name: 'JSON',
        type: 'json',
        icon: 'iconjson',
        desc: '流行的数据交换格式，可用于导入'
    },
    {
        name: '图片',
        type: 'png',
        icon: 'iconPNG',
        desc: '适合查看分享'
    },
    {
        name: 'SVG',
        type: 'svg',
        icon: 'iconSVG',
        desc: '可缩放矢量图形'
    },
    {
        name: 'PDF',
        type: 'pdf',
        icon: 'iconpdf',
        desc: '适合打印'
    },
    {
        name: 'Markdown',
        type: 'md',
        icon: 'iconmarkdown',
        desc: '便于其他软件打开'
    }
]