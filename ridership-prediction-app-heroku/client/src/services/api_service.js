export const getPrediction = async (data) => {
    try {
      if (!data.date) {
        const today = new Date();
        data.date = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }
  
      const response = await fetch('/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
  
      const result = await response.json();
      return result.number;
    } catch (error) {
      console.error('Error making prediction API call:', error);
      throw error;
    }
  };