const KEY = "ocular_token";

export function saveToken(token) {
  localStorage.setItem(KEY, token);
}

export function getToken() {
  return localStorage.getItem(KEY);
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  return !!getToken();
}