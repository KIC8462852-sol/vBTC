import React, { useState, useEffect } from 'react'

import { ClaimWeb3 } from './claim-web3'

import Web3 from 'web3'
import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Row, Col, Input } from 'antd'
import { H2, Subtitle, Click, LabelGrey, Gap} from './components'

import '../App.css';

const Claim = (props) => {
	 
	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
			
			<Gap />
			<H2>CLAIM VIRTUAL BITCOIN</H2><br />
			<Subtitle>Claim your share of a previous day’s emission. </Subtitle>
			<Gap />
			{!safari &&
			<div>
				<ClaimWeb3 />
			</div>
			}

			{safari &&
				<div>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<br></br>
					<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: "#D09800", fontSize: 12 }}>Download Metamask</a></Click>
				</div>
			} 
	    </div>
	)
}

export default Claim
