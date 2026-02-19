class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create(user) {
    return this.dao.create(user);
  }

  getByEmail(email) {
    return this.dao.findByEmail(email);
  }

  getById(id) {
    return this.dao.findById(id);
  }

  getAll() {
    return this.dao.findAll();
  }

  updateById(id, update) {
    return this.dao.updateById(id, update);
  }

  deleteById(id) {
    return this.dao.deleteById(id);
  }
}

module.exports = UserRepository;
