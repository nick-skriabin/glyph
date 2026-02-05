import { useContext, useEffect } from "react";
import { InputContext } from "./context.js";
import type { Key } from "../types/index.js";

export function useInput(
  handler: (key: Key) => void,
  deps: any[] = [],
): void {
  const ctx = useContext(InputContext);

  useEffect(() => {
    if (!ctx) return;
    return ctx.subscribe(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, ...deps]);
}
