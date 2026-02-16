/**
 * Terminal capability detection for image protocols
 */

export interface TerminalCapabilities {
  name: string;
  supportsKittyGraphics: boolean;
  supportsIterm2Images: boolean;
  supportsSixel: boolean;
}

// Cache the result
let cachedCapabilities: TerminalCapabilities | null = null;

/**
 * Detect which terminal we're running in and what image protocols it supports
  * @category Core
 */
export function detectTerminalCapabilities(debug = false): TerminalCapabilities {
  if (cachedCapabilities) return cachedCapabilities;

  const term = process.env.TERM || "";
  const termProgram = process.env.TERM_PROGRAM || "";
  const kittyWindowId = process.env.KITTY_WINDOW_ID;
  const ghosttyResourcesDir = process.env.GHOSTTY_RESOURCES_DIR;
  const weztermPane = process.env.WEZTERM_PANE;
  const lcTerminal = process.env.LC_TERMINAL || "";
  const konsoleVersion = process.env.KONSOLE_VERSION;

  // Kitty - native Kitty graphics protocol
  if (kittyWindowId || term === "xterm-kitty") {
    cachedCapabilities = {
      name: "kitty",
      supportsKittyGraphics: true,
      supportsIterm2Images: false,
      supportsSixel: false,
    };
    return cachedCapabilities;
  }

  // Ghostty - supports Kitty graphics protocol
  if (ghosttyResourcesDir || term.includes("ghostty")) {
    cachedCapabilities = {
      name: "ghostty",
      supportsKittyGraphics: true,
      supportsIterm2Images: false,
      supportsSixel: false,
    };
    return cachedCapabilities;
  }

  // WezTerm - supports iTerm2 inline images protocol
  if (weztermPane || termProgram === "WezTerm") {
    cachedCapabilities = {
      name: "wezterm",
      supportsKittyGraphics: true, // WezTerm also supports Kitty protocol
      supportsIterm2Images: true,
      supportsSixel: true,
    };
    return cachedCapabilities;
  }

  // iTerm2 - native iTerm2 inline images
  if (termProgram === "iTerm.app" || lcTerminal === "iTerm2") {
    cachedCapabilities = {
      name: "iterm2",
      supportsKittyGraphics: false,
      supportsIterm2Images: true,
      supportsSixel: false,
    };
    return cachedCapabilities;
  }

  // Konsole - supports Sixel
  if (konsoleVersion) {
    cachedCapabilities = {
      name: "konsole",
      supportsKittyGraphics: false,
      supportsIterm2Images: false,
      supportsSixel: true,
    };
    return cachedCapabilities;
  }

  // VS Code terminal - limited support
  if (termProgram === "vscode") {
    cachedCapabilities = {
      name: "vscode",
      supportsKittyGraphics: false,
      supportsIterm2Images: false,
      supportsSixel: false,
    };
    return cachedCapabilities;
  }

  // Default: unknown terminal, no image support
  cachedCapabilities = {
    name: "unknown",
    supportsKittyGraphics: false,
    supportsIterm2Images: false,
    supportsSixel: false,
  };
  return cachedCapabilities;
}

/**
 * Check if the terminal supports any inline image protocol
  * @category Core
 */
export function supportsInlineImages(): boolean {
  const caps = detectTerminalCapabilities();
  return caps.supportsKittyGraphics || caps.supportsIterm2Images || caps.supportsSixel;
}

/**
 * Reset cached capabilities (useful for testing)
 */
export function resetCapabilitiesCache(): void {
  cachedCapabilities = null;
}
