// src/api.js
// Utility function for fetching data from the Java API with error handling

export async function fetchReportData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    return response.json();

  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    throw error; 
  }
}