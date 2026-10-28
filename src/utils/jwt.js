// Reads the "exp" claim (seconds) from a JWT without verifying it.
// Verification is the server's job; this is only used to log out on time.
export function getTokenExpiry(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token) {
  const exp = getTokenExpiry(token);
  return exp === null || exp <= Date.now();
}
