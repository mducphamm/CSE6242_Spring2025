import React, { useState } from 'react';
import './ML.css';

const ML = () => {
  const [expandedSection, setExpandedSection] = useState("innovations");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="fullscreen-tab-container">
      <h1>Analysis & Modeling</h1>
      
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
        <div className="ml-content">
          {/* Static "About our methodology" section that is always visible */}
          <div className="methodology-section">
            <div className="section-header-static">
              <h2>About our methodology</h2>
            </div>
            <div className="section-content-static">
              <p>
                Our research employs a comprehensive analytical approach to understand how weather conditions, holidays, 
                and weekday patterns influence subway ridership in New York City. We began with exploratory time series 
                analysis to identify underlying patterns before progressing to more sophisticated modeling techniques.
              </p>
              <p>
                We evaluated multiple model types to find the optimal balance between interpretability and predictive power, 
                ranging from traditional statistical approaches to advanced machine learning algorithms. Our methodology 
                prioritizes robustness through cross-validation and careful feature engineering to capture complex 
                interactions between environmental factors and ridership behavior.
              </p>
            </div>
          </div>

          <section className="data-section">
            <div className="section-header" onClick={() => toggleSection('innovations')}>
              <h2>Methodological Innovations</h2>
              <span className={`expand-icon ${expandedSection === 'innovations' ? 'expanded' : ''}`}>+</span>
            </div>
            <div className={`section-content ${expandedSection === 'innovations' ? 'expanded' : ''}`}>
              <div className="innovations-list">
                <p>Our project introduces several key innovations relative to prior research on weather and transit ridership:</p>
                <div className="innovation-card">
                  <div className="innovation-number">1</div>
                  <div className="innovation-content">
                    <h4>NYC Focus</h4>
                    <p>Prior studies have primarily examined transit systems in China and other Asian cities.</p>
                  </div>
                </div>
                
                <div className="innovation-card">
                  <div className="innovation-number">2</div>
                  <div className="innovation-content">
                    <h4>Expanded Modeling</h4>
                    <p>Unlike many existing studies which rely solely on linear regression, we evaluate a wider range of models to improve predictive power and capture nonlinear relationships.</p>
                  </div>
                </div>
                
                <div className="innovation-card">
                  <div className="innovation-number">3</div>
                  <div className="innovation-content">
                    <h4>Integrated Weather & Holiday Data</h4>
                    <p>Previous research often focuses solely on weather effects, whereas our approach incorporates holidays.</p>
                  </div>
                </div>
                
                <div className="innovation-card">
                  <div className="innovation-number">4</div>
                  <div className="innovation-content">
                    <h4>Interactive Public Tool</h4>
                    <p>Our development of an interactive platform enhances the practical utility of our research compared to conventional static studies.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="data-section">
            <div className="section-header" onClick={() => toggleSection('timeseries')}>
              <h2>Time Series Analysis</h2>
              <span className={`expand-icon ${expandedSection === 'timeseries' ? 'expanded' : ''}`}>+</span>
            </div>
            <div className={`section-content ${expandedSection === 'timeseries' ? 'expanded' : ''}`}>
              <p>
                As part of exploratory data analysis, we first conducted basic time series analysis. Our autoregressive (AR) models
                served as a comparative benchmark for more complex models augmented with additional features.
              </p>
              
              <div className="time-series-findings">
                <h4>Key Findings:</h4>
                <ul>
                  <li><strong>Trend:</strong> Decomposition revealed a weak but slightly positive trend in ridership</li>
                  <li><strong>Seasonality:</strong> Both the seasonal component and autocorrelation analysis showed strong weekly cyclicality</li>
                  <li><strong>Holiday Impact:</strong> Models over-predicted during holidays, highlighting the importance of incorporating holiday data</li>
                </ul>
              </div>
              
              <div className="models-explored">
                <h4>Initial Models Tested:</h4>
                <ul>
                  <li>Holt-Winters Exponential Smoothing</li>
                  <li>SARIMA (Seasonal AutoRegressive Integrated Moving Average)</li>
                </ul>
              </div>
              
              <div className="weekly-seasonality-graph">
                <div className="graph-placeholder">
                  <p className="placeholder-text">Image here</p>
                </div>
              </div>
            </div>
          </section>

          <section className="data-section">
            <div className="section-header" onClick={() => toggleSection('modeling')}>
              <h2>Modeling Approaches</h2>
              <span className={`expand-icon ${expandedSection === 'modeling' ? 'expanded' : ''}`}>+</span>
            </div>
            <div className={`section-content ${expandedSection === 'modeling' ? 'expanded' : ''}`}>
              <div className="modeling-approaches">
                <h3>Multiple Linear Regression (OLS)</h3>
                <p>
                  We fit an ordinary least squares multiple linear regression on the reduced and scaled set of weather variables,
                  achieving TBD.
                </p>
                
                <h3>Random Forest & Gradient Boosting</h3>
                <p>
                  Given the nonlinear relationships and complex feature interactions observed in the data, we implemented a
                  Random Forest model with Gradient Boosting due to its ability to handle high-dimensional data and capture non-additive effects.
                </p>
                <p>
                  We developed several variants:
                </p>
                <ul>
                  <li><strong>Random Forest v1:</strong> Base model with weather and holiday features</li>
                  <li><strong>Random Forest v2:</strong> Incorporated PCA for dimensionality reduction</li>
                  <li><strong>Random Forest v3:</strong> Reintroduced temporal features (e.g., day of the week)</li>
                </ul>
                <p>
                  The model confirmed exploratory insights, attributing significant predictive importance to weekday effects, 
                  precipitation (negative), and daily temperature variability (positive).
                </p>
                
                <h3>Other Models Tested</h3>
                <p>
                  We explored several alternative methodologies to enhance predictive performance:
                </p>
                <ul>
                  <li><strong>Regularized Regression:</strong> Ridge, Lasso, and Elastic Net regression</li>
                  <li><strong>Recurrent Neural Network (RNN):</strong> To capture sequential dependencies in ridership data, leveraging the data's weekly seasonality</li>
                </ul>
              </div>
              
              <div className="model-performance">
                <h4>Model Performance Summary:</h4>
                <div className="performance-table-container">
                  <table className="performance-table">
                    <thead>
                      <tr>
                        <th>Model</th>
                        <th>Predictors</th>
                        <th>RMSE</th>
                        <th>R²</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Holt-Winters Exponential Smoothing</td>
                        <td>AR features</td>
                        <td>554,598</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>SARIMA</td>
                        <td>AR features</td>
                        <td>617,654</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Multiple Linear Regression (OLS)</td>
                        <td>Weather</td>
                        <td>476,386</td>
                        <td>0.648</td>
                      </tr>
                      <tr>
                        <td>Random Forest v1</td>
                        <td>Weather, Holidays</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Random Forest v2 (with PCA)</td>
                        <td>Weather, Holidays</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Random Forest v3</td>
                        <td>Weather, Holidays, Temporal</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                      <tr>
                        <td>Recurrent Neural Network (RNN)</td>
                        <td>AR features, Weather, Holidays</td>
                        <td>-</td>
                        <td>-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="actual-vs-predicted">
                <div className="graph-placeholder">
                  <p className="placeholder-text">Image here</p>
                </div>
              </div>
            </div>
          </section>


          <section className="data-section">
            <div className="section-header" onClick={() => toggleSection('conclusions')}>
              <h2>Conclusions</h2>
              <span className={`expand-icon ${expandedSection === 'conclusions' ? 'expanded' : ''}`}>+</span>
            </div>
            <div className={`section-content ${expandedSection === 'conclusions' ? 'expanded' : ''}`}>
              <p>
                TBD
              </p>
              <p>
                TBD
              </p>
              
              <div className="key-findings">
                <h3>Key Findings:</h3>
                <div className="findings-grid">
                  <div className="finding-card">
                    <div className="finding-icon"></div>
                    <h4>TBD</h4>
                    <p>TBD.</p>
                  </div>
                  
                  <div className="finding-card">
                    <div className="finding-icon">🌧️</div>
                    <h4>TBD</h4>
                    <p>TBD.</p>
                  </div>
                  
                  <div className="finding-card">
                    <div className="finding-icon">📅</div>
                    <h4>TBD</h4>
                    <p>TBD.</p>
                  </div>
                  
                  <div className="finding-card">
                    <div className="finding-icon">🔄</div>
                    <h4>TBD</h4>
                    <p>TBD.</p>
                  </div>
                </div>
              </div>
              
              <div className="future-work">
                <h3>Future Work:</h3>
                <ul>
                  <li>TBD</li>
                  <li>TBD</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ML;