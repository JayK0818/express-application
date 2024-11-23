;(function () {
  const { createApp, ref } = window.Vue
  const { createDiscreteApi } = window.naive
  const { message } = createDiscreteApi(['message'])
  const app = createApp({
    setup() {
      const dropdown_options_list = ref([
        {
          label: '退出登录',
          key: 'logout',
        },
      ])
      const handle_logout = () => {
        const _message = message.info('正在退出登录...', {
          duration: 0,
        })
        service
          .post('user/logout')
          .then(() => {
            window.location.href = '/login'
          })
          .catch((err) => {
            message.error(err)
          })
          .finally(() => {
            _message.destroy()
          })
      }
      /**
       * @description 下拉菜单筛选
       */
      const handle_dropdown_select = (key) => {
        switch (key) {
          case 'logout':
            handle_logout()
            break
        }
      }
      return {
        handle_dropdown_select,
        dropdown_options_list,
      }
    },
  })
  app.use(naive)
  app.mount('#header-app')
})()
