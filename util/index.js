const jwt = require('jsonwebtoken')

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

module.exports = {
  genLoginToken
}
