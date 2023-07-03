export interface MindOption {

    /**
     * 拖拽
     */
    draggable: boolean;

    /**
     * 右键菜单
     */
    contextMenu: boolean;

    /**
     * 工具栏
     */
    toolBar: boolean;

    /**
     * 节点菜单
     */
    nodeMenu: boolean;

    /**
     * 快捷键
     */
    keypress: boolean;

    /**
     * 语言
     * [zh_CN,zh_TW,en,ja,pt] waiting for PRs
     */
    locale: string;

    /**
     * 超出隐藏
     */
    overflowHidden: boolean;

    /**
     * 主链接样式
     * [1,2]
     */
    mainLinkStyle: number;
    mainNodeVerticalGap: number;
    mainNodeHorizontalGap: number;

    /**
     * 允许后退
     */
    allowUndo: boolean;

}

export function getDefaultOption(): MindOption {
    return {
        // 是否启用拖拽
        draggable: true, // default true
        // 右键菜单
        contextMenu: true, // default true
        // 工具栏
        toolBar: true, // default true
        // 节点菜单
        nodeMenu: true, // default true
        // 快捷键
        keypress: true, // default true
        // 语言
        locale: 'zh_CN', // [zh_CN,zh_TW,en,ja,pt] waiting for PRs
        // 超出隐藏
        overflowHidden: false, // default false
        // 主要链接样式
        mainLinkStyle: 2, // [1,2] default 1
        // 节点垂直高度
        mainNodeVerticalGap: 15, // default 25
        // 节点水平高度
        mainNodeHorizontalGap: 15, // default 65
        // 允许后退
        allowUndo: true
    };
}