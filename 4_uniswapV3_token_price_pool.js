// or use uniswap v3 sdk
// https://docs.uniswap.org/sdk/v3/guides/advanced/pool-data

const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)

const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const poolABI = [
    "function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)"
]
const factoryABI = [
    "function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)"
]
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

async function getPrice(token0Address, token1Address, feeAmount) {
    const factory = new ethers.Contract(factoryAddress, factoryABI, provider)
    const poolAddress = await factory.getPool(token0Address, token1Address, feeAmount)
    console.log("pool address:", poolAddress)
    const pool = new ethers.Contract(poolAddress, poolABI, provider)

    
    token0 = new ethers.Contract(token0Address, ERC20ABI, provider)
    token1 = new ethers.Contract(token1Address, ERC20ABI, provider)
    let decimals0 = await token0.decimals()
    let decimals1 = await token1.decimals()

    const slot0 = await pool.slot0()
    const t0 = await pool.token0()
    const t1 = await pool.token1()

    let token0Still = true
    if (t0 != token0Address || t1 != token1Address) {
        token0Still = false
    }

    return sqrtToPrice(slot0[0], decimals0, decimals1, token0Still)
};

function sqrtToPrice(sqrt, decimals0, decimals1, token0Still) {
    let price = (Number(sqrt) ** 2) / (2 ** 192) * 10 ** (Number(decimals0) - Number(decimals1))
    if (!token0Still) {
        price = 1 / price
    }
    return price
}

async function main() {
    WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    WBTC_ADDRESS = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
    USDT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7"
    USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    UNI_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
    // Replace the first param with ERC20 token contract address
    price = await getPrice(WBTC_ADDRESS, WETH_ADDRESS, 3000) // 500 3000 10000
    console.log(`price: ${price} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});