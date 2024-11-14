const express = require('express')
const viewsController = require('../controller/views')
const { userSessionAuthorization } = require('../middleware/index')

const router = express.Router()

router.get('/', userSessionAuthorization, (req, res) => {
  res.redirect('/todo-list')
})
router.get('/login', viewsController.userLogin)
router.get('/register', viewsController.userRegister)
router.get('/todo-list', userSessionAuthorization, viewsController.userTodoList)

module.exports = router
