/**
 * Standalone test for ClaudeApiTest endpoint logic.
 * Runs a minimal express server and hits the endpoint, then exits.
 */
const express = require('express');
const http = require('http');
const { ethers } = require('ethers');

const app = express();

app.get('/api/ClaudeApiTest', async (req, res) => {
    try {
        const provider = new ethers.JsonRpcProvider('https://ethereum.publicnode.com');
        const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
        const abi = [
            'function totalSupply() view returns (uint256)',
            'function decimals() view returns (uint8)',
            'function symbol() view returns (string)',
        ];
        const contract = new ethers.Contract(USDC_ADDRESS, abi, provider);
        const [totalSupply, decimals, symbol] = await Promise.all([
            contract.totalSupply(),
            contract.decimals(),
            contract.symbol(),
        ]);
        const formatted = ethers.formatUnits(totalSupply, decimals);
        const result = {
            contract: USDC_ADDRESS,
            totalSupply: totalSupply.toString(),
            totalSupplyFormatted: formatted,
            decimals: Number(decimals),
            symbol,
        };
        console.log('[ClaudeApiTest] Fetched USDC data:', result);
        res.json(result);
    } catch (err) {
        console.error('[ClaudeApiTest] Error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Test server on port ${port}`);

    const req = http.get(`http://localhost:${port}/api/ClaudeApiTest`, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
            console.log('\n=== API Response ===');
            console.log('Status:', response.statusCode);
            console.log('Body:', JSON.stringify(JSON.parse(data), null, 2));
            server.close(() => process.exit(0));
        });
    });
    req.setTimeout(15000, () => {
        console.error('Request timed out');
        server.close(() => process.exit(1));
    });
    req.on('error', e => {
        console.error('Request error:', e.message);
        server.close(() => process.exit(1));
    });
});
