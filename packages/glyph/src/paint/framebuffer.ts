import type { Color } from "../types/index.js";
import { colorsEqual } from "./color.js";

export interface Cell {
  ch: string;
  fg?: Color;
  bg?: Color;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export class Framebuffer {
  width: number;
  height: number;
  cells: Cell[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
    this.clear();
  }

  clear(): void {
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = { ch: " " };
    }
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
    this.clear();
  }

  get(x: number, y: number): Cell | undefined {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return undefined;
    return this.cells[y * this.width + x];
  }

  set(x: number, y: number, cell: Cell): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.cells[y * this.width + x] = cell;
  }

  setChar(
    x: number,
    y: number,
    ch: string,
    fg?: Color,
    bg?: Color,
    bold?: boolean,
    dim?: boolean,
    italic?: boolean,
    underline?: boolean,
  ): void {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    this.cells[y * this.width + x] = { ch, fg, bg, bold, dim, italic, underline };
  }

  fillRect(
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
    fg?: Color,
    bg?: Color,
  ): void {
    for (let row = y; row < y + h; row++) {
      for (let col = x; col < x + w; col++) {
        this.setChar(col, row, ch, fg, bg);
      }
    }
  }

  clone(): Framebuffer {
    const fb = new Framebuffer(this.width, this.height);
    for (let i = 0; i < this.cells.length; i++) {
      const c = this.cells[i]!;
      fb.cells[i] = { ...c };
    }
    return fb;
  }

  cellsEqual(a: Cell, b: Cell): boolean {
    return (
      a.ch === b.ch &&
      colorsEqual(a.fg, b.fg) &&
      colorsEqual(a.bg, b.bg) &&
      (a.bold ?? false) === (b.bold ?? false) &&
      (a.dim ?? false) === (b.dim ?? false) &&
      (a.italic ?? false) === (b.italic ?? false) &&
      (a.underline ?? false) === (b.underline ?? false)
    );
  }
}
