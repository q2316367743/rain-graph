import { EChartsType } from 'echarts';
import BrowserUtil from "@/utils/BrowserUtil";
import MessageUtil from '@/utils/MessageUtil';

export function exportForJson(option: any) {
    BrowserUtil.download(
        JSON.stringify(option, null, 4),
        '图表.json',
        'application/json');
}

export function exportForPng(myChart: EChartsType) {
    var img = new Image();
    img.src = myChart.getDataURL({
        type: "png",
        pixelRatio: 1, //放大2倍
        backgroundColor: '#fff'
    });

    img.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        let ctx = canvas.getContext('2d');
        if (!ctx) {
            MessageUtil.error('画布创建失败！');
            return;
        }
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');

        let a = document.createElement('a');
        // 创建一个单击事件
        let event = new MouseEvent('click');
        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = '图片.png' || '下载图片名称';
        // 将生成的URL设置为a.href属性
        a.href = dataURL;
        // 触发a的单击事件
        a.dispatchEvent(event);
        MessageUtil.success("开始下载");
    };

}