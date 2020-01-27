import { PaymentManager } from '../processes/PaymentManager';
import { Request, Response } from 'express';
import passport = require('passport');

export class PaymentRouter {
    paymentManager: PaymentManager;
    constructor(private app) {
        this.paymentManager = new PaymentManager();
    }

    public initRoutes() {
        this.app
            .route('/api/v1/orders/:orderId/payment/razorpay')
            .post(
                (req: Request, res: Response) => {
                    this.paymentManager.placeRazorPayOrder(req, res);
                }
            );

        this.app
            .route('/api/v1/orders/:orderId/payment/razorpay/verify')
            .post(
                (req: Request, res: Response) => {
                    this.paymentManager.verifyPayment(req, res);
                }
            );
    }
}