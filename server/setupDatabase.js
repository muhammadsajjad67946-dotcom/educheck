import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import { generateGrade7MCQs } from './insertGrade7MCQs.js'
import { generateGrade8MCQs } from './grade8Questions.js'
import { grade2Questions } from '../src/data/grade2Questions.js'
import { parseVisualMcqs } from '../src/utils/parseVisualMcqs.js'
import { parseGrade4Mcqs } from '../src/utils/parseGrade4Mcqs.js'
import { parseGrade5Mcqs } from '../src/utils/parseGrade5Mcqs.js'
import { parseGrade6Mcqs } from '../src/utils/parseGrade6Mcqs.js'
import { GRADE_FIVE_CURRICULUM, GRADE_ONE_TAXONOMY, GRADE_SIX_CURRICULUM, GRADE_SIX_DETAILED_CURRICULUM, GRADE_THREE_CURRICULUM, GRADE_THREE_TAXONOMY, GRADE_TWO_CURRICULUM, GRADE_TWO_TAXONOMY, inferGradeOneSubtopic } from '../src/utils/gradeOneTaxonomy.js'

const currentDirectory = path.dirname(fileURLToPath(import.meta.url))
const projectDirectory = path.resolve(currentDirectory, '..')
const schema = await fs.readFile(path.join(projectDirectory, 'database', 'schema.sql'), 'utf8')
const sourceQuestions = JSON.parse(await fs.readFile(path.join(projectDirectory, 'src', 'data', 'questions.json'), 'utf8'))
const visualGrade3Markdown = await fs.readFile(path.join(projectDirectory, 'src', 'data', 'EduCheck_170_Visual_MCQs.md'), 'utf8')
const grade4Markdown = await fs.readFile(path.join(projectDirectory, 'src', 'data', 'Grade4_Math_MCQs_Merged_Q1_to_Q250.txt'), 'utf8')
const grade5Source = JSON.parse(await fs.readFile(path.join(projectDirectory, 'src', 'data', 'grade5Questions.json'), 'utf8'))
const grade6Source = JSON.parse(await fs.readFile(path.join(projectDirectory, 'src', 'data', 'grade6Questions.json'), 'utf8'))
const gradeOneQuestions = sourceQuestions.map((question) => ({ ...question, grade: 1 }))
const grade3Questions = parseVisualMcqs(visualGrade3Markdown)
const grade4Questions = parseGrade4Mcqs(grade4Markdown)
const grade5Questions = parseGrade5Mcqs(grade5Source)
const grade6Questions = parseGrade6Mcqs(grade6Source)
const grade7Questions = (await generateGrade7MCQs()).map((question) => ({
  ...question,
  question: question.question,
  options: {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  },
  answer: String(question.correct_answer || '').toUpperCase(),
  difficulty: question.difficulty || 'Medium',
  grade: 7,
}))
const grade8Questions = generateGrade8MCQs().map((question) => ({
  ...question,
  question: question.question,
  options: {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  },
  answer: String(question.correct_answer || '').toUpperCase(),
  difficulty: question.difficulty || 'Medium',
  grade: 8,
}))
const questions = [...gradeOneQuestions, ...grade2Questions, ...grade3Questions, ...grade4Questions, ...grade5Questions, ...grade6Questions, ...grade7Questions, ...grade8Questions]

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
})

async function migrateForeignKeyColumns() {
  const databaseName = process.env.DB_NAME || 'educheck'
  await connection.query('CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', [databaseName])
  await connection.query('USE ??', [databaseName])

  const [existingTables] = await connection.query('SHOW TABLES LIKE ?', ['users'])
  if (!existingTables.length) {
    console.log(`Database ${databaseName} is empty. Proceeding with a fresh schema migration.`)
    return
  }

  const [userColumns] = await connection.query('SHOW COLUMNS FROM users')
  const hasCurrentUserShape = userColumns.some((column) => column.Field === 'name') && userColumns.some((column) => column.Field === 'password_hash')
  if (!hasCurrentUserShape) {
    const backupName = `${databaseName}_legacy_${new Date().toISOString().replace(/\D/g, '').slice(0, 14)}`
    await connection.query('CREATE DATABASE ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', [backupName])
    const [tables] = await connection.query('SHOW TABLES')
    const tableNames = tables.map((table) => Object.values(table)[0])
    if (tableNames.length) {
      const renameStatements = tableNames.map((tableName) => '??.?? TO ??.??').join(', ')
      const renameValues = tableNames.flatMap((tableName) => [databaseName, tableName, backupName, tableName])
      await connection.query(`RENAME TABLE ${renameStatements}`, renameValues)
    }
    await connection.query('CREATE DATABASE IF NOT EXISTS ?? CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci', [databaseName])
    await connection.query('USE ??', [databaseName])
    console.log(`Archived incompatible database as ${backupName}.`)
  }

  const [foreignKeys] = await connection.query(
    `SELECT DISTINCT kcu.TABLE_NAME AS tableName, kcu.CONSTRAINT_NAME AS constraintName,
            kcu.COLUMN_NAME AS columnName, kcu.REFERENCED_TABLE_NAME AS referencedTableName,
            kcu.REFERENCED_COLUMN_NAME AS referencedColumnName,
            childColumns.IS_NULLABLE AS isNullable
     FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
     JOIN INFORMATION_SCHEMA.COLUMNS childColumns
       ON childColumns.TABLE_SCHEMA = kcu.TABLE_SCHEMA
      AND childColumns.TABLE_NAME = kcu.TABLE_NAME
      AND childColumns.COLUMN_NAME = kcu.COLUMN_NAME
     JOIN INFORMATION_SCHEMA.COLUMNS parentColumns
       ON parentColumns.TABLE_SCHEMA = kcu.REFERENCED_TABLE_SCHEMA
      AND parentColumns.TABLE_NAME = kcu.REFERENCED_TABLE_NAME
      AND parentColumns.COLUMN_NAME = kcu.REFERENCED_COLUMN_NAME
     WHERE kcu.TABLE_SCHEMA = DATABASE()
       AND kcu.REFERENCED_TABLE_NAME IS NOT NULL`,
  )

  for (const foreignKey of foreignKeys) {
    await connection.query(
      `ALTER TABLE ?? DROP FOREIGN KEY ??`,
      [foreignKey.tableName, foreignKey.constraintName],
    )
  }

  const parentColumns = new Map(
    foreignKeys.map((foreignKey) => [
      `${foreignKey.referencedTableName}.${foreignKey.referencedColumnName}`,
      foreignKey,
    ]),
  )
  for (const foreignKey of parentColumns.values()) {
    await connection.query(
      `ALTER TABLE ?? MODIFY ?? BIGINT UNSIGNED NOT NULL AUTO_INCREMENT`,
      [foreignKey.referencedTableName, foreignKey.referencedColumnName],
    )
  }

  for (const foreignKey of foreignKeys) {
    const nullable = foreignKey.isNullable === 'YES' ? 'NULL' : 'NOT NULL'
    await connection.query(
      `ALTER TABLE ?? MODIFY ?? BIGINT UNSIGNED ${nullable}`,
      [foreignKey.tableName, foreignKey.columnName],
    )
  }
}

try {
  await migrateForeignKeyColumns()
  await connection.query(schema)
  await connection.query(`CREATE TABLE IF NOT EXISTS chapters (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    subject_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(255) NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_chapter_subject_name (subject_id, name),
    CONSTRAINT fk_chapter_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
  )`)
  await connection.query(`CREATE TABLE IF NOT EXISTS subtopics (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    chapter_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(160) NOT NULL,
    description VARCHAR(255) NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_subtopic_chapter_name (chapter_id, name),
    CONSTRAINT fk_subtopic_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
  )`)
  for (const [column, definition] of [
    ['chapter_id', 'BIGINT UNSIGNED NULL AFTER topic_id'],
    ['subtopic_id', 'BIGINT UNSIGNED NULL AFTER chapter_id'],
    ['subtopic_name', 'VARCHAR(160) NULL AFTER chapter_id'],
    ['explanation', 'TEXT NULL AFTER correct_answer'],
  ]) {
    try { await connection.query(`ALTER TABLE questions ADD COLUMN ?? ${definition}`, [column]) } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error
    }
  }
  try { await connection.query('ALTER TABLE questions ADD CONSTRAINT fk_question_subtopic FOREIGN KEY (subtopic_id) REFERENCES topics(id) ON DELETE SET NULL') } catch (error) {
    if (error.code !== 'ER_DUP_KEYNAME') throw error
  }
  try { await connection.query('ALTER TABLE questions ADD CONSTRAINT fk_question_chapter FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL') } catch (error) {
    if (error.code !== 'ER_DUP_KEYNAME') throw error
  }
  const [profileColumns] = await connection.query('SHOW COLUMNS FROM student_profiles')
  if (!profileColumns.some((column) => column.Field === 'actual_grade')) {
    await connection.query('ALTER TABLE student_profiles ADD COLUMN actual_grade VARCHAR(30) NULL AFTER grade')
  }
  const [attemptColumns] = await connection.query('SHOW COLUMNS FROM assessment_attempts')
  if (!attemptColumns.some((column) => column.Field === 'estimated_grade')) {
    await connection.query('ALTER TABLE assessment_attempts ADD COLUMN estimated_grade VARCHAR(30) NULL AFTER percentage')
  }
  const [topicColumns] = await connection.query('SHOW COLUMNS FROM topics')
  if (!topicColumns.some((column) => column.Field === 'parent_topic_id')) {
    await connection.query('ALTER TABLE topics ADD COLUMN parent_topic_id BIGINT UNSIGNED NULL AFTER subject_id')
    await connection.query('ALTER TABLE topics ADD CONSTRAINT fk_topic_parent FOREIGN KEY (parent_topic_id) REFERENCES topics(id) ON DELETE CASCADE')
  }
  if (!topicColumns.some((column) => column.Field === 'parent_topic_key')) {
    await connection.query('ALTER TABLE topics DROP INDEX uq_topic_subject')
    await connection.query('ALTER TABLE topics ADD COLUMN parent_topic_key BIGINT UNSIGNED AS (COALESCE(parent_topic_id, 0)) STORED AFTER name')
    await connection.query('ALTER TABLE topics ADD UNIQUE KEY uq_topic_parent_name (subject_id, parent_topic_key, name)')
  }
  await connection.beginTransaction()

  // The bundled bank is the source of truth for this replacement seed.
  await connection.query('DELETE FROM attempt_questions')
  await connection.query('DELETE FROM attempt_answers')
  await connection.query('DELETE FROM assessment_questions')
  await connection.query('DELETE FROM questions')

  const [subjectResult] = await connection.query(
    `INSERT INTO subjects (name, description) VALUES ('Math', 'Mathematics')
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
  )
  const subjectId = subjectResult.insertId
  const topicIds = new Map()
  const chapterIds = new Map()
  const subtopicIds = new Map()
  const gradeFiveTopicIds = new Map()
  const gradeSixTopicIds = new Map()

  async function insertTopic(name, parentTopicId = null) {
    const [result] = await connection.query(
      `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [subjectId, parentTopicId, name],
    )
    return result.insertId
  }

  async function insertChapter(name) {
    const [result] = await connection.query(
      `INSERT INTO chapters (subject_id, name) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [subjectId, name],
    )
    return result.insertId
  }

  async function insertSubtopic(chapterId, name) {
    const [result] = await connection.query(
      `INSERT INTO subtopics (chapter_id, name) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [chapterId, name],
    )
    return result.insertId
  }

  for (const topic of [...new Set(questions.map((question) => question.topic))]) {
    const [topicResult] = await connection.query(
      `INSERT INTO topics (subject_id, name) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [subjectId, topic],
    )
    topicIds.set(topic, topicResult.insertId)
    const chapterId = await insertChapter(topic)
    chapterIds.set(topic, chapterId)
    const subtopicNames = Object.keys(GRADE_TWO_CURRICULUM[topic] || {})
    const subtopics = [...new Set([...(Array.isArray(GRADE_ONE_TAXONOMY[topic]) ? GRADE_ONE_TAXONOMY[topic] : []), ...(GRADE_TWO_TAXONOMY[topic] || []), ...(GRADE_THREE_TAXONOMY[topic] || []), ...subtopicNames])]
    for (const subtopic of subtopics) {
      const [subtopicResult] = await connection.query(
        `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [subjectId, topicResult.insertId, subtopic],
      )
      subtopicIds.set(`${topic}:${subtopic}`, subtopicResult.insertId)
      await insertSubtopic(chapterId, subtopic)
    }
  }

  const curriculumTopicIds = new Map()
  for (const [domain, groups] of Object.entries(GRADE_TWO_CURRICULUM)) {
    const [domainResult] = await connection.query(
      `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, NULL, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [subjectId, domain],
    )
    curriculumTopicIds.set(domain, domainResult.insertId)
    for (const [group, leaves] of Object.entries(groups)) {
      const [groupResult] = await connection.query(
        `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [subjectId, domainResult.insertId, group],
      )
      curriculumTopicIds.set(`${domain}:${group}`, groupResult.insertId)
      for (const leaf of Object.keys(leaves)) {
        const [leafResult] = await connection.query(
          `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
          [subjectId, groupResult.insertId, leaf],
        )
        curriculumTopicIds.set(`${domain}:${group}:${leaf}`, leafResult.insertId)
      }
    }
  }

  const gradeThreeTopicIds = new Map()
  const [mathematicsResult] = await connection.query(
    `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, NULL, 'Mathematics')
     ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
    [subjectId],
  )
  for (const [domain, groups] of Object.entries(GRADE_THREE_CURRICULUM)) {
    const [domainResult] = await connection.query(
      `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [subjectId, mathematicsResult.insertId, domain],
    )
    for (const [group, leaves] of Object.entries(groups)) {
      const [groupResult] = await connection.query(
        `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
        [subjectId, domainResult.insertId, group],
      )
      gradeThreeTopicIds.set(`${domain}:${group}`, groupResult.insertId)
      for (const leaf of leaves) {
        await connection.query(
          `INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
          [subjectId, groupResult.insertId, leaf],
        )
      }
    }
  }

  const gradeFiveRootId = await insertTopic('Grade 5')
  for (const [domain, groups] of Object.entries(GRADE_FIVE_CURRICULUM)) {
    const domainId = await insertTopic(domain, gradeFiveRootId)
    for (const [group, leaves] of Object.entries(groups)) {
      const groupId = await insertTopic(group, domainId)
      const leafNames = Array.isArray(leaves) ? leaves : Object.keys(leaves)
      for (const leaf of leafNames) {
        const leafChildren = Array.isArray(leaves) ? [] : leaves[leaf]
        const leafId = await insertTopic(leaf, groupId)
        if (Array.isArray(leaves)) {
          gradeFiveTopicIds.set(`${domain}:${group}:${leaf}`, leafId)
        } else {
          for (const child of leafChildren) {
            const childId = await insertTopic(child, leafId)
            gradeFiveTopicIds.set(`${domain}:${group}:${child}`, childId)
          }
        }
      }
    }
  }

  const gradeSixRootId = await insertTopic('Grade 6')
  for (const [domain, groups] of Object.entries(GRADE_SIX_CURRICULUM)) {
    const domainId = await insertTopic(domain, gradeSixRootId)
    for (const [group, leaves] of Object.entries(groups)) {
      const groupId = await insertTopic(group, domainId)
      for (const leaf of leaves) {
        const leafId = await insertTopic(leaf, groupId)
        gradeSixTopicIds.set(`${domain}:${group}:${leaf}`, leafId)
      }
    }
  }

  for (const [domain, groups] of Object.entries(GRADE_SIX_DETAILED_CURRICULUM)) {
    const domainId = await insertTopic(domain, gradeSixRootId)
    for (const [group, leaves] of Object.entries(groups)) {
      const groupId = await insertTopic(group, domainId)
      for (const leaf of leaves) await insertTopic(leaf, groupId)
    }
  }

  let insertedQuestions = 0
  for (const question of questions) {
    const subtopic = question.subtopic || inferGradeOneSubtopic(question)
    const gradeTwoDomain = question.topic === 'Algebra' || question.topic === 'Number & Operations'
      ? 'Operations & Algebraic Thinking'
      : question.topic === 'Measurement' || question.topic === 'Data Analysis'
        ? 'Measurement & Data'
        : 'Geometry'
    const gradeTwoGroup = question.topic === 'Algebra'
      ? 'Addition & Subtraction Word Problems'
      : question.subtopic === 'Mental Addition & Subtraction'
        ? 'Add & Subtract Within 20'
        : question.subtopic === 'Counting & Number Representation'
          ? 'Odd & Even Numbers'
          : question.subtopic === 'Equal Groups & Rectangular Arrays'
            ? 'Equal Groups & Rectangular Arrays'
            : question.subtopic || subtopic
    const curriculumTopicId = question.grade === 2
      ? curriculumTopicIds.get(`${gradeTwoDomain}:${gradeTwoGroup}`) || curriculumTopicIds.get(gradeTwoDomain)
      : question.grade === 3 ? topicIds.get(question.topic) : null
    const gradeFiveTopicId = question.grade === 5
      ? gradeFiveTopicIds.get(`${question.domainKey}:${question.subtopic}:${question.leafTopic}`)
      : null
    const gradeSixTopicId = question.grade === 6
      ? gradeSixTopicIds.get(`${question.domainKey}:${question.subtopic}:${question.leafTopic}`)
      : null
    const options = question.options || {
      A: question.option_a,
      B: question.option_b,
      C: question.option_c,
      D: question.option_d,
    }
    const normalizedAnswer = String(question.answer || question.correct_answer || '').toUpperCase()
    const normalizedDifficulty = question.difficulty || 'Medium'
    const lessonTopicId = gradeSixTopicId || gradeFiveTopicId || curriculumTopicId || subtopicIds.get(`${question.topic}:${subtopic}`) || topicIds.get(question.topic)
    const chapterId = chapterIds.get(question.topic) || null

    await connection.query(
      `INSERT INTO questions
       (subject_id, topic_id, chapter_id, subtopic_name, question_text, grade, difficulty, option_a, option_b, option_c, option_d, correct_answer, explanation)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
      [
        subjectId,
        lessonTopicId,
        chapterId,
        subtopic,
        question.question,
        question.grade,
        normalizedDifficulty,
        options.A,
        options.B,
        options.C,
        options.D,
        normalizedAnswer,
        question.explanation || null,
      ],
    )
    insertedQuestions += 1
  }

  await connection.commit()
  console.log(`Database ready: ${questions.length} source questions, ${insertedQuestions} inserted.`)
} catch (error) {
  await connection.rollback()
  console.error(`Database setup failed: ${error.message}`)
  process.exitCode = 1
} finally {
  await connection.end()
}