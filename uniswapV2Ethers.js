const { ethers } = require('ethers');
const axios = require('axios');
const colors = require('colors');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const config = require('./config');
const notifications = require('./notifications');
const database = require('./database');
const cexTrading = require('./cexTrading');

// 从.env文件加载配置
const ALCHEMY_KEY = process.env.ALCHEMY_SEPOLIA_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY_0;
const NETWORK = process.env.NETWORK || 'sepolia';

// 配置RPC URL
const RPC_URL = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_KEY}`;

// 合约ABI
const ERC20_ABI = [
    "function name() public view returns (string)",
    "function symbol() public view returns (string)",
    "function decimals() public view returns (uint8)",
    "function totalSupply() public view returns (uint256)",
    "function balanceOf(address _owner) public view returns (uint256 balance)",
    "function transfer(address _to, uint256 _value) public returns (bool success)",
    "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function allowance(address _owner, address _spender) public view returns (uint256 remaining)"
];

const ROUTER_ABI = [
    "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

// 初始化provider和wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// 初始化合约
const networkConfig = config.networks['sepolia'];
const routerContract = new ethers.Contract(networkConfig.routerAddress, ROUTER_ABI, provider);

// WETH ABI
const WETH_ABI = [
    "function deposit() public payable",
    "function withdraw(uint wad) public",
    ...ERC20_ABI
];

// 更新WETH合约初始化
const WETHContract = new ethers.Contract(networkConfig.tokens.WETH, WETH_ABI, provider);

// 初始化USDC合约
const USDCContract = new ethers.Contract(networkConfig.tokens.USDC, ERC20_ABI, provider);

// 日志记录函数
function logTrade(tradeInfo) {
    const logPath = path.join(__dirname, 'trades.log');
    const logEntry = `${new Date().toISOString()} - ${JSON.stringify(tradeInfo)}\n`;
    fs.appendFileSync(logPath, logEntry);
}

// 获取CEX价格
async function getPriceCEX(cex, tick1, tick2) {
    const endpoints = {
        binance: `https://api.binance.com/api/v3/ticker/price?symbol=${tick1}${tick2}`,
        okx: `https://www.okx.com/api/v5/market/ticker?instId=${tick1}-${tick2}-SWAP`
    };

    try {
        const response = await axios.get(endpoints[cex]);
        return cex === 'binance' ? Number(response.data.price) : Number(response.data.data[0].last);
    } catch (error) {
        console.error('获取CEX价格失败:', error.message);
        return null;
    }
}

// 获取UniswapV2价格
async function getUniswapV2Price(amountIn, tokenIn, tokenOut) {
    try {
        const path = [tokenIn, tokenOut];
        const amounts = await routerContract.getAmountsOut(amountIn, path);
        return amounts[1];
    } catch (error) {
        console.error('获取Uniswap价格失败:', error.message);
        return null;
    }
}

// 检查并优化Gas
async function checkAndOptimizeGas() {
    const gasPrice = await provider.getFeeData();
    const gasPriceGwei = ethers.formatUnits(gasPrice.gasPrice, "gwei");
    
    if (Number(gasPriceGwei) > config.tradingParams.maxGasPrice) {
        throw new Error(`Gas价格过高: ${gasPriceGwei} gwei`);
    }
    
    return gasPrice;
}

// 检查余额
async function checkBalances(token, amount) {
    const contract = new ethers.Contract(token, ERC20_ABI, provider);
    const balance = await contract.balanceOf(wallet.address);
    const decimals = await contract.decimals();
    
    // 使用BigInt比较
    if (BigInt(balance) < BigInt(amount)) {
        throw new Error(`余额不足: 需要 ${ethers.formatUnits(amount, decimals)}`);
    }
}

// 执行swap交易
async function executeSwap(tokenIn, tokenOut, amountIn, slippage = 0.005) {
    try {
        // 检查gas价格
        await checkAndOptimizeGas();
        
        // 检查余额
        await checkBalances(tokenIn, amountIn);
        
        // 获取nonce
        const nonce = await wallet.getNonce();
        
        // 计算最小获得数量
        const amounts = await routerContract.getAmountsOut(amountIn, [tokenIn, tokenOut]);
        const amountOutMin = BigInt(amounts[1]) * BigInt(Math.floor((1 - slippage) * 1000)) / BigInt(1000);
        
        // 授权(如果需要)
        const allowance = await new ethers.Contract(tokenIn, ERC20_ABI, provider).allowance(wallet.address, networkConfig.routerAddress);
        if (BigInt(allowance) < BigInt(amountIn)) {
            console.log(colors.yellow('正在授权...'));
            const approveTx = await new ethers.Contract(tokenIn, ERC20_ABI, wallet).approve(
                networkConfig.routerAddress,
                amountIn,
                { nonce: nonce }
            );
            await approveTx.wait();
            console.log(colors.green('授权成功!'));
        }
        
        // 执行swap
        console.log(colors.yellow('执行swap交易...'));
        const deadline = Math.floor(Date.now() / 1000) + (config.tradingParams.deadline * 60);
        const swapTx = await routerContract.connect(wallet).swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            [tokenIn, tokenOut],
            wallet.address,
            deadline,
            { nonce: nonce + 1 }
        );
        
        const receipt = await swapTx.wait();
        console.log(colors.green('Swap交易成功!'));
        
        // 记录交易
        logTrade({
            txHash: receipt.hash,
            tokenIn,
            tokenOut,
            amountIn: ethers.formatUnits(amountIn, 18),
            amountOut: ethers.formatUnits(amounts[1], 6),
            timestamp: new Date().toISOString()
        });
        
        return receipt;
    } catch (error) {
        console.error('Swap执行失败:', error.message);
        throw error;
    }
}

// 获取所有交易所价格
async function getAllExchangePrices(pair) {
    const prices = {};
    for (const [exchange, info] of Object.entries(config.exchanges)) {
        try {
            const response = await axios.get(info.apiUrl);
            let price;
            
            switch (exchange) {
                case 'binance':
                    price = Number(response.data.find(p => p.symbol === pair)?.price);
                    break;
                case 'okx':
                    price = Number(response.data.data.find(p => p.instId === pair)?.last);
                    break;
                case 'huobi':
                    price = Number(response.data.data.find(p => p.symbol === pair.toLowerCase())?.close);
                    break;
            }

            if (price) {
                prices[exchange] = price;
                // 记录价格历史
                await database.recordPrice({
                    pair,
                    exchange,
                    price
                });
            }
        } catch (error) {
            console.error(`获取${exchange}价格失败:`, error.message);
        }
    }
    return prices;
}

// 计算利润
function calculateProfit(prices, amount, gasCost) {
    const maxPrice = Math.max(...Object.values(prices));
    const minPrice = Math.min(...Object.values(prices));
    const spread = maxPrice - minPrice;
    const grossProfit = spread * amount;
    const netProfit = grossProfit - gasCost;
    
    return {
        spread,
        grossProfit,
        netProfit,
        gasCost
    };
}

// 检查套利机会
async function checkArbitrage(pair) {
    try {
        // 获取所有交易所价格
        const prices = await getAllExchangePrices(pair);
        if (Object.keys(prices).length < 2) return false;

        // 获取gas价格
        const gasPrice = await provider.getFeeData();
        const gasPriceGwei = Number(ethers.formatUnits(gasPrice.gasPrice, "gwei"));
        const estimatedGasCost = gasPriceGwei * 200000 * 1e-9; // 假设使用200,000 gas

        // 计算利润
        const profitInfo = calculateProfit(prices, config.tradingParams.tradeAmount, estimatedGasCost);

        // 记录价格信息
        console.log(colors.yellow('价格信息:'));
        Object.entries(prices).forEach(([exchange, price]) => {
            console.log(colors.yellow(`${exchange}: ${price}`));
        });
        console.log(colors.yellow(`价差: ${profitInfo.spread}`));
        console.log(colors.yellow(`预计毛利: ${profitInfo.grossProfit} USD`));
        console.log(colors.yellow(`Gas成本: ${profitInfo.gasCost} USD`));
        console.log(colors.yellow(`预计净利: ${profitInfo.netProfit} USD`));

        // 发送通知
        if (profitInfo.netProfit > config.tradingParams.minProfitUSD) {
            const message = `
发现套利机会!
交易对: ${pair}
最高价: ${maxPrice} (${maxExchange})
最低价: ${minPrice} (${minExchange})
价差: ${profitInfo.spread}
预计净利: ${profitInfo.netProfit} USD
            `;
            await notifications.sendNotification(message, 'profit');
            return true;
        }

        return false;
    } catch (error) {
        console.error('检查套利机会失败:', error.message);
        return false;
    }
}

// 执行套利
async function executeArbitrage(pair, prices) {
    try {
        const { tokenA, tokenB } = config.uniswap.mainnet.pairs.find(p => p.name === pair);
        const inputAmount = ethers.parseEther(config.tradingParams.tradeAmount);

        // 执行swap
        const receipt = await executeSwap(
            config.uniswap.mainnet.tokens[tokenA],
            config.uniswap.mainnet.tokens[tokenB],
            inputAmount
        );

        // 计算实际利润
        const gasUsed = receipt.gasUsed;
        const gasPrice = receipt.effectiveGasPrice;
        const gasCost = Number(ethers.formatEther(gasUsed * gasPrice));

        // 记录交易
        await database.recordTrade({
            pair,
            exchange: 'uniswap',
            type: 'swap',
            amount: config.tradingParams.tradeAmount,
            price: prices.uniswap,
            totalValue: config.tradingParams.tradeAmount * prices.uniswap,
            profitLoss: profitInfo.grossProfit,
            gasCost,
            netProfit: profitInfo.netProfit,
            txHash: receipt.hash
        });

        // 发送成功通知
        await notifications.sendNotification(`
交易成功!
交易对: ${pair}
交易哈希: ${receipt.hash}
Gas成本: ${gasCost} ETH
净利润: ${profitInfo.netProfit} USD
        `, 'success');

    } catch (error) {
        console.error('套利执行失败:', error.message);
        await notifications.sendNotification(`
交易失败!
交易对: ${pair}
错误: ${error.message}
        `, 'error');
    }
}

// 生成交易报告
async function generateReport(timeframe = '24h') {
    try {
        const stats = await database.getTradeStats(timeframe);
        const pairStats = await Promise.all(
            config.uniswap.mainnet.pairs.map(pair => 
                database.getPairPerformance(pair.name, timeframe)
            )
        );
        const exchangeStats = await database.getExchangePerformance(timeframe);

        const report = `
交易统计报告 (${timeframe})
总交易次数: ${stats.total_trades}
总利润: ${stats.total_net_profit} USD
平均每笔利润: ${stats.avg_profit_per_trade} USD
最佳交易: ${stats.best_trade} USD
最差交易: ${stats.worst_trade} USD
总Gas成本: ${stats.total_gas_cost} ETH

交易对表现:
${pairStats.map(pair => `
${pair.pair}:
- 交易次数: ${pair.trades_count}
- 总利润: ${pair.total_profit} USD
- 平均利润: ${pair.avg_profit} USD
`).join('\n')}

交易所表现:
${exchangeStats.map(exchange => `
${exchange.exchange}:
- 交易次数: ${exchange.trades_count}
- 总利润: ${exchange.total_profit} USD
- 平均利润: ${exchange.avg_profit} USD
`).join('\n')}
        `;

        await notifications.sendNotification(report, 'info');
        return report;
    } catch (error) {
        console.error('生成报告失败:', error.message);
    }
}

// 添加ETH到WETH的转换函数
async function convertETHtoWETH(amount) {
    try {
        console.log(colors.yellow('正在将ETH转换为WETH...'));
        const tx = await WETHContract.connect(wallet).deposit({
            value: amount
        });
        await tx.wait();
        console.log(colors.green('ETH转换WETH成功!'));
    } catch (error) {
        console.error('ETH转换WETH失败:', error.message);
        throw error;
    }
}

// 检查CEX套利机会
async function checkCEXArbitrage(pair) {
    try {
        const prices = {};
        
        if (config.testMode.enabled) {
            // 使用模拟价格
            prices.binance = config.testMode.mockPrices.binance[pair];
            prices.okx = config.testMode.mockPrices.okx[pair];
            prices.huobi = config.testMode.mockPrices.huobi[pair];
            prices.uniswap = config.testMode.mockPrices.uniswap[pair];
        } else {
            // 获取实际价格
            prices.binance = await getPriceCEX('binance', 'ETH', 'USDC');
            prices.okx = await getPriceCEX('okx', 'ETH', 'USDC');
            prices.huobi = await getPriceCEX('huobi', 'ETH', 'USDC');
            prices.uniswap = await getUniswapV2Price(ethers.parseEther('1'), 'ETH', 'USDC');
        }

        // 计算最佳套利机会
        const exchanges = Object.keys(prices);
        let bestOpportunity = null;

        for (let i = 0; i < exchanges.length; i++) {
            for (let j = 0; j < exchanges.length; j++) {
                if (i !== j) {
                    const buyExchange = exchanges[i];
                    const sellExchange = exchanges[j];
                    const buyPrice = prices[buyExchange];
                    const sellPrice = prices[sellExchange];

                    if (!buyPrice || !sellPrice) continue;

                    const spread = (sellPrice - buyPrice) / buyPrice;
                    const amount = config.tradingParams.tradeAmount;
                    const grossProfit = (sellPrice - buyPrice) * amount;
                    
                    // 计算费用
                    const fees = calculateTotalFees(buyExchange, sellExchange, amount, buyPrice, sellPrice);
                    const netProfit = grossProfit - fees;

                    if (netProfit > config.tradingParams.minProfitUSD && 
                        (!bestOpportunity || netProfit > bestOpportunity.netProfit)) {
                        bestOpportunity = {
                            buyExchange,
                            sellExchange,
                            buyPrice,
                            sellPrice,
                            amount,
                            spread,
                            grossProfit,
                            fees,
                            netProfit
                        };
                    }
                }
            }
        }

        if (bestOpportunity) {
            console.log(`发现套利机会 (${config.testMode.enabled ? '测试模式' : '实盘模式'}):`);
            console.log(`买入: ${bestOpportunity.buyExchange} @ ${bestOpportunity.buyPrice}`);
            console.log(`卖出: ${bestOpportunity.sellExchange} @ ${bestOpportunity.sellPrice}`);
            console.log(`数量: ${bestOpportunity.amount}`);
            console.log(`价差: ${(bestOpportunity.spread * 100).toFixed(2)}%`);
            console.log(`毛利润: $${bestOpportunity.grossProfit.toFixed(2)}`);
            console.log(`费用: $${bestOpportunity.fees.toFixed(2)}`);
            console.log(`净利润: $${bestOpportunity.netProfit.toFixed(2)}`);

            // 发送通知
            await notifications.sendAlert('arbitrage_opportunity', bestOpportunity);

            // 执行套利
            if (config.tradingParams.autoExecute) {
                const result = await cexTrading.executeCEXArbitrage(
                    bestOpportunity.buyExchange,
                    bestOpportunity.sellExchange,
                    pair,
                    bestOpportunity.amount,
                    bestOpportunity.buyPrice,
                    bestOpportunity.sellPrice
                );

                // 记录交易
                await database.recordTrade({
                    ...bestOpportunity,
                    timestamp: Date.now(),
                    success: true,
                    testMode: config.testMode.enabled
                });

                return result;
            }
        }

        return null;
    } catch (error) {
        console.error('检查CEX套利机会时出错:', error.message);
        throw error;
    }
}

// 计算总费用
function calculateTotalFees(buyExchange, sellExchange, amount, buyPrice, sellPrice) {
    let totalFees = 0;

    // 买入费用
    if (config.exchanges[buyExchange]) {
        totalFees += amount * buyPrice * config.exchanges[buyExchange].tradingFee;
    }

    // 卖出费用
    if (config.exchanges[sellExchange]) {
        totalFees += amount * sellPrice * config.exchanges[sellExchange].tradingFee;
    }

    // 如果是DEX，添加gas费用估算
    if (buyExchange === 'uniswap' || sellExchange === 'uniswap') {
        totalFees += config.testMode.enabled ? 
            config.testMode.mockGasFee : 
            estimateGasFee();
    }

    return totalFees;
}

// 主函数
async function main() {
    try {
        console.log(colors.green('开始监控套利机会...'));
        console.log(colors.yellow('钱包地址:', wallet.address));
        
        // 检查初始余额
        const ethBalance = await provider.getBalance(wallet.address);
        const wethBalance = await WETHContract.balanceOf(wallet.address);
        const usdcBalance = await USDCContract.balanceOf(wallet.address);
        
        console.log(colors.yellow('ETH余额:', ethers.formatEther(ethBalance)));
        console.log(colors.yellow('WETH余额:', ethers.formatUnits(wethBalance, 18)));
        console.log(colors.yellow('USDC余额:', ethers.formatUnits(usdcBalance, 6)));

        // 检查CEX余额
        const cexBalances = await cexTrading.getBalances();
        console.log(colors.yellow('CEX余额:'));
        Object.entries(cexBalances).forEach(([exchange, balance]) => {
            console.log(colors.yellow(`${exchange}:`, balance));
        });
        
        // 如果WETH余额不足，先转换一些ETH到WETH
        const minWETHRequired = ethers.parseEther(config.tradingParams.minWETHBalance);
        if (BigInt(wethBalance) < BigInt(minWETHRequired)) {
            const ethToConvert = ethers.parseEther(config.tradingParams.minWETHBalance);
            if (BigInt(ethBalance) > BigInt(ethToConvert)) {
                await convertETHtoWETH(ethToConvert);
            } else {
                console.log(colors.red('ETH余额不足，无法转换为WETH'));
                process.exit(1);
            }
        }

        // 发送启动通知
        await notifications.sendNotification('套利机器人已启动', 'info');
        
        // 持续监控所有交易对
        setInterval(async () => {
            for (const pair of config.uniswap.mainnet.pairs) {
                // 检查DEX套利机会
                const hasUniswapArbitrage = await checkArbitrage(pair.name);
                if (hasUniswapArbitrage) {
                    console.log(colors.green(`发现${pair.name} DEX套利机会!`));
                    await executeArbitrage(pair.name);
                }

                // 检查CEX套利机会
                const hasCEXArbitrage = await checkCEXArbitrage(pair.name);
                if (hasCEXArbitrage) {
                    console.log(colors.green(`发现${pair.name} CEX套利机会!`));
                }
            }
        }, config.tradingParams.checkInterval);

        // 每24小时生成一次报告
        setInterval(async () => {
            await generateReport('24h');
        }, 24 * 60 * 60 * 1000);
        
    } catch (error) {
        console.error(colors.red('程序执行错误:', error.message));
        await notifications.sendNotification(`程序错误: ${error.message}`, 'error');
        database.close();
        process.exit(1);
    }
}

// 优雅退出
process.on('SIGINT', async () => {
    console.log(colors.yellow('\n正在关闭程序...'));
    await notifications.sendNotification('套利机器人已停止', 'info');
    database.close();
    process.exit();
});

// 运行程序
main().catch(async (error) => {
    console.error(colors.red('程序异常退出:', error));
    await notifications.sendNotification(`程序异常退出: ${error.message}`, 'error');
    database.close();
    process.exit(1); 
});