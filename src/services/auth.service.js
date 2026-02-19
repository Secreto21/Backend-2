const jwt = require('jsonwebtoken');
const { isValidPassword, createHash } = require('../utils/bcrypt');
const { JWT_SECRET, JWT_RESET_SECRET, APP_BASE_URL } = require('../config/config');
const { sendPasswordResetEmail } = require('../config/mailer');

class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async validateLogin(email, password) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) return null;
    if (!isValidPassword(user, password)) return null;
    return user;
  }

  createAccessToken(user) {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  }

  createResetToken(user) {
    return jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        pwdChangedAt: new Date(user.passwordChangedAt || 0).getTime(),
      },
      JWT_RESET_SECRET,
      { expiresIn: '1h' }
    );
  }

  async requestPasswordReset(email) {
    const user = await this.userRepository.getByEmail(email);
    if (!user) return;

    const token = this.createResetToken(user);
    const resetLink = `${APP_BASE_URL}/api/sessions/reset-password?token=${token}`;
    await sendPasswordResetEmail({ to: user.email, resetLink });
  }

  async resetPassword(token, newPassword) {
    const payload = jwt.verify(token, JWT_RESET_SECRET);
    const user = await this.userRepository.getById(payload.sub);

    if (!user) throw new Error('Usuario no encontrado');

    const currentPwdChangedAt = new Date(user.passwordChangedAt || 0).getTime();
    if (currentPwdChangedAt !== payload.pwdChangedAt) {
      throw new Error('El enlace ya no es válido');
    }

    if (isValidPassword(user, newPassword)) {
      throw new Error('La nueva contraseña no puede ser igual a la anterior');
    }

    user.password = createHash(newPassword);
    user.passwordChangedAt = new Date();
    await user.save();
  }
}

module.exports = AuthService;
