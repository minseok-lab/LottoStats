import { fetchData } from './api.js';
import { renderStats } from './ui.js';
import { generateRecommendedNumbers } from './recommend.js';

// DOM이 로드되면 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', async () => {
    // HTML 요소 가져오기
    const controls = document.querySelector('.controls');
    const statsTable = document.getElementById('stats-table');
    const recommendBtn = document.getElementById('recommend-btn');
    const recommendOutput = document.getElementById('recommend-output');
    
    // 데이터 로딩 중 표시
    statsTable.innerHTML = '<div class="loading">데이터를 불러오는 중입니다...</div>';

    // 1. 서버로부터 전체 데이터 가져오기
    const allDrawsData = await fetchData();

    // 데이터가 없으면 오류 메시지 표시
    if (allDrawsData.length === 0) {
        statsTable.innerHTML = `<div class="loading" style="color: red;">데이터 로딩에 실패했거나 데이터가 없습니다.</div>`;
        return;
    }
    
    // 2. 초기 화면 렌더링
    renderStats(allDrawsData, statsTable);

    // 3. 기간 선택 버튼 이벤트 리스너 설정
    controls.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON') return;

        controls.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
        
        const period = event.target.dataset.period;
        let drawsToAnalyze = allDrawsData;
        if (period !== 'all') {
            drawsToAnalyze = allDrawsData.slice(-parseInt(period, 10));
        }
        renderStats(drawsToAnalyze, statsTable);
    });

    // 4. ✅ [수정] 추천 번호 생성 버튼 이벤트 리스너
    recommendBtn.addEventListener('click', () => {
        // import 해온 동적 확률 기반 추천 함수를 호출합니다.
        const recommendedNumbers = generateRecommendedNumbers(allDrawsData);
        
        // 함수가 null을 반환하지 않았을 경우에만 화면에 숫자를 표시합니다.
        if (recommendedNumbers) {
            recommendOutput.textContent = recommendedNumbers.join(' , ');
        }
    });
});