const express = require('express')
const router = express.Router()
const userController = require('../controller/user.js')
const { validate } = require('../middleware/index.js')
const { body, checkExact } = require('express-validator')

router.post('/registry',
  validate(
    [
      body('username', '用户名不得为空').trim().notEmpty(),
      body('username', '用户名类型不合法').isString(),
      body('username', '用户名长度不合法').isLength({
        min: 6,
        max: 20
      }),
      body('username').custom(async value => {
        const reg = /^[a-zA-Z]+\w*[a-zA-Z0-9]$/;
        console.log('value', value, reg.test(value))
        if (!reg.test(value)) {
          // if a custom validator throws, the thrown value will be used as its error message
          throw new Error('用户名必须字母开头, 且只能包含数字和字母')
        }
      }),
      body('password', '密码不得为空').trim().notEmpty(),
      body('password', '密码类型不合法').isString(),
      body('email', '邮箱不得为空').trim().notEmpty(),
      body('email', '邮箱格式不正确').isEmail(),
      checkExact([], {
        message: '请不要传递多余字段'
      }),
    ]
  ),
  userController.userRegistry
)

module.exports = router