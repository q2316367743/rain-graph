import MessageUtil from '@/utils/MessageUtil';
import {generateUUID} from "@/utils/BrowserUtil";
import {del, get, getMany, keys, set} from 'idb-keyval';

// 模拟utools声明

export interface DbDoc {
    _id: string,
    _rev?: string,
    [key: string]: any
}

export interface DbReturn {
    id: string,
    rev?: string,
    ok?: boolean,
    error?: boolean,
    name?: string,
    message?: string
}

function isMacOS(): boolean{
    return /macintosh|mac os x/i.test(navigator.userAgent);
}
function isWindows(): boolean{
    let agent = navigator.userAgent.toLowerCase();
    return agent.indexOf("win") >= 0 || agent.indexOf("wow") >= 0;
}

export const utools = {
    db: {
        promises: {
            /**
             * 创建/更新文档
             */
            async put(doc: DbDoc): Promise<DbReturn> {
                try {
                    await set(doc._id, doc)
                    return Promise.resolve({
                        id: doc._id,
                        rev: ''
                    });
                } catch (e) {
                    return Promise.resolve({
                        id: doc._id,
                        error: true,
                        message: `${e}`,
                        ok: false
                    });
                }
            },
            /**
              * 获取文档
              */
            get(id: string): Promise<DbDoc | undefined> {
                return get(id)
            },
            /**
              * 删除文档
              */
            async remove(id: string): Promise<DbReturn> {
                try {
                    await del(id);
                    return Promise.resolve({
                        id,
                        rev: ''
                    });
                } catch (e) {
                    return Promise.resolve({
                        id,
                        error: true,
                        message: `${e}`,
                        ok: false
                    });
                }

            },
            /**
              * 获取所有文档 可根据文档id前缀查找
              */
            async allDocs(key?: string): Promise<DbDoc[]> {
                let itemKeys = await keys();
                if (key) {
                    itemKeys = itemKeys.filter(itemKey => {
                        if (typeof itemKey === 'string') {
                            return itemKey.startsWith(key)
                        }
                        return false;
                    })
                }
                return getMany(itemKeys);
            },
            /**
              * 存储附件到新文档
              */
            postAttachment(): Promise<DbReturn> {
                return Promise.reject("Web不支持保存附件")
            },
            /**
              * 获取附件
              */
            getAttachment(): Promise<Uint8Array | null> {
                return Promise.reject("Web不支持获取附件")
            },
            /**
              * 获取附件类型
              */
            getAttachmentType(): Promise<string | null> {
                return Promise.reject("Web不支持获取附件类型")
            }
        }
    },
    getPath(): string {
        return '';
    },
    shellOpenExternal(url: string): void {
        window.open(url);
    },
    redirect() {
        MessageUtil.warning("web环境不支持utools");
        window.open("https://u.tools");
    },
    setFeature() {
        MessageUtil.warning("web环境不支持设置feature，请使用utools版本");
    },
    isDarkColors(): boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    onPluginEnter(callback: (action: { code: string, type: string, payload: any }) => void): void {
        document.addEventListener('load', () => callback({ code: 'application', type: '', payload: {} }));
    },
    showOpenDialog(): [] {
        MessageUtil.warning("web环境不支持打开文件操作，请使用utools版本");
        return [];
    },
    fetchUserPayments(): Promise<any[]> {
        return Promise.resolve([]);
    },
    getUser() {
        return { avatar: "", nickname: "web用户", type: "" };
    },
    fetchUserServerTemporaryToken(): Promise<{ token: string, expiredAt: number }> {
        let token = localStorage.getItem("token");
        if (!token) {
            token = generateUUID();
            localStorage.setItem("token", token);
        }
        return Promise.resolve({
            token,
            expiredAt: 999999999
        })
    },
    isDev(): boolean {
        return import.meta.env.DEV;
    },
    isMacOS,
    isWindows,
    isLinux(): boolean {
        return !isMacOS() && !isWindows();
    }

}