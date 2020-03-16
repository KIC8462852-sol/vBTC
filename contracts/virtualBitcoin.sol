pragma solidity >=0.5.0;

// ERC-20 Interface
interface ERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

//SafeMath library
library SafeMath {

        // SafeMath: Addition cannot overflow
        function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");

        return c;
    }
        // SafeMath: Subtraction cannot overflow
        function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        uint256 c = a - b;

        return c;
    }
        // SafeMath: Multiplication cannot overflow
        function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");

        return c;
    }
        // SafeMath: Division cannot overflow
        function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        uint256 c = a / b;

        return c;
    }

}

//Contract public variables
contract virtualBitcoin {

    using SafeMath for uint256;

    // Variables
    string public name = "VirtualBitcoin";
    string public symbol = "vBTC";
    string public standard = "vBTC Token v1.0";
    uint256 public totalSupply;

    // Mappings
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping (address => uint256 )) public allowance;

    // Transfer event defined
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Approval event defined
    event Approval(address indexed _owner, address indexed _spender,uint256 _value);

    // Set initial token supply
    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
        emit Transfer(address(0), msg.sender, _initialSupply);
    }
    //Transfer function
    // function transfer(address _to, uint256 _value) public returns (bool success) {
    //     return true;
    // }

}