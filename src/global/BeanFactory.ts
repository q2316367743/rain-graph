import ExportTypeEnum from '@/enumeration/ExportTypeEnum';
import {useEventBus} from '@vueuse/core';

export const useSaveEvent = useEventBus<void>('save');
export const useSaveAsEvent = useEventBus<void>('save-as');
export const useUndoEvent = useEventBus<void>('undo');
export const useClearEvent = useEventBus<void>('clear');
export const useExportEvent = useEventBus<ExportTypeEnum>('export');