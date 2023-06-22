export interface DiagramNode {
    name: string;
    icon: string;
}

export interface DiagramGroup {

    key: string;

    name: string;

    nodes: DiagramNode[];

}