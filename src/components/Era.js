import React, { useState, useEffect } from 'react'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Row, Col } from 'antd'
import { H2, Subtitle, Text, Center, Label, LabelGrey, HR, Gap} from './components'

const Era = (props) => {

	const [marketData, setMarketData] = useState(
		{priceUSD:'', priceETH:''})
	const [eraData, setEraData] = useState(
		{era:'', day:'', emission:'', currentBurn:'', nextDay:'', nextEra:'', nextEmission:''})

	useEffect(() => {

		const loadBlockchainData = async () => {
		const emission_ = 5000000000
		const day_ = 12
		const era_ = 1
		const currentBurn_ = 10000000000
		const nextDay_ = "16 May 2020"
		const nextEra_ = "15 May 2024"
		const nextEmission_ = 2500000000
		setEraData({
			era:era_, day:day_,
			emission:convertToNumber(emission_),
			currentBurn:convertToNumber(currentBurn_),
			nextDay:convertToDate(nextDay_), nextEra:convertToDate(nextEra_),
			nextEmission:convertToNumber(nextEmission_)})
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
        return number / 100000000
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

    return (
        <div>
            <Gap />
			<H2>CURRENT ERA</H2><br />
			<Subtitle>Today's Contract Interaction Data</Subtitle>
            <Gap />
            <Row style={{marginLeft:20}}>
            <Col xs={21} sm={13} lg={13}>
                    <Row style={{marginTop:10}}>
                        <Col xs={10}>
                            <LabelGrey>TOTAL VALUE BURNT TODAY: </LabelGrey>
                        </Col>
                        <Col xs={10}>
                            <Label>{prettify(eraData.currentBurn)} ETH | ${eraData.currentBurn * marketData.priceUSD}</Label>
                        </Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col xs={10}>
                            <LabelGrey>CURRENT COST PER VIRTUAL BITCOIN: </LabelGrey>
                        </Col>
                        <Col xs={10}>
                        <Label >{eraData.emission / eraData.currentBurn} ETH | ${(eraData.emission / eraData.currentBurn) * marketData.priceUSD}</Label>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Gap />
            <Subtitle>Today's emission data of vBTC</Subtitle>
            <Gap />
			<Row style={{marginLeft:20}}>
            <Col xs={21} sm={11} lg={11}>
                <Row style={{marginTop:10}}>
                        <Col xs={6}>
                            <LabelGrey>CURRENT ERA: </LabelGrey>
                        </Col>
                        <Col xs={18}>
                            <Label>{eraData.era}</Label>
                        </Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col xs={6}>
                            <LabelGrey>CURRENT DAY: </LabelGrey>
                        </Col>
                        <Col xs={18}>
                            <Label>{eraData.day}</Label>
                        </Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col xs={6}>
                            <LabelGrey>TO BE EMMITTED: </LabelGrey>
                        </Col>
                        <Col xs={18}>
                            <Label>{prettify(eraData.emission)} vBTC</Label>
                        </Col>
                    </Row>                   
                </Col>
                <Col xs={21} sm={13} lg={13}>
                <Row style={{marginTop:10}}>
                        <Col xs={6}>
                            <LabelGrey>DAY CHANGE OVER: </LabelGrey>
                        </Col>
                        <Col xs={18}>
                            <Label>{eraData.nextDay}</Label>
                        </Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col xs={6}>
                            <LabelGrey>HALVING DATE: </LabelGrey>
                        </Col>
                        <Col xs={18}>
                            <Label>{eraData.nextEra}</Label>
                        </Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col xs={6}>
					    <LabelGrey>NEXT EMISSION: </LabelGrey>
                        </Col>
                        <Col xs={18}>
                            <Label>{prettify(eraData.nextEmission)}<Text size={14}> vBTC (per day)</Text></Label>
                        </Col>
                    </Row>
                </Col>
			</Row>
			<Gap />
			<HR />
            
        </div>           
    )
}
export default Era