import { PortfolioData } from './types';

export async function fetchPortfolioData(): Promise<PortfolioData> {
  const response = await fetch('/api/portfolio');
  if (!response.ok) throw new Error('Failed to fetch portfolio data');
  return response.json();
}

export async function addWorkItem(item: any): Promise<{ success: boolean; id: string }> {
  const response = await fetch('/api/works', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to add work item');
  return response.json();
}

export async function updateWorkItem(id: string, item: any): Promise<{ success: boolean }> {
  const response = await fetch(`/api/works/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error('Failed to update work item');
  return response.json();
}

export async function deleteWorkItem(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/works/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete work item');
  return response.json();
}

export async function login(password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return response.json();
}

export async function updateProfile(profile: any): Promise<{ success: boolean }> {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
}

export async function addCategory(name: string): Promise<{ success: boolean; id: string }> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to add category');
  return response.json();
}

export async function deleteCategory(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete category');
  return response.json();
}

export async function updateCategory(id: string, name: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to update category');
  return response.json();
}
