// tslint:disable
import * as path from 'path';
import * as sequelize from 'sequelize';
import * as def from './db';

export interface ITables {
  user:def.userModel;
}

export const getModels = function(seq:sequelize.Sequelize):ITables {
  const tables:ITables = {
    user: seq.import(path.join(__dirname, './user')),
  };
  return tables;
};
