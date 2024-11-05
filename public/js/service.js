const service = axios.create({})

/**
 * @description 拦截响应
 */
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  switch (code) {
    case 200:
      return data
    default:
      return Promise.reject(msg)
  }
})
