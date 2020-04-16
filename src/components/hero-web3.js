import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

import Web3 from 'web3';
import { VBTC_ADDR, VBTC_ABI } from '../client/web3.js'

import { Row, Col } from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import { LabelGrey, Label, Click } from './components'

export const vBTCTable = () => {
    const [loaded, setLoaded] = useState(null)
    const [tokenData, setTokenData] = useState(
        {name:'', symbol:'', totalSupply:'', genesis:''})
    const [emissionData, setEmissionData] = useState(
        {balance:'', totalBurnt:'', totalFees:''})
    const [marketData, setMarketData] = useState(
        {priceUSD:'', priceETH:'', ethPrice:''})

    useEffect(() => {

        const loadBlockchainData = async () => {
            const web3_ = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
            const contract_ = new web3_.eth.Contract(VBTC_ABI, VBTC_ADDR)

            const name_ = await contract_.methods.name().call()
            const symbol_ = await contract_.methods.symbol().call()
            const totalSupply_ = await contract_.methods.totalSupply().call()
            const genesis_ = "15 May 2020" //await contract_.methods.Genesis().call()
        
            setTokenData({
                name: name_,
                symbol:symbol_,
                totalSupply: convertFromWei(totalSupply_),
                genesis:convertToDate(genesis_)})
            
            const balance_ = await contract_.methods.balanceOf(VBTC_ADDR()).call()
            const totalBurnt_ = await contract_.methods.TotalBurnt().call()
            const totalEmitted_ = totalSupply_ - balance_
            const totalFees_ = await contract_.methods.TotalFees().call()
            setEmissionData({
                balance: convertFromWei(balance_),
                totalBurnt: convertFromWei(totalBurnt_),
                totalEmitted: convertFromWei(totalEmitted_),
                totalFees: convertFromWei(totalFees_)
            })

            const ethPrice_ = await getETHPrice()
            const emission_ = await contract_.methods.Emission().call()
            var priceETH_ = 0
            var priceUSD_ = 0

            if (totalEmitted_ === 0) {
                priceETH_ = (totalBurnt_ / emission_)
                priceUSD_ = priceETH_ * ethPrice_
            } else {
                priceETH_ = (totalBurnt_ / (totalEmitted_))
                priceUSD_ = priceETH_ * ethPrice_
            }
            setMarketData({
                priceUSD: priceUSD_,
                priceETH: priceETH_,
                ethPrice: ethPrice_
            })

            setLoaded(true)
        }

        loadBlockchainData()
    }, [])

    function convertFromWei(number) {
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
    const getETHPrice = async () => {
        const ethPrice = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
        return ethPrice.data.ethereum.usd
    }

    const getLink = useCallback(() => {
        const link = "https://etherscan.io/address/"
        const code = "#code"
        const linkFull = link.concat(VBTC_ADDR).concat(code)
        return linkFull
    }, [])

    return (
        <div>
        {!loaded && 
        <LoadingOutlined style={{marginLeft:20, fontSize:30}}/>
        }
        {loaded && 
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
            }
    </div>
    )
}