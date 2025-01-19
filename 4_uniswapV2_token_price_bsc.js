const { ethers } = require("ethers")
require('dotenv').config()
// homestead - Homestead (Mainnet)
// goerli - Görli (clique testnet)
// sepolia - Sepolia (proof-of-authority testnet)
// arbitrum - Arbitrum Optimistic L2
// arbitrum-goerli - Arbitrum Optimistic L2 testnet
// matic - Polygon mainnet
// maticmum - Polygon testnet
// optimism - Optimism Optimistic L2
// optimism-goerli - Optimism Optimistic L2 testnet
// const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_BASE_KEY)
const provider = new ethers.AlchemyProvider("base", process.env.ALCHEMY_BASE_KEY)

const { abi: routerABI } = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
// Arbitrum Avalanche BNB Chain Base
const routerAddress = '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24'
const routerContract =  new ethers.Contract(routerAddress, routerABI, provider)

const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
const WETH_ADDRESS = '0x4200000000000000000000000000000000000006'


const path = [WETH_ADDRESS, USDC_ADDRESS]

const amountIn = ethers.parseEther('1')

async function main() {
	const amountsOut = await routerContract.getAmountsOut(amountIn, path)
	console.log("amountsOut:", ethers.formatUnits(amountsOut[1].toString(), 6))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});