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
import {getInventory, getMarket, transferAsset} from "./assetManagement.js"

// Routes
app.get('/', (req, res) => {
    res.json({
        success:true,
        message:"welcome to blockchain server"
    });
});

// blockchain related
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

// rest related
app.get('/getInventory/:username', async(req, res) => {
    try{
        const username = req.params.username
        const inventory = await getInventory(username)

        console.log(inventory)
        
        res.json({
            success: true,
            message: "get successful",
            data: inventory
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message:"could not get inventory"
        })
    }
});

// rest related
app.get('/getMarket', async(req, res) => {
    try{
        const market = await getMarket()

        console.log(market)
        
        res.json({
            success: true,
            message: "get successful",
            data: market
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message:"could not get market"
        })
    }
});

app.post('/transferAsset', async(req, res) => {
    try{
        const body = req.body

        console.log(body)

        await transferAsset(body.assetId, body.seller, body.buyer)

        res.json({
            success: true,
            message: "transfer successful",
        });
    }catch(error){
        console.log(error)
        res.status(400).json({
            success: false,
            message:"could not transfer asset"
        })
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
