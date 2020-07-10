const jwt = require('jsonwebtoken')

function authRequired (req, res, next) {
  // Get auth header
  const authHeader = req.headers.authorization

  // Check if authorization header is not undefined
  if (typeof authHeader === 'undefined') {
    return res.sendStatus(401)
  }
  // split: [0] = "Bearer", [1] = <token>
  const headerContent = authHeader.split(' ')
  const token = headerContent[1]

  req.token = token

  jwt.verify(token, process.env.SECRET_KEY, function (err, authData) {
    if (!err) {
      req.user = authData.user
      next()
    } else {
      console.error(err)
      return res.sendStatus(401)
    }
  })
}

module.exports.authRequired = authRequired
