export interface MindMapNode {
    data: Data;
    children: MindMapNode[];
}

export interface Data {

    /**
     * 文字
     */
    text: string;

    /**
     * 图片
     */
    image?: string;

    /**
     * 图片标题
     */
    imageTitle?: string;

    /**
     * 图片大小
     */
    imageSize?: ImageSize;

    /**
     * 图标
     */
    icon?: string[];

    /**
     * 标签
     */
    tag?: string[];

    /**
     * 超链接
     */
    hyperlink?: string;

    /**
     * 超链接标题
     */
    hyperlinkTitle?: string;

    /**
     * 备注
     */
    note?: string;

    /**
     * 概要
     */
    generalization?: Generalization;

    /**
     * 是否展开，默认展开
     */
    expand: boolean;
}

/**
 * 概要
 */
export interface Generalization {

    /**
     * 内容
     */
    text: string;
}

export interface ImageSize {
    width: number;
    height: number;
}