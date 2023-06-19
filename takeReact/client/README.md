# Front-end  
  
__폴더 구성__
  
client@0.1.0 /client            : Front-end  
├───/src                        : 메인 접속 화면  
└───/───/components             : 요청 기능을 서버로 전달하는 컴퍼넌트 폴더  
  
__기능 구성__
  
/client/.env  
REACT_APP_MYADDRESS1            : 관리자 지갑 주소  
REACT_APP_MYWALLET1PW           : 관리자 지갑 암호  
REACT_APP_AES_SECRETKEY         : AES 암호화 키값. 복호화 시 필수  
  
/client/src/setupProxy.js       : 클라이언트에서 서버 접속을 위해 프록시 설정  
  
/client/src/components/  
Version.jsx                     : 클레이튼 노드 버전 받아오는 기능. # 제외.  
GetLatestBlock.jsx              : 클레이튼 노드 최근 블럭 받아오는 기능. # 제외.  
Balance.jsx                     : address에 현재 계정 주소 입력. 확인 클릭.  
                                : 해당 주소의 클레이 잔액을 받아 화면 출력.  
CreateAccount.jsx               : 신규 계정 생성, 생성 계정을 현재 네트워크에 추가.  
                                : 화면에 계정과 개인키 출력.  
AddAccountFromKeyStore.jsx      : 클레이튼 지갑 암호 입력. 파일 선택 클릭. `클레이튼 지갑키.json` 업로드.  
                                : 성공 시 지갑키 계정 주소와 생략된 개인키 출력.  
**지갑 정보 입력 과정 성공. 등록 지갑에서 수수료가 지불되며 Transfer, TransferMemo 사용 가능.**
Transfer.jsx                    : 보낼 금액, 화폐 단위, 보낼 주소, 본인 주소 입력. 전송 클릭.  
                                : 로그인 된 지갑에서 서명. 수수료 지불하며 전송.  
                                : 트랜잭션 성공 시 로그인 된 지갑의 잔액 출력. 영수증 정보 중 트랜잭션 해시 화면 출력.  
TransferMemo.jsx                : 보낼 금액, 화폐 단위, 보낼 주소, 본인 주소, 문진 정보 입력 후 암호 클릭. 전송 클릭.  
                                : 로그인 된 지갑에서 서명. 수수료 지불하며 전송.  
                                : 트랜잭션 성공 시 로그인 된 지갑의 잔액 출력. 영수증 정보 중 트랜잭션 해시. 암호화 된 문진 정보 화면 출력.  
                                : 16toAEStoDecrypt 클릭 시 암호화 된 문진 정보를 복호화로 복구.  
AddMunjin.jsx                   : 문진 정보 엑셀파일 서버로 전송.  
현재 미구현  
                                : 파일 선택 눌러 문진.xlsx 업로드.  
                                : 업로드 완료. 마지막 줄 문진 정보 추출.  
                                : 클라이언트의 TransferMemo 컴포넌트의 MunJin 입력 창으로 전송 후 셋.  
                                : 클라이언트의 MunJin 입력창에 셋 되면 암호 버튼 클릭.  
  
# 패키지 일람  
  
axios@0.26.1                    : Promise API 요청 및 서버 통신 패키지  
http-proxy-middleware@2.0.6     : 프록시 설정 패키지  
__WIN10 환경에서는 package.json에서의 선언 시 PATH 에러로 인해 설치한 패키지__
crypto-js@4.1.1                 : 특정 정보를 AES 암호화 시켜 server 전달  
react-scripts@4.0.3             : 리액트 스크립트 실행 패키지  
__react-scripts@5.0.0 에서 caver-js 오류로 전체 동작 불능__
__리액트 스크립트 다운 그레이드 또는 webpack 버전 수동 업그레이드로 해결__
caver-js@1.8.1                  : 클레이튼 노드 통신 패키지  
__클라이언트에서는 caver.utils 내부 함수 사용__
---------------------------------------------------------------------------------  
__http-proxy-middleware 오류 정보 리포트__
  
WIN10에서는 유선 랜 사용 시 고정 IP에서는 프록시 사용 못하는 버그.  
Invalid options object. Dev Server has been initialized using an options object that does not match the API schema  
오류는 유선 랜 접속으로 '고정IP'일 경우 프록시 생성이 안된는 문제로 추정.  
무선 접속 한다면 클라이언트의 리액트 패키지에서 프록시 설정 가능.  
유선 접속한다면 http-proxy-middleware 패키지를 쓰고. 빈 포트를 찾아 띄워야 함.  
---------------------------------------------------------------------------------  
# 변경된 사항  

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
  
  
#단독 실행  
  
client 폴더에서 yarn start  
브라우저에서 [http://localhost:3000] 접속  

#현재 server 폴더에서 npm start로 단일 터미널 실행이 가능하게 업데이트
