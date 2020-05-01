import React, { useEffect, useState } from 'react'

import { HeroWeb3 } from './hero-web3'

import { Row, Col } from 'antd'
import { H1, HR, Gap, Subtitle, LabelGrey, Click} from './components'
import { Abstract, Logo } from './content'

import '../App.css';

const Hero = () => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
			
			<Row>
				<Col xs={20}>
					<H1>VIRTUAL BITCOIN</H1>
					<br />
					<Subtitle>An Ethereum-based Bitcoin Asset</Subtitle> 

					<Row style={{marginRight:0}}>
						<Col xs={24} sm={24} >
							<Abstract></Abstract>
						</Col>
					</Row>
				</Col>
				<Col xs={4}>
						<Row style={{marginTop:20}}>
							<Logo></Logo>
						</Row>
				</Col>
			</Row>
			<Gap />

			{!safari &&
			<div>
				<HeroWeb3 />
			</div>
			}

			{safari &&
				<div>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<br></br>
					<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
				</div>
			}
			
			
			<Gap />
			<HR />
	    </div>
	)
}

export default Hero
