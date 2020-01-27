import { Request, Response } from 'express';
import { ConnectionManager } from './ConnectionManager';
import { Config } from '../config';
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');
import Razorpay = require('razorpay');
import { OrderManager } from './OrderManager';
import e = require('express');
var CryptoJS = require("crypto-js");

const razorPayInstance = new Razorpay({
    key_id: 'rzp_test_ThMPARsTfVfL7N',
    key_secret: 'Nv3j0OVfCLEVWtVJhR0EklsX',
});

export class PaymentManager {
    connectionManager: ConnectionManager;
    order: any;
    config = new Config();

    constructor() {
        this.connectionManager = new ConnectionManager();
        this.order = this.connectionManager.order;
    }

    public placeRazorPayOrder(req: Request, res: Response) {
        let response = { error_code: 0, order: {} };
        let orderAmount = req.body.amount * 100;
        let orderId = req.params.orderId;
        var options = {
            amount: orderAmount,
            currency: "INR",
            receipt: "order_rcptid_11",
            payment_capture: '1'
        };
        console.log('Payment Provide Options: ' + JSON.stringify(options));
        razorPayInstance.orders.create(options)
            .then((order) => {
                console.log("Provide order Successful: " + JSON.stringify(order));
                let marketOrder = { id: orderId, payment_provider_id: order.id }
                this.connectionManager.getConnection().transaction(t => {
                    return this.order.findByPk(orderId, { transaction: t }).then(currentOrder => {
                        return currentOrder.update(marketOrder, { transaction: t }).then((updatedOrder) => {
                            response.order = updatedOrder;
                            res.status(201).send(response);
                        });
                    });
                }).catch((error) => {
                    console.log(JSON.stringify(error));
                    res.status(402).send();
                });
            });
    }

    public verifyPayment(req: Request, res: Response) {
        let providerPaymentId = req.body.providerInfo.razorpay_order_id;
        let providerOrderId = req.body.providerInfo.razorpay_payment_id;
        let providerSignature = req.body.providerInfo.razorpay_signature;
        let orderId = req.body.orderId;
        let cryptSignature = CryptoJS.HmacSHA256(providerOrderId + '|' + providerPaymentId, "Nv3j0OVfCLEVWtVJhR0EklsX");
        console.log('cryptSignature: ' + cryptSignature);
        if (cryptSignature === providerSignature) {
            console.log('Signature verified!')
        } else {
            console.log('Something wrong!')
        }
        let marketOrder = { id: orderId, status: 'closed' }
        this.connectionManager.getConnection().transaction(t => {
            return this.order.findByPk(orderId, { transaction: t }).then(currentOrder => {
                return currentOrder.update(marketOrder, { transaction: t }).then((updatedOrder) => {
                    res.status(200).send(updatedOrder);
                });
            });
        });
    }

}