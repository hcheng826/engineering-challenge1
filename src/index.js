const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const killPort = require('kill-port');
const { ethers } = require('ethers');

require('dotenv').config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;

const checkPort = async (port, maxPort = 65535) => {

    if (port > maxPort) {
        throw new Error("No available ports found");
    }

    try {
        await killPort(port, "tcp");
        await killPort(port, "udp");
        return port;
    } catch (err) {
        return checkPort(port + 1, maxPort);
    }
};

(async () => {
    const safePort = await checkPort(PORT);
    const getPort = (await import('get-port')).default; // dynamic import
    const final_port = await getPort({ port: safePort });

    console.log(`Port ${final_port} is free. Ready to start server.`);

    // Middleware
    app.use(cors({ origin: `http://localhost:${final_port}` }));
    app.use(express.json());
    app.use(morgan('dev'));

    // Routes
    app.use('/api/items', require('./routes/items'));
    app.use('/api/stats', require('./routes/stats'));

    require('./config/dbHandler.js').connect();

    /**
     * @route    GET /api/ClaudeApiTest
     * @desc     Fetches the total supply of USDC (USD Coin) from the Ethereum mainnet
     *           by calling totalSupply() on the USDC ERC-20 contract.
     * @author   Claude
     * @access   public
     * @param    {Request}  req  - Express request object. No params required.
     * @param    {Response} res  - Express response object.
     * @returns  {JSON}     { contract, totalSupply, totalSupplyFormatted, decimals, symbol }
     * @throws   500 on RPC or contract call failure
     *
     * @example
     * // Example request
     * curl http://localhost:3001/api/ClaudeApiTest
     *
     * // Example response
     * {
     *   "contract": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
     *   "totalSupply": "26000000000000000",
     *   "totalSupplyFormatted": "26000000000.000000",
     *   "decimals": 6,
     *   "symbol": "USDC"
     * }
     */
    app.get('/api/ClaudeApiTest', async (req, res) => {
        try {
            // Connect to Ethereum mainnet via a public RPC
            const provider = new ethers.JsonRpcProvider('https://ethereum.publicnode.com');

            // USDC contract on Ethereum mainnet
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
            console.error('[ClaudeApiTest] Error fetching contract data:', err.message);
            res.status(500).json({ error: 'Failed to fetch contract data', details: err.message });
        }
    });

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static('client/build'));
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        });
    }

    // Start server
    app.listen(final_port, () => {
        console.log(`Backend running on http://localhost:${final_port}`);
    });
})();