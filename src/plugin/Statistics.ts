import axios from 'axios';


export default class Statistics {

    private readonly VIEW_ID = '';
    private readonly SHEET_ID = ""

    private readonly http;
    private token: string = '';
    private nickname: string = '未知用户';
    private expired: number = 0;

    constructor(url: string, token: string) {
        this.http = axios.create({
            baseURL: url,
            params: {
                viewId: this.VIEW_ID,
                fieldKey: "name"
            },
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            },
            method: 'POST'
        });
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
        return;
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
        await this.http({
            url: `/fusion/v1/datasheets/${this.SHEET_ID}/records`,
            data: {
                records: [{
                    fields: {
                        token: this.token,
                        '用户名': this.nickname,
                        "标签": tag
                    }
                }],
            }
        });

    }

}