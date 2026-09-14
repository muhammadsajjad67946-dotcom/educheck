const mysql = require('mysql2/promise');
require('dotenv').config();

const grade5QuestionsData = [
  // ----------------------------------------------------
  // LEVEL 1: LOW DIFFICULTY (Questions 1 to 7)
  // ----------------------------------------------------
  {
    difficulty: 'Low',
    subtopic_name: 'Place Value & Powers of 10',
    subtopic_id: 161,
    question_text: 'What is 4.5 × 10?',
    option_a: '45',
    option_b: '4.50',
    option_c: '0.45',
    option_d: '450',
    correct_answer: 'A',
    explanation: 'Multiplying by 10 moves the decimal point 1 place to the right: 4.5 × 10 = 45.',
    distractor_diagnostics: {
      B: {
        error: 'The student added a zero at the end without moving the decimal point.',
        remediation: 'When multiplying by 10, move the decimal point 1 place to the right.'
      },
      C: {
        error: 'The student moved the decimal point to the left instead of the right.',
        remediation: 'Multiplying makes a number larger, so move the decimal point to the right.'
      },
      D: {
        error: 'The student moved the decimal point 2 places instead of 1.',
        remediation: 'Count the zeros in 10: there is 1 zero, so move the decimal 1 place to the right.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Decimals to Thousandths',
    subtopic_id: 161,
    question_text: 'Which symbol makes this statement true: 0.6 __ 0.09?',
    option_a: '>',
    option_b: '<',
    option_c: '=',
    option_d: '+',
    correct_answer: 'A',
    explanation: 'Compare the tenths place: 0.6 has 6 tenths, while 0.09 has 0 tenths. Since 6 tenths > 0 tenths, 0.6 > 0.09.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought 0.09 is larger because 9 is greater than 6.',
        remediation: 'Compare the tenths place first: 6 tenths is much larger than 0 tenths.'
      },
      C: {
        error: 'The student assumed the numbers are equal.',
        remediation: 'Line up the decimal points to compare place values column by column.'
      },
      D: {
        error: 'The student selected an operation symbol instead of a comparison symbol.',
        remediation: 'Use the > symbol when the number on the left is larger.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Rounding Decimals',
    subtopic_id: 161,
    question_text: 'What is 3.74 rounded to the nearest tenth?',
    option_a: '3.7',
    option_b: '3.8',
    option_c: '4.0',
    option_d: '3.70',
    correct_answer: 'A',
    explanation: 'The tenths digit is 7. The hundredths digit is 4. Since 4 < 5, round down: 3.7.',
    distractor_diagnostics: {
      B: {
        error: 'The student rounded up even though the hundredths digit is 4.',
        remediation: 'Remember: if the next digit is 4 or less, keep the target digit the same (round down).'
      },
      C: {
        error: 'The student rounded to the nearest whole number instead of the nearest tenth.',
        remediation: 'Nearest tenth means keeping 1 digit after the decimal point.'
      },
      D: {
        error: 'The student kept the extra zero instead of rounding to tenths.',
        remediation: 'Rounding to tenths gives a single decimal place (3.7).'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multi-Digit & Decimal Operations',
    subtopic_id: 162,
    question_text: 'What is 2.4 + 1.35?',
    option_a: '3.75',
    option_b: '1.59',
    option_c: '3.39',
    option_d: '3.9',
    correct_answer: 'A',
    explanation: 'Line up decimals: 2.40 + 1.35 = 3.75.',
    distractor_diagnostics: {
      B: {
        error: 'The student lined up digits from the right without aligning decimal points.',
        remediation: 'Always line up the decimal points before adding: 2.40 + 1.35 = 3.75.'
      },
      C: {
        error: 'The student added ones to tenths without aligning place values.',
        remediation: 'Put a placeholder 0 at the end of 2.4 to make it 2.40.'
      },
      D: {
        error: 'The student misadded the decimal parts.',
        remediation: 'Add hundredths first (0 + 5 = 5), then tenths (4 + 3 = 7).'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Fraction Addition & Subtraction',
    subtopic_id: 163,
    question_text: 'What is 2/5 + 1/5?',
    option_a: '3/5',
    option_b: '3/10',
    option_c: '2/10',
    option_d: '3/25',
    correct_answer: 'A',
    explanation: 'When denominators are the same, add numerators: 2 + 1 = 3, keeping denominator 5. Answer = 3/5.',
    distractor_diagnostics: {
      B: {
        error: 'The student added both numerators and denominators across.',
        remediation: 'When denominators are the same, add only the top numbers (numerators) and keep the denominator.'
      },
      C: {
        error: 'The student multiplied the numerators and added denominators.',
        remediation: 'Add the numerators: 2 + 1 = 3.'
      },
      D: {
        error: 'The student squared the denominator.',
        remediation: 'Keep the common denominator unchanged (5).'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Fraction Multiplication & Division',
    subtopic_id: 165,
    question_text: 'What is 1/2 × 3/4?',
    option_a: '3/8',
    option_b: '4/6',
    option_c: '3/6',
    option_d: '2/8',
    correct_answer: 'A',
    explanation: 'Multiply top numbers (1 × 3 = 3) and bottom numbers (2 × 4 = 8) = 3/8.',
    distractor_diagnostics: {
      B: {
        error: 'The student added across instead of multiplying.',
        remediation: 'Multiply top numbers together (1 × 3 = 3) and bottom numbers together (2 × 4 = 8).'
      },
      C: {
        error: 'The student multiplied only the numerators and added denominators.',
        remediation: 'Multiply both the top numbers and the bottom numbers.'
      },
      D: {
        error: 'The student made a multiplication fact error.',
        remediation: 'Multiply 1 × 3 = 3 for the numerator.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Fraction Multiplication & Division',
    subtopic_id: 165,
    question_text: 'What is 3 ÷ (1/4)?',
    option_a: '12',
    option_b: '3/4',
    option_c: '1/12',
    option_d: '7',
    correct_answer: 'A',
    explanation: 'There are 4 fourths in each whole. In 3 wholes, there are 3 × 4 = 12 fourths.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied 3 by 1/4 instead of dividing.',
        remediation: 'Think: how many 1/4 pieces are in 3 wholes? There are 4 pieces per whole, so 3 × 4 = 12.'
      },
      C: {
        error: 'The student inverted the answer (confused 3 ÷ 1/4 with 1/4 ÷ 3).',
        remediation: 'Dividing a whole number by a fraction smaller than 1 gives a larger answer.'
      },
      D: {
        error: 'The student added 3 + 4 instead of multiplying.',
        remediation: 'Multiply the whole number by the denominator: 3 × 4 = 12.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: MEDIUM DIFFICULTY (Questions 8 to 14)
  // ----------------------------------------------------
  {
    difficulty: 'Medium',
    subtopic_name: 'Place Value & Powers of 10',
    subtopic_id: 161,
    question_text: 'What is the value of 5.2 × 10³?',
    option_a: '5,200',
    option_b: '520',
    option_c: '52,000',
    option_d: '0.0052',
    correct_answer: 'A',
    explanation: '10³ = 1,000. Multiplying 5.2 by 1,000 moves the decimal point 3 places to the right: 5,200.',
    distractor_diagnostics: {
      B: {
        error: 'The student moved the decimal point 2 places instead of 3.',
        remediation: 'The exponent 3 means multiply by 1,000 (move the decimal point 3 places to the right).'
      },
      C: {
        error: 'The student moved the decimal point 4 places.',
        remediation: 'Move the decimal exactly 3 places to the right: 5.2 -> 52 -> 520 -> 5,200.'
      },
      D: {
        error: 'The student divided by 10^3 instead of multiplying.',
        remediation: 'Multiplication by positive powers of 10 makes the number larger.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Decimals to Thousandths',
    subtopic_id: 161,
    question_text: 'Which decimal represents (7 × 10) + (3 × 1) + (4 × 1/10) + (8 × 1/1000)?',
    option_a: '73.408',
    option_b: '73.48',
    option_c: '73.480',
    option_d: '73.048',
    correct_answer: 'A',
    explanation: 'Tens = 7, Ones = 3, Tenths = 4, Hundredths = 0, Thousandths = 8. Decimal is 73.408.',
    distractor_diagnostics: {
      B: {
        error: 'The student omitted the placeholder zero in the hundredths place.',
        remediation: 'There are no hundredths (1/100), so put a 0 in the hundredths place: 73.408.'
      },
      C: {
        error: 'The student put the zero in the thousandths place instead of hundredths.',
        remediation: '8 is multiplied by 1/1000, so 8 belongs in the third decimal place.'
      },
      D: {
        error: 'The student placed the zero in the tenths place.',
        remediation: '4 is multiplied by 1/10, so 4 is in the tenths place.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit & Decimal Operations',
    subtopic_id: 162,
    question_text: 'What is 245 × 18?',
    option_a: '4,410',
    option_b: '4,310',
    option_c: '2,410',
    option_d: '4,400',
    correct_answer: 'A',
    explanation: '245 × 8 = 1,960. 245 × 10 = 2,450. Adding partial products: 1,960 + 2,450 = 4,410.',
    distractor_diagnostics: {
      B: {
        error: 'The student made a carrying addition error in the hundreds column.',
        remediation: 'Check each partial product: 245 × 8 = 1,960 and 245 × 10 = 2,450. Then add: 1,960 + 2,450 = 4,410.'
      },
      C: {
        error: 'The student forgot the first partial product.',
        remediation: 'Multiply by both digits (ones and tens), then add both rows together.'
      },
      D: {
        error: 'The student miscalculated 5 × 8 in the ones place.',
        remediation: 'Multiply 245 × 8 = 1,960 carefully before adding the second row.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit & Decimal Operations',
    subtopic_id: 162,
    question_text: 'What is 1,536 ÷ 24?',
    option_a: '64',
    option_b: '54',
    option_c: '604',
    option_d: '74',
    correct_answer: 'A',
    explanation: 'Divide: 153 ÷ 24 = 6 (remainder 9). Bring down 6: 96 ÷ 24 = 4. Result = 64.',
    distractor_diagnostics: {
      B: {
        error: 'The student underestimated the first quotient digit (used 5 instead of 6).',
        remediation: 'Estimate: 24 × 6 = 144, which fits into 153 with a remainder of 9.'
      },
      C: {
        error: 'The student inserted an unnecessary zero in the tens place.',
        remediation: 'The quotient has only two digits: 6 tens and 4 ones (64).'
      },
      D: {
        error: 'The student overestimated the quotient.',
        remediation: 'Multiply your answer to check: 64 × 24 = 1,536.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit & Decimal Operations',
    subtopic_id: 162,
    question_text: 'What is 0.6 × 0.4?',
    option_a: '0.24',
    option_b: '2.4',
    option_c: '0.024',
    option_d: '24',
    correct_answer: 'A',
    explanation: '6 × 4 = 24. There is 1 decimal place in 0.6 and 1 in 0.4, total 2 decimal places: 0.24.',
    distractor_diagnostics: {
      B: {
        error: 'The student placed only 1 decimal digit in the answer.',
        remediation: 'Count total decimal places in both numbers: 1 place + 1 place = 2 decimal places (0.24).'
      },
      C: {
        error: 'The student added an extra zero before 24.',
        remediation: '6 × 4 = 24. Two decimal places gives exactly 0.24.'
      },
      D: {
        error: 'The student forgot the decimal point completely.',
        remediation: 'Multiplying decimals less than 1 results in an answer less than 1.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Fraction Addition & Subtraction',
    subtopic_id: 163,
    question_text: 'What is 1/3 + 2/5?',
    option_a: '11/15',
    option_b: '3/8',
    option_c: '3/15',
    option_d: '7/15',
    correct_answer: 'A',
    explanation: 'Common denominator is 15: 1/3 = 5/15 and 2/5 = 6/15. Sum = 5/15 + 6/15 = 11/15.',
    distractor_diagnostics: {
      B: {
        error: 'The student added the numerators and denominators across directly (1+2)/(3+5).',
        remediation: 'Find a common denominator first: 1/3 = 5/15 and 2/5 = 6/15. Then add: 5/15 + 6/15 = 11/15.'
      },
      C: {
        error: 'The student added the numerators without converting to equivalent fractions.',
        remediation: 'Multiply numerator and denominator by the same factor before adding.'
      },
      D: {
        error: 'The student miscalculated the equivalent fraction numerators.',
        remediation: 'Check equivalent numerators: 1 × 5 = 5 and 2 × 3 = 6; 5 + 6 = 11.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Fraction Multiplication & Division',
    subtopic_id: 165,
    question_text: 'What is (1/5) ÷ 3?',
    option_a: '1/15',
    option_b: '15',
    option_c: '3/5',
    option_d: '5/3',
    correct_answer: 'A',
    explanation: 'Dividing 1/5 into 3 equal shares: (1/5) ÷ 3 = (1/5) × (1/3) = 1/15.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied instead of dividing (confused with 3 ÷ 1/5).',
        remediation: 'When dividing a fraction into 3 equal pieces, each piece becomes smaller: (1/5) ÷ 3 = 1/15.'
      },
      C: {
        error: 'The student multiplied the numerator by 3.',
        remediation: 'To divide a fraction by a whole number, multiply the denominator by the whole number.'
      },
      D: {
        error: 'The student inverted both numbers.',
        remediation: 'Keep the numerator 1 and multiply bottom: 5 × 3 = 15, so 1/15.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: HIGH DIFFICULTY (Questions 15 to 20)
  // ----------------------------------------------------
  {
    difficulty: 'High',
    subtopic_name: 'Multi-Digit & Decimal Operations',
    subtopic_id: 162,
    question_text: 'What is 4.8 ÷ 0.12?',
    option_a: '40',
    option_b: '4',
    option_c: '0.4',
    option_d: '400',
    correct_answer: 'A',
    explanation: 'Move decimal point 2 places to the right in both numbers: 4.8 becomes 480, and 0.12 becomes 12. 480 ÷ 12 = 40.',
    distractor_diagnostics: {
      B: {
        error: 'The student shifted the decimal in the dividend only 1 place.',
        remediation: 'Move the decimal 2 places in both numbers: 0.12 becomes 12, and 4.8 becomes 480. Then 480 ÷ 12 = 40.'
      },
      C: {
        error: 'The student placed the decimal point incorrectly.',
        remediation: 'Dividing by a small decimal (0.12) makes the quotient larger than 4.8.'
      },
      D: {
        error: 'The student shifted the decimal 3 places instead of 2.',
        remediation: 'Count decimal places in the divisor: 0.12 has 2 places, so move 2 places in 4.8 to get 480.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Fraction Addition & Subtraction',
    subtopic_id: 163,
    question_text: 'What is 4 1/4 - 1 2/3?',
    option_a: '2 7/12',
    option_b: '3 1/12',
    option_c: '2 1/12',
    option_d: '3 7/12',
    correct_answer: 'A',
    explanation: 'Common denominator is 12: 4 3/12 - 1 8/12. Borrow 1 from 4: 3 15/12 - 1 8/12 = 2 7/12.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted smaller fraction from larger fraction (2/3 - 1/4) without borrowing from 4.',
        remediation: 'Borrow 1 whole from 4: 4 3/12 becomes 3 15/12. Then 3 15/12 - 1 8/12 = 2 7/12.'
      },
      C: {
        error: 'The student made a subtraction error after finding a common denominator.',
        remediation: 'Convert to common denominator 12 and regroup: 15/12 - 8/12 = 7/12.'
      },
      D: {
        error: 'The student forgot to decrease the whole number 4 to 3 after borrowing.',
        remediation: 'Remember to decrease the whole number by 1 when borrowing for the fraction.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Fraction Multiplication & Division',
    subtopic_id: 165,
    question_text: 'Without calculating, which statement about 4/5 × 7 is true?',
    option_a: 'The product is less than 7 because 4/5 is less than 1',
    option_b: 'The product is greater than 7 because multiplication always increases',
    option_c: 'The product is equal to 7',
    option_d: 'The product is less than 4/5',
    correct_answer: 'A',
    explanation: 'Multiplying any positive number by a fraction less than 1 results in a product smaller than the original number.',
    distractor_diagnostics: {
      B: {
        error: 'The student assumed multiplying always results in a larger number.',
        remediation: 'Multiplying by a fraction less than 1 scales the number DOWN (makes it smaller).'
      },
      C: {
        error: 'The student thought multiplying by fractions does not change the whole number.',
        remediation: 'Only multiplying by 1 keeps a number equal.'
      },
      D: {
        error: 'The student confused the scaling factor: multiplying 7 by 4/5 gives a value much larger than 4/5.',
        remediation: '7 groups of 4/5 is 28/5, which is greater than 4/5 but less than 7.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Fraction Addition & Subtraction',
    subtopic_id: 163,
    question_text: 'Liam had 3/4 gallon of paint. He used 1/3 gallon to paint a chair and 1/6 gallon to paint a shelf. How much paint does Liam have left?',
    option_a: '1/4 gallon',
    option_b: '1/2 gallon',
    option_c: '1/12 gallon',
    option_d: '3/12 gallon',
    correct_answer: 'A',
    explanation: 'Total paint used: 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2 gallon. Left over: 3/4 - 1/2 = 3/4 - 2/4 = 1/4 gallon.',
    distractor_diagnostics: {
      B: {
        error: 'The student calculated the total paint used (1/3 + 1/6 = 1/2) but forgot to subtract it from 3/4.',
        remediation: 'Complete the final step: subtract total paint used (1/2 or 2/4) from starting paint (3/4): 3/4 - 2/4 = 1/4.'
      },
      C: {
        error: 'The student made an arithmetic error when finding common denominator 12.',
        remediation: 'Convert all to 12ths: 9/12 - 4/12 - 2/12 = 3/12 = 1/4.'
      },
      D: {
        error: 'The student found 3/12 but did not simplify to simplest form.',
        remediation: 'Simplify 3/12 by dividing top and bottom by 3 to get 1/4.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Multi-Digit & Decimal Operations',
    subtopic_id: 162,
    question_text: 'A bookstore sells 318 calendars each month. How many calendars will the bookstore sell in 24 months?',
    option_a: '7,632',
    option_b: '7,532',
    option_c: '6,632',
    option_d: '7,622',
    correct_answer: 'A',
    explanation: '318 × 4 = 1,272. 318 × 20 = 6,360. Sum = 1,272 + 6,360 = 7,632.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot to add the carried ten in the hundreds column.',
        remediation: 'Check partial products: 318 × 4 = 1,272 and 318 × 20 = 6,360. Sum: 1,272 + 6,360 = 7,632.'
      },
      C: {
        error: 'The student missed carrying into the thousands place.',
        remediation: 'Practice vertical column addition of the two partial products.'
      },
      D: {
        error: 'The student made an off-by-ten subtraction/addition error in the tens place.',
        remediation: 'Double-check 7 tens + 6 tens = 13 tens (carry 1 hundred).'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Fraction Multiplication & Division',
    subtopic_id: 165,
    question_text: 'A recipe calls for 2 1/2 cups of flour. Chef Leo wants to make 3 1/2 batches of the recipe. How many cups of flour does Chef Leo need?',
    option_a: '8 3/4 cups',
    option_b: '6 1/4 cups',
    option_c: '7 1/2 cups',
    option_d: '8 1/2 cups',
    correct_answer: 'A',
    explanation: 'Convert to improper fractions: 2 1/2 = 5/2, and 3 1/2 = 7/2. Multiply: (5/2) × (7/2) = 35/4 = 8 3/4 cups.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied the whole numbers (2 × 3 = 6) and fractions (1/2 × 1/2 = 1/4) separately.',
        remediation: 'Convert mixed numbers to improper fractions first: 5/2 × 7/2 = 35/4 = 8 3/4.'
      },
      C: {
        error: 'The student added the mixed numbers instead of multiplying for batches.',
        remediation: 'Finding the amount for 3 1/2 batches requires multiplication, not addition.'
      },
      D: {
        error: 'The student made a division error when converting 35/4 to a mixed number.',
        remediation: 'Divide 35 by 4: 4 × 8 = 32, with a remainder of 3, giving 8 3/4.'
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

  console.log(`Starting insertion of ${grade5QuestionsData.length} Grade 5 questions...`);

  let inserted = 0;
  let updated = 0;

  for (const q of grade5QuestionsData) {
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = 5',
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
          grade_id = 5,
          grade = 5,
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
          5, 5, ?, ?,
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

  console.log(`\nComplete! Inserted: ${inserted}, Updated: ${updated}, Total: ${grade5QuestionsData.length}`);

  const [totalG5Number] = await pool.query(
    'SELECT COUNT(*) as count FROM questions WHERE grade = 5 AND topic_id = 3 AND is_active = 1'
  );
  console.log(`Total active Grade 5 Number & Operations questions in DB: ${totalG5Number[0].count}`);

  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding Grade 5 questions:', err);
  process.exit(1);
});
