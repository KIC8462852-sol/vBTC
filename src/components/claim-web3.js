import React, { useState, useCallback, useEffect } from 'react'

import { getAccounts, vbtcContract, setLink} from '../client/web3.js'

import { Colour } from './styles'
import { Row, Col, Input } from 'antd'
import { Sublabel, Click, Button, Text, Label, HR, Gap, List} from './components'

import '../App.css';

export const ClaimWeb3 = () => {

    const [contract, setContract] = useState(null)
	const [account, setAccount] = useState(
		{address:''})

	const [claimAmt, setClaimAmt] = useState(null)
	const [arrayBlocks, setArrayBlocks] = useState(['-'])
	const [checkFlag, setCheckFlag] = useState(null)
	const [claimFlag, setClaimFlag] = useState(null)
	const [txHash, setTxHash] = useState(null)
	const [userData, setUserData] = useState(
		{block:''})

	useEffect(() => {

		const loadBlockchainData = async () => {
			const contract_ = await vbtcContract()
			const account_ = await getAccounts(0)
			const currentBlock_ = await contract_.methods.currentBlock().call()
			setContract(contract_)
			getblocks(contract_, account_)
			setAccount({
				address: account_
			})
	
			setUserData({
				block:currentBlock_})
		}

		loadBlockchainData()
	}, [])


	const getblocks = async (contract_, account_) => {
		let blocks = []
		const thisAcc_ = account_
		const blocklength_ = await contract_.methods.getBlocks().call({from: thisAcc_})

		for( var j = 0; j < blocklength_; j++){
			let getBlockIndex_ = await contract_.methods.getBlockAtIndex(j).call({from: thisAcc_})
			blocks.push(getBlockIndex_)
		}
		setArrayBlocks(blocks)
	}

	function convertToNumber(number) {
		return number / 10 ** 8
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
		const share_ = await contract.methods.getShare(userData.block).call({ from: account.address})
		setClaimAmt(convertToNumber(share_))
		checkBlock()
	}

	const claimShare = async () => {
		const fromAcc_ = account.address
		const tx = await contract.methods.withdraw(userData.block).send({ from: fromAcc_ })
		setTxHash(tx.transactionHash)
		setClaimFlag('TRUE')
	}
	
	const getLink = () => {
		const link = setLink()
		const linkFull = link.concat(txHash)
		return linkFull
	}

	function BlockItems() {
		const handleBlockClick = useCallback((item, i) => {
			//console.log("logged block:", item)
			setUserData({block: item})
		}, [])
		return (
		<div>
			{arrayBlocks.map((block, i) => (
				<List > 
				<li key={block[i]}>
					<Button key={block[i]} onClick={() => handleBlockClick(block, i)}>{block}</Button>
				</li>
				</List>
			))}
		</div>)
	}

    return (
        <div>
			<Sublabel>Blocks this address has contributed in.</Sublabel>
			<br />
			<Text>Click block number and then click Check Share</Text>
			<br />
			<BlockItems />
			<Row>
            <Col xs={6} sm={3}>
                <Input allowClear onChange={onBlockChange} placeholder={userData.block} />
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
                        <Text size={14}>Unclaimed VIRTUAL BITCOIN in this block</Text>
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