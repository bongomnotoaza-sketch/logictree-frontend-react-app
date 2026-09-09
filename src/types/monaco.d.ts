import type * as Monaco from "monaco-editor";

declare global {
  interface Window {
    monaco?: typeof Monaco;

    require?: {
      config: (options: {
        paths: Record<string, string>;
      }) => void;

      (
        modules: string[],
        callback: () => void
      ): void;
    };
  }
}

export {};