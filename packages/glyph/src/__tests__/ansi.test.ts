import { describe, test, expect } from "bun:test";
import { parseAnsi, stripAnsi } from "../paint/ansi.js";

describe("parseAnsi", () => {
  test("handles plain text without ANSI codes", () => {
    const segments = parseAnsi("Hello World");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.text).toBe("Hello World");
    expect(segments[0]!.style).toEqual({});
  });

  test("parses reset code", () => {
    const segments = parseAnsi("\x1b[0mHello\x1b[0m");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.text).toBe("Hello");
  });

  test("parses basic foreground colors", () => {
    const segments = parseAnsi("\x1b[31mRed\x1b[0m Normal");
    expect(segments).toHaveLength(2);
    expect(segments[0]!.text).toBe("Red");
    expect(segments[0]!.style.fg).toBe("red");
    expect(segments[1]!.text).toBe(" Normal");
    expect(segments[1]!.style.fg).toBeUndefined();
  });

  test("parses bright foreground colors", () => {
    const segments = parseAnsi("\x1b[92mBright Green");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.text).toBe("Bright Green");
    expect(segments[0]!.style.fg).toBe("greenBright");
  });

  test("parses background colors", () => {
    const segments = parseAnsi("\x1b[44mBlue BG");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.text).toBe("Blue BG");
    expect(segments[0]!.style.bg).toBe("blue");
  });

  test("parses bold text", () => {
    const segments = parseAnsi("\x1b[1mBold\x1b[22m Normal");
    expect(segments).toHaveLength(2);
    expect(segments[0]!.text).toBe("Bold");
    expect(segments[0]!.style.bold).toBe(true);
    expect(segments[1]!.text).toBe(" Normal");
    expect(segments[1]!.style.bold).toBe(false);
  });

  test("parses dim text", () => {
    const segments = parseAnsi("\x1b[2mDim");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.dim).toBe(true);
  });

  test("parses italic text", () => {
    const segments = parseAnsi("\x1b[3mItalic\x1b[23m");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.italic).toBe(true);
  });

  test("parses underline text", () => {
    const segments = parseAnsi("\x1b[4mUnderline");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.underline).toBe(true);
  });

  test("parses combined styles", () => {
    const segments = parseAnsi("\x1b[1;31;44mBold Red on Blue");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.bold).toBe(true);
    expect(segments[0]!.style.fg).toBe("red");
    expect(segments[0]!.style.bg).toBe("blue");
  });

  test("parses 256-color foreground", () => {
    const segments = parseAnsi("\x1b[38;5;208mOrange");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.fg).toBe(208);
  });

  test("parses 256-color background", () => {
    const segments = parseAnsi("\x1b[48;5;21mBlue BG");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.bg).toBe(21);
  });

  test("parses true color foreground", () => {
    const segments = parseAnsi("\x1b[38;2;255;128;0mTrue Orange");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.fg).toBe("#ff8000");
  });

  test("parses true color background", () => {
    const segments = parseAnsi("\x1b[48;2;0;128;255mTrue Blue BG");
    expect(segments).toHaveLength(1);
    expect(segments[0]!.style.bg).toBe("#0080ff");
  });

  test("handles multiple segments with style changes", () => {
    const input = "\x1b[32mGreen \x1b[1mBold Green \x1b[0mNormal";
    const segments = parseAnsi(input);
    expect(segments).toHaveLength(3);
    expect(segments[0]!.style.fg).toBe("green");
    expect(segments[0]!.style.bold).toBeFalsy();
    expect(segments[1]!.style.fg).toBe("green");
    expect(segments[1]!.style.bold).toBe(true);
    expect(segments[2]!.style.fg).toBeUndefined();
    expect(segments[2]!.style.bold).toBe(false);
  });

  test("handles empty string", () => {
    const segments = parseAnsi("");
    expect(segments).toHaveLength(0);
  });

  test("handles only ANSI codes with no text", () => {
    const segments = parseAnsi("\x1b[0m\x1b[31m\x1b[0m");
    expect(segments).toHaveLength(0);
  });
});

describe("stripAnsi", () => {
  test("strips all ANSI codes", () => {
    const input = "\x1b[31mRed\x1b[0m \x1b[32mGreen\x1b[0m";
    expect(stripAnsi(input)).toBe("Red Green");
  });

  test("handles plain text", () => {
    expect(stripAnsi("Hello World")).toBe("Hello World");
  });

  test("handles empty string", () => {
    expect(stripAnsi("")).toBe("");
  });

  test("strips complex codes", () => {
    const input = "\x1b[38;2;255;128;0mOrange\x1b[0m \x1b[48;5;21mBlue\x1b[0m";
    expect(stripAnsi(input)).toBe("Orange Blue");
  });
});
