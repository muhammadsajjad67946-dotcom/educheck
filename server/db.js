import 'dotenv/config'
import mysql from 'mysql2/promise'

const connectionUri = process.env.MYSQL_URL || process.env.DATABASE_URL

const globalForDb = globalThis

if (!globalForDb.__mysqlPool) {
  globalForDb.__mysqlPool = connectionUri
    ? mysql.createPool(connectionUri)
    : mysql.createPool({
        host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
        port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
        user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
        password: process.env.DB_PASSWORD ?? process.env.MYSQLPASSWORD ?? '',
        database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'neweducheck',
        waitForConnections: true,
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 2),
        queueLimit: 0,
        connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 15000),
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
      })
}

export const pool = globalForDb.__mysqlPool

export async function checkDatabase() {
  const connection = await pool.getConnection()
  await connection.ping()
  connection.release()
}

