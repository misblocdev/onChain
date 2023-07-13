require("dotenv").config()

const CryptoJS = require('crypto-js')
const express = require('express')
const app = express()
const port = process.env.PORT
const Caver = require("caver-js")
const caver = new Caver(process.env.CYPRES2)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// localhost:8882
app.listen(port,() => {
    console.log('서버 구동중입니다!');
})
// app.post() : get방식으로 http 요청. /=home
app.post("/", (req, res) => {
    res.send("start!!")
})

app.post('/version',async (req,res) => {
    const version = await caver.rpc.klay.getClientVersion()
    res.send(version)
})

app.post('/getBlock',async (req,res) => {
    const { block = "" } = req?.body
    try {
        if(block) {
            console.log(block)
            let blk = await caver.klay.getBlock(block)
            console.log(blk.hash)
            return res.json(blk.hash)
        }
        else {
            let block = await caver.klay.getBlockNumber()
            return res.json('last block : '+block)
        }
    }
    catch ( error ) {
        return res.json('블럭 번호 조회 실패')
    }
})

app.post('/getTx',async (req,res) => {
    const { hash = "" } = req?.body
    if (hash === null ) throw "no Input"
    try {
        const receipt = await caver.klay.getTransactionReceipt(hash)
        de = await aes256(await caver.utils.hexToUtf8(receipt.input), false)
        return res.json(de)
    }
    catch (error) {
        return res.json('전송 해시 검색 실패')
    }
})

app.post('/getBalance', async (req, res, next) => {
    try {
        //if (address === "") throw "No input"
        balance = await caver.klay.getBalance(process.env.ADDRESS2)
        balance = caver.utils.fromPeb(balance, "KLAY")
        //const balance = await caver.klay.getBalance(address)
        return res.json('관리자 잔고 : '+balance+'klay')
    }
    catch (error) {
      return res.json('관리자 잔고 검색 실패');
    }
})

app.post('/getAccount',async (req,res) => {
    const { address = null } = req?.body
    if (address === null ) throw "No input"
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

app.post('/decrypt', async (req,res) => {
    const body = req?.body
    try{
        de = await aes256(body.decrypt, false)
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
        const keyring = await caver.wallet.keyring.createFromPrivateKey(process.env.PRIVATE2)
        await caver.wallet.add(keyring)
        const transactionMemo = await caver.transaction.valueTransferMemo.create({
            type: 'VALUE_TRANSFER_MEMO',
            from: keyring.address,
            to: keyring.address,
            //value: caver.utils.toPeb(amount, unit),
            value: caver.utils.toPeb('0.000001', 'KLAY'),
            gas: 750000,
            input: hexMemo
        })
        const signed = await caver.wallet.sign(keyring.address, transactionMemo)
        const receipt = await caver.rpc.klay.sendRawTransaction(signed)
        await caver.wallet.remove(keyring.address)
        memo = await aes256(await caver.utils.hexToUtf8(receipt.input), false)
        const re = receipt.transactionHash
        return re
    }
    catch (error) {
        return res.json('온 체인 작업 실패 : ' + memo)
    }
}

async function aes256(val, option) {
    if (option === true) {
        var en = CryptoJS.AES.encrypt(JSON.stringify(val), process.env.AESKEY).toString()
        return en
    } else {
        var bytes = CryptoJS.AES.decrypt(val, process.env.AESKEY)
        var de = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
        return de
    }
}
