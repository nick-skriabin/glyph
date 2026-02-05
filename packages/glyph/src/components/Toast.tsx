import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { Style, Color } from "../types/index.js";

// ---- Types ----

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface Toast {
  id: string;
  message: string;
  title?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

export type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export interface ToastHostProps {
  /** Where toasts appear. Default "bottom-right". */
  position?: ToastPosition;
  /** Max visible toasts. Default 5. */
  maxVisible?: number;
  children?: ReactNode;
}

// ---- Context ----

interface ToastContextValue {
  push(toast: Omit<Toast, "id">): void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextToastId = 0;

// ---- Hook ----

export function useToast(): (toast: Omit<Toast, "id">) => void {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastHost>");
  return ctx.push;
}

// ---- Variant colors ----

const VARIANT_COLORS: Record<ToastVariant, { border: Color; title: Color }> = {
  info: { border: "cyan", title: "cyanBright" },
  success: { border: "green", title: "greenBright" },
  warning: { border: "yellow", title: "yellowBright" },
  error: { border: "red", title: "redBright" },
};

// ---- ToastHost ----

export function ToastHost({
  position = "bottom-right",
  maxVisible = 5,
  children,
}: ToastHostProps): React.JSX.Element {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${nextToastId++}`;
    const full: Toast = { id, durationMs: 3000, variant: "info", ...toast };
    setToasts((prev) => [...prev, full]);

    if (full.durationMs && full.durationMs > 0) {
      const timer = setTimeout(() => {
        timersRef.current.delete(id);
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, full.durationMs);
      timersRef.current.set(id, timer);
    }
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) {
        clearTimeout(timer);
      }
      timersRef.current.clear();
    };
  }, []);

  const ctxValue = useRef({ push });
  ctxValue.current.push = push;

  // Position styles
  const isTop = position.startsWith("top");
  const isRight = position.endsWith("right");

  const portalStyle: Style = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 900,
    flexDirection: "column",
    justifyContent: isTop ? "flex-start" : "flex-end",
    alignItems: isRight ? "flex-end" : "flex-start",
    padding: 1,
  };

  const visible = toasts.slice(-maxVisible);

  const toastElements = visible.map((toast) => {
    const variant = toast.variant ?? "info";
    const colors = VARIANT_COLORS[variant];

    const innerChildren: ReactNode[] = [];

    if (toast.title) {
      innerChildren.push(
        React.createElement("text" as any, {
          key: "title",
          style: { bold: true, color: colors.title },
        }, toast.title),
      );
    }

    innerChildren.push(
      React.createElement("text" as any, {
        key: "msg",
        style: { color: "white" },
      }, toast.message),
    );

    return React.createElement(
      "box" as any,
      {
        key: toast.id,
        style: {
          border: "round" as const,
          borderColor: colors.border,
          bg: "black" as const,
          padding: 0,
          paddingX: 1,
          flexDirection: "column" as const,
          minWidth: 20,
          maxWidth: 50,
        },
      },
      ...innerChildren,
    );
  });

  return React.createElement(
    ToastContext.Provider,
    { value: ctxValue.current },
    children,
    toastElements.length > 0
      ? React.createElement("box" as any, { style: portalStyle }, ...toastElements)
      : null,
  );
}
