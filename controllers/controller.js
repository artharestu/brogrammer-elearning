const { User, Course, Category, Subscription, UserProfile } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

class Controller {
  static async home(req, res) {
    const { username } = req.session;
    try {
      const dataCourse = await Course.findAll({ include: Category })

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

  static async subscribe(req, res) {
    const { CourseId } = req.params;
    try {
      const user = await User.findOne({ where: { username: req.session.username } });
      await Subscription.create({ UserId: user.id, CourseId });

      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async myCourses(req, res) {
    const { username } = req.session;
    try {
      const { id } = await User.findOne({ where: { username } });
      const dataCourse = await Course.findAll({
        include: [Category, {
          model: Subscription,
          where: {
            UserId: {
              [Op.eq]: id
            }
          }
        }],
      });
      res.render("myCourses", { dataCourse, username });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
