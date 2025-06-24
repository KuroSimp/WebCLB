// db.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;

if (require.main === module) {
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Kết nối database thất bại:', err);
    } else {
      console.log('Kết nối database thành công! Thời gian:', res.rows[0].now);
    }
    pool.end();
  });
}

