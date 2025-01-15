5.1 UniswapV3 交易

+ 交易 ERC20
+ 交易 ETH

5.2 本地测试网模拟主网任意账户

+ UniswapV3 交易（使用 Hardhat & Anvil）
+ UniswapV2 交易（使用 Hardhat）


### Uniswap V3 Swap

```sh
npm install @uniswap/v3-core
```

### 本地测试网模拟主网任意账户

1. forking
2. impersonating

#### Uniswap V3 Swap

1. hardhat node

配置 hardhat.config.js 文件

增加 hardhat node 网络设置：

```js
networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_MAINNET_KEY}`,
      }
    }
  }
```

2. anvil

```sh
source .env
anvil --fork-url "https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_MAINNET_KEY}"
```

#### Uniswap V2 Swap

hardhat

### 参考资料

1. hardhat forking: https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#forking-from-mainnet
2. hardhat impersonating: https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#impersonating-accounts
3. hardhat impersonating: https://hardhat.org/hardhat-network/docs/reference#hardhat_impersonateaccount
4. anvil forking: https://book.getfoundry.sh/tutorials/forking-mainnet-with-cast-anvil
5. anvil impersonating: https://book.getfoundry.sh/reference/anvil/?highlight=impersonate#custom-methods