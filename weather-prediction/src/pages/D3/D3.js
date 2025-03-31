import React, { useState } from 'react';
import './D3.css';

const D3 = () => {
  const [view, setView] = useState('temperature'); 
  const [dayType, setDayType] = useState('all'); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState("Loading...");
  
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
      <h1>Weather Impact on NYC Subway Ridership</h1>
      
      <div className="controls">
        <div className="view-selector">
          <button
            className={view === 'temperature' ? 'active' : ''}
            onClick={() => setView('temperature')}
          >
            Temperature Analysis
          </button>
          <button
            className={view === 'precipitation' ? 'active' : ''}
            onClick={() => setView('precipitation')}
          >
            Precipitation Analysis
          </button>
          <button
            className={view === 'scatter' ? 'active' : ''}
            onClick={() => setView('scatter')}
          >
            Scatter Plot
          </button>
        </div>
        
        <div className="day-selector">
          <button
            className={dayType === 'all' ? 'active' : ''}
            onClick={() => setDayType('all')}
          >
            All Days
          </button>
          <button
            className={dayType === 'weekday' ? 'active' : ''}
            onClick={() => setDayType('weekday')}
          >
            Weekdays
          </button>
          <button
            className={dayType === 'weekend' ? 'active' : ''}
            onClick={() => setDayType('weekend')}
          >
            Weekends
          </button>
        </div>
      </div>
      
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
          {view === 'temperature' && (
            <div className="chart-container">
              <div className="chart-description">
                <h3>How Temperature Affects Ridership</h3>
                <p>
                  Example: Weekday ridership is consistently higher than weekend ridership across all temperature ranges.
                </p>
              </div>
            </div>
          )}
          
          {view === 'precipitation' && (
            <div className="chart-container">
              <div className="chart-description">
                <h3>How Precipitation Affects Ridership</h3>
                <p>
                  Example: Heavy rain appears to have the most significant impact.
                </p>
              </div>
            </div>
          )}
          
          {view === 'scatter' && (
            <div className="chart-container">
              <div className="chart-description">
                <h3>Temperature vs. Ridership Relationship</h3>
                <p>
                  Example: The visaul shows the overall trend and variation in ridership.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="key-insights">
        <h2>Key Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🌡️</div>
            <h3>Temperature Effect</h3>
            <p>TBD.</p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🌧️</div>
            <h3>Rain Impact</h3>
            <p>TBD.</p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">📅</div>
            <h3>Day Type</h3>
            <p>TBD.</p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🔄</div>
            <h3>Seasonality</h3>
            <p>TBD.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D3;