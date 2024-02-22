class Middleware {
  static auth(req, res, next) {
    req.session.userId ? next() : res.redirect('/login');
  }

  static login(req, res, next) {
    if (req.session.userId) {
      res.redirect('/');
    } else {
      next()
    }
  }
}

module.exports = Middleware;