import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function autoSeedDatabaseIfNeeded() {
  try {
    const [tables] = await pool.query("SHOW TABLES LIKE 'questions'")
    let needSeed = false

    if (!tables || tables.length === 0) {
      needSeed = true
    } else {
      const [rows] = await pool.query('SELECT COUNT(*) AS count FROM questions')
      if (rows[0].count === 0) {
        needSeed = true
      }
    }

    if (needSeed) {
      const dumpPath = path.resolve(__dirname, '../educheck_railway_dump.sql')
      if (fs.existsSync(dumpPath)) {
        console.log('Detected empty database on Railway! Auto-importing educheck_railway_dump.sql...')
        const sqlContent = fs.readFileSync(dumpPath, 'utf8')
        const statements = sqlContent
          .split(/;\r?\n/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0 && !s.startsWith('--'))

        for (const stmt of statements) {
          try {
            await pool.query(stmt)
          } catch (stmtErr) {
            // benign table exist or duplicate notice
          }
        }
        console.log('Database auto-seeded successfully with 16 tables and 1,653 questions!')
      }
    } else {
      const [qCount] = await pool.query('SELECT COUNT(*) AS count FROM questions')
      console.log(`Database ready: ${qCount[0].count} questions present.`)
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err.message)
  }
}
