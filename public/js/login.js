$(document).ready(function () {
  const validate = () => {
    const username = $('.username-input').val()
    const password = $('.password-input').val()
    if (!username.trim()) {
      $('.username-input+.invalid-feedback').css({
        display: 'block',
      })
      return null
    } else {
      $('.username-input+.invalid-feedback').css({
        display: 'none',
      })
    }
    if (!password.trim()) {
      $('.password-input+.invalid-feedback').css({
        display: 'block',
      })
      return null
    } else {
      $('.password-input+.invalid-feedback').css({
        display: 'none',
      })
    }
    return {
      username,
      password,
    }
  }
  $('.login-button').on('click', () => {
    const isValidate = validate()
    if (!isValidate) {
      return
    }
    const { username, password } = isValidate
    console.log(username, password)
  })
})
