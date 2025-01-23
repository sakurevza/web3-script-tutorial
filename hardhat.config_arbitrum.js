require("@nomicfoundation/hardhat-toolbox")
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "arbitrum",
  networks: {
    hardhat: {
      // forking: {
      //   url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      //   // url: `https://base-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_BASE_KEY}`,
      //   // blockNumber: 5240700,
      //   // hardfork: 'london'  // 根据实际情况选择合适的硬分叉版本
      // }
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_BASE_KEY}`,
      accounts: [process.env.PRIVATE_KEY_0], // 替换为你的私钥
      chainId: 42161, // Base 主网的链 ID
    },
  }
};
