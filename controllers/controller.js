const { User, Course, Category, Subscription, UserProfile } = require("../models");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { stringSlice } = require("../helper/formatter");
const qrcode = require('qrcode');
class Controller {
  static async home(req, res) {
    const { username } = req.session;
    const { search } = req.query;
    try {
      const options = { include: [Category, Subscription] }

      if (search) options.where = { name: { [Op.iLike]: `%${search}%` } }

      const dataCourse = await Course.findAll(options);
      const user = await User.findOne({ where: { username } })
      res.render("home", { dataCourse, username, stringSlice, user });
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
    const { message } = req.query;
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
      res.render("myCourses", { dataCourse, username, stringSlice, message });
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

      const urlVideo = `https://www.youtube.com/embed/${data.urlVideo}`;

      qrcode.toDataURL(urlVideo, (err, url) => {
        if (err) throw err;
        res.render('viewCourse', { data, username, qrCodeURL: url });
      });


    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async unsubscribe(req, res) {
    const { CourseId } = req.params;
    const { username } = req.session;
    try {
      const user = await User.findOne({ where: { username } });

      await Subscription.destroy({
        where: {
          [Op.and]: [
            { UserId: user.id },
            { CourseId: CourseId }
          ]
        }
      })

      const dataCourse = await Course.findOne({
        where: {
          id: CourseId
        }
      })

      const message = `You have successfully unsubscribed from ${dataCourse.name}`

      res.redirect("/mycourses?message=" + message);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async admin(req, res) {
    const { username } = req.session;
    const { search } = req.query;
    try {
      const options = { include: [Category, Subscription] }

      if (search) options.where = { name: { [Op.iLike]: `%${search}%` } }

      const dataCourse = await Course.findAll(options);
      res.render("dashboardAdmin", { dataCourse, username, stringSlice });
    } catch (error) {
      console.log(error);
      res.send(error)
    }
  }

  static inputUserProf(req, res) {
    const { username } = req.session;
    /** SESSION adalah sebuah built in function nya express
     * jadi bisa membuat data yang di input dari user bisa tersimpan\ */
    res.render("inputUserProfile", { username });
  }

  static async userProf(req, res) {
    const { username } = req.session;
    const { fullName, profilePicture, dateOfBirth } = req.body;
    try {
      console.log(username);
      let user = await User.findOne({
        where: { username },
      });

      let UserId = user.id;
      let dataProfile = await UserProfile.create({ fullName, profilePicture, dateOfBirth, UserId });
      /** render gapake (/) untuk sebelah kiri <nama file ejs> */
      res.render("showProfile", { dataProfile, username });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async editVideo(req, res) {
    const { username } = req.session;
    const { CourseId } = req.params;
    try {
      const data = await Course.findOne({
        where: {
          id: CourseId
        }
      })
      const category = await Category.findAll();

      res.render("editVideo", { username, data, category });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async saveVideo(req, res) {
    const { CourseId } = req.params;
    const { name, urlVideo, price, description, CategoryId } = req.body;
    try {
      await Course.update({ name, urlVideo, price, description, CategoryId }, {
        where: {
          id: CourseId
        }
      })
      res.redirect("/admin");
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }
}

module.exports = Controller;
