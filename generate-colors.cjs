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
 * Calculate the Euclidean distance between two RGB colors
 * Returns a value between 0 and ~441 (sqrt(255^2 + 255^2 + 255^2))
 */
export function calculateColorDistance(
  r1: number, g1: number, b1: number,
  r2: number, g2: number, b2: number
): number {
  const rDiff = r1 - r2;
  const gDiff = g1 - g2;
  const bDiff = b1 - b2;
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
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
  // Maximum possible distance in RGB space
  const maxDistance = Math.sqrt(255 * 255 + 255 * 255 + 255 * 255); // ~441.67

  // Convert percentage to actual distance threshold
  const threshold = (tolerancePercent / 100) * maxDistance;

  // Calculate distances for all colors
  const colorsWithDistance: ColorDistance[] = colorNames
    .map(color => {
      const distance = calculateColorDistance(r, g, b, color.r, color.g, color.b);
      const percentage = (distance / maxDistance) * 100;
      return {
        ...color,
        distance,
        percentage
      };
    })
    .filter(color => color.distance <= threshold)
    .sort((a, b) => a.distance - b.distance)
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
  // Maximum possible distance in RGB space
  const maxDistance = Math.sqrt(255 * 255 + 255 * 255 + 255 * 255); // ~441.67

  // Convert percentages to actual distances
  const targetDistance = (targetPercent / 100) * maxDistance;
  const rangeDistance = (rangePercent / 100) * maxDistance;

  const minDistance = Math.max(0, targetDistance - rangeDistance);
  const maxDistanceThreshold = Math.min(maxDistance, targetDistance + rangeDistance);

  // Calculate distances for all colors
  const colorsWithDistance: ColorDistance[] = colorNames
    .map(color => {
      const distance = calculateColorDistance(r, g, b, color.r, color.g, color.b);
      const percentage = (distance / maxDistance) * 100;
      return {
        ...color,
        distance,
        percentage
      };
    })
    .filter(color => color.distance >= minDistance && color.distance <= maxDistanceThreshold)
    .sort((a, b) => {
      // Sort by how close to target distance
      const aDiff = Math.abs(a.distance - targetDistance);
      const bDiff = Math.abs(b.distance - targetDistance);
      return aDiff - bDiff;
    })
    .slice(0, maxResults);

  return colorsWithDistance;
}
`;

fs.writeFileSync('./src/data/colorNames.ts', tsContent);
console.log(`Generated colorNames.ts with ${colors.length} colors!`);
