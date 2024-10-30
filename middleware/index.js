const { validationResult } = require('express-validator')

/**
 * @description 校验body
*/
const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req)
      const message = Array.isArray(result.array())
        ? result.array()
        : '参数校验未通过'
      if (!result.isEmpty()) {
        return res.status(400).original_json({
          msg: message.map(item => item.msg).join(','),
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