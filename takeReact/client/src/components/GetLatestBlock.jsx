import React, { useState } from 'react';
import axios from 'axios';

const GetLatestBlock = () => {
    const [block, setBlock] = useState("");

    const onClickHandler = async () => {
        const result = await axios.get(`/api/getLatestBlock`);
        const { block = {} } = result?.data;
        setBlock(block);
    }

    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>클레이튼 최종 블럭</h3>
        <div>{`block.number : ${block?.number}`}</div>
        <div>{`block.hash : ${block?.hash}`}</div>
        <button onClick={onClickHandler}>블럭</button>
    </div>
}
export default GetLatestBlock;
