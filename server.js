const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(express.json());
app.use(express.static('public'));

// 1. 탄소 배출 데이터 저장
app.post('/api/save', async (req, res) => {
  try {
    const { activity, distance, carbon } = req.body;
    await pool.query(
      'INSERT INTO carbon_history (activity, distance, carbon_kg) VALUES ($1, $2, $3)',
      [activity, distance, carbon]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("저장 에러:", err);
    res.status(500).json({ error: "DB 저장 실패" });
  }
});

// 2. 기록 목록 가져오기
app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM carbon_history ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("조회 에러:", err);
    res.status(500).json({ error: "목록 불러오기 실패" });
  }
});

// 3. 기록 삭제
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM carbon_history WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error("삭제 에러:", err);
    res.status(500).json({ error: "삭제 실패" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
