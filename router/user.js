const express = require('express')
const router = express.Router()
const userController = require('../controller/user.js')
const { validate } = require('../middleware/index.js')
const { body } = require('express-validator')


router.post('/registry',
  validate(
    [
      body('username', '用户名不得为空').notEmpty(),
      body('username', '用户名类型不合法').isString(),
      body('username', '用户名长度不合法').isLength({
        min: 6,
        max: 20
      }),
      body('username').custom(async value => {
        const reg = /^[a-zA-Z0-9]+$/;
        if (!reg.test(value)) {
          throw new Error('用户名只能包含数字和字母')
        }
      })
    ]
  ),
  userController.userRegistry
)

module.exports = router