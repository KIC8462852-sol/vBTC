var virtualBitcoin = artifacts.require("./virtualBitcoin.sol");

contract('virtualBitcoin', function(accounts) {

  var coin
  var vbtcAddress
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
      assert.equal(count, 21000000_000000000000000000, "correct number")
  
    });


}) 