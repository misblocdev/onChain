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

router.get('/createAccount', (req, res) => {
  const keyring = caver.wallet.keyring.generate()
  caver.wallet.add(keyring)
  res.json(caver.wallet.getKeyring(keyring.address));
})

router.post('/addAccountFromKeyStore', upload.single('keyStore'), async (req, res, next) => {
  try {
    const { file: { filename = "" } = {} } = req;
    const { body: { password = "" } = {} } = req;
    if (filename === "" || password === "") throw "인자부족";
    const keystore = fs.readFileSync(`uploads/${filename}`, 'utf8');
    console.log(keystore)
    console.log(req.file)
    const keyring = await caver.wallet.keyring.decrypt(keystore, password);
    await caver.wallet.add(keyring)
    return res.status(200).json(caver.wallet.getKeyring(keyring.address));
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
  const { amount = 0, unit = null, recipient = null, address = null } = req?.body;
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
    
    let signed = await caver.wallet.sign(address, transaction)
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

    console.log('서버 보관 정보 : '); console.log(req.file)

    const workbook = new excel.Workbook()

    var mun1 = ""

    workbook.xlsx.readFile(`munjin/${filename}`).then(() => {
      var sheet = workbook.getWorksheet(1)
      let rowCount = sheet.actualRowCount
      let colCount = sheet.actualColumnCount
      let workCol = 4

      for(let i=workCol ; i <= colCount ; i++) {
        data = sheet.getRow(rowCount).getCell(i).toString()
        mun1 += data.toString()
      }
      res.status(200).json(mun1)
    });
    return
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

    let signed = await caver.wallet.sign(address, transactionMemo)
    const receipt = await caver.rpc.klay.sendRawTransaction(signed)
    console.log(receipt)
    res.json(receipt)// client.App
  }
  catch (error) {
    console.log("error: ", error)
    res.send({ error })
  }
})

module.exports = router;
