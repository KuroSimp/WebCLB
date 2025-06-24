const pool = require('./db');

// Ví dụ: API lấy danh sách thành viên
app.get('/api/members', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi truy vấn database' });
  }
});
