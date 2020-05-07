import React, { useState, useEffect } from 'react'

import { AcquireWeb3 } from './acquire-web3'

// import Web3 from 'web3'
// import { VBTC_ABI, VBTC_ADDR } from '../contract-abi'

import { Colour } from './styles'

import { H2, Subtitle, LabelGrey,  Click, Text, Gap} from './components'

import '../App.css';

const Acquire = (props) => {

	const [safari, setSafari] = useState(null)

	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

	return (
		<div>
			
			<Gap />
			<H2>ACQUIRE VIRTUAL BITCOIN</H2><br />
			<Subtitle>Acquire a share of today’s emission by burning Ether.</Subtitle>
			<br />
			<Text>Provably destroy capital to acquire a fair share. Capital is measured in units of Ether after burning.</Text><br />
			<Gap />

			{!safari &&
			<div>
				<AcquireWeb3 />
			</div>
			}

			{safari &&
				<div>
					<LabelGrey>Sending Ethereum transactions requires Chrome and Metamask</LabelGrey>
					<br></br>
					<Click><a href='https://metamask.io' rel="noopener noreferrer" title="Metamask Link" target="_blank" style={{ color: Colour().tan, fontSize: 12 }}>Download Metamask</a></Click>
				</div>
			}
        </div>  
	)
}

export default Acquire
