import React, { useState, useEffect } from 'react'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'
import { Row, Col } from 'antd'

import {  LabelGrey, Label, Center, Text, Gap, HR} from './components'

import '../App.css';

export const EraWeb3 = () => {
    const [marketData, setMarketData] = useState(
        {priceUSD:'', priceETH:''})
    const [tokenData, setTokenData] = useState(
        {emission:'', currentBlock:'', nextEmission:'', totalBurnt:''})

    useEffect(() => {

        const loadBlockchainData = async () => {
        const web3_ = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
		const contract_ = new web3_.eth.Contract(VBTC_ABI(), VBTC_ADDR())
        const emission_ = await contract_.methods.emission().call()
        const currentBlock_ = await contract_.methods.currentBlock().call()
        //console.log(currentBlock_)
        const totalBurnt_ = await contract_.methods.totalBurnt().call()
        //console.log(totalBurnt_)
        const nextEmission_ = emission_ / 2

        setTokenData({
            emission:convertToNumber(emission_),
            currentBlock:currentBlock_,
            totalBurnt:convertToNumber(totalBurnt_),
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

    // function convertToDate(date){
    //     return new Date(1000 * date).toLocaleDateString("en-GB", { year: 'numeric', month: 'short', day: 'numeric' })
    // }

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

        <Center><Label margin={"0px 0px"}>{prettify(tokenData.currentBlock)} ETH | ${tokenData.currentBlock}</Label></Center>
        <Center><LabelGrey margin={"0px 0px 20px"}>TOTAL VALUE BURNT TODAY</LabelGrey></Center>

        <Center><Label margin={"0px 0px"}>{tokenData.emission / tokenData.totalBurnt} ETH | ${(tokenData.emission / tokenData.totalBurnt) * marketData.priceUSD}</Label></Center>
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
                        <Label>{tokenData.emission}</Label><Text size={14}> vBTC (per day)</Text>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Gap />
        <HR />
        
    </div>
    )
}