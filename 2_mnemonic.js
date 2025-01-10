const { ethers } = require("ethers")
const crypto = require('crypto')

// generate 12-word mnemonic by using 16 bytes of entropy (128 bits)
const mnemonic_12 = ethers.Mnemonic.entropyToPhrase(crypto.randomBytes(16))
console.log(`mnemonic_12: ${mnemonic_12}`)

// generate 24-word random mnemonic by using 32 bytes of entropy (256 bits)
const mnemonic_24 = ethers.Mnemonic.entropyToPhrase(crypto.randomBytes(32))
console.log(`mnemonic_24: ${mnemonic_24}`)

// create a signer wallet from mnemonic
const signer = ethers.Wallet.fromPhrase(mnemonic_12)
console.log(`signer address: ${signer.address}`)
console.log(`signer private key: ${signer.privateKey}`)