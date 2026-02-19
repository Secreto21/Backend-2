const { createHash } = require('../utils/bcrypt');

class UserService {
  constructor(userRepository, cartRepository) {
    this.userRepository = userRepository;
    this.cartRepository = cartRepository;
  }

  async createUser(data) {
    const exists = await this.userRepository.getByEmail(data.email);
    if (exists) throw new Error('El email ya está registrado');

    const user = await this.userRepository.create({
      ...data,
      password: createHash(data.password),
    });

    const cart = await this.cartRepository.create({ user: user._id, products: [] });
    user.cart = cart._id;
    await user.save();

    return user;
  }

  getAllUsers() {
    return this.userRepository.getAll();
  }

  getUserById(id) {
    return this.userRepository.getById(id);
  }

  async updateUser(id, data) {
    const updateData = { ...data };
    if (updateData.password) {
      updateData.password = createHash(updateData.password);
      updateData.passwordChangedAt = new Date();
    }
    return this.userRepository.updateById(id, updateData);
  }

  deleteUser(id) {
    return this.userRepository.deleteById(id);
  }
}

module.exports = UserService;
