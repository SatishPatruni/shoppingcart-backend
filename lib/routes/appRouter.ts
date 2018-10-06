import { ConnectionManager } from '../processes/ConnectionManager';
import { UserRouter } from './userRouter';

export class AppRouter {
  connectionManager: ConnectionManager;

  constructor(private app) {
    this.connectionManager = new ConnectionManager();
  }

  public initRoutes(): void {
    new UserRouter(this.app).initRoutes();
  }
}
