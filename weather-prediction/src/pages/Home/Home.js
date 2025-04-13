import React, { useState } from 'react';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const colors = {
    background: '#1e1e1e',
    text: '#f5f5f5',
    accent: '#4CAF50',
    secondary: '#81C784',
    bars: '#4CAF50',
    scatter: '#81C784',
    grid: '#444',
    tooltip: '#333',
    weekend: '#FF9800',
    weekday: '#2196F3'
  };

  return (
    <div className="fullscreen-tab-container">
      <h1>Predicting Ridership of New York City Subway</h1>
      
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
        <div className="chart-area">
          <div className="chart-container">
            <div className="project-overview">
              <h2>Project Overview</h2>
            <div className="problem-statement">
              <h3>Problem Statement:</h3>
              <p>
                Analyze the impact of holidays, days of the week, and weather on daily subway ridership across the 
                New York Subway system.
              </p>

              <h3>Dataset:</h3>
              <p>
                Dataset used in our analysis was sourced from data.ny.gov (
                <a href="https://data.ny.gov/Transportation/MTA-Subway-Hourly-Ridership-2020-2024/wujg-7c2s/about_data" className="custom-link">
                  Link
                </a>
                ) capturing MTA Subway Hourly Ridership from 2020-2024. 
                We then preprocessed the data, upon which our models 
                and visualizations were built.
              </p>
            </div>
              <p>
                Our research analyzes how weather conditions, holidays, and temporal factors influence 
                New York City subway ridership. By examining --- from date ranges --- 
                to ---, we've developed models to predict subway usage patterns and interactive visualizations to understand the data.
              </p>
              
              <div className="key-findings">
                <h3>Key Findings:</h3>
                <ul>
                  <li>Heavy rainfall significantly reduces ridership across the system</li>
                  <li>Weekdays show consistently higher ridership than weekends</li>
                  <li>Holidays impact ridership patterns beyond typical seasonal trends</li>
                  <li>Temperature variability has a correlation with ridership</li>
                </ul>
              </div>
              
              <div className="methodology-highlight">
                <h3>Methodology Highlights:</h3>
                <p>
                  Put overview of methodology here.
                </p>
              </div>
            </div>

            <div className="meet-the-team">
              <h3>Meet the Team:</h3>
              <div className="key-insights">
                <div className="insights-grid">
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3>Jia Bloom</h3>
                    <p style={{ textAlign: 'center' }}>jia.bloom@gatech.edu</p>
                  </div>

                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3>Noah Clark</h3>
                    <p style={{ textAlign: 'center' }}>nclark44@gatech.edu</p>
                  </div>
                  
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3>Kshitij Gurung</h3>
                    <p style={{ textAlign: 'center' }}>kgurung8@gatech.edu</p>
                  </div>
                  
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3>Chris Enslin</h3>
                    <p style={{ textAlign: 'center' }}>censlin3@gatech.edu</p>
                  </div>
                  
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3>Minh Duc Pham</h3>
                    <p style={{ textAlign: 'center' }}>mpham80@gatech.edu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;