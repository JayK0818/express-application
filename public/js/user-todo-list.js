const { createApp, ref } = window.Vue
const { createDiscreteApi } = window.naive
const { message } = createDiscreteApi(['message'])

;(function () {
  const app = createApp({
    setup() {
      const title = ref('What next todo?')
      const text = ref('')
      const spinning = ref(false)
      /**
       * @description 新增代办事项
       */
      const handle_add_todo = () => {
        if (!text.value) {
          message.warning('代办事项不得为空')
          return
        }
        spinning.value = true
        service
          .post('todo/add', {
            text: text.value.trim(),
          })
          .then(() => {
            message.success('success')
            text.value = ''
          })
          .catch((err) => {
            message.warning(err)
          })
          .finally(() => {
            spinning.value = false
          })
      }
      return {
        title,
        spinning,
        text,
        handle_add_todo,
      }
    },
  })
  app.use(naive)
  app.mount('#todo-list-app')
})()
