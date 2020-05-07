import React, { useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Colour } from './styles'
import { Row, Col, Input } from 'antd'
import { Sublabel, Click, Button, Text, Label, HR, Gap} from './components'

import '../App.css';

export const ClaimWeb3 = () => {

    const [contract, setContract] = useState(null)
	const [web3, setWeb3] = useState(null)

	const [account, setAccount] = useState(
		{address:''})

	const [claimAmt, setClaimAmt] = useState(null)

	const [walletFlag, setWalletFlag] = useState(null)
	const [scanFlag, setScanFlag] = useState(null)
	const [checkFlag, setCheckFlag] = useState(null)
	const [claimFlag, setClaimFlag] = useState(null)
	
	const [txHash, setTxHash] = useState(null)

	const [userData, setUserData] = useState(
		{block:''})

	useEffect(() => {

		const loadBlockchainData = async () => {
			const web3_ = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
			setWeb3(web3_)
            const contract_ = new web3_.eth.Contract(await VBTC_ABI(), await VBTC_ADDR())
			setContract(contract_)

			const accounts = await web3_.eth.getAccounts()
			const currentBlock_ = await contract_.methods.currentBlock().call()
			const nextblocktime_ = await contract_.methods.nextBlockTime().call()

			console.log("current block: ", currentBlock_)
			console.log("next block time: ", nextblocktime_)

			setAccount({
				address: accounts[0]
			})
	
			setUserData({
				block:currentBlock_})
		}

		loadBlockchainData()
	}, [])

	const connect = () => {
		setWalletFlag('TRUE')
	}

	function convertToWei(number){
		var num = number / 1000000000000000000
		return num.toFixed(2)
	  }

	const scan = () => {
		setScanFlag('TRUE')
	}
	
	 const onBlockChange = e => {
	    setUserData({block:e.target.value })
	}

	const checkBlock = () => {
		setCheckFlag('TRUE')
	}
	function prettify(amount) {
		const number = Number(amount)
		var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	const checkShare = async () => {
		//const fromAcc_ = account.address

		const share_ = await contract.methods.getShare(1).call()
		setClaimAmt(share_)
		checkBlock()
	}

	const claimShare = async () => {
		const fromAcc_ = account.address
		const tx = await contract.methods.withdraw(userData.block, {from:fromAcc_})
		setTxHash(tx.transactionHash)
		console.log(tx.transactionHash)
		setClaimFlag('TRUE')
	}
	
	const getLink = () => {
		const link = "https://etherscan.io/tx/"
		const linkFull = link.concat(txHash)
		return linkFull
	}


    return (

        <div>
			<Row>
            <Col xs={6} sm={3}>
                <Input allowClear onChange={onBlockChange} placeholder="Block"/>
                <br></br>
                <Sublabel>Set Block</Sublabel>
                <br></br>
            </Col>
            <Col xs={8} sm={6} style={{marginLeft:20}}>
                <Button onClick={checkShare}> CHECK >></Button>
                <br></br>
                <Sublabel>Check for claim</Sublabel>	
                <br></br>	
            </Col>
            </Row>

            {checkFlag &&
                <div>
                    <Row>
                    <Col xs={12} sm={6}  style={{marginLeft:0, marginRight:30}}>
                        <Label>{prettify(claimAmt)} vBTC</Label>
                        <br></br>
                        <Text size={14}>Unclaimed VIRTUAL BITCOIN on this day</Text>
                    </Col>
                    
                    <Col xs={8} sm={6}>
                        <Button onClick={claimShare}> CLAIM >></Button>
                        <br></br>
                        <Text size={14}>Claim VIRTUAL BITCOIN</Text>	
                        {claimFlag &&
                        <div>	
                            <Click><a href={getLink()} rel="noopener noreferrer" title="Transaction Link" target="_blank" style={{color: Colour().blue, fontSize:12}}> VIEW TRANSACTION -> </a></Click>
                        </div>
                        }	
                    </Col>
                    </Row>
                </div>
            }
			<Gap />
			<Gap />
			<HR />
    </div>
    )
}