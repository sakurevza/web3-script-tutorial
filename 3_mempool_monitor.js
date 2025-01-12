const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
// const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)
const provider = new ethers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);

// 0. monitor pending tx
// provider.on("pending", async (txHash) => {
//     console.log(`[${(new Date).toLocaleTimeString()}] pending tx: ${txHash}`)
//     let tx = await provider.getTransaction(txHash)
//     console.log(tx);
// });

// 1. monitor address pending tx
// const bn14Address = '0x28C6c06298d514Db089934071355E5743bf21d60'
// const bn15Address = '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549'
// const bn16Address = '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d'

// provider.on("pending", async (txHash) => {
//     let tx = await provider.getTransaction(txHash)
//     if (tx) {
//     	if ([bn14Address, bn15Address, bn16Address].indexOf(tx.from) !== -1) {
//     		console.log(`[${(new Date).toLocaleTimeString()}] pending tx: ${txHash}`)
//     		// console.log(tx);
//     	}
//     }
// });

// 2. monitor erc20 transfer
ERC20ABI = [
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function transfer(address _to, uint256 _value) public returns (bool success)"
]
const ERC20Interface = new ethers.Interface(ERC20ABI)

provider.on("pending", async (txHash) => {
    let tx = await provider.getTransaction(txHash);
    if (tx) {
        // filter pending tx.data
        if (tx.data.indexOf(ERC20Interface.getFunction("transfer").selector) !== -1) {
            // console.log(`[${(new Date).toLocaleTimeString()}] pending tx: ${txHash}`)
            
            let parsedTx = ERC20Interface.parseTransaction(tx)
            // console.log("parsed tx:", parsedTx) 
            // console.log("input data arguments:", parsedTx.args)
            // console.log("input parameters:", parsedTx.fragment.inputs) // see the types
            // console.log("output parameters:", parsedTx.fragment.outputs) // see the types

            try { // token address
            	const ERC20Contract = new ethers.Contract(tx.to, ERC20ABI, provider)
            	const symbol = await ERC20Contract.symbol()
            	const decimals = await ERC20Contract.decimals()
            	console.log(`${tx.from} -> ${parsedTx.args[0]} ${ethers.formatUnits(parsedTx.args[1], decimals)} ${symbol}`)
            } catch (err) {
            	console.error(err)
            }
        }
    }
});

// function throttle(fn, delay) {
//     let timer;
//     return function(){
//         if(!timer) {
//             fn.apply(this, arguments)
//             timer = setTimeout(()=>{
//                 clearTimeout(timer)
//                 timer = null
//             },delay)
//         }
//     }
// }

// provider.on("pending", throttle(async (txHash) => {
// 	console.log(`[${(new Date).toLocaleTimeString()}] pending tx: ${txHash}`);
//     // let tx = await provider.getTransaction(txHash);
//     // console.log(tx);
// }, 100));