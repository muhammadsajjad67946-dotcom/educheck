const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'neweducheck'
  });

  const [rows] = await conn.query(`
    SELECT q.id, q.grade, t.name AS topic, q.subtopic_name AS subtopic,
           q.difficulty, q.question_text AS question,
           q.option_a, q.option_b, q.option_c, q.option_d,
           q.correct_answer AS answer, q.distractor_diagnostics
    FROM questions q
    JOIN topics t ON t.id = q.topic_id
    WHERE q.grade BETWEEN 1 AND 5
    ORDER BY RAND()
    LIMIT 600
  `);

  console.log('Fetched questions bank count:', rows.length);

  const adaptive = await import('../src/utils/adaptiveTest.js');
  console.log('MAX_ADAPTIVE_QUESTIONS:', adaptive.MAX_ADAPTIVE_QUESTIONS);
  console.log('GRADE_BATCH_QUESTION_COUNT:', adaptive.GRADE_BATCH_QUESTION_COUNT);
  console.log('QUESTIONS_PER_CATEGORY:', adaptive.QUESTIONS_PER_CATEGORY);

  // Attempt 1
  const testState1 = adaptive.createGradeBatchTestState(rows, 5, 'Overall', 30);
  console.log('\n--- Test Attempt 1 ---');
  console.log('Total questions in pool:', testState1.questions.length);

  const topicCount1 = {};
  testState1.questions.forEach(q => {
    topicCount1[q.topic] = (topicCount1[q.topic] || 0) + 1;
  });
  console.log('Topic distribution Attempt 1:');
  console.table(topicCount1);

  // Attempt 2
  const testState2 = adaptive.createGradeBatchTestState(rows, 5, 'Overall', 30);
  console.log('\n--- Test Attempt 2 ---');
  console.log('Total questions in pool:', testState2.questions.length);

  const topicCount2 = {};
  testState2.questions.forEach(q => {
    topicCount2[q.topic] = (topicCount2[q.topic] || 0) + 1;
  });
  console.log('Topic distribution Attempt 2:');
  console.table(topicCount2);

  // Check overlap / diversity between attempt 1 and attempt 2
  const set1 = new Set(testState1.questions.map(q => q.id));
  const set2 = new Set(testState2.questions.map(q => q.id));
  const overlap = [...set1].filter(id => set2.has(id));
  console.log(`\nOverlap between Attempt 1 & 2: ${overlap.length}/30 (${30 - overlap.length} new/different questions)`);

  // Test Adaptive Step-Down on Wrong Answer
  console.log('\n--- Testing Adaptive Step-Down on Wrong Answer ---');
  const q1 = testState1.questions[0];
  console.log(`Current Question: ID=${q1.id}, Grade=${q1.grade}, Topic=${q1.topic}, Subtopic=${q1.subtopic}, Difficulty=${q1.difficulty}`);
  
  const wrongAns = q1.answer === 'A' ? 'B' : 'A';
  const nextStateWrong = adaptive.advanceGradeBatchTest(testState1, rows, q1, wrongAns);
  console.log('Answered: WRONG');
  console.log('Next difficulty stepped down to:', nextStateWrong.currentDifficulty);
  console.log('Weak points detected:', nextStateWrong.weakPoints);
  console.log('Total questions remains fixed at:', nextStateWrong.questions.length);

  const nextQuestionInTest = nextStateWrong.questions[1];
  console.log(`\n>>> Immediate Next Injected Question (Step-Down):`);
  console.log(`ID=${nextQuestionInTest.id}, Grade=${nextQuestionInTest.grade}, Topic=${nextQuestionInTest.topic}, Subtopic="${nextQuestionInTest.subtopic}", Difficulty=${nextQuestionInTest.difficulty}`);
  console.log(`Does next question match the wrong subtopic ("${q1.subtopic}")?`, nextQuestionInTest.subtopic === q1.subtopic || nextQuestionInTest.subtopic?.includes(q1.subtopic) || q1.subtopic?.includes(nextQuestionInTest.subtopic));

  // Test Adaptive Step-Up on Correct Answer
  console.log('\n--- Testing Adaptive Step-Up on Correct Answer ---');
  const nextStateCorrect = adaptive.advanceGradeBatchTest(testState1, rows, q1, q1.answer);
  console.log('Answered: CORRECT');
  console.log('Next difficulty stepped up to:', nextStateCorrect.currentDifficulty);

  await conn.end();
}
check().catch(console.error);