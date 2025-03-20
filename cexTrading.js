const axios = require('axios');
const crypto = require('crypto');
const config = require('./config');

class CEXTrading {
    constructor() {
        this.testMode = config.testMode.enabled;
        
        if (!this.testMode) {
            this.binanceConfig = {
                apiKey: process.env.BINANCE_API_KEY,
                apiSecret: process.env.BINANCE_API_SECRET,
                baseUrl: 'https://api.binance.com'
            };

            this.okxConfig = {
                apiKey: process.env.OKX_API_KEY,
                apiSecret: process.env.OKX_API_SECRET,
                passphrase: process.env.OKX_PASSPHRASE,
                baseUrl: 'https://www.okx.com'
            };

            this.huobiConfig = {
                apiKey: process.env.HUOBI_API_KEY,
                apiSecret: process.env.HUOBI_API_SECRET,
                baseUrl: 'https://api.huobi.pro'
            };
        }
    }

    // 模拟下单
    async mockOrder(exchange, symbol, side, amount, price) {
        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
        
        // 模拟滑点
        const slippage = config.testMode.simulateSlippage ? 
            (Math.random() * (config.testMode.slippageRange[1] - config.testMode.slippageRange[0]) + config.testMode.slippageRange[0]) : 
            0;
        
        const executedPrice = side === 'buy' ? 
            price * (1 + slippage) : 
            price * (1 - slippage);

        return {
            orderId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
            symbol,
            side,
            amount,
            price: executedPrice,
            status: 'FILLED',
            timestamp: Date.now()
        };
    }

    // 获取模拟余额
    getMockBalances() {
        return {
            WETH: config.testMode.mockBalances.WETH,
            USDC: config.testMode.mockBalances.USDC,
            DAI: config.testMode.mockBalances.DAI
        };
    }

    // 获取账户余额
    async getBalances() {
        if (this.testMode) {
            return this.getMockBalances();
        }

        const balances = {};

        try {
            // 获取Binance余额
            balances.binance = await this.getBinanceBalances();
            
            // 获取OKX余额
            balances.okx = await this.getOKXBalances();
            
            // 获取Huobi余额
            balances.huobi = await this.getHuobiBalances();

            return balances;
        } catch (error) {
            console.error('获取余额失败:', error.message);
            throw error;
        }
    }

    // 获取Binance余额
    async getBinanceBalances() {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = this.generateBinanceSignature(queryString, this.binanceConfig.apiSecret);

        const response = await axios({
            method: 'GET',
            url: `${this.binanceConfig.baseUrl}/api/v3/account?${queryString}&signature=${signature}`,
            headers: {
                'X-MBX-APIKEY': this.binanceConfig.apiKey
            }
        });

        return response.data.balances;
    }

    // 获取OKX余额
    async getOKXBalances() {
        const timestamp = new Date().toISOString();
        const method = 'GET';
        const requestPath = '/api/v5/account/balance';
        const signature = this.generateOKXSignature(timestamp, method, requestPath);

        const response = await axios({
            method,
            url: `${this.okxConfig.baseUrl}${requestPath}`,
            headers: {
                'OK-ACCESS-KEY': this.okxConfig.apiKey,
                'OK-ACCESS-SIGN': signature,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': this.okxConfig.passphrase
            }
        });

        return response.data.data;
    }

    // 获取Huobi余额
    async getHuobiBalances() {
        const timestamp = new Date().toISOString().slice(0, 19);
        const method = 'GET';
        const host = 'api.huobi.pro';
        const path = '/v1/account/accounts';
        
        const params = {
            AccessKeyId: this.huobiConfig.apiKey,
            SignatureMethod: 'HmacSHA256',
            SignatureVersion: '2',
            Timestamp: timestamp
        };

        const signature = this.generateHuobiSignature(
            method,
            host,
            path,
            params,
            this.huobiConfig.apiSecret
        );

        params.Signature = signature;

        const response = await axios({
            method,
            url: `${this.huobiConfig.baseUrl}${path}`,
            params
        });

        return response.data.data;
    }

    // Binance API签名
    generateBinanceSignature(queryString, secret) {
        return crypto
            .createHmac('sha256', secret)
            .update(queryString)
            .digest('hex');
    }

    // OKX API签名
    generateOKXSignature(timestamp, method, requestPath, body = '') {
        const message = timestamp + method + requestPath + body;
        return crypto
            .createHmac('sha256', this.okxConfig.apiSecret)
            .update(message)
            .digest('base64');
    }

    // Huobi API签名
    generateHuobiSignature(method, host, path, params, secret) {
        const queryString = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        const signatureString = method + '\n' + host + '\n' + path + '\n' + queryString;
        return crypto
            .createHmac('sha256', secret)
            .update(signatureString)
            .digest('base64');
    }

    // Binance下单
    async placeBinanceOrder(symbol, side, quantity, price) {
        try {
            const timestamp = Date.now();
            const queryString = `symbol=${symbol}&side=${side}&type=LIMIT&timeInForce=GTC&quantity=${quantity}&price=${price}&timestamp=${timestamp}`;
            const signature = this.generateBinanceSignature(queryString, this.binanceConfig.apiSecret);

            const response = await axios({
                method: 'POST',
                url: `${this.binanceConfig.baseUrl}/api/v3/order?${queryString}&signature=${signature}`,
                headers: {
                    'X-MBX-APIKEY': this.binanceConfig.apiKey
                }
            });

            return response.data;
        } catch (error) {
            console.error('Binance下单失败:', error.message);
            throw error;
        }
    }

    // OKX下单
    async placeOKXOrder(instId, side, price, size) {
        try {
            const timestamp = new Date().toISOString();
            const method = 'POST';
            const requestPath = '/api/v5/trade/order';
            const body = JSON.stringify({
                instId,
                tdMode: 'cash',
                side,
                ordType: 'limit',
                px: price,
                sz: size
            });

            const signature = this.generateOKXSignature(timestamp, method, requestPath, body);

            const response = await axios({
                method,
                url: `${this.okxConfig.baseUrl}${requestPath}`,
                headers: {
                    'OK-ACCESS-KEY': this.okxConfig.apiKey,
                    'OK-ACCESS-SIGN': signature,
                    'OK-ACCESS-TIMESTAMP': timestamp,
                    'OK-ACCESS-PASSPHRASE': this.okxConfig.passphrase,
                    'Content-Type': 'application/json'
                },
                data: body
            });

            return response.data;
        } catch (error) {
            console.error('OKX下单失败:', error.message);
            throw error;
        }
    }

    // Huobi下单
    async placeHuobiOrder(symbol, type, amount, price) {
        try {
            const timestamp = new Date().toISOString().slice(0, 19);
            const method = 'POST';
            const host = 'api.huobi.pro';
            const path = '/v1/order/orders/place';
            
            const params = {
                AccessKeyId: this.huobiConfig.apiKey,
                SignatureMethod: 'HmacSHA256',
                SignatureVersion: '2',
                Timestamp: timestamp,
                symbol: symbol,
                type: type,
                amount: amount,
                price: price
            };

            const signature = this.generateHuobiSignature(
                method,
                host,
                path,
                params,
                this.huobiConfig.apiSecret
            );

            params.Signature = signature;

            const response = await axios({
                method,
                url: `${this.huobiConfig.baseUrl}${path}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: params
            });

            return response.data;
        } catch (error) {
            console.error('Huobi下单失败:', error.message);
            throw error;
        }
    }

    // 执行CEX套利交易
    async executeCEXArbitrage(buyExchange, sellExchange, symbol, amount, buyPrice, sellPrice) {
        try {
            let buyOrder, sellOrder;

            if (this.testMode) {
                // 模拟交易
                buyOrder = await this.mockOrder(buyExchange, symbol, 'buy', amount, buyPrice);
                sellOrder = await this.mockOrder(sellExchange, symbol, 'sell', amount, sellPrice);
            } else {
                // 执行买入订单
                switch (buyExchange) {
                    case 'binance':
                        buyOrder = await this.placeBinanceOrder(symbol, 'BUY', amount, buyPrice);
                        break;
                    case 'okx':
                        buyOrder = await this.placeOKXOrder(symbol, 'buy', buyPrice, amount);
                        break;
                    case 'huobi':
                        buyOrder = await this.placeHuobiOrder(symbol, 'buy-limit', amount, buyPrice);
                        break;
                }

                // 执行卖出订单
                switch (sellExchange) {
                    case 'binance':
                        sellOrder = await this.placeBinanceOrder(symbol, 'SELL', amount, sellPrice);
                        break;
                    case 'okx':
                        sellOrder = await this.placeOKXOrder(symbol, 'sell', sellPrice, amount);
                        break;
                    case 'huobi':
                        sellOrder = await this.placeHuobiOrder(symbol, 'sell-limit', amount, sellPrice);
                        break;
                }
            }

            const profit = (sellPrice - buyPrice) * amount;
            console.log(`测试模式 - 执行套利交易:
                买入: ${buyExchange} ${amount} ${symbol} @ ${buyPrice}
                卖出: ${sellExchange} ${amount} ${symbol} @ ${sellPrice}
                预期利润: ${profit} USD
            `);

            return {
                buyOrder,
                sellOrder,
                profit
            };
        } catch (error) {
            console.error('CEX套利交易执行失败:', error.message);
            throw error;
        }
    }
}

module.exports = new CEXTrading(); 