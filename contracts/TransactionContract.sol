// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionLedger {
    struct Transaction {
        string transactionType;
        int256 amount;
        string buyer;
        string seller;
        uint256 timestamp;
    }

    Transaction[] private transactions;

    event TransactionRecorded(
        string transactionType,
        int256 amount,
        string buyer,
        string seller,
        uint256 timestamp
    );

    function recordTransaction(
        string memory _transactionType,
        int256 _amount,
        string memory _buyer,
        string memory _seller
    ) public {
        uint256 _timestamp = block.timestamp;
        transactions.push(Transaction(_transactionType, _amount, _buyer, _seller, _timestamp));
        emit TransactionRecorded(_transactionType, _amount, _buyer, _seller, _timestamp);
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }
}
