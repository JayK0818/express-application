const argon = require('argon2')
const jwt = require('jsonwebtoken')
const UserModel = require('../model/user')
const { genLoginToken } = require('../util/index')
const chalk = require('chalk')

/**
 * @description 用户注册
 */
const userRegister = async (req, res, next) => {
  try {
    const { username, password, email } = req.body
    const isUserExist = await UserModel.findOne({
      username,
    })
    if (isUserExist) {
      throw new Error('用户名已存在')
    }
    const isEmailExist = await UserModel.findOne({
      email,
    })
    if (isEmailExist) {
      throw Error('邮箱已经注册')
    }
    const hash_password = await argon.hash(password)
    const user = new UserModel({
      username,
      password: hash_password,
      email,
    })
    await user.save()
    res.json(null)
  } catch (err) {
    next(err)
  }
}

/**
 * @description 用户登录
 */
const userLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const user = await UserModel.findOne({
      username,
    })
    if (!user) {
      throw new Error('用户不存在, 请先注册!')
    }
    const isMatch = await argon.verify(user.password, password)
    if (isMatch) {
      const user_id = user._id
      const token = genLoginToken({
        user_id,
      })
      // 设置session
      req.session.user = user_id
      // 设置cookie (此处作为练习, 实际未使用)
      res.cookie('express-version', 1, {
        httpOnly: true,
        secure: false,
        sameSite: true,
      })
      res.json({
        token,
        username,
      })
    } else {
      throw new Error('密码错误')
    }
  } catch (err) {
    next(err)
  }
}

/**
 * @description 用户退出登录
 */
const userLogout = async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      next(err)
    } else {
      res.json(null)
    }
  })
}

module.exports = {
  userRegister,
  userLogin,
  userLogout,
}
