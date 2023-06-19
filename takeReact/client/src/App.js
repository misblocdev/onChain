//import logo from './logo.svg'
import './App.css'
// import Version from './components/Version'
// import GetLatestBlock from './components/GetLatestBlock'
import CreateAccount from './components/CreateAccount'
import Balance from './components/Balance'
import AddAccountFromKeyStore from './components/AddAccountFromKeyStore'
import Transfer from './components/Transfer'
import TransferMemo from './components/TransferMemo'
import AddMunjin from './components/AddMunjin'

import { crypt } from './components/crypto'
//import { Component } from 'react'

// 자식에서 부모로 스테이트 변경 시
//import React, { useState } from 'react'


function App() {
  // const AddMunjinFunction = (x) => {
  //   console.log(x)
  // }
  // return(
  //   <div className="App">
  //     <AddMunjin AddMunjinFunction={AddMunjinFunction} />
  //   </div>
  // )

  // 오늘 년월일.
  let todayYear = new Date().getFullYear()
  let todayMon = new Date().getMonth()+1
  let todayMonth = ('00' + todayMon).slice(-2)// 1~9월이면 01~09표기
  let todayDate = new Date().getDate()
  let today = `${todayYear}${todayMonth}${todayDate}`
  // crypto-js 암호화 시켜 props로 TransferMemo.jsx 넘겨줌. 삭제 예정
  let enMemo = crypt(`문진 정보를 넣고 암호 버튼을 눌러 주세요-${today}`, true)

  console.log()
  return (
    <div className="App">
      {/* <Version /> */}
      {/* <GetLatestBlock /> */}
      <CreateAccount />
      <Balance />
      <AddAccountFromKeyStore />
      <Transfer />
      <TransferMemo memo={enMemo} />
      <AddMunjin />
    </div>
  )
}

export default App;