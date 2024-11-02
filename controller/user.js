const argon = require('argon2')
const jwt = require('jsonwebtoken')
const UserModel = require('../model/user')
const { genLoginToken } = require('../util/index')
const chalk = require('chalk')

/**
 * @description 用户注册
*/
const userRegistry = async (req, res, next) => {
  try {
    const { username, password, email } = req.body
    const isUserExist = await UserModel.findOne({
      username
    })
    if (isUserExist) {
      throw new Error('用户名已存在')
    }
    const isEmailExist = await UserModel.findOne({
      email
    })
    if (isEmailExist) {
      throw Error('邮箱已经注册')
    }
    const hash_password = await argon.hash(password)
    const user = new UserModel({
      username,
      password: hash_password,
      email
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
    const { username, password } = req.body;
    const user = await UserModel.findOne({
      username
    })
    if (!user) {
      throw new Error('用户不存在, 请先注册!')
    }
    const isMatch = await argon.verify(user.password, password)
    if (isMatch) {
      const token = genLoginToken({
        user_id: user._id
      })
      res.json({
        token,
        username
      })
    } else {
      console.log('错了吗')
      throw new Error('密码错误')
    }
  } catch (err) {
    next(err)
  }
}

module.exports = {
  userRegistry,
  userLogin
}