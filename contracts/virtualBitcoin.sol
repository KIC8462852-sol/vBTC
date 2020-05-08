pragma solidity 0.6.4;

// ERC-20 Interface
interface ERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval( address indexed owner, address indexed spender, uint256 value );
}

// SafeMath library
library SafeMath {
    // SafeMath: Addition cannot overflow
    function add(uint256 a, uint256 b) internal pure returns (uint256) { uint256 c = a + b; 
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    // // SafeMath: Subtraction cannot overflow
    // function sub(uint256 a, uint256 b, string memory errorMessage) internal pure
    //     returns (uint256) { require(b <= a, errorMessage); uint256 c = a - b; return c;}

    // // SafeMath: Multiplication cannot overflow
    // function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    //     if (a == 0) { return 0; } uint256 c = a * b; require(c / a == b, "SafeMath: multiplication overflow"); return c;}

    // // SafeMath: Division cannot overflow
    // function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256)
    // { require(b > 0, errorMessage); uint256 c = a / b; return c; }
}

// Contract public variables
contract virtualBitcoin is ERC20 {
    using SafeMath for uint256;

    // Variables
    string public name = "VirtualBitcoin";
    string public symbol = "vBTC";
    uint256 public decimals = 8;
    uint256 public override totalSupply;
    uint256 public totalFees;                                                   // Total fees from
    uint256 public totalBurnt;                                                  // Total ether Burnt

    // Mappings
    mapping(address => uint256) public override balanceOf;                      // holds token balance of each owner account
    mapping(address => mapping(address => uint256)) public override allowance;  // includes *accounts approved to withdraw from a given account

    uint256 public genesis;
    uint256 public nextBlockTime;
    uint256 public secondsPerBlock;
    uint256 public emission;
    uint256 public currentBlock;
    address payable public BurnAddress;

    mapping(uint256 => mapping(address => uint256)) public mapBlockPayerUnits;
    mapping(uint256 => uint256) public mapBlockTotalUnits;
    mapping(uint256 => uint256) public mapBlockEmission;
    mapping(address => uint256[]) public mapPayerBlocksContributed;

    event Burn(address indexed from, uint256 block, uint256 units);
    event Withdraw(address indexed to, uint256 block, uint256 value);

    //##########################-ERC-20-################################

    // Transfer tokens (send `_value` tokens to `_to` from your account)
    function transfer(address to, uint256 value) public override returns (bool success){
        _transfer(msg.sender, to, value);
        return true;
    }

    // Set allowance for another address | allows spender to spend no more than `_value` tokens on my behalf
    function approve(address spender, uint256 value) public override returns (bool success){
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    // Transfer from another address
    function transferFrom(address from, address to, uint256 value) public override returns (bool success) {
        require(value <= allowance[from][msg.sender], "it failed");
        allowance[from][msg.sender] -= value;
        _transfer(from, to, value);
        return true;
    }

    // Internal transfer, can only be called by this contract
    function _transfer(address _from, address _to, uint256 _value) internal {
        require(balanceOf[_from] >= _value, "Must not send more than Balance");          // Check if the sender has enough
        require( balanceOf[_to] + _value >= balanceOf[_to], "Balance Overflow");        // Check for overflows
        balanceOf[_from] -= _value;                                                      // Subtract from the sender    
        uint256 fee = _getFee(_from, _value);       
        balanceOf[_to] += _value- fee;                                                   // Deduct fee from recipient
        balanceOf[address(this)] += fee;                                                   // Add fee to this contract
        totalFees += fee;
        emit Transfer(_from, _to, (_value - fee));
        if (_from != address(this)) {
            emit Transfer(_from, address(this), fee);
        }
    }

    function _getFee(address _from, uint256 _value) internal view returns (uint256 fee) {
        if (_from == address(this)) {
            return 0;
        } else {
            return (_value / 1000);                                                       // Get fee of 0.1%
        }                      
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
        genesis = now;
        secondsPerBlock = 600;
        nextBlockTime = genesis + secondsPerBlock;
        emission = 50 * 10**decimals;
        currentBlock = 0;
        mapBlockEmission[currentBlock] = emission;
        BurnAddress = 0xad44f81b4a9750C162F79fF0Ba5838967aF4C65d;
        _mint(emission, address(this));
    }
    
    // default payable
    receive() external payable {
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
        mapBlockPayerUnits[currentBlock][_payer] = unitsBurnt;
        mapBlockTotalUnits[currentBlock] += unitsBurnt;
        totalBurnt += unitsBurnt;

        if (mapPayerBlocksContributed[_payer].length == 0) {
            mapPayerBlocksContributed[_payer].push(currentBlock);
        } else {
            uint256 lastIndex = mapPayerBlocksContributed[_payer].length - 1;
            uint256 lastBlock = mapPayerBlocksContributed[_payer][lastIndex];

            if (lastBlock != currentBlock) {
                mapPayerBlocksContributed[_payer].push(currentBlock);
            }
        }

        // Events
        emit Burn(_payer, currentBlock, unitsBurnt);
    }

    function getBlocks() external view returns (uint256 blocks){
        return mapPayerBlocksContributed[msg.sender].length;
    }

    function getBlockAtIndex(uint256 index) external view returns (uint256 blocks){
        return mapPayerBlocksContributed[msg.sender][index];
    }

    // >1 block later, users can claim the VBTC back
    function withdraw(uint256 _block) external {
        // Checks
        _updateEmission();
        if (_block < currentBlock) {
            // Effects
            uint256 tokensOwed = getShare(_block);
            mapBlockPayerUnits[_block][msg.sender] = 0;
            // Actions
            _transfer(address(this), msg.sender, tokensOwed);
            // Events
            emit Withdraw(msg.sender, _block, tokensOwed);
        }
    }

    function getShare(uint256 _block) public view returns (uint256 share) {
        uint256 unitsForPerson = mapBlockPayerUnits[_block][msg.sender];            // set variable unitsForPerson
        if (unitsForPerson == 0 ){                                                  // If unitsForPerson is equal to zero return 0 
            return 0;
        } else {
            uint256 unitsTotal = mapBlockTotalUnits[_block];                        // else get units total
            uint256 tokensInBlock = mapBlockEmission[_block];                       // get tokens in block
            uint256 tokensOwed = (unitsForPerson * tokensInBlock) / unitsTotal;     // calculate share
            return tokensOwed;                                                      // return tokensowed
        }
    }

    // UpdateEmission
    function _updateEmission() internal {
        uint256 _time = now;                                        // var _time is time now
        if (_time >= nextBlockTime) {                               // if _time is great than or equal to next block time
            currentBlock += 1;                                      // increment block number by 1
            if ((currentBlock % 210000) == 0) {                     // if (current block modulo 210,000) is equal to 0 
                emission = emission / 2;                            // then halve emission
            }
            mapBlockEmission[currentBlock] = emission;              // map current blocks emission
            nextBlockTime = nextBlockTime + secondsPerBlock;        // define next block time
            _mint(emission, address(this));                         // call _mint function
        }
    }
    //##########################-END-################################
}
