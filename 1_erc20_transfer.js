const { ethers } = require("ethers");
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`)
// Sepolia
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)

const privateKeys = [process.env.PRIVATE_KEY_0, process.env.PRIVATE_KEY_1]

const signer0 = new ethers.Wallet(privateKeys[0]) // signer = wallet.connect(provider)
const signer1 = new ethers.Wallet(privateKeys[1], provider)

// console.log(signer0.address)
// console.log(signer1.address)

const ERC20ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address account) view returns (uint256)",
    "function transfer(address to, uint256 value) returns (bool)",
    "function transferFrom(address from, address to, uint256 value) returns (bool)",
    "function approve(address spender, uint256 value) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
]

// UNI on Sepolia
const tokenAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"

// read-only methods, bounded to the provider
const token = new ethers.Contract(tokenAddress, ERC20ABI, provider)
// also state-changing methods, bounded to a signer
// const token = new ethers.Contract(tokenAddress, ERC20ABI, signer1)

async function transferERC20(token, amount, decimals, toAddress) {
    // convert read-only to also state-changing
    const tx = await token.connect(signer1).transfer(toAddress, ethers.parseUnits(amount.toString(), decimals))
    // const tx = await token.transfer(toAddress, ethers.parseUnits(amount.toString(), decimals))
    console.log("tx:", tx)
    const receipt = await tx.wait()
    console.log("receipt:", receipt)
}

async function main() {
    let name = await token.name()
    console.log("token name:", name)
    let symbol = await token.symbol()
    let decimals = await token.decimals()
    let balance0 = await token.balanceOf(signer0.address)
    console.log("signer0 %s balance:", symbol, ethers.formatUnits(balance0, decimals))
    let balance1 = await token.balanceOf(signer1.address)
    console.log("signer1 %s balance:", symbol, ethers.formatUnits(balance1, decimals))

    console.log("transferring ERC20...")
    await transferERC20(token, 0.0001, decimals, signer0.address)

    console.log(`signer0 ${symbol} balance: ${ethers.formatUnits(await token.balanceOf(signer0.address), decimals)}`)
    console.log(`signer1 ${symbol} balance: ${ethers.formatUnits(await token.balanceOf(signer1.address), decimals)}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});