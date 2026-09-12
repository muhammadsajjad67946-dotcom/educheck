const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const [main] = await pool.query("SELECT * FROM topics WHERE name LIKE '%Measure%' OR id = 4");
  console.log('Measurement main topic:');
  console.table(main);

  const [subtopics] = await pool.query("SELECT id, name, parent_topic_id FROM topics WHERE parent_topic_id = 4 OR parent_topic_id IN (SELECT id FROM topics WHERE name LIKE '%Measure%') ORDER BY id");
  console.log('Subtopics under Measurement:');
  console.table(subtopics);

  const [qCounts] = await pool.query("SELECT grade, COUNT(*) as count FROM questions WHERE topic_id = 4 GROUP BY grade ORDER BY grade");
  console.log('Questions under topic_id = 4:');
  console.table(qCounts);

  await pool.end();
}

check().catch(console.error);
