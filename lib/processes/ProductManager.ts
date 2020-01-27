import { Request, Response } from 'express';
import { ConnectionManager } from './ConnectionManager';
import { Config } from '../config';
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');

export class ProductManager {
    connectionManger: ConnectionManager;
    config = new Config();
    product: any;

    constructor() {
        this.connectionManger = new ConnectionManager();
        this.product = this.connectionManger.product;
    }

    public getProductList(req: Request, res: Response) {
        //pagination can be implemented using the offset and limit
        let response = { error_code: 0, total: 0, products: {} };
        this.product
            .findAndCountAll({
                limit: 5,
                offset: 0,
            })
            .then(result => {
                response.total = result.count;
                response.products = result.rows;
                res.status(200).send(response);
            });
    }
}