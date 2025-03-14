import React, { useState } from 'react';

const Model = () => {
  // Form state for each field
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

  const [responseNumber, setResponseNumber] = useState(null); // To store the returned number

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        setResponseNumber(result.number); // Assuming the response is { number: <value> }
      } else {
        console.error('Server error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Tab 3: Weather Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label htmlFor={key}>{key.replace(/_/g, ' ').toUpperCase()}:</label>
            <input
              type="text"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
            />
          </div>
        ))}

        <button type="submit">Submit</button>
      </form>

      {responseNumber !== null && (
        <div>
          <h3>Ridership Prediction: {responseNumber}</h3>
        </div>
      )}
    </div>
  );
};

export default Model;