require('dotenv').config()
const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const munjin = multer({ dest: 'munjin/' })
const fs = require('fs')

const excel = require('exceljs')

const Caver = require('caver-js')
const caver = new Caver(process.env.BAOBAB2)

// router.get('/getVersion', async function (req, res, next) {
//   const version = await caver.rpc.klay.getClientVersion();
//   res.json({ version });
// });

// router.get("/getLatestBlock", async (req, res) => {
//   const block = await caver.rpc.klay.getBlockByNumber("latest");
//   res.json({ block });
// });

router.get('/createAccount', (req, res) => {
  const keyring = caver.wallet.keyring.generate()// 새로운 랜덤 keyring 제작
  caver.wallet.add(keyring)// wallet에 추가
  res.json(caver.wallet.getKeyring(keyring.address));
})

router.post('/addAccountFromKeyStore', upload.single('keyStore'), async (req, res, next) => {
  try {
    const { file: { filename = "" } = {} } = req;
    const { body: { password = "" } = {} } = req;
    if (filename === "" || password === "") throw "인자부족";
    const keystore = fs.readFileSync(`uploads/${filename}`, 'utf8');// 가져올 때 해당파일명으로 fs 사용해 가져옴.
    console.log(keystore)
    console.log(req.file)
    const keyring = await caver.wallet.keyring.decrypt(keystore, password);// keystore파일과 wallet 암호 입력해 keyring 생성
    await caver.wallet.add(keyring)
    return res.status(200).json(caver.wallet.getKeyring(keyring.address));// wallet 주소 중 일치하는 keyring 반환
  }
  catch (error) {
    console.log("error", error, typeof error);
    return res.status(400).send({ error });
  }
});


router.get('/getBalance', async (req, res, next) => {
  const { address = "" } = req?.query;
  try {
    if (address === "") throw "인자 없음";
    const balance = await caver.klay.getBalance(address);
    return res.json({ balance });
  }
  catch (error) {
    res.json({ error });
  }
})


router.post('/transfer', async (req, res, next) => {
  const { amount = 0, unit = null, recipient = null, address = null } = req?.body;// amount type = string, uint type = string
  // if (amount === 0 || unit === null || recipient === null || address === null) throw "인자부족";
  if (amount === null || unit === null || recipient === null || address === null) throw "인자부족";
  try {
    console.log(typeof amount, recipient, address)
    const transaction = await caver.transaction.valueTransfer.create({
      type: 'VALUE_TRANSFER',
      from: address,
      to: recipient,
      value: caver.utils.toPeb(amount, unit),
      gas: 750000,
    })
    
    // transaction 서명
    let signed = await caver.wallet.sign(address, transaction)
    // transaction 전송
    const receipt = await caver.rpc.klay.sendRawTransaction(signed)
    console.log(receipt)
    res.json(receipt)// client.App
  }
  catch (error) {
    console.log("error: ", error)
    res.send({ error })
  }
})


router.post('/transferMemo', async (req, res, next) => {
  const { amount = 0, unit = null, recipient = null, address = null, memo = null } = req?.body;
  if (amount === null || unit === null || recipient === null || address === null || memo === null) throw "인자부족";
  try {
    const memoHex = await caver.utils.toHex(memo);
    console.log(typeof amount, recipient, address, memo, memoHex)
    const transactionMemo = await caver.transaction.valueTransferMemo.create({
      type: 'VALUE_TRANSFER_MEMO',
      from: address,
      to: recipient,
      value: caver.utils.toPeb(amount, unit),
      gas: 750000,
      input: memoHex,
    })

    // transaction 서명
    let signed = await caver.wallet.sign(address, transactionMemo)
    // transaction 전송
    const receipt = await caver.rpc.klay.sendRawTransaction(signed)
    console.log(receipt)
    res.json(receipt)// client.App
  }
  catch (error) {
    console.log("error: ", error)
    res.send({ error })
  }
})


router.post('/AddMunjin', munjin.single('munJin'), async (req, res, next) => {
  try {
    const { file: { filename = "" } = {} } = req;
    if (filename === "") throw "인자부족";

    //const munjin = fs.readFileSync(`munjin/${filename}`, 'utf8');// 가져올 때 해당파일명으로 fs 사용해 가져옴.
    console.log('서버 보관 정보 : '); console.log(req.file)

    // console.log(`서버 파일 내용 : ${munjin}`)// 파일 내용. 엑셀은 데이터 깨짐으로 확인 불필요.

    const workbook = new excel.Workbook()
    //const worksheet = await workbook.xlsx.readFile(`munjin/${filename}`)// munjin 엑셀 읽기
    // console.log('최근 업로드 엑셀 파일 내용 : '); console.log(worksheet)

    // ALL 출력 방식
    // worksheet.eachSheet((sheet) => {
    //   sheet.eachRow((row) => {
    //     row.eachCell((cell) => {
    //       //console.log(cell.value)
    //       //console.log(row.getCell(4).value)
    //     })
    //   })
    // })

    //특정 Col의 All Row(인원수) 출력
    // workbook.xlsx.readFile(`munjin/${filename}`).then(() => {
    //   //var sheet = workbook.getWorksheet("munjin-test")// WorkSheet 네임 매치
    //   var sheet = workbook.getWorksheet(1)// 1번 WorkSheet
    //   console.log(sheet.actualRowCount)// row는 1~35 줄
    //   for (var i = 2; i <= sheet.actualRowCount; i++) {// row는 2~35줄
    //     for (var j = 4; j <= sheet.actualColumnCount; j++) {// col은 C~H
    //       data = sheet.getRow(i).getCell(j).toString()
    //       process.stdout.write(data+" ")// 컬럼 C~H까지 '값 공백'으로 붙임
    //     }
    //     console.log()// 컬럼의 끝에 줄바꿈. ROW 구분용
    //   }
    // });
    var mun1 = ""
    // 시트 마지막 1명의 문진 정보 출력
    workbook.xlsx.readFile(`munjin/${filename}`).then(() => {
      var sheet = workbook.getWorksheet(1)// 1번 WorkSheet
      let rowCount = sheet.actualRowCount// 1번 row는 설명 row. 문진 정보 아님.
      let colCount = sheet.actualColumnCount// 총 컬럼 사이즈. q의 마지막
      let workCol = 4// 시작 컬럼 설정. 날짜, 구분, id, q01

      // 가로 3번째 열 q01 ~ 끝 열까지 카운트 : 문진 정보 출력
      for(let i=workCol ; i <= colCount ; i++) {
        data = sheet.getRow(rowCount).getCell(i).toString()
        mun1 += data.toString()
        //mun1 += sheet.getRow(rowCount).getCell(i).toString()// 마지막 줄 문진 데이터
        // process.stdout.write(data+" ")// 화면 뿌리기
        // 마지막 컬럼에 셀 추가. value에는 '성공' 키워드 추가. -> 전역 변수에 data를 메모로 넣어줌. -> 트랜잭션 통신 200 확인 -> 셀 읽을 때 마지막 컬럼이 '성공'이면 해당 row 삭제 -> 작업 시작
        //console.log(mun1)
      }
      res.status(200).json(mun1)
    });
    return
    //return res.status(200).json(mun1)
    //return res.status(200).send(mun1)// 보관된 파일 정보 프론트앤드 출력
  }
  catch (error) {
    console.log("error", error, typeof error);
    return res.status(400).send({ error });
  }
});

router.post('/AddMunjinSet', async (req, res, next) => {

  const { amount = 0, unit = null, recipient = null, address = null, memo = null } = req?.body;
  if (amount === null || unit === null || recipient === null || address === null || memo === null) throw "인자부족";
  try {
    const memoHex = await caver.utils.toHex(memo);
    console.log(typeof amount, recipient, address, memo, memoHex)
    const transactionMemo = await caver.transaction.valueTransferMemo.create({
      type: 'VALUE_TRANSFER_MEMO',
      from: address,
      to: recipient,
      value: caver.utils.toPeb(amount, unit),
      gas: 750000,
      input: memoHex,
    })

    // transaction 서명
    let signed = await caver.wallet.sign(address, transactionMemo)
    // transaction 전송
    const receipt = await caver.rpc.klay.sendRawTransaction(signed)
    console.log(receipt)
    res.json(receipt)// client.App
  }
  catch (error) {
    console.log("error: ", error)
    res.send({ error })
  }
})


// router.post('/feeDelegatedTransfer', async (req, res, next) => {
//   const { amount = 0, unit = null, recipient = null, address = null } = req?.body;
//   if (amount === 0 || unit === null || recipient === null || address === null) throw "인자부족";
//   try {
//     console.log(typeof amount, recipient, address)
//     const transaction = await caver.transaction.valueTransfer.create({
//       type: 'FEE_DELEGATED_VALUE_TRANSFER',
//       from: address,
//       to: recipient,
//       value: caver.utils.toPeb(1, unit),
//       gas: 25000,
//     })

//     // transaction 서명
//     const { rawTransaction: senderRawTransaction } = await caver.wallet.sign(address, transaction)
//     const rlpEncoded = await transaction.getRLPEncoding();
//     console.log(rlpEncoded)

//     // fee를 지불할 계정 추가
//     console.log("asddasf : ", process.env.feePrivateKey)
//     const feePayer = new caver.wallet.keyring.singleKeyring(process.env.feeAddress, process.env.feePrivateKey)
//     caver.wallet.add(feePayer);

//     // 수수료 위임 transaction 생성
//     const feePayerTransaction = {
//       type: 'FEE_DELEGATED_VALUE_TRANSFER',
//       feePayer: feePayer.address,
//       senderRawTransaction: senderRawTransaction,
//     }

//     // transaction 전송
//     const result = await caver.klay.sendTransaction(feePayerTransaction);
//     console.log(result)
//     return res.json({ result });
//     // .on('transactionHash', console.log)
//     // .on('receipt', async (receipt) => { console.log(receipt) })
//     // .on('error', console.log)


//     // // transaction 전송
//     // const receipt = await caver.rpc.klay.sendRawTransaction(signed)
//     // console.log(receipt)
//     // res.json(receipt);
//   }
//   catch (error) {
//     console.log("error: ", error)
//     res.send({ error })
//   }
// })


module.exports = router;
