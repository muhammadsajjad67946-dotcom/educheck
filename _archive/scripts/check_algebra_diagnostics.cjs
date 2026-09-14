const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const [rows] = await pool.query(`
    SELECT grade, 
           COUNT(*) as total,
           SUM(CASE WHEN distractor_diagnostics IS NOT NULL AND distractor_diagnostics != '' THEN 1 ELSE 0 END) as with_diagnostics,
           SUM(CASE WHEN distractor_diagnostics IS NULL OR distractor_diagnostics = '' THEN 1 ELSE 0 END) as without_diagnostics
    FROM questions 
    WHERE topic_id = 2
    GROUP BY grade 
    ORDER BY grade
  `);
  console.table(rows);

  await pool.end();
}

check().catch(console.error);
