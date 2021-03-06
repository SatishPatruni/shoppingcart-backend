import { Request, Response } from 'express';
import passport = require('passport');
import { OrderManager } from '../processes/OrderManager';

export class OrderRouter {
    orderManager: OrderManager;
    constructor(private app) {
        this.orderManager = new OrderManager();
    }

    public initRoutes() {
        this.app
            .route('/api/v1/orders')
            .post(passport.authenticate('jwt', { session: false }),
                (req: Request, res: Response) => {
                    this.orderManager.createOrder(req, res);
                }
            );

        this.app
            .route('/api/v1/orders/:orderId')
            .put(passport.authenticate('jwt', { session: false }),
                (req: Request, res: Response) => {
                    this.orderManager.addProductToOrder(req, res);
                }
            );

        this.app
            .route('/api/v1/orders/:orderId')
            .get(passport.authenticate('jwt', { session: false }),
                (req: Request, res: Response) => {
                    this.orderManager.getOrderDetails(req, res);
                }
            );
    }
}