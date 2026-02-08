import React, { forwardRef } from "react";
import type { Style } from "../types/index.js";
import type { ReactNode, Ref } from "react";
import type { GlyphNode } from "../reconciler/nodes.js";

export interface BoxProps {
  style?: Style;
  children?: ReactNode;
  focusable?: boolean;
}

export const Box = forwardRef<GlyphNode, BoxProps>(
  function Box({ children, style, focusable }, ref): React.JSX.Element {
    return React.createElement("box" as any, { style, focusable, ref }, children);
  }
);
