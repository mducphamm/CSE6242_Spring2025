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

              <p>
              <h4>Time Series</h4>
                To conduct a comprehensive time series analysis, the necessary Python libraries were imported, including pandas for 
                data manipulation, matplotlib.pyplot for data visualization, and statsmodels for time series modeling. These libraries
                provided the foundational tools required for loading, processing, analyzing, and visualizing the time series data. 

              <h4>Data Preparation and Initial Exploration</h4>
                The dataset was loaded into a Pandas DataFrame, and the date column was parsed as a datetime object to ensure proper 
                temporal handling. This column was then set as the index of the DataFrame, as many time series functions in Python rely 
                on a correctly formatted datetime index. The frequency of the time series (e.g., daily, monthly) was verified, and where
                necessary, the .asfreq() method was applied to standardize the temporal resolution. 

                An initial exploratory data analysis (EDA) was conducted by plotting the time series to visually assess its behavior. 
                This step allowed for the identification of overarching trends, recurring seasonal patterns, and potential outliers. 
                A boxplot of the ridership data was generated to detect anomalies, but no significant outliers were found. 

              <h4>Seasonal Decomposition and Autocorrelation Analysis</h4> 
                To better understand the underlying structure of the time series, seasonal decomposition was performed using both additive
                and multiplicative models. This technique decomposes the series into its constituent components: trend, seasonality, and 
                residuals. The decomposition revealed a strong and consistent weekly trend, with Sunday exhibiting the lowest ridership 
                (trough) and Wednesday the highest (crest). The presence of weekly seasonality was further confirmed through autocorrelation 
                analysis, which yielded a high autocorrelation value of 0.87 at a 7-day lag. Given that a value of 1 indicates a perfect 
                positive relationship, this result strongly supports the existence of a dominant weekly pattern in the data. 

              <h4>Stationarity Testing and Model Selection</h4> 
                A critical assumption for many time series models, including ARIMA, is stationarity—meaning that the statistical properties 
                (mean, variance, autocorrelation) of the series remain constant over time. To assess stationarity, the Augmented Dickey-Fuller 
                (ADF) test was applied. A low p-value from this test indicated that the transformed series could be considered stationary. 
                Additionally, a linear regression model was fitted to the trend component of the decomposition, revealing a weak, slightly 
                positive trend. However, this trend was not statistically significant enough to violate the stationarity assumption, ensuring
                that the conditions for time series modeling remained valid. 
                The dataset was then partitioned into training (90%) and testing (10%) sets to facilitate model evaluation. Given the strong 
                seasonal component, a Holt-Winters Exponential Smoothing Model was selected over simple exponential smoothing, as the latter 
                does not account for seasonality. Hyperparameter optimization was conducted systematically, testing combinations of additive, 
                multiplicative, or no trend/seasonality components. The best-performing model, determined by AIC and RMSE, featured no trend 
                with multiplicative seasonality. 

              <h4>Residual Analysis and Model Diagnostics</h4> 
                Residual analysis for both the Holt-Winters model and the decomposition revealed non-normal residuals, characterized by a 
                strong negative skew. A Q-Q plot further confirmed that the residuals deviated from normality. Examination of the largest 
                residuals indicated that holidays (e.g., Christmas) significantly impacted model performance, with the model consistently 
                overpredicting ridership on these days. 

              <h4>SARIMA Modeling</h4> 
                To further refine the analysis, an auto-ARIMA approach was employed to identify optimal hyperparameters for a SARIMA (Seasonal 
                ARIMA) model. The best parameters were found to be:
                <br></br>
                <br></br>
                Order (p, d, q) = (3, 1, 2) 
                <br></br>
                <br></br>
                <li>p = 3: The model incorporates the past three lags of the series for prediction.</li> 
                <li>d = 1: The series was differenced once to achieve stationarity.</li> 
                <li>q = 2: The model accounts for the last two lagged forecast errors.</li>
                <br></br>

                Seasonal Order (P, D, Q, s) = (2, 0, 2, 7) 
                <br></br>
                <br></br>
                <ul>
                  <li>P = 2: The model includes values from two prior seasonal periods (i.e., the same day in the last two weeks).</li>
                  <li>D = 0: No seasonal differencing was required, as the data was already seasonally stationary.</li>
                  <li>Q = 2: The model incorporates seasonal forecast errors from two previous seasons.</li>
                  <li>s = 7: The seasonal period was set to 7, aligning with the dominant weekly pattern.</li>
                </ul>
                <br></br>
                Despite the rigorous parameter selection, the SARIMA model's residuals exhibited the same right-skewed distribution as earlier models, with holidays continuing to introduce prediction errors. The RMSE of 617,654 was higher than that of the Holt-Winters model, suggesting that the latter provided superior predictive performance for this dataset. 
                <br></br>
                <br></br>
              </p>
              
              <div className="time-series-findings">
                <h4>Key Findings:</h4>
                <ul>
                  <li><strong>Trend:</strong> Decomposition revealed a weak but slightly positive trend in ridership</li>
                  <li><strong>Seasonality:</strong> Both the seasonal component and autocorrelation analysis showed strong weekly cyclicity</li>
                  <li><strong>Holiday Impact:</strong> Models over-predicted during holidays, highlighting the importance of incorporating holiday data</li>
                </ul>
              </div>
              
              <div className="weekly-seasonality-graph">
                <div>
                  <h4>SARIMA Forecast Plot:</h4>
                  <div class="image-container">
                    <img src="/sarima_forecast_line_chart.png" alt="SARIMA Forecast Plot"/>
                  </div>
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
                <h3>Machine Learning Predictive Models  </h3>
                <p>
                  We explored and evaluated several modeling approaches, ranging from traditional regression techniques to advanced ensemble learning to time-series. 
                  
                  <h4>Regularized regression:</h4> 
                  Building off from the linear regression model, we investigated the potential benefit of regularized regression such as Ridge, Lasso, Elastic Net. 
                  These models were considered to mitigate overfitting, reduce the impact of multicollinearity, and improve general performance, especially in high-dimension datasets.  
                  Results were slightly improved. However, only slight improvements were noticed over the baseline linear regression, requiring further enhancements.

                  <h4>Ensemble Learning with Tree based models:</h4> 
                  Building off from our previous Random Tree learner that we built from scratch, we levered several tree-based ensemble models available in the Scikit-learn library,
                  which offers extended hyper parameters and a more robust algorithm for better modeling.
                  <ul>
                    <li>Decision Tree: A fundamental tree-based model serving as a baseline.</li>
                    <li>Random Forest: An ensemble of decision trees trained on random subsets of the data and features.</li>
                    <li>XGBoost (Extreme Gradient Boosting): A gradient boosting algorithm known for its efficiency and performance.</li>
                    <li>CatBoost: A gradient boosting algorithm that handles categorical features natively.</li>  
                  </ul>   
                  For each model, we performed grid search with cross validation and evaluated performance based on R-squared and RMSE score. As expected, the tree-based models
                  performed much better compared to regularized regressions. In particular, Random Forest model achieved the best performance (R-squared: 0.68, RMSE: 443,943) 
                  with the following optimized hyperparameters:
                  <ul>
                    <li>max_depth: 10</li>
                    <li>min_samples_leaf: 6</li>
                    <li>min_samples_split: 2</li>
                    <li>n_estimators: 50</li>
                  </ul>

                  Some of the important features identified by the Random Forest model were weekend indicator, mean and range of temperature, holiday indicator, 
                  daylight duration and wind speed. 

                  The improved performance of tree-based models suggests their effectiveness in capturing the non-linear complexities inherent in the dataset. 
                  
                  <h4>Recurrent Neural Network (RNN) with Long Short-Term Memory (LSTM):</h4> 
                  Recognizing the sequential nature of the time-series data, we explored the use of RNN with LSTM, which is designed to capture temporal dependencies
                  that traditional regression models often fail to account for. We engineered several temporal features from the ‘date’ variable, including year, month,
                  day, day of the week, and a sinusoidal representation of the day of week to capture cyclical patterns. As anticipated, the LSTM model significantly 
                  improved the prediction performance, achieving R-squared of 0.72 and RMSE of 429, 260.

                  <h4>Integration of Temporal Features with Regression and Tree based Models</h4> 
                  Given the success of the temporal features in the LSTM model, we investigate whether incorporating these features could enhance the performance of previously
                  considered regression and tree-based models. Surprisingly, Random Forest model, when trained with engineered temporal features, yielded the most promising 
                  results, with R-squared of 0.748 and RMSE of 398,865. This indicates that the model could explain 74.8% of the variability in NYC’s daily Subway ridership, 
                  which is great given the real-world data and limited scope of weather and holiday features.  
                  <br></br>
                  <br></br>
                  The optimized hyperparameters for this best-performing Random Forest model with temporal features were the following:
                  <ul>
                    <li>max_depth: 20</li>
                    <li>min_samples_leaf: 2</li>
                    <li>min_samples_split: 2</li>
                    <li>n_estimators: 100</li>
                  </ul>
                  <br></br>
                  Some of the highest impacting features are as follows: 
                  <ul>
                    <li>Day of the Week</li>
                    <li>Day of the Week Sin</li>
                    <li>Weekend Indicator</li>
                    <li>Temperature Mean</li>
                    <li>Holiday Indicator</li>
                    <li>Daylight Duration</li>
                    <li>Precipitation</li>
                    <li>Wind Speed</li>
                  </ul>
                </p>
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
                        <td>Random Forest</td>
                        <td>temporal/AR data, weather data, holiday data</td>
                        <td>398,865</td>
                        <td>0.748</td>
                      </tr>
                      <tr>
                        <td>CATBoost Regressor</td>
                        <td>temporal/AR data, weather data, holiday data</td>
                        <td>409,241</td>
                        <td>0.735</td>
                      </tr>
                      <tr>
                        <td>Recurrent Neural Network (RNN) + LSTM</td>
                        <td>temporal/AR data, weather data, holiday data</td>
                        <td>429,260</td>
                        <td>0.729</td>
                      </tr>
                      <tr>
                        <td>Ridge Regression</td>
                        <td>temporal/AR data, weather data, holiday data</td>
                        <td>482,812</td>
                        <td>0.631</td>
                      </tr>
                      <tr>
                        <td>Random Forest w/ PCA</td>
                        <td>weather data, holiday data</td>
                        <td>483,999</td>
                        <td>0.629</td>
                      </tr>
                      <tr>
                        <td>Multiple Linear Regression</td>
                        <td>weather data, holiday data</td>
                        <td>515,576</td>
                        <td>0.580</td>
                      </tr>
                      <tr>
                        <td>Holt-Winters Exponential Smoothing</td>
                        <td>temporal/AR data</td>
                        <td>554,598</td>
                        <td>n/a</td>
                      </tr>
                      <tr>
                        <td>SARIMA</td>
                        <td>temporal/AR data</td>
                        <td>617,654</td>
                        <td>n/a</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ML;