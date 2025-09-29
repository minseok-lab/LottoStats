// js/api.js

// 서버에서 전체 회차 원본 데이터를 가져오는 함수
export async function fetchData() {
    try {
        const response = await fetch('/api/draws');
        // 응답에 실패했을 경우 오류 메시지 표시
        if (!response.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        let drawsData = await response.json();
        // 데이터가 회차(drawNo) 순서대로 정렬되도록 보장
        drawsData.sort((a, b) => a.drawNo - b.drawNo);
        return drawsData;
    } catch (error) {
        console.error("API Fetch Error:", error);
        throw error; // 오류 발생 시 에러를 호출한 쪽으로 다시 던짐
    }
}