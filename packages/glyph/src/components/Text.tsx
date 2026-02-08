import React, { forwardRef } from "react";
import type { Style } from "../types/index.js";
import type { ReactNode } from "react";
import type { GlyphNode } from "../reconciler/nodes.js";

export interface TextProps {
  style?: Style;
  children?: ReactNode;
  wrap?: Style["wrap"];
}

export const Text = forwardRef<GlyphNode, TextProps>(
  function Text({ children, style, wrap }, ref): React.JSX.Element {
    const mergedStyle = wrap ? { ...style, wrap } : style;
    return React.createElement("text" as any, { style: mergedStyle, ref }, children);
  }
);
