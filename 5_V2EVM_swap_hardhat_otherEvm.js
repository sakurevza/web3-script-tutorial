const hardhat = require("hardhat")
const axios = require('axios') 
const colors = require('colors');
const provider = hardhat.ethers.provider
require('dotenv').config();


const getTokenAndRouterInfo = require('./constants');
// const network = 'mainnet';
const network = 'base';
const token0 = 'WETH'
const token_0 = 'ETH'
const token1 = 'USDC'
const token2 = 'USDT'
const CEX = 'ok'
const PRICEBASEGAP = 10;

const tokenAndRouter = getTokenAndRouterInfo.getTokenAndRouter(network,token0,token1,token2)


// const RECIPIENT = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth
// const RECIPIENT = "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d" // binance
// const RECIPIENT = "0x3A54dF4CC72a4ca65E1a53E28E9912535Ff07641" // base 有weth

const privateKey = process.env.PRIVATE_KEY_0
const RECIPIENT = new hardhat.ethers.Wallet(privateKey, provider)

// console.log(colors.red('This is red text ') + colors.green.bold('and this is green bold text ') + 'this is normal text');

const { abi: routerABI } = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
// const { abi: factoryABI } = require('@uniswap/v2-core/build/IUniswapV2Factory.json')

const ERC20ABI = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "function transfer(address _to, uint256 _value) public returns (bool success)",
    "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
]

const WETH_ADDRESS = tokenAndRouter.token0Contract
const USDC_ADDRESS = tokenAndRouter.token1Contract
const WETHContract = new hardhat.ethers.Contract(WETH_ADDRESS, ERC20ABI, provider)
const USDCContract = new hardhat.ethers.Contract(USDC_ADDRESS, ERC20ABI, provider)

// const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
// const factoryContract = new hardhat.ethers.Contract(factoryAddress, factoryABI, provider)
const routerAddress = tokenAndRouter.routerContract
const routerContract =  new hardhat.ethers.Contract(routerAddress, routerABI, provider)

async function logBalances() {
    const ETHBalance = await provider.getBalance(RECIPIENT)
    const WETHBalance = await WETHContract.balanceOf(RECIPIENT)
    const USDCBalance = await USDCContract.balanceOf(RECIPIENT)

    let ETHBalance_value = hardhat.ethers.formatEther(ETHBalance);
    let WETHBalance_value = hardhat.ethers.formatUnits(WETHBalance, 18);
    let USDCBalance_value = hardhat.ethers.formatUnits(USDCBalance, 6);


    console.log(colors.yellow(new Date()+'``````````````````````````````````````````````'), )
    console.log(colors.yellow('recipient ETH balance'), ETHBalance_value)
    console.log(colors.yellow('recipient WETH balance'), WETHBalance_value)
    console.log(colors.yellow('recipient USDC balance'), USDCBalance_value)

    return {
        ETHBalance_value,
        WETHBalance_value,
        USDCBalance_value 
    }
}

function logErrorTX(name,tx) {
    let needTXlog = false 
    // if (!needTXlog) return;
    // console.log(colors.red(name),tx)

}

async function uniV2routerGetPrice(_amountIn,tokenIn,tokenOut,option) {
    const path = [tokenIn, tokenOut]
    const amountsOut = await routerContract.getAmountsOut(_amountIn, path);
    // console.log(colors.yellow('amountsOut:'),hardhat.ethers.formatUnits(amountsOut[1].toString(), 6))
    return{
        "amountOut":hardhat.ethers.formatUnits(amountsOut[1].toString(), 6)
        // "amountOut":amountsOut[1]
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
async function findGapPrice(tokenIn,tokenOut,option) {
	let flag = false;
    const inputAmount = 1//change
    const amountIn = hardhat.ethers.parseEther(inputAmount.toString())//change
	// let uniV2routerAmountOut = await uniV2routerGetPrice(amountIn,tokenIn,tokenOut);
	// console.log('uniV2routerAmountOut',uniV2routerAmountOut?.amountOut);

	// let response = await getPriceCEX(CEX,token_0,token1);
	// let cexPrice = CEX === 'ok' ? response.data[0].last :response.price;
	// console.log('cexPrice',cexPrice);

	const [uniV2routerAmountOut, response, fee] = await Promise.all([
		uniV2routerGetPrice(amountIn,tokenIn,tokenOut),
		getPriceCEX(CEX,token_0,token1),
	])

    let uniV2Price = uniV2routerAmountOut?.amountOut
    let cexPrice = CEX === 'ok'? response.data[0].last :response.price;

    console.log('uniV2Price',uniV2Price);
	console.log('cexPrice',cexPrice);
    if (uniV2Price + PRICEBASEGAP <= cexPrice) {
        console.log(colors.red('gap'),cexPrice - uniV2Price);
        flag = true;    
    }
    return flag
}

async function main() {
    //查询价格
    let isGap = await findGapPrice(WETHContract,USDCContract)
    console.log('isGap',isGap);
    if (!isGap) return;


    // impersonate
    // const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT)
    // await hardhat.network.provider.send("hardhat_impersonateAccount", [RECIPIENT])
    // const signer = await hardhat.ethers.getSigner(RECIPIENT)
    console.log(colors.red("signer:"),RECIPIENT)
    // const pairAddress = await factoryContract.getPair(WETH_ADDRESS, USDC_ADDRESS)

    // before swap
    await logBalances()
    let ETHBalance = await provider.getBalance(RECIPIENT)
    let WETHBalance = await WETHContract.balanceOf(RECIPIENT)
    let USDCBalance = await USDCContract.balanceOf(RECIPIENT)
    let ETHBalance_value = hardhat.ethers.formatEther(ETHBalance);
    let WETHBalance_value = hardhat.ethers.formatUnits(WETHBalance, 18);
    let USDCBalance_value = hardhat.ethers.formatUnits(USDCBalance, 6);

    // //eth
    // const inputAmount = 1//change
    // const amountIn = hardhat.ethers.parseEther(inputAmount.toString())//change

    // // const inputAmount = 3400
    // // const amountIn = hardhat.ethers.parseUnits(inputAmount.toString(), 6);

    // // const txApprove = await USDCContract.connect(signer).approve(routerAddress, amountIn)
    // const txApprove = await WETHContract.connect(signer).approve(routerAddress, amountIn)//change
    // logErrorTX("txApprove:", txApprove)
    // const receiptApprove = await txApprove.wait()
    // logErrorTX("receiptApprove:", receiptApprove)
    // const txSwap = await routerContract.connect(signer).swapExactTokensForTokens(
    //     amountIn,
    //     0,
    //     [WETH_ADDRESS, USDC_ADDRESS],//change
    //     // [USDC_ADDRESS, WETH_ADDRESS],
    //     signer.address,
    //     Math.floor(Date.now() / 1000) + (60 * 10)
    // )
    // logErrorTX("txSwap::", txSwap)
    // const receiptSwap = await txSwap.wait()
    // logErrorTX("receiptSwap::", receiptSwap)

    // // after swap
    // await logBalances();
    // ETHBalance = await provider.getBalance(RECIPIENT)
    // WETHBalance = await WETHContract.balanceOf(RECIPIENT)
    // USDCBalance = await USDCContract.balanceOf(RECIPIENT)
    // let after_ETHBalance_value = hardhat.ethers.formatEther(ETHBalance);
    // let after_WETHBalance_value = hardhat.ethers.formatUnits(WETHBalance, 18);
    // let after_USDCBalance_value = hardhat.ethers.formatUnits(USDCBalance, 6);

    // console.log(colors.green.bold('ETH_GAP'), after_ETHBalance_value - ETHBalance_value)
    // console.log(colors.green.bold('WETH_GAP'), after_WETHBalance_value - WETHBalance_value)
    // console.log(colors.green.bold('USDC_GAP'), after_USDCBalance_value - USDCBalance_value)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
