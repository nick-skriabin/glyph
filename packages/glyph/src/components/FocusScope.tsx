import React, { useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { FocusContext } from "../hooks/context.js";

export interface FocusScopeProps {
  trap?: boolean;
  children?: ReactNode;
}

export function FocusScope({ trap = false, children }: FocusScopeProps): React.JSX.Element {
  const focusCtx = useContext(FocusContext);
  const prevFocusRef = useRef<string | null>(null);
  const scopeIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!trap || !focusCtx) return;

    // Save current focus to restore later
    prevFocusRef.current = focusCtx.focusedId;

    const cleanup = focusCtx.pushTrap(scopeIdsRef.current);

    // Focus first item in scope on mount
    if (scopeIdsRef.current.size > 0) {
      const firstId = scopeIdsRef.current.values().next().value;
      if (firstId) focusCtx.requestFocus(firstId);
    }

    return () => {
      cleanup();
      // Restore previous focus
      if (prevFocusRef.current) {
        focusCtx.requestFocus(prevFocusRef.current);
      }
    };
  }, [trap, focusCtx]);

  return React.createElement(React.Fragment, null, children);
}
