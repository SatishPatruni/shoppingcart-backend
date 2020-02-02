import { Request, Response } from 'express';
import { ConnectionManager } from './ConnectionManager';
import bcrypt = require('bcryptjs');
import jwt = require('jsonwebtoken');

export class UserManager {
  connectionManger: ConnectionManager;
  user: any;

  constructor() {
    this.connectionManger = new ConnectionManager();
    this.user = this.connectionManger.user;
  }

  public login(req: Request, res: Response) {
    let response = { token: '', user: {} };
    let userName = req.body.user_name;
    let password = req.body.password;
    this.user
      .findOne({
        where: { user_name: userName }
      })
      .then(user => {
        if (!user) {
          res.status(404).send({
            message: 'User not found!'
          });
        } else {
          user = user.get({ plain: true });
          console.log('passwordHash: ' + this.passwordHash(password));
          if (this.comparePassword(password, user.password)) {
            delete user.password;
            const token = jwt.sign(user, process.env.JWT_SECRET, {
              expiresIn: process.env.JWT_EXPIRY
            });

            response.user = user;
            response.token = 'JWT ' + token;
            res.cookie("auth-token", 'JWT ' + token, {httpOnly:true, secure:true});
            res.status(200).send(response);
          } else {
            return res.status(401).send();
          }
        }
      });
  }

  public createUser(req: Request, res: Response) {
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

  public getUserDetails(req: Request, res: Response) {
    this.user.findById(req.params.id).then(user => {
      res.status(200).send(user);
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
