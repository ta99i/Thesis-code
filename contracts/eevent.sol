// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract eevent {
    event ev(uint256 indexed e);
    uint256 public c = 0;

    function test() public {
        c++;
        emit ev(c);
    }
}
