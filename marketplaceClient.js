const BASE_URL = 'http://localhost:4000';

// Helper function to handle API responses
async function handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }
    
    return data;
}

// Get user's inventory
export async function getInventory(username) {
    try {
        const response = await fetch(`${BASE_URL}/getInventory/${username}`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
}

// Get market listings
export async function getMarket() {
    try {
        const response = await fetch(`${BASE_URL}/getMarket`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching market:', error);
        throw error;
    }
}

// Transfer asset between users
export async function transferAsset(assetId, seller, buyer) {
    try {
        const response = await fetch(`${BASE_URL}/transferAsset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                assetId,
                seller,
                buyer
            })
        });
        return await handleResponse(response);
    } catch (error) {
        console.error('Error transferring asset:', error);
        throw error;
    }
}

// Usage examples:

// Example: Get user's inventory
const getUserInventory = async (username) => {
    try {
        const result = await getInventory(username);
        console.log('Inventory:', result.data);
        return result.data;
    } catch (error) {
        console.error('Failed to get inventory:', error.message);
    }
};

// Example: Get market listings
const getMarketListings = async () => {
    try {
        const result = await getMarket();
        console.log('Market listings:', result.data);
        return result.data;
    } catch (error) {
        console.error('Failed to get market listings:', error.message);
    }
};

// Example: Transfer an asset
const performTransfer = async (assetId, seller, buyer) => {
    try {
        const result = await transferAsset(assetId, seller, buyer);
        console.log('Transfer successful:', result.message);
        return result;
    } catch (error) {
        console.error('Failed to transfer asset:', error.message);
    }
};