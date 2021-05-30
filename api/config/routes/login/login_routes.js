const Authorize = require('../../../app/Authorize.js')
// const LoginClass = require('../../../app/Controllers/LoginController.js')

// const LoginController = new LoginClass()

const loginRouter = require('koa-router')({
  prefix: '/login'
})

// loginRouter
//   .get('/:user_id', LoginController.authorizeUser, err => `login_routes: ${err}`)

module.exports = loginRouter
