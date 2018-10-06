const Sequelize = require('sequelize');

const connection = new Sequelize('starter', 'starter', 'starter', {
  host: 'localhost',
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false // true by default. false because bydefault sequelize adds createdAt, modifiedAt columns with timestamps.if you want those columns make ths true.
  }
});

export class ConnectionManager {
  user: any;
  
  constructor() {
    this.user = connection.import('../models/user');
  }
  public getConnection() {
    return connection;
  }
}
