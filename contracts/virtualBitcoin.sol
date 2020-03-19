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

// SafeMath library
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

// Contract public variables
contract virtualBitcoin {

    using SafeMath for uint256;

    // Variables
    string public name = "VirtualBitcoin";
    string public symbol = "vBTC";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    // Mappings
    mapping(address => uint256) public _balanceOf; // holds token balance of each owner account
    mapping(address => mapping (address => uint256 )) public _allowance; // includes *accounts approved to withdraw from a given account

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed _owner, address indexed _spender,uint256 _value);

    // Set initial token supply and mint to self
    constructor(uint256 _initialSupply) public {
        _mint(_initialSupply, address(msg.sender));
    }

    // Checks the amount of tokens that an owner allowed to a spender
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return _allowance[_owner][_spender];
    }

    // Returns balance of specified address
    function balanceOf(address _owner) public view returns (uint256 _value) {
        return _balanceOf[_owner];
    }

    // Transfer tokens (send `_value` tokens to `_to` from you account)
    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

        // Set allowance for another address | allows spender to spend no more than `_value` tokens on my behalf
    function approve(address _spender, uint256 _value) public returns (bool success) {
        _allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer from another address
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= _allowance[_from][msg.sender], "it failed");
        _allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

        // Internal transfer, can only be called by this contract
    function _transfer(address _from, address _to, uint256 _value) internal {
        // Check if the sender has enough
        require(_balanceOf[_from] >= _value, "balance is lower");
        // Check for overflows
        require(_balanceOf[_to].add(_value) >= _balanceOf[_to], "Over flow error");
        // Saving this for an assertion in the future
        uint previousBalances = _balanceOf[_from] + _balanceOf[_to];
        //  Subtract from the sender
        _balanceOf[_from] -= _value;
        // Add to the recipient
        _balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Using an assert to find bugs in my code. This should never fail
        assert(_balanceOf[_from].add(_balanceOf[_to]) == previousBalances);
    }

    // Destroy tokens - maybe function burn?

    // Mint tokens
    function _mint(uint256 _bal, address _addr) internal {
        totalSupply += _bal;
        _balanceOf[_addr] += _bal;
        emit Transfer(address(0), _addr, _bal);
    }

}