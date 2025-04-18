import React, { useState, useEffect } from 'react';
import './Model.css';
import { makePrediction, prepareRfFeatures, scaleFeatures } from './rfPredictor';

const Model = () => {
  
  const [activeView, setActiveView] = useState('all');
  const [linearModelParams, setLinearModelParams] = useState(null);
  const [rfModelParams, setRfModelParams] = useState(null);
  const [activeModel, setActiveModel] = useState('linear');
  const [isModelLoading, setIsModelLoading] = useState(true);

  
  useEffect(() => {
    const loadModels = async () => {
      try {
        
        const linearResponse = await fetch('/model_params.json');
        const linearData = await linearResponse.json();
        setLinearModelParams(linearData);
        
        
        try {
          const rfResponse = await fetch('/rf_model_params.json');
          const rfData = await rfResponse.json();
          setRfModelParams(rfData);
        } catch (rfError) {
          console.log('Random Forest model not available, using linear model only');
        }
        
        setIsModelLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        setIsModelLoading(false);
      }
    };
    
    loadModels();
  }, []);

  
  const defaultVariations = {
    optimal: {
      
      temperature_2m_max: '75',
      temperature_2m_min: '60',
      temperature_2m_mean: '68',
      apparent_temperature_max: '77',
      apparent_temperature_min: '58',
      apparent_temperature_mean: '68',
      sunrise: '1',
      sunset: '1',
      daylight_duration: '14',
      sunshine_duration: '40',
      precipitation_sum: '0',
      rain_sum: '0',
      snowfall_sum: '0',
      precipitation_hours: '0',
      wind_speed_10m_max: '5',
      wind_gusts_10m_max: '8',
      wind_direction_10m_dominant: '180',
      shortwave_radiation_sum: '25',
      et0_fao_evapotranspiration: '0.25',
      weekend: '0',
      
      is_holiday: '0',
      apparent_temp_range: '19',
      temp_2m_range: '15',
      Clear_or_FairWeather: '1',
      Light_to_Moderate: '0',
      Severe_Weather: '0'
    },
    average: {
      
      temperature_2m_max: '65',
      temperature_2m_min: '45',
      temperature_2m_mean: '55',
      apparent_temperature_max: '67',
      apparent_temperature_min: '43',
      apparent_temperature_mean: '55',
      sunrise: '1',
      sunset: '1',
      daylight_duration: '13',
      sunshine_duration: '25',
      precipitation_sum: '2',
      rain_sum: '2',
      snowfall_sum: '0',
      precipitation_hours: '4',
      wind_speed_10m_max: '12',
      wind_gusts_10m_max: '20',
      wind_direction_10m_dominant: '180',
      shortwave_radiation_sum: '15',
      et0_fao_evapotranspiration: '0.15',
      weekend: '0',
      
      is_holiday: '0',
      apparent_temp_range: '24',
      temp_2m_range: '20',
      Clear_or_FairWeather: '1',
      Light_to_Moderate: '0',
      Severe_Weather: '0'
    },
    poor: {
      
      temperature_2m_max: '35',
      temperature_2m_min: '10',
      temperature_2m_mean: '25',
      apparent_temperature_max: '30',
      apparent_temperature_min: '5',
      apparent_temperature_mean: '18',
      sunrise: '0',
      sunset: '0',
      daylight_duration: '10',
      sunshine_duration: '5',
      precipitation_sum: '5',
      rain_sum: '3',
      snowfall_sum: '6',
      precipitation_hours: '18',
      wind_speed_10m_max: '30',
      wind_gusts_10m_max: '50',
      wind_direction_10m_dominant: '270',
      shortwave_radiation_sum: '5',
      et0_fao_evapotranspiration: '0.05',
      weekend: '0',
      
      is_holiday: '0',
      apparent_temp_range: '15',
      temp_2m_range: '15',
      Clear_or_FairWeather: '0',
      Light_to_Moderate: '0',
      Severe_Weather: '1'
    }
  };

  
  const allFields = {
    linear: [
      'temperature_2m_max', 'temperature_2m_min', 'temperature_2m_mean',
      'apparent_temperature_max', 'apparent_temperature_min', 'apparent_temperature_mean',
      'sunrise', 'sunset', 'daylight_duration', 'sunshine_duration',
      'precipitation_sum', 'rain_sum', 'snowfall_sum', 'precipitation_hours',
      'wind_speed_10m_max', 'wind_gusts_10m_max', 'wind_direction_10m_dominant',
      'shortwave_radiation_sum', 'et0_fao_evapotranspiration', 'weekend'
    ],
    rf: [
      'temperature_2m_mean', 'daylight_duration', 'sunshine_duration',
      'precipitation_sum', 'snowfall_sum', 'wind_speed_10m_max',
      'wind_direction_10m_dominant', 'shortwave_radiation_sum', 'weekend',
      'is_holiday', 'apparent_temp_range', 'temp_2m_range',
      'Clear_or_FairWeather', 'Light_to_Moderate', 'Severe_Weather'
    ]
  };

  
  const initialFormState = {
    
    temperature_2m_max: '75',
    temperature_2m_min: '55',
    temperature_2m_mean: '65',
    apparent_temperature_max: '77',
    apparent_temperature_min: '53',
    apparent_temperature_mean: '65',
    sunrise: '1',
    sunset: '1',
    daylight_duration: '13',
    sunshine_duration: '25',
    precipitation_sum: '0',
    rain_sum: '0',
    snowfall_sum: '0',
    precipitation_hours: '0',
    wind_speed_10m_max: '10',
    wind_gusts_10m_max: '15',
    wind_direction_10m_dominant: '180',
    shortwave_radiation_sum: '15',
    et0_fao_evapotranspiration: '0.15',
    weekend: '0',
    
    
    is_holiday: '0',
    apparent_temp_range: '24',
    temp_2m_range: '20',
    Clear_or_FairWeather: '1',
    Light_to_Moderate: '0',
    Severe_Weather: '0'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [predictions, setPredictions] = useState({
    user: null,
    optimal: null,
    average: null,
    poor: null
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
    
    
    if (name === 'temperature_2m_min' || name === 'temperature_2m_max') {
      const min = name === 'temperature_2m_min' ? parseFloat(value) : parseFloat(formData.temperature_2m_min);
      const max = name === 'temperature_2m_max' ? parseFloat(value) : parseFloat(formData.temperature_2m_max);
      
      const mean = Math.round((min + max) / 2);
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        temperature_2m_mean: String(mean),
        temp_2m_range: String(max - min)
      }));
    }
    
    
    if (name === 'apparent_temperature_min' || name === 'apparent_temperature_max') {
      const min = name === 'apparent_temperature_min' ? parseFloat(value) : parseFloat(formData.apparent_temperature_min);
      const max = name === 'apparent_temperature_max' ? parseFloat(value) : parseFloat(formData.apparent_temperature_max);
      
      const mean = Math.round((min + max) / 2);
      setFormData(prevData => ({
        ...prevData,
        [name]: value,
        apparent_temperature_mean: String(mean),
        apparent_temp_range: String(max - min)
      }));
    }
  };

  
  const calculateLinearPrediction = (data) => {
    if (!linearModelParams) return 0;
    
    let prediction = linearModelParams.intercept;
    
    linearModelParams.feature_names.forEach((feature, index) => {
      if (data[feature] !== '' && data[feature] !== undefined) {
        prediction += parseFloat(data[feature]) * linearModelParams.coefficients[index];
      }
    });
    
    return Math.round(prediction);
  };

  
  const calculateRFPrediction = (data) => {
    if (!rfModelParams) return 0;
    
    try {
      
      return makePrediction(data, rfModelParams);
    } catch (error) {
      console.error("Error using RF prediction:", error);
      
      return calculateLinearPrediction(data);
    }
  };

  
  const calculatePrediction = (data) => {
    if (activeModel === 'linear') {
      return calculateLinearPrediction(data);
    } else {
      return calculateRFPrediction(data);
    }
  };

  const formatFieldLabel = (key) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  
  const getFieldGroups = () => {
    if (activeModel === 'linear') {
      return {
        temperatureFields: [
          'temperature_2m_max', 
          'temperature_2m_min', 
          'temperature_2m_mean', 
          'apparent_temperature_max', 
          'apparent_temperature_min', 
          'apparent_temperature_mean'
        ],
        weatherFields: [
          'precipitation_sum', 
          'rain_sum', 
          'snowfall_sum', 
          'precipitation_hours',
          'wind_speed_10m_max', 
          'wind_gusts_10m_max', 
          'wind_direction_10m_dominant',
          'shortwave_radiation_sum', 
          'et0_fao_evapotranspiration'
        ],
        otherFields: [
          'sunrise', 
          'sunset', 
          'daylight_duration', 
          'sunshine_duration',
          'weekend'
        ]
      };
    } else {
      return {
        temperatureFields: [
          'temperature_2m_mean',
          'temp_2m_range',
          'apparent_temp_range'
        ],
        weatherFields: [
          'precipitation_sum',
          'snowfall_sum',
          'wind_speed_10m_max',
          'wind_direction_10m_dominant',
          'shortwave_radiation_sum',
          'Clear_or_FairWeather',
          'Light_to_Moderate',
          'Severe_Weather'
        ],
        otherFields: [
          'daylight_duration',
          'sunshine_duration',
          'weekend',
          'is_holiday'
        ]
      };
    }
  };
  
  const { temperatureFields, weatherFields, otherFields } = getFieldGroups();
  
  const getVisibleFields = () => {
    switch(activeView) {
      case 'temperature':
        return temperatureFields;
      case 'weather':
        return weatherFields;
      case 'all':
      default:
        return [...temperatureFields, ...weatherFields, ...otherFields];
    }
  };
  
  
  const shouldUseSlider = (field) => {
    
    if (['sunrise', 'sunset', 'weekend', 'is_holiday', 'Clear_or_FairWeather', 'Light_to_Moderate', 'Severe_Weather'].includes(field)) {
      return false;
    }
    
    
    return true;
  };
  
  
  const getSliderConfig = (field) => {
    const config = {
      
      temperature_2m_max: { min: -10, max: 120, step: 1, unit: '°F' },
      temperature_2m_min: { min: -10, max: 120, step: 1, unit: '°F' },
      temperature_2m_mean: { min: -10, max: 120, step: 1, unit: '°F' },
      apparent_temperature_max: { min: -10, max: 120, step: 1, unit: '°F' },
      apparent_temperature_min: { min: -10, max: 120, step: 1, unit: '°F' },
      apparent_temperature_mean: { min: -10, max: 120, step: 1, unit: '°F' },
      
      daylight_duration: { min: 0, max: 24, step: 0.5, unit: 'hours' },
      sunshine_duration: { min: 0, max: 60, step: 1, unit: 'hours' },
      precipitation_sum: { min: 0, max: 8, step: 0.1, unit: 'mm' },
      rain_sum: { min: 0, max: 8, step: 0.1, unit: 'mm' },
      snowfall_sum: { min: 0, max: 8, step: 0.1, unit: 'cm' },
      precipitation_hours: { min: 0, max: 24, step: 1, unit: 'hours' },
      wind_speed_10m_max: { min: 0, max: 40, step: 1, unit: 'mph' },
      wind_gusts_10m_max: { min: 0, max: 70, step: 1, unit: 'mph' },
      wind_direction_10m_dominant: { min: 0, max: 360, step: 5, unit: '°' },
      shortwave_radiation_sum: { min: 0, max: 30, step: 0.5, unit: 'MJ/m²' },
      et0_fao_evapotranspiration: { min: 0, max: 0.35, step: 0.01, unit: 'mm' },
      
      apparent_temp_range: { min: 0, max: 50, step: 1, unit: '°F' },
      temp_2m_range: { min: 0, max: 50, step: 1, unit: '°F' }
    };
    
    return config[field] || { min: 0, max: 100, step: 1, unit: '' };
  };
  
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
  
  const handleSubmitWithDefaults = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    
    const completeData = {
      ...formData,
      ...getDefaultValues()
    };
    
    
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      
      const userPrediction = calculatePrediction(completeData);
      
      
      if (activeView !== 'all') {
        
        const visibleFields = getVisibleFields();
        
        
        
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
        
        
        const optimalPrediction = calculatePrediction(optimalMixed);
        const averagePrediction = calculatePrediction(averageMixed);
        const poorPrediction = calculatePrediction(poorMixed);
        
        
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
      
      setIsLoading(false);
    }, 500);
  };

  
  const renderField = (key) => {
    if (shouldUseSlider(key)) {
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
    } else if (key === 'sunrise' || key === 'sunset' || key === 'weekend' || key === 'is_holiday' || 
               key === 'Clear_or_FairWeather' || key === 'Light_to_Moderate' || key === 'Severe_Weather') {
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

  
  const renderPredictionResults = () => {
    if (predictions.user === null) return null;
    
    if (activeView === 'all') {
      
      return (
        <div className="prediction-result">
          <div className="result-header">Prediction Results</div>
          <div className="result-value">{predictions.user}</div>
          <div className="result-label">Estimated Riders</div>
        </div>
      );
    } else {
      
      return (
        <div className="prediction-results-container">
          <h2 className="predictions-header">Prediction Results</h2>
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

  
  if (isModelLoading && activeModel === 'linear' && !linearModelParams) {
    return (
      <div className="fullscreen-tab-container">
        <h1>Weather Ridership Prediction</h1>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading prediction model...</p>
        </div>
      </div>
    );
  }

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
              <li>Weekend status (enter 1 for weekend, 0 for weekday - weekends have lower baseline ridership)</li>
              <li>Wind speed (stronger winds tend to decrease ridership)</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="controls">
        {/* Variables selector with header */}
        <div className="tabs-group-container">
          <div className="tabs-group-label-top">Variables</div>
          <div className="view-selector">
            <button
              className={activeView === 'temperature' ? 'active' : ''}
              onClick={() => setActiveView('temperature')}
            >
              Temperature
            </button>
            <button
              className={activeView === 'weather' ? 'active' : ''}
              onClick={() => setActiveView('weather')}
            >
              Weather
            </button>
            <button
              className={activeView === 'all' ? 'active' : ''}
              onClick={() => setActiveView('all')}
            >
              All Variables
            </button>
          </div>
        </div>
        
        {/* Model selector with header */}
        <div className="tabs-group-container">
          <div className="tabs-group-label-top">Models</div>
          <div className="model-selector">
            <button
              className={activeModel === 'linear' ? 'active' : ''}
              onClick={() => setActiveModel('linear')}
              disabled={!linearModelParams}
            >
              Linear Model
            </button>
            <button
              className={activeModel === 'rf' ? 'active' : ''}
              onClick={() => setActiveModel('rf')}
              disabled={!rfModelParams}
            >
              Random Forest
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