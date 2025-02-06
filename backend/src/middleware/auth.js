// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');

const roles = {
  ADMIN: 'admin',
  ATTENDANT: 'attendant',
  PROFESSIONAL: 'professional'
};

const permissions = {
  CREATE_APPOINTMENT: 'create:appointment',
  READ_APPOINTMENT: 'read:appointment',
  UPDATE_APPOINTMENT: 'update:appointment',
  DELETE_APPOINTMENT: 'delete:appointment',
  READ_REPORTS: 'read:reports',
  MANAGE_USERS: 'manage:users'
};

const rolePermissions = {
  [roles.ADMIN]: [
    permissions.CREATE_APPOINTMENT,
    permissions.READ_APPOINTMENT,
    permissions.UPDATE_APPOINTMENT,
    permissions.DELETE_APPOINTMENT,
    permissions.READ_REPORTS,
    permissions.MANAGE_USERS
  ],
  [roles.ATTENDANT]: [
    permissions.CREATE_APPOINTMENT,
    permissions.READ_APPOINTMENT
  ],
  [roles.PROFESSIONAL]: [
    permissions.READ_APPOINTMENT
  ]
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const checkPermission = (permission) => (req, res, next) => {
  const userRole = req.user.role;
  if (!rolePermissions[userRole]?.includes(permission)) {
    return res.status(403).json({ message: 'Acesso negado' });
  }
  next();
};