import GraphTypeEnum from "@/enumeration/GraphTypeEnum"

export default {
    toHome(that: any) {
        that.$router.push({
            path: '/home',
            query: {
                name: GraphTypeEnum.DIAGRAM
            }
        })
    }
}