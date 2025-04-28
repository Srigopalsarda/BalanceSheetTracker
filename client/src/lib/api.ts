// API utilities for making requests to the backend
import { API_URL } from '../config';

/**
 * Makes an authenticated request to the API
 * @param endpoint - The API endpoint (without the /api prefix)
 * @param options - Fetch options
 * @returns Response from the API
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get the auth token from localStorage
  const token = localStorage.getItem('authToken');
  
  // Prepare headers
  const headers = {
    ...(options.headers || {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.method !== 'GET' ? { 'Content-Type': 'application/json' } : {})
  };
  
  // Build the full URL
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Make the request
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  // Handle non-OK responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }
  
  return response;
}

/**
 * Makes a GET request to the API
 */
export async function get<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint);
  return response.json();
}

/**
 * Makes a POST request to the API
 */
export async function post<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
}

/**
 * Makes a PUT request to the API
 */
export async function put<T>(endpoint: string, data: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
  return response.json();
}

/**
 * Makes a DELETE request to the API
 */
export async function del(endpoint: string): Promise<void> {
  await apiRequest(endpoint, {
    method: 'DELETE'
  });
}
