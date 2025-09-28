// server.js

const express = require('express');
const path = require('path');
const { analyzeLottoData, parseLottoData } = require('./lotto-analyzer');

const app = express();
const PORT = 8081;

// ✅ [수정] js 폴더와 css 폴더를 모두 정적 파일 경로로 설정합니다.
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css'))); // <-- 이 줄을 추가했습니다!

// 루트 경로('/')로 접속하면 index.html 파일을 보내주는 설정
// ✅ [수정] 사용하지 않는 req 인자를 _req로 변경하여 경고 메시지를 제거합니다.
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 기존 통계 API (전체 기간 빈도수)
app.get('/api/stats', (_req, res) => {
    try {
        const stats = analyzeLottoData();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 프론트엔드 계산을 위한 전체 원본 데이터 API
app.get('/api/draws', (_req, res) => {
    try {
        const draws = parseLottoData();
        res.json(draws);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});