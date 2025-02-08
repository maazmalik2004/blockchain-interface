import * as dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export default async function appendTransaction(transaction) {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const INFURA_URL = process.env.INFURA_URL;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (!PRIVATE_KEY || !INFURA_URL || !CONTRACT_ADDRESS) {
        console.error("[APPEND TRANSACTION:ERROR] CREDENTIALS MISSING");
        throw new Error("Missing credentials");  // Add error throw
    }
    
    const provider = new ethers.JsonRpcProvider(INFURA_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const contractABI = [
        "function recordTransaction(string, int256, string, string) public",
        "function getTransactionCount() public view returns (uint256)"
    ];

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

    console.log("[APPEND TRANSACTION] APPENDING TRANSACTION...");

    try {
        let count = await contract.getTransactionCount();  // Changed to let
        console.log("[APPEND TRANSACTION] TRANSACTION COUNT BEFORE", count);
        
        const tx = await contract.recordTransaction(  // Store transaction response
            transaction.type,
            transaction.amount,
            transaction.buyer,
            transaction.seller
        );
        
        await tx.wait();  // Wait for transaction confirmation
        
        count = await contract.getTransactionCount();
        console.log("[APPEND TRANSACTION] TRANSACTION COUNT", count);
        console.log("[APPEND TRANSACTION] TRANSACTION APPENDED SUCCESSFULLY");
        return true;
    } catch (error) {
        console.error("[APPEND TRANSACTION:ERROR] ERROR APPENDING TRANSACTION", error);
        throw error;  // Re-throw error instead of returning false
    }
}

// // Example usage
// const transaction = {
//     type: "NFTtransfer",
//     amount: 3000,
//     buyer: "mayank",
//     seller: "shrihari"
// };

// appendTransaction(transaction)
//     .then(output => console.log("Transaction successful:", output))
//     .catch(err => console.error("Transaction failed:", err));