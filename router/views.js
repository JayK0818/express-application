const express = require('express')
const viewsController = require('../controller/views')

const router = express.Router()

router.get('/login', viewsController.userLogin)
router.get('/register', viewsController.userRegister)
router.get('/todo-list', viewsController.userTodoList)

module.exports = router
