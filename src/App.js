import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import { VBTC_ADDR, VBTC_ABI } from './contract-abi'
import Web3 from 'web3'

const App = (props) => {

const [contract, setContract] = useState(null)
const [account, setAccount] = useState(null)
const [tokenData, setTokenData] = useState(
    {name:'', symbol:'', totalSupply:'', decimals:''})

useEffect(() => {

  const loadBlockchainData = async () => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    );
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const contract_ = new web3.eth.Contract(VBTC_ABI, VBTC_ADDR)
    setContract(contract_)

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

function convertToNumber(number){
    var num = number / 1
    // num = num.toFixed(2)
    return num
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <p>Your account: {account}</p>
        <p>Token Name: {tokenData.name}</p>
        <p>Token Symbol: {tokenData.symbol}</p>
        <p>Token Supply: {tokenData.totalSupply.toLocaleString()}</p>
        <p>Token Decimals: {tokenData.decimals}</p>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );

}

export default App;
