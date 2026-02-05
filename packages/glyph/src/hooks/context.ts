import { createContext } from "react";
import type { Key, LayoutRect } from "../types/index.js";
import type { GlyphNode } from "../reconciler/nodes.js";

// ---- Input Context ----
export type InputHandler = (key: Key) => void;

export interface InputContextValue {
  subscribe(handler: InputHandler): () => void;
}

export const InputContext = createContext<InputContextValue | null>(null);

// ---- Focus Context ----
export interface FocusContextValue {
  focusedId: string | null;
  register(id: string, node: GlyphNode): () => void;
  requestFocus(id: string): void;
  focusNext(): void;
  focusPrev(): void;
  trapIds: Set<string> | null;
  pushTrap(ids: Set<string>): () => void;
}

export const FocusContext = createContext<FocusContextValue | null>(null);

// ---- Layout Context ----
export interface LayoutContextValue {
  getLayout(node: GlyphNode): LayoutRect;
  subscribe(node: GlyphNode, handler: (rect: LayoutRect) => void): () => void;
}

export const LayoutContext = createContext<LayoutContextValue | null>(null);

// ---- App Context ----
export interface AppContextValue {
  registerNode(node: GlyphNode): void;
  unregisterNode(node: GlyphNode): void;
  scheduleRender(): void;
}

export const AppContext = createContext<AppContextValue | null>(null);
