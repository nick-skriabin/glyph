import { useContext, useEffect, useState, useRef, useMemo } from "react";
import { FocusContext } from "./context.js";
import { AppContext } from "./context.js";
import type { GlyphNode } from "../reconciler/nodes.js";

interface UseFocusResult {
  focused: boolean;
  focus(): void;
}

export function useFocus(nodeRef?: { current: GlyphNode | null }): UseFocusResult {
  const focusCtx = useContext(FocusContext);
  const [id] = useState(() => `focus-${Math.random().toString(36).slice(2, 9)}`);

  const isFocused = focusCtx ? focusCtx.focusedId === id : false;

  useEffect(() => {
    if (!focusCtx || !nodeRef?.current) return;
    // Assign the focus ID to the node
    nodeRef.current.focusId = id;
    return focusCtx.register(id, nodeRef.current);
  }, [focusCtx, id, nodeRef]);

  const focus = useMemo(() => {
    return () => {
      focusCtx?.requestFocus(id);
    };
  }, [focusCtx, id]);

  return { focused: isFocused, focus };
}
