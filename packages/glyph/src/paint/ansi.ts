/**
 * ANSI escape code parser for text with embedded formatting.
 * 
 * Parses strings containing ANSI SGR (Select Graphic Rendition) codes
 * and returns an array of styled segments.
 */

import type { Color } from "../types/index.js";

export interface AnsiStyle {
  fg?: Color;
  bg?: Color;
  bold?: boolean;
  dim?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface StyledSegment {
  text: string;
  style: AnsiStyle;
}

// ANSI color code to named color mapping
const ANSI_FG_COLORS: Record<number, Color> = {
  30: "black",
  31: "red",
  32: "green",
  33: "yellow",
  34: "blue",
  35: "magenta",
  36: "cyan",
  37: "white",
  90: "blackBright",
  91: "redBright",
  92: "greenBright",
  93: "yellowBright",
  94: "blueBright",
  95: "magentaBright",
  96: "cyanBright",
  97: "whiteBright",
};

const ANSI_BG_COLORS: Record<number, Color> = {
  40: "black",
  41: "red",
  42: "green",
  43: "yellow",
  44: "blue",
  45: "magenta",
  46: "cyan",
  47: "white",
  100: "blackBright",
  101: "redBright",
  102: "greenBright",
  103: "yellowBright",
  104: "blueBright",
  105: "magentaBright",
  106: "cyanBright",
  107: "whiteBright",
};

/**
 * Parse ANSI SGR parameters and update the style object.
 */
function applySgrParams(params: number[], style: AnsiStyle): void {
  let i = 0;
  while (i < params.length) {
    const code = params[i]!;
    
    switch (code) {
      case 0: // Reset all
        style.fg = undefined;
        style.bg = undefined;
        style.bold = false;
        style.dim = false;
        style.italic = false;
        style.underline = false;
        break;
      case 1: // Bold
        style.bold = true;
        break;
      case 2: // Dim
        style.dim = true;
        break;
      case 3: // Italic
        style.italic = true;
        break;
      case 4: // Underline
        style.underline = true;
        break;
      case 22: // Neither bold nor dim
        style.bold = false;
        style.dim = false;
        break;
      case 23: // Not italic
        style.italic = false;
        break;
      case 24: // Not underline
        style.underline = false;
        break;
      case 39: // Default foreground
        style.fg = undefined;
        break;
      case 49: // Default background
        style.bg = undefined;
        break;
      case 38: // Extended foreground color
        if (params[i + 1] === 5 && params[i + 2] !== undefined) {
          // 256-color: \x1b[38;5;<n>m
          style.fg = params[i + 2];
          i += 2;
        } else if (params[i + 1] === 2 && params[i + 4] !== undefined) {
          // True color: \x1b[38;2;<r>;<g>;<b>m
          const r = params[i + 2] ?? 0;
          const g = params[i + 3] ?? 0;
          const b = params[i + 4] ?? 0;
          style.fg = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          i += 4;
        }
        break;
      case 48: // Extended background color
        if (params[i + 1] === 5 && params[i + 2] !== undefined) {
          // 256-color: \x1b[48;5;<n>m
          style.bg = params[i + 2];
          i += 2;
        } else if (params[i + 1] === 2 && params[i + 4] !== undefined) {
          // True color: \x1b[48;2;<r>;<g>;<b>m
          const r = params[i + 2] ?? 0;
          const g = params[i + 3] ?? 0;
          const b = params[i + 4] ?? 0;
          style.bg = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          i += 4;
        }
        break;
      default:
        // Standard foreground colors (30-37, 90-97)
        if (ANSI_FG_COLORS[code]) {
          style.fg = ANSI_FG_COLORS[code];
        }
        // Standard background colors (40-47, 100-107)
        else if (ANSI_BG_COLORS[code]) {
          style.bg = ANSI_BG_COLORS[code];
        }
        break;
    }
    i++;
  }
}

/**
 * Parse a string with ANSI escape codes into styled segments.
 * 
 * Handles:
 * - SGR codes: \x1b[<params>m (colors, bold, italic, etc.)
 * - Resets escape sequences to plain text
 * 
 * @param input String potentially containing ANSI escape codes
 * @returns Array of segments with text and associated style
  * @category Utilities
 */
export function parseAnsi(input: string): StyledSegment[] {
  const segments: StyledSegment[] = [];
  const currentStyle: AnsiStyle = {};
  let currentText = "";
  
  // Regex to match ANSI SGR sequences: ESC [ <params> m
  // Also matches common variant with just ESC [ m (implicit 0)
  const ansiRegex = /\x1b\[([0-9;]*)m/g;
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  
  while ((match = ansiRegex.exec(input)) !== null) {
    // Add text before this escape sequence
    const textBefore = input.slice(lastIndex, match.index);
    if (textBefore) {
      currentText += textBefore;
    }
    
    // Flush current segment if we have text
    if (currentText) {
      segments.push({
        text: currentText,
        style: { ...currentStyle },
      });
      currentText = "";
    }
    
    // Parse and apply the SGR parameters
    const paramStr = match[1] || "0"; // Empty means reset
    const params = paramStr.split(";").map(p => parseInt(p, 10) || 0);
    applySgrParams(params, currentStyle);
    
    lastIndex = ansiRegex.lastIndex;
  }
  
  // Add any remaining text
  const remainingText = input.slice(lastIndex);
  if (remainingText) {
    currentText += remainingText;
  }
  
  if (currentText) {
    segments.push({
      text: currentText,
      style: { ...currentStyle },
    });
  }
  
  return segments;
}

/**
 * Strip all ANSI escape codes from a string.
 * Useful for measuring visible width.
  * @category Utilities
 */
export function stripAnsi(input: string): string {
  // eslint-disable-next-line no-control-regex
  return input.replace(/\x1b\[[0-9;]*m/g, "");
}

/**
 * Calculate the visible width of a string, excluding ANSI codes.
 */
export function ansiWidth(input: string): number {
  // Use string-width on the stripped string
  // This is imported in the painter, so we just strip here
  return stripAnsi(input).length;
}
