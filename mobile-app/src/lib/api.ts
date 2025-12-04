import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://70d68d7f-33e2-44b4-b3f3-b98cbba23642-00-i724sanmu6da.kirk.replit.dev';

export async function apiRequest(method: string, endpoint: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function generateColoringPage(prompt: string) {
  return apiRequest('POST', '/api/generate', { prompt });
}

export async function getMyArt() {
  return apiRequest('GET', '/api/my-art');
}

export async function getCurrentUser() {
  return apiRequest('GET', '/api/auth/user');
}
