/**
 * @description 用户登录
 */
const userLogin = async (req, res, next) => {
  res.render('login')
}

/**
 * @description 用户注册
 */
const userRegister = async (req, res, next) => {}

/**
 * @description 用户todo-list
 */
const userTodoList = async (req, res, next) => {}

module.exports = {
  userLogin,
  userRegister,
  userTodoList,
}
