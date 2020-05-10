import React, { useState, useEffect } from 'react'

import { EraWeb3 } from './era-web3'
import { Colour } from './styles'
import { H2, Subtitle,  Gap, LabelGrey, Click} from './components'


const Era = (props) => {

    const [safari, setSafari] = useState(null)
	useEffect(() => {
		var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		setSafari(isSafari)
	}, [])

    return (
        <div>
            <Gap />
			<H2>CURRENT BLOCK DATA</H2><br />
			<Subtitle>Today's emission of vBTC.</Subtitle>
            <Gap />
            
			{!safari &&
			<div>
				<EraWeb3 />
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
export default Era