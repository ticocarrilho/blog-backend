require('dotenv').config();
const express = require('express');
const cors = require('cors');
const csrf = require('csurf');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

class AppController {
  buildPath = path.join(__dirname, '..', 'build');

  constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.express.use(morgan('common'));
    if (process.env.NODE_ENV === 'development') {
      this.express.use(cors({
        credentials: true,
        origin: 'http://localhost:3000',
        optionsSuccessStatus: 200
      }));
    }
    else if(process.env.NODE_ENV === 'production') {
      this.express.use(cors({
        credentials: true,
        origin: 'https://blog-node-react.herokuapp.com',
        optionsSuccessStatus: 200
      }));
    }
    this.express.use(cookieParser(process.env.COOKIE_SECRET));
    this.express.use(
      csrf({
        cookie:{
          key: '_csrf',
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600
        }
        
      })
    );
    this.express.use(express.json());
  }
  routes() {
    if(process.env.NODE_ENV === 'production') {
      this.express.use(express.static(this.buildPath));
    }
    this.express.use(require('./routes'));
  }
}

module.exports = new AppController().express;
