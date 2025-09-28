const fs = require('fs');
const path = require('path');
const { parseLottoData } = require('./lotto-analyzer');

function exportToSql() {
    try {
        // 1. lotto-analyzer에서 파싱된 원본 데이터를 가져옵니다.
        const draws = parseLottoData();
        if (draws.length === 0) {
            console.log("분석할 데이터가 없습니다. download.js를 먼저 실행하세요.");
            return;
        }

        // 2. SQL 파일의 기본 구조를 정의합니다. (테이블 생성 구문)
        let sqlContent = `
DROP TABLE IF EXISTS lotto_draws;

CREATE TABLE lotto_draws (
    draw_no INT PRIMARY KEY,
    num1 INT NOT NULL,
    num2 INT NOT NULL,
    num3 INT NOT NULL,
    num4 INT NOT NULL,
    num5 INT NOT NULL,
    num6 INT NOT NULL,
    bonus_no INT NOT NULL
);

-- 데이터 삽입 시작 --
`;

        // 3. 각 회차 데이터를 INSERT 문으로 변환합니다.
        const insertStatements = draws.map(draw => {
            const values = [
                draw.drawNo,
                ...draw.numbers, // 당첨번호 6개
                draw.bonus
            ].join(', ');
            return `INSERT INTO lotto_draws (draw_no, num1, num2, num3, num4, num5, num6, bonus_no) VALUES (${values});`;
        });

        // 4. 생성된 INSERT 문들을 sqlContent에 추가합니다.
        sqlContent += insertStatements.join('\n');

        // 5. 'lotto_data.sql' 파일로 저장합니다.
        const targetPath = path.resolve(__dirname, 'lotto_data.sql');
        fs.writeFileSync(targetPath, sqlContent);

        console.log(`✅ 총 ${draws.length}개의 데이터가 lotto_data.sql 파일로 성공적으로 추출되었습니다!`);

    } catch (error) {
        console.error("SQL 파일 생성 중 오류가 발생했습니다:", error.message);
    }
}

exportToSql();