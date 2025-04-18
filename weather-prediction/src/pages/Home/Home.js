import React, { useState } from 'react';

const Home = () => {
  // loading state for async operations
  const [loading, setLoading] = useState(false);
  // store any error messages
  const [error, setError] = useState(null);
  
  // color palette for the app's theme, goes unused
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
            <div className={`column-containers ${window.innerWidth <= 1260 ? 'mobile-view' : ''}`} style={{ display: window.innerWidth <= 1260 ? 'block' : 'flex' }} >
            <div className={`project-text-content ${window.innerWidth <= 1260 ? 'mobile-view' : ''}`} style={{ width: window.innerWidth <= 1260 ? '100%' : '45%' }} >
              <div className="project-overview">
                <h2 style={{ textAlign: 'center', color:'orange' }}>Project Overview</h2>
              <div className="problem-statement">
                <h3 style={{ textAlign: 'center' }}>Problem Statement:</h3>
                <p>
                  Analyze the impact of holidays, days of the week, and weather on daily subway ridership across the 
                  New York Subway system.
                </p>
              </div>
                <p>
                  Our research analyzes how weather conditions, holidays, and temporal factors influence 
                  New York City subway ridership. By examining ridership from May 2020 
                  to Dec 2024, we've developed models to predict subway usage patterns and interactive visualizations to understand the data.
                </p>
                
                <div className="key-findings">
                  <h3 style={{ textAlign: 'center' }}>Key Findings:</h3>
                  <ul>
                    <li style={{color:'white' }}>Ridership peaks mid-week—especially on Tuesdays and Wednesdays with longer daylight duration—but declines on weekends and holidays</li>
                    <li style={{color:'white' }}>Higher temperatures, wider temperature swings, increased precipitation, and stronger winds all negatively impacts ridership</li>
                    <li style={{color:'white' }}>Heavy rainfall significantly reduces ridership across the system</li>
                    <li style={{color:'white' }}>Weekdays show consistently higher ridership than weekends</li>
                    <li style={{color:'white' }}>Holidays impact ridership patterns beyond typical seasonal trends</li>
                    <li style={{color:'white' }}>Temperature variability has a correlation with ridership</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={`project-images-here ${window.innerWidth <= 1260 ? 'mobile-view' : ''}`} style={{ width: window.innerWidth <= 1260 ? '100%' : '45%', padding:"20px", "background-color":"#333",borderRadius:"12px",maxHeight:"500px",overflow:"hidden" }} >
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{width: "48%", textAlign: "center"}}>
                  <a href="/final-poster.pdf" download>
                    <img src="poster-image.png" alt="Poster Image" style={{maxHeight:"350px", cursor: "pointer"}} />
                  </a>
                  <p>Click the image to download the final poster!</p>
                </div>
                <div style={{width: "48%", textAlign: "center"}}>
                  <a href="/final-report.pdf" download>
                    <img src="final-report-image.png" alt="Final Report Image" style={{maxHeight:"350px", cursor: "pointer"}} />
                  </a>
                  <p>Click the image to download the final report!</p>
                </div>
              </div>
            </div>

            </div>

            <div className="meet-the-team">
              <h3>Meet the Team:</h3>
              <div className="key-insights">
                <div className="insights-grid">
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3 style={{ textAlign: 'center' }}>Jia Bloom</h3>
                    <p style={{ textAlign: 'center' }}>jia.bloom@gatech.edu</p>
                    <div style={{ textAlign: 'center' }}>
                      <a href="https://www.linkedin.com/in/jiabloom/" className="custom-link" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                      </a>
                    </div>
                  </div>

                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3 style={{ textAlign: 'center' }}>Noah Clark</h3>
                    <p style={{ textAlign: 'center' }}>nclark44@gatech.edu</p>
                    <div style={{ textAlign: 'center' }}>
                      <a href="https://www.linkedin.com/in/noahdclark-cs/" className="custom-link" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                      </a>
                    </div>
                  </div>
                  
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3 style={{ textAlign: 'center' }}>Kshitij Gurung</h3>
                    <p style={{ textAlign: 'center' }}>kgurung8@gatech.edu</p>
                    <div style={{ textAlign: 'center' }}>
                      <a href="https://www.linkedin.com/in/kshitij-gurung-7866ab136/" className="custom-link" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                      </a>
                    </div>
                  </div>
                  
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3 style={{ textAlign: 'center' }}>Chris Enslin</h3>
                    <p style={{ textAlign: 'center' }}>censlin3@gatech.edu</p>
                    <div style={{ textAlign: 'center' }}>
                      <a href="https://www.linkedin.com/in/christofelenslin/" className="custom-link" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                      </a>
                    </div>
                  </div>
                  
                  <div className="insight-card">
                    <div className="insight-icon">👤</div>
                    <h3 style={{ textAlign: 'center' }}>Minh Duc Pham</h3>
                    <p style={{ textAlign: 'center' }}>mpham80@gatech.edu</p>
                    <div style={{ textAlign: 'center' }}>
                      <a href="https://www.linkedin.com/in/duc-pham1999/" className="custom-link" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                      </a>
                    </div>
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