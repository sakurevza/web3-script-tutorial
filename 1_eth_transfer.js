const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`)
// Sepolia
const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)

const privateKeys = [process.env.PRIVATE_KEY_0, process.env.PRIVATE_KEY_1]

const signer0 = new ethers.Wallet(privateKeys[0], provider) // 0x551F08A03B2E7A192C97F44456b5CB2dC71F4393
const signer1 = new ethers.Wallet(privateKeys[1]) // 0x250ECf316880b6BBE8DE7d3E07f8df254C04dEA8

// console.log(signer0.address)
// console.log(signer1.address)

async function transferETH(signer, amount, toAddress) {
    const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount.toString())
    });
    console.log("tx:", tx)
    const receipt = await tx.wait()
    console.log("receipt:", receipt)
}

async function main() {
    let blockNumber = await provider.getBlockNumber()
    console.log("current block number:", blockNumber)
    let balance0 = await provider.getBalance(signer0.address)
    console.log("signer0 ETH balance:", ethers.formatEther(balance0))
    let nonce0 = await provider.getTransactionCount(signer0.address)
    console.log("signer0 next nonce:", nonce0)
    let balance1 = await provider.getBalance(signer1.address)
    console.log("signer1 ETH balance:", ethers.formatEther(balance1))
    
    console.log("transferring ETH...")
    await transferETH(signer0, 0.001, signer1.address)

    console.log(`signer0 ETH balance: ${ethers.formatEther(await provider.getBalance(signer0.address))}`)
    console.log(`signer1 ETH balance: ${ethers.formatEther(await provider.getBalance(signer1.address))}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});