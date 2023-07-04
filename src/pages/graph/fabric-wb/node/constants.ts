import {IObjectOptions} from "fabric/fabric-impl";

export type FabricWbMode = "selection" | "eraser" | "rectangle" | "diamond" | "triangle" | "circle" |
    "line" | "arrow" | "free-draw" | "text";

export function getDefaultOption(): IObjectOptions {
    return {
        width: 100,
        height: 100,
        fill: "transparent",
        stroke: "#000000",
        borderColor: "#b4b2ed",
        borderScaleFactor: 1,
        cornerColor: "#b4b2ed",
        cornerStyle: 'circle',
        padding: 4,
    }
}
