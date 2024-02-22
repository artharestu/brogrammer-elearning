const express = require('express');
const router = require('./routers');
const session = require('express-session');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'brogrammer elearning',
  resave: false,
  saveUninitialized: true
}))

app.use('/', router);

app.listen(port, () => {
  console.log(`Brogrammer app is running at http://localhost:${port}/`);
});