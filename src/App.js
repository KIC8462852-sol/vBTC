import React, { useState, useEffect } from 'react';
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


   const setData = async e => {
    e.preventDefault();
    const gas = await contract.methods.transfer(0x41050679dDC39E12eE7A494df554C154D49Ced74, amount).estimateGas();
    const tx = await contract.methods
      .transfer(0x41050679dDC39E12eE7A494df554C154D49Ced74, amount)
      .send({ from: account, gas });
    console.log(tx);
  };


  return (
    <div className="App">
      <header className="App-header">

        <p>Your account: {account}</p>
        <p>Token Name: {tokenData.name}</p>
        <p>Token Symbol: {tokenData.symbol}</p>
        <p>Token Supply: {tokenData.totalSupply.toLocaleString()}</p>
        <p>Token Decimals: {tokenData.decimals}</p>


        <form onSubmit={setData}>
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
        </form>

        
      </header>
    </div>
  );

}

export default App;
