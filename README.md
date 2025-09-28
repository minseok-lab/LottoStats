# 로또 번호 분석 및 추천 시스템 (LottoStats)

## 📑 프로젝트 개요

이 프로젝트는 동행복권 웹사이트에서 역대 로또 당첨 번호 데이터를 수집하고 분석하여 통계 정보를 제공하는 Node.js 기반의 웹 애플리케이션입니다. 수집된 데이터를 바탕으로 통계적 분석을 수행하고, 사용자에게 추천 번호를 생성해주는 기능을 포함하고 있습니다.

## ✨ 주요 기능

-   **데이터 수집**: 동행복권 사이트에서 1회부터 최신 회차까지의 모든 당첨 번호 데이터를 다운로드합니다. (`download.js`)
-   **데이터 파싱 및 분석**: 다운로드한 HTML 데이터를 파싱하여 구조화된 데이터로 변환하고, 번호별 출현 빈도를 분석합니다. (`lotto-analyzer.js`)
-   **데이터 내보내기**: 분석된 데이터를 `JSON` 또는 `SQL` 형식의 파일로 내보낼 수 있습니다. (`export-json.js`, `export-sql.js`)
-   **통계 시각화**: 웹 페이지를 통해 전체 기간 및 특정 기간 동안의 당첨 번호 출현 빈도를 차트로 시각화하여 보여줍니다. (`index.html`, `server.js`)
-   **추천 번호 생성**: 과거 데이터를 기반으로 통계적 가중치를 적용하여 로또 번호 조합을 추천합니다. (`js/recommend.js`, `generate-email-body.js`)

## 🛠️ 기술 스택

-   **Backend**: Node.js, Express
-   **Data Scraping**: Axios, Cheerio
-   **Utilities**: iconv-lite (한글 인코딩 처리)
-   **Frontend**: HTML, CSS, JavaScript (Chart.js 등)

## 🗂️ 파일 구조

```
LottoStats/
├── css/
│   └── styles.css             # 웹 페이지 스타일시트
├── js/
│   ├── api.js                 # 서버 API 호출 로직
│   ├── colors.js              # 로또 번호별 색상 정의
│   ├── main.js                # 프론트엔드 메인 로직 (차트 생성 등)
│   └── recommend.js           # 추천 번호 생성 알고리즘
├── download.js                # 로또 데이터 다운로드 스크립트
├── lotto-analyzer.js          # HTML 데이터 파싱 및 분석 스크립트
├── export-json.js             # 데이터를 JSON 파일로 내보내는 스크립트
├── export-sql.js              # 데이터를 SQL 파일로 내보내는 스크립트
├── generate-email-body.js     # 추천 번호 조합을 생성하여 텍스트 파일로 저장
├── server.js                  # Express 웹 서버
├── index.html                 # 메인 웹 페이지
├── lotto_data.html            # 다운로드된 원본 데이터 파일
├── lotto_data.json            # JSON으로 내보낸 데이터 파일
├── lotto_data.sql             # SQL로 내보낸 데이터 파일
├── email-body.txt             # 생성된 추천 번호 텍스트 파일
└── package.json               # 프로젝트 의존성 및 스크립트 정보
```

## 🚀 설치 및 실행 방법

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone https://github.com/minseok-lab/LottoStats.git
cd LottoStats
npm install
```

### 2. 로또 데이터 다운로드

동행복권 웹사이트에서 최신 데이터를 가져옵니다. 이 스크립트는 `iconv-lite` 라이브러리가 없으면 자동으로 설치를 시도합니다.

```bash
node download.js
```

### 3. 웹 서버 실행

통계 데이터를 확인할 수 있는 웹 서버를 실행합니다.

```bash
node server.js
```

서버가 실행되면 웹 브라우저에서 로컬 주소로 접속하여 통계 정보를 확인할 수 있습니다.

## 📜 스크립트 사용법

### 데이터 JSON으로 내보내기

```bash
node export-json.js
```
> `lotto_data.json` 파일이 생성됩니다.

### 데이터 SQL로 내보내기

```bash
node export-sql.js
```
> `lotto_data.sql` 파일이 생성됩니다.

### 추천 번호 생성하기

```bash
node generate-email-body.js
```
> 5개의 추천 번호 조합이 포함된 `email-body.txt` 파일이 생성됩니다.

## ⚠️ 주의사항

-   데이터 분석 및 추천 번호는 과거의 통계를 기반으로 하며, 실제 당첨을 보장하지 않습니다.
-   동행복권 웹사이트의 구조가 변경될 경우 `download.js` 또는 `lotto-analyzer.js` 스크립트의 수정이 필요할 수 있습니다.