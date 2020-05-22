import Web3 from 'web3'
import VBTC_ARTIFACT from '../artifacts/virtualBitcoin.json'

const VBTC_ABI = () => {
    return VBTC_ARTIFACT.abi
}

const VBTC_ADDR = () => {
    return VBTC_ARTIFACT.networks[5777].address
}

const getWeb3 = () => {
    return new Web3(Web3.givenProvider || "https://rinkeby.infura.io/v3/5ca4f3ac24e5424593dbb38fcbce3043")
}

const getAccounts = async (i) => {
    var web3_ = getWeb3()
    var accounts = await web3_.eth.getAccounts()
    return accounts[i]
}

const getBalance = async (acc) => {
    var bal_ = await getWeb3().eth.getBalance(acc)
    return bal_
}

const vbtcContract = () => {
    var abi_ = VBTC_ABI()
    var addr_ = VBTC_ADDR()
    var web3_ = getWeb3()
    return new web3_.eth.Contract(abi_, addr_)
}
const getTokenBalance = async (acc) => {
    var bal_ = await vbtcContract().methods.balanceOf(acc).call()
    return bal_
}

const setLink = () => {
    var link_ = "https://etherscan.io/tx/"
    return link_
}

export {
    VBTC_ABI,
    VBTC_ADDR,
    getWeb3,
    getAccounts,
    getBalance,
    vbtcContract,
    getTokenBalance,
    setLink
}