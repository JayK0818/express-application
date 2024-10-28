/**
 * @description 创建todo
*/
const addTodo = (req, res, next) => {
  try {
    res.json('hello world!123456')
  } catch (err) {
    next(err)
  }
}

module.exports = {
  addTodo
}