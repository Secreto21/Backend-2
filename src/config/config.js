const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'backend2';
const JWT_SECRET = process.env.JWT_SECRET || 'coderSecretJWT123';

module.exports = {
  MONGO_URI,
  MONGO_DB_NAME,
  JWT_SECRET,
};
