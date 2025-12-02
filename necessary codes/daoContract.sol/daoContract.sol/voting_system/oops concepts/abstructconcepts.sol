// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0;

    abstract contract cal{
    
        function add( uint a , uint b ) public virtual returns(uint) ;
        function sub(uint a , uint b ) public virtual returns(uint);
    }

        contract child is cal{
             function add( uint a , uint b ) public pure override  returns(uint){
                return a+b;
             }
             function sub(uint a , uint b ) public pure override returns(uint){
                return a-b;
            }
        }