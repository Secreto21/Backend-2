const CartModel = require('../../models/cart.model');

class CartDao {
  create(data) {
    return CartModel.create(data);
  }

  findByUserId(userId) {
    return CartModel.findOne({ user: userId }).populate('products.product');
  }

  findById(id) {
    return CartModel.findById(id).populate('products.product');
  }

  updateById(id, update) {
    return CartModel.findByIdAndUpdate(id, update, { new: true }).populate('products.product');
  }
}

module.exports = CartDao;
