// backend/src/middleware/audit.js
const { Pool } = require('pg');

const pool = new Pool({
  // ... configurações do banco
});

const auditLog = async (req, res, next) => {
  const originalSend = res.send;
  const startTime = Date.now();

  res.send = function (body) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    pool.query(
      'INSERT INTO audit_logs (user_id, action, resource, details, status_code, duration, ip_address) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        req.user?.id,
        req.method,
        req.path,
        JSON.stringify({
          body: req.body,
          params: req.params,
          query: req.query
        }),
        res.statusCode,
        duration,
        req.ip
      ]
    );

    return originalSend.apply(res, arguments);
  };

  next();
};