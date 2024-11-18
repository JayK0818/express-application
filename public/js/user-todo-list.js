const { createApp, ref } = window.Vue
;(function () {
  const app = createApp({
    setup() {
      const title = ref('What next todo?')
      const text = ref('')
      const spinning = ref(false)
      return {
        title,
        spinning,
        text,
      }
    },
  })
  app.use(naive)
  app.mount('#todo-list-app')
})()
