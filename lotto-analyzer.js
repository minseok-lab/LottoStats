const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// HTML 파일을 읽어 원본 데이터를 파싱하는 역할
function parseLottoData() {
    const filePath = path.resolve(__dirname, 'lotto_data.html');
    if (!fs.existsSync(filePath)) {
        throw new Error('lotto_data.html 파일을 찾을 수 없습니다. 먼저 download.js를 실행해주세요.');
    }

    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(htmlContent);

    const draws = []; // 파싱된 데이터를 담을 배열
    const rows = $('table[border="1"] tr');

    rows.each((index, element) => {
        const cells = $(element).find('td');
        if (cells.length < 19) return;

        try {
            let numbersStartIndex;
            let drawNoIndex;

            if (cells.length === 20) { // '년도' 셀이 있는 행
                drawNoIndex = 1;
                numbersStartIndex = 13;
            } else { // '년도' 셀이 없는 행
                drawNoIndex = 0;
                numbersStartIndex = 12;
            }
            
            const drawNo = parseInt($(cells[drawNoIndex]).text(), 10);
            const numbers = [];
            for (let i = 0; i < 6; i++) {
                numbers.push(parseInt($(cells[numbersStartIndex + i]).text(), 10));
            }
            const bonus = parseInt($(cells[numbersStartIndex + 6]).text(), 10);
            
            // NaN 값이 있는지 확인
            if (isNaN(drawNo) || numbers.some(isNaN) || isNaN(bonus)) return;

            draws.push({ drawNo, numbers, bonus });

        } catch (e) {
            // 오류 무시
        }
    });
    return draws;
}

// 파싱된 데이터를 바탕으로 통계를 계산하는 역할
function analyzeLottoData() {
    const draws = parseLottoData();
    const frequency = {};
    for (let i = 1; i <= 45; i++) {
        frequency[i] = 0;
    }

    draws.forEach(draw => {
        draw.numbers.forEach(number => frequency[number]++);
        frequency[draw.bonus]++;
    });

    console.log(`총 ${draws.length}개의 회차 데이터를 분석했습니다.`);
    return frequency;
}

// 두 함수 모두 다른 파일에서 사용할 수 있도록 export
module.exports = { parseLottoData, analyzeLottoData };