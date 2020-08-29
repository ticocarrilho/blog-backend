require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
const express = require('express');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(cookieParser(process.env.COOKIE_SECRET));
    this.express.use(
      csrf({
        cookie: true,
      })
    );
    this.express.use(express.json());
  }
  routes() {
    this.express.use(require('./routes'));
  }
}

module.exports = new AppController().express;
