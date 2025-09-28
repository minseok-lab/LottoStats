// 서버에서 전체 회차 원본 데이터를 가져오는 함수
export async function fetchData() {
    try {
        const response = await fetch('/api/draws');
        if (!response.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
        }
        let drawsData = await response.json();
        // 데이터가 회차(drawNo) 순서대로 정렬되도록 보장
        drawsData.sort((a, b) => a.drawNo - b.drawNo);
        return drawsData;
    } catch (error) {
        console.error(error);
        // 오류 발생 시 빈 배열을 반환하거나, 오류를 다시 던져서 처리할 수 있습니다.
        return [];
    }
}