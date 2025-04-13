import React, { useState } from 'react';
import './Data.css';

const Data = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState("datasets");

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="fullscreen-tab-container">
      <h1 className="page-title">About Our Data</h1>
      
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="data-content">
          {/* Static "About the data" section that is always visible */}
          <div className="introduction-section">
            <div className="section-header-static">
              <h2>About the data</h2>
            </div>
            <div className="section-content-static">
              <p>
                Weather conditions can significantly influence people's decisions to use public transportation, yet the extent of this
                impact is not fully understood. In a city like New York, where millions depend on the subway, understanding
                these patterns can support more informed decisions by both commuters and transit planners.
              </p>
              <p>
                Our research aims to analyze the impact of holidays, days of the week, and weather on daily subway ridership
                across the New York Subway system, providing insights for both operational planning and commuter decision-making.
              </p>
            </div>
          </div>

          <section className="data-section">
            <div className="section-header" onClick={() => toggleSection('datasets')}>
              <h2>Datasets & Preprocessing</h2>
              <span className={`expand-icon ${expandedSection === 'datasets' ? 'expanded' : ''}`}>+</span>
            </div>
            <div className={`section-content ${expandedSection === 'datasets' ? 'expanded' : ''}`}>
              <h3>Primary Dataset: MTA Subway Hourly Ridership</h3>
              <p>
                Our main dataset was the <strong>MTA Subway Hourly Ridership: 2020-2024</strong> dataset from data.ny.gov, which
                contains ~111 million rows and 12 columns. It includes time series data on hourly ridership at
                each station complex, originally broken down by payment type.
              </p>
              <p>
                By building a normalized SQLite database, we were able to reduce the dataset size from a &gt;16 GB CSV file to a
                7 GB database, aggregated by station and hour. The resulting hourly ridership values served as the dependent
                variable in our analysis.
              </p>
              
              <h3>Additional Data Sources:</h3>
              <ul className="data-sources-list">
                <li>
                  <strong>Weather Data</strong> — Accessed historical weather data from Open-meteo API (1,325 rows x 26 cols)
                  <a href="https://www.open-meteo.com" className="custom-link" target="_blank" rel="noopener noreferrer">
                    [Source]
                  </a>
                </li>
                <li>
                  <strong>Federal Holidays</strong> — Sourced from the U.S. Office of Personnel Management (11 rows x 2 cols)
                  <a href="https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/#url=Overview" className="custom-link" target="_blank" rel="noopener noreferrer">
                    [Source]
                  </a>
                </li>
                <li>
                  <strong>School Holidays</strong> — Sourced from NYC Public Schools website (39 rows x 3 cols)
                  <a href="https://www.schools.nyc.gov/calendar" className="custom-link" target="_blank" rel="noopener noreferrer">
                    [Source]
                  </a>
                </li>
              </ul>
              
              <div className="data-processing-note">
                <h4>Data Processing Steps:</h4>
                <ol>
                  <li>Database normalization to reduce size</li>
                  <li>Aggregation of ridership by station and hour</li>
                  <li>Joining daily ridership data with historical weather data</li>
                  <li>Removal of redundant weather predictors identified through correlation matrix analysis</li>
                  <li>Feature scaling, including log transformations for right-skewed variables (such as precipitation and snow)</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="data-section">
            <div className="section-header" onClick={() => toggleSection('feature-engineering')}>
              <h2>Feature Engineering</h2>
              <span className={`expand-icon ${expandedSection === 'feature-engineering' ? 'expanded' : ''}`}>+</span>
            </div>
            <div className={`section-content ${expandedSection === 'feature-engineering' ? 'expanded' : ''}`}>
              <p>
                After joining the daily ridership data with the historical weather data, we applied several techniques to optimize our feature set:
              </p>
              
              <div className="feature-engineering-steps">
                <h4>Key Steps:</h4>
                <ul>
                  <li>
                    <strong>Redundancy Removal:</strong> Removed six redundant weather predictors identified through correlation matrix analysis
                    of all variables
                  </li>
                  <li>
                    <strong>Feature Scaling:</strong> Applied appropriate scaling to normalize data ranges
                  </li>
                  <li>
                    <strong>Log Transformations:</strong> Applied to right-skewed variables such as precipitation and snow
                  </li>
                  <li>
                    <strong>Temporal Features:</strong> Created engineered features capturing day of week and holiday effects
                  </li>
                </ul>
              </div>
              
              <div className="correlation-matrix">
                <div className="graph-placeholder">
                  <p className="placeholder-text">Image here</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Data;