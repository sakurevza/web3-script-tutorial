const { ethers } = require("ethers")
require('dotenv').config()

mnemonic = process.env.MNEMONIC

// create mnemonic instance
const mnemonicInstance = ethers.Mnemonic.fromPhrase(mnemonic)

// 1. create HD wallet from mnemonic
const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonicInstance)

// 2. derive path: m / purpose' / coin_type' / account' / change / address_index
// only adjust address_index to derive new wallet
let basePath = "m/44'/60'/0'/0/"
let addresses = []
// derive 10 wallets
const num = 10
for (let i = 0; i < num; i++) {
	let newHDNode = ethers.HDNodeWallet.fromMnemonic(mnemonicInstance, basePath + i)
	// console.log(newHDNode)
	let newWallet = new ethers.Wallet(newHDNode.privateKey)
	addresses.push(newWallet.address)
}
console.log(addresses)