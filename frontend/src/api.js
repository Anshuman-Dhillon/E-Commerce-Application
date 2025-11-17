// Utility function for fetching data from the Java API with error handling

export async function fetchReportData(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`${response.status}: ${errorBody || response.statusText}`);
    }

    return response.json();

  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    throw error; 
  }
}