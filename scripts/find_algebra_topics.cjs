const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const [allTopics] = await pool.query('SELECT id, name, parent_topic_id FROM topics ORDER BY id');
  console.log('Total topics in table:', allTopics.length);
  
  // Find topics that mention Array, Even, Multiplication, Exponent, Function
  const matches = allTopics.filter(t => 
    /array|even|odd|multiplication|factor|exponent|radical|function/i.test(t.name)
  );
  console.log('Matched topics:', matches);

  await pool.end();
}

check().catch(console.error);
