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

module.exports = router;
