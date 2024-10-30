const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 50
  },
  completed: {
    type: Boolean,
    required: true
  }
})

const TodoModel = mongoose.model('todo', todoSchema)

module.exports = TodoModel