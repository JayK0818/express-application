const TodoModel = require('../model/todo')
/**
 * @description 创建todo
 */
const addTodo = async (req, res, next) => {
  try {
    const { text = '' } = req.body ?? {}
    const isExist = await TodoModel.findOne({
      is_del: 0,
      text,
      user: req.user.id,
    })
    if (isExist) {
      throw new Error('代办事项请勿重复创建!')
    }
    const todo = new TodoModel({
      ...req.body,
      completed: false,
      user: req.user.id,
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
    // req.session.user 为下发cookie时赋的值, 过期时值为undefined
    const { page = 1, size = 10 } = req.query ?? {}
    const skip = (page - 1) * size
    const result = await TodoModel.find(
      {
        is_del: 0,
        user: req.user.id,
      },
      '_id text completed user'
    )
      .skip(skip)
      .limit(size)
      .populate('user', '_id username email')
    const length = await TodoModel.countDocuments({
      is_del: 0,
      user: req.user.id,
    })
    const total_page = Math.ceil(length / size)
    res.json({
      list: result,
      page: Number(page),
      total_page,
      size: Number(size),
    })
  } catch (err) {
    next(err)
  }
}

/**
 * @description 根据id查询todo
 */
const getTodo = async (req, res, next) => {
  try {
    const query = TodoModel.findOne({
      user: req.user.id,
      _id: req.params.id,
      is_del: 0,
    })
    query.select('text completed')
    const todo = await query.exec()
    res.json(todo)
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
    const todo = await TodoModel.findOne({
      _id: id,
      user: req.user.id,
      is_del: 0,
    })
    if (!todo) {
      throw new Error('代办事项不存在, 无法更新!')
    }
    // 判断是否存在
    if (text) {
      const result = await TodoModel.find({
        text,
        is_del: 0,
      })
      if (Array.isArray(result) && result.find((item) => item._id !== id)) {
        throw new Error('代办事项已存在, 无法更新')
      }
    }
    await TodoModel.updateOne(
      {
        _id: id,
      },
      {
        completed: toggle ? !todo.completed : todo.completed,
        text: text || todo.text,
      }
    )
    res.json(null)
  } catch (err) {
    next(err)
  }
}

/**
 * @description 删除一条数据
 */
const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.body
    const todo = await TodoModel.findOne({
      _id: id,
      user: req.user.id,
      is_del: 0,
    })
    if (!todo) {
      throw new Error('代办事项不存在')
    }
    await TodoModel.updateOne(
      {
        _id: id,
      },
      {
        is_del: 1,
      }
    )
    res.json(null)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addTodo,
  getTodoList,
  getTodo,
  updateTodo,
  deleteTodo,
}
