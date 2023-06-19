import React, { useState } from 'react';
import axios from 'axios';

const Transfer = () => {
    const [beforeBalance, setBeforBalance] = useState("");
    const [afterBalance, setAfterBalance] = useState("");
    const [amount, setAmount] = useState(0);
    const [unit, setUnit] = useState("KLAY");
    const [recipient, setRecipient] = useState(process.env.REACT_APP_MYADDRESS1);
    const [address, setAddress] = useState(process.env.REACT_APP_MYADDRESS1);
    const [blockHash, setBlockHash] = useState("");
    const [transactionHash, setTransactionHash] = useState("");
    const onClickHandler = async () => {
        const beforeB = await axios.get(`/api/getBalance/?address=${address}`);
        setBeforBalance(beforeB?.data?.balance);
        const result2 = await axios.post(`/api/transfer`, {
            amount,
            unit,
            recipient,
            address
        });
        console.log(result2)
        if (!result2.hasOwnProperty("error")) {
            setBlockHash(result2?.data?.blockHash);
            setTransactionHash(result2?.data?.transactionHash);
        }
        else {
            setBlockHash("실패")
        }
        const afterB = await axios.get(`/api/getBalance/?address=${address}`);
        setAfterBalance(afterB?.data?.balance);
    }

    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>클레이튼 전송</h3>
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
        <div>{`beforeBalance : ${beforeBalance}`}</div>
        <div>{`afterBalance : ${afterBalance}`}</div>
        <button onClick={onClickHandler}>전송</button>
        <div>생성된 블럭 해시값 : {blockHash}</div>
        <div>생성된 트랜잭션 값 : {transactionHash}</div>
    </div>
}
export default Transfer;
