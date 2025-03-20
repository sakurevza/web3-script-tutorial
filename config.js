module.exports = {
    // 交易所配置
    exchanges: {
        binance: {
            name: 'Binance',
            apiUrl: 'https://api.binance.com/api/v3/ticker/price',
            pairs: ['ETHUSDC', 'BTCUSDC', 'ETHBTC'],
            tradingFee: 0.001 // 0.1%
        },
        okx: {
            name: 'OKX',
            apiUrl: 'https://www.okx.com/api/v5/market/ticker',
            pairs: ['ETH-USDC-SWAP', 'BTC-USDC-SWAP', 'ETH-BTC-SWAP'],
            tradingFee: 0.0008 // 0.08%
        },
        huobi: {
            name: 'Huobi',
            apiUrl: 'https://api.huobi.pro/market/tickers',
            pairs: ['ethusdc', 'btcusdc', 'ethbtc'],
            tradingFee: 0.002 // 0.2%
        },
        uniswap: {
            name: 'Uniswap V2',
            type: 'dex',
            version: '2',
            tradingFee: 0.003 // 0.3%
        },
        sushiswap: {
            name: 'SushiSwap',
            type: 'dex',
            routerAddress: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',  // Sepolia SushiSwap router
            tradingFee: 0.003 // 0.3%
        }
    },

    // UniswapV2配置
    uniswap: {
        mainnet: {
            routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
            tokens: {
                WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
                USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
            },
            pairs: [
                {
                    name: 'WETH/USDC',
                    tokenA: 'WETH',
                    tokenB: 'USDC',
                    minProfitUSD: 10
                },
                {
                    name: 'WBTC/USDC',
                    tokenA: 'WBTC',
                    tokenB: 'USDC',
                    minProfitUSD: 20
                },
                {
                    name: 'WETH/WBTC',
                    tokenA: 'WETH',
                    tokenB: 'WBTC',
                    minProfitUSD: 15
                }
            ]
        },
        sepolia: {
            routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',  // Uniswap V2 Router on Sepolia
            tokens: {
                WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',  // Sepolia WETH
                USDC: '0x8267cF9254734C6Eb452a7bb9AAF97B392258b21',  // Sepolia USDC
                DAI: '0x68194a729C2450ad26072b3D33ADaCbcef39D574',   // Sepolia DAI
            }
        }
    },

    // 网络配置
    networks: {
        sepolia: {
            routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',  // Uniswap V2 Router on Sepolia
            tokens: {
                WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',  // Sepolia WETH
                USDC: '0x8267cF9254734C6Eb452a7bb9AAF97B392258b21',  // Sepolia USDC
                DAI: '0x68194a729C2450ad26072b3D33ADaCbcef39D574'    // Sepolia DAI
            }
        }
    },

    // 交易参数
    tradingParams: {
        slippage: 0.005,           // 0.5%滑点
        deadline: 20,              // 交易截止时间(分钟)
        maxGasPrice: 50,           // 最大gas价格(gwei)
        checkInterval: 30000,      // 检查间隔(毫秒)
        minWETHBalance: '0.1',     // 最小WETH余额
        tradeAmount: '0.01',       // 交易数量
        minProfitUSD: 5,          // 最小利润(USD)
        autoExecute: true         // 自动执行交易
    },

    // Telegram配置
    telegram: {
        enabled: true,
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID
    },

    // Discord配置
    discord: {
        enabled: true,
        webhookUrl: process.env.DISCORD_WEBHOOK_URL
    },

    // 数据库配置
    database: {
        enabled: true,
        path: './trades.db'
    },

    // 交易对配置
    pairs: [
        {
            name: 'WETH/USDC',
            tokenA: 'WETH',
            tokenB: 'USDC',
            minProfitUSD: 2
        },
        {
            name: 'WETH/DAI',
            tokenA: 'WETH',
            tokenB: 'DAI',
            minProfitUSD: 2
        }
    ],

    // 测试模式配置
    testMode: {
        enabled: true,
        mockPrices: {
            binance: {
                'WETH/USDC': 2000,
                'WETH/DAI': 2005
            },
            okx: {
                'WETH/USDC': 2010,
                'WETH/DAI': 2015
            },
            huobi: {
                'WETH/USDC': 1995,
                'WETH/DAI': 1990
            },
            uniswap: {
                'WETH/USDC': 2020,
                'WETH/DAI': 2025
            }
        },
        mockBalances: {
            WETH: '1.0',
            USDC: '5000',
            DAI: '5000'
        },
        mockGasFee: 5,
        simulateSlippage: true,
        slippageRange: [0.001, 0.005]  // 0.1% - 0.5%
    }
}; 