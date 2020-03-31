import React, { useState, useEffect } from 'react'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Row, Col, Input } from 'antd'
import { H2, Subtitle, Sublabel, Click, Button, Text, Label, HR, Gap} from './components'

import '../App.css';

const Claim = (props) => {
	const [contract, setContract] = useState(null)
	const [web3, setWeb3] = useState(null)

	// const [walletFlag, setWalletFlag] = useState(null)
	const [scanFlag, setScanFlag] = useState(null)
	const [checkFlag, setCheckFlag] = useState(null)
	const [claimFlag, setClaimFlag] = useState(null)
	
	const [txHash, setTxHash] = useState(null)

	const [userData, setUserData] = useState(
		{era:'', day:''})

	useEffect(() => {

		const loadBlockchainData = async () => {
			const web3_ = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
			setWeb3(web3_)
			const contract_ = new web3_.eth.Contract(VBTC_ABI, VBTC_ADDR )
			setContract(contract_)
		}

		loadBlockchainData()
	}, [])

	// const connect = () => {
	// 	setWalletFlag('TRUE')
	// }

	const scan = () => {
		setScanFlag('TRUE')
	}

	const checkDay = () => {
		setCheckFlag('TRUE')
	}

	 const onEraChange = e => {
	    setUserData({era:e.target.value})
	}

	 const onDayChange = e => {
	    setUserData({day:e.target.value})
	}

	const checkShare = async () => {
		// const share_ = await contract.methods.GetEmissionShare(account, userData.era, userData.day).call()
		console.log(userData.era, userData.day)
		checkDay()
	}

	const claimShare = async () => {
		// const share_ = await contract.methods.WithdrawShare(userData.era, userData.day).call()
		setTxHash('0x335976d33aafa673e9f1751951a38ad3585e8751819da29d08f715c226eeb803')
		setClaimFlag('TRUE')
	}
	
	const getLink = () => {
		const link = "https://etherscan.io/tx/"
		const linkFull = link.concat(txHash)
		return linkFull
	}

	return (
		<div>
			
			<Gap />
			<H2>CLAIM VETHER</H2><br />
			<Subtitle>Claim your share of a previous day’s emission. </Subtitle>
			<Gap />

			<Row>
				<Col xs={6} sm={3}>
					<Input allowClear onChange={onEraChange} placeholder="Era"/>
					<br></br>
					<Sublabel>Set Era</Sublabel>
					<br></br>
				</Col>
				<Col xs={6} sm={3} style={{marginLeft:10, marginRight:20}}>
					<Input allowClear onChange={onDayChange} placeholder="Day"/>
					<br></br>
					<Sublabel>Set Day</Sublabel>
					<br></br>
				</Col>
				<Col xs={8} sm={6}>
					<Button onClick={checkShare}> CHECK >></Button>
					<br></br>
					<Sublabel>Check for claim</Sublabel>	
					<br></br>	
				</Col>
				</Row>
				<Gap />

				{checkFlag &&
					<div>
						<Row>
						<Col xs={12} sm={6}  style={{marginLeft:0, marginRight:30}}>
							<Label>23.12 VETH</Label>
							<br></br>
							<Text size={14}>Unclaimed VETHER on this day</Text>
						</Col>
						
						<Col xs={8} sm={6}>
							<Button onClick={claimShare}> CLAIM >></Button>
							<br></br>
							<Text size={14}>Claim VETHER</Text>	
							{claimFlag &&
							<div>	
								<Click><a href={getLink()} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{color:"#000061", fontSize:12}}> VIEW TRANSACTION -> </a></Click>
							</div>
							}	
						</Col>
						</Row>
					</div>
				}

				

			<Gap />
			<HR />
			<Gap />
	    </div>
	)
}

export default Claim
