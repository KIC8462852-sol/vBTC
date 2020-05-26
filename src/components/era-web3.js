import React, { useState, useEffect } from 'react'

import { Row, Col } from 'antd'
import {  LabelGrey, Label, Center, Text, Gap, HR} from './components'
import {  vbtcContract } from '../client/web3.js'
import '../App.css';

export const EraWeb3 = () => {
    const [marketData, setMarketData] = useState(
        {priceUSD:'', priceETH:''})
    const [tokenData, setTokenData] = useState(
        {emission:'', currentBlock:'', nextEmission:'', totalBurnt:'', totalSupply:''})

    useEffect(() => {

        const loadBlockchainData = async () => {
		const contract_ = vbtcContract()
        const emission_ = await contract_.methods.emission().call()
        const currentBlock_ = await contract_.methods.currentBlock().call()
        const totalSupply_ = await contract_.methods.totalSupply().call()
        const totalBurnt_ = await contract_.methods.totalBurnt().call()
        const nextEmission_ = emission_ / 2

        setTokenData({
            emission:convertToNumber(emission_),
            currentBlock:currentBlock_,
            totalSupply:totalSupply_,
            totalBurnt:convertFromWei(totalBurnt_),
            nextEmission:convertToNumber(nextEmission_)})

    }

    const getMarketData = async () => {
        const priceUSD_ = 1.12
        const priceETH_ = 0.0045
        setMarketData({ priceUSD: priceUSD_, priceETH: priceETH_ })
    }

        loadBlockchainData()
        getMarketData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function convertToNumber(number){
        return number / 10 ** 8
    }

    function convertFromWei(number) {
		var num = number / 1000000000000000000
		return num.toFixed(2)
    }
    
    function convertToETH(vBTC) {
		return vBTC * marketData.priceETH
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
        <Center><Label margin={"20px 0px 0px"}>{prettify(tokenData.emission)} vBTC</Label></Center>
        <Center><LabelGrey margin={"0px 0px 20px"}>TO BE EMITTED</LabelGrey></Center>
        
        <Center><Label margin={"0px 0px"}>{convertToETH(tokenData.totalSupply)/ tokenData.totalSupply} ETH | ${prettify(convertToUSD(tokenData.totalSupply) / tokenData.totalSupply)}</Label></Center>
        <Center><LabelGrey margin={"0px 0px 20px"}>CURRENT COST PER VIRTUAL BITCOIN</LabelGrey></Center>

        <Gap />
        <Row> 
            <Col xs={21} sm={11}>
                <Row>
                    <Col xs={10}>
                        <LabelGrey>CURRENT BLOCK: </LabelGrey>
                    </Col>
                    <Col xs={14}>
                        <Label>{tokenData.currentBlock}</Label>
                    </Col>
                </Row>
            </Col>
            <Col xs={21} sm={13}>
            <Row>
                    <Col xs={10}>
                    <LabelGrey>CURRENT EMISSION: </LabelGrey>
                    </Col>
                    <Col xs={14}>
                        <Label>{tokenData.emission}</Label><Text size={14}> vBTC (per Block)</Text>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Gap />
        <HR />    
    </div>
    )
}