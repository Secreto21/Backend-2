const UserDao = require('../daos/mongo/user.dao');
const ProductDao = require('../daos/mongo/product.dao');
const CartDao = require('../daos/mongo/cart.dao');
const TicketDao = require('../daos/mongo/ticket.dao');

const UserRepository = require('../repositories/user.repository');
const ProductRepository = require('../repositories/product.repository');
const CartRepository = require('../repositories/cart.repository');
const TicketRepository = require('../repositories/ticket.repository');

module.exports = {
  userRepository: new UserRepository(new UserDao()),
  productRepository: new ProductRepository(new ProductDao()),
  cartRepository: new CartRepository(new CartDao()),
  ticketRepository: new TicketRepository(new TicketDao()),
};
