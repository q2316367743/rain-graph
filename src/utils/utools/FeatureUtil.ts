export function setFeature(code: string, name: string) {
    utools.setFeature({
        code,
        cmds: [name],
        explain: '听雨图编辑器',
        platform: ['darwin', 'linux', 'win32'],
        icon: 'public/logo.png'
    });
}