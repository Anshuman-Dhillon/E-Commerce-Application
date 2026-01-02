// Utility function for fetching data from the Java API with error handling

const API_BASE_URL = 'http://localhost:8080';

export async function fetchReportData(url, options = {}) {
  try {
    // If URL doesn't start with http, prepend the base URL
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    
    const response = await fetch(fullUrl, {
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

export function buildFileUrl(path) {
  if (!path) return path;
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
}