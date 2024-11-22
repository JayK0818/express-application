;(function () {
  const { createApp, ref } = window.Vue
  const { createDiscreteApi } = window.naive
  const { message } = createDiscreteApi(['message'])
  const app = createApp({
    setup() {
      const dropdown_options_list = ref([
        {
          label: '退出登录',
          key: Math.random(),
        },
      ])
      const handle_logout = () => {}
      return {
        dropdown_options_list,
      }
    },
  })
  app.use(naive)
  app.mount('#header-app')
})()
