const express = require('express')
const mongoose = require('mongoose')
const { validate, userAuthorization } = require('../middleware/index.js')
const { body, param, query } = require('express-validator')
const { validateMongooseId } = require('../util/index')

// creates a new router object.
const router = express.Router()
const todoController = require('../controller/todo.js')

/**
 * @description 创建代办事项
 */
router.post(
  '/add',
  userAuthorization(),
  validate([
    body('text', '代办事项不得为空').trim().notEmpty(),
    body('text', '参数类型不合法').isString(),
    body('text', '代办事项不得少于5个字符').isLength({
      min: 5,
      max: 100,
    }),
  ]),
  todoController.addTodo
)

/**
 * @description 获取代办事项列表
 */
router.get(
  '/list',
  validate([
    query('page').trim().optional().isNumeric().withMessage('页数必须为数字'),
    query('size').trim().optional().isNumeric().withMessage('数量必须为数字'),
  ]),
  userAuthorization(),
  todoController.getTodoList
)

/**
 * @description 更新用户代办事项
 */
router.post(
  '/update',
  userAuthorization(),
  validate([
    body('id', '代办事项id不得为空').notEmpty(),
    body('id', 'id类型不合法').trim().isString(),
    body('id').custom(validateMongooseId),
    body('text').optional().trim().isString(),
    body('toggle').optional().isBoolean(),
  ]),
  todoController.updateTodo
)

/**
 * @description 删除用户创建的todo
 */
router.post(
  '/delete',
  userAuthorization(),
  validate([
    body('id', '代办事项id不得为空').notEmpty(),
    body('id', 'id类型不合法').trim().isString(),
    body('id').custom(validateMongooseId),
  ]),
  todoController.deleteTodo
)

/**
 * @description 查询一个todo
 */
router.get(
  '/get-todo/:id',
  userAuthorization(),
  validate([
    param('id', '代办事项id不得为空').notEmpty(),
    param('id', 'id类型不合法').trim().isString(),
    param('id').custom(validateMongooseId),
  ]),
  todoController.getTodo
)

module.exports = router
