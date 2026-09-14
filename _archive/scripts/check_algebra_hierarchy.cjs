const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const [rows] = await pool.query(
    `SELECT t1.id as l3_id, t1.name as l3_name, t2.id as l2_id, t2.name as l2_name 
     FROM topics t1 
     JOIN topics t2 ON t1.parent_topic_id = t2.id 
     WHERE t2.parent_topic_id = 2`
  );
  console.log('Any Level 3 topics under Algebra? Count:', rows.length);
  console.table(rows);

  // Also check questions table for existing Algebra questions per grade
  const [qCounts] = await pool.query(`
    SELECT grade, COUNT(*) as count 
    FROM questions 
    WHERE topic_id = 2 
    GROUP BY grade 
    ORDER BY grade
  `);
  console.log('Current questions count for Algebra (topic_id = 2) per grade:');
  console.table(qCounts);

  await pool.end();
}

check().catch(console.error);
