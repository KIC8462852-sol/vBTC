pragma solidity >=0.5.0;


// ERC-20 Interface
interface ERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount)
        external
        returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
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
    function sub(uint256 a, uint256 b, string memory errorMessage)
        internal
        pure
        returns (uint256)
    {
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
    function div(uint256 a, uint256 b, string memory errorMessage)
        internal
        pure
        returns (uint256)
    {
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
    uint256 public decimals = 8;
    uint256 public totalSupply;

    // Mappings
    mapping(address => uint256) public balanceOf; // holds token balance of each owner account
    mapping(address => mapping(address => uint256)) public allowance; // includes *accounts approved to withdraw from a given account

    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    uint256 public Genesis;
    uint256 public nextBlockTime;
    uint256 public secondsPerBlock;
    uint256 public Emission;
    uint256 public Block;
    address payable public BurnAddress;

    mapping(uint256 => mapping(address => uint256)) public mapBlockPayerUnits;
    mapping(uint256 => uint256) public mapBlockTotalUnits;
    mapping(uint256 => uint256) public mapBlockEmission;
    mapping(address => uint256[]) public mapPayerBlocksContributed;

    event Burn(address indexed from, uint256 units);
    event Withdraw(address indexed to, uint256 value);

    //##########################-ERC-20-################################

    // Transfer tokens (send `_value` tokens to `_to` from your account)
    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    // Set allowance for another address | allows spender to spend no more than `_value` tokens on my behalf
    function approve(address _spender, uint256 _value)
        public
        returns (bool success)
    {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // Transfer from another address
    function transferFrom(address _from, address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(_value <= allowance[_from][msg.sender], "it failed");
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    // Internal transfer, can only be called by this contract
    function _transfer(address _from, address _to, uint256 _value) internal {
        // Check if the sender has enough
        require(balanceOf[_from] >= _value, "Must not send more than Balance");
        // Check for overflows
        require(
            balanceOf[_to].add(_value) >= balanceOf[_to],
            "Balance Overflow"
        );
        // Saving this for an assertion in the future
        uint256 previousBalances = balanceOf[_from] + balanceOf[_to];
        //  Subtract from the sender
        balanceOf[_from] -= _value;
        // Add to the recipient
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        // Using an assert to find bugs in my code. This should never fail
        assert(balanceOf[_from].add(balanceOf[_to]) == previousBalances);
    }

    // Mint tokens
    function _mint(uint256 _bal, address _addr) internal {
        totalSupply += _bal;
        balanceOf[_addr] += _bal;
        emit Transfer(address(0), _addr, _bal);
    }

    //##########################-VIRTUAL-BITCOIN-################################

    // Set initial token supply and mint to self
    constructor() public {
        Genesis = now;
        secondsPerBlock = 1;
        nextBlockTime = Genesis + secondsPerBlock;
        Emission = 50 * 10**decimals;
        Block = 0;
        mapBlockEmission[Block] = Emission;
        BurnAddress = 0xad44f81b4a9750C162F79fF0Ba5838967aF4C65d;
        _mint(Emission, address(this));
    }

    // creates contract

    // people send ether to burn
    // default payable
    function() external payable {
        _updateEmission();
        _burnEther(msg.sender);
    }

    // ether is burnt, and burnt amount is recorded in that block
    function _burnEther(address _payer) internal {
        // Checks
        require(msg.value > 0, "value is zero");
        BurnAddress.transfer(msg.value);

        // Effects
        uint256 unitsBurnt = msg.value;
        mapBlockPayerUnits[Block][_payer] = unitsBurnt;
        mapBlockTotalUnits[Block] += unitsBurnt;

        if (mapPayerBlocksContributed[_payer].length == 0) {
            mapPayerBlocksContributed[_payer].push(Block);
        } else {
            uint256 lastIndex = mapPayerBlocksContributed[_payer].length - 1;
            uint256 lastBlock = mapPayerBlocksContributed[_payer][lastIndex];

            if (lastBlock != Block) {
                mapPayerBlocksContributed[_payer].push(Block);
            }
        }

        // Actions

        // Events
        emit Burn(_payer, unitsBurnt);
    }

    // >1 block later, users can claim the VBTC back
    function withdraw(uint256 _block, address _payer) public {
        // Checks
        _updateEmission();
        if (_block < Block) {
            // Effects
            uint256 tokensOwed = getShare(_block);
            mapBlockPayerUnits[_block][_payer] = 0;
            // Actions
            require(
                transfer(msg.sender, tokensOwed),
                "data transfer from sender/tokens owed was not recieved"
            );
            // Events
            emit Withdraw(msg.sender, tokensOwed);
        }
    }

    function getShare(uint256 _block) public view returns (uint256 share) {
        uint256 unitsForPerson = mapBlockPayerUnits[_block][msg.sender];
        uint256 unitsTotal = mapBlockTotalUnits[_block];
        uint256 tokensInBlock = mapBlockEmission[_block];
        uint256 tokensOwed = (unitsForPerson * tokensInBlock) / unitsTotal;
        return tokensOwed;
    }

    // UpdateEmission
    function _updateEmission() public {
        uint256 _time = now;

        if (_time >= nextBlockTime) {
            Block += 1;
            if (Block % (210000) == 0) {
                Emission = Emission / 2;
            }
            mapBlockEmission[Block] = Emission;
            nextBlockTime = nextBlockTime + secondsPerBlock;
            _mint(Emission, address(this));
        }
    }

    //##########################-END-################################
}
