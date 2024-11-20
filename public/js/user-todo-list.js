const { createApp, ref, onMounted } = window.Vue
const { createDiscreteApi } = window.naive
const { message } = createDiscreteApi(['message'])

;(function () {
  const app = createApp({
    setup() {
      const title = ref('What next todo?')
      const text = ref('')
      const spinning = ref(false)
      const state = ref({
        page: 1,
        size: 5,
        list: [],
        total_page: 0,
      })
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
      /**
       * @description 获取用户todo-list列表
       */
      const get_user_todo_list = () => {
        spinning.value = true
        const { page, size } = state.value
        service
          .get('todo/list', {
            params: {
              page,
              size,
            },
          })
          .then((res) => {
            state.value = res
          })
          .catch((err) => {
            message.warning(err)
          })
          .finally(() => {
            spinning.value = false
          })
      }
      onMounted(() => {
        get_user_todo_list()
      })
      return {
        title,
        spinning,
        text,
        state,
        handle_add_todo,
      }
    },
  })
  app.use(naive)
  app.mount('#todo-list-app')
})()
