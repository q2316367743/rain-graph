export default interface GraphRecord {

    id: string;

    name: string;

    createTime: Date | string;

    updateTime: Date | string;

    /**
     * 类型
     */
    type: string;

}
