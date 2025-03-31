
import React, { useState } from 'react';
import './Model.css';

const Model = () => {
  
  const [formData, setFormData] = useState({
    temperature_2m_max: '',
    temperature_2m_min: '',
    temperature_2m_mean: '',
    apparent_temperature_max: '',
    apparent_temperature_min: '',
    apparent_temperature_mean: '',
    sunrise: '',
    sunset: '',
    daylight_duration: '',
    sunshine_duration: '',
    precipitation_sum: '',
    rain_sum: '',
    snowfall_sum: '',
    precipitation_hours: '',
    wind_speed_10m_max: '',
    wind_gusts_10m_max: '',
    wind_direction_10m_dominant: '',
    shortwave_radiation_sum: '',
    et0_fao_evapotranspiration: '',
    weekend: '',
  });

  const [responseNumber, setResponseNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setResponseNumber(result.number);
      } else {
        console.error('Server error');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFieldLabel = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="fullscreen-tab-container">
      <h1>Weather Ridership Prediction</h1>
      <p>Enter weather conditions to predict ridership numbers.</p>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {Object.keys(formData).map((key) => (
              <div key={key} className="form-group">
                <label htmlFor={key}>{formatFieldLabel(key)}</label>
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={formatFieldLabel(key)}
                />
              </div>
            ))}
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Calculating...' : 'Calculate Ridership'}
          </button>
        </form>
      </div>

      {responseNumber !== null && (
        <div className="prediction-result">
          <div className="result-header">Prediction Results</div>
          <div className="result-value">{responseNumber}</div>
          <div className="result-label">Estimated Riders</div>
        </div>
      )}

      <div className="description-box">
        <h3>About This Prediction Tool</h3>
        <p>Include important information about this tool.</p>
        <p>Key weather factors to try messing around with:</p>
        <ul>
          <li>Temperature</li>
          <li>Precipitation </li>
          <li>TBD</li>
        </ul>
      </div>
    </div>
  );
};

export default Model;