import React from "react";
import type { Style } from "../types/index.js";
import type { ReactNode } from "react";

export interface BoxProps {
  style?: Style;
  children?: ReactNode;
  focusable?: boolean;
}

export function Box({ children, style, focusable }: BoxProps): React.JSX.Element {
  return React.createElement("box" as any, { style, focusable }, children);
}
