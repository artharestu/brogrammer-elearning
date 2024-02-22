const { User, Course, Category, Subscription, UserProfile } = require("../models");
const bcrypt = require("bcrypt");

class Controller {
  static async home(req, res) {
    const { username } = req.session;
    try {
      let dataCourse = await Course.findAll({ include: Category });
      res.render("home", { dataCourse, username });
    } catch (error) {
      console.log(error);
      res.send(error);
    }

  }

  static loginPage(req, res) {
    const { username } = req.session;
    res.render('login', { username })
  }

  static async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        throw {
          name: "UserNotFound",
          message: "User not found",
        };
      }

      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        throw {
          name: "InvalidPassword",
          message: "Invalid password",
        };
      }

      req.session.username = user.username;

      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  static registerPage(req, res) {
    const { username } = req.session;
    res.render("register", { username });
  }

  static async register(req, res) {
    const { username, password, email } = req.body;
    try {
      await User.create({ username, password, email });
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
