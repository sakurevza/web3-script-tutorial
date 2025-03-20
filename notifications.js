const axios = require('axios');
const config = require('./config');

class NotificationService {
    constructor() {
        this.telegramEnabled = config.telegram.enabled;
        this.discordEnabled = config.discord.enabled;
    }

    async sendTelegramMessage(message) {
        if (!this.telegramEnabled) return;

        try {
            const url = `https://api.telegram.org/bot${config.telegram.botToken}/sendMessage`;
            await axios.post(url, {
                chat_id: config.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            });
        } catch (error) {
            console.error('发送Telegram消息失败:', error.message);
        }
    }

    async sendDiscordMessage(message, type = 'info') {
        if (!this.discordEnabled) return;

        try {
            const color = this.getDiscordColor(type);
            await axios.post(config.discord.webhookUrl, {
                embeds: [{
                    title: '套利机器人通知',
                    description: message,
                    color: color,
                    timestamp: new Date().toISOString()
                }]
            });
        } catch (error) {
            console.error('发送Discord消息失败:', error.message);
        }
    }

    getDiscordColor(type) {
        switch (type) {
            case 'error':
                return 0xFF0000;  // 红色
            case 'success':
                return 0x00FF00;  // 绿色
            case 'warning':
                return 0xFFFF00;  // 黄色
            default:
                return 0x0000FF;  // 蓝色
        }
    }

    async sendNotification(message, type = 'info') {
        await Promise.all([
            this.sendTelegramMessage(message),
            this.sendDiscordMessage(message, type)
        ]);
    }

    async sendAlert(alertType, data) {
        let message;
        switch (alertType) {
            case 'arbitrage_opportunity':
                message = `
🔥 发现套利机会!

买入交易所: ${data.buyExchange}
卖出交易所: ${data.sellExchange}
交易对: ${data.pair}
数量: ${data.amount}
买入价格: $${data.buyPrice}
卖出价格: $${data.sellPrice}
价差: ${(data.spread * 100).toFixed(2)}%
预期毛利: $${data.grossProfit.toFixed(2)}
费用: $${data.fees.toFixed(2)}
预期净利: $${data.netProfit.toFixed(2)}

${config.testMode.enabled ? '⚠️ 测试模式' : '🚨 实盘模式'}
`;
                break;

            case 'trade_executed':
                message = `
✅ 交易执行成功!

交易ID: ${data.tradeId}
买入交易所: ${data.buyExchange}
卖出交易所: ${data.sellExchange}
交易对: ${data.pair}
实际净利: $${data.actualProfit.toFixed(2)}
Gas费用: $${data.gasCost.toFixed(2)}

${config.testMode.enabled ? '⚠️ 测试模式' : '🚨 实盘模式'}
`;
                break;

            case 'error':
                message = `
❌ 错误警报!

错误类型: ${data.type}
描述: ${data.message}
时间: ${new Date().toISOString()}

${config.testMode.enabled ? '⚠️ 测试模式' : '🚨 实盘模式'}
`;
                break;

            default:
                message = JSON.stringify(data, null, 2);
        }

        await this.sendNotification(message, alertType);
    }
}

module.exports = new NotificationService(); 