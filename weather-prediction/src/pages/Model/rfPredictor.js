export const predictWithTree = (tree, features) => {
  let node = tree;
  
  
  while (node.nodeType === 'split') {
    const featureValue = features[node.featureIndex];
    if (featureValue <= node.threshold) {
      node = node.left;
    } else {
      node = node.right;
    }
  }
  
  return node.value;
};


export const predictWithRandomForest = (forestModel, features) => {
  if (!forestModel || !forestModel.random_forest || !forestModel.random_forest.estimators) {
    console.error('missing forest model structure');
    return 0;
  }
  
  
  const predictions = forestModel.random_forest.estimators.map(tree => 
    predictWithTree(tree, features)
  );
  
  
  const sum = predictions.reduce((a, b) => a + b, 0);
  return sum / predictions.length;
};


export const scaleFeatures = (features, scaler) => {
  if (!scaler || !scaler.mean || !scaler.var) {
    console.error('scaler structure where');
    return features;
  }
  
  const scaledFeatures = [];
  for (let i = 0; i < features.length; i++) {
    
    
    scaledFeatures[i] = (features[i] - scaler.mean[i]) / Math.sqrt(scaler.var[i]);
  }
  return scaledFeatures;
};


export const preprocessDate = (dateStr) => {
  const date = dateStr ? new Date(dateStr) : new Date();
  const month = date.getMonth() + 1; 
  const day = date.getDate(); 
  const dayOfWeek = date.getDay(); 
  
  
  const dayOfWeekSin = Math.sin(2 * Math.PI * dayOfWeek / 7);
  const dayOfWeekCos = Math.cos(2 * Math.PI * dayOfWeek / 7);
  
  return { month, day, dayOfWeek, dayOfWeekSin, dayOfWeekCos };
};


export const prepareRfFeatures = (formData) => {
  const dateFeatures = preprocessDate(formData.date || new Date());
  
  
  return [
    parseFloat(formData.temperature_2m_mean) || 0,
    parseFloat(formData.daylight_duration) || 0,
    parseFloat(formData.sunshine_duration) || 0,
    parseFloat(formData.precipitation_sum) || 0,
    parseFloat(formData.snowfall_sum) || 0,
    parseFloat(formData.wind_speed_10m_max) || 0,
    parseFloat(formData.wind_direction_10m_dominant) || 0,
    parseFloat(formData.shortwave_radiation_sum) || 0,
    parseInt(formData.weekend) || 0,
    parseInt(formData.is_holiday) || 0,
    parseFloat(formData.apparent_temp_range) || 0,
    parseFloat(formData.temp_2m_range) || 0,
    parseInt(formData.Clear_or_FairWeather) || 0,
    parseInt(formData.Light_to_Moderate) || 0,
    parseInt(formData.Severe_Weather) || 0,
    dateFeatures.month,
    dateFeatures.day,
    dateFeatures.dayOfWeek,
    dateFeatures.dayOfWeekSin,
    dateFeatures.dayOfWeekCos
  ];
};


export const makePrediction = (formData, modelData) => {
  if (!modelData || !modelData.random_forest || !modelData.scaler) {
    console.error('the data is incomplete', modelData);
    return 0;
  }
  
  try {
    
    const features = prepareRfFeatures(formData);
    
    
    const scaledFeatures = scaleFeatures(features, modelData.scaler);
    
    
    const prediction = predictWithRandomForest(modelData, scaledFeatures);
    
    return Math.round(prediction);
  } catch (error) {
    console.error('an error making prediction:', error);
    return 0;
  }
};