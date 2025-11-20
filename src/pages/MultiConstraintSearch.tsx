import { useState } from 'react'
import { findColorsMatchingConstraints, ColorConstraint } from '../data/colorNames'
import { parseColor, rgbToHex } from '../utils/colorParser'
import './MultiConstraintSearch.css'

interface ConstraintInput {
  id: number;
  colorInput: string;
  percentage: number;
  error: string;
  parsed: { r: number; g: number; b: number; name?: string } | null;
}

function MultiConstraintSearch() {
  const [constraints, setConstraints] = useState<ConstraintInput[]>([
    { id: 1, colorInput: '', percentage: 50, error: '', parsed: null },
    { id: 2, colorInput: '', percentage: 50, error: '', parsed: null }
  ])
  const [tolerance, setTolerance] = useState(10)
  const [nextId, setNextId] = useState(3)
  const [results, setResults] = useState<any[]>([])
  const [searched, setSearched] = useState(false)

  const addConstraint = () => {
    setConstraints([
      ...constraints,
      { id: nextId, colorInput: '', percentage: 50, error: '', parsed: null }
    ])
    setNextId(nextId + 1)
  }

  const removeConstraint = (id: number) => {
    if (constraints.length > 2) {
      setConstraints(constraints.filter(c => c.id !== id))
    }
  }

  const updateConstraintColor = (id: number, value: string) => {
    setConstraints(constraints.map(c => {
      if (c.id === id) {
        const parsed = parseColor(value)
        return {
          ...c,
          colorInput: value,
          parsed: parsed ? { r: parsed.r, g: parsed.g, b: parsed.b } : null,
          error: value && !parsed ? 'Invalid color format' : ''
        }
      }
      return c
    }))
  }

  const updateConstraintPercentage = (id: number, value: number) => {
    setConstraints(constraints.map(c =>
      c.id === id ? { ...c, percentage: value } : c
    ))
  }

  const handleSearch = () => {
    // Validate all constraints are filled
    const validConstraints: ColorConstraint[] = []
    let hasError = false

    for (const c of constraints) {
      if (!c.colorInput) {
        setConstraints(constraints.map(con =>
          con.id === c.id ? { ...con, error: 'Color required' } : con
        ))
        hasError = true
      } else if (!c.parsed) {
        hasError = true
      } else {
        validConstraints.push({
          r: c.parsed.r,
          g: c.parsed.g,
          b: c.parsed.b,
          targetPercent: c.percentage
        })
      }
    }

    if (hasError || validConstraints.length === 0) {
      return
    }

    // Perform search
    const foundColors = findColorsMatchingConstraints(validConstraints, tolerance, 50)
    setResults(foundColors)
    setSearched(true)
  }

  return (
    <div className="app">
      <div className="container">
        <h1>Multi-Constraint Color Search</h1>
        <p className="subtitle">
          Find colors that match multiple distance requirements simultaneously
        </p>

        <div className="constraints-section">
          <h3>Color Constraints</h3>
          <p className="hint">
            Add multiple colors and specify how far away (in %) the result should be from each
          </p>

          {constraints.map((constraint, index) => (
            <div key={constraint.id} className="constraint-row">
              <div className="constraint-number">{index + 1}</div>
              <div className="constraint-inputs">
                <div className="constraint-color-input">
                  <input
                    type="text"
                    value={constraint.colorInput}
                    onChange={(e) => updateConstraintColor(constraint.id, e.target.value)}
                    placeholder='Color name, hex, or RGB'
                    className={`color-input ${constraint.error ? 'error' : ''} ${constraint.parsed ? 'valid' : ''}`}
                  />
                  {constraint.parsed && (
                    <div
                      className="color-preview"
                      style={{ backgroundColor: `rgb(${constraint.parsed.r}, ${constraint.parsed.g}, ${constraint.parsed.b})` }}
                      title={`rgb(${constraint.parsed.r}, ${constraint.parsed.g}, ${constraint.parsed.b})`}
                    />
                  )}
                  {constraint.error && <span className="error-text">{constraint.error}</span>}
                </div>
                <div className="constraint-percentage">
                  <label>Distance: {constraint.percentage}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={constraint.percentage}
                    onChange={(e) => updateConstraintPercentage(constraint.id, parseInt(e.target.value))}
                    className="percentage-slider"
                  />
                </div>
              </div>
              {constraints.length > 2 && (
                <button
                  onClick={() => removeConstraint(constraint.id)}
                  className="remove-btn"
                  title="Remove constraint"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button onClick={addConstraint} className="add-constraint-btn">
            + Add Another Constraint
          </button>
        </div>

        <div className="tolerance-section">
          <h3>Search Tolerance</h3>
          <p className="hint">How much deviation from target distances is acceptable</p>
          <div className="tolerance-control">
            <label>Tolerance: {tolerance}%</label>
            <input
              type="range"
              min="5"
              max="25"
              value={tolerance}
              onChange={(e) => setTolerance(parseInt(e.target.value))}
              className="tolerance-slider-multi"
            />
            <p className="tolerance-hint-multi">
              {tolerance < 10
                ? 'Strict matching - fewer results'
                : tolerance < 20
                  ? 'Moderate matching - balanced results'
                  : 'Loose matching - more results'}
            </p>
          </div>
        </div>

        <button onClick={handleSearch} className="search-btn-multi">
          Find Matching Colors
        </button>

        {searched && (
          <div className="results-section">
            <h3>Results</h3>
            {results.length > 0 ? (
              <>
                <p className="results-count">
                  Found {results.length} color{results.length !== 1 ? 's' : ''} matching all constraints
                </p>
                <div className="results-list">
                  {results.map((color, index) => (
                    <div key={`${color.name}-${index}`} className="result-item">
                      <div
                        className="result-swatch"
                        style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                      />
                      <div className="result-details">
                        <div className="result-name">{color.name}</div>
                        <div className="result-rgb">
                          {`rgb(${color.r}, ${color.g}, ${color.b})`}
                        </div>
                        <div className="result-hex">
                          {rgbToHex(color.r, color.g, color.b)}
                        </div>
                      </div>
                      <div className="result-match">
                        <span className="match-badge">Match #{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-results-multi">
                <p>No colors found matching all constraints with {tolerance}% tolerance.</p>
                <p>Try:</p>
                <ul>
                  <li>Increasing the tolerance</li>
                  <li>Adjusting the distance percentages</li>
                  <li>Using fewer constraints</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiConstraintSearch
