/// <reference types="vite/client" />

declare module 'mind-elixir';
declare module '@mind-elixir/export-html';
declare module 'simple-mind-map';
declare module 'simple-mind-map/src/MiniMap.js';
declare module 'simple-mind-map/src/Watermark.js';
declare module 'simple-mind-map/src/Drag.js';
declare module 'simple-mind-map/src/KeyboardNavigation.js';
declare module 'simple-mind-map/src/Export.js';
declare module 'simple-mind-map/src/Select.js';
declare module 'simple-mind-map/src/AssociativeLine.js';
declare module 'tiny-whiteboard';

interface Window {
    preload: {
        openFile: (path: string) => Promise<Buffer>,
        openFileToString: (path: string) => Promise<string>
    },
    api: {
        backup: {
            listBackup(path: string): Promise<string[]>,
            writeBackup(path: string, name: string, file: string, content: string): Promise<void>,
            removeBackup(path: string, name: string): Promise<void>,
        }
    }
}

declare var rain = {
    env: string
}