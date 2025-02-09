import { MongoClient } from "mongodb";

const uri = "mongodb+srv://maazmalik2004:abenzene1234@dspace.odk45.mongodb.net/";
const client = new MongoClient(uri);

let dbConnection = null;

// Connect to database
async function connectToDatabase() {
    try {
        if (dbConnection) return dbConnection;
        
        await client.connect();
        dbConnection = client.db("wagerverse");
        console.log("Connected to MongoDB");
        return dbConnection;
    } catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}

// Get user's inventory
async function getInventory(username) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("userData");
        const user = await collection.findOne({ username: username });
        
        if (!user) {
            throw new Error("User not found");
        }
        
        return user.inventory;
    } catch (error) {
        console.error("Error fetching inventory:", error);
        throw error;
    }
}

// Get all items for sale across users
async function getMarket() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("userData");
        const users = await collection.find({}).toArray();
        
        let marketItems = [];
        
        users.forEach(user => {
            const forSaleItems = user.inventory
                .filter(item => item.forSale)
                .map(item => ({
                    ...item,
                    seller: user.username
                }));
            marketItems = [...marketItems, ...forSaleItems];
        });
        
        return marketItems;
    } catch (error) {
        console.error("Error fetching market items:", error);
        throw error;
    }
}

// Transfer asset between users
async function transferAsset(assetId, sellerUsername, buyerUsername) {
    let session = null;
    
    try {
        const db = await connectToDatabase();
        session = client.startSession();
        
        await session.withTransaction(async () => {
            const collection = db.collection("userData");
            
            // Get seller and buyer information
            const seller = await collection.findOne({ username: sellerUsername });
            const buyer = await collection.findOne({ username: buyerUsername });
            
            if (!seller || !buyer) {
                throw new Error("Seller or buyer not found");
            }
            
            // Find the asset
            const asset = seller.inventory.find(item => item.assetid === assetId);
            
            if (!asset) {
                throw new Error("Asset not found");
            }
            
            if (!asset.forSale) {
                throw new Error("Asset is not for sale");
            }
            
            // Check if buyer has enough balance
            if (buyer.userbalance < asset.assetcost) {
                throw new Error("Insufficient funds");
            }
            
            // Remove asset from seller
            await collection.updateOne(
                { username: sellerUsername },
                { 
                    $pull: { inventory: { assetid: assetId } },
                    $inc: { userbalance: asset.assetcost }
                }
            );
            
            // Add asset to buyer
            const assetForBuyer = { ...asset, forSale: false };
            await collection.updateOne(
                { username: buyerUsername },
                { 
                    $push: { inventory: assetForBuyer },
                    $inc: { userbalance: -asset.assetcost }
                }
            );
        });
        
        return { success: true, message: "Asset transferred successfully" };
    } catch (error) {
        console.error("Error in asset transfer:", error);
        throw error;
    } finally {
        if (session) {
            await session.endSession();
        }
    }
}

// User login
async function login(username, password) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("userData");
        const user = await collection.findOne({ 
            username: username,
            password: password
        });
        
        if (!user) {
            throw new Error("Invalid username or password");
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

// async function test() {
//     try {
//         // const inventory = await getInventory("User1");
//         // const market = await getMarket("User1");
//        console.log(transferAsset("ASSET011", "User2", "User3"));
//         // console.log(await login("User1", "Pass@1234"));
//     } catch (error) {
//         console.error(error);
//     }
// }

// test();

export {
    getInventory,
    getMarket,
    transferAsset,
    login
};