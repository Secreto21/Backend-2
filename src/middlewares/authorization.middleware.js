const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ status: 'error', message: 'No autenticado' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).send({ status: 'error', message: 'No autorizado para este recurso' });
  }

  return next();
};

module.exports = authorize;
