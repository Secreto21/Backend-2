class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(product) {
    return this.dao.create(product);
  }

  getAll() {
    return this.dao.findAll();
  }

  getById(id) {
    return this.dao.findById(id);
  }

  updateById(id, update) {
    return this.dao.updateById(id, update);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}

module.exports = ProductRepository;
