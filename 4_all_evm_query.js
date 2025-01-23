const ethers = require("ethers")
const axios = require('axios') 
const colors = require('colors');
require('dotenv').config()
const getTokenAndRouterInfo = require('./constants');
// const network = 'mainnet';
const network = 'base';
// const network = 'arbitrum';

const token0 = 'WETH'
const token_0 = 'ETH'
const token1 = 'USDC'
const token2 = 'USDT'
const CEX = 'ok1'


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
    const exchangeRate = ethers.formatUnits(result[0], 6);


    const inputAmount = 3000 //usdc
    const amountInUSDC = ethers.parseUnits(inputAmount.toString(), 6);
	const params2 = {
		tokenIn: tokenOut,
		tokenOut: tokenIn,
		fee: fee,
		amountIn: amountInUSDC,
		sqrtPriceLimitX96: sqrtPriceLimitX96
	}
	const _result2 = await quoterV2Contract.quoteExactInputSingle.staticCall(params2);
	const result2 = ethers.formatUnits(_result2[0], 18)
    const exchangeRate2 = inputAmount / result2;
    console.log(colors.red('quoterV2_ETH-USDC: 卖eth'),exchangeRate)
    console.log(colors.red('quoterV2_USDC->ETH: 买eth'),exchangeRate2)
	return{
		"amountOut":ethers.formatUnits(result[0], 6),
		tokenIn_tokenOut:exchangeRate,
		tokenOut_tokenIn:exchangeRate2,
	}
}

async function uniV2router(_amountIn,tokenIn,tokenOut,option) {
	// const path = [tokenIn, tokenOut]
	// console.log('amountIn',_amountIn,path);
	// const amountsOut = await uniV2_routerContract.getAmountsOut(_amountIn, path)
	// return{
	// 	"amountOut":ethers.formatUnits(amountsOut[1].toString(), 6)
	// }

    const inputAmount = 3000 //usdc
    const amountIn = ethers.parseUnits(inputAmount.toString(), 6);
    const path = [tokenOut, tokenIn]
    const _amountsOut = await uniV2_routerContract.getAmountsOut(amountIn, path);
    const amountOut = ethers.formatUnits(_amountsOut[1].toString(), 18);
    const exchangeRate = inputAmount / amountOut;

    const inputAmountETH = 1//change
    const amountInETH = ethers.parseEther(inputAmountETH.toString())//change
    const path2 = [tokenIn, tokenOut]
    const _amountsOut2 = await uniV2_routerContract.getAmountsOut(amountInETH, path2);    
    const amountsOut2 = ethers.formatUnits(_amountsOut2[1].toString(), 6); 
    const exchangeRate2 = amountsOut2 / inputAmountETH;
    console.log(colors.red('uniV2_USDC->ETH:买eth'),exchangeRate)
    console.log(colors.red('uniV2_ETH-USDC:卖eth'),exchangeRate2)
    return{
        "amountOut":exchangeRate,
		tokenIn_tokenOut:exchangeRate2,
		tokenOut_tokenIn:exchangeRate,
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
	// console.log('quoterV2AmountOut',quoterV2AmountOut?.amountOut);
	let quoterV2_tokenIn_tokenOut = quoterV2AmountOut?.tokenIn_tokenOut;
	let quoterV2_tokenOut_tokenIn = quoterV2AmountOut?.tokenOut_tokenIn; //usdc->eth 买

	let uniV2routerAmountOut = await uniV2router(_amountIn,TOKEN0__ADDRESS,TOKEN1__ADDRESS);
	let uniV2router_tokenIn_tokenOut = uniV2routerAmountOut?.tokenIn_tokenOut;
	let uniV2router_tokenOut_tokenIn = uniV2routerAmountOut?.tokenOut_tokenIn;
	// console.log('uniV2routerAmountOut',uniV2routerAmountOut?.amountOut);

	let response = await getPriceCEX(CEX,token_0,token1);
	let cexPrice = CEX === 'ok' ? response.data[0].last :response.price;

	console.log('cexPrice',cexPrice);
	let stringIndex = ['quoterV2',"uniV2","cex"]
	let tokenOut_tokenIn = [quoterV2_tokenOut_tokenIn,uniV2router_tokenOut_tokenIn,cexPrice].map( item => Math.round(item))
	let tokenIn_tokenOut = [quoterV2_tokenIn_tokenOut,uniV2router_tokenIn_tokenOut,cexPrice].map( item => Math.round(item))

	console.log(colors.green('买：'),tokenOut_tokenIn,colors.green('卖：'),tokenIn_tokenOut)
	
	const minIndex = tokenOut_tokenIn.reduce((minIdx, currentValue, currentIndex) => 
	  currentValue < tokenOut_tokenIn[minIdx] ? currentIndex : minIdx, 0);

	const maxIndex = tokenIn_tokenOut.reduce((maxIdx, currentValue, currentIndex) => 
	currentValue > tokenIn_tokenOut[maxIdx] ? currentIndex : maxIdx, 0);
	  
	console.log(`卖最大的汇率在 ${stringIndex[maxIndex]},买最小的汇率在 ${stringIndex[minIndex]}`);
}


main()
// .catch((error) => {
// 	console.error(error);
// 	process.exitCode = 1;
// });