import {useEventBus} from '@vueuse/core';

export const useSaveEvent = useEventBus<void>('save');