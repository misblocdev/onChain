# Back-end


- 폴더 구성

init@0.0.0 /server              : Back-end
├───/bin/                       : 메인 접속 화면
├───/munjin                     : 문진 엑셀 파일 저장 폴더
├───/routes                     : Front-end에서 axios로 전달 받아 클레이튼 서버와 통신
└───/uploads                    : 클레이튼 지갑 파일 저장 폴더


- 기능 구성

/server/.env
MYADDRESS                       : 관리자 지갑 주소
BAOBAB2                         : 현재 클레이튼 서버 주소와 포트
PORT                            : 현재 서버 포트

/bin/www                        : 설정된 포트로 서버 오픈
/routes/index.js                : 클레이튼 서버에 API 전달. 통신 결과를 클라이언트에게 전달


패키지 일람

- axios@0.26.1                    : Promise API 요청 및 서버 통신 패키지
- http-proxy-middleware@2.0.6     : 프록시 설정 패키지
- crypto-js@4.1.1                 : 특정 정보를 AES 암호화 시켜 server 전달
- dotenv@16.0.3                   : .env 사용 시 필요.
# Front-end에서는 React에 포함 된 기능이라 따로 설치하지 않음.
- nodemon@2.0.22                  : 서버 사이드 변경 시 자동 재실행 패키지
- npm-run-all@4.1.5               : 서버, 클라이언트 동시 실행을 위해 사용하는 패키지
# react-scripts@5.0.0 에서 caver-js 오류로 전체 동작 불능.
# 리액트 스크립트 다운 그레이드 또는 webpack 버전 수동 업그레이드로 해결
- caver-js@1.8.1                  : 클레이튼 노드 통신 패키지
# 클라이언트에서 인자값 받아 서버에서 caver 함수로 통신


- 단독 실행

server 폴더 yarn server
브라우저 [http://localhost:3100] 접속

- 테스트 URI : 잔액 조회
http://localhost:3100/getBalance/?address=0xA489c04317F67C01E30ef985b8E8C50AaE597C38
