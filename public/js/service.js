const service = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
})
/**
 * @description 拦截请求, 添加token
 */
service.interceptors.request.use((config) => {
  const token = get_user_token()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

/**
 * @description 拦截响应
 */
service.interceptors.response.use(
  (res) => {
    const { code, data, msg } = res.data
    switch (code) {
      case 200:
        return data
      default:
        return Promise.reject(msg)
    }
  },
  (err) => {
    return Promise.reject(err.status === 429 ? err.response.data : err?.message)
  }
)
