const express = require('express');
const path = require('path');
const { analyzeLottoData, parseLottoData } = require('./lotto-analyzer');

const app = express();
const PORT = 8081;

// ✅ [추가] 'js' 폴더를 정적 파일 경로로 설정합니다.
// 이렇게 하면 /js/main.js 같은 요청을 처리할 수 있게 됩니다.
app.use('/js', express.static(path.join(__dirname, 'js')));

// 루트 경로('/')로 접속하면 index.html 파일을 보내주는 설정
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 기존 통계 API (전체 기간 빈도수)
app.get('/api/stats', (req, res) => {
    try {
        const stats = analyzeLottoData();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 프론트엔드 계산을 위한 전체 원본 데이터 API
app.get('/api/draws', (req, res) => {
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