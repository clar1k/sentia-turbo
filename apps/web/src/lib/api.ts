export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export const apiCall = async (endpoint: string, data?: any, token?: string) => {
  const url = `${import.meta.env.VITE_SERVER_URL}/${endpoint}`;
  const options: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    ...(data && { body: JSON.stringify(data) }),
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Request failed');
  }
  
  const result = await response.json();
  return result.result?.data || result.result;
};

const getAuthToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new UnauthorizedError();
  return token;
};
