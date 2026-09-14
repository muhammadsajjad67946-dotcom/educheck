import 'dotenv/config'
import mysql from 'mysql2/promise'

async function run() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  console.log('--- Step 1: Inspecting Current State ---')
  const [chapBefore] = await pool.query('SELECT COUNT(*) as total FROM chapters')
  const [qBefore] = await pool.query('SELECT COUNT(*) as total, COUNT(subtopic_id) as with_sub_id, COUNT(subtopic_name) as with_sub_name FROM questions')
  console.log('Chapters count before:', chapBefore[0].total)
  console.log('Questions count before:', qBefore[0])

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    console.log('\n--- Step 2: Removing Orphan Chapters ---')
    // Delete orphan chapters (those not referenced by questions and not referenced by subtopics)
    const [delResult] = await connection.query(`
      DELETE FROM chapters
      WHERE id NOT IN (SELECT DISTINCT chapter_id FROM questions WHERE chapter_id IS NOT NULL)
        AND id NOT IN (SELECT DISTINCT chapter_id FROM subtopics WHERE chapter_id IS NOT NULL)
    `)
    console.log(`Deleted ${delResult.affectedRows} orphan chapters from chapters table.`)

    console.log('\n--- Step 3: Finding Target Subtopics for 5 Questions ---')
    // Helper to find or insert a child topic under parent topic
    async function getChildTopicId(parentTopicName, childTopicName) {
      // Find parent topic id
      const [parents] = await connection.query(
        'SELECT id FROM topics WHERE name = ? AND (parent_topic_id IS NULL OR parent_topic_id = 0) LIMIT 1',
        [parentTopicName]
      )
      const parentId = parents[0]?.id
      if (!parentId) throw new Error(`Parent topic "${parentTopicName}" not found`)

      // Find child topic
      const [children] = await connection.query(
        'SELECT id FROM topics WHERE name = ? AND parent_topic_id = ? LIMIT 1',
        [childTopicName, parentId]
      )
      if (children.length > 0) {
        return { topicId: parentId, subtopicId: children[0].id }
      }

      // Check if child topic exists under any parent
      const [anyChild] = await connection.query(
        'SELECT id, parent_topic_id FROM topics WHERE name = ? LIMIT 1',
        [childTopicName]
      )
      if (anyChild.length > 0) {
        return { topicId: anyChild[0].parent_topic_id || parentId, subtopicId: anyChild[0].id }
      }

      // If not, insert it under parent topic
      const [inserted] = await connection.query(
        'INSERT INTO topics (subject_id, parent_topic_id, name) VALUES ((SELECT id FROM subjects WHERE name = "Math" LIMIT 1), ?, ?)',
        [parentId, childTopicName]
      )
      return { topicId: parentId, subtopicId: inserted.insertId }
    }

    // Question 1671: 'A school buys 7 packs of pencils. Each pack contains 12 pencils. How many pencils are bought?'
    const sub1671 = await getChildTopicId('Number & Operations', 'Multiplication Word Problems')
    await connection.query(
      `UPDATE questions
       SET subtopic_name = 'Multiplication Word Problems',
           subtopic_id = ?,
           topic_id = COALESCE(topic_id, ?),
           chapter_id = (SELECT id FROM chapters WHERE name = 'Number & Operations' LIMIT 1)
       WHERE id = 1671`,
      [sub1671.subtopicId, sub1671.topicId]
    )
    console.log('Fixed Question 1671 -> Multiplication Word Problems')

    // Question 1686: 'What is 3/4 ÷ 1/2?'
    const sub1686 = await getChildTopicId('Number & Operations', 'Fraction Division')
    await connection.query(
      `UPDATE questions
       SET subtopic_name = 'Fraction Division',
           subtopic_id = ?,
           topic_id = COALESCE(topic_id, ?),
           chapter_id = (SELECT id FROM chapters WHERE name = 'Number & Operations' LIMIT 1)
       WHERE id = 1686`,
      [sub1686.subtopicId, sub1686.topicId]
    )
    console.log('Fixed Question 1686 -> Fraction Division')

    // Question 1687: 'How many 2/3-liter bottles can be filled from 4 liters?'
    const sub1687 = await getChildTopicId('Number & Operations', 'Fraction Division Word Problems')
    await connection.query(
      `UPDATE questions
       SET subtopic_name = 'Fraction Division Word Problems',
           subtopic_id = ?,
           topic_id = COALESCE(topic_id, ?),
           chapter_id = (SELECT id FROM chapters WHERE name = 'Number & Operations' LIMIT 1)
       WHERE id = 1687`,
      [sub1687.subtopicId, sub1687.topicId]
    )
    console.log('Fixed Question 1687 -> Fraction Division Word Problems')

    // Question 2096: 'A circle divided into 2 equal parts has:'
    const sub2096 = await getChildTopicId('Geometry', 'Halves & Fourths')
    await connection.query(
      `UPDATE questions
       SET subtopic_name = 'Halves & Fourths',
           subtopic_id = ?,
           topic_id = COALESCE(topic_id, ?),
           chapter_id = (SELECT id FROM chapters WHERE name = 'Geometry' LIMIT 1)
       WHERE id = 2096`,
      [sub2096.subtopicId, sub2096.topicId]
    )
    console.log('Fixed Question 2096 -> Halves & Fourths')

    // Question 2118: 'Which shape has four equal sides but may not have four right angles?'
    const sub2118 = await getChildTopicId('Geometry', 'Squares, Rectangles & Rhombuses')
    await connection.query(
      `UPDATE questions
       SET subtopic_name = 'Squares, Rectangles & Rhombuses',
           subtopic_id = ?,
           topic_id = COALESCE(topic_id, ?),
           chapter_id = (SELECT id FROM chapters WHERE name = 'Geometry' LIMIT 1)
       WHERE id = 2118`,
      [sub2118.subtopicId, sub2118.topicId]
    )
    console.log('Fixed Question 2118 -> Squares, Rectangles & Rhombuses')

    await connection.commit()
    console.log('\n--- Transaction Committed Successfully! ---')
  } catch (error) {
    await connection.rollback()
    console.error('Error during cleanup:', error)
    throw error
  } finally {
    connection.release()
  }

  console.log('\n--- Step 4: Verification ---')
  const [chapAfter] = await pool.query('SELECT id, name FROM chapters ORDER BY id')
  console.log('Chapters in database now:');
  console.table(chapAfter)

  const [qAfter] = await pool.query(`
    SELECT 
      COUNT(*) as total_questions,
      COUNT(subtopic_id) as with_subtopic_id,
      COUNT(subtopic_name) as with_subtopic_name,
      SUM(CASE WHEN subtopic_id IS NULL THEN 1 ELSE 0 END) as missing_subtopic_id,
      SUM(CASE WHEN subtopic_name IS NULL THEN 1 ELSE 0 END) as missing_subtopic_name
    FROM questions
  `)
  console.log('Questions status now:');
  console.table(qAfter)

  const [stCount] = await pool.query('SELECT COUNT(*) as total FROM subtopics')
  console.log(`Subtopics table count: ${stCount[0].total} (all intact)`)

  await pool.end()
}

run().catch(console.error)
