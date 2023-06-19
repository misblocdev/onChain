import React, { useState } from 'react'
import axios from 'axios'

import { crypt } from './crypto'
const Caver = require('caver-js')
const caver = new Caver(process.env.REACT_APP_BAOBAB2)

const TransferMemo = (props) => {
    const [beforeBalance, setBeforBalance] = useState("")
    const [afterBalance, setAfterBalance] = useState("")
    const [amount, setAmount] = useState(0)
    const [unit, setUnit] = useState("KLAY")
    const [recipient, setRecipient] = useState(process.env.REACT_APP_MYADDRESS1)
    const [address, setAddress] = useState(process.env.REACT_APP_MYADDRESS1)// test 계정
    const [memo, setMemo] = useState(props.memo);// AES 문진 정보
    const [blockHash, setBlockHash] = useState("")
    const [transactionHash, setTransactionHash] = useState("")
    const [inputData, setInputData] = useState("")

    // 업데이트 된 텍스트 적용 하여 수동 복호. 삭제 예정
    let onClickDecrypt = async () => {
        let viewMemo = crypt(memo, false)// 복호
        //console.log(viewMemo)
        setMemo(viewMemo)
    }
    let onClickEncrypt = async () => {
        let viewMemo = crypt(memo, true)// 암호
        //console.log(viewMemo)
        setMemo(viewMemo)
    }

    // Hex 2 UTF8 2 AES. 삭제 예정
    let onClickAES = async () => {
        //let input = crypt(Web3.utils.hexToUtf8(inputData), false) // web3
        let input = crypt(inputData, false) // caver
        //console.log(`16 -> AES -> Decryption : ${input}`)
        setInputData(input)
    }

    const onClickHandler = async () => {
        const beforeB = await axios.get(`/api/getBalance/?address=${address}`);
        setBeforBalance(beforeB?.data?.balance);
        const result2 = await axios.post(`/api/transferMemo`, {
            amount,
            unit,
            recipient,
            address,
            memo
        });
        if (!result2.hasOwnProperty("error")) {
            setBlockHash(result2?.data?.blockHash)
            setTransactionHash(result2?.data?.transactionHash)
            setInputData(caver.utils.hexToUtf8(result2?.data?.input))// HEX 2 UTF8
            //setInputData(crypt(caver.utils.hexToUtf8(result2?.data?.input), false))// HEX 2 UTF8 2 AES
        }
        else {
            setBlockHash("실패")
        }
        const afterB = await axios.get(`/api/getBalance/?address=${address}`);
        setAfterBalance(afterB?.data?.balance)
    }

    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>TransferMemo</h3>
        <div>
            {`amount : `}
            <input onChange={e => setAmount(e.target.value)} value={amount} />
        </div>
        <div>
            {`unit : `}
            <input onChange={e => setUnit(e.target.value)} value={unit} />
        </div>
        <div>
            {`recipient : `}
            <input onChange={e => setRecipient(e.target.value)} value={recipient} />
        </div>
        <div>
            {`my Address : `}
            <input onChange={e => setAddress(e.target.value)} value={address} />
        </div>
        <div>
            {`MunJin : `}
            <input onChange={e => setMemo(e.target.value)} value={memo} />
            <button onClick={onClickDecrypt}>복호</button>
            <button onClick={onClickEncrypt}>암호</button>
        </div>
        <div>{`beforeBalance : ${beforeBalance}`}</div>
        <div>{`afterBalance : ${afterBalance}`}</div>
        <button onClick={onClickHandler}>전송</button>
        <div>생성된 블럭 해시값 : {blockHash}</div>
        <div>생성된 트랜잭션 값 : {transactionHash}</div>
        <div>생성된 트랜 인풋값 : {inputData}</div>

        <div>
            {`input : `}
            <input onChange={e => setInputData(e.target.value)} value={inputData} />
            <button onClick={onClickAES}>16toAEStoDecrypt</button>
        </div>
    </div>
}
export default TransferMemo;
