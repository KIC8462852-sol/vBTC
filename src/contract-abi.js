import VBTC_ARTIFACT from './artifacts/virtualBitcoin.json'

export const VBTC_ABI = async () => {
    return VBTC_ARTIFACT.abi
}

export const VBTC_ADDR = async () => {
    return VBTC_ARTIFACT.networks[5777].address
}





