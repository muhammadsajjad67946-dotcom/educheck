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
    'SELECT id, name, parent_topic_id FROM topics WHERE parent_topic_id = 2 ORDER BY id'
  );
  console.log('Subtopics under Algebra (parent_topic_id = 2):');
  console.table(rows);

  await pool.end();
}

check().catch(console.error);
