const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = new sqlite3.Database(path.join(__dirname, 'trades.db'));
        this.initDatabase();
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS trades (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp INTEGER NOT NULL,
                    buyExchange TEXT NOT NULL,
                    sellExchange TEXT NOT NULL,
                    pair TEXT NOT NULL,
                    amount REAL NOT NULL,
                    buyPrice REAL NOT NULL,
                    sellPrice REAL NOT NULL,
                    spread REAL NOT NULL,
                    grossProfit REAL NOT NULL,
                    fees REAL NOT NULL,
                    netProfit REAL NOT NULL,
                    success BOOLEAN NOT NULL,
                    testMode BOOLEAN NOT NULL DEFAULT 0,
                    error TEXT
                )
            `, (err) => {
                if (err) {
                    console.error('初始化数据库失败:', err);
                    reject(err);
                } else {
                    console.log('数据库初始化成功');
                    resolve();
                }
            });
        });
    }

    async recordTrade(tradeData) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO trades (
                    timestamp, buyExchange, sellExchange, pair, amount,
                    buyPrice, sellPrice, spread, grossProfit, fees,
                    netProfit, success, testMode, error
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            stmt.run(
                tradeData.timestamp,
                tradeData.buyExchange,
                tradeData.sellExchange,
                tradeData.pair,
                tradeData.amount,
                tradeData.buyPrice,
                tradeData.sellPrice,
                tradeData.spread,
                tradeData.grossProfit,
                tradeData.fees,
                tradeData.netProfit,
                tradeData.success ? 1 : 0,
                tradeData.testMode ? 1 : 0,
                tradeData.error || null,
                function(err) {
                    if (err) {
                        console.error('记录交易失败:', err);
                        reject(err);
                    } else {
                        console.log('交易记录已保存，ID:', this.lastID);
                        resolve(this.lastID);
                    }
                }
            );

            stmt.finalize();
        });
    }

    async getTestModeStats() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT 
                    COUNT(*) as totalTrades,
                    SUM(CASE WHEN success = 1 THEN 1 ELSE 0 END) as successfulTrades,
                    SUM(CASE WHEN success = 0 THEN 1 ELSE 0 END) as failedTrades,
                    AVG(CASE WHEN success = 1 THEN netProfit ELSE 0 END) as avgProfit,
                    SUM(CASE WHEN success = 1 THEN netProfit ELSE 0 END) as totalProfit,
                    AVG(fees) as avgFees,
                    AVG(spread * 100) as avgSpreadPercent
                FROM trades 
                WHERE testMode = 1
            `, (err, rows) => {
                if (err) {
                    console.error('获取测试模式统计失败:', err);
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            });
        });
    }

    async getRecentTrades(limit = 10, testMode = null) {
        return new Promise((resolve, reject) => {
            let query = `
                SELECT * FROM trades 
                ${testMode !== null ? 'WHERE testMode = ?' : ''}
                ORDER BY timestamp DESC 
                LIMIT ?
            `;

            const params = testMode !== null ? [testMode ? 1 : 0, limit] : [limit];

            this.db.all(query, params, (err, rows) => {
                if (err) {
                    console.error('获取最近交易记录失败:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error('关闭数据库连接失败:', err);
                    reject(err);
                } else {
                    console.log('数据库连接已关闭');
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database(); 