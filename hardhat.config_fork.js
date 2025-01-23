require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      forking: {
        // url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
        // url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_BASE_KEY}`,
        url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_BASE_KEY}`,
        // blockNumber: 25405136,
        // hardfork: 'london'  // 根据实际情况选择合适的硬分叉版本
      }
    },
  }
};
