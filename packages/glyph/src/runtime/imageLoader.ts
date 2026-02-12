/**
 * Image loading utilities for local and remote images
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { tmpdir, platform } from "node:os";
import { basename } from "node:path";
import { execSync } from "node:child_process";

export interface LoadedImage {
  data: Buffer;
  name: string;
  localPath: string;
  isRemote: boolean;
}

// Cache directory for downloaded images
const CACHE_DIR = join(tmpdir(), "glyph-image-cache");

/**
 * Check if a string is a URL
 */
export function isRemoteUrl(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

/**
 * Get a cache path for a remote URL (with optional format override)
 */
function getCachePath(url: string, format?: "png" | "jpeg" | "gif" | "webp" | "unknown"): string {
  const hash = createHash("md5").update(url).digest("hex");
  // Use detected format if provided, otherwise try URL extension, fallback to .png
  const ext = format 
    ? getExtensionFromFormat(format) 
    : (getExtensionFromUrl(url) || ".png");
  return join(CACHE_DIR, `${hash}${ext}`);
}

/**
 * Extract file extension from URL (handles query parameters)
 */
function getExtensionFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // Match extension anywhere in path (before query params which are already stripped)
    const match = pathname.match(/\.(png|jpg|jpeg|gif|webp|bmp|ico)/i);
    if (match) {
      // Normalize jpg to jpeg
      const ext = match[0].toLowerCase();
      return ext === ".jpg" ? ".jpeg" : ext;
    }
    return ""; // Return empty, we'll detect from content
  } catch {
    return "";
  }
}

/**
 * Get file extension from detected image format
 */
function getExtensionFromFormat(format: "png" | "jpeg" | "gif" | "webp" | "unknown"): string {
  switch (format) {
    case "png": return ".png";
    case "jpeg": return ".jpeg";
    case "gif": return ".gif";
    case "webp": return ".webp";
    default: return ".png"; // Default to PNG for unknown
  }
}

/**
 * Extract filename from path or URL
 */
export function getImageName(src: string): string {
  if (isRemoteUrl(src)) {
    try {
      const urlObj = new URL(src);
      const pathname = urlObj.pathname;
      const name = basename(pathname);
      return name || urlObj.hostname;
    } catch {
      return "remote-image";
    }
  }
  return basename(src);
}

/**
 * Ensure cache directory exists
 */
function ensureCacheDir(): void {
  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Load an image from local path or remote URL
 * Returns the image data as a Buffer
 */
export async function loadImage(src: string): Promise<LoadedImage> {
  const name = getImageName(src);

  if (isRemoteUrl(src)) {
    return loadRemoteImage(src, name);
  }

  return loadLocalImage(src, name);
}

/**
 * Load a local image file
 */
async function loadLocalImage(path: string, name: string): Promise<LoadedImage> {
  if (!existsSync(path)) {
    throw new Error(`Image not found: ${path}`);
  }

  const data = readFileSync(path);
  return {
    data,
    name,
    localPath: path,
    isRemote: false,
  };
}

/**
 * Load a remote image (with caching)
 */
async function loadRemoteImage(url: string, name: string): Promise<LoadedImage> {
  ensureCacheDir();
  
  // Try to find cached file with any extension
  const hash = createHash("md5").update(url).digest("hex");
  const possibleExtensions = [".png", ".jpeg", ".gif", ".webp"];
  for (const ext of possibleExtensions) {
    const possiblePath = join(CACHE_DIR, `${hash}${ext}`);
    if (existsSync(possiblePath)) {
      const data = readFileSync(possiblePath);
      return {
        data,
        name,
        localPath: possiblePath,
        isRemote: true,
      };
    }
  }

  // Download the image
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const data = Buffer.from(arrayBuffer);

  // Validate it's an image (check magic bytes)
  if (!isValidImage(data)) {
    throw new Error(`Invalid image data from: ${url}`);
  }

  // Detect actual format and cache with correct extension
  const format = detectImageFormat(data);
  const cachePath = getCachePath(url, format);
  writeFileSync(cachePath, data);

  return {
    data,
    name,
    localPath: cachePath,
    isRemote: true,
  };
}

/**
 * Check if a buffer contains valid image data (by magic bytes)
 */
function isValidImage(data: Buffer): boolean {
  if (data.length < 4) return false;

  // PNG: 89 50 4E 47
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) {
    return true;
  }

  // JPEG: FF D8 FF
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return true;
  }

  // GIF: GIF87a or GIF89a
  if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46) {
    return true;
  }

  // BMP: BM
  if (data[0] === 0x42 && data[1] === 0x4d) {
    return true;
  }

  // WebP: RIFF....WEBP
  if (
    data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46 &&
    data.length >= 12 &&
    data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50
  ) {
    return true;
  }

  // ICO: 00 00 01 00
  if (data[0] === 0x00 && data[1] === 0x00 && data[2] === 0x01 && data[3] === 0x00) {
    return true;
  }

  return false;
}

/**
 * Clear the image cache
 */
export function clearImageCache(): void {
  // Note: We don't delete the whole directory, just let it be cleaned up by OS
  // This is a simple implementation
}

/**
 * Detect image format from buffer
 */
export function detectImageFormat(data: Buffer): "png" | "jpeg" | "gif" | "webp" | "unknown" {
  if (data.length < 4) return "unknown";

  // PNG: 89 50 4E 47
  if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e && data[3] === 0x47) {
    return "png";
  }

  // JPEG: FF D8 FF
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) {
    return "jpeg";
  }

  // GIF: GIF87a or GIF89a
  if (data[0] === 0x47 && data[1] === 0x49 && data[2] === 0x46) {
    return "gif";
  }

  // WebP: RIFF....WEBP
  if (
    data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46 &&
    data.length >= 12 &&
    data[8] === 0x57 && data[9] === 0x45 && data[10] === 0x42 && data[11] === 0x50
  ) {
    return "webp";
  }

  return "unknown";
}

/**
 * Convert an image to PNG format using system tools
 * Returns the PNG data or null if conversion failed
 */
export function convertToPng(data: Buffer, originalPath?: string): Buffer | null {
  const format = detectImageFormat(data);
  
  // Already PNG, no conversion needed
  if (format === "png") {
    return data;
  }

  // Need to convert - use system tools
  ensureCacheDir();
  const tempId = createHash("md5").update(data).digest("hex");
  const tempInput = join(CACHE_DIR, `${tempId}.${format}`);
  const tempOutput = join(CACHE_DIR, `${tempId}.png`);

  try {
    // Write input file
    writeFileSync(tempInput, data);

    // Try different conversion tools
    const os = platform();
    let converted = false;

    if (os === "darwin") {
      // macOS: use sips (built-in)
      try {
        execSync(`sips -s format png "${tempInput}" --out "${tempOutput}" 2>/dev/null`, {
          stdio: "pipe",
        });
        converted = true;
      } catch {
        // sips failed, try other methods
      }
    }

    if (!converted) {
      // Try ImageMagick (cross-platform)
      try {
        execSync(`magick "${tempInput}" "${tempOutput}" 2>/dev/null`, {
          stdio: "pipe",
        });
        converted = true;
      } catch {
        // magick not available
      }
    }

    if (!converted) {
      // Try older ImageMagick command
      try {
        execSync(`convert "${tempInput}" "${tempOutput}" 2>/dev/null`, {
          stdio: "pipe",
        });
        converted = true;
      } catch {
        // convert not available
      }
    }

    if (converted && existsSync(tempOutput)) {
      const pngData = readFileSync(tempOutput);
      // Cleanup temp files
      try { unlinkSync(tempInput); } catch {}
      try { unlinkSync(tempOutput); } catch {}
      return pngData;
    }

    // Cleanup on failure
    try { unlinkSync(tempInput); } catch {}
    return null;
  } catch {
    // Cleanup on error
    try { unlinkSync(tempInput); } catch {}
    try { unlinkSync(tempOutput); } catch {}
    return null;
  }
}
