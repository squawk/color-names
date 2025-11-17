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
`;

fs.writeFileSync('./src/data/colorNames.ts', tsContent);
console.log(`Generated colorNames.ts with ${colors.length} colors!`);
