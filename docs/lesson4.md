4.1 AMM 原理

4.2 获取代币价格

+ DEX
  + Fetch price from UniswapV2
  + Fetch price from UniswapV3 using Quote
  + Fetch price from UniswapV3 with Pool
+ CEX
  + Fetch price from OKX
  + Fetch price from Binance

### Uniswap AMM 原理

#### UniswapV2

$$\begin{aligned}
x\cdot y &=k \\
(x+\Delta x)\cdot(y-\Delta y)&=k \\
\Delta y&=y-\frac{k}{x+\Delta x}
\end{aligned}$$

```sh
npm install @uniswap/v2-periphery
```

1. 从 factory 获取 token pair，再从 pair getReserves 计算 price（缺点：仅支持单路径）
2. 从 router 直接获取 amountsOut（需要手动添加路径）

#### UniswapV3

```sh
npm install @uniswap/v3-periphery
```

参数 fee：500，3000，10000 分别对应 0.05%，0.3%，1%

1. 从 factory 获取 token pool，再从 pool 获取 slot[0] 计算 price（缺点：仅支持单路径）
2. 从 quoter 直接获取 amountOut（需要手动添加路径）

### CEX

1. OKX
2. Binance

### 参考资料

1. Uniswap V2: https://dhxmo.medium.com/uniswap-v2-a-dive-inside-b34b45eac2d6
2. Uniswap V2: https://docs.uniswap.org/contracts/v2/overview
3. @uniswap/v2-periphery: https://www.npmjs.com/package/@uniswap/v2-periphery
4. Uniswap V3: https://medium.com/@chaisomsri96/defi-math-uniswap-v3-concentrated-liquidity-bd87686b3ecf
5. Uniswap V3: https://docs.uniswap.org/contracts/v3/reference
6. @uniswap/v3-periphery: https://www.npmjs.com/package/@uniswap/v3-periphery
7. OKX API: https://www.okx.com/docs-v5/en/#order-book-trading-market-data-get-ticker
8. Binance API: https://developers.binance.com/docs/binance-spot-api-docs/rest-api/market-data-endpoints#symbol-price-ticker