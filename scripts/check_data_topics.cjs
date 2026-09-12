const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // All parent topics
  const [parents] = await conn.execute('SELECT id, name FROM topics WHERE parent_topic_id IS NULL ORDER BY id');
  console.log('Parent Topics:');
  console.table(parents);

  const [qRows] = await conn.execute(`
    SELECT grade, COUNT(*) as count,
           SUM(CASE WHEN distractor_diagnostics IS NOT NULL THEN 1 ELSE 0 END) as with_diag
    FROM questions 
    WHERE topic_id = 5 
    GROUP BY grade 
    ORDER BY grade
  `);
  console.log('\nCurrent Questions for Topic 5 (Data Analysis):');
  console.table(qRows);

  const [sampleQ] = await conn.execute(`
    SELECT grade, subtopic_id, subtopic_name, COUNT(*) as count
    FROM questions
    WHERE topic_id = 5
    GROUP BY grade, subtopic_id, subtopic_name
    ORDER BY grade, subtopic_id
  `);
  console.log('\nQuestions by Grade and Subtopic:');
  console.table(sampleQ);

  await conn.end();
})();
