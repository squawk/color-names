# RGB Color Name Finder

A modern web application built with React and Vite that allows you to find color names by adjusting RGB values. Simply move the sliders or input values directly to discover if there's a named color that matches your RGB combination.

## Features

- Interactive RGB sliders with real-time color preview
- Direct RGB value input for precise control
- **Massive color database with 29,998 named colors**
- **Similar colors finder with adjustable tolerance**
- Find colors within a specified percentage similarity
- Beautiful gradient background and modern UI
- Responsive design that works on all devices
- Instant color name lookup

## Example

Set RGB values to `rgb(160, 110, 87)` and you'll get **Earth Tone** as the result!

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

### Basic Color Lookup

1. **Adjust Sliders**: Move the Red, Green, and Blue sliders to change the RGB values
2. **Direct Input**: Use the number inputs for precise RGB values
3. **View Results**: The color preview shows the current color, and if there's a matching named color, it will be displayed

### Find Similar Colors

1. **Enable Similar Colors**: Toggle on the "Find Similar Colors" switch
2. **Adjust Tolerance**: Use the tolerance slider to set the similarity percentage (0-50%)
   - 0% = Exact matches only
   - 5% = Very similar colors
   - 20% = Broader range of similar colors
3. **Browse Results**: View up to 20 similar colors sorted by closeness, with color swatches and similarity percentages

**Example**: Set RGB to `rgb(160, 110, 87)` and enable similar colors with 10% tolerance to find colors close to Earth Tone!

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