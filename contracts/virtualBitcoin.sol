pragma solidity >=0.5.0;


//SafeMath library
library SafeMath {

        // SafeMath: Addition overflow
        function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }
        // SafeMath: subtraction overflow
        function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }

}

//Contract public variables
contract virtualBitcoin {

    using SafeMath for uint256;
    string public name = "VirtualBitcoin";
    string public symbol = "vBTC";
    string public standard = "vBTC Token v1.0";
    uint256 public totalSupply;

    // Transfer event defined
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // Approval event defined
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping (address => uint256 )) public allowance;

    //Set initial token supply
    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
    //Transfer function
    // function transfer(address _to, uint256 _value) public returns (bool success) {
    //     require(balanceOf[msg.sender] >= _value);

    //     balanceOf[msg.sender] -= _value;
    //     balanceOf[_to] += _value;

    //     emit Transfer(msg.sender, _to, _value);

    //     return true;
    // }

}