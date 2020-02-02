import { Request, Response } from 'express';
import { ConnectionManager } from './ConnectionManager';
import Razorpay = require('razorpay');
import e = require('express');
var CryptoJS = require("crypto-js");

const razorPayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export class PaymentManager {
    connectionManager: ConnectionManager;
    order: any;

    constructor() {
        this.connectionManager = new ConnectionManager();
        this.order = this.connectionManager.order;
    }

    public placeRazorPayOrder(req: Request, res: Response) {
        let amount = req.body.amount;
        let orderId = req.params.orderId;
        let response = { error_code: 0, order: {} };
        let orderAmount =  (amount * 100).toFixed(0);
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
        let cryptSignature = CryptoJS.HmacSHA256(providerOrderId + '|' + providerPaymentId, process.env.RAZORPAY_KEY_SECRET);
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