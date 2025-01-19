const ethers = require("ethers")
require('dotenv').config()
const getTokenAndRouterInfo = require('./constants');
const network = 'base';
const token0 = 'WETH'
const token1 = 'USDC'
const token2 = 'USDT'

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
// const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)
const provider = new ethers.AlchemyProvider(network, process.env.ALCHEMY_BASE_KEY)

const { abi: IQuoterV2ABI } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json")

const tokenAndRouter = getTokenAndRouterInfo.getTokenAndRouter(network,token0,token1,token2)
const TOKEN0__ADDRESS = tokenAndRouter?.token0Contract
const TOKEN1__ADDRESS = tokenAndRouter?.token1Contract
const TOKEN2__ADDRESS = tokenAndRouter?.token2Contract
const quoterV2Address = tokenAndRouter?.quoterV2Address
const quoterV2Contract = new ethers.Contract(quoterV2Address, IQuoterV2ABI, provider)


async function main() {
	const tokenIn = TOKEN0__ADDRESS
	const tokenOut = TOKEN1__ADDRESS
	const fee = '500'
	const amountIn = ethers.parseEther('1')
	const sqrtPriceLimitX96 = '0'

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

	const path = [TOKEN0__ADDRESS, TOKEN1__ADDRESS, TOKEN2__ADDRESS]

	// Encode path with fees for WETH -> USDC -> USDT
	// const encodedPath = encodePath(
	// 	path,
	// 	[500, 500] // 0.05% fee for each hop
	// )
	// const result2 = await quoterV2Contract.quoteExactInput.staticCall(encodedPath, amountIn)
	// console.log("quoterV2 USDT amountOut:", ethers.formatUnits(result2[0], 6))
}

// // Helper function to encode path for Uniswap V3 quoter
// // https://github.com/Uniswap/v3-periphery/blob/0682387198a24c7cd63566a2c58398533860a5d1/test/shared/path.ts
// function encodePath(path, fees) {
// 	if (path.length != fees.length + 1) {
// 		throw new Error('path/fee lengths do not match')
// 	}

// 	let encoded = '0x'
// 	for (let i = 0; i < fees.length; i++) {
// 		// path[i] is token address
// 		encoded += path[i].slice(2)
// 		// add the fee in hex padded to 3 bytes (6 hex chars)
// 		encoded += fees[i].toString(16).padStart(6, '0')
// 	}
// 	// final token
// 	encoded += path[path.length - 1].slice(2)
// 	return encoded
// }

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});