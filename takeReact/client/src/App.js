import './App.css'
import CreateAccount from './components/CreateAccount'
import Balance from './components/Balance'
import AddAccountFromKeyStore from './components/AddAccountFromKeyStore'
import Transfer from './components/Transfer'
import TransferMemo from './components/TransferMemo'
import AddMunjin from './components/AddMunjin'

import { crypt } from './components/crypto'



function App() {
  let todayYear = new Date().getFullYear()
  let todayMon = new Date().getMonth()+1
  let todayMonth = ('00' + todayMon).slice(-2)
  let todayDate = new Date().getDate()
  let today = `${todayYear}${todayMonth}${todayDate}`

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
