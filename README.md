# Engineering Assessment

## 📝 Objective

The goal of this assessment is to evaluate your ability to:

Work with Web3 technologies and integrate blockchain functionality into a decentralized application (dApp).

---

## 📌 Task Instructions

1. **Create a New API Endpoint**

   - Add a new API endpoint in `index.js` named:

     ```
     [Name]ApiTest
     ```

2. **Smart Contract Interaction**

   - Select any **pre-deployed** or **public smart contract** (mainnet or testnet).
   
   - Fetch some data (any useful information such as balance, contract state, or public variables).
   
   - The logic should fetch data through your new API endpoint.


3. **Output**

   - The result should be printed to the console.
   - No need for complex UI or data persistence 
   - just demonstrate that the data was fetched successfully.

---

## 📤 Submission

Once completed, submit one of the following:

- **short video** recording your work.
- **screenshots** showing the API call and console result.
- **Github Link** where your assessment result were pushed.

---

## ⏰ Time Expectation

- Estimated time to complete: **30–60 minutes**.

---

## ⚙️ Notes

You may use any blockchain provider such as:

  - **ethers.js**
  - **web3.js**
  - Any public RPC provider (Infura, Alchemy, QuickNode, etc.)
  
Keep your code **clean, simple, and easy to review**.

Handle errors gracefully where possible.

---
## 🚀 Quick Start Guide

To run the project locally:

```bash
# Clone the repository (if provided)
git clone [repo-url]

# Move into the project directory
cd [project-folder]

# Install dependencies
npm install

# Start the server
npm start
```

---
Here's a summary of what was implemented:                                                                                                                                                                      
                                                                                                                                                                                                                   
  GET /api/ClaudeApiTest in src/index.js:                                                                                                                                                                        
  - Connects to Ethereum mainnet via ethereum.publicnode.com (free public RPC)                                                                                                                                     
  - Calls totalSupply(), decimals(), and symbol() on the USDC ERC-20 contract (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)                                                                                         
  - Prints fetched data to console and returns JSON                                                                                                                                                                
                                                                                                                                                                                                                   
  Verified output:                                              
  {                                                                                                                                                                                                                
    "contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",   
    "totalSupply": "55427899020734496",                                                                                                                                                                            
    "totalSupplyFormatted": "55427899020.734496",               
    "decimals": 6,                                                                                                                                                                                                 
    "symbol": "USDC"                                                                                                                                                                                               
  }                                                                                                                                                                                                                
                                                                                                                                                                                                                   
  Also added test_endpoint.js — a standalone test that spins up a minimal server, hits the endpoint, and exits cleanly (useful for demos/screenshots).
