const ProductModel = require('../../models/product.model');

class ProductDao {
  create(data) {
    return ProductModel.create(data);
  }

  findAll() {
    return ProductModel.find();
  }

  findById(id) {
    return ProductModel.findById(id);
  }

  updateById(id, update) {
    return ProductModel.findByIdAndUpdate(id, update, { new: true });
  }

  deleteById(id) {
    return ProductModel.findByIdAndDelete(id);
  }
}

module.exports = ProductDao;
