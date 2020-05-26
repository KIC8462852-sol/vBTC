import React from 'react'

import { Text } from './components'
import icon from '../assets/VBTC-logo.svg';
import { Colour } from './styles';

export const Abstract = () => {
	return (
	<Text>
		Virtual Bitcoin (vBTC) is designed to mimic Bitcoin with properties of strict scarcity,
		unforgeable costliness and Bitcoin's emission schedule. vBTC allows participants to compete to expend capital to acquire
		newly-minted coins and chase ever-decreasing margins.  Instead of expending capital through Proof-of-Work (PoW)
		vBTC participants purchase it by destroying capital on-chain.
		As a result, all units of vBTC are acquired at-cost and by anyone.
		This is a consensus mechanism called Proof-of-Burn (PoB).
	</Text>
  )
}

export const Logo = () => {
	return (
	<img src={icon} alt="vbtc-logo" height={100} style={{marginLeft:40, marginRight:40}}/>
	)
}

export const Links = () => {
	const linkStyles = {
		color: Colour().blue, 
		fontSize:16,
		fontWeight: "bold"
	}

	return (
		<div>
			<span style={{marginLeft:20}}><a href="https://twitter.com/" rel="noopener noreferrer" title="Twitter Link" target="_blank" style={linkStyles}>TWITTER</a></span>
			<span style={{marginLeft:20}}><a href="https://github.com/KIC8462852-sol/vBTC" rel="noopener noreferrer" title="Github Link" target="_blank" style={linkStyles}>GITHUB</a></span>
			<span style={{marginLeft:20}}><a href="https://bitcointalk.com/" rel="noopener noreferrer" title="BitcoinTalk Link" target="_blank" style={linkStyles}>BITCOINTALK</a></span>
			<span style={{marginLeft:20}}><a href="https://reddit.com/" rel="noopener noreferrer" title="Reddit Link" target="_blank" style={linkStyles}>REDDIT</a></span>
		</div>
	)
}
