import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import NotificationUtil from "@/utils/NotificationUtil";
import versionMap from "@/components/version-manage/manage";

export default async function versionManage() {
    const versionWrap = await utools.db.promises.get(LocalNameEnum.VERSION)
    if (versionWrap) {
        if (Constant.version !== versionWrap.value) {
            NotificationUtil.success("版本更新到：" + Constant.version + "，请前往插件详情页查看更新日志", "版本更新");
            await utools.db.promises.put({
                _id: LocalNameEnum.VERSION,
                _rev: versionWrap._rev,
                value: Constant.version
            });
            // 判断版本更新
            let func = versionMap.get(Constant.version);
            if (func) {
                await func()
            }
        }
    } else {
        NotificationUtil.success("欢迎使用听雨图编辑器", "欢迎");
        utools.db.promises.put({
            _id: LocalNameEnum.VERSION,
            value: Constant.version
        });
    }
}

