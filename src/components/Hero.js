import React from 'react'
import { Row, Col } from 'antd'
import { H1, HR, Gap, Subtitle} from './components'
import { Abstract, Logo } from './content'
import { vBTCTable} from './hero-web3'

import '../App.css';

const Hero = (props) => {
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
							<Row style={{marginRight:0}}>
								<Logo></Logo>
							</Row>
					</Col>
				</Row>
				<Gap />
				<vBTCTable></vBTCTable>
				<Gap />
				<HR />
			</div>
		)
	}
export default Hero