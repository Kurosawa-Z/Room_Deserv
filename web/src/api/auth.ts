import { apiFetch } from './http';

export type AuthUser = {
  id: string | number;
  username: string;
};

export async function login(username: string, password: string, rememberMe: boolean) {
  return apiFetch<{ user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, rememberMe })
  });
}

export async function signup(username: string, password: string, rememberMe: boolean) {
  return apiFetch<{ user: AuthUser }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password, rememberMe })
  });
}

export async function logout() {
  return apiFetch<{ ok: true }>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({})
  });
}

export async function me() {
  return apiFetch<{ user: AuthUser }>('/auth/me');
}
