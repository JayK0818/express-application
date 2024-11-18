const express = require('express')
const router = express.Router()
const userController = require('../controller/user.js')
const { validate } = require('../middleware/index.js')
const { body, checkExact } = require('express-validator')
const { validateUsername } = require('../util/index')

// 用户注册
router.post(
  '/register',
  validate([
    body('username', '用户名不得为空').trim().notEmpty(),
    body('username', '用户名长度不合法').isLength({
      min: 6,
      max: 20,
    }),
    body('username').custom(validateUsername),
    body('password', '密码不得为空').trim().notEmpty(),
    body('email', '邮箱不得为空').trim().notEmpty(),
    body('email', '邮箱格式不正确').isEmail(),
    checkExact([], {
      message: '请不要传递多余字段',
    }),
  ]),
  userController.userRegister
)

// 用户登录
router.post(
  '/login',
  validate([
    body('username').trim().notEmpty().withMessage('用户名不得为空'),
    body('password').trim().notEmpty().withMessage('密码不得为空'),
  ]),
  userController.userLogin
)

/**
 * @description 用户退出登录
 */

module.exports = router
