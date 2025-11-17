# RGB Color Name Finder

A modern web application built with React and Vite that allows you to find color names by adjusting RGB values. Simply move the sliders or input values directly to discover if there's a named color that matches your RGB combination.

## Features

- **Multi-format color input** - Search by RGB, Hex, or color name
- Interactive RGB sliders with real-time color preview
- Direct RGB value input for precise control
- **Massive color database with 29,998 named colors**
- **Two search modes:**
  - **Similar Colors** - Find colors within a tolerance percentage (0-50%)
  - **At Distance** - Find colors at a specific distance percentage (0-100%)
- Display RGB and Hex values for any color
- Beautiful gradient background and modern UI
- Responsive design that works on all devices
- Instant color name lookup

## Examples

### Basic Lookup
Set RGB values to `rgb(160, 110, 87)` and you'll get **Earth Tone** as the result!

### Color Search
Search for a color using any format:
- **By name**: "Earth Tone"
- **By Hex**: "#A06E57" or "A06E57"
- **By RGB**: "160, 110, 87" or "rgb(160, 110, 87)"

### Find Colors at Distance
1. Search for "Earth Tone"
2. Toggle on "Find Similar Colors"
3. Select "At Distance" mode
4. Set distance to 80%
5. See colors that are approximately 80% different from Earth Tone!

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd color-names
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Method 1: Color Search (Easiest!)

Type any color format into the search box:
- **Color name**: "Earth Tone", "Sky Blue", "Forest Green"
- **Hex code**: "#A06E57", "ff0000", "#123"
- **RGB values**: "160, 110, 87", "rgb(255, 0, 0)"

Press Enter or click Search to load the color.

### Method 2: RGB Sliders

1. **Adjust Sliders**: Move the Red, Green, and Blue sliders to change the RGB values
2. **Direct Input**: Use the number inputs for precise RGB values
3. **View Results**: The color preview shows the current color with its RGB and Hex values

### Find Similar Colors

1. **Enable Similar Colors**: Toggle on the "Find Similar Colors" switch
2. **Choose Mode**:
   - **Similar Colors**: Find colors within a tolerance
     - 0% = Exact matches only
     - 5% = Very similar colors
     - 20% = Broader range of similar colors
   - **At Distance**: Find colors at approximately X% distance
     - 50% = Colors halfway different
     - 80% = Colors that are quite different
     - 100% = Maximum color difference
3. **Browse Results**: View up to 20 colors with swatches and distance percentages

### Example Workflows

**Find similar colors to Earth Tone:**
1. Search "Earth Tone"
2. Toggle on "Find Similar Colors"
3. Select "Similar Colors" mode
4. Set tolerance to 10%

**Find complementary colors:**
1. Search "Earth Tone"
2. Toggle on "Find Similar Colors"
3. Select "At Distance" mode
4. Set distance to 80% to find contrasting colors

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with gradients and animations

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Color Database

The app includes a massive database of **29,998 named colors** from the [color-name-list](https://www.npmjs.com/package/color-name-list) package, including:
- Basic web colors (Red, Blue, Green, etc.)
- Extended CSS colors (Cornflower Blue, Saddle Brown, etc.)
- Creative color names (Acid Green, Blue Whale, etc.)
- Specialty colors (Earth Tone, and thousands more)

### Regenerating the Color Database

To regenerate the color database from the latest color-name-list:

```bash
npm install
node generate-colors.cjs
```

## License

ISC