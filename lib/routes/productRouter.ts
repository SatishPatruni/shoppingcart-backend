import { Request, Response } from 'express';
import passport = require('passport');
import { ProductManager } from '../processes/ProductManager';

export class ProductRouter {
    productManager: ProductManager;
    constructor(private app) {
        this.productManager = new ProductManager();
    }

    public initRoutes() {
        this.app
            .route('/api/v1/products')
            .get(
                (req: Request, res: Response) => {
                    this.productManager.getProductList(req, res);
                }
            );
    }
}