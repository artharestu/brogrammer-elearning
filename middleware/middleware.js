const { User } = require("../models");

class Middleware {
  static auth(req, res, next) {
    req.session.username ? next() : res.redirect('/login');
  }

  static login(req, res, next) {
    if (req.session.username) {
      res.redirect('/');
    } else {
      next()
    }
  }

  static async admin(req, res, next) {
    if (req.session.username) {
      try {
        const data = await User.findOne({
          where: {
            role: 'Admin'
          }
        })
        data ? next() : res.redirect('/')
      } catch (error) {
        console.log(error)
      }
    } else {
      res.redirect('/')
    }
  }
}

module.exports = Middleware;