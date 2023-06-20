import {fabric} from 'fabric';
import {defaultNodeOption} from '@/pages/image/fabric/data/constant';
import {generateUUID} from "@/utils/BrowserUtil";

const svg: string = "<svg fill='var(--color-text-1)' data-v-3493b342=\"\" t=\"1650855811131\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"18499\" width=\"26\" height=\"26\"><path data-v-3493b342=\"\" d=\"M864 896H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h704a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32zM192 832h640V192H192v640z\" p-id=\"18500\"></path></svg>";

export default {
    id: "rect",
    component: (option?: any) => (new fabric.Rect({
        ...defaultNodeOption,
        ...option,
        fill: '#f57274',//填充的颜色
        stroke: "#000000",
        width: 200,
        height: 200,
        // @ts-ignore
        id: generateUUID(),
        name: '矩形',
    })),
    icon: svg
}
