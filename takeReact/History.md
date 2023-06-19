# 230312 history

이슈1. 특정 환경에서 프록시 사용 불가

WIN10 환경
client/package.json
"proxy": "http://localhost:3100" 실행 불가 오류

WIN10에서는 유선 랜 사용 시 고정 IP에서는 프록시 사용 못하는 버그.
Invalid options object. Dev Server has been initialized using an options object that does not match the API schema
오류는 유선 랜 접속으로 '고정IP'일 경우 프록시 생성이 안된는 문제로 추정.
무선 접속 한다면 클라이언트의 리액트 패키지에서 프록시 설정 가능.
유선 접속한다면 http-proxy-middleware 패키지를 쓰고. 빈 포트를 찾아 띄워야 함.

# 변경된 사항

Front-end client

1. 패키지 설치
client> npm i http-proxy-middleware@2.0.6

2. 서버 포트 설정
server/bin/www 에서 normalizePort(process.env.PORT || '3100'); 로 
http://localhost:3100 설정

3. client/src/ 에 setupProxy.js 파일 생성
// setupProxy.js 내용
const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3100',  // <- target: 요청할 API 주소
      changeOrigin: true,
      pathRewrite: {                    // <- pathRewrite: URI 요청하면 target에 넣는 주소로 변환함
        '^/api': '',
      },
    })
  )
}
//

4. 패키지.JSON 수정
client/package.json 열람
"proxy": "http://localhost:3100" 삭제

5. 리액트 수정 사항 있다면 원복
디폴트 포트 설정 파일
client/node_modules/react-scripts/scripts/start.js
// 내용
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
//
또는 클라이언트 폴더에서 `yarn`으로 재설치하여 원래 상태로 덮어씌우기

6. Front-end에서 Back-end로 api 요청 경로 앞에 api를 붙이는 걸로 수정
axios나 fetch로 api 요청할 때 기존의 uri 앞에 /api를 붙여야 함.
예) client/src/components/AddAccountFromKeyStore.jsx 수정
18줄 문단에서 axios.post 요청 uri
/addAccountFromKeyStore -> /api/addAccountFromKeyStore
예)
const result = await axios.post('/addAccountFromKeyStore', formData)
const result = await axios.post('/api/addAccountFromKeyStore', formData);
다른 클라이언트 axios 요청 모두 같은 식으로 '/api/'를 추가하여 수정

---------------------------------------------------------------------------------

# 230314 history

이슈1. 클레이튼 노드에 문진 정보를 AES 암호화 하기 위한 기능 추가

# 변경된 사항

Front-end client

1. crypto.js 기능 제작
src/components/crypto.js
crypt(val, key)  : val에 string 인풋. key에 string 인풋.

2. axios.post(`/api/transferMemo`) { amount, unit, recipient, address, memo } 인자 전달 확인
amount-코인개수, uint-코인단위, recipient-to, address-from, memo-문진정보

Back-end server

1. axios.post에서 보내온 req.body 중 memo를 string으로 인자값 넣으니 valueTransferMemo 발행에 가끔 오류 발생
req.body.memo 값을 caver 내부 함수 [caver.utils.toHex] UTF8->Hex로 바꿔 넣으니 넣는 것으로 해결

---------------------------------------------------------------------------------

# 230315 history

이슈1. 클레이튼 노드에 문진 정보를 AES 암호화 하기 위한 기능 변경

Front-end client

1. crypto.js 기능 업데이트
src/components/crypto.js
crypt(val, option)  : val에 string 인풋. 옵션에 true이면 AES 변환. false이면 string 아웃풋.
AES키값은 .env에서 내부 변수로 설정함으로 key 추가 입력 없음.

2. 임시 문진 정보를 App.js에서 제작해 TransferMemo.jsx 에 세팅. 암/복호 테스트

3. 암/복호 테스트 시 memo 내용 직접 수정 기능 생성. 내용에 연월일 추가

4. axios.post(`/api/transferMemo`) { amount, unit, recipient, address, memo } 인자 전달 확인
amount-코인개수, uint-코인단위, recipient-to, address-from, memo-AES된 문진정보


Back-end server

1. axios.post에서 보내온 req?.body 중 AES 변환된 memo를 HEX로 변환시켜 valueTransferMemo 발행 신청 테스트

---------------------------------------------------------------------------------

# 230417 history

이슈1. 클레이튼 노드의 영수증 정보의 UTF8 변환

Front-end client

1. TransferMemo.jsx 트랜잭션 성공 시 서버에서 돌려받은 inputData인 문진정보를 hex에서 utf8로 변환 테스트

2. client에 서버와 같은 버전의 caver-js 설치 했으나 오류 목격.
리액트 스크립츠의 버전5로는 caver-js 지원하지 않는다는 포럼 글 확인.
확인된 최종 리액트 스크립츠 버전은 4.0.3.
리액트 스크립트 다운 그레이드 또는 webpack 수동 업데이트 두가지 방법 확인.
또는 이더리움에서 쓰는 web3 설치.

3. web3 설치하여 동작 시 Warning 수십개.
새로 생겨난 Warning 수십개는 타입 스크립트가 노드 모듈 파일 인식을 못한 부분.
.env에서 GENERATE_SOURCEMAP=false 소스맵 사용안함 한 줄 추가로 무시함.

4. back-end 정보를 받아 web3.utils.tohex 내부 함수로 변환 가능 확인.


Back-end server

1. TransferMemo.jsx 로 넣은 메모를 포함한 영수증의 input(문진정보)가 hex 데이터여서 클라이언트에서 hex to utf8 변환. AES 디코딩으로 원본 문진 정보 확인 필요.

2. res.json으로 Front-end 에게 영수증 원본을 넘겨줌.

---------------------------------------------------------------------------------

# 230418 history

Front-end client

1. web3 라이브러를 제거

2. caver-js 추가로 생기는 오류.
react-scripts@5.0.0 -> react-scripts@4.0.3 으로 해결

3. 리액트 버전5에서 처리되던 AES 복호 기능 트러블 처리
hex를 utf8 변환 후 AES 복호하여 처리 되던 것
crypt(caver.utils.hexToUtf8(inputData), false)
서버에서 날라온 영수증 데이터를 받아 set에 뿌려줄 때 utf8 변환하여 화면에 넣음.
caver.utils.hexToUtf8(result2?.data?.input)
화면에 저장한 값을 AES 복호 버튼 이벤트에서 다시 변환
crypt(inputData, false)
서버에서 날라온 영수증 데이터를 set으로 뿌려줄 때 HEX2UTF82AES 전체 변환 시에는 오류 없음
setInputData(crypt(caver.utils.hexToUtf8(result2?.data?.input), false))// HEX 2 UTF8 2 AES

---------------------------------------------------------------------------------

# 230419 history

Front-end client

1. AddMunjin.jsx 생성

2. app.js에서 AddMunjin.jsx 임포트

3. app.js에서 className에 AddMunjin 추가

4. axios.post로 파일을 서버로 전송


Back-end server

1. munjin 폴더에 업로드 저장 테스트. 엑셀, 텍스트, json 무관하게 신규이름으로 저장 확인

2. exceljs 패키지 추가
https://github.com/exceljs/exceljs
3. 프론트앤드에서 다운로드 된 파일을 exceljs로 읽어 셀 내용 호출 도전 중

4. 데이터를 받아 JSON 타입으로 만들어 router.post('/transferMemo)의 AES 변조 후 HEX 변조하여 memo 값에 적용시켜 날리는 구상
---------------------------------------------------------------------------------

# 230420 history

Front-end client

Back-end server

1. save 폴더에 간이로 만든 munjin-test.xlsx로 exceljs를 이용해 문진정보만 추출 테스트.
2중 for문으로 접근/추출 가능.

2. 현재 클라이언트의 txt창에서 복붙하여 AES 시킨 데이터를 서버로 넘김. 서버에서 hex 시켜 올리는 방식.
엑셀을 서버로 업로드 시키면 AES 안 된 문진 정보임. 서버에서 AES를 구현해야 맞는가? 생각에 문제는 없는가?

3. 클라이언트에서 문진정보 AES 암호화 -> 서버에서 받음 -> 서버에서 문진정보 HEX 변환 후 온체인 -> 온체인 영수증 출력 받음 -> 서버에서 클라이언트로 영수증 JSON 전달
-> 클라이언트에서 영수증 JSON 중 inputData만 추출하여 STRING으로 변환 -> HEX를 UTF8로 변환 -> UTF8을 AES로 복호하여 확인
---------------------------------------------------------------------------------

# 230423 history

이슈1. 실행 스크립트로 서버와 클라이언트 동시 실행 기능 추가

Back-end server

1. 스크립트에서 서버와 클라이언트 동시 실행을 위해 패키지 추가

실행법 변경

proxy-munjin 폴더에서
cd server
server> `npm start`