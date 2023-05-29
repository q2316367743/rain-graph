import { useMindStore } from "@/store/MindStore";
import { SimpleMindMapConfig } from "./domain/SimpleMindMapConfig";
import MindMap from "simple-mind-map";
import MindEngineEnum from "@/enumeration/MindEngineEnum";
import BrowserUtil from "@/utils/BrowserUtil";

//  思维导图
export default class SimpleMindMapWrap {

    private readonly config;
    private readonly mindMap: any;

    private id = '0';
    private _rev = undefined as string | undefined;

    /**
     * 初始化
     * @param config 配置
     * @param data 数据
     */
    constructor(el: string, config: Partial<SimpleMindMapConfig>, data: any) {
        this.config = config;
        this.mindMap = new MindMap({
            el: document.querySelector(el),
            data
        });
    }

    init(id: string, _rev?: string) {
        this.id = id,
        this._rev = _rev;
    }


    setTheme(theme: string) {
        this.mindMap.setTheme(theme);
    }

    setLayout(layout: string) {
        this.mindMap.setLayout(layout);
    }

    async save() {
        let id = await useMindStore().addMind(this.id);
        this.id = id;
        let res = await utools.db.promises.put({
            _id: '/mind/' + id,
            _rev: this._rev,
            value: {
                engine: MindEngineEnum.SIMPLE_MIND_MAP,
                config: this.config,
                record: this.mindMap.getData(false)
            }
        });
        if (res.error) {
            return Promise.reject(res.message || "新增失败");
        }
        return Promise.resolve();
    }

    saveAs(title: string) {
        BrowserUtil.download(JSON.stringify({
            engine: MindEngineEnum.SIMPLE_MIND_MAP,
            config: this.config,
            record: this.mindMap.getData(false)
        }), title + '.json', 'text/json');
    }

}