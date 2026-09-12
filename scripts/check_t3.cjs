const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [t3Rows] = await conn.execute(`
    SELECT grade, difficulty, COUNT(*) as count 
    FROM questions 
    WHERE topic_id = 3 AND distractor_diagnostics IS NOT NULL
    GROUP BY grade, difficulty 
    ORDER BY grade, FIELD(difficulty, 'Low', 'Medium', 'High')
  `);
  console.log('Topic 3 Diagnostic Breakdown:');
  console.table(t3Rows);

  await conn.end();
})();
