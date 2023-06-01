import * as example from './example';
import EchartsTypeEnum from "../enumeration/EchartsTypeEnum";

export function getExample(type: EchartsTypeEnum): any {
    switch (type) {
        case 'line':
            return example.getBaseLine();
        case 'bar':
            return example.getBaseBar();
        default:
            return example.getBaseLine();
    }
}