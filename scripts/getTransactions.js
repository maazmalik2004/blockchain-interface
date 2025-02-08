import * as dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config();

export default async function getTransactions() {
    const INFURA_URL = process.env.INFURA_URL;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (!INFURA_URL || !CONTRACT_ADDRESS) {
        console.error("[GET TRANSACTIONS:ERROR] CREDENTIALS MISSING");
        throw new Error("Missing credentials");
    }
    
    const provider = new ethers.JsonRpcProvider(INFURA_URL);

    const contractABI = [
        "function getTransactionCount() public view returns (uint256)",
        "function transactions(uint256) public view returns (string, int256, string, string, uint256)",  // Assuming this exists in your contract
        "function getAllTransactions() public view returns (tuple(string type, int256 amount, string buyer, string seller, uint256 timestamp)[])"  // Optional: If you have a bulk fetch function
    ];

    const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

    console.log("[GET TRANSACTIONS] FETCHING TRANSACTIONS...");

    try {
        let transactions = [];
        
        // Try bulk fetch first if available
        try {
            transactions = await contract.getAllTransactions();
            console.log(`[GET TRANSACTIONS] FETCHED ${transactions.length} TRANSACTIONS IN BULK`);
        } catch (error) {
            // If bulk fetch fails, fall back to individual fetching
            const count = await contract.getTransactionCount();
            console.log(`[GET TRANSACTIONS] FOUND ${count} TRANSACTIONS`);

            // Fetch each transaction
            for (let i = 0; i < count; i++) {
                const [type, amount, buyer, seller, timestamp] = await contract.transactions(i);
                transactions.push({
                    type,
                    amount: Number(amount), // Convert BigNumber to regular number
                    buyer,
                    seller,
                    timestamp: Number(timestamp),
                    index: i
                });

                if ((i + 1) % 10 === 0) {
                    console.log(`[GET TRANSACTIONS] FETCHED ${i + 1}/${count} TRANSACTIONS`);
                }
            }
        }

        // Format the transactions if they came from bulk fetch
        const formattedTransactions = transactions.map((tx, index) => ({
            type: tx.type,
            amount: Number(tx.amount),
            buyer: tx.buyer,
            seller: tx.seller,
            timestamp: Number(tx.timestamp || 0),
            index
        }));

        console.log("[GET TRANSACTIONS] SUCCESSFULLY FETCHED ALL TRANSACTIONS");
        return formattedTransactions;

    } catch (error) {
        console.error("[GET TRANSACTIONS:ERROR] ERROR FETCHING TRANSACTIONS:", error);
        throw error;
    }
}

// // Example usage
// getTransactions()
//     .then(transactions => {
//         console.log("Transactions fetched successfully:");
//         transactions.forEach(tx => {
//             console.log(`
//                 Index: ${tx.index}
//                 Type: ${tx.type}
//                 Amount: ${tx.amount}
//                 Buyer: ${tx.buyer}
//                 Seller: ${tx.seller}
//                 Timestamp: ${new Date(tx.timestamp * 1000).toLocaleString()}
//             `);
//         });
//     })
//     .catch(err => console.error("Failed to fetch transactions:", err));