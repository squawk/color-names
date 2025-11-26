/**
 * Color Database Generator
 *
 * This script generates the colorNames.ts file from the color-name-list package.
 * The color-name-list package contains ~30,000 named colors with their hex values.
 *
 * Run: node generate-colors.cjs
 *
 * Requirements: npm install color-name-list
 */

const fs = require('fs');
const colorNameList = JSON.parse(
  fs.readFileSync('./node_modules/color-name-list/dist/colornames.json', 'utf8')
);

// Function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Convert all colors
const colors = colorNameList.map(color => {
  const rgb = hexToRgb(color.hex);
  return {
    name: color.name,
    r: rgb.r,
    g: rgb.g,
    b: rgb.b
  };
});

// Generate TypeScript file
const tsContent = `export interface ColorName {
  name: string;
  r: number;
  g: number;
  b: number;
}

export const colorNames: ColorName[] = ${JSON.stringify(colors, null, 2)};

export function findColorByRGB(r: number, g: number, b: number): ColorName | null {
  return colorNames.find(color =>
    color.r === r && color.g === g && color.b === b
  ) || null;
}

export interface ColorDistance extends ColorName {
  distance: number;
  percentage: number;
}

/**
 * Convert RGB to LAB color space
 * LAB is a perceptually uniform color space that better matches human vision
 */
function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  // Normalize RGB values to 0-1
  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;

  // Apply gamma correction (sRGB to linear RGB)
  rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
  gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
  bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;

  // Convert to XYZ color space (using D65 illuminant)
  let x = rNorm * 0.4124564 + gNorm * 0.3575761 + bNorm * 0.1804375;
  let y = rNorm * 0.2126729 + gNorm * 0.7151522 + bNorm * 0.0721750;
  let z = rNorm * 0.0193339 + gNorm * 0.1191920 + bNorm * 0.9503041;

  // Normalize for D65 white point
  x = x / 0.95047;
  y = y / 1.00000;
  z = z / 1.08883;

  // Convert to LAB
  x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x + 16/116);
  y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y + 16/116);
  z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z + 16/116);

  const L = (116 * y) - 16;
  const a = 500 * (x - y);
  const bVal = 200 * (y - z);

  return [L, a, bVal];
}

/**
 * Calculate the perceptual color distance using DeltaE CIE2000
 * This is the most accurate formula for measuring how humans perceive color differences
 * Returns a percentage from 0 (identical) to 100 (maximum perceptual difference)
 */
export function calculateColorDistance(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  const lab1 = rgbToLab(r1, g1, b1);
  const lab2 = rgbToLab(r2, g2, b2);

  const L1 = lab1[0], a1 = lab1[1], b1Val = lab1[2];
  const L2 = lab2[0], a2 = lab2[1], b2Val = lab2[2];

  // Calculate CIEDE2000 color difference
  const dL = L2 - L1;
  const Lbar = (L1 + L2) / 2;

  const C1 = Math.sqrt(a1 * a1 + b1Val * b1Val);
  const C2 = Math.sqrt(a2 * a2 + b2Val * b2Val);
  const Cbar = (C1 + C2) / 2;

  const G = 0.5 * (1 - Math.sqrt(Math.pow(Cbar, 7) / (Math.pow(Cbar, 7) + Math.pow(25, 7))));

  const a1p = a1 * (1 + G);
  const a2p = a2 * (1 + G);

  const C1p = Math.sqrt(a1p * a1p + b1Val * b1Val);
  const C2p = Math.sqrt(a2p * a2p + b2Val * b2Val);
  const Cbarp = (C1p + C2p) / 2;

  const dCp = C2p - C1p;

  const h1p = (Math.atan2(b1Val, a1p) * 180 / Math.PI + 360) % 360;
  const h2p = (Math.atan2(b2Val, a2p) * 180 / Math.PI + 360) % 360;

  let dhp;
  if (C1p * C2p === 0) {
    dhp = 0;
  } else if (Math.abs(h2p - h1p) <= 180) {
    dhp = h2p - h1p;
  } else if (h2p - h1p > 180) {
    dhp = h2p - h1p - 360;
  } else {
    dhp = h2p - h1p + 360;
  }

  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp * Math.PI / 180) / 2);

  let Hbarp;
  if (C1p * C2p === 0) {
    Hbarp = h1p + h2p;
  } else if (Math.abs(h1p - h2p) <= 180) {
    Hbarp = (h1p + h2p) / 2;
  } else if (h1p + h2p < 360) {
    Hbarp = (h1p + h2p + 360) / 2;
  } else {
    Hbarp = (h1p + h2p - 360) / 2;
  }

  const T = 1 -
    0.17 * Math.cos((Hbarp - 30) * Math.PI / 180) +
    0.24 * Math.cos(2 * Hbarp * Math.PI / 180) +
    0.32 * Math.cos((3 * Hbarp + 6) * Math.PI / 180) -
    0.20 * Math.cos((4 * Hbarp - 63) * Math.PI / 180);

  const sL = 1 + (0.015 * Math.pow(Lbar - 50, 2)) / Math.sqrt(20 + Math.pow(Lbar - 50, 2));
  const sC = 1 + 0.045 * Cbarp;
  const sH = 1 + 0.015 * Cbarp * T;

  const dTheta = 30 * Math.exp(-Math.pow((Hbarp - 275) / 25, 2));
  const RC = 2 * Math.sqrt(Math.pow(Cbarp, 7) / (Math.pow(Cbarp, 7) + Math.pow(25, 7)));
  const RT = -RC * Math.sin(2 * dTheta * Math.PI / 180);

  const kL = 1, kC = 1, kH = 1;

  const deltaE = Math.sqrt(
    Math.pow(dL / (kL * sL), 2) +
    Math.pow(dCp / (kC * sC), 2) +
    Math.pow(dHp / (kH * sH), 2) +
    RT * (dCp / (kC * sC)) * (dHp / (kH * sH))
  );

  // Convert DeltaE to percentage (0-100)
  // DeltaE 2000 typically ranges from 0 to ~100 for practical color differences
  const maxDeltaE = 100;
  const distancePercent = (deltaE / maxDeltaE) * 100;

  // Return closeness percentage (100 = identical, 0 = maximum difference)
  return 100 - Math.min(distancePercent, 100);
}

/**
 * Find colors within a certain percentage distance from the target RGB
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @param tolerancePercent - Tolerance percentage (0-100). 0% = exact match, 100% = all colors
 * @param maxResults - Maximum number of results to return (default: 50)
 * @returns Array of colors sorted by distance (closest first)
 */
export function findSimilarColors(
  r: number,
  g: number,
  b: number,
  tolerancePercent: number,
  maxResults: number = 50
): ColorDistance[] {
  // Calculate distances for all colors
  const colorsWithDistance: ColorDistance[] = colorNames
    .map(color => {
      const percentage = calculateColorDistance(r, g, b, color.r, color.g, color.b);
      return {
        ...color,
        distance: percentage, // Store percentage as distance for compatibility
        percentage
      };
    })
    .filter(color => color.percentage <= tolerancePercent)
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, maxResults);

  return colorsWithDistance;
}

/**
 * Find colors at approximately a specific distance percentage from the target RGB
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @param targetPercent - Target distance percentage (0-100)
 * @param rangePercent - Range around target (default: 5%). E.g., 80% ± 5% = 75-85%
 * @param maxResults - Maximum number of results to return (default: 50)
 * @returns Array of colors sorted by how close they are to the target distance
 */
export function findColorsAtDistance(
  r: number,
  g: number,
  b: number,
  targetPercent: number,
  rangePercent: number = 5,
  maxResults: number = 50
): ColorDistance[] {
  const minPercent = Math.max(0, targetPercent - rangePercent);
  const maxPercent = Math.min(100, targetPercent + rangePercent);

  // Calculate distances for all colors
  const colorsWithDistance: ColorDistance[] = colorNames
    .map(color => {
      const percentage = calculateColorDistance(r, g, b, color.r, color.g, color.b);
      return {
        ...color,
        distance: percentage, // Store percentage as distance for compatibility
        percentage
      };
    })
    .filter(color => color.percentage >= minPercent && color.percentage <= maxPercent)
    .sort((a, b) => {
      // Sort by how close to target distance
      const aDiff = Math.abs(a.percentage - targetPercent);
      const bDiff = Math.abs(b.percentage - targetPercent);
      return aDiff - bDiff;
    })
    .slice(0, maxResults);

  return colorsWithDistance;
}

export interface ColorConstraint {
  r: number;
  g: number;
  b: number;
  targetPercent: number;
  name?: string;
}

/**
 * Find colors that satisfy multiple distance constraints simultaneously
 * @param constraints - Array of color constraints (RGB + target distance %)
 * @param tolerance - How much deviation from target distance is allowed (default: 10%)
 * @param maxResults - Maximum number of results to return (default: 50)
 * @returns Array of colors sorted by how well they match all constraints
 */
export function findColorsMatchingConstraints(
  constraints: ColorConstraint[],
  tolerance: number = 10,
  maxResults: number = 50
): ColorDistance[] {
  if (constraints.length === 0) {
    return [];
  }

  // Calculate how well each color matches ALL constraints
  const colorsWithScores: (ColorDistance & { score: number })[] = colorNames
    .map(color => {
      let totalError = 0;
      let validConstraints = 0;

      // Check each constraint
      for (const constraint of constraints) {
        const percentage = calculateColorDistance(
          constraint.r, constraint.g, constraint.b,
          color.r, color.g, color.b
        );

        // Calculate how far off this color is from the target distance
        const error = Math.abs(percentage - constraint.targetPercent);

        // If within tolerance, this constraint is satisfied
        if (error <= tolerance) {
          validConstraints++;
        }

        totalError += error;
      }

      // Only include colors that satisfy ALL constraints
      if (validConstraints === constraints.length) {
        // Average percentage distance to all constraint colors
        const avgPercentage = constraints.reduce((sum, constraint) => {
          return sum + calculateColorDistance(
            constraint.r, constraint.g, constraint.b,
            color.r, color.g, color.b
          );
        }, 0) / constraints.length;

        return {
          ...color,
          distance: avgPercentage, // Store percentage as distance for compatibility
          percentage: avgPercentage,
          score: totalError // Lower is better
        };
      }

      return null;
    })
    .filter((color): color is ColorDistance & { score: number } => color !== null)
    .sort((a, b) => a.score - b.score) // Sort by best match (lowest error)
    .slice(0, maxResults);

  return colorsWithScores;
}
`;

fs.writeFileSync('./src/data/colorNames.ts', tsContent);
console.log(`Generated colorNames.ts with ${colors.length} colors!`);
