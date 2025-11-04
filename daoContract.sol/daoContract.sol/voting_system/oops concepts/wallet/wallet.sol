// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

/* 
   Wallet Smart Contract
   1. The address that deploys the contract becomes the owner.
   2. Owner can send ether to any EOA.
   3. Anyone can send ether to the contract (owner’s wallet).
   4. Owner can check the contract’s balance.
   5. Emit event whenever contract receives ether from an EOA.
*/

contract wallet {

    address payable public owner;

    constructor() {
        owner = payable(msg.sender); // whoever deploys is owner
    }

    // Event when ether is received into the contract
    event receiveEthInfo(address indexed sender, uint amount);

    // Special receive function (anyone can send ether to contract)
    receive() external payable {
        emit receiveEthInfo(msg.sender, msg.value);
    }

    // Owner sends ether FROM contract (piggy bank) TO a receiver
    function sendEth(address payable receiver, uint amount) external {
        require(msg.sender == owner, "Only owner can send");
        require(address(this).balance >= amount, "Not enough balance");
        receiver.transfer(amount);
    }

    // Owner can check contract (piggy bank) balance
    function checkBalance() external view returns(uint) {
        return address(this).balance;
    }
}
    