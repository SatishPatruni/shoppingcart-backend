// tslint:disable
import * as path from 'path';
import * as sequelize from 'sequelize';
import * as def from './db';

export interface ITables {
  order:def.orderModel;
  order_product:def.order_productModel;
  product:def.productModel;
  user:def.userModel;
}

export const getModels = function(seq:sequelize.Sequelize):ITables {
  const tables:ITables = {
    order: seq.import(path.join(__dirname, './order')),
    order_product: seq.import(path.join(__dirname, './order_product')),
    product: seq.import(path.join(__dirname, './product')),
    user: seq.import(path.join(__dirname, './user')),
  };
  return tables;
};
