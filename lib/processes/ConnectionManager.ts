const Sequelize = require('sequelize');

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 10,
    min: 1,
    idle: 20000,
    acquire: 20000,
    evict: 60000,
    handleDisconnects: true
  },
  define: {
    timestamps: false // true by default. false because bydefault sequelize adds createdAt, modifiedAt columns with timestamps.if you want those columns make ths true.
  }
});

export class ConnectionManager {
  user: any;
  product: any;
  
  constructor() {
    this.user = connection.import('../models/user');
    this.product = connection.import('../models/product');
  }
  
  public getConnection() {
    return connection;
  }
}
