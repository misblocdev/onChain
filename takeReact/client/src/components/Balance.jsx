import React, { useState } from 'react';
import axios from 'axios';

const Balance = () => {
    const [address, setAddress] = useState(process.env.REACT_APP_MYADDRESS1);
    const [balance, setBalance] = useState("");

    const onClickHandler = async () => {
        const result = await axios.get(`/api/getBalance/?address=${address}`);
        console.log(result);
        setBalance(result?.data?.balance);
    }

    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>계정 잔고</h3>
        <div>
            {`address : `}
            <input onChange={e => setAddress(e.target.value)} value={address} />
        </div>
        <div>{`balance : ${balance}`}</div>
        <button onClick={onClickHandler}>확인</button>
    </div>
}
export default Balance;
