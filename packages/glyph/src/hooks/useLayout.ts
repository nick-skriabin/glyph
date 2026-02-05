import { useContext, useState, useEffect } from "react";
import { LayoutContext } from "./context.js";
import type { LayoutRect } from "../types/index.js";
import type { GlyphNode } from "../reconciler/nodes.js";

const DEFAULT_RECT: LayoutRect = {
  x: 0, y: 0, width: 0, height: 0,
  innerX: 0, innerY: 0, innerWidth: 0, innerHeight: 0,
};

export function useLayout(nodeRef?: { current: GlyphNode | null }): LayoutRect {
  const ctx = useContext(LayoutContext);
  const [layout, setLayout] = useState<LayoutRect>(DEFAULT_RECT);

  useEffect(() => {
    if (!ctx || !nodeRef?.current) return;
    setLayout(ctx.getLayout(nodeRef.current));
    return ctx.subscribe(nodeRef.current, setLayout);
  }, [ctx, nodeRef]);

  return layout;
}
