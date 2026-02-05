import React from "react";
import type { Style } from "../types/index.js";
import type { ReactNode } from "react";

export interface TextProps {
  style?: Style;
  children?: ReactNode;
  wrap?: Style["wrap"];
}

export function Text({ children, style, wrap }: TextProps): React.JSX.Element {
  const mergedStyle = wrap ? { ...style, wrap } : style;
  return React.createElement("text" as any, { style: mergedStyle }, children);
}
