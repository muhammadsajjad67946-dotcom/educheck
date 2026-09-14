const mysql = require('mysql2/promise');
require('dotenv').config();

async function verify() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const [newBreakdown] = await pool.query(`
    SELECT grade, difficulty, COUNT(*) as count 
    FROM questions 
    WHERE topic_id = 1 AND distractor_diagnostics IS NOT NULL AND distractor_diagnostics != ''
    GROUP BY grade, difficulty 
    ORDER BY grade, FIELD(difficulty, 'Low', 'Medium', 'High')
  `);
  console.log('Newly Added CCSS Geometry Questions Breakdown (by Grade & Difficulty):');
  console.table(newBreakdown);

  const [newPerGrade] = await pool.query(`
    SELECT grade, COUNT(*) as count 
    FROM questions 
    WHERE topic_id = 1 AND distractor_diagnostics IS NOT NULL AND distractor_diagnostics != ''
    GROUP BY grade 
    ORDER BY grade
  `);
  console.log('Total Newly Added CCSS Geometry Questions per Grade:');
  console.table(newPerGrade);

  const [newTotal] = await pool.query(`
    SELECT COUNT(*) as total 
    FROM questions 
    WHERE topic_id = 1 AND distractor_diagnostics IS NOT NULL AND distractor_diagnostics != ''
  `);
  console.log('Total CCSS Geometry Questions with Distractor Diagnostics:', newTotal[0].total);

  await pool.end();
}

verify().catch(console.error);
