import ExportTypeEnum from '@/enumeration/ExportTypeEnum';
import {useEventBus} from '@vueuse/core';

export const useSaveEvent = useEventBus<void>('save');
export const useUndoEvent = useEventBus<void>('undo');
export const useClearEvent = useEventBus<void>('clear');
export const useExportEvent = useEventBus<ExportTypeEnum>('export');