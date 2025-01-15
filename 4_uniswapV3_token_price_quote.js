const ethers = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)

const { abi: IQuoterABI } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoter.sol/IQuoter.json")
const { abi: IQuoterV2ABI } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json")


const quoterAddress = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
const quoterContract = new ethers.Contract(quoterAddress, IQuoterABI, provider)
const quoterV2Address = '0x61fFE014bA17989E743c5F6cB21bF9697530B21e'
const quoterV2Contract = new ethers.Contract(quoterV2Address, IQuoterV2ABI, provider)

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

async function main() {
	const tokenIn = WETH_ADDRESS
	const tokenOut = USDC_ADDRESS
	const fee = '500'
	const amountIn = ethers.parseEther('1')
	const sqrtPriceLimitX96 = '0'

	// quoter
	const amountOut = await quoterContract.quoteExactInputSingle.staticCall(
		tokenIn,
		tokenOut,
		fee,
		amountIn,
		sqrtPriceLimitX96
	)
	console.log("quoter amountOut:", ethers.formatUnits(amountOut, 6))

	// quoterV2
	const params = {
		tokenIn: tokenIn,
		tokenOut: tokenOut,
		fee: fee,
		amountIn: amountIn,
		sqrtPriceLimitX96: sqrtPriceLimitX96
	}
	const result = await quoterV2Contract.quoteExactInputSingle.staticCall(params)
	console.log("quoterV2 amountOut:", ethers.formatUnits(result[0], 6))

	// quoterV2 with multiple hops
	const path = [WETH_ADDRESS, USDC_ADDRESS, USDT_ADDRESS]

	// Encode path with fees for WETH -> USDC -> USDT
	const encodedPath = encodePath(
		path,
		[500, 500] // 0.05% fee for each hop
	)
	const result2 = await quoterV2Contract.quoteExactInput.staticCall(encodedPath, amountIn)
	console.log("quoterV2 USDT amountOut:", ethers.formatUnits(result2[0], 6))
}

// Helper function to encode path for Uniswap V3 quoter
// https://github.com/Uniswap/v3-periphery/blob/0682387198a24c7cd63566a2c58398533860a5d1/test/shared/path.ts
function encodePath(path, fees) {
	if (path.length != fees.length + 1) {
		throw new Error('path/fee lengths do not match')
	}

	let encoded = '0x'
	for (let i = 0; i < fees.length; i++) {
		// path[i] is token address
		encoded += path[i].slice(2)
		// add the fee in hex padded to 3 bytes (6 hex chars)
		encoded += fees[i].toString(16).padStart(6, '0')
	}
	// final token
	encoded += path[path.length - 1].slice(2)
	return encoded
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});