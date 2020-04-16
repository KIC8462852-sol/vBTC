import React, { useState, useEffect } from 'react'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Row, Col, Input } from 'antd'
import { Label, LabelGrey, Sublabel, Click, Button, Center, HR, Gap} from './components'


import '../App.css';

export const AcquireWeb3 = () => {


	const [account, setAccount] = useState(
		{address:'', tokenBalance:'', ethBalance:''})

	const [contract, setContract] = useState(null)
	const [web3, setWeb3] = useState(null)

	const [burnEthFlag, setBurnEthFlag] = useState(null)
	const [ethTx, setEthTx] = useState(null)

	const [burnTknFlag, setBurnTknFlag] = useState(null)
	const [tknTx, setTknTx] = useState(null)

	const [customToken, setCustomToken] = useState(null)
	const [customAmount, setCustomAmount] = useState(null)

	const [walletFlag, setWalletFlag] = useState(null)
	const [ethPlaceholder, setEthPlaceholder] = useState(null)
	const [ethAmount, setEthAmount] = useState(null)

	const [approvalAmount, setApprovalAmount] = useState(null)

	useEffect(() => {

		const loadBlockchainData = async () => {
		const web3_ = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
		const contract_ = new web3_.eth.Contract(await VBTC_ABI(), await VBTC_ADDR())
		const accounts = await web3_.eth.getAccounts()
		console.log(accounts[0])

		var bal_ = 2400000000

		const tokenBalance_ = 2400000000
			
		setAccount({
			address: accounts[0],
			tokenBalance: tokenBalance_,
			ethBalance: bal_
		})

		setContract(contract_)
		setWeb3(web3_)
	}

		loadBlockchainData()

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
		const accounts = await web3_.eth.getAccounts()
		const amount = ethAmount * 10000000000000000 // Add two more 0's
		const fromAcc = account.address
		const toAcc = accounts[1]
		console.log(account.address, toAcc, amount)
		//const tx = await web3_.eth.sendTransaction({ from: fromAcc, to: toAcc, value: amount })
		//setEthTx(tx.transactionHash)

		setBurnEthFlag('TRUE')
	}
	
	const getLink = (tx) => {
		const link = "https://etherscan.io/tx/"
		return link.concat(tx)
	}



	const onTokenChange = e => {
		setCustomToken(e.target.value)
	}

	const onAmountChange = e => {
		setCustomAmount(e.target.value)
	}

	const unlockToken = async () => {
		//const contract_ = new web3.eth.Contract(ERC20_ABI, ERC20_ADDR)
		//const accounts = await web3.eth.getAccounts()

		//const spender_= VETHER_ADDR
		//const val_ = "1000000000000000000000000000000000000"
		//console.log(spender_, val_)

		//const resp = await contract_.methods.approve(spender_, val_).send({from: accounts[0]})
		//console.log(resp)

		//const approval_ = await contract_.methods.allowance(accounts[0], spender_).call()
		//setApprovalAmount(approval_)

	}

	const burnToken = async () => {
		//const accounts = await web3.eth.getAccounts()

		//const addr_= ERC20_ADDR
		//const amount_ = customAmount

		//const spender_= VETHER_ADDR
		//const val_ = "1000000000000000000000000000000000000"

		// const resp = await contract.methods.BurnTokens(addr_, amount_).send({from: accounts[0]})
		//const tx = await contract.methods.approve(spender_, val_).send({from: accounts[0]})
		//setTknTx(tx.transactionHash)
		setBurnTknFlag('TRUE')
	}

	function convertToWei(number){
		var num = number / 1000000000000000000
		return num.toFixed(2)
	  }

	function prettify(amount){
		const number = Number(amount)
		var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
	}

    return (

        <div>
            
        <Label>{account.address}</Label>
			<br></br>
			<LabelGrey>ACCOUNT</LabelGrey>
			<br></br><br></br>
			<Label margin={"20px 0px 0px"}>{prettify(account.tokenBalance)} VETH</Label>
			<br></br>
			<LabelGrey>VETH Balance</LabelGrey>
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
							<br></br>
							<Button onClick={maxEther}>{account.ethBalance}</Button>
							<br></br>
							<LabelGrey>ETH Balance</LabelGrey>
						</Col>
						<Col xs={15} sm={18} style={{marginLeft:20}}>
							<Button onClick={burnEther}> BURN >></Button>
							<br></br>
							<Sublabel>Burn ETH to acquire VIRTUAL BITCOIN</Sublabel>

							{burnEthFlag &&
								<div>	
									<Click><a href={getLink(ethTx)} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{fontSize:12, color:"#000061"}}> VIEW TRANSACTION -> </a></Click>
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