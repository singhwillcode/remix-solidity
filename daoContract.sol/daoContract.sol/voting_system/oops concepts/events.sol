// SPDX-License-Identifier: MIT
pragma solidity >= 0.7.0;

     contract demo{
        event sendEthInformation(address sender, address receiver, uint amount);

        function sendEth(address payable receiver) public payable{
            receiver.transfer(msg.value);
             emit sendEthInformation(msg.sender, receiver, msg.value);
        }

    //    function sendEth ( address payable receiver) public payable returns( address , address , uint){
    //     receiver.transfer(msg.value);
    //     return (msg.sender, receiver , msg.value);
    //    }
     }

     