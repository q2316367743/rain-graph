import Handsontable from 'handsontable';
import EchartsBase from '../domain/EchartsBase';
import EchartsTypeEnum from '../enumeration/EchartsTypeEnum';
import EchartsSetting from '../domain/EchartsSetting';

export function getDefaultData(): Handsontable.GridSettings {
    return {
        data: [
            ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日", "", "", "", ""],
            ["消费", "15", "21", "18", "23", "16", "29", "12", "", "", "", ""],
            ["支出", "25", "11", "28", "13", "26", "19", "22", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", "", "", ""]
        ],  //对象数组格式的表格数据
        rowHeaders: true, //是否显示行表头
        colHeaders: true, //是否显示列表头
        // contextMenu: true,  //显示默认右键菜单
        contextMenu: ['row_above', 'row_below', 'remove_row', 'clear_column', 'undo', 'redo', 'copy', 'cut'], //自定义选项右键菜单
        height: "auto", //表格高度
        rowHeights: "30px", //设置行高
        colWidths: "100px", //设置列宽
        className: "htCenter htMiddle", // 水平垂直居中
        //fixedRowsTop: 2,     //固定两行excel的冻结
        //fixedColumnsLeft: 3, //固定两列  固定行列会影响表格排版
        manualColumnMove: false, //列可拖动
        manualRowMove: false, //行可拖动
        manualColumnResize: true, //列可拖拽 调大小
        manualRowResize: true, //行可拖拽 调大小
        autoColumnSize: false, //当值为true且列宽未设置时，自适应列大小
        columnSorting: false, // 排序
        copyable: true, // 允许键盘复制
        licenseKey: "non-commercial-and-evaluation", //设置许可
        language: "zh-CN",  //设置语言
        // 添加事件
    };
}

export function getDefaultBase(): EchartsBase {
    return {
        title: '',
        subtitle: '',
        type: 'line' as EchartsTypeEnum
    }
}

export function getDefaultSetting(): EchartsSetting {
    return {
        labelShow: false
    }
}