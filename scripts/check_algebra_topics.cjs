const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const [mainTopics] = await pool.query(
    'SELECT id, name, parent_topic_id FROM topics WHERE parent_topic_id IS NULL OR parent_topic_id = 0 ORDER BY id'
  );
  console.log('Main Topics:');
  console.table(mainTopics);

  const [algebraTopics] = await pool.query(
    'SELECT id, name, parent_topic_id FROM topics WHERE name LIKE "%Algeb%" OR name LIKE "%Equation%" OR name LIKE "%Expression%" OR name LIKE "%Operation%" ORDER BY id'
  );
  console.log('Algebra/Operations/Equations Topics:');
  console.table(algebraTopics);

  await pool.end();
}

check().catch(console.error);
