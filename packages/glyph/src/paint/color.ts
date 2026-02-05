import type { Color, NamedColor, RGBColor } from "../types/index.js";

const NAMED_FG: Record<NamedColor, string> = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  blackBright: "\x1b[90m",
  redBright: "\x1b[91m",
  greenBright: "\x1b[92m",
  yellowBright: "\x1b[93m",
  blueBright: "\x1b[94m",
  magentaBright: "\x1b[95m",
  cyanBright: "\x1b[96m",
  whiteBright: "\x1b[97m",
};

const NAMED_BG: Record<NamedColor, string> = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
  blackBright: "\x1b[100m",
  redBright: "\x1b[101m",
  greenBright: "\x1b[102m",
  yellowBright: "\x1b[103m",
  blueBright: "\x1b[104m",
  magentaBright: "\x1b[105m",
  cyanBright: "\x1b[106m",
  whiteBright: "\x1b[107m",
};

function parseHex(hex: string): RGBColor {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

export function colorToFg(color: Color): string {
  if (typeof color === "string") {
    if (color.startsWith("#")) {
      const { r, g, b } = parseHex(color);
      return `\x1b[38;2;${r};${g};${b}m`;
    }
    return NAMED_FG[color as NamedColor] ?? "\x1b[39m";
  }
  if (typeof color === "number") {
    return `\x1b[38;5;${color}m`;
  }
  const { r, g, b } = color;
  return `\x1b[38;2;${r};${g};${b}m`;
}

export function colorToFgRaw(color: Color): [number, number, number] | null {
  if (typeof color === "string") {
    if (color.startsWith("#")) {
      const c = parseHex(color);
      return [c.r, c.g, c.b];
    }
    return null;
  }
  if (typeof color === "number") {
    return null;
  }
  return [color.r, color.g, color.b];
}

export function colorToBg(color: Color): string {
  if (typeof color === "string") {
    if (color.startsWith("#")) {
      const { r, g, b } = parseHex(color);
      return `\x1b[48;2;${r};${g};${b}m`;
    }
    return NAMED_BG[color as NamedColor] ?? "\x1b[49m";
  }
  if (typeof color === "number") {
    return `\x1b[48;5;${color}m`;
  }
  const { r, g, b } = color;
  return `\x1b[48;2;${r};${g};${b}m`;
}

export function colorsEqual(
  a: Color | undefined,
  b: Color | undefined,
): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a === "object" && typeof b === "object") {
    return a.r === b.r && a.g === b.g && a.b === b.b;
  }
  return false;
}
