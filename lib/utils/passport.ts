import { ConnectionManager } from '../processes/ConnectionManager';
import { Config } from '../config';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport) {
  const connectionManager = new ConnectionManager();
  let user = connectionManager.user;
  const config = new Config();
  let opts: any = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = config.secret;
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      user
        .findById(jwt_payload.user_id)
        .then(user => {
          if (user) {
            user = user.get({ plain: true });
            delete user.password;
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => {
          return done(err, false);
        });
    })
  );
};
