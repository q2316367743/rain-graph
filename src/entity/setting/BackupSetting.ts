export default interface BackupSetting {

    localEnable: boolean;

    /**
     * 本地备份-路径
     */
    localPath: string;

    webDavEnable: boolean;

    /**
     * WebDAV路径
     */
    webDavUrl: string;

    /**
     * WebDAV用户名
     */
    webDavUsername: string;

    /**
     * WebDAV密码
     */
    webDavPassword: string;

}