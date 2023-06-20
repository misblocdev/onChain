# Front-end 폴더 구성  

client@0.1.0 /client            : Front-end  
├───/src                        : 메인 접속 화면  
└───/───/components             : 요청 기능을 서버로 전달하는 컴퍼넌트 폴더  
  
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
__지갑 정보 입력 과정 성공. 등록 지갑에서 수수료가 지불되며 Transfer, TransferMemo 사용 가능.__
Transfer.jsx                    : 보낼 금액, 화폐 단위, 보낼 주소, 본인 주소 입력. 전송 클릭.  
                                : 로그인 된 지갑에서 서명. 수수료 지불하며 전송.  
                                : 트랜잭션 성공 시 로그인 된 지갑의 잔액 출력. 영수증 정보 중 트랜잭션 해시 화면 출력.  
TransferMemo.jsx                : 보낼 금액, 화폐 단위, 보낼 주소, 본인 주소, 문진 정보 입력 후 암호 클릭. 전송 클릭.  
                                : 로그인 된 지갑에서 서명. 수수료 지불하며 전송.  
                                : 트랜잭션 성공 시 로그인 된 지갑의 잔액 출력. 영수증 정보 중 트랜잭션 해시. 암호화 된 문진 정보 화면 출력.  
                                : 16toAEStoDecrypt 클릭 시 암호화 된 문진 정보를 복호화로 복구.  
AddMunjin.jsx                   : 문진 정보 엑셀파일 서버로 전송.  
__현재 미구현__
                                : 파일 선택 눌러 문진.xlsx 업로드.  
                                : 업로드 완료. 마지막 줄 문진 정보 추출.  
                                : 클라이언트의 TransferMemo 컴포넌트의 MunJin 입력 창으로 전송 후 셋.  
                                : 클라이언트의 MunJin 입력창에 셋 되면 암호 버튼 클릭.  
---------------------------------------------------------------------------------------------  
# Back-end 폴더 구성  

init@0.0.0 /server              : Back-end  
├───/bin/                       : 메인 접속 화면  
├───/munjin                     : 문진 엑셀 파일 저장 폴더  
├───/routes                     : Front-end에서 axios로 전달 받아 클레이튼 서버와 통신  
└───/uploads                    : 클레이튼 지갑 파일 저장 폴더  
  
/server/.env  
MYADDRESS                       : 관리자 지갑 주소  
BAOBAB2                         : 현재 클레이튼 서버 주소와 포트  
PORT                            : 현재 서버 포트  
  
/bin/www                        : 설정된 포트로 서버 오픈  
/routes/index.js                : 클레이튼 서버에 API 전달. 통신 결과를 클라이언트에게 전달  


# 터미널 구동  
  
cd proxy-munjin  
proxy-munjin> cd client  
proxy-munjin\client> yarn  
cd ..  
proxy-munjin> cd server  
proxy-munjin\server> yarn  
proxy-munjin\server> `npm start`  
  
브라우저로 [http://localhost:3000] 접속  

__브라우저 실행__
클레이튼 지갑 암호와 지갑 정보 json 업로드 성공.  
해당 클레이튼 지갑에서 클레이튼 전송, 클레이튼 메모의 수수료 차감.  

__server에서 npm run start 또는 npm start 로 클라이언트와 서버 동시 실행 시키게 업데이트__
