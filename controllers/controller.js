const { User, Course, Category, Subscription, UserProfile } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { stringSlice } = require("../helper/formatter");

class Controller {
  static async home(req, res) {
    const { username } = req.session;
    const { search } = req.query;
    try {
      const options = { include: [Category, Subscription] }

      if (search) options.where = { name: { [Op.iLike]: `%${search}%` } }

      const dataCourse = await Course.findAll(options);
      res.render("home", { dataCourse, username, stringSlice });
    } catch (error) {
      console.log(error);
      res.send(error)
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
    const { error } = req.query;
    res.render("register", { username, error });
  }

  static async register(req, res) {
    const { username, password, email } = req.body;
    try {
      await User.create({ username, password, email });
      res.redirect("/login");
    } catch (error) {
      console.log(error);
      if (error.name === "SequelizeValidationError") {
        const errorMessages = error.errors.map((err) => err.message);
        res.redirect(`/register?error=${errorMessages}`);
      } else {
        res.send(error);
      }
    }
  }

  static async subscribe(req, res) {
    const { CourseId } = req.params;
    try {
      const user = await User.findOne({ where: { username: req.session.username } });
      await Subscription.create({ UserId: user.id, CourseId });

      res.redirect("/mycourses");
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
      res.render("myCourses", { dataCourse, username, stringSlice });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async viewCourse(req, res) {
    const { username } = req.session;
    const { CourseId } = req.params;
    try {
      const data = await Course.findOne({
        where: {
          id: CourseId
        }
      })
      res.render('viewCourse', { data, username });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
