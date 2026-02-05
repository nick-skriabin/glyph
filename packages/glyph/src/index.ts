// Entry point for Glyph - React renderer for terminal UIs
export { render } from "./render.js";

// Components
export { Box } from "./components/Box.js";
export type { BoxProps } from "./components/Box.js";
export { Text } from "./components/Text.js";
export type { TextProps } from "./components/Text.js";
export { Input } from "./components/Input.js";
export type { InputProps } from "./components/Input.js";
export { FocusScope } from "./components/FocusScope.js";
export type { FocusScopeProps } from "./components/FocusScope.js";

// Hooks
export { useInput } from "./hooks/useInput.js";
export { useFocus } from "./hooks/useFocus.js";
export { useLayout } from "./hooks/useLayout.js";

// Types
export type {
  Style,
  LayoutRect,
  Key,
  RenderOptions,
  AppHandle,
  Color,
  NamedColor,
  HexColor,
  RGBColor,
  DimensionValue,
  BorderStyle,
  WrapMode,
  TextAlign,
} from "./types/index.js";
