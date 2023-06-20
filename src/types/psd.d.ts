declare module 'psd.js' {
    class PSDTree{
        /**
         * get the root node from anywhere in the tree
         */
        root(): any

        /**
         * is this the root node?
         */
        isRoot(): boolean

        /**
         * get all immediate children of the node
         */
        children(): Array<any>

        /**
         * does this node have any children?
         */
        hasChildren(): boolean

        /**
         * opposite of hasChildren()
         */
        childless():boolean;

        /**
         * get all ancestors in the path of this node (excluding the root)
         */
        ancestors(): any;

        /**
         * get all sibling tree nodes including the current one (e.g. all layers in a folder)
         */
        siblings(): any

        /**
         * gets the sibling immediately following the current node
         */
        nextSibling(): any;

        /**
         * gets the sibling immediately before the current node
         */
        prevSibling(): any;

        /**
         * does this node have any siblings?
         */
        hasSiblings(): any;

        /**
         * opposite of hasSiblings()
         */
        onlyChild(): any

        /**
         * get all descendant nodes not including the current
         */
        descendants(): Array<any>;

        /**
         * same as descendants but starts with the current node
         */
        subtree(): PSDTree

        /**
         * calculate the depth of the current node (root node is 0)
         */
        depth(): number

        /**
         * gets the path to the current node
         */
        path(): string
    }
    export default class PSD {
        constructor(data: Uint8Array);
        parse();
        parseHeader();
        parseResources();
        parseLayerMask();
        parseImage();
        tree(): PSDTree;
        image: {
            file: {
                data: Uint8Array,
                pos: number
            },
            header: {
                channels: number,
                depth: number,
                height: number,
                mode: number,
                sig: string,
                width: number
            },
            toPng(): any;
            saveAsPng(fileName: string): Promise<void>
        }

        static fromURL(url: string): Promise<PSD>;
        static fromEvent(evt: Event): Promise<PSD>;
    }
}