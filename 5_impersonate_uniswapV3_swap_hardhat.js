const hardhat = require("hardhat")
const provider = hardhat.ethers.provider
const RECIPIENT = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045" // vitalik.eth

const { abi: SwapRouterABI } = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')

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

const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
const routerContract =  new hardhat.ethers.Contract(routerAddress, SwapRouterABI, provider)

async function logBalances() {
    const WETHBalance = await WETHContract.balanceOf(RECIPIENT)
    const USDCBalance = await USDCContract.balanceOf(RECIPIENT)
    console.log('recipient WETH balance', hardhat.ethers.formatUnits(WETHBalance, 18))
    console.log('recipient USDC balance', hardhat.ethers.formatUnits(USDCBalance, 6))
}

async function main() {
    // impersonate
    const signer = await hardhat.ethers.getImpersonatedSigner(RECIPIENT)
    // await hardhat.network.provider.send("hardhat_impersonateAccount", [RECIPIENT])
    // const signer = await hardhat.ethers.getSigner(RECIPIENT)

    // before swap
    await logBalances()

    const inputAmount = 10
    const amountIn = hardhat.ethers.parseEther(inputAmount.toString())

    const txApprove = await WETHContract.connect(signer).approve(routerAddress, amountIn)
    console.log("txApprove:", txApprove)
    const receiptApprove = await txApprove.wait()
    console.log("receiptApprove", receiptApprove)

    const params = {
        tokenIn: WETH_ADDRESS,
        tokenOut: USDC_ADDRESS,
        recipient: RECIPIENT,
        deadline: Math.floor(Date.now() / 1000 + (10 * 60)),
        amountIn,
        fee: 3000,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
    }

    const tx = await routerContract.connect(signer).exactInputSingle(params)
    console.log("tx:", tx)
    const receipt = await tx.wait()
    console.log("receipt", receipt)

    // after swap
    await logBalances()
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});