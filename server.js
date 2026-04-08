// ... 기존 상단 코드 생략 ...

// 1. 탄소 배출 기록 목록 가져오기 API (추가)
app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM carbon_history ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "기록을 불러오지 못했습니다." });
  }
});

// 2. 탄소 배출 기록 삭제 API (추가)
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM carbon_history WHERE id = $1', [id]);
    res.json({ success: true, message: "삭제 완료" });
  } catch (err) {
    res.status(500).json({ error: "삭제 실패" });
  }
});

// ... 기존 하단 app.listen 코드 ...
