// js/main.js

import { fetchData } from './api.js';
import { renderStats } from './ui.js';
import { generateRecommendedNumbers } from './recommend.js';
import { getColorByNumber } from './colors.js';

// ✅ 1. 애플리케이션의 모든 데이터를 관리할 state 객체 선언
const state = {
    allDraws: [],       // 전체 원본 데이터
    currentPeriod: 'all', // 현재 선택된 기간
    isLoading: true,
    error: null,
};

// DOM 요소 가져오기 (전역에서 관리)
const controls = document.querySelector('.controls');
const statsTable = document.getElementById('stats-table');
const recommendBtn = document.getElementById('recommend-btn');
const recommendOutput = document.getElementById('recommend-output');

// ✅ 2. state를 기반으로 전체 화면을 다시 그리는 함수
function renderApp() {
    // ---- 기간 선택 버튼 렌더링 ----
    controls.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.period === state.currentPeriod);
    });

    // ---- 통계 테이블 렌더링 ----
    if (state.isLoading) {
        // 그리드 전체를 차지하는 클래스 추가
        statsTable.innerHTML = '<div class="grid-full-width">데이터를 불러오는 중입니다...</div>';
    } else if (state.error) {
        // 그리드 전체를 차지하는 클래스 및 에러 클래스 추가
        statsTable.innerHTML = `<div class="grid-full-width error">${state.error}</div>`;
    } else {
        const drawsToAnalyze = (state.currentPeriod === 'all')
            ? state.allDraws
            : state.allDraws.slice(-parseInt(state.currentPeriod, 10));
        
        renderStats(drawsToAnalyze, statsTable);
    }
}

// ✅ [추가] 추천 번호를 생성하고 화면에 표시하는 함수
function displayRecommendedNumbers() {
    // 데이터가 없으면 실행하지 않음
    if (!state.allDraws || state.allDraws.length === 0) return;

    const recommendedNumbers = generateRecommendedNumbers(state.allDraws);
    
    if (recommendedNumbers) {
        const ballsHtml = recommendedNumbers.map(num => {
            const color = getColorByNumber(num);
            return `<div class="lotto-ball" style="background-color: ${color};">${num}</div>`;
        }).join('');
        recommendOutput.innerHTML = ballsHtml;
    } else {
        recommendOutput.innerHTML = `<span style="font-size: 16px; color: #868e96;">조건에 맞는 번호를 찾지 못했어요. 다시 시도해주세요.</span>`;
    }
}

// DOM이 로드되면 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', async () => {
    // ---- 초기 데이터 로딩 ----
    try {
        const data = await fetchData();
        if (data.length === 0) {
            throw new Error('데이터가 없습니다.');
        }
        state.allDraws = data;
    } catch (error) {
        state.error = '데이터 로딩 중 오류가 발생했습니다.';
    } finally {
        state.isLoading = false;
        renderApp(); // 통계 테이블과 버튼을 먼저 렌더링
        
        // ✅ [추가] 데이터 로딩 성공 시에만 추천 번호를 바로 표시
        if (!state.error) {
            displayRecommendedNumbers();
        }
    }
});


// ✅ 3. 모든 이벤트 리스너는 이제 state를 변경하고 renderApp()만 호출
controls.addEventListener('click', (event) => {
    if (event.target.tagName !== 'BUTTON') return;
    state.currentPeriod = event.target.dataset.period;
    renderApp(); // 상태 변경 후 렌더링
});

recommendBtn.addEventListener('click', displayRecommendedNumbers, () => {
    const recommendedNumbers = generateRecommendedNumbers(state.allDraws);
    
    if (recommendedNumbers) {
        const ballsHtml = recommendedNumbers.map(num => {
            const color = getColorByNumber(num);
            return `<div class="lotto-ball" style="background-color: ${color};">${num}</div>`;
        }).join('');
        recommendOutput.innerHTML = ballsHtml;
    } else {
        recommendOutput.innerHTML = `<span style="font-size: 16px; color: #868e96;">조건에 맞는 번호를 찾지 못했어요. 다시 시도해주세요.</span>`;
    }
});