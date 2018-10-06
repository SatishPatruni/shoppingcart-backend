import { UserManager } from '../processes/UserManager';
import { Request, Response } from 'express';
import passport = require('passport');

export class UserRouter {
  userManager: UserManager;
  constructor(private app) {
    this.userManager = new UserManager();
  }

  public initRoutes() {
    //   this.app
    //     .route('/api/v1/users')
    //     .post(
    //       passport.authenticate('jwt', { session: false }),
    //       (req: Request, res: Response) => {
    //         this.userManager.createUser(req, res);
    //       }
    //     );
    //   this.app.route('/api/v1/login').post((req: Request, res: Response) => {
    //     this.userManager.login(req, res);
    //   });
    //   this.app
    //     .route('/api/v1/users/:id')
    //     .delete(
    //       passport.authenticate('jwt', { session: false }),
    //       (req: Request, res: Response) => {
    //         this.userManager.deleteUser(req, res);
    //       }
    //     );
    //   this.app
    //     .route('/api/v1/orgs/:orgId/users')
    //     .post(
    //       passport.authenticate('jwt', { session: false }),
    //       (req: Request, res: Response) => {
    //         this.userManager.createUser(req, res);
    //       }
    //     );
    //
  }
}
