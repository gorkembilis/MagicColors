const API_BASE_URL = 'https://YOUR_REPLIT_URL'; // Bu URL'yi güncelleyin

export async function apiRequest(method: string, endpoint: string, data?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
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
