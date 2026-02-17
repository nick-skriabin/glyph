import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Style, Key } from "../types/index.js";
import type { KeybindRegistry, HelpOptions } from "../utils/keybinds.js";
import type { GlyphNode } from "../reconciler/nodes.js";
import { useLayout } from "../hooks/useLayout.js";
import { Box } from "./Box.js";
import { Text } from "./Text.js";
import { FocusScope } from "./FocusScope.js";
import { ScrollView } from "./ScrollView.js";
import { Input } from "./Input.js";
import { Keybind } from "./Keybind.js";

// ─── Types ───────────────────────────────────────────────────────────────────

/**
 * Props for the {@link HelpDialog} component.
 */
export interface HelpDialogProps<S extends string = string> {
  /** The keybind registry to display help from. */
  registry: KeybindRegistry<S>;
  /**
   * The currently active scope (determines which keybinds are shown first).
   * Additional scopes (including global) are appended automatically.
   */
  context: S;
  /**
   * Options forwarded to {@link KeybindRegistry.getKeybindsForHelp},
   * including scope titles and related scopes.
   */
  helpOptions?: HelpOptions<S>;
  /**
   * Whether the help dialog is currently visible.
   * When `false`, nothing is rendered.
   */
  open: boolean;
  /** Called when the dialog should close (e.g. Escape pressed). */
  onClose: () => void;
  /**
   * Key combo that toggles the dialog open / closed.
   * Default: `"?"`.
   * Set to `""` or `null` to disable the built-in keybind
   * (you'll manage toggling yourself).
   */
  toggleKey?: string | null;
  /** Title shown at the top of the dialog. Default: `"Keyboard Shortcuts"`. */
  title?: string;
  /** Placeholder text for the filter input. Default: `"Filter shortcuts…"`. */
  filterPlaceholder?: string;
  /** Optional style overrides for the dialog card. */
  style?: Style;
  /** Optional style overrides for the backdrop overlay. */
  backdropStyle?: Style;
  /**
   * Width of the dialog card (columns). Default: `48`.
   */
  width?: number;
  /**
   * Height of the dialog card. Default: `"80%"`.
   */
  height?: number | `${number}%`;
  /**
   * Width of the shortcut key column (columns). Default: `12`.
   */
  keyColumnWidth?: number;
  /**
   * Optional additional content rendered below the keybind list.
   */
  children?: ReactNode;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Full-screen help dialog that displays keybinds from a {@link KeybindRegistry}.
 *
 * The dialog auto-registers a toggle keybind (default `?`) so users can
 * open it without any extra wiring. Keybinds are grouped by scope,
 * filtered in real-time, and displayed inside a scrollable overlay.
 *
 * @example
 * ```tsx
 * import { HelpDialog, createKeybindRegistry } from "@semos-labs/glyph";
 *
 * const registry = createKeybindRegistry({
 *   global: [
 *     { key: "?", display: "?", description: "Show help", action: "help", command: "help" },
 *     { key: "q", display: "q", description: "Quit", action: "quit", command: "quit" },
 *   ],
 *   list: [
 *     { key: "j", display: "j / ↓", description: "Next item", action: "next" },
 *   ],
 * });
 *
 * function App() {
 *   const [showHelp, setShowHelp] = useState(false);
 *
 *   return (
 *     <Box style={{ flexDirection: "column", flexGrow: 1 }}>
 *       <MyContent />
 *       <HelpDialog
 *         registry={registry}
 *         context="list"
 *         helpOptions={{ scopeTitles: { global: "Global", list: "List" } }}
 *         open={showHelp}
 *         onClose={() => setShowHelp(false)}
 *         toggleKey="?"
 *       />
 *     </Box>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Disable the built-in toggle keybind and manage it yourself
 * <HelpDialog
 *   registry={registry}
 *   context="editor"
 *   open={helpVisible}
 *   onClose={() => setHelpVisible(false)}
 *   toggleKey={null}
 * />
 * ```
 * @category Keybindings
 */
export function HelpDialog<S extends string>({
  registry,
  context,
  helpOptions,
  open,
  onClose,
  toggleKey = "?",
  title = "Keyboard Shortcuts",
  filterPlaceholder = "Filter shortcuts…",
  style,
  backdropStyle,
  width = 48,
  height = "80%",
  keyColumnWidth = 12,
  children,
}: HelpDialogProps<S>): React.JSX.Element {
  const [filter, setFilter] = useState("");
  const [scrollOffset, setScrollOffset] = useState(0);

  // Measure the dialog card to derive the ScrollView viewport height.
  // Header ≈ 2 rows, filter ≈ 2 rows, padding ≈ 2 rows → ~6 rows of chrome.
  const cardRef = useRef<GlyphNode | null>(null);
  const cardLayout = useLayout(cardRef);
  const viewportHeight = Math.max(1, (cardLayout?.height ?? 26) - 6);

  const handleScroll = useCallback((offset: number) => {
    setScrollOffset(offset);
  }, []);

  // Build sections from the registry
  const allSections = registry.getKeybindsForHelp(context, helpOptions);

  // Filter sections/keybinds by query
  const sections = useMemo(() => {
    if (!filter.trim()) return allSections;
    const q = filter.toLowerCase();
    return allSections
      .map((section) => ({
        ...section,
        keybinds: section.keybinds.filter(
          (kb) =>
            kb.display.toLowerCase().includes(q) ||
            kb.description.toLowerCase().includes(q),
        ),
      }))
      .filter((section) => section.keybinds.length > 0);
  }, [allSections, filter]);

  // Input key handler — Escape clears filter, Ctrl+D/U scrolls, etc.
  const handleKeyPress = useCallback(
    (key: Key): boolean | void => {
      if (key.name === "escape") {
        if (filter) {
          setFilter("");
        } else {
          onClose();
        }
        return true;
      }

      const halfPage = Math.max(1, Math.floor(viewportHeight / 2));
      const fullPage = Math.max(1, viewportHeight);

      // Scroll keys — intercept and forward to ScrollView
      if (key.name === "pagedown") {
        setScrollOffset((o) => o + fullPage);
        return true;
      }
      if (key.name === "pageup") {
        setScrollOffset((o) => Math.max(0, o - fullPage));
        return true;
      }
      if (key.ctrl) {
        if (key.name === "d") {
          setScrollOffset((o) => o + halfPage);
          return true;
        }
        if (key.name === "u") {
          setScrollOffset((o) => Math.max(0, o - halfPage));
          return true;
        }
        if (key.name === "f") {
          setScrollOffset((o) => o + fullPage);
          return true;
        }
        if (key.name === "b") {
          setScrollOffset((o) => Math.max(0, o - fullPage));
          return true;
        }
      }
    },
    [filter, onClose, viewportHeight],
  );

  // Reset filter and scroll when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setFilter("");
      setScrollOffset(0);
    }
  }, [open]);

  // Reset scroll when filter changes
  useEffect(() => {
    setScrollOffset(0);
  }, [filter]);

  // Toggle keybind (rendered even when dialog is closed)
  const toggleKeybind = toggleKey ? (
    <Keybind keypress={toggleKey} onPress={() => { if (open) onClose(); }} />
  ) : null;

  // Don't render the overlay when closed
  if (!open) {
    return <>{toggleKeybind}</>;
  }

  return (
    <>
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 100,
          justifyContent: "center",
          alignItems: "center",
          ...backdropStyle,
        }}
      >
        <FocusScope trap>
          <Box
            ref={(node: any) => { cardRef.current = node ?? null; }}
            style={{
              width,
              height,
              bg: "blackBright",
              flexDirection: "column",
              paddingX: 1,
              gap: 1,
              ...style,
            }}
          >
            {/* Header */}
            <Box style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ bold: true, color: "cyanBright" }}>{title}</Text>
              <Text style={{ dim: true }}>Esc to close</Text>
            </Box>

            {/* Filter input */}
            <Box style={{ flexDirection: "row" }}>
              <Text style={{ color: "cyan" }}>/</Text>
              <Input
                value={filter}
                onChange={setFilter}
                onKeyPress={handleKeyPress}
                placeholder={filterPlaceholder}
                autoFocus
                style={{ flexGrow: 1 }}
              />
            </Box>

            {/* Keybind list (scrollable) */}
            <ScrollView
              style={{ height: 0, flexGrow: 1 }}
              scrollOffset={scrollOffset}
              onScroll={handleScroll}
              disableKeyboard
              focusable={false}
            >
              {sections.length === 0 ? (
                <Text style={{ dim: true }}>No matching shortcuts</Text>
              ) : (
                sections.map((section, i) => (
                  <Box key={i} style={{ flexDirection: "column", paddingBottom: 1 }}>
                    <Text style={{ bold: true, dim: true }}>{section.title}</Text>
                    {section.keybinds.map((kb, j) => (
                      <Box key={j} style={{ flexDirection: "row", gap: 1 }}>
                        <Text style={{ color: "cyan", width: keyColumnWidth }}>{kb.display}</Text>
                        <Text>{kb.description}</Text>
                      </Box>
                    ))}
                  </Box>
                ))
              )}
            </ScrollView>

            {/* Optional children (extra content) */}
            {children}
          </Box>
        </FocusScope >
      </Box >
    </>
  );
}
