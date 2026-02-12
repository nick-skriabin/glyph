/**
 * OS-level image preview utilities
 * 
 * Supports:
 * - macOS: Quick Look (qlmanage)
 * - Linux: xdg-open
 * - Windows: start
 */

import { spawn, exec } from "node:child_process";
import { platform } from "node:os";

export type PreviewMethod = "quicklook" | "open" | "none";

/**
 * Detect which preview method is available
 */
export function detectPreviewMethod(): PreviewMethod {
  const os = platform();

  if (os === "darwin") {
    return "quicklook";
  }

  if (os === "linux" || os === "win32") {
    return "open";
  }

  return "none";
}

/**
 * Open an image file with the OS preview
 * Returns a promise that resolves when the preview is closed (for Quick Look)
 * or when the preview command is launched (for xdg-open/start)
 */
export async function openImagePreview(localPath: string): Promise<void> {
  const method = detectPreviewMethod();

  switch (method) {
    case "quicklook":
      return openQuickLook(localPath);
    case "open":
      return openWithSystem(localPath);
    case "none":
      throw new Error("No preview method available on this platform");
  }
}

/**
 * macOS Quick Look preview
 * Uses qlmanage which blocks until the preview is closed
 */
function openQuickLook(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // qlmanage -p shows Quick Look preview
    // -p = preview mode
    const proc = spawn("qlmanage", ["-p", path], {
      detached: false,
      stdio: ["ignore", "ignore", "ignore"],
    });

    proc.on("error", (err) => {
      reject(new Error(`Failed to open Quick Look: ${err.message}`));
    });

    // Bring Quick Look window to front after a short delay
    setTimeout(() => {
      bringQuickLookToFront();
    }, 50);

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        // qlmanage can return non-zero even on success sometimes
        resolve();
      }
    });
  });
}

/**
 * Bring Quick Look window to front using AppleScript
 */
function bringQuickLookToFront(): void {
  // qlmanage runs as a separate process, we need to activate it
  const script = `
    tell application "System Events"
      set frontmost of (first process whose name is "qlmanage") to true
    end tell
  `;
  
  exec(`osascript -e '${script}'`, { stdio: "ignore" });
}

/**
 * Open with system default application
 * Works on Linux (xdg-open) and Windows (start)
 */
function openWithSystem(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const os = platform();
    let command: string;
    let args: string[];

    if (os === "linux") {
      command = "xdg-open";
      args = [path];
    } else if (os === "win32") {
      command = "cmd";
      args = ["/c", "start", '""', path];
    } else {
      // Fallback for macOS if Quick Look failed
      command = "open";
      args = [path];
    }

    const proc = spawn(command, args, {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"],
    });

    proc.unref();

    proc.on("error", (err) => {
      reject(new Error(`Failed to open preview: ${err.message}`));
    });

    // Don't wait for the process to close - just resolve after spawning
    // The preview app will stay open independently
    setTimeout(resolve, 100);
  });
}

/**
 * Check if Quick Look is available (macOS only)
 */
export function isQuickLookAvailable(): boolean {
  return platform() === "darwin";
}
