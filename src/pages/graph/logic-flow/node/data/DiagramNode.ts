export interface DiagramNode {

    /**
     * 节点名字
     */
    name: string;

    /**
     * 节点图标
     */
    icon: string;

    /**
     * 节点提示
     */
    tip: string;
}

export interface DiagramGroup {

    key: string;

    name: string;

    nodes: DiagramNode[];

}