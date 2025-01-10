const { ethers } = require("ethers")
require('dotenv').config()
// const crypto = require('crypto')

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`)
// Sepolia
// const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_SEPOLIA_KEY}`)
const provider = new ethers.AlchemyProvider("sepolia", process.env.ALCHEMY_SEPOLIA_KEY);

const privateKey = process.env.PRIVATE_KEY_0

const signer = new ethers.Wallet(privateKey, provider)

// multi-transfer contract
const multiTransferABI = [
	'function getSum(uint256[] _arr) pure returns (uint256 sum)',
	'function multiTransferETH(address[] _addresses, uint256[] _amounts) payable',
	'function multiTransferToken(address _token, address[] _addresses, uint256[] _amounts)',
	'function withdrawFromFailList(address _to)'
]
const multiTransferAddress = "0x4e52bEc294BD4CF3c826aB98671782E373F7779b"
const multiTransferContract = new ethers.Contract(multiTransferAddress, multiTransferABI, signer)

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
const UNIContract = new ethers.Contract(UNI_ADDRESS, ERC20ABI, signer)

// generate random mnemonic
// const mnemonic = ethers.Mnemonic.entropyToPhrase(crypto.randomBytes(32))
// console.log(mnemonic)

const mnemonic = process.env.MNEMONIC

// create HD wallet
// const HDNode = ethers.HDNodeWallet.fromPhrase(mnemonic)
// console.log(HDNode);

// derive path: m / purpose' / coin_type' / account' / change / address_index
// only adjust address_index to derive new wallet
let basePath = "m/44'/60'/0'/0/"
let addresses = []
const mnemonicInstance = ethers.Mnemonic.fromPhrase(mnemonic)
// derive 10 wallets
const num = 10
for (let i = 0; i < num; i++) {
	let newHDNode = ethers.HDNodeWallet.fromMnemonic(mnemonicInstance, basePath + i)
	// console.log(newHDNode)
	let newWallet = new ethers.Wallet(newHDNode.privateKey)
	addresses.push(newWallet.address)
}
console.log(addresses)

async function main() {
	for (let i = 0; i < num; i++) {
		const ETHBalance = await provider.getBalance(addresses[i])
		console.log(`${addresses[i]} ETH balance: ${ethers.formatEther(ETHBalance)}`)
	}
	const decimals = await UNIContract.decimals()
	for (let i = 0; i < num; i++) {
		const UNIBalance = await UNIContract.balanceOf(addresses[i])
		console.log(`${addresses[i]} UNI balance: ${ethers.formatUnits(UNIBalance, decimals)}`)
	}

	let amount = 0.005
	let amounts = Array(num).fill(ethers.parseEther(amount.toString()))

	console.log("transferring ETH...")
	const tx = await multiTransferContract.multiTransferETH(addresses, amounts, { value: ethers.parseEther((amount * num).toString()) })
	console.log("tx:", tx)
	const receipt = await tx.wait()
	console.log("receipt:", receipt)

	for (let i = 0; i < num; i++) {
		console.log(`${addresses[i]} ETH balance: ${ethers.formatEther(await provider.getBalance(addresses[i]))}`)
	}

	amount = 0.00001
	amounts = Array(num).fill(ethers.parseUnits(amount.toString(), decimals))

	console.log("approving UNI...")
	const txApprove = await UNIContract.approve(multiTransferAddress, ethers.parseUnits((amount * num).toString(), decimals))
	console.log("txApprove:", txApprove)
	const receiptApprove = await txApprove.wait()
	console.log("receiptApprove:", receiptApprove)

	console.log("transferring erc20...")
	const tx2 = await multiTransferContract.multiTransferToken(UNI_ADDRESS, addresses, amounts)
	console.log("tx2:", tx2)
	const receipt2 = await tx2.wait()
	console.log("receipt2:", receipt2)

	for (let i = 0; i < num; i++) {
		console.log(`${addresses[i]} UNI balance: ${ethers.formatUnits(await UNIContract.balanceOf(addresses[i]), decimals)}`)
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});