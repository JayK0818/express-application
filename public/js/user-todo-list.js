const { createApp, ref, onMounted, h, shallowRef } = window.Vue
const { createDiscreteApi } = window.naive
const { message, modal } = createDiscreteApi(['message', 'modal'])

;(function () {
  const app = createApp({
    setup() {
      const title = ref('What next todo?')
      const text = ref('')
      const spinning = ref(false)
      const loading = ref(false)
      const modelRef = shallowRef(null)
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
            get_user_todo_list()
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
            console.log(err)
            message.warning(err)
          })
          .finally(() => {
            spinning.value = false
          })
      }
      /**
       * @description 切换是否完成todo
       */
      const toggle_todo_completed = (todo) => {
        loading.value = true
        service
          .post('todo/update', {
            id: todo._id,
            toggle: true,
          })
          .then(() => {
            message.success('success')
            modelRef.value.destroy()
            get_user_todo_list()
          })
          .catch((err) => {
            message.warning(err)
          })
          .finally(() => {
            loading.value = false
          })
      }
      const handle_toggle_todo = (todo) => {
        modelRef.value = modal.create({
          title: todo.completed ? `取消完成` : '确认完成',
          preset: 'card',
          content: '确认切换当前任务的完成状态吗',
          style: {
            width: '460px',
          },
          footer: () =>
            h(
              'div',
              {
                style: {
                  padding: '12px 0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                },
              },
              [
                h(
                  naive.NButton,
                  {
                    type: 'error',
                    onClick: () => modelRef.value.destroy(),
                    size: 'small',
                  },
                  () => '关闭'
                ),
                h(
                  naive.NButton,
                  {
                    type: 'primary',
                    onClick: () => toggle_todo_completed(todo),
                    size: 'small',
                    loading: loading.value,
                    style: { marginLeft: '10px' },
                  },
                  () => '确定'
                ),
              ]
            ),
        })
      }
      /**
       * @description 删除todo
       */
      const delete_todo = (todo) => {
        loading.value = true
        service
          .post('todo/delete', {
            id: todo._id,
          })
          .then(() => {
            message.success('success')
            modelRef.value.destroy()
            get_user_todo_list()
          })
          .catch((err) => {
            message.warning(err)
          })
          .finally(() => {
            loading.value = false
          })
      }
      const handle_delete_todo = (todo) => {
        modelRef.value = modal.create({
          title: '删除代办事项',
          content: '确认删除当前代办事项吗? 删除后可在回收站恢复!',
          style: {
            width: '450px',
          },
          preset: 'card',
          footer: () =>
            h(
              'div',
              {
                style: {
                  padding: '12px 0',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                },
              },
              [
                h(
                  naive.NButton,
                  {
                    type: 'error',
                    tertiary: true,
                    onClick: () => modelRef.value.destroy(),
                    size: 'small',
                  },
                  () => '关闭'
                ),
                h(
                  naive.NButton,
                  {
                    type: 'error',
                    onClick: () => delete_todo(todo),
                    size: 'small',
                    loading: loading.value,
                    style: { marginLeft: '10px' },
                  },
                  () => '删除'
                ),
              ]
            ),
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
        handle_toggle_todo,
        handle_add_todo,
        handle_delete_todo,
      }
    },
  })
  app.use(naive)
  app.mount('#todo-list-app')
})()
