var virtualBitcoin = artifacts.require("./virtualBitcoin.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');
var BigNumber = require('bignumber.js')

var coin; var vbtcAddress
var decimals = 8;
var _1 = 10 ** decimals
var gasLimit = 200000
var _1Eth = 10 ** 16
var _vBTC = 50
var Emission = 50*10**decimals;

var acc0; var acc1; var acc2;
var acc3; var acc4

let timeDelay = 1000
const delay = ms => new Promise(res => setTimeout(res, ms));

function BN2Int(bigNum) {
  return +(new BigNumber(bigNum)).toFixed()
}

function log(thing){
  return console.log(thing)
}

contract('virtualBitcoin', function (accounts) {

  constructor(accounts)
  testBurn(acc0, _1Eth)
  //testMint(acc0, _1Eth)
  testWithdraw(acc0, _1Eth)
  testTransfer(acc0, 1000)
}) 

function constructor(accounts) {
  acc0 = accounts[0]; acc1 = accounts[1]; acc2 = accounts[2]
  acc3 = accounts[3]; acc4 = accounts[4]

  it("constructor events", async () => {
    let vBTC = artifacts.require("virtualBitcoin.sol");
    coin = await vBTC.new();
    vbtcAddress = coin.address;
    console.log("coin:", vbtcAddress)
  });
}

function testBurn(_acc, _eth) {
  it("It tests to burn in Block 1", async () => {
    await delay(timeDelay)
    let tx = await web3.eth.sendTransaction({from: _acc, value:_eth, to:vbtcAddress, gasLimit:gasLimit})
    let _block = await coin.currentBlock()
    assert.equal(_block, 1,"block is correct")
    let _emission = await coin.emission()
    assert.equal(_emission, Emission,"Emission is correct")
    let _mapBlockEmission = await coin.mapBlockEmission(1)
    assert.equal(_mapBlockEmission, Emission,"Emission is correct")
    let totalSupply = await coin.totalSupply()
    assert.equal(totalSupply, 2*Emission,"TotalSupply is correct")
    let coinBal = await coin.balanceOf(vbtcAddress)
    assert.equal(coinBal, 2*Emission,"TotalSupply is correct")

    assert.equal(tx.logs.length, 2, "two event was triggered");
    // assert.equal(tx.logs[0].event, "Transfer", "Transfer was called");
    // assert.equal(tx.logs[0].args.value, Emission, "To is correct");
    // assert.equal(tx.logs[1].event, "Burn", "Burn was called");
    // assert.equal(tx.logs[1].args.units, _1Eth, "Units is correct");

  });

  it("check mappings", async () => {

    let tokensOwed = await coin.getShare(1)
    assert.equal(tokensOwed, Emission, "correct owed")
  })
}

// test withdraw function
function testWithdraw(_acc, _eth) {
  it("It tests to withdraw in Block 1", async () => {
    await delay(timeDelay)
    let tx = await web3.eth.sendTransaction({from: _acc, value:_eth, to:vbtcAddress, gasLimit:gasLimit})
    await delay(timeDelay)
    let _block = 1;
    var expectedBal = (BN2Int(_vBTC * _1))
    //assert.equal(_block, 2, " block is correct")
    
    let _emission = BN2Int(await coin.emission())
    assert.equal(_emission, expectedBal, "emission is correct")
    let _tokenbal = BN2Int(await coin.balanceOf(vbtcAddress))
    assert.equal(_tokenbal, _emission * 3, "token balance is correct")

    let tokensOwed = await coin.getShare(_block)
    assert.equal(tokensOwed, _emission, "correct owed")
    //log(BN2Int(tokensOwed)); log(_emission); log(_acc)

    let tx1 = await coin.withdraw(_block, _acc)
    assert.equal(tx1.logs.length, 3, "two events were triggered");
    assert.equal(BN2Int(tx1.logs[2].args.value), +tokensOwed, "withdraw amount is same as tokensOwed");

    let payerUnits= BN2Int(await coin.mapBlockPayerUnits(_block, _acc))
    //log(payerUnits); log(_block)
    assert.equal(payerUnits, 0, "mapping is correct")

})
}

function testTransfer(){
  // test transfer of acc0 sending 1000 units of vBTC to acc1 -> 999
  // test fee is charged of 1 unit
}

