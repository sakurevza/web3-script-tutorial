3.1 监听区块

+ 监听地址交易

3.2监听合约事件

+ Event, Log, Topic
+ 监听 ERC20 转账
+ 监听过滤地址 ERC20 转账

3.3 监听 Mempool

+ 监听地址交易
+ 监听 ERC20 转账
+ 抢跑 NFT freemint

### 交易生命周期

用户交易发出

交易进入交易池 pending tx pool

出块者打包区块

验证者共识
+ 广播
+ 执行（得到状态根、交易根、收据根）
+ 提交

区块确认 / 交易确认

### 多维度监听链上行为（可用于聪明钱监控）

**监听区块**

**监听事件**

receipt、event、log、topic

**监听交易池**

### 本地测试网

1. hardhat

Start local testnet

```sh
npx hardhat node
```

2. Anvil

Install Foundry

```sh
curl -L https://foundry.paradigm.xyz | bash
```

Start local testnet

```sh
anvil
```

### 参考资料

1. Foundry: https://book.getfoundry.sh/getting-started/installation
2. Ethereum Signature Database: https://www.4byte.directory/
3. Signature & ABI tools: https://openchain.xyz/