const service = axios.create({
  baseURL: 'http://127.0.0.1:3000/api',
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
    console.log(err)
  }
)
