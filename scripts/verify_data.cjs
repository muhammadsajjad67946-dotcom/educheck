const mysql = require('mysql2/promise');
require('dotenv').config();

async function verify() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const [totalRows] = await connection.execute('SELECT COUNT(*) as total FROM questions WHERE topic_id = 5');
  console.log(`Total Data Analysis Questions (Topic 5): ${totalRows[0].total}`);

  const [diagRows] = await connection.execute(`
    SELECT grade, difficulty, COUNT(*) as count 
    FROM questions 
    WHERE topic_id = 5 AND distractor_diagnostics IS NOT NULL
    GROUP BY grade, difficulty 
    ORDER BY grade, FIELD(difficulty, 'Low', 'Medium', 'High')
  `);
  console.log('\nDiagnostic Questions Breakdown by Grade & Difficulty (Target: 8 Low, 9 Med, 8 High):');
  console.table(diagRows);

  const [gradeTotals] = await connection.execute(`
    SELECT grade, COUNT(*) as total, 
           SUM(CASE WHEN distractor_diagnostics IS NOT NULL THEN 1 ELSE 0 END) as with_diagnostics
    FROM questions 
    WHERE topic_id = 5 AND grade BETWEEN 1 AND 8
    GROUP BY grade 
    ORDER BY grade
  `);

  console.log('\nTotals by Grade:');
  console.table(gradeTotals);

  await connection.end();
}

verify().catch(console.error);
