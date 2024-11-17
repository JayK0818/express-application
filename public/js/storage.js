const key = '__todo_user__'
/**
 * @description 将用户信息存储至本地localStorage
 */
const save_user = (user) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(user))
  } catch (err) {}
}

/**
 * @description 从本地获取用户信息
 */
const get_user = () => {
  try {
    const data = JSON.parse(window.localStorage.getItem(key) ?? '{}')
    return data
  } catch (err) {
    return null
  }
}

/**
 * @description 删除本地存储的用户信息
 */
const remove_user = () => {
  try {
    window.localStorage.removeItem(key)
  } catch (err) {}
}
