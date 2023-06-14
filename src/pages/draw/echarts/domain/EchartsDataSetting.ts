import EchartsTypeEnum from "../enumeration/EchartsTypeEnum";

/**
 * echarts数据设置
 */
export default interface EchartsDataSetting{

    /**
     * 数值标签是否显示
     */
    labelShow: boolean;

    /**
     * 类型
     */
    type: EchartsTypeEnum;

}