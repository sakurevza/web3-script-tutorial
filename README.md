

**Lesson 1 走进科学家的世界** 

我们将搭建开发环境，了解与区块链交互的开发工具和与智能合约交互的接口，并编写简单的脚本用于代币转账。

- [x] 1.1 开发环境搭建
  + Node.js, NPM, Hardhat, Ethers.js
  + Infura, Alchemy
  + Sepolia faucet
- [x] 1.2 代币转账
  + ETH 转账
  + ERC20 转账

**Lesson 2 钱包的秘密与初识 Solidity**

我们将了解助记词、私钥、公钥、地址之间的关系，并亲自部署智能合约从而帮助我们实现代币的批量转账与归集。

- [x] 2.1 钱包基础
  + BIP39 - Mnemonic 助记词
  + BIP32 - HDWallet 派生钱包
- [x] 2.2 代币批量转账
  + 部署合约
  + ETH、ERC20 批量转账
- [x] 2.3 代币批量归集
  + ETH、ERC20 批量归集

**Lesson 3  监听链上行为**

我们将从多维度监听区块链上的行为，可以基于此搭建聪明钱监控系统、抢跑 NFT freemint。

- [x] 3.1 监听区块
  + 监听地址交易
- [x] 3.2监听合约事件
  + Event, Log, Topic
  + 监听 ERC20 转账
  + 监听过滤地址 ERC20 转账
- [x] 3.3 监听 Mempool
  + 监听地址交易
  + 监听 ERC20 转账
  + 抢跑 NFT freemint


**Lesson 4 了解 AMM 原理并获取代币实时价格**

我们将以 UniswapV2 和 V3 为例了解 AMM 的原理，并从多种来源获取代币实时价格，与 Lesson 5 相结合后可以搭建套利交易系统。

- [x] 4.1 AMM 原理
- [x] 4.2 获取代币价格
  + Fetch price from UniswapV2
  + Fetch price from UniswapV3 using Quote
  + Fetch price from UniswapV3 with Pool
  + Fetch price from OKX

**Lesson 5 实现自动交易**

我们将继续以 UniswapV2 和 V3 为例实现代币自动交易，并利用 Hardhat & Anvil  中 impersonate 的特性在本地测试网模拟任何账户。

- [x] 5.1 UniswapV3 交易
  + 交易 ERC20
  + 交易 ETH
- [x] 5.2 本地测试网模拟任意账户
  + UniswapV3 交易（使用 Hardhat & Anvil）
  + UniswapV2 交易（使用 Hardhat）

**Lesson 6 开盘与狙击**

我们将扮演项目方和其对手方机器人实现代币开盘和监测开盘与狙击。

- [x] 6.1 开盘
  + UniswapV2 建池并添加流动性
- [x] 6.2 开盘狙击
  + UniswapV2 建池狙击，流动性监测并买进

**Lesson 7 保障多个交易的原子性**

我们将了解 MEV 与 Flashbots Bundle，通过贿赂出块者将多个交易打包为同一区块中的连续交易，可用于防三明治攻击、私钥泄漏后挽救资产或领取空投、开盘防狙击。

- [x] 7.1 MEV 与 Flashbots Bundle
- [x] 7.2 私钥泄露后挽救资产
  + 打包转 gas 和 ERC20 转账交易
- [x] 7.3 开盘防狙击
  + 打包建池、添加流动性、拉盘交易

**Lesson 8 更多案例**

我们将打开科学家的思路，上手更多案例。

- [x] 8.1 Solana 聪明钱监控
- [x] 8.2 Odos 自动交易批量撸空投


