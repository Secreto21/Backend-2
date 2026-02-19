const UserModel = require('../../models/user.model');

class UserDao {
  create(data) {
    return UserModel.create(data);
  }

  findByEmail(email) {
    return UserModel.findOne({ email });
  }

  findById(id) {
    return UserModel.findById(id);
  }

  findAll() {
    return UserModel.find();
  }

  updateById(id, update) {
    return UserModel.findByIdAndUpdate(id, update, { new: true });
  }

  deleteById(id) {
    return UserModel.findByIdAndDelete(id);
  }
}

module.exports = UserDao;
