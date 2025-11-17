import { useState } from 'react'
import { findColorByRGB, findSimilarColors } from './data/colorNames'
import './App.css'

function App() {
  const [red, setRed] = useState(160)
  const [green, setGreen] = useState(110)
  const [blue, setBlue] = useState(87)
  const [tolerance, setTolerance] = useState(5)
  const [showSimilar, setShowSimilar] = useState(false)

  const colorMatch = findColorByRGB(red, green, blue)
  const similarColors = findSimilarColors(red, green, blue, tolerance, 20)
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

        <div className="similar-colors-section">
          <div className="section-header">
            <h3>Find Similar Colors</h3>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={showSimilar}
                onChange={(e) => setShowSimilar(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {showSimilar && (
            <>
              <div className="slider-group">
                <label htmlFor="tolerance-slider">
                  <span className="slider-label">Tolerance</span>
                  <span className="slider-value">{tolerance}%</span>
                </label>
                <input
                  id="tolerance-slider"
                  type="range"
                  min="0"
                  max="50"
                  step="0.5"
                  value={tolerance}
                  onChange={(e) => setTolerance(parseFloat(e.target.value))}
                  className="slider tolerance-slider"
                />
                <p className="tolerance-hint">
                  {tolerance === 0 ? 'Exact match only' : `Find colors within ${tolerance}% similarity`}
                </p>
              </div>

              <div className="similar-colors-list">
                {similarColors.length > 0 ? (
                  <>
                    <p className="results-count">
                      Found {similarColors.length} color{similarColors.length !== 1 ? 's' : ''}
                    </p>
                    {similarColors.map((color, index) => (
                      <div key={`${color.name}-${index}`} className="color-item">
                        <div
                          className="color-swatch"
                          style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                        />
                        <div className="color-details">
                          <div className="color-item-name">{color.name}</div>
                          <div className="color-item-rgb">
                            rgb({color.r}, {color.g}, {color.b})
                          </div>
                        </div>
                        <div className="color-match-info">
                          {color.distance === 0 ? (
                            <span className="exact-match">Exact Match</span>
                          ) : (
                            <span className="similarity">{(100 - color.percentage).toFixed(1)}% similar</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="no-results">
                    No colors found within {tolerance}% tolerance. Try increasing the tolerance.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
