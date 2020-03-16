var virtualBitcoin = artifacts.require("./virtualBitcoin.sol");

module.exports = function(deployer) {
    deployer.deploy(virtualBitcoin, 21000000);
};    