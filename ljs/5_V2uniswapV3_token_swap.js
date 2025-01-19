const ethers = require("ethers")
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const getTokenAndRouterInfo = require('../constants');
// const network = 'mainnet';
const network = 'base';
const token0 = 'WETH'
const token_0 = 'ETH'
const token1 = 'USDC'
const token2 = 'USDT'
const CEX = 'ok'

const provider = new ethers.AlchemyProvider(network, process.env.ALCHEMY_BASE_KEY)
const { abi: routerABI } = require('@uniswap/v2-periphery/build/UniswapV2Router02.json')
// const { abi: factoryABI } = require('@uniswap/v2-core/build/IUniswapV2Factory.json')

const tokenAndRouter = getTokenAndRouterInfo.getTokenAndRouter(network,token0,token1,token2)
const TOKEN0__ADDRESS = tokenAndRouter?.token0Contract
const TOKEN1__ADDRESS = tokenAndRouter?.token1Contract
const TOKEN2__ADDRESS = tokenAndRouter?.token2Contract||'';
const quoterV2Address = tokenAndRouter?.quoterV2Address
const uniV2_routerAddress = tokenAndRouter?.routerContract

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


// const RECIPIENT = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth
const privateKey = process.env.PRIVATE_KEY_0
const RECIPIENT = new ethers.Wallet(privateKey, provider)

const WETH_ADDRESS = TOKEN0__ADDRESS
const USDC_ADDRESS = TOKEN1__ADDRESS
const WETHContract = new ethers.Contract(WETH_ADDRESS, ERC20ABI, provider)
const USDCContract = new ethers.Contract(USDC_ADDRESS, ERC20ABI, provider)

const routerContract =  new ethers.Contract(uniV2_routerAddress, routerABI, provider)

async function logBalances() {
    const ETHBalance = await provider.getBalance(RECIPIENT)
    const WETHBalance = await WETHContract.balanceOf(RECIPIENT)
    const USDCBalance = await USDCContract.balanceOf(RECIPIENT)
    console.log('recipient ETH balance', ethers.formatEther(ETHBalance))
    console.log('recipient WETH balance', ethers.formatUnits(WETHBalance, 18))
    console.log('recipient USDC balance', ethers.formatUnits(USDCBalance, 6))
}

async function main() {
    // impersonate
    // const signer = RECIPIENT
    // before swap
    await logBalances()

    const inputAmount = 0.0001
    const amountIn = ethers.parseEther(inputAmount.toString())

    // const txWrap = await signer.sendTransaction({
    //     to: WETH_ADDRESS,
    //     value: amountIn
    // })
    // console.log("txWrap:", txWrap)
    // const receiptWrap = await txWrap.wait()
    // console.log("receiptWrap", receiptWrap)

    // const txApprove = await WETHContract.connect(signer).approve(routerAddress, amountIn)
    // console.log("txApprove:", txApprove)
    // const receiptApprove = await txApprove.wait()
    // console.log("receiptApprove", receiptApprove)

    // const txSwap = await routerContract.connect(signer).swapExactTokensForTokens(
    //     amountIn,
    //     0,
    //     [WETH_ADDRESS, USDC_ADDRESS],
    //     signer.address,
    //     Math.floor(Date.now() / 1000) + (60 * 10)
    // )
    // console.log("txSwap:", txSwap)
    // const receiptSwap = await txSwap.wait()
    // console.log("receiptSwap:", receiptSwap)

    // // after swap
    // await logBalances()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});