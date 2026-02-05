import stringWidth from "string-width";
import { MeasureMode } from "yoga-layout";
import type { WrapMode } from "../types/index.js";

export function measureText(
  text: string,
  maxWidth: number,
  widthMode: MeasureMode,
  wrapMode: WrapMode,
): { width: number; height: number } {
  if (text.length === 0) {
    return { width: 0, height: 0 };
  }

  const lines = text.split("\n");

  if (widthMode === MeasureMode.Undefined || wrapMode === "none") {
    // No constraint: measure as-is
    let maxW = 0;
    for (const line of lines) {
      const w = stringWidth(line);
      if (w > maxW) maxW = w;
    }
    return { width: maxW, height: lines.length };
  }

  const availWidth = Math.max(1, Math.floor(maxWidth));
  const wrappedLines = wrapLines(lines, availWidth, wrapMode);

  let maxW = 0;
  for (const line of wrappedLines) {
    const w = stringWidth(line);
    if (w > maxW) maxW = w;
  }

  return { width: maxW, height: wrappedLines.length };
}

export function wrapLines(
  lines: string[],
  maxWidth: number,
  wrapMode: WrapMode,
): string[] {
  const result: string[] = [];

  for (const line of lines) {
    const lineWidth = stringWidth(line);

    if (lineWidth <= maxWidth) {
      result.push(line);
      continue;
    }

    if (wrapMode === "truncate") {
      result.push(truncateLine(line, maxWidth));
      continue;
    }

    if (wrapMode === "ellipsis") {
      result.push(truncateWithEllipsis(line, maxWidth));
      continue;
    }

    // wrap mode
    const wrapped = wordWrap(line, maxWidth);
    result.push(...wrapped);
  }

  return result;
}

function truncateLine(text: string, maxWidth: number): string {
  let result = "";
  let width = 0;
  for (const char of text) {
    const charWidth = stringWidth(char);
    if (width + charWidth > maxWidth) break;
    result += char;
    width += charWidth;
  }
  return result;
}

function truncateWithEllipsis(text: string, maxWidth: number): string {
  if (maxWidth <= 1) {
    return maxWidth === 1 ? "…" : "";
  }
  const truncated = truncateLine(text, maxWidth - 1);
  if (stringWidth(truncated) < stringWidth(text)) {
    return truncated + "…";
  }
  return text;
}

function wordWrap(text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let currentLine = "";
  let currentWidth = 0;

  for (const char of text) {
    const charWidth = stringWidth(char);
    if (currentWidth + charWidth > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = "";
      currentWidth = 0;
    }
    currentLine += char;
    currentWidth += charWidth;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines.length > 0 ? lines : [""];
}
