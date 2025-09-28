// 순위에 따라 그라데이션 색상을 계산하는 함수
function getGradientColor(rank) {
    if (rank < 1 || rank > 12) return '#f8f9fa'; // 기본 배경색
    const startColor = { r: 118, g: 255, b: 3 };
    const endColor = { r: 248, g: 249, b: 250 };
    const ratio = (rank - 1) / 11;
    const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
    const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
    const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));
    return `rgb(${r}, ${g}, ${b})`;
}

// 데이터를 받아 통계를 계산하고 화면에 테이블을 그리는 함수
export function renderStats(drawsToAnalyze, statsTableElement) {
    const frequency = {};
    for (let i = 1; i <= 45; i++) { frequency[i] = 0; }
    drawsToAnalyze.forEach(draw => {
        draw.numbers.forEach(num => frequency[num]++);
        frequency[draw.bonus]++;
    });

    const sortedStats = Object.entries(frequency).sort(([, a], [, b]) => b - a).slice(0, 12);
    const rankMap = new Map();
    sortedStats.forEach(([number], index) => {
        rankMap.set(parseInt(number), index + 1);
    });

    const totalBalls = drawsToAnalyze.length * 7;
    if (totalBalls === 0) {
        statsTableElement.innerHTML = '<div class="loading">해당 기간의 데이터가 없습니다.</div>';
        return;
    }

    let tableHtml = '';
    for (let i = 1; i <= 45; i++) {
        const count = frequency[i];
        const percentage = ((count / totalBalls) * 100).toFixed(2);
        const rank = rankMap.get(i);
        const backgroundColor = getGradientColor(rank);
        tableHtml += `
            <div class="stat-cell" style="background-color: ${backgroundColor};">
                <div class="number">${i}</div>
                <div class="percentage">${percentage}%</div>
            </div>
        `;
    }
    statsTableElement.classList.remove('loading');
    statsTableElement.innerHTML = tableHtml;
}
