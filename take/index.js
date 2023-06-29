require("dotenv").config()

const CryptoJS = require('crypto-js')
const express = require('express')
const app = express()
//const Router = require('./router/routes');
const port = process.env.PORT
const Caver = require("caver-js")
const caver = new Caver(process.env.CYPRES2)
// body-parser 
app.use(express.json());// json 타입 body 파싱
app.use(express.urlencoded({ extended: false }));// false:기본 내장 querysting 사용

// localhost:8882
app.listen(port,() => {
    console.log('서버 구동중입니다!');
})
// app.post() : get방식으로 http 요청. /=home
app.post("/", (req, res) => {
    res.send("start!!")// 요청 성공시 msg
})

app.post('/version',async (req,res) => {
    const version = await caver.rpc.klay.getClientVersion()
    res.send(version)
})
/**
 * @param 없음
 * @returns 최근 블럭 번호
 * @param {String} block
 * @returns 블럭 번호에 해당하는 해시
 */
app.post('/getBlock',async (req,res) => {
    const { block = "" } = req?.body
    try {
        if(block) {
            console.log(block)
            let blk = await caver.klay.getBlock(block)// 해당 블럭 조회
            console.log(blk.hash)
            return res.json(blk.hash)
        }
        else {
            let block = await caver.klay.getBlockNumber()// 최근 블럭 조회
            return res.json('last block : '+block)
        }
    }
    catch ( error ) {
        return res.json('블럭 번호 조회 실패')
    }
})
/**
 * @param 없음
 * @returns 최근 블럭 번호
 * @param {String} block
  * @returns 블럭 번호에 해당하는 해시
 */
app.post('/getTx',async (req,res) => {
    const { hash = "" } = req?.body
    if (hash === null ) throw "인자 없음"
    try {
        const receipt = await caver.klay.getTransactionReceipt(hash)
        // hex를 utf8로 변경 후 AES256 풀기
        de = await aes256(await caver.utils.hexToUtf8(receipt.input), false)
        return res.json(de)
    }
    catch (error) {
        return res.json('전송 해시 검색 실패')
    }
})


// 관리자 잔고
app.post('/getBalance', async (req, res, next) => {
    try {
        //if (address === "") throw "인자 없음"
        balance = await caver.klay.getBalance(process.env.ADDRESS2)// 관리자 계정 잔고
        balance = caver.utils.fromPeb(balance, "KLAY")
        //const balance = await caver.klay.getBalance(address)// 입력 받은 계정 잔고
        return res.json('관리자 잔고 : '+balance+'klay')
    }
    catch (error) {
      return res.json('관리자 잔고 검색 실패');
    }
})

app.post('/getAccount',async (req,res) => {
    const { address = null } = req?.body
    if (address === null ) throw "인자 없음"
    try {
        let getAccount = await caver.klay.getAccount(address)
        console.log(getAccount.account.balance)
        return res.json(getAccount)
    }
    catch (error) {
        return res.json('지갑 주소 검색 실패')
    }
})

app.post('/transferMemo', async (req,res) => {
    const body = req.body

    let on = await sendMemo(body)
    res.json(on)
})
// AES256 받아 복호
app.post('/decrypt', async (req,res) => {
    const body = req?.body
    try{
        de = await aes256(body.decrypt, false)// 복호
        res.json(de)
    }
    catch {
        res.json('AES KEY 또는 입력값 확인')
    }
})

async function sendMemo(memo) {
    try {
        const aesMemo = await aes256(memo, true)
        const hexMemo = await caver.utils.toHex(aesMemo)
        const keyring = await caver.wallet.keyring.createFromPrivateKey(process.env.PRIVATE2)// 개인키로 키링 생성
        await caver.wallet.add(keyring) // caver-js 인메모리 지갑에 keyring 추가
        const transactionMemo = await caver.transaction.valueTransferMemo.create({
            type: 'VALUE_TRANSFER_MEMO',
            from: keyring.address,
            to: keyring.address,
            //value: caver.utils.toPeb(amount, unit),
            value: caver.utils.toPeb('0.000001', 'KLAY'),
            gas: 750000,
            input: hexMemo
        })
        const signed = await caver.wallet.sign(keyring.address, transactionMemo)// 서명
        const receipt = await caver.rpc.klay.sendRawTransaction(signed)// transaction 신청 블럭. 생성 되면 receipt로 영수증 리턴
        await caver.wallet.remove(keyring.address)// 사용 후 삭제
        memo = await aes256(await caver.utils.hexToUtf8(receipt.input), false)// 복호
        //const re = process.env.BAOBAB_PATH + receipt.transactionHash// URL + transaction
        const re = receipt.transactionHash
        return re// 미스블록 작업 해시
    }
    catch (error) {
        return res.json('온 체인 작업 실패 : ' + memo)
    }
}

/**
 * @param {String} val 
 * @param {true, false} option 
 * @returns string 타입과 true를 넣으면 AES256 암호. string 타입과 false를 넣으면 복호.
 */
// AES256 + AESKEY
async function aes256(val, option) {
    // 암호
    if (option === true) {
        var en = CryptoJS.AES.encrypt(JSON.stringify(val), process.env.AESKEY).toString()
        return en
    } else {
    // 복호
        var bytes = CryptoJS.AES.decrypt(val, process.env.AESKEY)
        var de = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return de
    }
}
