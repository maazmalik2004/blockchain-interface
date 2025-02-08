import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;
 
// Middleware
app.use(cors());
app.use(express.json());

// import {get, append, validate} from "./blockchain.js"
import appendTransaction from './scripts/appendTransaction.js';
import  getTransactions from './scripts/getTransactions.js';

// Routes
app.get('/', (req, res) => {
    res.json({
        success:true,
        message:"welcome to blockchain server"
    });
});

app.get('/getData', async(req, res) => {
    try{
        const transactions = await getTransactions()

        console.log(transactions)
        
        res.json({
            success: true,
            message: "get successful",
            data: transactions
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message:"could not get transaction history"
        })
    }
});

app.post("/appendData", async (req, res) => {
    try{
        const transaction = req.body

        // // // body format
        // const transaction = {
        //     type: "NFTtransfer",
        //     amount: 3000,
        //     buyer: "mayank",
        //     seller: "shrihari"
        // };

        await appendTransaction(transaction)

        res.status(400).json({
            success: true,
            message: "transaction appended successfully",
        })
    }
    catch(error){
        res.status(400).json({
            success: false,
            message:"could not append transaction"
        })
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
