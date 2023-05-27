export default interface Option {

    /**
     * 线条粗细
     */
    weight: number;

    /**
     * 颜色
     */
    color: string;

    /**
     * 在模式之间切换：
     */
    mode: 'erase' | 'fill' | 'draw' | 'disabled';

    /**
     * 调整平滑 - 较高的值使绘图看起来更好，较低的值使绘图感觉更灵敏。0.85默认设置为。
     */
    smoothing: number;

    /**
     * 切换自适应描边，即根据绘图速度改变线宽以获得更自然的效果。true默认情况下。
     */
    adaptiveStroke: boolean;

}