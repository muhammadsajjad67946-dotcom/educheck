const mysql = require('mysql2/promise');
require('dotenv').config();

async function addSubtopics() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const newSubtopics = [
    // Grade 2 additions
    'Odd & Even Numbers',
    'Arrays & Repeated Addition',
    // Grade 3 additions
    'Properties of Multiplication',
    'Two-Step Word Problems',
    // Grade 8 addition
    'Functions & Linear Models'
  ];

  for (const name of newSubtopics) {
    const [existing] = await pool.query(
      'SELECT id FROM topics WHERE parent_topic_id = 2 AND name = ?',
      [name]
    );
    if (existing.length === 0) {
      const [res] = await pool.query(
        'INSERT INTO topics (subject_id, parent_topic_id, name, subject) VALUES (6, 2, ?, "Mathematics")',
        [name]
      );
      console.log(`Added subtopic: "${name}" with ID: ${res.insertId}`);
    } else {
      console.log(`Subtopic "${name}" already exists with ID: ${existing[0].id}`);
    }
  }

  const [allSubtopics] = await pool.query(
    'SELECT id, name, parent_topic_id FROM topics WHERE parent_topic_id = 2 ORDER BY id'
  );
  console.log('\nAll Subtopics under Algebra:');
  console.table(allSubtopics);

  await pool.end();
}

addSubtopics().catch(console.error);
