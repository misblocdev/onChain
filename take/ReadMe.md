# 1. 설치 절차
npm init
npm i express	: 웹 서비스 개발 프레임 워크
npm i caver-js	: 카이카스 서버 API
npm i dotenv	: evn에 키:밸류 매치
npm i router    : express.Router() 하면 라우터 그룹 add
npm i body-parser : post 받기
npm i nodemon   : 서버 실행 중 코드 변경 시 자동 재시작
npm i crypto-js : AES256 암/복호화. cryptojs 라이브러리와 혼동치 말 것

dotenv 설치 후
작업 루트에 .env 생성. PORT = '8882' 설정. main.js나 index.js 최상단 require("dotenv").config();
process.env.PORT로 접근 가능

작업 루트에 package.json 스크립트에 "start": "nodemon index.js", 추가.
nodemon index.js로 실행하는 것의 단축 명령 npm start
