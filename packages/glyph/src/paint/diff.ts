import type { Cell } from "./framebuffer.js";
import { Framebuffer } from "./framebuffer.js";
import { colorToFg, colorToBg } from "./color.js";

const ESC = "\x1b";
const CSI = `${ESC}[`;

function moveCursor(x: number, y: number): string {
  return `${CSI}${y + 1};${x + 1}H`;
}

function buildSGR(cell: Cell): string {
  let seq = `${CSI}0m`;
  if (cell.bold) seq += `${CSI}1m`;
  if (cell.dim) seq += `${CSI}2m`;
  if (cell.italic) seq += `${CSI}3m`;
  if (cell.underline) seq += `${CSI}4m`;
  if (cell.fg != null) seq += colorToFg(cell.fg);
  if (cell.bg != null) seq += colorToBg(cell.bg);
  return seq;
}

export function diffFramebuffers(
  prev: Framebuffer,
  next: Framebuffer,
  fullRedraw: boolean,
): string {
  let out = "";
  let lastX = -1;
  let lastY = -1;
  let lastSGR = "";

  for (let y = 0; y < next.height; y++) {
    for (let x = 0; x < next.width; x++) {
      const nc = next.get(x, y)!;
      if (!fullRedraw) {
        const pc = prev.get(x, y);
        if (pc && next.cellsEqual(nc, pc)) continue;
      }

      if (lastY !== y || lastX !== x) {
        out += moveCursor(x, y);
      }

      const sgr = buildSGR(nc);
      if (sgr !== lastSGR) {
        out += sgr;
        lastSGR = sgr;
      }

      out += nc.ch;
      lastX = x + 1;
      lastY = y;
    }
  }

  if (out.length > 0) {
    out += `${CSI}0m`;
  }

  return out;
}
