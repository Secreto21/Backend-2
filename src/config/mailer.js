const { MAIL_FROM } = require('./config');

const sendPasswordResetEmail = async ({ to, resetLink }) => {
  const html = `
      <h2>Recuperación de contraseña</h2>
      <p>Hacé click en el botón para restablecer tu contraseña. El enlace expira en 1 hora.</p>
      <a href="${resetLink}" style="display:inline-block;background:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Restablecer contraseña</a>
    `;

  console.log('[MAILER] Simulación de envío de correo');
  console.log(`From: ${MAIL_FROM}`);
  console.log(`To: ${to}`);
  console.log('Subject: Recuperación de contraseña');
  console.log(html);

  return { accepted: [to] };
};

module.exports = { sendPasswordResetEmail };
