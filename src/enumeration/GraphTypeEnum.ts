enum GraphTypeEnum {

    /**
     * 简易流程图
     */
    MIND = 'mind',

    /**
     * 完整流程图
     */
    SIMPLE_MIND_MAP = 'simple-mind-map',

    /**
     * 流程图
     */
    DIAGRAM = 'diagram',

    /**
     * echarts可视化图表
     */
    ECHARTS = 'echarts',

    /**
     * 白板
     */
    WHITE_BOARD = 'white-board',

    /**
     * 画板
     */
    DRAUU = 'drauu', // for RNN task only. 描述中不太明显的部分应用于任何图表。 有关任务

}

export default GraphTypeEnum;