import AtramentRecord from "./AtramentRecord";
import Option from "./Option";

export default interface Instance  {

    /**
     * 当前设置
     */
    option: Option;

    /**
     * 每个设置
     */
    strokes: Array<AtramentRecord>;

}