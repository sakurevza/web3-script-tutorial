const { ethers } = require("ethers")

// read JSON ABI
const abiJson = require("./artifacts/contracts/2_MultiTransfer.sol/MultiTransfer.json") // your ABI file

// convert to human-readable ABI
const iface = new ethers.Interface(abiJson.abi)
console.log(iface.format())