import {IObjectOptions} from "fabric/fabric-impl";

export * from './icon';

export type FabricWbMode = "selection" | "eraser" | "rectangle" | "diamond" | "triangle" | "circle" |
    "line" | "arrow" | "free-draw" | "text" | 'spray-brush';

export function getDefaultOption(): IObjectOptions {
    return {
        width: 100,
        height: 100,
        fill: "transparent",
        stroke: "#000000",
        padding: 4,
    }
}
