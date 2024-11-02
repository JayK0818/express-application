const express = require('express')
const mongoose = require('mongoose')
const { validate, userAuthorization } = require('../middleware/index.js')
const { body } = require('express-validator')

// creates a new router object.
const router = express.Router()
const todoController = require('../controller/todo.js')

/**
 * @description 创建代办事项
*/
router.post('/add', userAuthorization(), validate(
  [
    body('text', '代办事项不得为空').trim().notEmpty(),
    body('text', '参数类型不合法').isString(),
    body('text', '代办事项不得少于5个字符').isLength({
      min: 5,
      max: 100
    })
  ]
), todoController.addTodo)

/**
 * @description 获取代办事项列表
*/
router.get('/list', userAuthorization(), todoController.getTodoList)

/**
 * @description 更新用户代办事项
*/
router.post('/update',
  userAuthorization(),
  validate([
    body('id', '代办事项id不得为空').notEmpty(),
    body('id', 'id类型不合法').trim().isString(),
    body('id').custom(async value => {
      try {
        const isValid = mongoose.isValidObjectId(value)
        if (!isValid) {
          throw new Error('id不合法')
        }
      } catch (err) {
        throw new Error(err)
      }
    }),
    body('text').optional().trim().isString(),
    body('toggle').optional().isBoolean()
  ]),
  todoController.updateTodo
)

module.exports = router