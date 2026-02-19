const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

module.exports = {
  PORT: process.env.PORT || 8080,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'backend2',
  JWT_SECRET: process.env.JWT_SECRET || 'coderSecretJWT123',
  JWT_RESET_SECRET: process.env.JWT_RESET_SECRET || 'resetSecret123',
  APP_BASE_URL: process.env.APP_BASE_URL || 'http://localhost:8080',
  MAIL_FROM: process.env.MAIL_FROM || 'no-reply@backend2.local',
  MAILER_MODE: process.env.MAILER_MODE || 'console',
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PORT: Number(process.env.MAIL_PORT || 587),
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
};
