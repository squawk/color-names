import { useState } from 'react'
import { findColorByRGB, findSimilarColors, findColorsAtDistance } from './data/colorNames'
import { parseColor, rgbToHex } from './utils/colorParser'
import './App.css'

function App() {
  const [red, setRed] = useState(160)
  const [green, setGreen] = useState(110)
  const [blue, setBlue] = useState(87)
  const [colorInput, setColorInput] = useState('')
  const [searchError, setSearchError] = useState('')
  const [tolerance, setTolerance] = useState(5)
  const [showSimilar, setShowSimilar] = useState(false)
  const [searchMode, setSearchMode] = useState<'similar' | 'distance'>('similar')
  const [distancePercent, setDistancePercent] = useState(80)

  const colorMatch = findColorByRGB(red, green, blue)
  const rgbString = `rgb(${red}, ${green}, ${blue})`
  const hexString = rgbToHex(red, green, blue)

  // Get similar colors based on mode
  const getSimilarColors = () => {
    if (searchMode === 'similar') {
      return findSimilarColors(red, green, blue, tolerance, 20)
    } else {
      return findColorsAtDistance(red, green, blue, distancePercent, 5, 20)
    }
  }

  const similarColors = getSimilarColors()

  // Handle color search input
  const handleColorSearch = () => {
    const parsed = parseColor(colorInput)
    if (parsed) {
      setRed(parsed.r)
      setGreen(parsed.g)
      setBlue(parsed.b)
      setSearchError('')
      setColorInput('')
    } else {
      setSearchError('Invalid format. Try: "Earth Tone", "#A06E57", or "160, 110, 87"')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleColorSearch()
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>RGB Color Name Finder</h1>
        <p className="subtitle">Adjust the sliders to find color names</p>

        <div className="color-search">
          <h3>Color Search</h3>
          <p className="search-hint">
            Enter a color name, RGB, or Hex value
          </p>
          <div className="search-input-row">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Try "Earth Tone", "#A06E57", or "160, 110, 87"'
              className="color-search-input"
            />
            <button onClick={handleColorSearch} className="search-button">
              Search
            </button>
          </div>
          {searchError && <p className="search-error">{searchError}</p>}
        </div>

        <div className="color-display" style={{ backgroundColor: rgbString }}>
          <div className="color-info">
            {colorMatch ? (
              <>
                <div className="color-name">{colorMatch.name}</div>
                <div className="rgb-value">{rgbString}</div>
                <div className="hex-value">{hexString}</div>
              </>
            ) : (
              <>
                <div className="no-match">No named color match</div>
                <div className="rgb-value">{rgbString}</div>
                <div className="hex-value">{hexString}</div>
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
              <div className="mode-selector">
                <label className={`mode-option ${searchMode === 'similar' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    value="similar"
                    checked={searchMode === 'similar'}
                    onChange={(e) => setSearchMode(e.target.value as 'similar' | 'distance')}
                  />
                  <span>Similar Colors</span>
                </label>
                <label className={`mode-option ${searchMode === 'distance' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    value="distance"
                    checked={searchMode === 'distance'}
                    onChange={(e) => setSearchMode(e.target.value as 'similar' | 'distance')}
                  />
                  <span>At Distance</span>
                </label>
              </div>

              {searchMode === 'similar' ? (
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
              ) : (
                <div className="slider-group">
                  <label htmlFor="distance-slider">
                    <span className="slider-label">Target Distance</span>
                    <span className="slider-value">{distancePercent}%</span>
                  </label>
                  <input
                    id="distance-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={distancePercent}
                    onChange={(e) => setDistancePercent(parseFloat(e.target.value))}
                    className="slider distance-slider"
                  />
                  <p className="tolerance-hint">
                    Find colors approximately {distancePercent}% different from the selected color
                  </p>
                </div>
              )}

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
                          ) : searchMode === 'similar' ? (
                            <span className="similarity">{(100 - color.percentage).toFixed(1)}% similar</span>
                          ) : (
                            <span className="distance-badge">{color.percentage.toFixed(1)}% away</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="no-results">
                    {searchMode === 'similar'
                      ? `No colors found within ${tolerance}% tolerance. Try increasing the tolerance.`
                      : `No colors found at ${distancePercent}% distance. Try a different percentage.`
                    }
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
