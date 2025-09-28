const fs = require('fs');
const path = require('path');
const { parseLottoData } = require('./lotto-analyzer');

function exportToJson() {
    try {
        // 1. lotto-analyzer에서 파싱된 원본 데이터를 가져옵니다.
        const draws = parseLottoData();
        if (draws.length === 0) {
            console.log("분석할 데이터가 없습니다. download.js를 먼저 실행하세요.");
            return;
        }

        // 2. JSON.stringify를 사용해 데이터를 예쁘게 포맷팅된 문자열로 변환합니다.
        // (null, 2)는 가독성을 위한 들여쓰기(2칸) 옵션입니다.
        const jsonContent = JSON.stringify(draws, null, 2);

        // 3. 'lotto_data.json' 파일로 저장합니다.
        const targetPath = path.resolve(__dirname, 'lotto_data.json');
        fs.writeFileSync(targetPath, jsonContent);

        console.log(`✅ 총 ${draws.length}개의 데이터가 lotto_data.json 파일로 성공적으로 추출되었습니다!`);

    } catch (error) {
        console.error("JSON 파일 생성 중 오류가 발생했습니다:", error.message);
    }
}

exportToJson();