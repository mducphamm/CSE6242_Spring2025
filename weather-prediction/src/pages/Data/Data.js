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
      <h1>About Our Data</h1>
      
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

              <div className="data-processing-note">
                <h4>Exploratory Data Analysis and Data Preparation:</h4>
                <ol>
                  <li>To assess multicollinearity among our weather features, we generated correlation heatmaps and calculated Variance 
                    Inflation Factor (VIF). Our analysis revealed some degree of correlation with VIF statistics over 10 for features
                     such as temperature min, temperature max, rain, precipitation, wing_gust_10m_max, wing_speed_10m_max, evapotranspiration,
                      shortwave radiation. We decided to drop the redundant features to mitigate the potential adverse effects of multicollinearity. </li>
                  <li>We further explored the distribution characteristics and relationships of our numerical and categorical features through 
                    histograms, box plots, and scatter plots. Rain and snow fall exhibited significant positive skewed, so we applied various 
                    scaling transformations, including log scale, square root, and box-cox methods. However, these transformations did not improve
                     the distributional properties. Based on our scatter plots, features like weekend, holiday, snowfall, wind speed and 
                     rain/precipitations indicated relatively stronger relationship with daily ridership. In contrast, temperature measures
                      such as min, max, mean, and apparent temperatures displayed a relatively weaker relationship with daily ridership. To 
                      potentially capture a more relevant aspect of temperature’s influence, we engineered a temperature range feature using min
                       and max temperature, which demonstrated a stronger correlation with the daily ridership than the individual minimum and 
                       maximum temperature features, leading to the decision to replace the latter with the temperature range in our subsequent 
                       modeling efforts. We also categorized the numerical weather_categories into three different categories (Clear or Fair
                       , Light to Moderate, Severe) based on World Meteorological Code (WMO). </li>
                
                <h4>EDA Box & Whisker Plots:</h4>
                <div class="image-container">
                  <img src="/eda_box_whisker_plots.png" alt="EDA Box & Whisker Plots"/>
                </div>
                
                <h4>EDA Scatterplots:</h4>
                <div class="image-container">
                  <img src="/eda_scatterplots.png" alt="EDA Scatterplots"/>
                </div>
                
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

                <h4>Feature Importance Bar Chart:</h4>
                <div class="image-container">
                    <img src="/feature_importance_bar_chart.png" alt="Feature Importance Bar Chart" />
                </div>

                <h4>SHAP (SHapley Additive exPlanations) Value Feature Importance:</h4>
                <div class="image-container">
                    <img src="/day_of_week_SHAP_value.png" alt="SHAP (SHapley Additive exPlanations) Value Feature Importance" />
                </div>
                <br></br>
                The impact of the features identified by our model based on the SHAP plot are as follows:
                  <ul>
                    <li>Day of the week: In general days that are early in the week such as Monday and Tuesdays tend to have higher ridership 
                      compared to the latter half of the week, although there are few instances where early week seem reduces the ridership.</li>
                    <li>Day of the week sin: Red points correspond to Wednesday and Tuesday, and they tend to increase the ridership. 
                      Blue points correspond to Saturday and Sunday, and they tend to reduce ridership. Interestingly, we see that Mondays, 
                      Thursdays and Fridays tend to have relatively neutral impact on the ridership.</li>
                    <li>Weekend indicator: Weekend (1) tends to decrease ridership whereas weekdays (0) tend to increase ridership.</li>
                    <li>Temperature mean: The higher the temperature, the lower the ridership, although these seems to be instance where 
                      lower temperature have higher ridership.</li>
                    <li>Temperature range: A wider fluctuation in daily temperature tends to decrease ridership whereas days with steady 
                      temperature tend to positively impact ridership.</li>
                    <li>Holiday indicator: Holidays tend to decrease ridership.</li>
                    <li>Daylight duration: Although it isn’t quite clear from the plot, we can see that shorter daylight tends to have a negative impact on the ridership.</li>
                    <li>Precipitation: Higher precipitation seems to reduce ridership.</li>
                    <li>wind speed: Higher wind speed has a negative impact on the ridership.</li>
                  </ul> 
                  Ridership generally peaks during mid-week (Tuesdays and Wednesdays) and decreases on weekends and holidays. Higher temperatures, 
                  wider temperature fluctuations, shorter daylight duration, increased precipitation, and stronger winds are generally associated with 
                  lower ridership. Interestingly, while weekends and holidays typically reduce ridership, Mondays, and Fridays show a relatively neutral impact. 

              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Data;