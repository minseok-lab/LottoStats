const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

async function downloadLottoData() {
    try {
        console.log('최신 회차 번호를 가져오는 중...');
        const mainPageUrl = 'https://dhlottery.co.kr/common.do?method=main';
        const mainPageResponse = await axios.get(mainPageUrl);
        const $ = cheerio.load(mainPageResponse.data);
        const latestDrawNo = $('#lottoDrwNo').text();
        
        if (!latestDrawNo) {
            console.error('최신 회차 정보를 찾을 수 없습니다.');
            return;
        }
        console.log(`최신 회차: ${latestDrawNo}회`);

        const startNo = 1; // 1회차부터
        const endNo = parseInt(latestDrawNo, 10);
        const downloadUrl = `https://www.dhlottery.co.kr/gameResult.do?method=allWinExel&drwNoStart=${startNo}&drwNoEnd=${endNo}`;
        
        console.log(`데이터 다운로드 중... URL: ${downloadUrl}`);
        const fileResponse = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'arraybuffer' // EUC-KR 인코딩을 위해 버퍼로 받음
        });

        // 웹사이트가 EUC-KR로 인코딩되어 있으므로 변환이 필요합니다.
        const iconv = require('iconv-lite');
        const htmlContent = iconv.decode(fileResponse.data, 'EUC-KR');

        const targetPath = path.resolve(__dirname, 'lotto_data.html');
        fs.writeFileSync(targetPath, htmlContent);

        console.log(`✅ 파일 다운로드 성공! >> ${targetPath}`);

    } catch (error) {
        console.error('오류가 발생했습니다:', error.message);
    }
}

// iconv-lite 라이브러리 설치 로직 추가
try {
    require('iconv-lite');
} catch (e) {
    console.log("'iconv-lite' 라이브러리를 설치합니다...");
    const { execSync } = require('child_process');
    execSync('npm install iconv-lite');
    console.log("설치 완료. 스크립트를 다시 실행해주세요.");
    process.exit();
}

downloadLottoData();