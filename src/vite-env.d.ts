/// <reference types="vite/client" />

declare module 'mind-elixir';
declare module 'atrament';
declare module '@mind-elixir/export-html';

interface Window {
    preload: {
        openFile: (path: string) => Promise<Buffer>,
        openFileToString: (path: string) => Promise<string>
    }
}