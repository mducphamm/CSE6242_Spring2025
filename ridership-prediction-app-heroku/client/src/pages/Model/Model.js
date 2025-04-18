import React, { useState, useEffect } from 'react';
import './Model.css';
import { getPrediction } from '../../services/api_service';

const Model = () => {
  const [activeView, setActiveView] = useState('basic');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  // Default variations for different weather conditions
  const defaultVariations = {
    optimal: {
      temperature_2m_mean: '65',
      daylight_duration: '12',
      sunshine_duration: '24',
      precipitation_sum: '0',
      snowfall_sum: '0',
      wind_speed_10m_max: '25',
      wind_direction_10m_dominant: '180',
      shortwave_radiation_sum: '20',
      weekend: '0',
      is_holiday: '0',
      apparent_temp_range: '100',
      temp_2m_range: '100',
      Clear_or_FairWeather: '1',
      Light_to_Moderate: '0',
      Severe_Weather: '0'
    },
    average: {
      temperature_2m_mean: '35',
      daylight_duration: '10',
      sunshine_duration: '20',
      precipitation_sum: '5',
      snowfall_sum: '0',
      wind_speed_10m_max: '45',
      wind_direction_10m_dominant: '240',
      shortwave_radiation_sum: '10',
      weekend: '1',
      is_holiday: '1',
      apparent_temp_range: '30',
      temp_2m_range: '30',
      Clear_or_FairWeather: '0',
      Light_to_Moderate: '1',
      Severe_Weather: '1'
    },
    poor: {
      temperature_2m_mean: '5',
      daylight_duration: '10',
      sunshine_duration: '5',
      precipitation_sum: '8',
      snowfall_sum: '6',
      wind_speed_10m_max: '30',
      wind_direction_10m_dominant: '270',
      shortwave_radiation_sum: '5',
      weekend: '1',
      is_holiday: '1',
      apparent_temp_range: '15',
      temp_2m_range: '15',
      Clear_or_FairWeather: '0',
      Light_to_Moderate: '0',
      Severe_Weather: '1'
    }
  };

  // all possible fields for the model
  const allFields = [
    'date',
    'temperature_2m_mean', 'daylight_duration', 'sunshine_duration',
    'precipitation_sum', 'snowfall_sum', 'wind_speed_10m_max',
    'wind_direction_10m_dominant', 'shortwave_radiation_sum', 'weekend',
    'is_holiday', 'apparent_temp_range', 'temp_2m_range',
    'Clear_or_FairWeather', 'Light_to_Moderate', 'Severe_Weather'
  ];

  // helper to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // helper to check if a date is a weekend
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return (day === 5 || day === 6) ? '1' : '0'; // 6 is Sunday, 5 is Saturday
  };

  // starting values for the form
  const initialFormState = {
    date: getTodayDate(),
    temperature_2m_mean: '65',
    daylight_duration: '13',
    sunshine_duration: '25',
    precipitation_sum: '0',
    snowfall_sum: '0',
    wind_speed_10m_max: '10',
    wind_direction_10m_dominant: '180',
    shortwave_radiation_sum: '15',
    weekend: '0',
    is_holiday: '0',
    apparent_temp_range: '24',
    temp_2m_range: '20',
    Clear_or_FairWeather: '1',
    Light_to_Moderate: '0',
    Severe_Weather: '0'
  };

  // state for the form and prediction results
  const [formData, setFormData] = useState(initialFormState);
  const [predictions, setPredictions] = useState({
    user: null,
    optimal: null,
    average: null,
    poor: null
  });

  // auto-update weekend flag when date changes
  useEffect(() => {
    if (formData.date) {
      const weekendValue = isWeekend(formData.date);
      setFormData(prevData => ({
        ...prevData,
        weekend: weekendValue
      }));
    }
  }, [formData.date]);

  // handles regular input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handles slider input changes
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // makes api call to get ridership prediction
  const calculatePrediction = async (data) => {
    try {
      const prediction = await getPrediction(data);
      setApiError(null);
      return prediction;
    } catch (error) {
      console.error("Error using RF prediction API:", error);
      setApiError("Failed to get prediction from API. Please try again later.");
      throw error;
    }
  };

  // formats field names for display
  const formatFieldLabel = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // defines which fields to show in different views
  const getFieldGroups = () => {
    return {
      basicFields: [
        'date',
        'weekend',
        'temperature_2m_mean',
        'precipitation_sum',
        'is_holiday'
      ],
      advancedFields: [
        'date',
        'weekend',
        'is_holiday',
        'temperature_2m_mean',
        'precipitation_sum',
        'snowfall_sum',
        'apparent_temp_range',
        'wind_speed_10m_max'
      ],
      allFields: [
        'date',
        'is_holiday', 
        'weekend',
        'temperature_2m_mean', 
        'daylight_duration', 
        'sunshine_duration',
        'precipitation_sum', 
        'snowfall_sum', 
        'wind_speed_10m_max',
        'wind_direction_10m_dominant', 
        'shortwave_radiation_sum', 
        'apparent_temp_range', 
        'temp_2m_range',
        'Clear_or_FairWeather', 
        'Light_to_Moderate', 
        'Severe_Weather'
      ]
    };
  };
  
  // grab the field groups
  const { basicFields, advancedFields, allFields2 } = getFieldGroups();
  
  // returns fields to display based on active view
  const getVisibleFields = () => {
    switch(activeView) {
      case 'basic':
        return basicFields;
      case 'advanced':
        return advancedFields;
      case 'all':
      default:
        return allFields;
    }
  };
  
  // check if field should use a slider input
  const shouldUseSlider = (field) => {
    if (['date', 'weekend', 'is_holiday', 'Clear_or_FairWeather', 'Light_to_Moderate', 'Severe_Weather'].includes(field)) {
      return false;
    }
    return true;
  };
  
  // config for slider min/max/step and units
  const getSliderConfig = (field) => {
    const config = {
      temperature_2m_mean: { min: -10, max: 120, step: 1, unit: '°F' },
      daylight_duration: { min: 0, max: 24, step: 0.5, unit: 'hours' },
      sunshine_duration: { min: 0, max: 24, step: 1, unit: 'hours' },
      precipitation_sum: { min: 0, max: 8, step: 0.1, unit: 'cm' },
      snowfall_sum: { min: 0, max: 8, step: 0.1, unit: 'cm' },
      wind_speed_10m_max: { min: 0, max: 40, step: 1, unit: 'mph' },
      wind_direction_10m_dominant: { min: 0, max: 360, step: 5, unit: '°' },
      shortwave_radiation_sum: { min: 0, max: 30, step: 0.5, unit: 'W/m²' },
      apparent_temp_range: { min: 0, max: 50, step: 1, unit: '°F' },
      temp_2m_range: { min: 0, max: 50, step: 1, unit: '°F' }
    };
    
    return config[field] || { min: 0, max: 100, step: 1, unit: '' };
  };
  
  // gets default values for fields not shown in current view
  const getDefaultValues = () => {
    const hiddenFields = Object.keys(formData).filter(key => !getVisibleFields().includes(key));
    const defaults = {};
    
    hiddenFields.forEach(field => {
      if (defaultVariations.average[field] !== undefined) {
        defaults[field] = defaultVariations.average[field];
      }
    });
    
    return defaults;
  };
  
  // handles form submission and gets predictions from api
  const handleSubmitWithDefaults = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError(null);
    
    // fills in missing fields with defaults
    const completeData = {
      ...formData,
      ...getDefaultValues()
    };
    
    // scroll to top to see results
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    try {
      const userPrediction = await calculatePrediction(completeData);
      
      if (activeView !== 'all') {
        const visibleFields = getVisibleFields();
        
        // mix user inputs with different weather scenarios
        const optimalMixed = { ...defaultVariations.optimal };
        const averageMixed = { ...defaultVariations.average };
        const poorMixed = { ...defaultVariations.poor };
        
        visibleFields.forEach(field => {
          if (formData[field] !== '') {
            optimalMixed[field] = formData[field];
            averageMixed[field] = formData[field];
            poorMixed[field] = formData[field];
          }
        });
        
        // get all predictions in parallel
        const [optimalPrediction, averagePrediction, poorPrediction] = await Promise.all([
          calculatePrediction(optimalMixed),
          calculatePrediction(averageMixed),
          calculatePrediction(poorMixed)
        ]);
        
        setPredictions({
          user: userPrediction,
          optimal: optimalPrediction,
          average: averagePrediction,
          poor: poorPrediction
        });
      } else {
        setPredictions({
          user: userPrediction,
          optimal: null,
          average: null,
          poor: null
        });
      }
    } catch (error) {
      console.error("Error calculating predictions:", error);
      setApiError("Failed to calculate predictions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // renders different input types based on field
  const renderField = (key) => {
    if (key === 'date') {
      return (
        <div key={key} className="form-group">
          <label htmlFor={key}>{formatFieldLabel(key)}</label>
          <input
            type="date"
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="date-input"
          />
        </div>
      );
    } else if (key === 'weekend') {
      // weekend field read-only since it's auto-calculated
      return (
        <div key={key} className="form-group">
          <label htmlFor={key}>{formatFieldLabel(key)}</label>
          <select
            id={key}
            name={key}
            value={formData[key]}
            className="select-input"
            disabled
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
          <p className="field-note">Auto-calculated from date</p>
        </div>
      );
    } else if (shouldUseSlider(key)) {
      const config = getSliderConfig(key);
      return (
        <div key={key} className="form-group">
          <label htmlFor={key}>{formatFieldLabel(key)}: {formData[key]}{config.unit}</label>
          <div className="slider-container">
            <input
              type="range"
              id={key}
              name={key}
              className="slider-input"
              min={config.min}
              max={config.max}
              step={config.step}
              value={formData[key]}
              onChange={handleSliderChange}
            />
          </div>
        </div>
      );
    } else if (['is_holiday', 'Clear_or_FairWeather', 'Light_to_Moderate', 'Severe_Weather'].includes(key)) {
      let options = [
        { value: '0', label: 'No' },
        { value: '1', label: 'Yes' }
      ];
      
      return (
        <div key={key} className="form-group">
          <label htmlFor={key}>{formatFieldLabel(key)}</label>
          <select
            id={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            className="select-input"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      );
    } else {
      return (
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
      );
    }
  };

  // renders prediction results based on view mode
  const renderPredictionResults = () => {
    if (predictions.user === null) return null;
    
    if (activeView === 'all') {
      return (
        <div className="prediction-result">
          <div className="result-header">Prediction Results</div>
          <div className="result-value">{predictions.user}</div>
          <div className="result-label">Estimated Riders</div>
          {apiError && <div className="api-error-message">{apiError}</div>}
        </div>
      );
    } else {
      return (
        <div className="prediction-results-container">
          <h2 className="predictions-header">Prediction Results</h2>
          {apiError && <div className="api-error-message">{apiError}</div>}
          <p className="predictions-explanation">
            Below are ridership predictions based on your inputs combined with different default values for the hidden fields:
          </p>
          
          <div className="predictions-grid">
            <div className="prediction-card user-prediction">
              <div className="prediction-card-header">Your Prediction</div>
              <div className="prediction-card-value">{predictions.user}</div>
              <div className="prediction-card-label">Estimated Riders</div>
              <div className="prediction-card-desc">
                Based on your inputs and average conditions for hidden fields
              </div>
            </div>
            
            <div className="prediction-card optimal-prediction">
              <div className="prediction-card-header">Optimal Conditions</div>
              <div className="prediction-card-value">{predictions.optimal}</div>
              <div className="prediction-card-label">Estimated Riders</div>
              <div className="prediction-card-desc">
                Your inputs with optimal conditions for hidden fields
              </div>
            </div>
            
            <div className="prediction-card average-prediction">
              <div className="prediction-card-header">Average Conditions</div>
              <div className="prediction-card-value">{predictions.average}</div>
              <div className="prediction-card-label">Estimated Riders</div>
              <div className="prediction-card-desc">
                Your inputs with average conditions for hidden fields
              </div>
            </div>
            
            <div className="prediction-card poor-prediction">
              <div className="prediction-card-header">Poor Conditions</div>
              <div className="prediction-card-value">{predictions.poor}</div>
              <div className="prediction-card-label">Estimated Riders</div>
              <div className="prediction-card-desc">
                Your inputs with poor conditions for hidden fields
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="fullscreen-tab-container">
      <h1>Weather Ridership Prediction</h1>
      
      <div className="description-box">
        <h3 className="description-title">About This Prediction Tool</h3>
        <div className="description-columns">
          <div className="description-column">
            <p>Use the tabs below to focus on specific variables:</p>
            <ul>
              <li><strong>Temperature Tab:</strong> Focus on how temperature affects ridership with multiple scenarios for other values</li>
              <li><strong>Weather Tab:</strong> Explore precipitation, wind, and other weather effects with multiple scenarios for temperature</li>
              <li><strong>All Variables Tab:</strong> Fine-tune all parameters for maximum control (single prediction). 
                <ul>
                  <li>A data dictionary with definitions for all fields within the model can be referenced at the following link:<a href="https://open-meteo.com/en/docs/historical-weather-api#latitude=40.7143&longitude=-74.006&start_date=2021-05-17&end_date=2021-06-17&hourly=&daily=weather_code,temperature_2m_max,temperature_2m_min,temperature_2m_mean,apparent_temperature_max,apparent_temperature_min,apparent_temperature_mean,sunrise,sunset,daylight_duration,sunshine_duration,precipitation_sum,rain_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&models=" 
              className="custom-link" target="_blank" rel="noopener noreferrer">Data Dictionary</a></li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="description-column">
            <p>Key factors that influence ridership:</p>
            <ul>
              <li>Temperature (higher temperatures generally increase ridership up to a point)</li>
              <li>Precipitation (rain and snow typically decrease ridership significantly)</li>
              <li>Weekend status (automatically calculated from date - weekends have lower baseline ridership)</li>
              <li>Wind speed (stronger winds tend to decrease ridership)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="controls">
        {/* Variables selector with header */}
        <div className="tabs-group-container">
          <div className="tabs-group-label-top">Input Options</div>
          <div className="view-selector">
            <button
              className={activeView === 'basic' ? 'active' : ''}
              onClick={() => setActiveView('basic')}
            >
              Basic Inputs
            </button>
            <button
              className={activeView === 'advanced' ? 'active' : ''}
              onClick={() => setActiveView('advanced')}
            >
              Advanced
            </button>
            <button
              className={activeView === 'all' ? 'active' : ''}
              onClick={() => setActiveView('all')}
            >
              All Variables
            </button>
          </div>
        </div>
      </div>
      
      <div className="form-container">
        <p className="form-header">
          {activeView !== 'all' 
            ? 'Enter values to see predictions with different default scenarios for hidden fields.' 
            : 'Enter all weather conditions to predict ridership numbers.'}
        </p>
        {apiError && (
          <div className="api-error-banner">
            <p>{apiError}</p>
          </div>
        )}
        <form onSubmit={handleSubmitWithDefaults}>
          <div className="form-grid">
            {getVisibleFields().map(key => renderField(key))}
          </div>

          <button type="submit" disabled={isLoading} className="submit-button">
            {isLoading ? 'Calculating...' : 'Calculate Ridership'}
          </button>
        </form>
      </div>

      {renderPredictionResults()}
    </div>
  );
};

export default Model;