const { createApp, ref, shallowRef, onMounted } = window.Vue
const { createDiscreteApi } = window.naive
const { message } = createDiscreteApi(['message'])
;(function () {
  const app = createApp({
    setup() {
      const state = ref({
        username: '',
        password: '',
      })
      const checked = ref(false)
      const spinning = ref(false)
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
              spinning.value = true
              const { username, password } = state.value
              service
                .post('user/login', {
                  username,
                  password,
                })
                .then(() => {
                  if (checked.value) {
                    save_user(state.value)
                  } else {
                    remove_user()
                  }
                  window.location.href = '/'
                  message.success('登录成功')
                })
                .catch((err) => {
                  message.error(err)
                })
                .finally(() => {
                  spinning.value = false
                })
            }
          })
        } catch (err) {
          console.log(err)
        }
      }
      onMounted(() => {
        const user = get_user()
        if (!user) {
          return
        }
        if (user.username) {
          state.value.username = user.username
        }
        if (user.password) {
          state.value.password = user.password
        }
      })
      return {
        state,
        rules,
        checked,
        formRef,
        spinning,
        handleLogin,
      }
    },
  })
  app.use(naive)
  app.mount('#login-form')
})()
