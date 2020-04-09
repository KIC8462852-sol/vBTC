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
			<Subtitle>Today's emission of vBTC.</Subtitle>

			<Center><Label margin={"20px 0px 0px"}>{prettify(eraData.emission)} vBTC</Label></Center>
			<Center><LabelGrey margin={"0px 0px 20px"}>TO BE EMITTED</LabelGrey></Center>

			<Center><Label margin={"0px 0px"}>{eraData.nextDay}</Label></Center>
			<Center><LabelGrey margin={"0px 0px 20px"}>DAY CHANGE OVER</LabelGrey></Center>

			<Center><Label margin={"0px 0px"}>{prettify(eraData.currentBurn)} ETH | ${eraData.currentBurn * marketData.priceUSD}</Label></Center>
			<Center><LabelGrey margin={"0px 0px 20px"}>TOTAL VALUE BURNT TODAY</LabelGrey></Center>

            <Center><Label margin={"0px 0px"}>{eraData.emission / eraData.currentBurn} ETH | ${(eraData.emission / eraData.currentBurn) * marketData.priceUSD}</Label></Center>
			<Center><LabelGrey margin={"0px 0px 20px"}>CURRENT COST PER VIRTUAL BITCOIN</LabelGrey></Center>

			<Gap />
			<Row> 
                <Col xs={21} sm={11}>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>CURRENT DAY: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.day}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>CURRENT ERA: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.era}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
					    <LabelGrey>CURRENT EMISSION: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.emission}</Label><Text size={14}> vBTC (per day)</Text>
                        </Col>
                    </Row>
                    
                </Col>
                <Col xs={21} sm={13}>
                    <Row>
                        <Col xs={10}>
                            <LabelGrey>HALVING DATE: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{eraData.nextEra}</Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={10}>
					    <LabelGrey>NEXT EMISSION: </LabelGrey>
                        </Col>
                        <Col xs={14}>
                            <Label>{prettify(eraData.nextEmission)}</Label><Text size={14}> vBTC (per day)</Text>
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