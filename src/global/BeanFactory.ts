import {useEventBus} from '@vueuse/core';
import Statistics from '@/plugin/Statistics';

export const useSaveEvent = useEventBus<void>('save');
export const useUndoEvent = useEventBus<void>('undo');
export const useSideEvent = useEventBus<void>('side');
export const useMapEvent = useEventBus<void>('map');

export const statistics = new Statistics()