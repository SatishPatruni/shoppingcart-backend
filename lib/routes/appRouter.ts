import { ConnectionManager } from '../processes/ConnectionManager';
import { UserRouter } from './userRouter';
import { PaymentRouter } from './paymentRouter';
import { ProductRouter } from './productRouter';
import { OrderRouter } from './orderRouter';

export class AppRouter {
  connectionManager: ConnectionManager;

  constructor(private app) {
    this.connectionManager = new ConnectionManager();
  }

  public initRoutes(): void {
    new UserRouter(this.app).initRoutes();
    new ProductRouter(this.app).initRoutes();
    new OrderRouter(this.app).initRoutes();
    new PaymentRouter(this.app).initRoutes();
  }
}
