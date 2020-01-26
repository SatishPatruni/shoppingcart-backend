import { ConnectionManager } from '../lib/processes/ConnectionManager';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { AppRouter } from './routes/appRouter';
import * as fileUpload from 'express-fileupload';

class App {
  public app: express.Application;
  private passport = require('passport');

  constructor() {
    this.app = express();
    this.config();
    this.setPassport();
    this.setCors();
    new AppRouter(this.app).initRoutes();

    let connection = new ConnectionManager().getConnection();

    connection
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err);
      });
  }

  private setPassport(): void {
    this.app.use(this.passport.initialize());
    this.app.use(this.passport.session());
    require('./utils/passport')(this.passport);
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(fileUpload());
  }

  private setCors(): void {
    this.app.use(function(req, res, next) {
      let allowedOrigins = ['http://127.0.0.1:4200', 'http://localhost:4200'];
      console.log(req.headers);
      if (req.headers.origin) {
        let origin = req.headers.origin.toString();

        console.log('origin:' + origin);
        if (origin) {
          if (allowedOrigins.indexOf(origin) > -1) {
            res.setHeader('Access-Control-Allow-Origin', origin);
          }
        }
      }
      res.header(
        'Access-Control-Allow-Methods',
        'GET, PUT, POST, DELETE, OPTIONS'
      );
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      return next();
    });
  }
}

export default new App().app;
