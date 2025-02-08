import dotenv from "dotenv";
import { ethers } from "ethers";
import solc from "solc";
import fs from "fs";

dotenv.config();

export async function deployContract(contractPath) {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const INFURA_URL = process.env.INFURA_URL;

    if (!PRIVATE_KEY || !INFURA_URL) {
        console.error("[DEPLOY CONTRACT:ERROR] CREDENTIALS MISSING");
        return false;
    }

    // Read Solidity contract source code
    const sourceCode = fs.readFileSync(contractPath, "utf8");

    // Compile contract using solc
    function compileContract(source) {
        const input = {
            language: "Solidity",
            sources: { "Contract.sol": { content: source } },
            settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } },
        };
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        const contractData = output.contracts["Contract.sol"];
        const contractName = Object.keys(contractData)[0];
        return { 
            abi: contractData[contractName].abi, 
            bytecode: contractData[contractName].evm.bytecode.object 
        };
    }

    console.log("[DEPLOY CONTRACT] COMPILING CONTRACT...");
    const { abi, bytecode } = compileContract(sourceCode);

    // Connect to Ethereum provider
    const provider = new ethers.JsonRpcProvider(INFURA_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("[DEPLOY CONTRACT] DEPLOYING CONTRACT...");

    try {
        // Create contract factory
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        
        // Deploy the contract
        const contract = await factory.deploy();
        
        // Wait for deployment to complete
        await contract.waitForDeployment();
        
        // Get the deployed contract address
        const deployedAddress = await contract.getAddress();

        console.log("[DEPLOY CONTRACT] CONTRACT DEPLOYED SUCCESSFULLY AT:", deployedAddress);
        return deployedAddress;
    } catch (error) {
        console.error("[DEPLOY CONTRACT:ERROR] ERROR DEPLOYING CONTRACT", error);
        return false;
    }
}

deployContract("./contracts/TransactionContract.sol")
    .then(address => console.log("Deployed at:", address))
    .catch(err => console.error("Deployment failed:", err.message));