const express = require('express')
const { validate } = require('../validator/index.js')
const { body } = require('express-validator')

// creates a new router object.
const router = express.Router()
const todoController = require('../controllers/todo')

router.post('/add', validate(
  [
    body('text', '代办事项不得为空').notEmpty(),
    body('text', '参数类型不合法').isString(),
    body('text', '代办事项不得少于5个字符').isLength({
      min: 5,
      max: 100
    })
  ]
), todoController.addTodo)

module.exports = router