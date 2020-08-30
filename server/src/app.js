require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});
const express = require('express');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const path = require('path');

class AppController {
  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(
      cors({
        origin: 'https://blog-node-react.herokuapp.com/',
      })
    );
    this.express.use(cookieParser(process.env.COOKIE_SECRET));
    this.express.use(
      csrf({
        cookie: true,
      })
    );
    this.express.use(express.json());
  }
  routes() {
    this.express.use(
      express.static(path.join(__dirname, '..', '..', 'client', 'build'))
    );
    this.express.use(require('./routes'));
    this.express.get('*', (req, res) => {
      res.sendFile(
        path.join(__dirname, '..', '..', 'client', 'build', 'index.html')
      );
    });
  }
}

module.exports = new AppController().express;
