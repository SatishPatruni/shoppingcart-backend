import { Request, Response } from 'express';
import { ConnectionManager } from './ConnectionManager';
import { Config } from '../config';
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import Razorpay = require('razorpay');

const razorPayInstance = new Razorpay({
    key_id: 'rzp_test_ThMPARsTfVfL7N',
    key_secret: 'Nv3j0OVfCLEVWtVJhR0EklsX',
});

export class PaymentManager {
    connectionManger: ConnectionManager;
    config = new Config();

    public placeRazorPayOrder(req: Request, res: Response) {
        var options = {
            amount: 50000,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11",
            payment_capture: '0'
        };
        razorPayInstance.orders.create(options)
            .then((order) => {
                console.log(JSON.stringify(order));
                res.status(201).send();
            }).catch((error) => {
                console.log(JSON.stringify(error));
                res.status(402).send();
            });
    }
}