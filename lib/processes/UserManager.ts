import { Request, Response } from 'express';
import { ConnectionManager } from './ConnectionManager';
import { Md5 } from 'ts-md5/dist/md5';
import { Config } from '../config';
import { User } from 'api-models/api-models';
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');

export class UserManager {
  connectionManger: ConnectionManager;
  config = new Config();
  user: any;

  constructor() {
    this.connectionManger = new ConnectionManager();
    this.user = this.connectionManger.user;
  }

  public login(req: Request, res: Response) {
    var response = { token: '', user: {} };
    this.user
      .findOne({
        where: { user_name: req.body.userName }
      })
      .then(user => {
        if (!user) {
          res.status(404).send({
            message: 'User not found!'
          });
        } else {
          user = user.get({ plain: true });
          console.log('passwordHash: ' + this.passwordHash(req.body.password));
          if (this.comparePassword(req.body.password, user.password)) {
            delete user.password;
            const token = jwt.sign(user, this.config.secret, {
              expiresIn: this.config.jwtExpiry
            });

            response.token = 'JWT ' + token;
            response.user = user;

            res.json(response);
          } else {
            return res.status(401).send();
          }
        }
      });
  }

  public createUser(req: Request, res: Response) {
    req.body.organization_id = req.params.orgId;

    req.body.password = this.passwordHash(req.body.password);

    this.user
      .create(req.body)
      .then(newUser => {
        return this.user.findById(newUser.user_id);
      })
      .then(user => {
        res.status(201).send(user);
      });
  }

  public deleteUser(req: Request, res: Response) {
    this.user.findById(req.params.id).then(user => {
      user.destroy().then(() => {
        res.status(200).send();
      });
    });
  }

  private comparePassword(userPassword: String, hash: String): Boolean {
    return bcrypt.compareSync(userPassword, hash);
  }

  private passwordHash(password: String): String {
    //hash the password
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    //return the hash
    return hash;
  }
}
