import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

import Web3 from 'web3'

const App = (props) => {

const [account, setAccount] = useState(null)

useEffect(() => {

  const loadBlockchainData = async () => {
    const web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:8545')
    );
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
  }

  loadBlockchainData()
}, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <p>Your account: {account}</p>

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
