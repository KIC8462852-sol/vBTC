import React from 'react';
import { Table } from "antd";

import  { Breakpoint } from 'react-socks';

import '../App.css';
import { H2 , Text, Center, Gap} from './components'
import { Abstract } from './content'
import { Columns, dataSource } from './vbtc_table'

const Whitepaper = (props) => {  

return (      
	<div> 
		<Gap />
		<H2>WHITEPAPER</H2>
		<br></br><br></br>

		<Text size={16} bold={'TRUE'}>Virtual Bitcoin: An Ethereum-based Bitcoin asset.</Text>

		<Breakpoint medium up>
			<div style={{marginLeft:0}}>
				<Abstract />
			</div>	
		</Breakpoint>

		<Breakpoint small down>
			<div style={{marginLeft:20}}>
				<Abstract />
			</div>	
		</Breakpoint>

		<br></br><br></br>
		
		<Text bold={'TRUE'}>Introduction</Text><br />
		<Text>
		When a new monetary asset is created the key problem is a matter of distribution - how to fairly distribute it
		to a wide number of participants such that anyone can acquire it and all units are distributed at-cost.
		Bitcoin's entire fixed-supply is being distrbuted fairly and at-cost, however Ethereum and the tokens 
		created on it have not undergone the same process.
		</Text><br /><br />

		<Text bold={'TRUE'}>Acquiring Virtual Bitcoin</Text><br />
		<Text>
		Virtual Bitcoin can only be acquired by destroying an asset with existing value, such as Ether.
		All assets are destroyed by sending them to an unspendable Ethereum address. 
		</Text><br /><br />

		<Text bold={'TRUE'}>Emission Period</Text><br />
		<Text>
		Virtual Bitcoin ...
		</Text><br /><br />

		<Text bold={'TRUE'}>Network Fee</Text><br />
		<Text>
		Each transaction of Virtual Bitcoin incurs a small fee of 0.1%, which is returned to the contract.
		</Text><br /><br />

		<Text bold={'TRUE'}>Stock-To-Flow</Text><br />
		<Text>
		Virtual Bitcoin begins with a stock-to-flow of 1 that doubles each Era.
		</Text><br /><br />

		<Text bold={'TRUE'}>Conclusion</Text><br />
		<Text>
		vBTC is an Ethereum-based asset that mimics Bitcoin’s properties of; scarcity, a self-managing asset that cannot be attacked, unforgeable costliness and permissionless distribution. 
		vBTC has implemented Proof-of-Burn (PoB), a substitute for Bitcoin's Proof-of-Work (PoW) a consensus mechanism used to protect the overall integrity of the network. 
		</Text><br /><br />

		<Text bold={'TRUE'}>References</Text><br />
		<Text>
		 
		</Text><br /><br />


		<Text bold={'TRUE'}>Appendix A - Emission Schedule</Text><br />
		<Text>
		The Emission Schedule is as follows:<br />
		</Text><br />
		<Table		
		columns={Columns}
		dataSource={dataSource}
		pagination={false}
		tableLayout={"auto"}
		bordered={true}
		align={"center"}
		size={"small"}
		scroll={{ y: 400 }}
		></Table>
		<Gap /> 
		<Gap />
    </div>
)}

export default Whitepaper
