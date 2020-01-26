// tslint:disable
import * as Sequelize from 'sequelize';


// table: order
export interface orderAttribute {
  id:number;
  payment_provider_id?:string;
  user_id:number;
  created_at:Date;
  updated_at:Date;
  status:any;
}
export interface orderInstance extends Sequelize.Instance<orderAttribute>, orderAttribute { }
export interface orderModel extends Sequelize.Model<orderInstance, orderAttribute> { }

// table: product
export interface productAttribute {
  id:number;
  product_id:string;
  name:string;
  price:any;
  description:string;
  created_at:Date;
  updated_at:Date;
}
export interface productInstance extends Sequelize.Instance<productAttribute>, productAttribute { }
export interface productModel extends Sequelize.Model<productInstance, productAttribute> { }

// table: user
export interface userAttribute {
  user_id:number;
  user_name:string;
  password:string;
  display_name:string;
  first_name:string;
  last_name:string;
  created_at:Date;
  updated_at:Date;
}
export interface userInstance extends Sequelize.Instance<userAttribute>, userAttribute { }
export interface userModel extends Sequelize.Model<userInstance, userAttribute> { }
