const TodoModel = require('../model/todo')
/**
 * @description 创建todo
*/
const addTodo = async (req, res, next) => {
  try {
    const todo = new TodoModel({
      ...req.body,
      completed: false
    })
    await todo.save()
    res.json(null)
  } catch (err) {
    next(err)
  }
}

/**
 * @description 获取用户的代办事项列表
*/
const getTodoList = async (req, res, next) => {
  try {
    const result = await TodoModel.find()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addTodo,
  getTodoList
}