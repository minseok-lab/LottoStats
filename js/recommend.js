// js/recommend.js

// 특정 기간의 데이터로 번호별 출현 횟수를 계산하는 헬퍼 함수
function calculateFrequency(draws) {
    const frequency = {};
    for (let i = 1; i <= 45; i++) {
        frequency[i] = 0;
    }
    draws.forEach(draw => {
        draw.numbers.forEach(num => frequency[num]++);
        frequency[draw.bonus]++;
    });
    return frequency;
}

// 가중치에 따라 랜덤 번호 하나를 선택하는 함수
function getWeightedRandomNumber(weights) {
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    if (totalWeight <= 0) {
        return Math.floor(Math.random() * 45) + 1;
    }
    let random = Math.random() * totalWeight;
    for (const number in weights) {
        random -= weights[number];
        if (random <= 0) {
            return parseInt(number, 10);
        }
    }
}

// 생성된 번호 6개의 합이 유효한 범위에 있는지 확인하는 함수
function isSumValid(numbers) {
    const sum = numbers.reduce((total, num) => total + num, 0);
    return sum >= 110 && sum <= 170;
}

// 생성된 번호 6개의 홀짝 비율이 유효한지 확인하는 함수
function isOddEvenRatioValid(numbers) {
    const oddCount = numbers.filter(num => num % 2 !== 0).length;
    // 허용되는 홀수 개수: 2개, 3개, 4개
    return oddCount >= 2 && oddCount <= 4; 
}

// 출력할 데이터를 정의합니다.
export function generateRecommendedNumbers(allDrawsData) {
    // 과거 데이터가 100개 미만일경우 빈 값 생성
    if (allDrawsData.length < 100) {
        alert("추천 번호를 생성하기에 데이터가 충분하지 않습니다. (최소 100회 필요)");
        return null;
    }

    // --- 가중치 계산 로직 ---
    const recent100Draws = allDrawsData.slice(-100);
    const allTimeFreq = calculateFrequency(allDrawsData);
    const recent100Freq = calculateFrequency(recent100Draws);
    const totalBallsAll = allDrawsData.length * 7;
    const totalBalls100 = recent100Draws.length * 7;
    const weights = {};
    for (let i = 1; i <= 45; i++) {
        const probAll = allTimeFreq[i] / totalBallsAll;
        const prob100 = recent100Freq[i] / totalBalls100;
        const weight = probAll - prob100;
        weights[i] = Math.max(0, weight);
    }
    // --- 가중치 계산 로직 끝 ---

    // 두 가지 필터(총합, 홀짝)를 통과할 때까지 번호 생성을 반복
    let recommendedNumbers;
    let attempts = 0; // 무한 루프 방지를 위한 시도 횟수 제한
    const maxAttempts = 10000; // 최대 10,000번 시도

    while (attempts < maxAttempts) {
        const numberSet = new Set();
        while (numberSet.size < 6) {
            const num = getWeightedRandomNumber(weights);
            numberSet.add(num);
        }
        
        const currentNumbers = Array.from(numberSet);

        // 두 필터 조건이 모두 참(true)인 경우에만 루프를 탈출
        if (isSumValid(currentNumbers) && isOddEvenRatioValid(currentNumbers)) {
            recommendedNumbers = currentNumbers;
            break; 
        }

        attempts++;
    }

    if (!recommendedNumbers) {
        console.warn("필터 조건을 만족하는 번호 생성 실패");
        return null; // alert 대신 null 반환
    }
    return recommendedNumbers.sort((a, b) => a - b);
}