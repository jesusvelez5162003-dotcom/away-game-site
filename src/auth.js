export function saveSession(token, admin) {
  localStorage.setItem('away_token', token)
  if (admin) localStorage.setItem('away_admin', JSON.stringify(admin))
}

export function getToken() {
  return localStorage.getItem('away_token')
}

export function getAdmin() {
  try {
    return JSON.parse(localStorage.getItem('away_admin') || 'null')
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem('away_token')
  localStorage.removeItem('away_admin')
}

export function isAuthenticated() {
  return !!getToken()
}
