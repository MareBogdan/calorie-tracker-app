// src/utils/fdcApi.js
const API_KEY = 'vw04geiwxMZnOF7QWAwDbCGtvZKY3b7zPWTs333g';

export const searchFoodsFromFDC = async (query) => {
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}&pageSize=10`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.foods || [];
  } catch (err) {
    console.error('❌ Error fetching FDC data:', err);
    return [];
  }
};

export const getFoodDetails = async (fdcId) => {
  const url = `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('❌ Error fetching food details:', err);
    return null;
  }
};
