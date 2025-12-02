// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wallet {
    address payable public owner;

    event FundsReceived(address indexed from, uint256 amount);
    event FundsForwarded(address indexed from, address indexed to, uint256 amount);

    constructor() {
        owner = payable(msg.sender);
    }

    function sendEtherToOwner() public payable {
        require(msg.value > 0, "Must send some ether");
        
        // Forward funds to owner
        owner.transfer(msg.value);

        // Log who sent and how much
        emit FundsReceived(msg.sender, msg.value);
        emit FundsForwarded(msg.sender, owner, msg.value);
    }
}
