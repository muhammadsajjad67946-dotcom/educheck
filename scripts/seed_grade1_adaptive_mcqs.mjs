import 'dotenv/config'
import mysql from 'mysql2/promise'

const questionsData = [
  // Subtopic 1: Extend Counting Sequence to 120 (1.NBT.A.1)
  {
    subtopic: 'Extend Counting Sequence to 120',
    difficulty: 'Low',
    question: 'What number comes right after 58?',
    options: { A: '57', B: '59', C: '68', D: '60' },
    answer: 'B',
    explanation: 'When counting forward sequentially, 58 is followed by 59.',
    diagnostics: {
      A: { error: 'Student counted backward instead of forward.', remediation: 'Practice forward number sequence on a number line.' },
      C: { error: 'Student incremented the tens digit instead of the ones digit.', remediation: 'Review sequential counting within the same decade.' },
      D: { error: 'Student confused sequence with rounding up to the next decade.', remediation: 'Reinforce that 58 is followed by 59 before reaching 60.' }
    }
  },
  {
    subtopic: 'Extend Counting Sequence to 120',
    difficulty: 'Medium',
    question: 'What number comes immediately after 109?',
    options: { A: '100', B: '110', C: '1010', D: '200' },
    answer: 'B',
    explanation: 'After 109, counting forward by ones reaches 110.',
    diagnostics: {
      A: { error: 'Student reverted to the century base instead of counting forward.', remediation: 'Practice crossing decade transitions past 100.' },
      C: { error: "Place-value syntax error: concatenated '10' next to '100'.", remediation: 'Use 3-digit place value cards to illustrate 110.' },
      D: { error: 'Century boundary misconception: skipped to next hundred (200).', remediation: 'Practice oral counting from 100 to 120.' }
    }
  },
  {
    subtopic: 'Extend Counting Sequence to 120',
    difficulty: 'High',
    question: 'Ali is counting: 114, 115, ___, 117, 118. Which number is missing?',
    options: { A: '116', B: '126', C: '119', D: '161' },
    answer: 'A',
    explanation: 'The number between 115 and 117 in sequential counting is 116.',
    diagnostics: {
      B: { error: 'Student changed the tens digit (126) instead of keeping decade 110.', remediation: 'Reinforce maintaining the hundreds and tens place while counting ones.' },
      C: { error: 'Student placed the terminal number instead of the intermediate missing value.', remediation: 'Use missing number strips on a 120-chart.' },
      D: { error: 'Digit reversal / spatial inversion error (161 instead of 116).', remediation: 'Practice number writing and numeral recognition drills.' }
    }
  },

  // Subtopic 2: Understand Place Value - Tens & Ones (1.NBT.B.2)
  {
    subtopic: 'Understand Place Value - Tens & Ones',
    difficulty: 'Low',
    question: 'A teacher ties 10 pencils in one bundle. If she has 3 bundles, how many pencils does she have in total?',
    options: { A: '3', B: '13', C: '30', D: '300' },
    answer: 'C',
    explanation: 'Each bundle is 1 ten. 3 bundles of 10 equal 30 pencils.',
    diagnostics: {
      A: { error: 'Student counted the number of bundles rather than total units.', remediation: 'Use base-10 ten-rods to demonstrate each bundle equals 10 individual units.' },
      B: { error: 'Student added 10 and 3 together rather than grouping three tens.', remediation: 'Practice skip-counting by 10s: 10, 20, 30.' },
      D: { error: 'Magnitude exaggeration: assigned hundreds value to tens.', remediation: 'Differentiate between tens and hundreds bundles.' }
    }
  },
  {
    subtopic: 'Understand Place Value - Tens & Ones',
    difficulty: 'Medium',
    question: 'In the number 72, what does the digit 7 represent?',
    options: { A: '7 ones', B: '7 tens (70)', C: '2 tens', D: '700' },
    answer: 'B',
    explanation: 'In a 2-digit number, the left digit is the tens place. 7 represents 7 tens or 70.',
    diagnostics: {
      A: { error: 'Position blindness: treated the left digit as ones.', remediation: 'Introduce a two-column Tens & Ones T-chart.' },
      C: { error: 'Interchanged the identity of tens and ones digits.', remediation: 'Reinforce left-to-right reading of two-digit numbers (Tens first, Ones second).' },
      D: { error: 'Assigned hundreds place value to a 2-digit number.', remediation: 'Limit place-value column identification to two digits.' }
    }
  },
  {
    subtopic: 'Understand Place Value - Tens & Ones',
    difficulty: 'High',
    question: 'Which equation correctly breaks down the number 16?',
    options: { A: '1 + 6', B: '10 + 6', C: '60 + 1', D: '10 + 60' },
    answer: 'B',
    explanation: 'The number 16 is composed of 1 ten (10) and 6 ones (6), so 16 = 10 + 6.',
    diagnostics: {
      A: { error: 'Face-value misconception: treated the digit 1 as single unit instead of a ten.', remediation: 'Demonstrate teen numbers as one group of ten plus extra ones using double ten-frames.' },
      C: { error: 'Reversed place value decomposition (60 + 1).', remediation: 'Use expanded form decomposition cards.' },
      D: { error: 'Excessive place-value expansion.', remediation: 'Review that 16 is less than 20.' }
    }
  },

  // Subtopic 3: Compare Two-Digit Numbers (1.NBT.B.3)
  {
    subtopic: 'Compare Two-Digit Numbers',
    difficulty: 'Low',
    question: 'Which statement is TRUE?',
    options: { A: '4 tens = 40', B: '4 tens = 4', C: '4 tens = 14', D: '4 tens = 400' },
    answer: 'A',
    explanation: 'Four tens means 4 groups of 10, which equals 40.',
    diagnostics: {
      B: { error: "Ignored unit word 'tens' and focused solely on digit 4.", remediation: 'Practice verbalizing unit values: 1 ten = 10, 2 tens = 20, 4 tens = 40.' },
      C: { error: 'Confused decade value with teen number 14.', remediation: 'Contrast teen numbers (14) with decade multiples (40).' },
      D: { error: 'Appended two zeros instead of one for tens.', remediation: 'Review zero-padding rules for base-10 multiples.' }
    }
  },
  {
    subtopic: 'Compare Two-Digit Numbers',
    difficulty: 'Medium',
    question: 'Which symbol correctly compares these numbers?  62 ___ 49',
    options: { A: '<', B: '>', C: '=', D: '+' },
    answer: 'B',
    explanation: 'Compare the tens digits first: 6 tens is greater than 4 tens, so 62 > 49.',
    diagnostics: {
      A: { error: 'Looked only at the ones digits (9 vs 2) and erroneously concluded 49 is larger.', remediation: "Teach rule: 'Always compare the tens place first when comparing two-digit numbers.'" },
      C: { error: 'Equal sign misuse: failed to distinguish distinct numerical magnitudes.', remediation: 'Review the definition and balance meaning of the equal sign.' },
      D: { error: 'Selected an arithmetic operator instead of a comparison symbol.', remediation: 'Clarify difference between operations (+, -) and comparisons (<, >, =).' }
    }
  },
  {
    subtopic: 'Compare Two-Digit Numbers',
    difficulty: 'High',
    question: 'Sara has 83 stickers and Bilal has 87 stickers. Which statement is correct?',
    options: { A: '83 > 87', B: '87 > 83', C: '83 = 87', D: '87 < 83' },
    answer: 'B',
    explanation: 'Both have 8 tens, but 87 has 7 ones while 83 has 3 ones. 87 is greater than 83 (87 > 83).',
    diagnostics: {
      A: { error: 'Comparison symbol direction inverted (alligator mouth pointed to smaller number).', remediation: 'Use the visual alligator mnemonic: the open mouth always faces the larger value.' },
      C: { error: 'Determined equality based on identical tens without comparing ones digits.', remediation: 'Teach tie-breaker rule: when tens digits match, compare the ones digits.' },
      D: { error: "Selected 'less than' symbol for a greater quantity.", remediation: 'Reinforce left-to-right reading of comparison statements.' }
    }
  },

  // Subtopic 4: Mental Math - 10 More & 10 Less (1.NBT.C.5)
  {
    subtopic: 'Mental Math - 10 More & 10 Less',
    difficulty: 'Low',
    question: 'What is 10 more than 40?',
    options: { A: '41', B: '50', C: '30', D: '60' },
    answer: 'B',
    explanation: '40 has 4 tens. 10 more adds 1 ten, making 5 tens or 50.',
    diagnostics: {
      A: { error: 'Added 1 to the ones place instead of adding 10 to the tens place.', remediation: 'Contrast adding 1 (one unit) versus adding 10 (one ten-rod).' },
      C: { error: "Confused 'more' with 'less' and performed subtraction.", remediation: "Reinforce directional math keywords: 'more' means increase, 'less' means decrease." },
      D: { error: 'Added 20 instead of 10.', remediation: 'Practice single-step skip counting by tens.' }
    }
  },
  {
    subtopic: 'Mental Math - 10 More & 10 Less',
    difficulty: 'Medium',
    question: 'What is 10 more than 64?',
    options: { A: '65', B: '74', C: '54', D: '84' },
    answer: 'B',
    explanation: 'Adding 10 increases only the tens digit from 6 to 7, while the ones digit stays 4 (74).',
    diagnostics: {
      A: { error: 'Student added 1 to the ones column instead of 10 to the tens column.', remediation: 'Practice vertical movement on a 100-chart where one row down equals +10.' },
      C: { error: 'Subtracted 10 instead of adding 10.', remediation: "Reinforce that '10 more' increases the tens digit by 1." },
      D: { error: 'Incremented tens digit by 2 instead of 1.', remediation: 'Practice single-decade jumps from arbitrary bases.' }
    }
  },
  {
    subtopic: 'Mental Math - 10 More & 10 Less',
    difficulty: 'High',
    question: 'I am thinking of a number. It is 10 less than 92. What is my number?',
    options: { A: '91', B: '82', C: '102', D: '72' },
    answer: 'B',
    explanation: '10 less than 92 decreases the tens digit from 9 to 8, resulting in 82.',
    diagnostics: {
      A: { error: 'Subtracted 1 from ones place rather than subtracting 10 from tens place.', remediation: 'Use 100s chart vertical upward jump (one row up = -10).' },
      C: { error: 'Added 10 instead of taking away 10.', remediation: "Clarify that 'less' means going backward on the number track." },
      D: { error: 'Subtracted 20 instead of 10.', remediation: 'Check mental subtraction step-by-step: 9 tens minus 1 ten = 8 tens.' }
    }
  },

  // Subtopic 5: Place Value Addition & Subtraction (1.NBT.C.4 & 1.NBT.C.6)
  {
    subtopic: 'Place Value Addition & Subtraction',
    difficulty: 'Low',
    question: 'What is 70 – 30?',
    options: { A: '40', B: '50', C: '4', D: '100' },
    answer: 'A',
    explanation: '7 tens minus 3 tens equals 4 tens (40).',
    diagnostics: {
      B: { error: 'Calculation error in subtracting single-digit decade heads (did 7 - 2 instead of 7 - 3).', remediation: 'Use fingers or counters to confirm 7 minus 3 equals 4.' },
      C: { error: 'Omitted the tens place value (wrote 4 instead of 40).', remediation: 'Remind student that 4 tens equals 40.' },
      D: { error: 'Added 70 and 30 instead of subtracting.', remediation: 'Focus on identifying minus sign (-) as take away.' }
    }
  },
  {
    subtopic: 'Place Value Addition & Subtraction',
    difficulty: 'Medium',
    question: 'What is 34 + 5?',
    options: { A: '39', B: '84', C: '49', D: '38' },
    answer: 'A',
    explanation: 'Add ones to ones: 4 + 5 = 9. The tens remain 3. Total is 39.',
    diagnostics: {
      B: { error: 'Added single-digit 5 to the tens place (3 + 5 = 8) instead of the ones place.', remediation: 'Teach vertical alignment: ones must always be added to ones.' },
      C: { error: 'Added 5 to ones but also erroneously incremented the tens digit.', remediation: 'Emphasize that when ones sum is less than 10, the tens digit stays unchanged.' },
      D: { error: 'Counting error by 1 during single-digit addition.', remediation: 'Practice counting on from 34: 35, 36, 37, 38, 39.' }
    }
  },
  {
    subtopic: 'Place Value Addition & Subtraction',
    difficulty: 'High',
    question: 'A shop has 43 red balls and 30 blue balls. How many balls are there in total?',
    options: { A: '46', B: '73', C: '70', D: '83' },
    answer: 'B',
    explanation: 'Add tens to tens: 4 tens + 3 tens = 7 tens. 3 ones + 0 ones = 3 ones. Total is 73.',
    diagnostics: {
      A: { error: 'Added the digit 3 of 30 to the ones column instead of tens column.', remediation: 'Break down 30 into 3 tens, and add to the 4 tens of 43.' },
      C: { error: 'Added tens correctly (40 + 30 = 70) but forgot to include the 3 ones.', remediation: 'Practice recombining decomposed numbers: 70 tens + 3 ones = 73.' },
      D: { error: 'Miscalculated decade addition (4 + 3 = 8).', remediation: 'Review single-digit basic addition facts: 4 + 3 = 7.' }
    }
  },

  // 3 Targeted Diagnostic Questions
  {
    subtopic: 'Understand Place Value - Tens & Ones',
    difficulty: 'Medium',
    question: 'Look at the base-10 blocks: There are 2 rods of ten and 6 small unit cubes. What number is shown?',
    options: { A: '8', B: '62', C: '26', D: '206' },
    answer: 'C',
    explanation: '2 rods of ten = 20, and 6 unit cubes = 6. 20 + 6 = 26.',
    diagnostics: {
      A: { error: 'Place-value blindness: counted total items (2 + 6 = 8) ignoring that rods represent ten each.', remediation: 'Physically count individual squares on a ten-rod to demonstrate it equals 10.' },
      B: { error: 'Spatial/digit inversion: placed ones count in the tens position (62 instead of 26).', remediation: 'Use two-pocket place value mats (Tens on left, Ones on right).' },
      D: { error: 'Literal concatenation: wrote 20 followed by 6 creating 206.', remediation: 'Use overlay cards to demonstrate how 6 ones replaces the zero in 20.' }
    }
  },
  {
    subtopic: 'Mental Math - 10 More & 10 Less',
    difficulty: 'High',
    question: 'A farmer has 53 sheep. He sells 10 sheep. How many sheep are left?',
    options: { A: '52', B: '43', C: '63', D: '35' },
    answer: 'B',
    explanation: 'Selling 10 sheep from 53 means subtracting 10: 53 - 10 = 43.',
    diagnostics: {
      A: { error: 'Subtracted 1 from the ones column (53 - 1 = 52) instead of subtracting 10 from tens column.', remediation: "Highlight that selling '10' reduces the tens digit by one." },
      C: { error: "Added 10 instead of subtracting, misinterpreting the keyword 'sells'.", remediation: 'Clarify that selling or losing items means subtraction.' },
      D: { error: 'Digit reversal: inverted the digits of 53 to 35.', remediation: 'Practice writing numbers from left to right.' }
    }
  },
  {
    subtopic: 'Unknown Addends & Equations',
    difficulty: 'Medium',
    question: 'Which number makes this equation true?  6 + ___ = 10',
    options: { A: '16', B: '4', C: '5', D: '60' },
    answer: 'B',
    explanation: '6 + 4 = 10, so the missing number is 4.',
    diagnostics: {
      A: { error: 'Operation impulse: saw plus sign and added both visible numbers (6 + 10 = 16) instead of finding the missing addend.', remediation: 'Use a balance beam or ten-frame to show that 6 plus something must equal 10.' },
      C: { error: 'Inaccurate counting on: miscounted by 1 while counting up from 6 to 10.', remediation: 'Practice counting on fingers: 6 in head, 7, 8, 9, 10 (4 fingers).' },
      D: { error: 'Appended zero to create 60 without understanding equality.', remediation: 'Reinforce that the equal sign means both sides have the same value.' }
    }
  }
]

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'educheck'
  })

  console.log('Connecting to database...')
  const conn = await pool.getConnection()

  try {
    // 1. Ensure columns exist
    console.log('Ensuring distractor_diagnostics column exists...')
    const [qCols] = await conn.query('SHOW COLUMNS FROM questions')
    if (!qCols.some(c => c.Field === 'distractor_diagnostics')) {
      await conn.query('ALTER TABLE questions ADD COLUMN distractor_diagnostics JSON NULL AFTER explanation')
      console.log('Added distractor_diagnostics column to questions table.')
    }

    if (!qCols.some(c => c.Field === 'image_url')) {
      await conn.query('ALTER TABLE questions ADD COLUMN image_url VARCHAR(255) NULL AFTER question_text')
      console.log('Added image_url column to questions table.')
    }

    const [aCols] = await conn.query('SHOW COLUMNS FROM attempt_answers')
    if (!aCols.some(c => c.Field === 'diagnosed_gap')) {
      await conn.query('ALTER TABLE attempt_answers ADD COLUMN diagnosed_gap VARCHAR(255) NULL, ADD COLUMN recommended_action VARCHAR(255) NULL')
      console.log('Added diagnosed_gap and recommended_action columns to attempt_answers table.')
    }

    // 2. Resolve Main Topic (Number & Operations)
    let [mainTopics] = await conn.query('SELECT id FROM topics WHERE name = ? LIMIT 1', ['Number & Operations'])
    let mainTopicId = mainTopics[0]?.id
    if (!mainTopicId) {
      const [ins] = await conn.query('INSERT INTO topics (subject_id, name) VALUES (1, ?)', ['Number & Operations'])
      mainTopicId = ins.insertId
    }

    // 3. Resolve Subtopics Map
    const subtopicMap = new Map()
    for (const q of questionsData) {
      if (!subtopicMap.has(q.subtopic)) {
        const [existing] = await conn.query(
          'SELECT id FROM topics WHERE name = ? AND parent_topic_id = ? LIMIT 1',
          [q.subtopic, mainTopicId]
        )
        if (existing.length > 0) {
          subtopicMap.set(q.subtopic, existing[0].id)
        } else {
          const [ins] = await conn.query(
            'INSERT INTO topics (subject_id, parent_topic_id, name) VALUES (1, ?, ?)',
            [mainTopicId, q.subtopic]
          )
          subtopicMap.set(q.subtopic, ins.insertId)
          console.log(`Created subtopic: "${q.subtopic}" (ID: ${ins.insertId})`)
        }
      }
    }

    // 4. Insert Questions safely (skip if question_text already exists)
    let inserted = 0
    let updated = 0

    for (const q of questionsData) {
      const [exists] = await conn.query(
        'SELECT id FROM questions WHERE question_text = ? AND grade = 1 LIMIT 1',
        [q.question]
      )

      if (exists.length > 0) {
        // Update distractor diagnostics and subtopic just in case
        await conn.query(
          `UPDATE questions 
           SET topic_id = ?, subtopic_id = ?, subtopic_name = ?, difficulty = ?, 
               option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, 
               explanation = ?, distractor_diagnostics = ?
           WHERE id = ?`,
          [
            mainTopicId,
            subtopicMap.get(q.subtopic),
            q.subtopic,
            q.difficulty,
            q.options.A,
            q.options.B,
            q.options.C,
            q.options.D,
            q.answer,
            q.explanation,
            JSON.stringify(q.diagnostics),
            exists[0].id
          ]
        )
        updated++
      } else {
        await conn.query(
          `INSERT INTO questions (
            subject_id, topic_id, subtopic_id, subtopic_name, grade, grade_id, difficulty,
            question_text, option_a, option_b, option_c, option_d, correct_answer,
            explanation, distractor_diagnostics, status
          ) VALUES (?, ?, ?, ?, 1, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
          [
            1,
            mainTopicId,
            subtopicMap.get(q.subtopic),
            q.subtopic,
            q.difficulty,
            q.question,
            q.options.A,
            q.options.B,
            q.options.C,
            q.options.D,
            q.answer,
            q.explanation,
            JSON.stringify(q.diagnostics)
          ]
        )
        inserted++
      }
    }

    console.log(`\n--- Seeding Complete ---`)
    console.log(`New questions inserted: ${inserted}`)
    console.log(`Existing questions updated: ${updated}`)
    console.log(`Total processed: ${questionsData.length}`)
  } catch (err) {
    console.error('Error seeding questions:', err)
  } finally {
    conn.release()
    await pool.end()
    process.exit(0)
  }
}

seed()
