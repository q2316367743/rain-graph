import ExportTypeEnum from "@/enumeration/ExportTypeEnum";
import GraphTypeEnum from "@/enumeration/GraphTypeEnum";

function renderGraph(path: string, target: string, name: string): string {
    if (path === target + '/0') {
        return '新建' + name;
    } else {
        return '编辑' + name;
    }
}

export default {
    // 导出
    export: {
        mind: [ExportTypeEnum.HTML],
        diagram: [ExportTypeEnum.PNG, ExportTypeEnum.XML],
        "simple-mind-map": [ExportTypeEnum.JSON, ExportTypeEnum.SVG, ExportTypeEnum.PNG, ExportTypeEnum.PDF, ExportTypeEnum.MD]
    } as Record<GraphTypeEnum, ExportTypeEnum[]>,
    // 撤销、清空
    edit: {
        mind: [true, true],
        "simple-mind-map": [true, true],
        diagram: [true, true]
    } as Record<GraphTypeEnum, Array<boolean>>,
    // 标题配置
    title: {
        mind: {
            title: '简易思维导图',
            color: '#c88077'
        },
        "simple-mind-map": {
            title: '完整思维导图',
            color: '#c88077'
        },
        diagram: {
            title: '流程图',
            color: '#a59866'
        },
        echarts: {
            title: '可视化图表',
            color: '#e43a62'
        },
        "white-board": {
            title: '白板',
            color: '#409eff'
        }
    } as Record<GraphTypeEnum, {
        title: string;
        color: string;
    }>,
    routeToTag(path: string): string {
        if (path.startsWith("/setting/")) {
            return '设置'
        }
        switch (path) {
            case '/home':
                return '首页';
            case '/more/recommend':
                return '推荐';
            case '/more/vip':
                return '高级版';
            case '/more/about':
                return '关于';
            case '/apps/drauu':
                return '使用画板';
            case '/apps/echarts':
                return '使用可视化图表'
            case '/image/cropper':
                return '使用图片剪切'
        }
        if (path.startsWith("/graph/")) {
            path = path.substring(7);
            if (path.startsWith("mind")) {
                return renderGraph(path, 'mind', '简易思维导图');
            } else if (path.startsWith("simple-mind-map")) {
                return renderGraph(path, 'simple-mind-map', '完整思维导图');
            } else if (path.startsWith("diagram")) {
                return renderGraph(path, 'diagram', '流程图');
            } else if (path.startsWith("white-board")) {
                return renderGraph(path, 'white-board', '白板');
            }
        }
        return '未知';
    }
}