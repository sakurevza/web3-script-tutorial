const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
// const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)
const provider = new ethers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);

const bn14Address = '0x28C6c06298d514Db089934071355E5743bf21d60'
const bn15Address = '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549'
const bn16Address = '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d'

provider.on("block", async (blockNumber) => {
    let block = await provider.getBlock(blockNumber, true)
    console.log(block)
    let txs = block.prefetchedTransactions

    for (let i = 0; i < block.length; i++) {
    	let tx = txs[i]
    	if ([bn14Address, bn15Address, bn16Address].indexOf(tx.from) !== -1) {
    		console.log(tx)
    	}
    }
});