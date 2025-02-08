
import { getTransactions, appendTransaction } from "./client.js";

// Example usage
getTransactions();

const newTransaction = {
    type: 'NFTtransfer',
    amount: 3000,
    buyer: 'person 1',
    seller: 'person 2'
};
appendTransaction(newTransaction);
