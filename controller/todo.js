const TodoModel = require('../model/todo')
/**
 * @description 创建todo
*/
const addTodo = async (req, res, next) => {
  try {
    const todo = new TodoModel({
      ...req.body,
      completed: false,
      user: req.user.id
    })
    await todo.save()
    res.status(200).json(null)
  } catch (err) {
    next(err)
  }
}

/**
 * @description 获取用户的代办事项列表
*/
const getTodoList = async (req, res, next) => {
  try {
    const result = await TodoModel.find().populate('user')
    res.json(result)
  } catch (err) {
    next(err)
  }
}

/**
 * @description 编辑用户代办事项
*/
const updateTodo = async (req, res, next) => {
  try {
    const { id, text = '', toggle = false } = req.body
    const todo = await TodoModel.findById(id)
    if (!todo) {
      throw new Error('代办事项不存在, 无法更新!')
    }
    if (todo.user.toString() !== req.user.id) {
      throw new Error('只能更新本人代办事项')
    }
    await TodoModel.updateOne({
      _id: id
    }, {
      completed: toggle ? !todo.completed : todo.completed,
      text: text || todo.text
    })
    res.json(null)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addTodo,
  getTodoList,
  updateTodo
}