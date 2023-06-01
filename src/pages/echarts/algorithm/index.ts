import EchartsTypeEnum from "../enumeration/EchartsTypeEnum";
import * as exampleForLine from './exampleForLine';
import * as exampleForBar from './exampleForBar';

export * from './exportFor';

export function getExample(type: EchartsTypeEnum): any {
    switch (type) {
        case 'line':
            return exampleForLine.getBaseLine();
        case 'line-smooth':
            return exampleForLine.getSmoothLine();
        case 'line-area':
            return exampleForLine.getAreaLine();
        case 'line-stock':
            return exampleForLine.getStockLine();
        case 'line-style':
            return exampleForLine.getStyleLine();
        case 'bar':
            return exampleForBar.getBaseBar();
        default:
            return exampleForLine.getBaseLine();
    }
}