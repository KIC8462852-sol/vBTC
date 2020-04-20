var virtualBitcoin = artifacts.require("./virtualBitcoin.sol");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

var coin; var vbtcAddress
var _1 = 10 ** 8
var decimals = 8;
var secondsPerBlock = 10 * 60; 
var Emission = 50*10**decimals;

var acc0; var acc1; var acc2;
var acc3; var acc4


contract('virtualBitcoin', function (accounts) {

  constructor(accounts)
  testParams()

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

function testParams() {
  it("initializes the contract with the correct values", async () => {

    let name = await coin.name()
    assert.equal(name, "VirtualBitcoin", "correct name")

    let sym = await coin.symbol()
    assert.equal(sym, "vBTC", "correct symbol")

    let decimals = await coin.decimals()
    assert.equal(decimals, decimals, "correct decimals")

    let count = await coin.totalSupply()
    assert.equal(count, Emission, "correct number")

    let _emission = await coin.Emission()
    assert.equal(_emission, Emission, "correct Emission")

    let _secondsPerBlock = await coin.secondsPerBlock()
    assert.equal(_secondsPerBlock, secondsPerBlock, "correct secondsPerBlock")

  });

  it("initializes with correct balances", async () => {

    let bal = await coin.balanceOf(vbtcAddress)
    assert.equal(bal, Emission, "correct coin bal")

    let bal1 = await coin.balanceOf(acc0)
    assert.equal(bal1, 0, "correct acc0 bal")

    let bal2 = await coin.balanceOf(acc1)
    assert.equal(bal2, 0, "correct acc1 bal")

    let bal3 = await coin.balanceOf(acc2)
    assert.equal(bal3, 0, "correct acc2 bal")
  })

  it("initializes with correct allowances", async () => {

    let all1 = await coin.allowance(acc0, acc1)
    assert.equal(all1, 0, "correct acc1 allowance")
    let all2 = await coin.allowance(acc0, acc2)
    assert.equal(all2, 0, "correct acc1 allowance")
  })
}