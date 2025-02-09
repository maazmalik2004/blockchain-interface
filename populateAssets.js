import { MongoClient } from "mongodb";

const uri = "mongodb+srv://maazmalik2004:abenzene1234@dspace.odk45.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let data = [
    {
      "username": "User1",
      "password": "Pass@1234",
      "userwalletaddress": "0xA1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
      "userbalance": 2500.75,
      "skillscore": 85,
      "achievementscore": 90,
      "contributionscore": 70,
      "inventory": [
        {
          "assetname": "Gold Shield",
          "assetid": "ASSET001",
          "assetcost": 150,
          "assetimage": "https://example.com/assets/goldshield.png",
          "assetdescription": "A sturdy shield made of gold.",
          "forSale": true
        },
        {
          "assetname": "Mystic Sword",
          "assetid": "ASSET002",
          "assetcost": 200,
          "assetimage": "https://example.com/assets/mysticsword.png",
          "assetdescription": "A powerful sword imbued with magic.",
          "forSale": false
        }
      ]
    },
    {
      "username": "User2",
      "password": "SecurePass456",
      "userwalletaddress": "0xB2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T1A2",
      "userbalance": 1800.50,
      "skillscore": 78,
      "achievementscore": 85,
      "contributionscore": 75,
      "inventory": [
        {
          "assetname": "Dragon Helm",
          "assetid": "ASSET011",
          "assetcost": 175,
          "assetimage": "https://example.com/assets/dragonhelm.png",
          "assetdescription": "A legendary helm worn by dragon slayers.",
          "forSale": true
        },
        {
          "assetname": "Phoenix Feather",
          "assetid": "ASSET012",
          "assetcost": 225,
          "assetimage": "https://example.com/assets/phoenixfeather.png",
          "assetdescription": "A rare feather with regenerative powers.",
          "forSale": false
        }
      ]
    },
    {
      "username": "User3",
      "password": "Pass789!@#",
      "userwalletaddress": "0xC3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T2B3",
      "userbalance": 3200.00,
      "skillscore": 92,
      "achievementscore": 88,
      "contributionscore": 80,
      "inventory": [
        {
          "assetname": "Silver Bow",
          "assetid": "ASSET021",
          "assetcost": 190,
          "assetimage": "https://example.com/assets/silverbow.png",
          "assetdescription": "A bow crafted with pure silver, increasing precision.",
          "forSale": false
        },
        {
          "assetname": "Shadow Cloak",
          "assetid": "ASSET022",
          "assetcost": 230,
          "assetimage": "https://example.com/assets/shadowcloak.png",
          "assetdescription": "A cloak that grants invisibility in the dark.",
          "forSale": true
        }
      ]
    },
    {
      "username": "User4",
      "password": "StrongPass#321",
      "userwalletaddress": "0xD4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T3C4",
      "userbalance": 2750.20,
      "skillscore": 81,
      "achievementscore": 86,
      "contributionscore": 72,
      "inventory": [
        {
          "assetname": "Emerald Ring",
          "assetid": "ASSET031",
          "assetcost": 210,
          "assetimage": "https://example.com/assets/emeraldring.png",
          "assetdescription": "A ring embedded with a rare emerald that boosts wisdom.",
          "forSale": true
        },
        {
          "assetname": "Fire Gauntlets",
          "assetid": "ASSET032",
          "assetcost": 240,
          "assetimage": "https://example.com/assets/firegauntlets.png",
          "assetdescription": "Gauntlets that allow the wearer to control fire.",
          "forSale": false
        }
      ]
    }
  ]
  

async function populateDatabase() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Select the database and collection
        const db = client.db("wagerverse");
        const collection = db.collection("userData");

        // Insert multiple documents
        const result = await collection.insertMany(data);
        
        console.log(`Successfully inserted ${result.insertedCount} documents`);

        // Optional: You can verify the insertion by querying the collection
        const count = await collection.countDocuments();
        console.log(`Total documents in collection: ${count}`);

    } catch (error) {
        console.error("Error occurred while populating database:", error);
    } finally {
        // Close the connection when done
        await client.close();
        console.log("Database connection closed");
    }
}

// Execute the function
populateDatabase();