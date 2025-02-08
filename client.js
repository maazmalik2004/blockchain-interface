const BASE_URL = 'http://localhost:4000';

// Fetch all transactions
export async function getTransactions() {
    try {
        const response = await fetch(`${BASE_URL}/getData`);
        const data = await response.json();
        console.log('Transactions:', data);
        return data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

// Append a new transaction
export async function appendTransaction(transaction) {
    try {
        const response = await fetch(`${BASE_URL}/appendData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });
        const data = await response.json();
        console.log('Append response:', data);
        return data;
    } catch (error) {
        console.error('Error appending transaction:', error);
    }
}
