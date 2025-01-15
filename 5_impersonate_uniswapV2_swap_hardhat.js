const hardhat = require("hardhat")
const provider = hardhat.ethers.provider
const RECIPIENT = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth

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

const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const WETHContract = new hardhat.ethers.Contract(WETH_ADDRESS, ERC20ABI, provider)
const USDCContract = new hardhat.ethers.Contract(USDC_ADDRESS, ERC20ABI, provider)

// const factoryAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
// const factoryContract = new hardhat.ethers.Contract(factoryAddress, factoryABI, provider)
const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const routerContract =  new hardhat.ethers.Contract(routerAddress, routerABI, provider)

async function logBalances() {
    const ETHBalance = await provider.getBalance(RECIPIENT)
    const WETHBalance = await WETHContract.balanceOf(RECIPIENT)
    const USDCBalance = await USDCContract.balanceOf(RECIPIENT)
    console.log('recipient ETH balance', hardhat.ethers.formatEther(ETHBalance))
    console.log('recipient WETH balance', hardhat.ethers.formatUnits(WETHBalance, 18))
    console.log('recipient USDC balance', hardhat.ethers.formatUnits(USDCBalance, 6))
}

async function main() {
    // impersonate
    const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT)
    // await hardhat.network.provider.send("hardhat_impersonateAccount", [RECIPIENT])
    // const signer = await hardhat.ethers.getSigner(RECIPIENT)

    // const pairAddress = await factoryContract.getPair(WETH_ADDRESS, USDC_ADDRESS)

    // before swap
    await logBalances()

    const inputAmount = 10
    const amountIn = hardhat.ethers.parseEther(inputAmount.toString())

    const txWrap = await signer.sendTransaction({
        to: WETH_ADDRESS,
        value: amountIn
    })
    console.log("txWrap:", txWrap)
    const receiptWrap = await txWrap.wait()
    console.log("receiptWrap", receiptWrap)

    const txApprove = await WETHContract.connect(signer).approve(routerAddress, amountIn)
    console.log("txApprove:", txApprove)
    const receiptApprove = await txApprove.wait()
    console.log("receiptApprove", receiptApprove)

    const txSwap = await routerContract.connect(signer).swapExactTokensForTokens(
        amountIn,
        0,
        [WETH_ADDRESS, USDC_ADDRESS],
        signer.address,
        Math.floor(Date.now() / 1000) + (60 * 10)
    )
    console.log("txSwap:", txSwap)
    const receiptSwap = await txSwap.wait()
    console.log("receiptSwap:", receiptSwap)

    // after swap
    await logBalances()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});