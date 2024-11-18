const UserModel = require('../model/user')
/**
 * @description 用户登录
 */
const userLogin = async (req, res, next) => {
  res.render('login')
}

/**
 * @description 用户注册
 */
const userRegister = async (req, res, next) => {
  res.render('register')
}

/**
 * @description 用户todo-list
 */
const userTodoList = async (req, res, next) => {
  const user = await UserModel.findById(req.session.user)
  if (!user) {
    return res.redirect('/register')
  }
  res.render('todo-list', {
    user: user.username,
  })
}

/**
 * @description 首页
 */
const homePage = async (req, res, next) => {
  res.render('index')
}

module.exports = {
  userLogin,
  userRegister,
  userTodoList,
  homePage,
}
