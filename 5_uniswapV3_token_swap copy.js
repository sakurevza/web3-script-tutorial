// @uniswap/v3-core

const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`)
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`)
// const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)
// Sepolia
// const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)
const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_SEPOLIA_KEY)

const privateKey = process.env.PRIVATE_KEY_0
const signer = new ethers.Wallet(privateKey, provider)

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

const { abi: UniswapV3Factory } = require('@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json')
const { abi: IUniswapV3PoolABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json')
// const { abi: SwapRouterABI} = require('@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json')

const SwapRouter02ABI = [{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactInputParams","name":"params","type":"tuple"}],"name":"exactInput","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMinimum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IV3SwapRouter.ExactInputSingleParams","name":"params","type":"tuple"}],"name":"exactInputSingle","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"bytes","name":"path","type":"bytes"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"}],"internalType":"struct IV3SwapRouter.ExactOutputParams","name":"params","type":"tuple"}],"name":"exactOutput","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"tokenIn","type":"address"},{"internalType":"address","name":"tokenOut","type":"address"},{"internalType":"uint24","name":"fee","type":"uint24"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amountOut","type":"uint256"},{"internalType":"uint256","name":"amountInMaximum","type":"uint256"},{"internalType":"uint160","name":"sqrtPriceLimitX96","type":"uint160"}],"internalType":"struct IV3SwapRouter.ExactOutputSingleParams","name":"params","type":"tuple"}],"name":"exactOutputSingle","outputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"int256","name":"amount0Delta","type":"int256"},{"internalType":"int256","name":"amount1Delta","type":"int256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"uniswapV3SwapCallback","outputs":[],"stateMutability":"nonpayable","type":"function"}]

// Ethereum
// const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
// const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"
// const swapRouter02Address = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"
// Sepolia
const factoryAddress = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c"
const factoryContract = new ethers.Contract(factoryAddress, UniswapV3Factory, provider)
// const swapRouterAddress = ""
const swapRouter02Address = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E"
const swapRouter02Contract = new ethers.Contract(swapRouter02Address, SwapRouter02ABI, provider)

async function getPoolAddress(token0Address, token1Address, feeAmount) {
    const poolAddress = await factoryContract.getPool(token0Address, token1Address, feeAmount)
    console.log("pool address:", poolAddress)
    return poolAddress
}

async function main() {
	const symbol0 = "WETH"
	const decimals0 = 18
	// const token0Address = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // Ethereum
	const token0Address = "0xfff9976782d46cc05630d1f6ebab18b2324d6b14" // Sepolia
	const symbol1 = "UNI"
	const decimals1 = 18
	const token1Address = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" // Ethereum & Sepolia

	const poolAddress = await getPoolAddress(token0Address, token1Address, 3000) // 500 3000 10000
	const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider)

	// const [token0, token1, fee] = await Promise.all([
	// 	pool_contract.token0(),
	// 	pool_contract.token1(),
	// 	pool_contract.fee()
	// ])
	// console.log(token0, token1, fee)
	const fee = await poolContract.fee()

	const inputAmount = 0.0001
	const amountIn = ethers.parseUnits(inputAmount.toString(), decimals0)

	const approvalAmount = amountIn
	const token0Contract = new ethers.Contract(token0Address, ERC20ABI, provider)
	const txApprove = await token0Contract.connect(signer).approve(swapRouter02Address, approvalAmount)
	console.log("txApprove:", txApprove)
	const receiptApprove = await txApprove.wait()
	console.log("receiptApprove:", receiptApprove)

	const params = {
		tokenIn: token0Address,
		tokenOut: token1Address,
		fee: fee,
		recipient: signer.address,
		deadline: Math.floor(Date.now() / 1000) + (60 * 10), // 10min
		amountIn: amountIn,
		amountOutMinimum: 0,
		sqrtPriceLimitX96: 0,
	}

	// 1. input with ERC20 (WETH)
	// before swap
	const token0 = new ethers.Contract(token0Address, ERC20ABI, provider)
	const token1 = new ethers.Contract(token1Address, ERC20ABI, provider)
	let token0Balance = await token0.balanceOf(signer.address)
	console.log(`signer WETH balance: ${ethers.formatEther(token0Balance)}`)
	let token0Allowance = await token0.allowance(signer.address, swapRouter02Address)
	console.log(`signer WETH allowance: ${ethers.formatEther(token0Allowance)}`)
	let token1Balance = await token1.balanceOf(signer.address)
	console.log(`signer UNI balance: ${ethers.formatUnits(token1Balance, 18)}`)

	console.log("swapping...")
	const txSwap = await swapRouter02Contract.connect(signer).exactInputSingle(params) // {gasLimit: 1000000}
	console.log("txSwap:", txSwap)
	const receiptSwap = await txSwap.wait()
	console.log("receiptSwap:", receiptSwap)

	// after swap
	token0Balance = await token0.balanceOf(signer.address)
	console.log(`signer WETH balance: ${ethers.formatEther(token0Balance)}`)
	token1Balance = await token1.balanceOf(signer.address)
	console.log(`signer UNI balance: ${ethers.formatUnits(token1Balance, 18)}`)

	// 2. input with just ETH
	// let ETHBalance = await provider.getBalance(signer.address)
	// console.log(`signer ETH balance: ${ethers.formatEther(ETHBalance)}`)
	// const token0 = new ethers.Contract(token0Address, ERC20ABI, provider)
	// const token1 = new ethers.Contract(token1Address, ERC20ABI, provider)
	// let token0Balance = await token0.balanceOf(signer.address)
	// console.log(`signer WETH balance: ${ethers.formatEther(token0Balance)}`)
	// let token0Allowance = await token0.allowance(signer.address, swapRouter02Address)
	// console.log(`signer WETH allowance: ${ethers.formatEther(token0Allowance)}`)
	// let token1Balance = await token1.balanceOf(signer.address)
	// console.log(`signer UNI balance: ${ethers.formatUnits(token1Balance, 18)}`)

	// const data = swapRouter02Contract.interface.encodeFunctionData("exactInputSingle", [params])

	// const txArgs = {
	// 	to: swapRouter02Address,
	// 	value: amountIn,
	// 	data: data
	// }

	// console.log("swapping...")
	// const txSwap = await signer.sendTransaction(txArgs)
	// console.log("txSwap:", txSwap)
	// const receiptSwap = await txSwap.wait()
	// console.log("receiptSwap:", receiptSwap)

	// // after swap
	// ETHBalance = await provider.getBalance(signer.address)
	// console.log(`signer ETH balance: ${ethers.formatEther(ETHBalance)}`)
	// token0Balance = await token0.balanceOf(signer.address)
	// console.log(`signer WETH balance: ${ethers.formatEther(token0Balance)}`)
	// token1Balance = await token1.balanceOf(signer.address)
	// console.log(`signer UNI balance: ${ethers.formatUnits(token1Balance, 18)}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});