// js/colors.js

// 색상 팔레트 정의, 동행복권 색상 사용
const COLOR_PALETTE = {
    YELLOW: '#FBC400',
    BLUE: '#69C8F2',
    RED: '#FF7272',
    GRAY: '#AAAAAA',
    GREEN: '#B0D840'
};

/**
 * 숫자를 입력받아 해당 구간의 색상 코드를 반환하는 함수
 * @param {number} number - 로또 번호 (1~45)
 * @returns {string} - 16진수 색상 코드
 */
export function getColorByNumber(number) {
    if (number >= 1 && number <= 10) {
        return COLOR_PALETTE.YELLOW;
    } else if (number >= 11 && number <= 20) {
        return COLOR_PALETTE.BLUE;
    } else if (number >= 21 && number <= 30) {
        return COLOR_PALETTE.RED;
    } else if (number >= 31 && number <= 40) {
        return COLOR_PALETTE.GRAY;
    } else if (number >= 41 && number <= 45) {
        return COLOR_PALETTE.GREEN;
    } else {
        return COLOR_PALETTE.GRAY; // 기본값
    }
}