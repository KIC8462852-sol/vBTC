import React, { useState, useEffect, useCallback } from 'react'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Colour } from './styles'
import { Row, Col } from 'antd'
import { LabelGrey, Label, Click } from './components'

export const HeroWeb3 = () => {
	const [loaded, setLoaded] = useState(null)
	const [tokenData, setTokenData] = useState(
		{ name: '', symbol: '', totalSupply: '', genesis: '' })
	const [emissionData, setEmissionData] = useState(
		{ totalBurnt: '', totalFees: '', vBTCValue:'' })
	const [marketData, setMarketData] = useState(
		{ priceUSD: '', priceETH: '' })

	useEffect(() => {

		const loadBlockchainData = async () => {
			const web3_ = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
			const contract_ = new web3_.eth.Contract(VBTC_ABI(), VBTC_ADDR())
			const name_ = await contract_.methods.name().call()
			const symbol_ = await contract_.methods.symbol().call()
			const totalSupply_ = await contract_.methods.totalSupply().call()
			const genesis_ = await contract_.methods.genesis().call()
			setTokenData({
				name: name_,
				symbol: symbol_,
				totalSupply: convertToNumber(totalSupply_),
				genesis: convertToDate(genesis_)
			})
			
			const totalBurnt_ = convertFromWei(await contract_.methods.totalBurnt().call())
			console.log("Total burnt: ", totalBurnt_)
			const totalFees_ = await contract_.methods.totalFees().call()
			const vBTCValue_ = totalBurnt_ / totalSupply_

			setEmissionData({ 
				totalBurnt: totalBurnt_, 
				totalFees: totalFees_, 
				vBTCValue: vBTCValue_ 
			})

			setLoaded(true)
		}

		const getMarketData = async () => {
			const priceUSD_ = 1.12
			const priceETH_ = 0.0045
			setMarketData({ priceUSD: priceUSD_, priceETH: priceETH_ })
		}

		loadBlockchainData()
		getMarketData()

	}, [])

	function convertToNumber(number) {
		return number / 10 ** 8
	}

	function convertFromWei(number) {
		var num = number / 1000000000000000000
		return num.toFixed(2)
	}

	// function convertToWei(number) {
	// 	var num = number * 1000000000000000000
	// 	return new BigNumber(num).toFixed(0)
	// }

	function convertToDate(date) {
		return new Date(1000 * date).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })
	}

	function prettify(amount) {
		const number = Number(amount)
		var parts = number.toPrecision(8).replace(/\.?0+$/, '').split(".");
		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		return parts.join(".");
	}

	function convertToETH(vBTC) {
		return vBTC * marketData.priceETH
	}

	function convertToUSD(vBTC) {
		return vBTC * marketData.priceUSD
	}

	const getLink = useCallback(() => {
		const link = "https://etherscan.io/address/"
		const code = "#code"
		const linkFull = link.concat(VBTC_ADDR()).concat(code)
		return linkFull
	}, [])

	return (
		<div>
			{loaded &&
				<div>

					<Row style={{ marginLeft: 20 }}>
						<Col xs={21} sm={11}>
							<Row style={{ marginTop: 10 }}>
								<Col xs={24}>
									<LabelGrey>NAME </LabelGrey><br />
									<Label>{tokenData.name}</Label>
								</Col>
							</Row>
							<Row style={{ marginTop: 10 }}>
								<Col xs={24}>
									<LabelGrey>SYMBOL </LabelGrey><br />
									<Label>{tokenData.symbol}</Label>
								</Col>
							</Row>
							<Row style={{ marginTop: 10 }}>
								<Col xs={24}>
									<LabelGrey>TOTAL SUPPLY </LabelGrey><br />
									<Label>{prettify(tokenData.totalSupply)}</Label>
								</Col>
							</Row>
							<Row style={{ marginTop: 10, marginBottom: 20 }}>
								<Col xs={24}>
									<LabelGrey>GENESIS </LabelGrey><br />
									<Label>{(tokenData.genesis)}</Label>
								</Col>
							</Row>
							<LabelGrey>{VBTC_ADDR()}</LabelGrey><br />
							<Click><a href={getLink()} rel="noopener noreferrer" title="VIRTUAL BITCOIN Contract Link" target="_blank" style={{ color: Colour().blue, fontSize: 12 }}> VIEW CONTRACT -> </a></Click>

						</Col>
						<Col xs={21} sm={13}>
							<Row style={{ marginTop: 10 }}>
								<Col xs={24}>
									<LabelGrey>TOTAL BURNT: </LabelGrey><br/>
									<Label>{prettify(emissionData.totalBurnt)} ETH | ${prettify(convertToUSD(emissionData.totalBurnt))}</Label>
								</Col>
							</Row>
							<Row style={{ marginTop: 10 }}>
								<Col xs={24}>
									<LabelGrey>TOTAL CAP: </LabelGrey><br/>
									<Label>{prettify(convertToETH(tokenData.totalSupply))} ETH | ${prettify(convertToUSD(tokenData.totalSupply))}</Label>
								</Col>
							</Row>
							<Row style={{ marginTop: 10 }}>
								<Col xs={24}>
									<LabelGrey>vBTC VALUE: </LabelGrey><br/>
									<Label> {convertToETH(1)} ETH | ${convertToUSD(1)}</Label>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			}
		</div>
	)
}