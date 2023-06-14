import Constant from '@/global/Constant';
import axios from 'axios';


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
        await axios.post(Constant.statistics, {
            token: this.token,
            nickname: this.nickname,
            tag: tag,
            platform: window.rain.env
        });

    }

}