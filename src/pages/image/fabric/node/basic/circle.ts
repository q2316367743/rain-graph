import {fabric} from 'fabric';
import {defaultNodeOption} from '@/pages/image/fabric/data/constant';
import {generateUUID} from "@/utils/BrowserUtil";

const icon: string = "<svg fill='var(--color-text-1)' data-v-3493b342=\"\" t=\"1650855860236\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"19440\" width=\"26\" height=\"26\"><path data-v-3493b342=\"\" d=\"M512 928C282.624 928 96 741.376 96 512S282.624 96 512 96s416 186.624 416 416-186.624 416-416 416z m0-768C317.92 160 160 317.92 160 512s157.92 352 352 352 352-157.92 352-352S706.08 160 512 160z\" p-id=\"19441\"></path></svg>";

export default {
    id: "circle",
    component: (option?: any) => (new fabric.Circle({
        ...defaultNodeOption,
        ...option,
        fill: '#57606b',//填充的颜色
        radius: 50,
        stroke: "#000000",
        // @ts-ignore
        id: generateUUID(),
        name: '圆形',
    })),
    icon: icon
}