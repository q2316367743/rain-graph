import MessageUtil from "@/utils/MessageUtil";

/**
 * 下载
 * @param data 内容
 * @param fileName 文件名
 * @param mineType 文件类型
 */
export function download(data: string | ArrayBuffer | Blob, fileName: string, mineType: string) {
    // 创建 blob
    let blob = data instanceof Blob ? data : new Blob([data], { type: mineType });
    // 创建 href 超链接，点击进行下载
    window.URL = window.URL || window.webkitURL;
    let href = URL.createObjectURL(blob);
    let downA = document.createElement("a");
    downA.href = href;
    downA.download = fileName;
    downA.click();
    // 销毁超连接
    window.URL.revokeObjectURL(href);
}

/**
 * 拷贝
 * @param content 内容
 * @param showMessage 显示消息，默认显示
 */
export function copy(content: string, showMessage: boolean = true) {
    // content为要复制的内容
    // 创建元素用于复制
    const ele = document.createElement('textarea');
    // 设置元素内容
    ele.value = content;
    // 将元素插入页面进行调用
    document.body.appendChild(ele);
    // 复制内容
    ele.select();
    // 将内容复制到剪贴板
    document.execCommand('copy');
    // 删除创建元素
    document.body.removeChild(ele);
    if (showMessage) {
        MessageUtil.success('已成功复制到剪切板');
    }
}

export function downloadByUrl(url: string, fileName?: string) {
    let downA = document.createElement("a");
    downA.href = url;
    let index = url.lastIndexOf("/");
    if (fileName) {
        downA.download = fileName;
    } else {
        downA.download = url.substring(index + 1, url.length);
    }
    downA.click();
}

/**
 * Uint8Array数组转字符串
 * @param uint8Array Uint8Array数组
 */
export function uint8ArrayToString(uint8Array: Uint8Array): string {
    let dataString = "";
    for (let i = 0; i < uint8Array.length; i++) {
        dataString += String.fromCharCode(uint8Array[i]);
    }
    return dataString

}

export function svg2png(svg: SVGSVGElement): Promise<string> {
    // 创建一个Image对象，用于保存生成的图片
    const img = new Image();
    // 创建一个Canvas元素
    const canvas = document.createElement('canvas');
    // 获取Canvas上下文对象
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return Promise.reject("创建canvas对象错误");
    }
    // 获取SVG的宽高
    const svgRect = svg.getBoundingClientRect();
    // 设置Canvas的宽高与SVG相同
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;
    // 创建一个新的Image对象，用于绘制SVG
    const svgImage = new Image();
    // 将SVG转为Base64编码的data URL
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;
    return new Promise<string>((resolve, reject) => {
        // 在Image对象中加载SVG
        svgImage.onload = () => {
            // 将SVG绘制到Canvas上  
            ctx.drawImage(svgImage, 0, 0);
            // 将Canvas转为图片
            resolve(canvas.toDataURL('image/png'));
        };
        svgImage.onerror = e => reject(e);
        // 加载SVG
        svgImage.src = svgUrl;
    })
}

export function downloadByBase64(base64: string) {
    var byteCharacters = atob(
        base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, "")
    );
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var blob = new Blob([byteArray], {
        type: undefined,
    });
    var aLink = document.createElement("a");
    aLink.download = "图片名称.png"; //这里写保存时的图片名称
    aLink.href = URL.createObjectURL(blob);
    aLink.click();
}

export async function openLocalFile() {
    let fileHandle: any;
    try {
        // @ts-ignore
        let [_fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: '',
                    accept: {
                        'application/json': ['.smm']
                    }
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false
        });
        if (!_fileHandle) {
            return
        }
        fileHandle = _fileHandle
        if (fileHandle.kind === 'directory') {
            MessageUtil.warning("请选择文件");
            return
        }
    } catch (error: any) {
        if (error.toString().includes('aborted')) {
            return
        }
        MessageUtil.warning('你的浏览器可能不支持哦')
    }
}
