import { Request, Response } from 'express';
import { ConnectionManager } from './ConnectionManager';

export class OrderManager {
    connectionManager: ConnectionManager;
    order: any;
    product: any;
    order_product: any;

    constructor() {
        this.connectionManager = new ConnectionManager();
        this.order = this.connectionManager.order;
        this.product = this.connectionManager.product;
        this.order_product = this.connectionManager.order_product;
    }

    public createOrder(req: Request, res: Response) {
        let user = req['user'];
        console.log('user: ' + JSON.stringify(user));
        let response = { error_code: 0, order: { order_id: 0, order_products: [] } };
        let productId = req.body.productId;
        let order = { user_id: user.user_id };
        let orderProduct = { order_id: 0, product_id: productId, count: 1 };
        this.connectionManager.getConnection().transaction(t => {
            return this.order.create(order, { transaction: t }).then(order => {
                response.order.order_id = order.id;
                orderProduct.order_id = order.id;
                //create order-product mapping
                return this.order_product.create(orderProduct, { transaction: t }).then(() => {
                    this.order_product.findAll(
                        { where: { order_id: order.id }, include: [{ model: this.product }] })
                        .then(orderProducts => {
                            response.order.order_products = orderProducts;
                            res.status(201).send(response);
                        });
                });
            });
        }).catch((err) => {
            console.log('Error: ' + err)
            response.error_code = 402;
            res.status(201).send(response);
        });
    }

    public addProductToOrder(req: Request, res: Response) {
        console.log('addProductToOrder: ' + req.params.orderId);
        let response = { error_code: 0, order: { order_id: 0, order_products: [] } };
        let productId = req.body.productId;
        let orderId = req.params.orderId;
        let orderProduct = { order_id: 0, product_id: productId, count: 1 };
        this.connectionManager.getConnection().transaction(t => {
            return this.order.findByPk(orderId, { transaction: t }).then(currentOrder => {
                orderProduct.order_id = currentOrder.id;
                response.order.order_id = currentOrder.id;
                return this.order_product.findOne(
                    { where: { order_id: currentOrder.id, product_id: productId } }, { transaction: t })
                    .then(existingProduct => {
                        if (existingProduct) {
                            console.log('Product exists in order increment count');
                            orderProduct.count = existingProduct.count + 1;
                            console.log('orderProduct: ' + JSON.stringify(orderProduct))
                            return existingProduct.update(orderProduct, { transaction: t }).then(() => {
                                this.order_product.findAll(
                                    { where: { order_id: currentOrder.id }, include: [{ model: this.product }] })
                                    .then(order => {
                                        response.order.order_products = order;
                                        res.status(201).send(response);
                                    });
                            });
                        } else {
                            console.log('Add product to order');
                            return this.order_product.create(orderProduct, { transaction: t }).then(newProductMapping => {
                                res.status(201).send(response);
                            });
                        }
                    });
            });
        }).catch((err) => {
            console.log('Error: ' + err)
            response.error_code = 402;
            res.status(201).send(response);
        });
    }

    getOrderDetails(req: Request, res: Response) {
        console.log('getOrderDetails: ' + req.params.orderId);
        let response = { error_code: 0, order: { order_id: 0, order_products: [] } };
        let orderId = req.params.orderId;
        this.order_product.findAll(
            { where: { order_id: orderId }, include: [{ model: this.product }] })
            .then(order => {
                response.order.order_id = orderId;
                response.order.order_products = order;
                res.status(201).send(response);
            });
    }
}
