// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

bytes32 constant MINTER_ROLE = keccak256("MINTER_ROLE");

contract MyERC20 is ERC20, AccessControl {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
     
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}