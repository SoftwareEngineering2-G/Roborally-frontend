/* JWT Authentication Utility Functions */

/* Check if user is authenticated with a valid JWT token */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem("jwt_token");
  if (!token) return false;

  // Check if token is expired
  return !isTokenExpired(token);
}

/* Check if JWT token is expired */
export function isTokenExpired(token: string): boolean {
  try {
    // Decode JWT payload (middle part of token)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check expiration time
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch {
    // If we can't decode the token, consider it expired
    return true;
  }
}

/* Get the authenticated username from JWT token */
export function getAuthenticatedUsername(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem("jwt_token");
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.unique_name || payload.sub || null;
  } catch {
    return null;
  }
}

/*Get JWT token from local*/
export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem("jwt_token");
}

/* Logout user by clearing auth data */
export function logout(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem("jwt_token");
  localStorage.removeItem("username");

  // Redirect to signin
  window.location.href = "/signin";
}
