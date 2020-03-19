var virtualBitcoin = artifacts.require("./virtualBitcoin.sol");

contract('virtualBitcoin', function(accounts) {

  var coin
  var vbtcAddress
  var supply = 21000000_000000000000000000
  var acc0 = accounts[0]
  var acc1 = accounts[1]
  var acc2 = accounts[2]
  var acc3 = accounts[3]
  var acc4 = accounts[4]

  it("constructor events", async () => {
    let vBTC = artifacts.require("virtualBitcoin.sol");
    coin = await vBTC.new("21000000000000000000000000");
    vbtcAddress = coin.address;
    console.log("coin:", vbtcAddress) 
  });

  it("initializes the contract with the correct values", async () => {
    
    let name = await coin.name()
    assert.equal(name, "VirtualBitcoin", "correct name")

    let sym = await coin.symbol()
    assert.equal(sym, "vBTC", "correct symbol")

    let decimals = await  coin.decimals()
    assert.equal(decimals, 18, "correct decimals")
    
    let count = await coin.totalSupply()
    assert.equal(count, supply, "correct number")
  
    });

  it("initializes with correct balances", async () => {

    let bal = await coin.balanceOf(vbtcAddress)
    assert.equal(bal, 0, "correct coin bal")

    let bal1 = await coin.balanceOf(acc0)
    assert.equal(bal1, supply, "correct acc0 bal")

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


  it("it allows acc0 to transfer to acc1", async () => {

    let tx1 = await coin.transfer(acc1, '1000000000000000000', { from: acc0 })
    console.log(tx1);

    let bal0 = await coin.balanceOf(acc0);
    assert.equal(bal0, 20999999_000000000000000000, "correct coin bal");

    let bal1 = await coin.balanceOf(acc1);
    assert.equal(bal1, 1000000000000000000, "correct coin bal");
  });

}) 