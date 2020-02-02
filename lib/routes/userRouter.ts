import { UserManager } from '../processes/UserManager';
import { Request, Response } from 'express';
import passport = require('passport');

export class UserRouter {
  userManager: UserManager;
  constructor(private app) {
    this.userManager = new UserManager();
  }

  public initRoutes() {
    this.app
      .route('/api/v1/users')
      .post(
        (req: Request, res: Response) => {
          this.userManager.createUser(req, res);
        }
      );

    this.app.route('/api/v1/login').post((req: Request, res: Response) => {
      this.userManager.login(req, res);
    });

    this.app
      .route('/api/v1/users/:id')
      .get(passport.authenticate('jwt', { session: false }),
        (req: Request, res: Response) => {
          this.userManager.getUserDetails(req, res);
        }
      );
  }
}
