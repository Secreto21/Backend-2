const bcrypt = require('bcrypt');

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (user, passwordPlain) => {
  return bcrypt.compareSync(passwordPlain, user.password);
};

module.exports = {
  createHash,
  isValidPassword,
};
