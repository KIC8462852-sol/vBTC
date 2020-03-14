pragma solidity >= 0.5.0;

contract ERC20 {
    string public name = "virtualBitcoin";
    string public symbol = "vBTC";
    string public standard = "vBTC Token v1.0";
    uint256 public totalSupply;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    


}