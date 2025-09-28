const fs = require('fs');
const path = require('path');
const { parseLottoData } = require('./lotto-analyzer.js');
const { generateRecommendedNumbers } = require('./js/recommend.js');

function createEmailBody() {
    try {
        console.log("추천 번호 생성을 시작합니다...");
        const allDrawsData = parseLottoData();
        
        const recommendations = new Set();
        let attempts = 0;
        const maxAttempts = 50000; // 중복 제거를 위한 최대 시도 횟수

        // 중복되지 않는 5개의 추천 번호 조합을 생성
        while (recommendations.size < 5 && attempts < maxAttempts) {
            const numbers = generateRecommendedNumbers(allDrawsData);
            if (numbers) {
                // 배열을 문자열로 변환하여 Set에 추가 (중복 비교용)
                recommendations.add(JSON.stringify(numbers));
            }
            attempts++;
        }

        if (recommendations.size < 5) {
            throw new Error("5개의 고유한 추천 번호 조합을 생성하는 데 실패했습니다.");
        }

        // 이메일 본문 형식으로 텍스트를 만듦
        let emailBody = "이번주 로또 추천 번호입니다.\n\n";
        let count = 1;
        recommendations.forEach(numString => {
            const numArray = JSON.parse(numString);
            emailBody += `추천 조합 ${count}: ${numArray.join(', ')}\n`;
            count++;
        });

        // 결과를 텍스트 파일로 저장
        const targetPath = path.resolve(__dirname, 'email-body.txt');
        fs.writeFileSync(targetPath, emailBody);

        console.log(`✅ 추천 번호가 포함된 email-body.txt 파일을 생성했습니다.`);
        console.log(emailBody);

    } catch (error) {
        console.error("이메일 본문 생성 중 오류 발생:", error);
        process.exit(1); // 오류 발생 시 워크플로우를 실패 처리
    }
}

createEmailBody();