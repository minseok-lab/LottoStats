// js/ui.js

// 순위에 따라 그라데이션 색상을 계산하는 함수
function getGradientColor(rank) {
    // 순위가 없거나(undefined) 12위 밖이면 기본 배경색 반환
    if (!rank || rank > 12) return '#f8f9fa'; 
    
    // 1위(진한 초록) ~ 12위(옅은 초록) 사이의 색상을 계산
    const startColor = { r: 118, g: 255, b: 3 };   // 1위 색상
    const endColor = { r: 248, g: 249, b: 250 }; // 12위 색상
    const ratio = (rank - 1) / 11;
    
    const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));
    
    return `rgb(${r}, ${g}, ${b})`;
}

// 데이터를 받아 통계를 계산하고 화면에 테이블을 그리는 함수
export function renderStats(drawsToAnalyze, statsTableElement) {
    // 1. 번호별 출현 빈도를 계산할 객체 초기화
    const frequency = {};
    for (let i = 1; i <= 45; i++) { frequency[i] = 0; }

    // 2. 데이터를 순회하며 번호별 카운트 증가
    drawsToAnalyze.forEach(draw => {
        draw.numbers.forEach(num => frequency[num]++);
        frequency[draw.bonus]++;
    });

    // 3. 출현 빈도가 높은 순으로 12개 번호를 정렬하여 '순위' 부여
    const sortedStats = Object.entries(frequency).sort(([, a], [, b]) => b - a).slice(0, 12);
    const rankMap = new Map();
    sortedStats.forEach(([number], index) => {
        rankMap.set(parseInt(number), index + 1);
    });

    // 4. 전체 공의 개수 계산
    const totalBalls = drawsToAnalyze.length * 7;
    if (totalBalls === 0) {
        statsTableElement.innerHTML = '<div class="grid-full-width">해당 기간의 데이터가 없습니다.</div>';
        return;
    }

    // 5. 1번부터 45번까지의 숫자 배열 생성
    const numbersArray = Array.from({ length: 45 }, (_, i) => i + 1);

    // 6. 각 번호에 맞는 HTML(stat-cell)을 생성하여 하나의 문자열로 합침
    const tableHtml = numbersArray.map(i => {
        const count = frequency[i];
        const percentage = ((count / totalBalls) * 100).toFixed(2);
        const rank = rankMap.get(i);
        const backgroundColor = getGradientColor(rank);

        // CSS 그리드 스타일을 적용받는 HTML 구조
        return `
            <div class="stat-cell" style="background-color: ${backgroundColor};">
                <div class="number">${i}</div>
                <div class="percentage">${percentage}%</div>
            </div>
        `;
    }).join('');

    // 7. 완성된 HTML을 테이블 요소에 한 번에 삽입하여 렌더링
    statsTableElement.innerHTML = tableHtml;
}