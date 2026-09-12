const mysql = require('mysql2/promise');
require('dotenv').config();

const grade6QuestionsData = [
  // ----------------------------------------------------
  // LEVEL 1: LOW DIFFICULTY (Questions 1 to 7)
  // ----------------------------------------------------
  {
    difficulty: 'Low',
    subtopic_name: 'Fraction Division',
    subtopic_id: 166,
    question_text: 'What is 3/4 ÷ 1/8?',
    option_a: '6',
    option_b: '3/32',
    option_c: '1/6',
    option_d: '8/12',
    correct_answer: 'A',
    explanation: 'Multiply by the reciprocal: 3/4 ÷ 1/8 = 3/4 × 8/1 = 24/4 = 6.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied the fractions directly without flipping the second fraction.',
        remediation: 'Remember to multiply by the reciprocal (flip the second fraction): 3/4 × 8/1.'
      },
      C: {
        error: 'The student inverted the answer (confused 3/4 ÷ 1/8 with 1/8 ÷ 3/4).',
        remediation: 'Keep the first fraction as it is, and flip only the divisor (second fraction).'
      },
      D: {
        error: 'The student cross-multiplied incorrectly.',
        remediation: 'Multiply straight across after flipping: (3 × 8) / (4 × 1) = 24/4 = 6.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Factors & Multiples',
    subtopic_id: 168,
    question_text: 'What is the Greatest Common Factor (GCF) of 18 and 24?',
    option_a: '6',
    option_b: '3',
    option_c: '12',
    option_d: '72',
    correct_answer: 'A',
    explanation: 'Factors of 18: 1, 2, 3, 6, 9, 18. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. The largest common factor is 6.',
    distractor_diagnostics: {
      B: {
        error: 'The student found a common factor (3) but not the GREATEST common factor.',
        remediation: 'List all common factors (1, 2, 3, 6) and pick the largest one (6).'
      },
      C: {
        error: 'The student chose 12, which is a factor of 24 but NOT a factor of 18.',
        remediation: 'Check that the factor divides both numbers evenly without a remainder.'
      },
      D: {
        error: 'The student calculated the Least Common Multiple (LCM) instead of the GCF.',
        remediation: 'GCF divides into both numbers (smaller value), while LCM is a multiple (larger value).'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Factors & Multiples',
    subtopic_id: 168,
    question_text: 'What is the Least Common Multiple (LCM) of 4 and 6?',
    option_a: '12',
    option_b: '24',
    option_c: '2',
    option_d: '18',
    correct_answer: 'A',
    explanation: 'Multiples of 4: 4, 8, 12, 16... Multiples of 6: 6, 12, 18... The smallest shared multiple is 12.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied 4 × 6 = 24, which is a common multiple but not the LEAST.',
        remediation: 'List multiples in order to find the smallest number that appears in both lists (12).'
      },
      C: {
        error: 'The student found the GCF (2) instead of the LCM.',
        remediation: 'LCM must be greater than or equal to both numbers (at least 6).'
      },
      D: {
        error: 'The student chose 18, which is a multiple of 6 but not of 4.',
        remediation: 'Ensure the number is divisible by both 4 and 6.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Rational Numbers',
    subtopic_id: 169,
    question_text: 'What is the opposite of -7?',
    option_a: '7',
    option_b: '-7',
    option_c: '0',
    option_d: '1/7',
    correct_answer: 'A',
    explanation: 'The opposite of a negative number is positive: -(-7) = 7.',
    distractor_diagnostics: {
      B: {
        error: 'The student selected the same number instead of its opposite.',
        remediation: 'The opposite of a number has the same distance from 0 but with the opposite sign.'
      },
      C: {
        error: 'The student chose 0 (the reference point), not the opposite.',
        remediation: 'Opposite of -7 is positive 7 because both are 7 units away from 0.'
      },
      D: {
        error: 'The student confused opposite (additive inverse) with reciprocal (multiplicative inverse).',
        remediation: 'Opposite means changing the sign (+ to - or - to +), not flipping the fraction.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Rational Numbers',
    subtopic_id: 169,
    question_text: 'What is the absolute value of -15, written as |-15|?',
    option_a: '15',
    option_b: '-15',
    option_c: '0',
    option_d: '-1/15',
    correct_answer: 'A',
    explanation: 'Absolute value represents distance from 0 on a number line, which is always non-negative: |-15| = 15.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought absolute value preserves negative signs.',
        remediation: 'Absolute value measures distance from 0, and distance is always positive: |-15| = 15.'
      },
      C: {
        error: 'The student chose 0.',
        remediation: 'Count the units from -15 to 0 on a number line: there are 15 units.'
      },
      D: {
        error: 'The student confused absolute value with negative reciprocal.',
        remediation: 'Remove the negative sign to find the absolute value.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multi-Digit Computation',
    subtopic_id: 167,
    question_text: 'What is 12.5 + 3.84?',
    option_a: '16.34',
    option_b: '15.34',
    option_c: '16.89',
    option_d: '5.09',
    correct_answer: 'A',
    explanation: 'Line up decimals: 12.50 + 3.84 = 16.34.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot to carry the 1 from 5 + 8 = 13 tenths.',
        remediation: 'When tenths add up to 10 or more, carry 1 whole to the ones place.'
      },
      C: {
        error: 'The student misaligned the decimal places (added 5 to 4 and 8 to 2).',
        remediation: 'Pad 12.5 with a zero to make it 12.50 so all columns align correctly.'
      },
      D: {
        error: 'The student lined numbers up from the right without looking at the decimal point.',
        remediation: 'Always align the decimal points vertically before adding.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Coordinate Plane',
    subtopic_id: 170,
    question_text: 'In which quadrant of the coordinate plane is the point (-3, 5) located?',
    option_a: 'Quadrant II',
    option_b: 'Quadrant I',
    option_c: 'Quadrant III',
    option_d: 'Quadrant IV',
    correct_answer: 'A',
    explanation: 'Points with negative x-coordinate and positive y-coordinate (-x, +y) are located in Quadrant II.',
    distractor_diagnostics: {
      B: {
        error: 'The student chose Quadrant I, where both x and y are positive (+, +).',
        remediation: 'Quadrant I has positive x and positive y; since x is -3, it moves left into Quadrant II.'
      },
      C: {
        error: 'The student chose Quadrant III, where both coordinates are negative (-, -).',
        remediation: 'Quadrant III has negative x and negative y; here y is positive 5.'
      },
      D: {
        error: 'The student reversed coordinates and chose Quadrant IV (+, -).',
        remediation: 'Follow the order: x is first (-3 = left) and y is second (5 = up), which lands in Quadrant II.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: MEDIUM DIFFICULTY (Questions 8 to 14)
  // ----------------------------------------------------
  {
    difficulty: 'Medium',
    subtopic_name: 'Fraction Division',
    subtopic_id: 166,
    question_text: 'What is 5/6 ÷ 2/3 in simplest form?',
    option_a: '1 1/4',
    option_b: '5/9',
    option_c: '10/18',
    option_d: '1 1/2',
    correct_answer: 'A',
    explanation: 'Multiply by reciprocal: 5/6 × 3/2 = 15/12 = 5/4 = 1 1/4.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied directly without flipping 2/3: (5×2)/(6×3) = 10/18 = 5/9.',
        remediation: 'Remember: Keep the first fraction, Change division to multiplication, Flip the second fraction (KCF).'
      },
      C: {
        error: 'The student multiplied without flipping and did not simplify.',
        remediation: 'Flip the divisor: 5/6 × 3/2 = 15/12, then simplify to 1 1/4.'
      },
      D: {
        error: 'The student made an arithmetic reduction error (thought 15/12 simplifies to 3/2).',
        remediation: 'Divide 15 and 12 by their GCF 3 to get 5/4, which is 1 1/4.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit Computation',
    subtopic_id: 167,
    question_text: 'What is 2,808 ÷ 36?',
    option_a: '78',
    option_b: '68',
    option_c: '708',
    option_d: '88',
    correct_answer: 'A',
    explanation: 'Divide: 280 ÷ 36 = 7 (36 × 7 = 252). 280 - 252 = 28. Bring down 8: 288 ÷ 36 = 8 (36 × 8 = 288). Quotient = 78.',
    distractor_diagnostics: {
      B: {
        error: 'The student underestimated the first quotient digit (used 6 instead of 7).',
        remediation: 'Estimate: 36 × 7 = 252, leaving 28 which is less than 36.'
      },
      C: {
        error: 'The student inserted an unnecessary zero in the tens place.',
        remediation: 'The quotient has 2 digits: 7 tens and 8 ones (78).'
      },
      D: {
        error: 'The student overestimated the first quotient digit.',
        remediation: 'Multiply: 78 × 36 = 2,808 to verify your answer.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit Computation',
    subtopic_id: 167,
    question_text: 'What is 4.25 × 0.6?',
    option_a: '2.55',
    option_b: '25.5',
    option_c: '0.255',
    option_d: '2.45',
    correct_answer: 'A',
    explanation: 'Multiply as whole numbers: 425 × 6 = 2,550. Count decimal places: 2 in 4.25 and 1 in 0.6 = 3 places. 2.550 = 2.55.',
    distractor_diagnostics: {
      B: {
        error: 'The student placed only 1 decimal digit in the answer.',
        remediation: 'Count all decimal places in both factors: 2 places + 1 place = 3 decimal places (2.550 = 2.55).'
      },
      C: {
        error: 'The student shifted the decimal 4 places instead of 3.',
        remediation: '425 × 6 = 2550. Move the decimal point 3 places to the left: 2.550.'
      },
      D: {
        error: 'The student made a multiplication fact error (425 × 6).',
        remediation: 'Calculate: 6 × 5 = 30, 6 × 20 = 120, 6 × 400 = 2400. Sum = 2550.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Rational Numbers',
    subtopic_id: 169,
    question_text: 'Which inequality correctly compares -8 and -3?',
    option_a: '-8 < -3',
    option_b: '-8 > -3',
    option_c: '-8 = -3',
    option_d: '-3 < -8',
    correct_answer: 'A',
    explanation: 'On a number line, numbers further to the left are smaller. -8 is further to the left than -3, so -8 < -3.',
    distractor_diagnostics: {
      B: {
        error: 'The student applied positive number rules (8 > 3) to negative numbers.',
        remediation: 'With negative numbers, larger absolute value means smaller quantity (-8 is colder than -3).'
      },
      C: {
        error: 'The student thought both are equal because both are negative.',
        remediation: 'Negative numbers differ in value based on their distance from 0.'
      },
      D: {
        error: 'The student stated that -3 is less than -8.',
        remediation: '-3 is closer to 0 and to the right of -8, so -3 is GREATER than -8.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Rational Numbers',
    subtopic_id: 169,
    question_text: 'Order these numbers from least to greatest: -4, 2.5, -1.5, 0',
    option_a: '-4, -1.5, 0, 2.5',
    option_b: '-1.5, -4, 0, 2.5',
    option_c: '0, -1.5, 2.5, -4',
    option_d: '2.5, 0, -1.5, -4',
    correct_answer: 'A',
    explanation: 'Negative numbers are smallest: -4 is less than -1.5. Then 0, then positive 2.5: -4 < -1.5 < 0 < 2.5.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought -1.5 is less than -4.',
        remediation: '-4 is further to the left on the number line, so -4 is the least.'
      },
      C: {
        error: 'The student placed 0 first.',
        remediation: 'All negative numbers are less than 0.'
      },
      D: {
        error: 'The student ordered from greatest to least instead of least to greatest.',
        remediation: 'Read the order requested: least to greatest means starting with the most negative number.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Factors & Multiples',
    subtopic_id: 168,
    question_text: 'Which expression uses the Distributive Property and the GCF to rewrite 36 + 48?',
    option_a: '12(3 + 4)',
    option_b: '6(6 + 8)',
    option_c: '4(9 + 12)',
    option_d: '12(3 × 4)',
    correct_answer: 'A',
    explanation: 'The GCF of 36 and 48 is 12. Factoring out 12: 36 ÷ 12 = 3 and 48 ÷ 12 = 4. Expression is 12(3 + 4).',
    distractor_diagnostics: {
      B: {
        error: 'The student factored out 6, which is a common factor but NOT the greatest common factor (12).',
        remediation: 'Always factor out the GREATEST common factor: 3 and 4 have no common factor except 1.'
      },
      C: {
        error: 'The student factored out 4 instead of the GCF 12.',
        remediation: 'Inside the parentheses, the two terms must share no common factor (relatively prime).'
      },
      D: {
        error: 'The student multiplied inside the parentheses instead of adding.',
        remediation: 'Preserve the addition operation inside parentheses: 12(3 + 4).'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Coordinate Plane',
    subtopic_id: 170,
    question_text: 'What is the distance between point A(-2, 4) and point B(5, 4) on the coordinate plane?',
    option_a: '7 units',
    option_b: '3 units',
    option_c: '9 units',
    option_d: '8 units',
    correct_answer: 'A',
    explanation: 'Since the y-coordinates are the same (4), subtract the x-coordinates: 5 - (-2) = 5 + 2 = 7 units.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 5 - 2 = 3 instead of subtracting the negative coordinate: 5 - (-2).',
        remediation: 'When points are on opposite sides of the y-axis, add their absolute distances from the axis: |-2| + |5| = 2 + 5 = 7.'
      },
      C: {
        error: 'The student made an arithmetic error.',
        remediation: 'Count horizontal units from -2 to 5: -2 to 0 is 2 units, and 0 to 5 is 5 units. Total = 7 units.'
      },
      D: {
        error: 'The student added the y-coordinates.',
        remediation: 'Since y-coordinates are identical, distance is measured only along the x-axis.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: HIGH DIFFICULTY (Questions 15 to 20)
  // ----------------------------------------------------
  {
    difficulty: 'High',
    subtopic_name: 'Fraction Division',
    subtopic_id: 166,
    question_text: 'A ribbon is 2 1/4 feet long. Maya cuts it into pieces that are each 3/8 foot long. How many complete pieces can Maya cut?',
    option_a: '6 pieces',
    option_b: '5 pieces',
    option_c: '7 pieces',
    option_d: '8 pieces',
    correct_answer: 'A',
    explanation: 'Convert to improper fraction: 2 1/4 = 9/4. Divide: 9/4 ÷ 3/8 = 9/4 × 8/3 = 72/12 = 6 pieces.',
    distractor_diagnostics: {
      B: {
        error: 'The student made a multiplication error in 9/4 × 8/3.',
        remediation: 'Simplify before multiplying: (9÷3) × (8÷4) = 3 × 2 = 6 pieces.'
      },
      C: {
        error: 'The student rounded up an incorrect estimate.',
        remediation: 'Calculate exactly: 9/4 × 8/3 = 72/12 = 6.'
      },
      D: {
        error: 'The student inverted the wrong fraction.',
        remediation: 'Flip only the divisor (3/8 becomes 8/3).'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Factors & Multiples',
    subtopic_id: 168,
    question_text: 'Hot dog buns come in packs of 8, and hot dog sausages come in packs of 12. What is the SMALLEST number of hot dogs and buns you can buy to have an equal number of each with none left over?',
    option_a: '24',
    option_b: '48',
    option_c: '96',
    option_d: '4',
    correct_answer: 'A',
    explanation: 'This problem requires finding the Least Common Multiple (LCM) of 8 and 12. Multiples of 8: 8, 16, 24... Multiples of 12: 12, 24... The LCM is 24.',
    distractor_diagnostics: {
      B: {
        error: 'The student found a common multiple (48) but not the SMALLEST (LCM).',
        remediation: 'Check smaller multiples: 24 is divisible by both 8 (3 packs) and 12 (2 packs).'
      },
      C: {
        error: 'The student multiplied 8 × 12 = 96.',
        remediation: 'List multiples to find the smallest shared value rather than multiplying the numbers.'
      },
      D: {
        error: 'The student calculated the GCF (4) instead of the LCM.',
        remediation: 'When matching package sizes to equal quantities, find the LCM, which must be larger than 12.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Multi-Digit Computation',
    subtopic_id: 167,
    question_text: 'What is 15.75 ÷ 0.25?',
    option_a: '63',
    option_b: '6.3',
    option_c: '630',
    option_d: '3.93',
    correct_answer: 'A',
    explanation: 'Shift decimal 2 places in both numbers: 15.75 ÷ 0.25 = 1,575 ÷ 25 = 63. (Or think: there are 4 quarters in 1 dollar, so 15.75 × 4 = 63).',
    distractor_diagnostics: {
      B: {
        error: 'The student shifted the decimal in the dividend only 1 place.',
        remediation: 'Shift the decimal the exact same number of places in both numbers: 15.75 becomes 1575.'
      },
      C: {
        error: 'The student added an unnecessary zero to the quotient.',
        remediation: 'Divide: 1,575 ÷ 25 = 63.'
      },
      D: {
        error: 'The student multiplied 15.75 by 0.25 instead of dividing.',
        remediation: 'Dividing by 0.25 is the same as multiplying by 4, which makes the number 4 times larger.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Rational Numbers',
    subtopic_id: 169,
    question_text: 'A submarine is at an elevation of -120 meters. A helicopter is directly above it at an elevation of +350 meters. What is the vertical distance between the submarine and the helicopter?',
    option_a: '470 meters',
    option_b: '230 meters',
    option_c: '-230 meters',
    option_d: '-470 meters',
    correct_answer: 'A',
    explanation: 'Vertical distance = |350 - (-120)| = 350 + 120 = 470 meters.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 350 - 120 = 230, ignoring that the submarine is below sea level.',
        remediation: 'The submarine is below 0 and the helicopter is above 0, so add their distances: 120 + 350 = 470.'
      },
      C: {
        error: 'The student found the difference with an incorrect negative sign.',
        remediation: 'Distance is always a positive physical measurement: |-120| + |350| = 470.'
      },
      D: {
        error: 'The student gave a negative distance.',
        remediation: 'Distance between two physical objects can never be negative.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Coordinate Plane',
    subtopic_id: 170,
    question_text: 'Point P is plotted at (-4, -3). If point P is reflected across the y-axis, what are the coordinates of the reflected point?',
    option_a: '(4, -3)',
    option_b: '(-4, 3)',
    option_c: '(4, 3)',
    option_d: '(-3, -4)',
    correct_answer: 'A',
    explanation: 'Reflecting across the y-axis changes the sign of the x-coordinate while the y-coordinate stays the same: (-x, y) = (4, -3).',
    distractor_diagnostics: {
      B: {
        error: 'The student reflected across the x-axis instead of the y-axis.',
        remediation: 'Reflecting across the y-axis changes the x-coordinate sign; y stays unchanged.'
      },
      C: {
        error: 'The student reflected across the origin (changed signs of both coordinates).',
        remediation: 'Only the coordinate perpendicular to the line of reflection changes its sign.'
      },
      D: {
        error: 'The student swapped the x and y coordinates.',
        remediation: 'Do not swap the positions of x and y; only change the sign of x.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Rational Numbers',
    subtopic_id: 169,
    question_text: 'Which statement about absolute value and rational numbers is true in real life?',
    option_a: 'An account balance of -$50 represents a greater debt than an account balance of -$30 because |-50| > |-30|',
    option_b: 'An account balance of -$50 is greater than -$30 because 50 is greater than 30',
    option_c: 'An elevation of -20 feet is higher than an elevation of -10 feet',
    option_d: 'Absolute value can be a negative number if the original value is negative',
    correct_answer: 'A',
    explanation: 'Debt represents magnitude (absolute value): |-50| = 50 and |-30| = 30. A balance of -$50 means you owe $50, which is a greater debt.',
    distractor_diagnostics: {
      B: {
        error: 'The student confused debt magnitude with actual numerical balance (-50 < -30).',
        remediation: '-50 is numerically less than -30, meaning you have less money.'
      },
      C: {
        error: 'The student thought -20 feet is higher than -10 feet.',
        remediation: '-20 feet is deeper underwater than -10 feet, so -10 feet is higher.'
      },
      D: {
        error: 'The student stated that absolute value can be negative.',
        remediation: 'Absolute value represents distance and is ALWAYS non-negative (zero or positive).'
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

  console.log(`Starting insertion of ${grade6QuestionsData.length} Grade 6 questions...`);

  let inserted = 0;
  let updated = 0;

  for (const q of grade6QuestionsData) {
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = 6',
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
          grade_id = 6,
          grade = 6,
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
          6, 6, ?, ?,
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

  console.log(`\nComplete! Inserted: ${inserted}, Updated: ${updated}, Total: ${grade6QuestionsData.length}`);

  const [totalG6Number] = await pool.query(
    'SELECT COUNT(*) as count FROM questions WHERE grade = 6 AND topic_id = 3 AND is_active = 1'
  );
  console.log(`Total active Grade 6 Number & Operations questions in DB: ${totalG6Number[0].count}`);

  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding Grade 6 questions:', err);
  process.exit(1);
});
