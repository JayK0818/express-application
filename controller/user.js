const userModel = require('../model/user')
/**
 * @description 用户注册
*/
const userRegistry = async (req, res, next) => {
  try {
    const { username, password, email } = req.body
    const isUserExist = await userModel.findOne({
      username
    })
    if (isUserExist) {
      throw new Error('用户名已存在')
    }
    const isEmailExist = await userModel.findOne({
      email
    })
    if (isEmailExist) {
      throw Error('邮箱已经注册')
    }
    const user = new userModel(req.body)
    await user.save()
    res.json(null)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  userRegistry
}