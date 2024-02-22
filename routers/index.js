const express = require("express");
const Middleware = require("../middleware/middleware");
const Controller = require("../controllers/controller");
const router = express.Router();

router.get("/", Middleware.auth, Controller.home);
router.get("/login", Middleware.login, Controller.loginPage);
router.post("/login", Controller.login);
router.get("/logout", Controller.logout);
router.get("/register", Middleware.login, Controller.registerPage);
router.post("/register", Controller.register);
router.get("/subscribe/:CourseId", Middleware.auth, Controller.subscribe);
router.get("/mycourses", Middleware.auth, Controller.myCourses);
router.get("/mycourses/:CourseId", Middleware.auth, Controller.viewCourse);
router.get("/mycourses/:CourseId/unsubscribe", Middleware.auth, Controller.unsubscribe);

router.get("/admin", Middleware.admin, Controller.admin);

module.exports = router;
