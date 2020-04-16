import React, { useState, useEffect, useCallback } from 'react'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Row, Col } from 'antd'
import { H1, LabelGrey, Label, Click } from './components'

export const HeroWeb3 = () => {


    const [tokenData, setTokenData] = useState(
		{name:'', symbol:'', totalSupply:'', genesis:''})
	const [emissionData, setEmissionData] = useState(
		{balance:'', totalBurnt:'', totalFees:''})
	const [marketData, setMarketData] = useState(
		{priceUSD:'', priceETH:''})

	useEffect(() => {

		const loadBlockchainData = async () => {
		const web3_ = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

		const contract_ = new web3_.eth.Contract(await VBTC_ABI(), await VBTC_ADDR())

		const name_ = await contract_.methods.name().call()
		const symbol_ = await contract_.methods.symbol().call()
		const totalSupply_ = await contract_.methods.totalSupply().call()
		const genesis_ = "15 May 2020" //await contract_.methods.Genesis().call()
		setTokenData({
			name: name_,
			symbol:symbol_,
			totalSupply: convertToNumber(totalSupply_),
			genesis:convertToDate(genesis_)})
		}

	const getMarketData = async () => {
		const priceUSD_ = 1.12
		const priceETH_ = 0.0045
		setMarketData({priceUSD:priceUSD_, priceETH:priceETH_})
	}

		loadBlockchainData()
		getMarketData()
	}, [])

	function convertToNumber(number){
	  	return number / 1000000000000000000
	}

	function convertToDate(date){
		return new Date(1000*date).toLocaleDateString("en-GB", {year:'numeric', month:'short', day:'numeric'})
	}

	function prettify(amount){
		const number = Number(amount)
		var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
			return parts.join(".");
	}

	function convertToETH(vBTC){
		return vBTC * marketData.priceETH
	}

	function convertToUSD(vBTC){
		return vBTC * marketData.priceUSD
	}

	const getLink = useCallback(() => {
		const link = "https://etherscan.io/address/"
		const code = "#code"
		const linkFull = link.concat(VBTC_ADDR()).concat(code)
		return linkFull
	}, [])

    return(
        <div>
            <Row style={{marginLeft:20}}>
						<Col xs={21} sm={11} lg={11}>
							<Row style={{marginTop:10}}>
								<Col xs={6}>
									<LabelGrey>NAME: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label>{tokenData.name}</Label>
								</Col>
							</Row>
							<Row style={{marginTop:10}}>
								<Col xs={6}>
									<LabelGrey>SYMBOL: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label>{tokenData.symbol}</Label>
								</Col>
							</Row>
							<Row style={{marginTop:10}}>
								<Col xs={6}>
									<LabelGrey>TOTAL SUPPLY: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label>{prettify(tokenData.totalSupply)}</Label>
								</Col>
							</Row>
							<Row style={{marginTop:10, marginBottom:20}}>
								<Col xs={6}>
									<LabelGrey>GENESIS: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label>{(tokenData.genesis)}</Label>
								</Col>
							</Row>
							<Click><a href={getLink()} rel="noopener noreferrer" title="VIRTUAL BITCOIN Contract Link" target="_blank" style={{color:"#000061", fontSize:12}}> VIEW CONTRACT -> </a></Click>

						</Col>

						<Col xs={21} sm={13} lg={13}>
							<Row style={{marginTop:10}}>
								<Col xs={6}>
									<LabelGrey>TOTAL EMITTED: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label>{prettify(emissionData.balance)} vBTC | ${convertToUSD(emissionData.balance)}</Label>
								</Col>
							</Row>
							<Row style={{marginTop:10}}>
								<Col xs={6}>
									<LabelGrey>TOTAL BURNT: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label>{prettify(emissionData.totalBurnt)} ETH | ${convertToUSD(emissionData.totalBurnt)}</Label>
								</Col>
							</Row>
							<Row style={{marginTop:10}}>
								<Col xs={6}>
									<LabelGrey>TOTAL CAP: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label>{prettify(convertToETH(tokenData.totalSupply))} ETH | ${convertToUSD(tokenData.totalSupply)}</Label>
								</Col>
							</Row>
							<Row style={{marginTop:10}}>
								<Col xs={6}>
									<LabelGrey>vBTC VALUE: </LabelGrey>
								</Col>
								<Col xs={18}>
									<Label> {marketData.priceETH} ETH | ${marketData.priceUSD}</Label>
								</Col>
							</Row>
						</Col>
					</Row>
        </div>
    )
}