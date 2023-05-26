import { Input, InputPassword, Modal } from "@arco-design/web-vue";
import { h, VNode } from "vue";
import Optional from "@/utils/Optional";

export default {

    confirm(content: string, title: string, config: {
        confirmButtonText: string,
        cancelButtonText: string
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Modal.confirm({
                content,
                title,
                draggable: true,
                okText: config.confirmButtonText,
                cancelText: config.cancelButtonText,
                onOk: () => {
                    resolve();
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    alert(content: string | VNode, title: string | null, config?: {
        confirmButtonText?: string,
        cancelButtonText?: string,
        width?: number
    }): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            Modal.confirm({
                content: typeof content === 'string' ? content : () => content,
                title: Optional.ofNullable(title).orElse("警告"),
                draggable: true,
                okText: Optional.ofNullable(config).map(e => e?.confirmButtonText).orElse('确定'),
                cancelText: Optional.ofNullable(config).map(e => e?.cancelButtonText).orElse('取消'),
                width: Optional.ofNullable(config).attr('width').orElse(undefined),
                onOk: () => {
                    resolve();
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    },

    prompt(content: string, title: string, config: {
        confirmButtonText?: string,
        cancelButtonText?: string,
        inputPattern?: RegExp,
        inputErrorMessage?: string,
        inputValue?: string
    }): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let value = Optional.ofNullable(config.inputValue).orElse("") as string;
            const onInput = (e: string) => {
                value = e;
            }
            Modal.confirm({
                content: () => h('div', { class: 'es-prompt' }, [
                    h('div', {}, content),
                    // @ts-ignore
                    h(Input, {
                        type: 'text',
                        onInput,
                        "default-value": config.inputValue,
                        style: 'margin-top: 8px;',
                        onVnodeMounted: (e: VNode) => {
                            (e.el as HTMLInputElement)
                                .getElementsByTagName("input")
                                .item(0)!
                                .focus();
                        }
                    })
                ]),
                title,
                draggable: true,
                okText: config.confirmButtonText,
                cancelText: config.cancelButtonText,
                onOk: () => {
                    resolve(value);
                },
                onCancel: () => {
                    if (reject) {
                        reject('cancel');
                    }
                },
                onClose: () => {
                    if (reject) {
                        reject('close');
                    }
                }
            })
        })
    },

    password(content: string, title: string, config: {
        confirmButtonText?: string,
        cancelButtonText?: string
    }): Promise<{
        username: string;
        password: string;
    }> {
        return new Promise<{
            username: string;
            password: string;
        }>((resolve, reject) => {
            let value = {
                username: '',
                password: ''
            };
            const onUsernameInput = (e: string) => {
                value.username = e;
            }
            const onPasswordInput = (e: string) => {
                value.username = e;
            }
            Modal.confirm({
                content: () => h('div', { class: 'es-prompt' }, [
                    h('div', {}, content),
                    // @ts-ignore
                    h(Input, {
                        type: 'text',
                        onInput: onUsernameInput,
                        style: 'margin-top: 8px;',
                        onVnodeMounted: (e: VNode) => {
                            (e.el as HTMLInputElement)
                                .getElementsByTagName("input")
                                .item(0)!
                                .focus();
                        }
                    }),
                    h(InputPassword, {
                        type: 'text',
                        onInput: onPasswordInput,
                        style: 'margin-top: 8px;'
                    })
                ]),
                title: '提示',
                draggable: true,
                okText: config.confirmButtonText,
                cancelText: config.cancelButtonText,
                onOk: () => {
                    resolve(value);
                },
                onCancel: () => {
                    reject('cancel');
                },
                onClose: () => {
                    reject('close');
                }
            })
        })
    }

}