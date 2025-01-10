const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`)
// Sepolia
// const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)
const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_SEPOLIA_KEY);

const privateKey = process.env.PRIVATE_KEY_0

const signer = new ethers.Wallet(privateKey)

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
// UNI on Sepolia
const UNI_ADDRESS = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
const UNIContract = new ethers.Contract(UNI_ADDRESS, ERC20ABI, provider)

const mnemonic = process.env.MNEMONIC

// create HD wallet
const HDNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
console.log(HDNode);

// derive path: m / purpose' / coin_type' / account' / change / address_index
// only adjust address_index to derive new wallet
let basePath = "m/44'/60'/0'/0/"
let wallets = []
const mnemonicInstance = ethers.Mnemonic.fromPhrase(mnemonic) // ethers.js v6
// derive 10 wallets
const num = 10
for (let i = 0; i < num; i++) {
	let newHDNode = ethers.HDNodeWallet.fromMnemonic(mnemonicInstance, basePath + i)
	// console.log(newHDNode)
	let newWallet = new ethers.Wallet(newHDNode.privateKey, provider)
	wallets.push(newWallet)
}
console.log(wallets.map(wallet => wallet.address))

async function main() {
	for (let i = 0; i < num; i++) {
		const ETHBalance = await provider.getBalance(wallets[i].address)
		console.log(`${wallets[i].address} ETH balance: ${ethers.formatEther(ETHBalance)}`)
	}
	const decimals = await UNIContract.decimals()
	for (let i = 0; i < num; i++) {
		const UNIBalance = await UNIContract.balanceOf(wallets[i].address)
		console.log(`${wallets[i].address} UNI balance: ${ethers.formatUnits(UNIBalance, decimals)}`)
	}

	console.log("transferring eth...")
	let amount = ethers.parseEther("0.001")
	const txSendETH = {
	    to: signer.address,
	    value: amount
	}
	let receipts = []
	for (let i = 0; i < num; i++) {
	    const tx = await wallets[i].sendTransaction(txSendETH)
	    const receipt = tx.wait()
	    receipts.push(receipt)
	    console.log(`${i + 1} ${wallets[i].address}`)
	}
	await Promise.all(receipts)

	for (let i = 0; i < num; i++) {
		console.log(`${wallets[i].address} ETH balance: ${ethers.formatEther(await provider.getBalance(wallets[i].address))}`)
	}
	console.log(`signer ETH balance: ${ethers.formatEther(await provider.getBalance(signer.address))}`)

	console.log("transferring erc20...")
	amount = ethers.parseUnits("0.00012", decimals)
	receipts = []
	for (let i = 0; i < num; i++) {
	    const tx = await UNIContract.connect(wallets[i]).transfer(signer.address, amount)
	    const receipt = tx.wait()
	    receipts.push(receipt)
	    console.log(`${i + 1} ${wallets[i].address}`)
	}
	await Promise.all(receipts)

	for (let i = 0; i < num; i++) {
		console.log(`${wallets[i].address} UNI balance: ${ethers.formatUnits(await UNIContract.balanceOf(wallets[i].address), decimals)}`)
	}
	console.log(`signer UNI balance: ${ethers.formatUnits(await UNIContract.balanceOf(signer.address), decimals)}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});