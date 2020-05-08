var virtualBitcoin = artifacts.require("./virtualBitcoin.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');
var BigNumber = require('bignumber.js')

var coin; var vbtcAddress
var decimals = 8;
var _1 = 10 ** decimals; var _1Eth = 10 ** 16
var Emission = 50*10**decimals;
var gasLimit = 200000
var _vBTC50 = 50; var _vBTC1k = 1000

var acc0; var acc1; var acc2;

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
  testWithdraw(acc0, _1Eth)
  testTransfer(acc0, _1Eth)
  testBurnQuick(acc0, _1Eth)
  testBurnQuick(acc0, _1Eth)
}) 

function constructor(accounts) {
  acc0 = accounts[0]; acc1 = accounts[1]; acc2 = accounts[2]
  acc3 = accounts[3]; acc4 = accounts[4]

  it("constructor events", async () => {
    let _vBTC1k = artifacts.require("virtualBitcoin.sol");
    coin = await _vBTC1k.new();
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

    let blocksContributed = BN2Int(await coin.getBlocks({from: _acc}))
    console.log('blocksContributed', blocksContributed)
    for (var i = 0; i<blocksContributed; i++){
      let blockIndex = BN2Int(await coin.getBlockAtIndex(i, {from: _acc}))
      console.log('blockIndex', blockIndex)
    }

    let blocksContributed1 = BN2Int(await coin.getBlocks({from: acc1}))
    console.log('blocksContributed1', blocksContributed1)
  })
}

function testBurnQuick(_acc, _eth){
  it("tests blockContributed", async () => {

    await delay(timeDelay)
    let tx = await web3.eth.sendTransaction({from: _acc, value:_eth, to:vbtcAddress, gasLimit:gasLimit})

    let blocksContributed = BN2Int(await coin.getBlocks({from: _acc}))
    console.log('blocksContributed', blocksContributed)

    for (var i = 0; i<blocksContributed; i++){
      let blockIndex = BN2Int(await coin.getBlockAtIndex(i, {from: _acc}))
      console.log('blockIndex', blockIndex)
    }

    let blocksContributed1 = BN2Int(await coin.getBlocks({from: acc1}))
    console.log('blocksContributed1', blocksContributed1)

  })
}

// test withdraw function
function testWithdraw(_acc, _eth) {
  it("It tests to withdraw in Block 1", async () => {
    await delay(timeDelay)
    let _block = 1;
    var expectedBal = (BN2Int(_vBTC50 * _1))
    
    let _emission = BN2Int(await coin.emission())
    assert.equal(_emission, expectedBal, "emission is correct")
    let _tokenbal = BN2Int(await coin.balanceOf(vbtcAddress))
    assert.equal(_tokenbal, _emission * 2, "token balance is correct")
    let currentBlock = await coin.currentBlock()
    console.log('currentBlock', currentBlock)

    let tokensOwed = await coin.getShare(_block)
    assert.equal(tokensOwed, _emission, "correct owed")

    let tx1 = await coin.withdraw(_block)
    assert.equal(tx1.logs.length, 3, "two events were triggered");
    assert.equal(BN2Int(tx1.logs[2].args.value), +tokensOwed, "withdraw amount is same as tokensOwed");
    let payerUnits= BN2Int(await coin.mapBlockPayerUnits(_block, _acc))
    assert.equal(payerUnits, 0, "mapping is correct")
})
}

function testTransfer(_acc, _eth){
  // test transfer of acc0 sending 1000 units of _vBTC1k to acc1 -> 999
  it(" It tests transfer of acc0 sending 1000 units to acc2", async () => {
    await delay(timeDelay)
    await coin.transfer(acc2, _vBTC1k, {from:_acc})
    var expectedTokenBalance = _vBTC1k-1;
    let balAcc2 = await coin.balanceOf(acc2)
    assert.equal(balAcc2, expectedTokenBalance, "the balances match")
    var expectedFee = 1;
    let getfee = BN2Int(await coin.totalFees())
    assert.equal(getfee, expectedFee, "fee is correct")
  })
  it(" It tests approve/transferFrom to acc1", async () => {
    await coin.approve(_acc, _vBTC1k, {from:_acc});
    await coin.transferFrom(_acc, acc1, _vBTC1k, {from:_acc})
    var expectedTokenBalance = _vBTC1k-1;
    let balAcc1 = await coin.balanceOf(acc1)
    assert.equal(balAcc1, expectedTokenBalance, "the balances match")
    var expectedFee2 = 2;
    let getfee2 = BN2Int(await coin.totalFees())
    assert.equal(getfee2, expectedFee2, "fee is correct")
  })
}

