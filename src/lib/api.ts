import { LoginCredentials, LoginResponse, User, Order } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://logistics-backend-1-s91j.onrender.com';

// Auth APIs
export async function loginAdmin(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error('Login failed');
  return response.json();
}

// User APIs
export async function getUsers(page = 1, limit = 10) {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  return data.data;
}

export async function getUserDetails(userId: string): Promise<{ user: User, orders: Order[] }> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(
    `${API_BASE_URL}/api/admin/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch user details');
  const data = await response.json();
  return data.data;
}

// Consumer APIs
export async function getConsumers(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  const token = localStorage.getItem('adminToken');
  const queryParams = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '10',
    ...(params.status && { status: params.status }),
    ...(params.search && { search: params.search }),
  });

  const response = await fetch(
    `${API_BASE_URL}/api/admin/consumers?${queryParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch consumers');
  }

  const data = await response.json();
  return data.data;
}

export async function getConsumerStats(): Promise<ConsumerStats> {
  const token = localStorage.getItem('adminToken');
  const response = await fetch(
    `${API_BASE_URL}/api/admin/consumers/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error('Failed to fetch consumer stats');
  const data = await response.json();
  return data.data;
} 