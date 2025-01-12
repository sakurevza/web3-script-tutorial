const { ethers } = require("ethers")
require('dotenv').config()

// Ethereum
// const provider = new ethers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`);
// const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
const provider = new ethers.AlchemyProvider("mainnet", process.env.ALCHEMY_MAINNET_KEY)

const ERC20ABI = [
  "event Transfer(address indexed from, address indexed to, uint value)"
]
const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const USDCContract = new ethers.Contract(USDC_ADDRESS, ERC20ABI, provider)

// 1. monitor token contract constantly
// USDCContract.on('Transfer', (from, to, value) => {
// 	console.log(`usdc ${from} -> ${to} ${ethers.formatUnits(value, 6)}`)
// })

// 2. monitor token contract with filter
const bn14Address = '0x28C6c06298d514Db089934071355E5743bf21d60'
const bn15Address = '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549'
const bn16Address = '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d'

const bnInFilter = USDCContract.filters.Transfer(null, [bn14Address, bn15Address, bn16Address]);
console.log("bnInFilter:", bnInFilter)
USDCContract.on(bnInFilter, (res) => {
  console.log(
    `[in] ${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
  )
})

const bnOutFilter = USDCContract.filters.Transfer([bn14Address, bn15Address, bn16Address]);
console.log("bnOutFilter:", bnOutFilter)
USDCContract.on(bnOutFilter, (res) => {
  console.log(
    `[out] ${res.args[0]} -> ${res.args[1]} ${ethers.formatUnits(res.args[2],6)}`
  )
})