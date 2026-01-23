const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserModel = require('../models/user.model');
const { isValidPassword } = require('../utils/bcrypt');
const { JWT_SECRET } = require('./config');

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwtCookieToken'] || null;
  }
  return token;
};

const initializePassport = () => {
  // Estrategia de login con email + password
  passport.use(
    'login',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        session: false,
      },
      async (email, password, done) => {
        try {
          const user = await UserModel.findOne({ email });
          if (!user) {
            return done(null, false, { message: 'Usuario inexistente' });
          }

          if (!isValidPassword(user, password)) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia JWT para extraer usuario desde token
  passport.use(
    'jwt',
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          cookieExtractor,
        ]),
        secretOrKey: JWT_SECRET,
      },
      async (jwtPayload, done) => {
        try {
          const user = await UserModel.findById(jwtPayload.id);
          if (!user) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};

module.exports = initializePassport;
