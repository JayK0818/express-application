const { validationResult } = require('express-validator')

/**
 * @description 校验body
*/
const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req)
      const message = Array.isArray(result.array())
        ? result.array().map(item => `${item.path}: ${item.msg}`).join(',')
        : '参数校验未通过'
      if (!result.isEmpty()) {
        return res.status(400).json({
          msg: message,
          code: 0,
          data: null
        })
      }
    }
    next()
  }
}

module.exports = {
  validate
}