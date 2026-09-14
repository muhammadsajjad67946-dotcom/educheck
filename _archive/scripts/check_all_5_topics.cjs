const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [parents] = await conn.execute('SELECT id, name FROM topics WHERE parent_topic_id IS NULL ORDER BY id');
  console.log('Parent Topics in DB:');
  console.table(parents);

  const [topicSummary] = await conn.execute(`
    SELECT 
      t.id as topic_id,
      t.name as topic_name,
      COUNT(q.id) as total_questions,
      SUM(CASE WHEN q.distractor_diagnostics IS NOT NULL THEN 1 ELSE 0 END) as diagnostic_questions,
      COUNT(DISTINCT q.grade) as grades_covered
    FROM topics t
    LEFT JOIN questions q ON q.topic_id = t.id
    WHERE t.parent_topic_id IS NULL
    GROUP BY t.id, t.name
    ORDER BY t.id
  `);

  console.log('\nQuestions Status by Topic:');
  console.table(topicSummary);

  const [gradeCheck] = await conn.execute(`
    SELECT 
      q.topic_id,
      t.name as topic_name,
      q.grade,
      COUNT(*) as total,
      SUM(CASE WHEN q.distractor_diagnostics IS NOT NULL THEN 1 ELSE 0 END) as with_diag
    FROM questions q
    JOIN topics t ON t.id = q.topic_id
    WHERE t.parent_topic_id IS NULL AND q.grade BETWEEN 1 AND 8
    GROUP BY q.topic_id, t.name, q.grade
    ORDER BY q.topic_id, q.grade
  `);
  console.log('\nPer-Grade Breakdown across Topics:');
  console.table(gradeCheck);

  await conn.end();
})();
