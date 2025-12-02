// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

    interface cal{
        function add(uint a , uint b ) external returns(uint);
         function sub(uint a , uint b ) external returns(uint);
    }

    contract calculator is cal{
         function add(uint a , uint b )  external pure returns(uint){
            return a+b;
         }

          function sub(uint a , uint b )  pure external returns(uint){
            return a-b;
          }
    }