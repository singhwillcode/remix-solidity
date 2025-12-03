// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract Gtoken is IERC20 {
    error NotFounder();
    error ZeroAddress();
    error FrozenAddress();
    error AmountZero();
    error InsufficientBalance();
    error InsufficientAllowance();

    string public name = "Black Buddha Peace";
    string public symbol = "BBP";
    function decimals() public pure returns (uint8) { return 0; }
    address public immutable founder;
    uint256 public totalSupply;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowed;
    mapping(address => bool) private frozen;
    event Frozen(address indexed user);
    event Unfrozen(address indexed user);

    constructor() {
        founder = msg.sender;
        totalSupply = 50000;
        balances[founder] = totalSupply;
        emit Transfer(address(0), founder, totalSupply);
    }

   
    function balanceOf(address account) external view returns (uint256) { return balances[account]; }
    function allowance(address owner, address spender) external view returns (uint256) { return allowed[owner][spender]; }
    function isFrozen(address user) external view returns (bool) { return frozen[user]; }

   
    modifier onlyFounder() {
        if (msg.sender != founder) revert NotFounder();
        _;
    }

    function _checkNotFrozen(address from, address to) internal view {
        if (frozen[from] || frozen[to]) revert FrozenAddress();
    }


    function transfer(address recipient, uint256 amount) external returns (bool) {
        if (recipient == address(0)) revert ZeroAddress();
        _checkNotFrozen(msg.sender, recipient);
        if (amount == 0) revert AmountZero();

        uint256 fromBal = balances[msg.sender];
        if (fromBal < amount) revert InsufficientBalance();

        unchecked {
            balances[msg.sender] = fromBal - amount;
        }
        balances[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        if (spender == address(0)) revert ZeroAddress();
        if (frozen[msg.sender] || frozen[spender]) revert FrozenAddress();

        allowed[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) {
        if (sender == address(0) || recipient == address(0)) revert ZeroAddress();
        if (frozen[sender] || frozen[recipient] || frozen[msg.sender]) revert FrozenAddress();
        if (amount == 0) revert AmountZero();

        uint256 fromBal = balances[sender];
        if (fromBal < amount) revert InsufficientBalance();

        uint256 curAllowance = allowed[sender][msg.sender];
        if (curAllowance < amount) revert InsufficientAllowance();

        unchecked {
            allowed[sender][msg.sender] = curAllowance - amount;
            balances[sender] = fromBal - amount;
        }
        balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
        emit Approval(sender, msg.sender, allowed[sender][msg.sender]);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool) {
        if (spender == address(0)) revert ZeroAddress();
        if (frozen[msg.sender] || frozen[spender]) revert FrozenAddress();

        uint256 newAllowance = allowed[msg.sender][spender] + addedValue;
        allowed[msg.sender][spender] = newAllowance;
        emit Approval(msg.sender, spender, newAllowance);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool) {
        if (spender == address(0)) revert ZeroAddress();
        if (frozen[msg.sender] || frozen[spender]) revert FrozenAddress();

        uint256 cur = allowed[msg.sender][spender];
        if (cur < subtractedValue) revert InsufficientAllowance();

        uint256 newAllowance = cur - subtractedValue;
        allowed[msg.sender][spender] = newAllowance;
        emit Approval(msg.sender, spender, newAllowance);
        return true;
    }

    function tokenBurning(uint256 amount) public onlyFounder {
        if (amount == 0) revert AmountZero();

        uint256 bal = balances[founder];
        if (bal < amount) revert InsufficientBalance();

        unchecked {
            balances[founder] = bal - amount;
            totalSupply -= amount;
        }
        emit Transfer(founder, address(0), amount);
    }

    function burn(uint256 amount) external {
        if (amount == 0) revert AmountZero();
        if (frozen[msg.sender]) revert FrozenAddress();

        uint256 bal = balances[msg.sender];
        if (bal < amount) revert InsufficientBalance();

        unchecked {
            balances[msg.sender] = bal - amount;
            totalSupply -= amount;
        }
        emit Transfer(msg.sender, address(0), amount);
    }
    function burnFrom(address account, uint256 amount) external {
        if (account == address(0)) revert ZeroAddress();
        if (frozen[msg.sender] || frozen[account]) revert FrozenAddress();
        if (amount == 0) revert AmountZero();

        uint256 bal = balances[account];
        if (bal < amount) revert InsufficientBalance();

        uint256 curAllowance = allowed[account][msg.sender];
        if (curAllowance < amount) revert InsufficientAllowance();

        unchecked {
            allowed[account][msg.sender] = curAllowance - amount;
            balances[account] = bal - amount;
            totalSupply -= amount;
        }
        emit Approval(account, msg.sender, allowed[account][msg.sender]);
        emit Transfer(account, address(0), amount);
    }
    function freezeId(address user) public onlyFounder {
        if (user == address(0)) revert ZeroAddress();
        if (!frozen[user]) {
            frozen[user] = true;
            emit Frozen(user);
        }
    }

    function unfreezeId(address user) public onlyFounder {
        if (frozen[user]) {
            frozen[user] = false;
            emit Unfrozen(user);
        }
    }
}