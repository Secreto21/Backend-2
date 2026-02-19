class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(cart) {
    return this.dao.create(cart);
  }

  getByUserId(userId) {
    return this.dao.findByUserId(userId);
  }

  getById(id) {
    return this.dao.findById(id);
  }

  updateById(id, update) {
    return this.dao.updateById(id, update);
  }
}

module.exports = CartRepository;
