import React, { useState, useCallback, useContext, useEffect, useRef } from "react";
import type { Style, Key } from "../types/index.js";
import { InputContext, FocusContext } from "../hooks/context.js";

export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  style?: Style;
}

export function Input(props: InputProps): React.JSX.Element {
  const { value: controlledValue, defaultValue = "", onChange, placeholder, style } = props;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [cursorPos, setCursorPos] = useState(defaultValue.length);
  const inputCtx = useContext(InputContext);
  const focusCtx = useContext(FocusContext);
  const focusIdRef = useRef<string | null>(null);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  useEffect(() => {
    if (!inputCtx || !focusCtx) return;

    const handleKey = (key: Key) => {
      // Only handle keys when this input is focused
      if (!focusIdRef.current || focusCtx.focusedId !== focusIdRef.current) return;

      if (key.name === "tab" || (key.name === "tab" && key.shift)) return;

      if (key.name === "return" || key.name === "escape") return;

      if (key.name === "left") {
        setCursorPos((p) => Math.max(0, p - 1));
        return;
      }
      if (key.name === "right") {
        setCursorPos((p) => Math.min(value.length, p + 1));
        return;
      }
      if (key.name === "home") {
        setCursorPos(0);
        return;
      }
      if (key.name === "end") {
        setCursorPos(value.length);
        return;
      }
      if (key.name === "backspace") {
        if (cursorPos > 0) {
          const newVal = value.slice(0, cursorPos - 1) + value.slice(cursorPos);
          if (!isControlled) setInternalValue(newVal);
          onChange?.(newVal);
          setCursorPos((p) => Math.max(0, p - 1));
        }
        return;
      }
      if (key.name === "delete") {
        if (cursorPos < value.length) {
          const newVal = value.slice(0, cursorPos) + value.slice(cursorPos + 1);
          if (!isControlled) setInternalValue(newVal);
          onChange?.(newVal);
        }
        return;
      }

      // Ignore ctrl combos and special keys
      if (key.ctrl || key.alt) return;
      if (key.name.length > 1) return;

      // Insert printable character
      const ch = key.sequence;
      if (ch.length === 1 && ch.charCodeAt(0) >= 32) {
        const newVal = value.slice(0, cursorPos) + ch + value.slice(cursorPos);
        if (!isControlled) setInternalValue(newVal);
        onChange?.(newVal);
        setCursorPos((p) => p + 1);
      }
    };

    return inputCtx.subscribe(handleKey);
  }, [inputCtx, focusCtx, value, cursorPos, isControlled, onChange]);

  // The element will be created by the reconciler with type "input"
  return React.createElement("input" as any, {
    style,
    value,
    defaultValue,
    placeholder,
    onChange,
    cursorPosition: cursorPos,
    ref: (node: any) => {
      if (node && node.focusId) {
        focusIdRef.current = node.focusId;
      }
    },
  });
}
