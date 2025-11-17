import { colorNames } from '../data/colorNames';

export interface ParsedColor {
  r: number;
  g: number;
  b: number;
  source: string;
  type: 'rgb' | 'hex' | 'name';
}

/**
 * Parse a hex color string to RGB
 * Accepts: #A06E57, A06E57, #a06e57, a06e57
 */
export function parseHex(hex: string): { r: number; g: number; b: number } | null {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Check if valid hex (3 or 6 characters)
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex) && !/^[0-9A-Fa-f]{3}$/.test(cleanHex)) {
    return null;
  }

  // Expand 3-character hex to 6-character
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;

  const r = parseInt(fullHex.substring(0, 2), 16);
  const g = parseInt(fullHex.substring(2, 4), 16);
  const b = parseInt(fullHex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Parse an RGB string to RGB values
 * Accepts: rgb(160, 110, 87), 160, 110, 87, 160 110 87
 */
export function parseRGB(input: string): { r: number; g: number; b: number } | null {
  // Remove rgb( and ) if present
  let cleaned = input.replace(/rgb\s*\(\s*/i, '').replace(/\s*\)/, '');

  // Split by comma or space
  const parts = cleaned.split(/[\s,]+/).filter(p => p.length > 0);

  if (parts.length !== 3) {
    return null;
  }

  const r = parseInt(parts[0]);
  const g = parseInt(parts[1]);
  const b = parseInt(parts[2]);

  // Validate range
  if (isNaN(r) || isNaN(g) || isNaN(b) ||
      r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    return null;
  }

  return { r, g, b };
}

/**
 * Find a color by name (case-insensitive)
 */
export function parseColorName(name: string): { r: number; g: number; b: number } | null {
  const cleanName = name.trim().toLowerCase();
  const color = colorNames.find(c => c.name.toLowerCase() === cleanName);

  if (color) {
    return { r: color.r, g: color.g, b: color.b };
  }

  return null;
}

/**
 * Parse any color input (RGB, Hex, or Name)
 * Returns ParsedColor object with RGB values and metadata
 */
export function parseColor(input: string): ParsedColor | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  // Try RGB format first
  if (trimmed.match(/^rgb\s*\(/i) || trimmed.match(/^\d+[\s,]+\d+[\s,]+\d+$/)) {
    const rgb = parseRGB(trimmed);
    if (rgb) {
      return { ...rgb, source: trimmed, type: 'rgb' };
    }
  }

  // Try Hex format
  if (trimmed.match(/^#?[0-9A-Fa-f]{3}$/) || trimmed.match(/^#?[0-9A-Fa-f]{6}$/)) {
    const rgb = parseHex(trimmed);
    if (rgb) {
      return { ...rgb, source: trimmed, type: 'hex' };
    }
  }

  // Try color name
  const rgb = parseColorName(trimmed);
  if (rgb) {
    return { ...rgb, source: trimmed, type: 'name' };
  }

  return null;
}

/**
 * Convert RGB to Hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
