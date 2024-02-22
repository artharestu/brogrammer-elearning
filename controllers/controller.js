const { User, Course, Category, Subscription, UserProfile } = require("../models");
const bcrypt = require("bcrypt");

class Controller {
  static async home(req, res) {
    /**menampilkan username di navbar */
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
    res.render("login", { username });
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
    /** register username harus ada username nya
     * kerena di nav.ejs nya ada pengandaian yang menggunakan
     * variabel username. jika tidak ada yang oper dari render
     * register page maka akan terjadi error
     */
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
      console.log(dataProfile);
      /** render gapake (/) untuk sebelah kiri <nama file ejs> */
      res.render("showProfile", { dataProfile, username });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  // static async showProfile(req, res) {
  //   // const { username } = req.session;
  //   try {
  //     // let dataProfile = await UserProfile.findAll({});
  //     res.render("showProfile");
  //   } catch (error) {
  //     console.log(error.message);
  //     res.send(error);
  //   }
  // }
}

module.exports = Controller;
