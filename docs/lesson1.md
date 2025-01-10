1.1 开发环境搭建

- Node.js, NPM, Hardhat, Ethers.js
- Infura, Alchemy
- Sepolia faucet

1.2 代币转账

+ ETH 转账
+ ERC20 转账



### 1.1 开发环境搭建

#### Node.js 开发环境

Install nvm

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Install node & npm

```sh
nvm install node lts/iron
nvm use lts/iron # 切换node版本
nvm alias default lts/iron # 设置默认node版本
```

Initialize npm project

```sh
npm init -y
```

Install hardhat & Initialize hardhat project

```sh
npm install --save-dev hardhat
npm install --save-dev @nomicfoundation/hardhat-toolbox

npx hardhat init
```

Install ethers.js v6

```sh
npm install ethers
```

Install other dependencies

```sh
npm install dotenv
```

#### RPC 服务 API

1. Alchemy API

2. Infura API

配置 .env 中隐私环境变量

```
# .env.example

ALCHEMY_KEY=
INFURA_KEY=

PRIVATE_KEY_0=
PRIVATE_KEY_1=
```

使 .env 中变量生效

```sh
source .env
```

#### Sepolia testnet faucet



### 1.2 代币转账

#### 以太坊交易格式

```sh
export ETH_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/$ALCHEMY_KEY

cast tx <txhash>
```

#### 区块链浏览器

Etherscan

#### Contract ABI

Compile contracts with hardhat

```sh
npx hardhat compile
```

ERC20ABI

```js
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
```



### 参考资料

1. nvm：node 环境管理工具 https://github.com/nvm-sh/nvm

2. npm：node 包管理工具 https://www.npmjs.com/

3. hardhat：EVM 智能合约开发测试环境 https://hardhat.org/

4. ethers.js：和 EVM 交互的库 https://docs.ethers.org/v6/

5. Alchemy RPC 服务：https://www.alchemy.com/
6. Infura RPC 服务：https://www.infura.io/

7. Sepolia testnet faucet：https://www.alchemy.com/faucets/ethereum-sepolia
8. Sepolia testnet faucet：https://sepolia-faucet.pk910.de/

9. 以太坊浏览器：https://etherscan.io/



### 学习资料

1. 以太坊交易数据结构：https://ethereum.org/zh/developers/docs/transactions/
2. 以太坊智能合约：https://ethereum.org/zh/developers/docs/smart-contracts/

3. Javascript 基本语法：https://liaoxuefeng.com/books/javascript/quick-start/basic-syntax/index.html