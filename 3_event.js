const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
// const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)
const provider = new ethers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);

function checkEventSignature(eventSignature) {
    // calculate the event signature hash
    const eventName = "Transfer(address,address,uint256)";
    const hash = ethers.id(eventName);
    
    console.log("Event signature:", eventSignature);
    console.log("Calculated hash:", hash);
    
    // Compare if they match
    console.log("Matches:", eventSignature === hash);
}

// receipt event log topic
async function main() {
    const txHash = "0x29f7ec50ecd622fd913fc27a2244d9c958790ac6e1c33ee342d4573f5a31ff26"

    const tx = await provider.getTransaction(txHash)
    console.log('tx:', tx)

    const receipt = await provider.getTransactionReceipt(txHash)
    console.log('receipt:', receipt) // JSON.stringify(receipt, null, 2)
    console.log('logs:', receipt.logs)

    // get event signature from logs
    const eventSignature = receipt.logs[0].topics[0];
    
    checkEventSignature(eventSignature);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});