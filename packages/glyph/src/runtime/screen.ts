import { Terminal } from "./terminal.js";

export interface ScreenSize {
  columns: number;
  rows: number;
}

export function getScreenSize(terminal: Terminal): ScreenSize {
  return {
    columns: terminal.columns,
    rows: terminal.rows,
  };
}
