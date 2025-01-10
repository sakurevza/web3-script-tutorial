2.1 钱包基础

+ BIP39 - Mnemonic 助记词
+ BIP32 - HDWallet 派生钱包
  
2.2 代币批量转账

+ 部署合约
+ ETH、ERC20 批量转账
  
2.3 代币批量归集

+ ETH、ERC20 批量归集



### 钱包基础

#### 前置概念

账户类型：EOA（Externally Owned Account）由私钥控制、CA（Contract Account）由合约代码控制。

助记词 -> 私钥 -> 公钥 -> 地址

#### BIP39 助记词

将私钥表示为助记词（Mnemonic）的标准方法（通常是12到24个词），简化私钥的备份和恢复过程。

BIP39 提供了固定的 2048 个单词列表，不同钱包实现通常使用相同的列表。v

助记词通过一系列算法最终生成私钥。助记词可以完全替代私钥的备份。

助记词可以单向生成私钥，但无法从私钥反推出助记词。

助记词存在校验机制，但只能检测错误无法修复错误。

#### BIP32 派生钱包

分层确定性钱包（Hierarchical Deterministic Wallet）简称 HD Wallet。

可以通过单个种子（seed）生成一个树状结构的密钥对，从而管理多个账户和地址，同时方便备份和恢复。

派生路径（Derivation Path）：

BIP32 引入了派生路径来唯一标识树中的每个密钥。例如：

+ m/44'/0'/0'/0/0
+ 每个层级的含义：
+ m：主密钥（master）
+ 44'：代表多币种规范（BIP44 提出）
+ 0'：币种，0 表示比特币，1 表示以太坊
+ 0'：账户编号
+ 0：外部或内部链（0：外部地址，1：找零地址）
+ 0：具体索引

### 实战项目

Install openzeppelin/contracts

```sh
npm install @openzeppelin/contracts
```

#### 代币批量转账

ERC20 代币协议

初识 Solidity 智能合约

#### 代币批量归集