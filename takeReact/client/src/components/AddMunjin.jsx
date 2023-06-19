import React, { useState } from 'react'
import axios from 'axios'

// function AddMunjin({ AddMunjinFunction }) {
//     const [data, setData] = useState(2)
//     AddMunjinFunction(data)
//     return <div>`Child {data}`</div>
// }

const AddMunjin = () => {
    const [file, setFile] = useState("")
    const [munjin, setMunjin] = useState("")
    const [error, setError] = useState("")
    const onChangeFileHandler = async (e) => {
        e.preventDefault()
        if (e.target.files) {
            const uploadFile = e.target.files[0]// 파일 1개 읽기
            const formData = new FormData()
            //let count = count+1
            formData.append(`munJin`, uploadFile)// 추가
            setFile(uploadFile.name)
            try {
                const result = await axios.post('/api/AddMunjin', formData)// 서버 업로드
                setError("none")
                setMunjin(result.data)
                console.log(result.data)
            }
            catch (error) {
                console.dir(error)
                setFile("Fail")
                setError(error.message)
            }
        }
    }
    return <div style={{
        margin: "30px", padding: "30px", border: '1px solid black', borderRadius: "30px"
    }}>
        <h3>AddMunjin</h3>
        <form>
            <label htmlFor="munjin-upload" />
            <input type="file" id="munjin-upload" accept=".xlsx, .csv/application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={onChangeFileHandler} />
        </form>
        <div>{`FileName : ${file}`}</div>
        <div>{`문진 정보 : ${munjin}`}</div>
        <div>{`error : ${error}`}</div>
    </div>
}
export default AddMunjin;
