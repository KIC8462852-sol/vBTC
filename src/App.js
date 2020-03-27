import React, { useState, useEffect } from 'react';
import './App.css';

import { VBTC_ADDR, VBTC_ABI } from './contract-abi'
import Web3 from 'web3'

import { Button } from 'antd'

const App = (props) => {

const [contract, setContract] = useState(null)

const [account0, setAccount0] = useState(
  {address:'', tokenBalance:'', ethBalance:''})

const [account1, setAccount1] = useState(
    {address:'', tokenBalance:'', ethBalance:''})

const [tokenData, setTokenData] = useState(
    {name:'', symbol:'', totalSupply:'', decimals:''})

useEffect(() => {

  const loadBlockchainData = async () => {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    const accounts = await web3.eth.getAccounts()
    var balance_ = await web3.eth.getBalance(accounts[0])
    var bal_ = convertToWei(balance_)

    const contract_ = new web3.eth.Contract(VBTC_ABI, VBTC_ADDR)
    setContract(contract_)

    const tokenBalance_ = await contract_.methods.balanceOf(accounts[0]).call()
    
    setAccount0({
      address: accounts[0],
      tokenBalance: tokenBalance_,
      ethBalance: bal_
    })

  

    const name_ = await contract_.methods.name().call()
    const symbol_ = await contract_.methods.symbol().call()
    const totalSupply_ = await contract_.methods.totalSupply().call()
    const decimals_ = await contract_.methods.decimals().call()
    setTokenData({
      name: name_,
      symbol:symbol_,
      totalSupply: convertToNumber(totalSupply_),
      decimals:decimals_
    })
  }

  loadBlockchainData()
}, [])

  const transferFunc = async () => {
    console.log("we clicked")
    const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    const accounts = await web3.eth.getAccounts()
    const contract_ = new web3.eth.Contract(VBTC_ABI, VBTC_ADDR)

    const to_= accounts[1]
    const val_ = '1000000'
    const resp = await contract_.methods.transfer(to_, val_).send({from: accounts[0]})
    updateAccount1()
  }

const updateAccount1 = async () => {

  const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
  const accounts = await web3.eth.getAccounts()
  var balance_ = await web3.eth.getBalance(accounts[1])
  var bal_ = convertToWei(balance_)
  const contract_ = new web3.eth.Contract(VBTC_ABI, VBTC_ADDR)
  const tokenBalance_ = await contract_.methods.balanceOf(accounts[1]).call()
  console.log(tokenBalance_)
    
    setAccount1({
      address: accounts[1],
      tokenBalance: tokenBalance_,
      ethBalance: bal_
    })
}

const sendEth = async () => {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
  const accounts = await web3.eth.getAccounts()

  const fromAcc = accounts[0]
  const toAcc = accounts[1]
  const amount = 100000000000000000

  const tx = await web3.eth.sendTransaction({ from: fromAcc, to: toAcc, value: amount })
  console.log(tx)

  var balance_ = await web3.eth.getBalance(accounts[1])
  var bal_ = convertToWei(balance_)
  const contract_ = new web3.eth.Contract(VBTC_ABI, VBTC_ADDR)
  const tokenBalance_ = await contract_.methods.balanceOf(accounts[1]).call()

  setAccount1({
    address: accounts[1],
    tokenBalance: tokenBalance_,
    ethBalance: bal_
  })
}

function convertToNumber(number){
  var num = number / 1
  // num = num.toFixed(2)
  return num
}

function convertToWei(number){
  var num = number / 1000000000000000000
  return num.toFixed(2)
}

  return (
    <div className="App">
      <header className="App-header">

        <p>Your account: {account0.address}</p>
        <p>Your Token balance: {account0.tokenBalance.toLocaleString()}</p>
        <p>Your eth balance: {account0.ethBalance}</p>

        <p>Token Name: {tokenData.name}</p>
        <p>Token Symbol: {tokenData.symbol}</p>
        <p>Token Supply: {tokenData.totalSupply.toLocaleString()}</p>
        <p>Token Decimals: {tokenData.decimals}</p>

        <Button type="primary" loading={false} onClick={transferFunc}>
          Transfer VBTC to Acc1
        </Button>

        <Button type="primary" loading={false} onClick={sendEth}>
          Transfer 1 Eth
        </Button>

        <p>Their account: {account1.address}</p>
        <p>Their Token balance: {account1.tokenBalance.toLocaleString()}</p>
        <p>Their eth balance: {account1.ethBalance}</p>


        {/* <form onSubmit={setData}>
          <label>
            Set Data:
            <input
              type="text"
              name="test"
              value={tokenData.symbol}
              onChange={e => transfer(e.target.value)}
            />
          </label>
          <input type="submit" value="Set Data" />
        </form> */}

        
      </header>
    </div>
  );

}

export default App;
