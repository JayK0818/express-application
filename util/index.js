const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const secret = 'express_application'

/**
 * @description 生成token
*/
const genLoginToken = (payload) => {
  return jwt.sign(payload, secret, {
    expiresIn: '2h',
    noTimestamp: true
  })
}

/**
 * @description 验证token
*/
const validateToken = (token) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    return false
  }
}

/**
 * @description 判断是否为合法的mongoose id
*/
const validateMongooseId = async (value) => {
  try {
    const isValid = mongoose.isValidObjectId(value)
    if (!isValid) {
      throw new Error('id不合法')
    }
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * @description 验证用户注册名称
*/
const validateUsername = async (value) => {
  const reg = /^[a-zA-Z]+\w*[a-zA-Z0-9]$/;
  if (!reg.test(value)) {
    // if a custom validator throws, the thrown value will be used as its error message
    throw new Error('用户名必须字母开头, 且只能包含数字和字母')
  }
}

module.exports = {
  genLoginToken,
  validateMongooseId,
  validateUsername,
  validateToken
}
