const { createApp, ref, shallowRef } = window.Vue
;(function () {
  const app = createApp({
    setup() {
      const state = ref({
        username: '',
        password: '',
      })
      const formRef = ref(null)
      const rules = shallowRef({
        username: [
          {
            required: true,
            validator(rule, value = '') {
              const v = value.trim()
              const reg = /^[a-zA-Z0-9]+$/
              if (v.length === 0) {
                return new Error('用户名不得为空')
              } else if (v.length < 6 || v.length > 20) {
                return new Error('用户名字符长度为6-20')
              } else if (!reg.test(v)) {
                return new Error('用户名只能包含字母和数字')
              }
              return true
            },
            trigger: ['input', 'blur'],
          },
        ],
        password: [
          {
            required: true,
            validator(rule, value) {
              if (!value) {
                return new Error('密码不得为空')
              }
              return true
            },
            trigger: ['input', 'blur'],
          },
        ],
      })
      const handleLogin = () => {
        try {
          formRef.value?.validate((errors) => {
            if (!errors) {
              console.log('开始登录')
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
      return {
        state,
        rules,
        formRef,
        handleLogin,
      }
    },
  })
  app.use(naive)
  app.mount('#login-form')
})()
