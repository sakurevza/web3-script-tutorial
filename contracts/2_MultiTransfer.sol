// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @notice transfer tokens to multiple addresses
contract MultiTransfer {
    mapping(address => uint) failTransferList;

    /// @notice for erc20 tokens, first approve then transfer
    /// @param _token erc20 token address
    /// @param _addresses array of addresses
    /// @param _amounts array of amounts
    function multiTransferToken(
        address _token,
        address[] calldata _addresses,
        uint256[] calldata _amounts
    ) external {
        // check if the lengths of _addresses and _amounts are equal
        require(
            _addresses.length == _amounts.length,
            "Lengths of Addresses and Amounts NOT EQUAL"
        );
        IERC20 token = IERC20(_token);
        uint _amountSum = getSum(_amounts); // compute the total amounts
        // check if the allowance is enough
        require(
            token.allowance(msg.sender, address(this)) >= _amountSum,
            "Need Approve ERC20 token"
        );

        // for loop to transfer tokens
        for (uint256 i; i < _addresses.length; i++) {
            token.transferFrom(msg.sender, _addresses[i], _amounts[i]);
        }
    }

    /// @notice for eth
    function multiTransferETH(
        address payable[] calldata _addresses,
        uint256[] calldata _amounts
    ) public payable {
        // check if the lengths of _addresses and _amounts are equal
        require(
            _addresses.length == _amounts.length,
            "Lengths of Addresses and Amounts NOT EQUAL"
        );
        uint _amountSum = getSum(_amounts); // compute the total amounts
        // check if the incoming eth value is equal to the total amounts
        require(msg.value == _amountSum, "Transfer amount error");
        // for loop to transfer eth
        for (uint256 i = 0; i < _addresses.length; i++) {
            (bool success, ) = _addresses[i].call{value: _amounts[i]}("");
            if (!success) {
                failTransferList[_addresses[i]] = _amounts[i];
            }
        }
    }

    /// @notice withdraw from fail list
    function withdrawFromFailList(address _to) public {
        uint failAmount = failTransferList[msg.sender];
        require(failAmount > 0, "You are not in failed list");
        failTransferList[msg.sender] = 0;
        (bool success, ) = _to.call{value: failAmount}("");
        require(success, "Fail withdraw");
    }

    /// @notice helper function to get the sum of an array
    function getSum(uint256[] calldata _arr) public pure returns (uint sum) {
        for (uint i = 0; i < _arr.length; i++) sum = sum + _arr[i];
    }
}