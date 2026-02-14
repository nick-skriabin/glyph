import { useContext, useCallback } from "react";
import { ScrollViewContext } from "./context.js";
import type { ScrollIntoViewOptions } from "./context.js";
import type { GlyphNode } from "../reconciler/nodes.js";

/**
 * Returns a function that scrolls the nearest parent {@link ScrollView}
 * to make the referenced node visible.
 *
 * This is the non-focusable counterpart to `handle.scrollIntoView()` —
 * use it with plain `Box` refs or any `GlyphNode`.
 *
 * @param nodeRef - React ref pointing to the target node.
 * @returns A stable callback you can invoke to scroll to the node.
 *
 * @example
 * ```tsx
 * const boxRef = useRef<GlyphNode>(null);
 * const scrollIntoView = useScrollIntoView(boxRef);
 *
 * // Later, e.g. in an effect or event handler:
 * scrollIntoView();                       // minimal scroll
 * scrollIntoView({ block: "center" });    // center in viewport
 * ```
 * @category Hooks
 */
export function useScrollIntoView(
  nodeRef: { current: GlyphNode | null },
): (options?: ScrollIntoViewOptions) => void {
  const scrollCtx = useContext(ScrollViewContext);

  return useCallback(
    (options?: ScrollIntoViewOptions) => {
      if (!scrollCtx || !nodeRef.current) return;
      scrollCtx.scrollTo(nodeRef.current, options);
    },
    [scrollCtx, nodeRef],
  );
}
