const mysql = require('mysql2/promise');
require('dotenv').config();

const grade7QuestionsData = [
  // ----------------------------------------------------
  // LEVEL 1: LOW DIFFICULTY (Questions 1 to 7)
  // ----------------------------------------------------
  {
    difficulty: 'Low',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'What is -8 + 5?',
    option_a: '-3',
    option_b: '3',
    option_c: '-13',
    option_d: '13',
    correct_answer: 'A',
    explanation: 'When adding integers with different signs, subtract their absolute values (8 - 5 = 3) and keep the sign of the number with the larger absolute value (-8). Result = -3.',
    distractor_diagnostics: {
      B: {
        error: 'The student kept the positive sign instead of the negative sign from -8.',
        remediation: 'Since |-8| > |5|, the answer must take the negative sign: -3.'
      },
      C: {
        error: 'The student added the absolute values (8 + 5 = 13) instead of subtracting them.',
        remediation: 'When signs are different, subtract: 8 - 5 = 3, so -8 + 5 = -3.'
      },
      D: {
        error: 'The student added the numbers and made the answer positive.',
        remediation: 'Think of temperature: starting at -8 degrees and warming up 5 degrees leaves you at -3 degrees.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'Which pair of numbers are additive inverses (combine to equal 0)?',
    option_a: '14 and -14',
    option_b: '14 and 1/14',
    option_c: '-14 and -14',
    option_d: '0 and 14',
    correct_answer: 'A',
    explanation: 'Additive inverses are numbers that have the same distance from 0 but opposite signs: 14 + (-14) = 0.',
    distractor_diagnostics: {
      B: {
        error: 'The student selected multiplicative inverses (reciprocals) instead of additive inverses.',
        remediation: 'Additive inverses add to 0 (e.g., 14 + -14 = 0), while multiplicative inverses multiply to 1.'
      },
      C: {
        error: 'The student selected two identical negative numbers.',
        remediation: '-14 + (-14) = -28, not 0. Opposite signs are required to make 0.'
      },
      D: {
        error: 'The student included 0.',
        remediation: '0 + 14 = 14, not 0.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'What is (-6) × (-4)?',
    option_a: '24',
    option_b: '-24',
    option_c: '-10',
    option_d: '10',
    correct_answer: 'A',
    explanation: 'The product of two negative numbers is always positive: (-6) × (-4) = +24.',
    distractor_diagnostics: {
      B: {
        error: 'The student applied the negative sign to the product.',
        remediation: 'Remember the rule: negative × negative = POSITIVE (+24).'
      },
      C: {
        error: 'The student added -6 and -4 instead of multiplying them.',
        remediation: 'Multiply the numbers: 6 × 4 = 24. Since both are negative, the answer is +24.'
      },
      D: {
        error: 'The student added the numbers and changed the sign.',
        remediation: 'Multiply: 6 × 4 = 24.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'What is -36 ÷ 9?',
    option_a: '-4',
    option_b: '4',
    option_c: '-27',
    option_d: '-45',
    correct_answer: 'A',
    explanation: 'When dividing a negative number by a positive number, the quotient is always negative: -36 ÷ 9 = -4.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot to include the negative sign in the quotient.',
        remediation: 'When signs are different in division (negative ÷ positive), the quotient is always NEGATIVE.'
      },
      C: {
        error: 'The student subtracted 9 from -36 instead of dividing.',
        remediation: 'Divide 36 by 9 = 4, then apply the negative sign: -4.'
      },
      D: {
        error: 'The student added -36 and -9.',
        remediation: 'Follow the division operation: -36 ÷ 9 = -4.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'What is 5 - (-3)?',
    option_a: '8',
    option_b: '2',
    option_c: '-2',
    option_d: '-8',
    correct_answer: 'A',
    explanation: 'Subtracting a negative number is equivalent to adding its positive opposite: 5 - (-3) = 5 + 3 = 8.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 5 - 3 = 2, ignoring the double negative.',
        remediation: 'Remember: subtracting a negative turns into addition: minus a minus equals plus (5 + 3 = 8).'
      },
      C: {
        error: 'The student subtracted and made the answer negative.',
        remediation: 'Rewrite 5 - (-3) as 5 + 3, which equals positive 8.'
      },
      D: {
        error: 'The student added the numbers but made the answer negative.',
        remediation: 'Both terms become positive in 5 + 3 = 8.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Decimals',
    subtopic_id: 173,
    question_text: 'Which fraction converts to a terminating decimal?',
    option_a: '3/8',
    option_b: '1/3',
    option_c: '2/9',
    option_d: '1/6',
    correct_answer: 'A',
    explanation: '3 ÷ 8 = 0.375, which terminates (ends). 1/3 = 0.333..., 2/9 = 0.222..., and 1/6 = 0.1666... all repeat infinitely.',
    distractor_diagnostics: {
      B: {
        error: 'The student chose 1/3, which is a repeating decimal (0.333...).',
        remediation: 'A terminating decimal stops with a remainder of 0. Dividing 1 by 3 never ends.'
      },
      C: {
        error: 'The student chose 2/9, which repeats indefinitely (0.222...).',
        remediation: 'Denominators with prime factors other than 2 and 5 produce repeating decimals.'
      },
      D: {
        error: 'The student chose 1/6, which repeats (0.1666...).',
        remediation: 'Check by dividing: 3 ÷ 8 = 0.375 stops after 3 digits, so it is terminating.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'The temperature at 6:00 AM was -4°F. By noon, the temperature had risen by 9°F. What was the temperature at noon?',
    option_a: '5°F',
    option_b: '-13°F',
    option_c: '13°F',
    option_d: '-5°F',
    correct_answer: 'A',
    explanation: 'Start at -4 and add 9: -4 + 9 = 5°F.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 9 instead of adding ("risen" means add).',
        remediation: '"Risen" indicates an increase (+). Add 9 to -4: -4 + 9 = 5.'
      },
      C: {
        error: 'The student added 4 + 9 = 13, ignoring the starting negative sign.',
        remediation: 'Account for the negative start: you must pass through 0 to reach positive numbers.'
      },
      D: {
        error: 'The student gave the answer a negative sign.',
        remediation: 'Since the rise (+9) is greater than the cold (-4), the temperature ends above zero (+5°F).'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: MEDIUM DIFFICULTY (Questions 8 to 14)
  // ----------------------------------------------------
  {
    difficulty: 'Medium',
    subtopic_name: 'Fractions',
    subtopic_id: 172,
    question_text: 'What is -2/3 + 1/6?',
    option_a: '-1/2',
    option_b: '-1/3',
    option_c: '-3/6',
    option_d: '1/2',
    correct_answer: 'A',
    explanation: 'Common denominator is 6: -2/3 = -4/6. Then -4/6 + 1/6 = -3/6 = -1/2.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted the numerators without converting to a common denominator.',
        remediation: 'Convert -2/3 to -4/6 first. Then -4/6 + 1/6 = -3/6 = -1/2.'
      },
      C: {
        error: 'The student calculated -3/6 but forgot to reduce to simplest form (-1/2).',
        remediation: 'Always simplify fractions by dividing by the GCF: -3/6 = -1/2.'
      },
      D: {
        error: 'The student forgot the negative sign on the final answer.',
        remediation: 'Since |-4/6| > |1/6|, the result must remain negative (-1/2).'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'What is the distance between -9 and 4 on a number line?',
    option_a: '13 units',
    option_b: '5 units',
    option_c: '-5 units',
    option_d: '-13 units',
    correct_answer: 'A',
    explanation: 'Distance = |4 - (-9)| = |4 + 9| = 13 units.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 9 - 4 = 5 without considering they are on opposite sides of 0.',
        remediation: 'Distance between positive and negative numbers is found by adding their distances from 0: |-9| + |4| = 9 + 4 = 13.'
      },
      C: {
        error: 'The student subtracted and included a negative sign.',
        remediation: 'Distance on a number line is always a positive value.'
      },
      D: {
        error: 'The student calculated distance as a negative number.',
        remediation: 'Distance can never be negative: distance = 13 units.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Fractions',
    subtopic_id: 172,
    question_text: 'What is (-2/5) × (-5/8) in simplest form?',
    option_a: '1/4',
    option_b: '-1/4',
    option_c: '10/40',
    option_d: '1/2',
    correct_answer: 'A',
    explanation: 'Negative × negative = positive: (-2/5) × (-5/8) = +10/40 = 1/4.',
    distractor_diagnostics: {
      B: {
        error: 'The student made the answer negative.',
        remediation: 'Multiplying two negative fractions results in a POSITIVE fraction: (-)(-) = (+).'
      },
      C: {
        error: 'The student did not simplify 10/40.',
        remediation: 'Divide numerator and denominator by 10 to get 1/4.'
      },
      D: {
        error: 'The student made an error during simplification.',
        remediation: 'Cancel out 5s: 2/8 reduces to 1/4.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Decimals',
    subtopic_id: 173,
    question_text: 'Which fraction is equivalent to the repeating decimal 0.666...?',
    option_a: '2/3',
    option_b: '6/10',
    option_c: '3/5',
    option_d: '6/99',
    correct_answer: 'A',
    explanation: 'Let x = 0.666... Then 10x = 6.666... Subtracting gives 9x = 6, so x = 6/9 = 2/3.',
    distractor_diagnostics: {
      B: {
        error: 'The student treated 0.666... as a terminating decimal (0.6 = 6/10).',
        remediation: 'Repeating decimals have denominators of 9 (0.6 repeating = 6/9 = 2/3).'
      },
      C: {
        error: 'The student chose 3/5, which equals terminating decimal 0.6.',
        remediation: '3/5 = 0.6, while 2/3 = 0.666...'
      },
      D: {
        error: 'The student used 99 instead of 9 for a single repeating digit.',
        remediation: 'A single repeating digit has denominator 9 (6/9 = 2/3).'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Decimals',
    subtopic_id: 173,
    question_text: 'What is (-4.5) ÷ (-0.5)?',
    option_a: '9',
    option_b: '-9',
    option_c: '0.9',
    option_d: '2.25',
    correct_answer: 'A',
    explanation: 'Negative divided by negative is positive: (-4.5) ÷ (-0.5) = 45 ÷ 5 = 9.',
    distractor_diagnostics: {
      B: {
        error: 'The student applied a negative sign to the quotient.',
        remediation: 'Dividing two negative numbers always yields a POSITIVE answer.'
      },
      C: {
        error: 'The student misplaced the decimal point.',
        remediation: 'Shift the decimal 1 place in both numbers: 45 ÷ 5 = 9.'
      },
      D: {
        error: 'The student multiplied 4.5 by 0.5 instead of dividing.',
        remediation: 'Dividing by 0.5 is the same as multiplying by 2: 4.5 × 2 = 9.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'What is the value of -12 - 17 + 8?',
    option_a: '-21',
    option_b: '-37',
    option_c: '13',
    option_d: '-29',
    correct_answer: 'A',
    explanation: 'First: -12 - 17 = -29. Then: -29 + 8 = -21.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 8 instead of adding: -29 - 8 = -37.',
        remediation: 'Perform operations from left to right: -29 + 8 = -21.'
      },
      C: {
        error: 'The student lost all negative signs: 12 - 17 + 8 = 3.',
        remediation: 'Keep track of the negative signs: -12 and -17 combine to -29.'
      },
      D: {
        error: 'The student stopped after the first step (-12 - 17 = -29) and forgot to add 8.',
        remediation: 'Complete all steps in the expression: -29 + 8 = -21.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'A student bank account has a balance of $120. The student makes 4 withdrawals of $35 each. What is the new account balance?',
    option_a: '-$20',
    option_b: '$20',
    option_c: '-$140',
    option_d: '$0',
    correct_answer: 'A',
    explanation: 'Total withdrawn = 4 × 35 = $140. New balance = 120 - 140 = -$20.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 140 - 120 = 20 but omitted the negative sign.',
        remediation: 'Since more money was withdrawn ($140) than was in the account ($120), the balance is NEGATIVE (-$20).'
      },
      C: {
        error: 'The student calculated only the total withdrawals without starting balance.',
        remediation: 'Subtract withdrawals from the initial balance: 120 - 140 = -$20.'
      },
      D: {
        error: 'The student assumed the balance stops at 0.',
        remediation: 'Bank overdrafts result in negative balances.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: HIGH DIFFICULTY (Questions 15 to 20)
  // ----------------------------------------------------
  {
    difficulty: 'High',
    subtopic_name: 'Fractions',
    subtopic_id: 172,
    question_text: 'Which expression is NOT equivalent to -3/4?',
    option_a: '(-3)/(-4)',
    option_b: '-(3/4)',
    option_c: '(-3)/4',
    option_d: '3/(-4)',
    correct_answer: 'A',
    explanation: '(-3)/(-4) equals POSITIVE 3/4 because negative divided by negative is positive. All other choices equal -3/4.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought -(3/4) is not equal to -3/4.',
        remediation: 'Placing the negative sign in front of the fraction equals -3/4.'
      },
      C: {
        error: 'The student thought (-3)/4 is different.',
        remediation: 'A negative numerator makes the entire fraction negative.'
      },
      D: {
        error: 'The student thought 3/(-4) is different.',
        remediation: 'A negative denominator also makes the entire fraction negative.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Fractions',
    subtopic_id: 172,
    question_text: 'Simplify: -2 1/3 - (-1 1/2)',
    option_a: '-5/6',
    option_b: '-3 5/6',
    option_c: '5/6',
    option_d: '-1 1/6',
    correct_answer: 'A',
    explanation: 'Rewrite: -7/3 - (-3/2) = -7/3 + 3/2. Common denominator 6: -14/6 + 9/6 = -5/6.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 1 1/2 instead of adding it (-2 1/3 - 1 1/2 = -3 5/6).',
        remediation: 'Subtracting a negative becomes addition: -7/3 + 3/2 = -5/6.'
      },
      C: {
        error: 'The student dropped the negative sign.',
        remediation: 'Since |-14/6| > |9/6|, the answer remains negative (-5/6).'
      },
      D: {
        error: 'The student made an arithmetic error when combining fractional parts.',
        remediation: 'Convert mixed numbers to improper fractions before finding a common denominator.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'Evaluate: (-2)³ × (-1/4)',
    option_a: '2',
    option_b: '-2',
    option_c: '1/2',
    option_d: '-1/2',
    correct_answer: 'A',
    explanation: '(-2)³ = (-2) × (-2) × (-2) = -8. Then (-8) × (-1/4) = +8/4 = 2.',
    distractor_diagnostics: {
      B: {
        error: 'The student made the product negative.',
        remediation: 'Negative times negative equals positive: (-8) × (-1/4) = +2.'
      },
      C: {
        error: 'The student miscalculated 8 × 1/4 as 1/2.',
        remediation: '8 divided by 4 equals 2.'
      },
      D: {
        error: 'The student made a sign and arithmetic error.',
        remediation: 'Step 1: (-2)³ = -8. Step 2: (-8) × (-1/4) = 2.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Integers',
    subtopic_id: 171,
    question_text: 'A hiker starts at an elevation of 240 feet above sea level. He descends 85 feet each hour for 4 hours. What is his final elevation?',
    option_a: '-100 feet',
    option_b: '100 feet',
    option_c: '-340 feet',
    option_d: '-120 feet',
    correct_answer: 'A',
    explanation: 'Total descent = 4 × (-85) = -340 feet. Final elevation = 240 - 340 = -100 feet (100 feet below sea level).',
    distractor_diagnostics: {
      B: {
        error: 'The student omitted the negative sign (wrote +100 instead of -100).',
        remediation: 'He descended below sea level: 240 - 340 = -100 feet.'
      },
      C: {
        error: 'The student calculated only the total descent without starting from 240 feet.',
        remediation: 'Add the descent to the initial elevation: 240 + (-340) = -100 feet.'
      },
      D: {
        error: 'The student made an arithmetic error in 240 - 340.',
        remediation: 'Subtract 340 - 240 = 100, then attach the negative sign: -100 feet.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Decimals',
    subtopic_id: 173,
    question_text: 'What is the decimal representation of 5/11 using long division?',
    option_a: '0.4545... (repeating)',
    option_b: '0.45 (terminating)',
    option_c: '0.555... (repeating)',
    option_d: '0.455... (repeating)',
    correct_answer: 'A',
    explanation: 'Divide 5 ÷ 11: 5.0 ÷ 11 = 0.4 (rem 6). 60 ÷ 11 = 5 (rem 5). The cycle 45 repeats infinitely: 0.4545...',
    distractor_diagnostics: {
      B: {
        error: 'The student rounded to 2 decimal places and assumed it terminates.',
        remediation: 'The remainder repeats (6, then 5), meaning digits 45 repeat forever: 0.4545...'
      },
      C: {
        error: 'The student thought 5/11 repeats 5s.',
        remediation: 'Perform the long division: 5 ÷ 11 = 0.4545...'
      },
      D: {
        error: 'The student thought only the 5 repeats.',
        remediation: 'Both digits 4 and 5 repeat as a pair: 0.4545...'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Fractions',
    subtopic_id: 172,
    question_text: 'Evaluate: (-3/4 + 1/2) ÷ (-1/8)',
    option_a: '2',
    option_b: '-2',
    option_c: '1/32',
    option_d: '-1/32',
    correct_answer: 'A',
    explanation: 'Step 1: -3/4 + 2/4 = -1/4. Step 2: (-1/4) ÷ (-1/8) = (-1/4) × (-8/1) = +8/4 = 2.',
    distractor_diagnostics: {
      B: {
        error: 'The student made the answer negative.',
        remediation: 'Negative divided by negative is POSITIVE: (-1/4) ÷ (-1/8) = +2.'
      },
      C: {
        error: 'The student multiplied without taking the reciprocal: (-1/4) × (-1/8) = 1/32.',
        remediation: 'In fraction division, multiply by the reciprocal of the second fraction (flip -1/8 to -8/1).'
      },
      D: {
        error: 'The student multiplied without flipping and applied a negative sign.',
        remediation: 'Flip the divisor: (-1/4) × (-8/1) = 2.'
      }
    }
  }
];

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'neweducheck'
  });

  console.log(`Starting insertion of ${grade7QuestionsData.length} Grade 7 questions...`);

  let inserted = 0;
  let updated = 0;

  for (const q of grade7QuestionsData) {
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = 7',
      [q.question_text]
    );

    const diagnosticsJson = JSON.stringify(q.distractor_diagnostics);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE questions SET
          subject_id = 6,
          topic_id = 3,
          subtopic_name = ?,
          subtopic_id = ?,
          grade_id = 7,
          grade = 7,
          difficulty = ?,
          option_a = ?,
          option_b = ?,
          option_c = ?,
          option_d = ?,
          correct_answer = ?,
          explanation = ?,
          distractor_diagnostics = ?,
          status = 'active',
          is_active = 1
        WHERE id = ?`,
        [
          q.subtopic_name,
          q.subtopic_id,
          q.difficulty,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_answer,
          q.explanation,
          diagnosticsJson,
          existing[0].id
        ]
      );
      console.log(`Updated question ID ${existing[0].id}: "${q.question_text.substring(0, 35)}..."`);
      updated++;
    } else {
      const [res] = await pool.query(
        `INSERT INTO questions (
          subject_id, topic_id, chapter_id, subtopic_name, subtopic_id,
          grade_id, grade, difficulty, question_text,
          option_a, option_b, option_c, option_d,
          correct_answer, status, is_active, explanation, distractor_diagnostics
        ) VALUES (
          6, 3, NULL, ?, ?,
          7, 7, ?, ?,
          ?, ?, ?, ?,
          ?, 'active', 1, ?, ?
        )`,
        [
          q.subtopic_name,
          q.subtopic_id,
          q.difficulty,
          q.question_text,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_answer,
          q.explanation,
          diagnosticsJson
        ]
      );
      console.log(`Inserted question ID ${res.insertId}: "${q.question_text.substring(0, 35)}..."`);
      inserted++;
    }
  }

  console.log(`\nComplete! Inserted: ${inserted}, Updated: ${updated}, Total: ${grade7QuestionsData.length}`);

  const [totalG7Number] = await pool.query(
    'SELECT COUNT(*) as count FROM questions WHERE grade = 7 AND topic_id = 3 AND is_active = 1'
  );
  console.log(`Total active Grade 7 Number & Operations questions in DB: ${totalG7Number[0].count}`);

  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding Grade 7 questions:', err);
  process.exit(1);
});
