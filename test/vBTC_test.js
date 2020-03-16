var virtualBitcoin = artifacts.require("./virtualBitcoin.sol");

contract('virtualBitcoin', function(accounts) {

    it('sets the total supply upon deployment', function() {
        return virtualBitcoin.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 21000000, 'sets the total suppply to 21 million');
        });
    });
}) 