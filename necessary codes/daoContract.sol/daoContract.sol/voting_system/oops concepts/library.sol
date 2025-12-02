 // SPDX-License-Identifier: MIT
 pragma solidity >=0.7.0;

  library maths {
    function addition (uint a , uint b) public pure returns (uint){
        return a+b;
    }

    function subtraction (uint a , uint b) public pure returns (uint){
        return a-b;
    }
  }

  contract demo{

    using maths for uint256;
    function add(uint a , uint b) pure public returns (uint){
        return a.addition(b);
    }
         function sub(uint a , uint b) pure public returns (uint){
        return a.subtraction(b);
        
    }
  }