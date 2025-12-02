// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

    contract Storage{
        uint256 num = 2;
        function retrieve() public view returns(uint256){
            return num;
        }
    }

    contract otherContract{
         Storage obj = new Storage();

         function returnValue () public view returns (uint){
            return obj.retrieve();
         }
    }