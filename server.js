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

// 1. 탄소 배출 데이터 저장 API
app.post('/api/save', async (req, res) => {
  try {
    const { activity, distance, carbon } = req.body;
    const query = 'INSERT INTO carbon_history (activity, distance, carbon_kg) VALUES ($1, $2, $3)';
    await pool.query(query, [activity, distance, carbon]);
    res.status(200).json({ success: true, message: "DB 저장 완료!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터 저장 중 오류가 발생했습니다." });
  }
});

// 2. 전체 통계 가져오기 API (선택 사항)
app.get('/api/stats', async (req, res) => {
  try {
    const result = await pool.query('SELECT SUM(carbon_kg) as total FROM carbon_history');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`));
