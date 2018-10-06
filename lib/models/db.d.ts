// tslint:disable
import * as Sequelize from 'sequelize';


// table: user
export interface userAttribute {
  user_id:number;
  user_name:string;
  password:string;
  display_name:string;
  first_name:string;
  last_name:string;
  forgot_pwd_key?:string;
  role_id?:number;
  organization_id?:number;
  createdAt:Date;
  updatedAt:Date;
}
export interface userInstance extends Sequelize.Instance<userAttribute>, userAttribute { }
export interface userModel extends Sequelize.Model<userInstance, userAttribute> { }
