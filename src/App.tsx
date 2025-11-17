import { useState } from 'react'
import { findColorByRGB } from './data/colorNames'
import './App.css'

function App() {
  const [red, setRed] = useState(160)
  const [green, setGreen] = useState(110)
  const [blue, setBlue] = useState(87)

  const colorMatch = findColorByRGB(red, green, blue)
  const rgbString = `rgb(${red}, ${green}, ${blue})`

  return (
    <div className="app">
      <div className="container">
        <h1>RGB Color Name Finder</h1>
        <p className="subtitle">Adjust the sliders to find color names</p>

        <div className="color-display" style={{ backgroundColor: rgbString }}>
          <div className="color-info">
            {colorMatch ? (
              <>
                <div className="color-name">{colorMatch.name}</div>
                <div className="rgb-value">{rgbString}</div>
              </>
            ) : (
              <>
                <div className="no-match">No named color match</div>
                <div className="rgb-value">{rgbString}</div>
              </>
            )}
          </div>
        </div>

        <div className="sliders">
          <div className="slider-group">
            <label htmlFor="red-slider">
              <span className="slider-label">Red</span>
              <span className="slider-value">{red}</span>
            </label>
            <input
              id="red-slider"
              type="range"
              min="0"
              max="255"
              value={red}
              onChange={(e) => setRed(parseInt(e.target.value))}
              className="slider red-slider"
            />
          </div>

          <div className="slider-group">
            <label htmlFor="green-slider">
              <span className="slider-label">Green</span>
              <span className="slider-value">{green}</span>
            </label>
            <input
              id="green-slider"
              type="range"
              min="0"
              max="255"
              value={green}
              onChange={(e) => setGreen(parseInt(e.target.value))}
              className="slider green-slider"
            />
          </div>

          <div className="slider-group">
            <label htmlFor="blue-slider">
              <span className="slider-label">Blue</span>
              <span className="slider-value">{blue}</span>
            </label>
            <input
              id="blue-slider"
              type="range"
              min="0"
              max="255"
              value={blue}
              onChange={(e) => setBlue(parseInt(e.target.value))}
              className="slider blue-slider"
            />
          </div>
        </div>

        <div className="quick-inputs">
          <h3>Quick RGB Input</h3>
          <div className="input-row">
            <input
              type="number"
              min="0"
              max="255"
              value={red}
              onChange={(e) => setRed(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
              placeholder="R"
              className="number-input"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={green}
              onChange={(e) => setGreen(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
              placeholder="G"
              className="number-input"
            />
            <input
              type="number"
              min="0"
              max="255"
              value={blue}
              onChange={(e) => setBlue(Math.min(255, Math.max(0, parseInt(e.target.value) || 0)))}
              placeholder="B"
              className="number-input"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
