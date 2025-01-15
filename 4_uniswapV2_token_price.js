const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)

const { abi: routerABI } = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')

const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const routerContract =  new ethers.Contract(routerAddress, routerABI, provider)

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
// const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7'

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