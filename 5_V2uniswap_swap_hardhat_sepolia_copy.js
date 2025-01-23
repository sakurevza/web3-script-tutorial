const hardhat = require("hardhat")
const axios = require('axios') 
const provider = hardhat.ethers.provider


const getTokenAndRouterInfo = require('./constants');
// const network = 'mainnet';
// const network = 'base';
const network = 'arbitrum';
const token0 = 'WETH'
const token_0 = 'ETH'
const token1 = 'USDC'
const token2 = 'USDT'
const CEX = 'ok'
const PRICEBASEGAP = 10;

const tokenAndRouter = getTokenAndRouterInfo.getTokenAndRouter(network,token0,token1,token2)
console.log("tokenAndRouter,tokenAndRouter",tokenAndRouter)

// const RECIPIENT = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth
// const RECIPIENT = "0xDFd5293D8e347dFe59E90eFd55b2956a1343963d" // binance
// const RECIPIENT = "0x3A54dF4CC72a4ca65E1a53E28E9912535Ff07641" // base 有weth
const RECIPIENT = "0xB38e8c17e38363aF6EbdCb3dAE12e0243582891D" // arb binance有weth

const colors = require('colors');
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
    console.log(colors.red(name),tx)

}

async function main() {

    // impersonate
    const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT)
    // console.log(colors.yellow('signer address'), signer)
    // before swap
    await logBalances()
    //eth
    const inputAmount = 1//change
    const amountIn = hardhat.ethers.parseEther(inputAmount.toString())//change

    // const inputAmount = 3400
    // const amountIn = hardhat.ethers.parseUnits(inputAmount.toString(), 6);

    // const txApprove = await USDCContract.connect(signer).approve(routerAddress, amountIn)
    const txApprove = await WETHContract.connect(signer).approve(routerAddress, amountIn)//change
    logErrorTX("txApprove:", txApprove)
    const receiptApprove = await txApprove.wait()
    logErrorTX("receiptApprove:", receiptApprove)
   
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});