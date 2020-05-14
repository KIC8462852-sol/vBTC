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
    string public name = "Virtual Bitcoin";
    string public symbol = "vBTC";
    uint256 public decimals = 8;
    uint256 public override totalSupply;
    uint256 public totalFees;                                                             // Total fees from ether transactions
    uint256 public totalBurnt;                                                            // Total ether Burnt

    // Mappings
    mapping(address => uint256) public override balanceOf;                                // holds token balance 
    mapping(address => mapping(address => uint256)) public override allowance;            // includes *accounts approved to withdraw from a given account

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
        // Checks
        require(balanceOf[_from] >= _value, "Must not send more than Balance");           // Check if the sender has enough
        require( balanceOf[_to] + _value >= balanceOf[_to], "Balance Overflow");          // Check for overflow

        // Effects
        balanceOf[_from] -= _value;                                                       // Subtract from the sender    
        uint256 fee = _getFee(_from, _value);                                             // Call _getFee function
        balanceOf[_to] += _value - fee;                                                   // Deduct fee from recipient
        balanceOf[address(this)] += fee;                                                  // Add fee to this contract
        totalFees += fee;                                                                 // Add fee to total fees

        // Events
        emit Transfer(_from, _to, (_value - fee));                                        // Event Transfer
        if (_from != address(this)) {
            emit Transfer(_from, address(this), fee);                                     // Event Transfer
        }
    }

    function _getFee(address _from, uint256 _value) internal view returns (uint256 fee) {
        if (_from == address(this)) {                                                     // Check to see if it is contract address
            return 0;                                                                     // If it is return zero
        } else {
            return (_value / 1000);                                                       // Else get fee of 0.1%
        }                      
    }

    // Mint tokens
    function _mint(uint256 _bal, address _addr) internal {                                
        totalSupply += _bal;                                                              // add _bal to totalSupply
        balanceOf[_addr] += _bal;                                                         // add _bal to contrac address
        emit Transfer(address(0), _addr, _bal);                                           // Event Transfer
    }

    //##########################-VIRTUAL-BITCOIN-################################

    // Set initial token supply and mint to self
    constructor() public {
        genesis = now;                                                                    // Time stamp genesis
        secondsPerBlock = 1;                                                              // Set block time
        nextBlockTime = genesis + secondsPerBlock;                                        // Set next block time to be genesis + block time
        emission = 50 * 10**decimals;                                                     // Set emission 
        currentBlock = 0;                                                                 // Initialize current block to be zero
        mapBlockEmission[currentBlock] = emission;                                        // map emission to block 
        BurnAddress = 0xad44f81b4a9750C162F79fF0Ba5838967aF4C65d;                         // set Burn address
        _mint(emission, address(this));                                                   // call _mint function
    }
    
    // default payable
    receive() external payable {                                                          // Default fallback function 
        _updateEmission();
        _burnEther(msg.sender);
    }

    // Function to burn Ether, and burnt amount is recorded in that block
    function _burnEther(address _payer) internal {
        // Checks
        require(msg.value > 0, "value is zero");                                          // Requires message value to be greater than 0
        BurnAddress.transfer(msg.value);                                                  // Call transfer function to burn address

        // Effects
        uint256 unitsBurnt = msg.value;                                                   // Init variable and assign units burnt value
        mapBlockPayerUnits[currentBlock][_payer] = unitsBurnt;                            // Map payer and block 
        mapBlockTotalUnits[currentBlock] += unitsBurnt;
        totalBurnt += unitsBurnt;                                                         // Record total burnt 

        if (mapPayerBlocksContributed[_payer].length == 0) {                              // check to see if address has not contributed before
            mapPayerBlocksContributed[_payer].push(currentBlock);                         // if true push block
        } else {
            uint256 lastIndex = mapPayerBlocksContributed[_payer].length - 1;             // If false get last index in array
            uint256 lastBlock = mapPayerBlocksContributed[_payer][lastIndex];             // get last block pushed

            if (lastBlock != currentBlock) {                                              // check to see if last block is not equal to current block
                mapPayerBlocksContributed[_payer].push(currentBlock);                     // if true push current block
            }
        }

        // Events
        emit Burn(_payer, currentBlock, unitsBurnt);                                      // Emit event
    }

    function getBlocks() external view returns (uint256 blocks){                          // return length of array
        return mapPayerBlocksContributed[msg.sender].length;
    }

    function getBlockAtIndex(uint256 index) external view returns (uint256 blocks){       // take argument 'index' and returns index value
        return mapPayerBlocksContributed[msg.sender][index];
    }

    // > 1 block later, users can claim the VBTC back
    function withdraw(uint256 _block) external {                                          // withdraw tokens owed - takes 1 argument Block
        // Checks
        _updateEmission();                                                                // call update emision first
        if (_block < currentBlock) {                                                      // block must be less than current block
            // Effects
            uint256 tokensOwed = getShare(_block);                                        // return token share, assigns to uint256 tokensOwed
            mapBlockPayerUnits[_block][msg.sender] = 0;                                   // initializes array of msg.sender to zero
            // Actions
            _transfer(address(this), msg.sender, tokensOwed);                             // transfer function
            // Events
            emit Withdraw(msg.sender, _block, tokensOwed);                                // emit event
        }
    }

    function getShare(uint256 _block) public view returns (uint256 share) {
        uint256 unitsForPerson = mapBlockPayerUnits[_block][msg.sender];                  // set variable unitsForPerson
        if (unitsForPerson == 0 ){                                                        // If unitsForPerson is equal to zero return zero 
            return 0;
        } else {
            uint256 unitsTotal = mapBlockTotalUnits[_block];                              // else get units total
            uint256 tokensInBlock = mapBlockEmission[_block];                             // get tokens in block
            uint256 tokensOwed = (unitsForPerson * tokensInBlock) / unitsTotal;           // calculate share
            return tokensOwed;                                                            // return tokensowed
        }
    }

    // UpdateEmission
    function _updateEmission() internal {
        uint256 _time = now;                                                              // var _time is time now
        if (_time >= nextBlockTime) {                                                     // if _time is great than or equal to next block time
            currentBlock += 1;                                                            // increment block number by 1
            if ((currentBlock % 210000) == 0) {                                           // if (current block modulo 210,000) is equal to 0 
                emission = emission / 2;                                                  // then halve emission
            }
            mapBlockEmission[currentBlock] = emission;                                    // map current blocks emission
            nextBlockTime = nextBlockTime + secondsPerBlock;                              // define next block time
            _mint(emission, address(this));                                               // call _mint function
        }
    }
    //##########################-END-################################
}
