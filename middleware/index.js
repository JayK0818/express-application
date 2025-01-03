const { validationResult } = require('express-validator')
const { validateToken } = require('../util/index')
const UserModel = require('../model/user')

/**
 * @description 校验body
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req)
      const message = Array.isArray(result.array())
        ? result.array()
        : '参数校验未通过'
      if (!result.isEmpty()) {
        return res.status(200).original_json({
          msg: message.map((item) => item.msg).join(','),
          code: 0,
          data: null,
        })
      }
    }
    next()
  }
}

/**
 * @description 用户token解析中间件
 */
const userAuthorization = ({ is_auth_required = true } = {}) => {
  return async (req, res, next) => {
    if (!is_auth_required) {
      return next()
    }
    try {
      const token = (
        (req.headers['authorization'] ?? '').split('Bearer')[1] ?? ''
      ).trim()
      if (!token) {
        return res.status(200).original_json({
          msg: '请传递token',
          code: 0,
        })
      }
      const result = validateToken(token)
      if (!result) {
        return next('请重新登录')
      }
      const user = await UserModel.findById(result.user_id)
      if (!user) {
        return next('用户不存在')
      }
      req.user = {
        username: user.username,
        id: user._id.toString(),
      }
      next()
    } catch (err) {
      next(err)
    }
  }
}

/**
 * @description 状态过期是否可以访问页面
 */
const userSessionAuthorization = (req, res, next) => {
  const user = req.session.user
  if (!user) {
    return res.redirect('/login')
  }
  next()
}

module.exports = {
  validate,
  userAuthorization,
  userSessionAuthorization,
}
