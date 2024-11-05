const { createApp, ref, shallowRef } = window.Vue

;(function () {
  const app = createApp({
    setup() {
      const state = ref({
        username: '',
        password: '',
        email: '',
      })
      const formRef = ref(null)
      const rules = shallowRef({
        username: [
          {
            required: true,
            validator(_, value) {
              if (value.length === 0) {
                return new Error('用户名不得为空')
              } else if (value.length < 6 || value.length > 20) {
                return new Error('用户名长度为6-20字符')
              } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
                return new Error('用户名只能包含字母或数字')
              }
              return true
            },
            trigger: ['input', 'blue'],
          },
        ],
        password: [
          {
            required: true,
            validator(_, value) {
              if (!value.length) {
                return new Error('密码不得为空')
              }
              return true
            },
            trigger: ['input', 'blur'],
          },
        ],
        email: [
          {
            required: true,
            validator(_, value) {
              const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
              if (!value.length) {
                return new Error('邮箱不得为空')
              } else if (!reg.test(value)) {
                return new Error('邮箱不合法')
              }
              return true
            },
            trigger: ['input', 'blur'],
          },
        ],
      })
      const handleRegister = () => {
        formRef.value?.validate((errors) => {
          if (!errors) {
            console.log('开始注册')
          }
        })
      }
      return {
        state,
        rules,
        handleRegister,
        formRef,
      }
    },
  })
  app.use(naive)
  app.mount('#register-form')
})()
