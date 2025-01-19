const ethers = require("ethers")
const axios = require('axios') 
require('dotenv').config()
const getTokenAndRouterInfo = require('./constants');
const network = 'mainnet';
// const network = 'base';
const token0 = 'WETH'
const token_0 = 'ETH'
const token1 = 'USDC'
const token2 = 'USDT'
const CEX = 'ok'


const provider = new ethers.AlchemyProvider(network, process.env.ALCHEMY_BASE_KEY)

const { abi: routerABI } = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
const { abi: IQuoterV2ABI } = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json")

const tokenAndRouter = getTokenAndRouterInfo.getTokenAndRouter(network,token0,token1,token2)
const TOKEN0__ADDRESS = tokenAndRouter?.token0Contract
const TOKEN1__ADDRESS = tokenAndRouter?.token1Contract
const TOKEN2__ADDRESS = tokenAndRouter?.token2Contract||'';
const quoterV2Address = tokenAndRouter?.quoterV2Address
const uniV2_routerAddress = tokenAndRouter?.routerContract


const quoterV2Contract = new ethers.Contract(quoterV2Address, IQuoterV2ABI, provider)
const uniV2_routerContract =  new ethers.Contract(uniV2_routerAddress, routerABI, provider)


async function quoterV2(_amountIn,tokenIn,tokenOut,option = {}){
	const fee = option?.fee||'500'
	const amountIn = _amountIn
	const sqrtPriceLimitX96 = '0'
	// quoterV2
	const params = {
		tokenIn: tokenIn,
		tokenOut: tokenOut,
		fee: fee,
		amountIn: amountIn,
		sqrtPriceLimitX96: sqrtPriceLimitX96
	}
	const result = await quoterV2Contract.quoteExactInputSingle.staticCall(params);
	return{
		"amountOut":ethers.formatUnits(result[0], 6)
	}
}

async function uniV2router(_amountIn,tokenIn,tokenOut,option) {
	const path = [tokenIn, tokenOut]
	const amountsOut = await uniV2_routerContract.getAmountsOut(_amountIn, path)
	return{
		"amountOut":ethers.formatUnits(amountsOut[1].toString(), 6)
	}
}

async function getPriceCEX(cex,tick1, tick2) {
	const okUrl = `https://www.okx.com/api/v5/market/ticker?instId=${tick1}-${tick2}-SWAP`;
    const binanceUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${tick1}${tick2}`;
	let url = cex === 'ok' ?okUrl: binanceUrl;
	try {
		const response = await axios.get(url)
		return response.data
	} catch (error) {
		console.error('Error fetching price:', error.message)
		return ""
	}
}

async function main() {
	let _amountIn = ethers.parseEther('1')+'';
	let quoterV2AmountOut = await quoterV2(_amountIn,TOKEN0__ADDRESS,TOKEN1__ADDRESS,{fee:'500'});
	console.log('quoterV2AmountOut',quoterV2AmountOut?.amountOut);

	let uniV2routerAmountOut = await uniV2router(_amountIn,TOKEN0__ADDRESS,TOKEN1__ADDRESS);
	console.log('uniV2routerAmountOut',uniV2routerAmountOut?.amountOut);

	let response = await getPriceCEX(CEX,token_0,token1);
	let cexPrice = CEX === 'ok' ? response.data[0].last :response.price;

	console.log('cexPrice',cexPrice);
}


main()
// .catch((error) => {
// 	console.error(error);
// 	process.exitCode = 1;
// });