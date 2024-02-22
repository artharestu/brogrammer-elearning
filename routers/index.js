const express = require("express");
const Middleware = require("../middleware/middleware");
const Controller = require("../controllers/controller");
const router = express.Router();

router.get("/", Middleware.auth, Controller.home);
router.get("/login", Middleware.login, Controller.loginPage);

/** ini untuk user profile */
router.get("/userProfile", Middleware.login, Controller.inputUserProf);
router.post("/userProfile", Middleware.login, Controller.userProf);
// router.get("/showProfile", Middleware.login, Controller.showProfile);

/** ini untuk user profile */

router.post("/login", Controller.login);
router.get("/logout", Controller.logout);
router.get("/register", Middleware.login, Controller.registerPage);
/** yang controller ga berhubungan sama menampilkan sebuah tampilan
 * di user maka gaperlu middleware
 */

router.post("/register", Controller.register);

module.exports = router;
