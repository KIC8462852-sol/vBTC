import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Row, Col, Input } from 'antd'
import { Label, LabelGrey, Sublabel, Click, Button, Center, HR, Gap} from './components'

import '../App.css';
import { Colour } from './styles'

export const AcquireWeb3 = () => {

	const [account, setAccount] = useState(
		{address:'', tokenBalance:'', ethBalance:''})

	const [contract, setContract] = useState(null)
	const [web3, setWeb3] = useState(null)

	const [burnEthFlag, setBurnEthFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)
	const [marketData, setMarketData] = useState(
        {priceUSD:'', priceETH:''})

	const [walletFlag, setWalletFlag] = useState(null)
	const [ethPlaceholder, setEthPlaceholder] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)

	useEffect(() => {

		const loadBlockchainData = async () => {
		const web3_ = new Web3(Web3.givenProvider || "http://localhost:8545")
		const contract_ = new web3_.eth.Contract(await VBTC_ABI(), await VBTC_ADDR())
		const accounts = await web3_.eth.getAccounts()
		console.log("account adddress: ", accounts[0])
		var bal_ = convertFromWei(await web3_.eth.getBalance(accounts[0]))
		const tokenBalance_ = convertToNumber(await contract_.methods.balanceOf(accounts[0]).call())
		
		setAccount({
			address: accounts[0],
			tokenBalance: tokenBalance_,
			ethBalance: bal_
		})

		setContract(contract_)
		setWeb3(web3_)
	}
	const getMarketData = async () => {
        const priceUSD_ = 1.12
        const priceETH_ = 0.0045
        setMarketData({ priceUSD: priceUSD_, priceETH: priceETH_ })
    }
		loadBlockchainData()
		getMarketData()

	}, [])

	const connect = () => {
		setWalletFlag('TRUE')
		setEthPlaceholder(account.ethBalance)
		setEthAmount(account.ethBalance-0.1)
	}

	const maxEther = async () => {
		setEthPlaceholder(account.ethBalance)
		setEthAmount(account.ethBalance-0.1)
		console.log("maxEther", ethAmount)
	}

	const onEthAmountChange = e => {
		setEthAmount(e.target.value)
	}

	const burnEther = async () => {
		console.log("burnEther", ethAmount)
		const web3_ = web3
		const amount = ethAmount * 1000000000000000000 // check this
		const fromAcc = account.address
		const toAcc = VBTC_ADDR()
		console.log(account.address, toAcc, amount)
		const tx = await web3_.eth.sendTransaction({ from: fromAcc, to: toAcc, value: amount })
		setEthTx(tx.transactionHash)
		const newBlock = await contract.methods.currentBlock().call()
		console.log("newBlock ", newBlock)
		const nextBlockTime	= await contract.methods.nextBlockTime().call()
		console.log('nextBlockTime', nextBlockTime)	
		const secondsPerBlock	= await contract.methods.secondsPerBlock().call()
		console.log('secondsPerBlock', secondsPerBlock)	
		setBurnEthFlag('TRUE')
	}
	
	const getLink = (tx) => {
		const link = "https://etherscan.io/tx/"
		return link.concat(tx)
	}
	
	function convertFromWei(number) {
		var num = number / 1000000000000000000
		return num.toFixed(2)
	}

	function convertToNumber(number) {
		return number / 10 ** 8
	}

	function convertToUSD(vBTC) {
		return vBTC * marketData.priceUSD
	}

	function prettify(amount){
		const number = Number(amount)
		var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
	}

    return (
        <div>
			<br></br>
			<LabelGrey>ACCOUNT</LabelGrey> <br />
			<Label>{account.address}</Label>
			<br></br>
			<br></br>
			<LabelGrey>ETH Balance</LabelGrey><br />
			<Button onClick={maxEther}>{account.ethBalance}</Button>
			<br></br>
			<br></br>
			<LabelGrey>VBTC Balance</LabelGrey><br />
			<Label margin={"20px 0px 0px"}>{prettify(account.tokenBalance)} VBTC</Label>
			<br></br>
			<br></br>
			<LabelGrey>Token Value</LabelGrey><br />
			<Label margin={"20px 0px 0px"}>$ {prettify(convertToUSD(account.tokenBalance))} USD</Label>
			<br></br>
			<Gap />

			{walletFlag &&
				<div>	
					<Center><Button onClick={connect}> > CONNECT WALLET &lt;</Button></Center>
					<Gap />
				</div>
			}	
			{!walletFlag &&
				<div>
					<Label>BURN ETHER</Label>
					<Row>
						<Col xs={6} sm={3}>
							<Input style={{marginBottom:10}} allowClear onChange={onEthAmountChange} placeholder={account.ethBalance}/>
						</Col>
						<Col xs={15} sm={18} style={{marginLeft:20}}>
							<Button onClick={burnEther}> BURN >></Button>
							<br></br>
							<Sublabel>Burn ETH to acquire VIRTUAL BITCOIN</Sublabel>

							{burnEthFlag &&
								<div>	
									<Click><a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{fontSize:12, color: Colour().blue}}> VIEW TRANSACTION -> </a></Click>
								</div>
							}
						</Col>
					</Row>
					<Gap />
			</div>
			}
			<Gap />
			<Gap />
			<HR />
	    </div>
    )
}