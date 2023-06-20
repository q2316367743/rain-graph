import LocalNameEnum from '@/enumeration/LocalNameEnum';
import Constant from '@/global/Constant';
import axios from 'axios';
import {utools} from "@/plugin/utools";


export default class Statistics {

    private token: string = '';
    private nickname: string = '未知用户';
    private expired: number = 0;

    constructor() {
    }

    init() {
        let user = utools.getUser();
        if (user) {
            this.nickname = user.nickname;
        }
    }

    /**
     * 插件打开
     */
    async open() {
        await this.access("第一次进入");
    }

    /**
     * 访问某个标签
     * @param tag 标签
     */
    async access(tag: string) {
        if(utools.isDev()) {
            return;
        }
        let privacy = await utools.db.promises.get(LocalNameEnum.PRIVACY);
        if (privacy) {
            if (!privacy.value) {
                return;
            }
        }
        let now = new Date();
        console.debug("访问：" + tag);
        if (this.token === '') {
            const res = await utools.fetchUserServerTemporaryToken();
            this.token = res.token;
            this.expired = res.expiredAt + now.getTime();
        }
        if (now.getTime() > this.expired) {
            // token过期，重新获取token
            const res = await utools.fetchUserServerTemporaryToken();
            this.token = res.token;
            this.expired = res.expiredAt + now.getTime();
        }
        let system: string;
        if (utools.isWindows()) {
            system = "Windows";
        }else if (utools.isMacOS()) {
            system = "MacOS"
        }else if (utools.isLinux()){
            system = "Linux"
        }else {
            system = navigator.userAgent;
        }
        await axios.post(`${Constant.statistics}/statistics/add?id=${Constant.uid}`, {
            token: this.token,
            nickname: this.nickname,
            tag: tag,
            platform: window.rain.env,
            system
        });

    }

}