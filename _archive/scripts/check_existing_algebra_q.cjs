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
    'SELECT grade, subtopic_id, subtopic_name, COUNT(*) as count FROM questions WHERE topic_id = 2 GROUP BY grade, subtopic_id, subtopic_name ORDER BY grade, subtopic_id'
  );
  console.log('Existing questions under topic_id = 2 (Algebra):');
  console.table(rows);

  await pool.end();
}

check().catch(console.error);
