import http from './http'

// Регистрация: создаёт компанию и пользователя, сразу возвращает токен
export async function register({ name, email, password, companyName }) {
  const { data } = await http.post('/auth/register', { name, email, password, companyName })
  return data
}

export async function login({ email, password }) {
  const { data } = await http.post('/auth/login', { email, password })
  return data
}

// Выход: сервер отзывает текущий токен
export async function logout() {
  await http.post('/auth/logout')
}

// Профиль текущего пользователя: { user, company }
export async function getMe() {
  const { data } = await http.get('/auth/me')
  return data
}

export async function getCurrentCompany() {
  const { data } = await http.get('/companies/current')
  return data
}
