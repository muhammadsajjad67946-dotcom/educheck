const mysql = require('mysql2/promise');
require('dotenv').config();

const grade8QuestionsData = [
  // ----------------------------------------------------
  // LEVEL 1: LOW DIFFICULTY (Questions 1 to 7)
  // ----------------------------------------------------
  {
    difficulty: 'Low',
    subtopic_name: 'Irrational Numbers',
    subtopic_id: 176,
    question_text: 'Which of the following numbers is an IRRATIONAL number?',
    option_a: '√2',
    option_b: '0.75',
    option_c: '√16',
    option_d: '2/3',
    correct_answer: 'A',
    explanation: '√2 is irrational because 2 is not a perfect square and its decimal expansion (1.414213...) never terminates and never repeats.',
    distractor_diagnostics: {
      B: {
        error: 'The student selected 0.75, which is a terminating decimal (equal to 3/4) and therefore rational.',
        remediation: 'Terminating and repeating decimals can always be written as fractions, making them rational.'
      },
      C: {
        error: 'The student selected √16, which simplifies to the whole number 4.',
        remediation: 'Square roots of perfect squares (like √16 = 4) are rational numbers.'
      },
      D: {
        error: 'The student selected 2/3, which is written as a fraction of integers.',
        remediation: 'Any number written as a fraction a/b (where b ≠ 0) is a rational number.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integer Exponents & Radicals',
    subtopic_id: 179,
    question_text: 'What is 4³ × 4⁵ written as a single power?',
    option_a: '4⁸',
    option_b: '4¹⁵',
    option_c: '16⁸',
    option_d: '16¹⁵',
    correct_answer: 'A',
    explanation: 'When multiplying powers with the same base, keep the base and add the exponents: 4^(3 + 5) = 4⁸.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied the exponents (3 × 5 = 15) instead of adding them.',
        remediation: 'Product of powers rule: when multiplying like bases, ADD the exponents: 3 + 5 = 8.'
      },
      C: {
        error: 'The student multiplied the bases (4 × 4 = 16) while also adding exponents.',
        remediation: 'Keep the base unchanged: 4³ × 4⁵ = 4⁸.'
      },
      D: {
        error: 'The student multiplied both the bases and the exponents.',
        remediation: 'The base stays 4, and exponents add: 4⁸.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integer Exponents & Radicals',
    subtopic_id: 179,
    question_text: 'What is 5⁻² expressed as a fraction?',
    option_a: '1/25',
    option_b: '-25',
    option_c: '-10',
    option_d: '1/10',
    correct_answer: 'A',
    explanation: 'Negative exponent rule: a⁻ⁿ = 1/aⁿ. So 5⁻² = 1/5² = 1/25.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought a negative exponent makes the number negative.',
        remediation: 'A negative exponent does NOT make a number negative; it takes the reciprocal (1/5² = 1/25).'
      },
      C: {
        error: 'The student multiplied base by exponent (5 × -2 = -10).',
        remediation: 'Exponents indicate repeated multiplication, not simple multiplication: 5² = 25, so 5⁻² = 1/25.'
      },
      D: {
        error: 'The student multiplied 5 × 2 in the denominator.',
        remediation: '5² = 5 × 5 = 25, so 5⁻² = 1/25.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Square Roots',
    subtopic_id: 180,
    question_text: 'What is the principal square root of 81, written as √81?',
    option_a: '9',
    option_b: '18',
    option_c: '40.5',
    option_d: '8',
    correct_answer: 'A',
    explanation: 'Since 9 × 9 = 81, the principal square root is 9.',
    distractor_diagnostics: {
      B: {
        error: 'The student divided 81 by 4 or confused square root with halving.',
        remediation: 'Square root asks: what number multiplied by itself equals 81? Since 9 × 9 = 81, √81 = 9.'
      },
      C: {
        error: 'The student divided 81 by 2.',
        remediation: 'Square root is not dividing by 2; it is finding the identical factor.'
      },
      D: {
        error: 'The student chose 8 (8 × 8 = 64).',
        remediation: 'Review square numbers: 9² = 81.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Cube Roots',
    subtopic_id: 181,
    question_text: 'What is the cube root of 64, written as ∛64?',
    option_a: '4',
    option_b: '8',
    option_c: '16',
    option_d: '21.3',
    correct_answer: 'A',
    explanation: 'Since 4 × 4 × 4 = 64, the cube root of 64 is 4.',
    distractor_diagnostics: {
      B: {
        error: 'The student calculated the square root (√64 = 8) instead of the cube root.',
        remediation: 'Cube root (∛) requires a factor multiplied THREE times: 4 × 4 × 4 = 64.'
      },
      C: {
        error: 'The student divided 64 by 4.',
        remediation: 'Check: 16 × 16 × 16 = 4096, which is far too large. 4 × 4 × 4 = 64.'
      },
      D: {
        error: 'The student divided 64 by 3.',
        remediation: 'Cube root is not dividing by 3; it is finding the number that cubes to 64.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Scientific Notation',
    subtopic_id: 183,
    question_text: 'What is 45,000 written in scientific notation?',
    option_a: '4.5 × 10⁴',
    option_b: '45 × 10³',
    option_c: '4.5 × 10⁵',
    option_d: '0.45 × 10⁵',
    correct_answer: 'A',
    explanation: 'Move the decimal point 4 places to the left to get a leading number between 1 and 10: 4.5 × 10⁴.',
    distractor_diagnostics: {
      B: {
        error: 'The student left the first number as 45, which is not between 1 and 10.',
        remediation: 'In scientific notation, the first factor must be greater than or equal to 1 and less than 10 (4.5).'
      },
      C: {
        error: 'The student miscounted the decimal shift as 5 places.',
        remediation: 'Count decimal jumps: 45,000 -> 4500.0 (1) -> 450.0 (2) -> 45.0 (3) -> 4.5 (4 places).'
      },
      D: {
        error: 'The student used a leading number less than 1 (0.45).',
        remediation: 'The coefficient must be at least 1, so use 4.5 × 10⁴.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Integer Exponents & Radicals',
    subtopic_id: 179,
    question_text: 'What is the value of 7⁰?',
    option_a: '1',
    option_b: '0',
    option_c: '7',
    option_d: '-1',
    correct_answer: 'A',
    explanation: 'Any non-zero number raised to the zero power equals 1: a⁰ = 1.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought raising to the zero power equals 0.',
        remediation: 'Zero exponent rule: any non-zero base raised to the power of 0 always equals 1.'
      },
      C: {
        error: 'The student thought 7⁰ = 7 (confused with 7¹).',
        remediation: '7¹ = 7, but 7⁰ = 1.'
      },
      D: {
        error: 'The student chose -1.',
        remediation: 'Recall: 7² / 7² = 49 / 49 = 1, and by exponent rules 7^(2-2) = 7⁰ = 1.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: MEDIUM DIFFICULTY (Questions 8 to 14)
  // ----------------------------------------------------
  {
    difficulty: 'Medium',
    subtopic_name: 'Decimal Expansions',
    subtopic_id: 177,
    question_text: 'Convert the repeating decimal 0.777... (0.7̄) into a fraction.',
    option_a: '7/9',
    option_b: '7/10',
    option_c: '7/99',
    option_d: '77/100',
    correct_answer: 'A',
    explanation: 'Let x = 0.777... Then 10x = 7.777... Subtracting gives 9x = 7, so x = 7/9.',
    distractor_diagnostics: {
      B: {
        error: 'The student treated the decimal as terminating (0.7 = 7/10).',
        remediation: 'A repeating single digit has denominator 9 (0.777... = 7/9).'
      },
      C: {
        error: 'The student used denominator 99 for a single repeating digit.',
        remediation: 'Use 99 only when TWO digits repeat (e.g., 0.2525... = 25/99).'
      },
      D: {
        error: 'The student treated it as two terminating digits (77/100).',
        remediation: 'Repeating decimals are represented by fractions with nines in the denominator.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Rational Approximations',
    subtopic_id: 178,
    question_text: 'Between which two consecutive integers does √53 lie?',
    option_a: 'Between 7 and 8',
    option_b: 'Between 6 and 7',
    option_c: 'Between 8 and 9',
    option_d: 'Between 26 and 27',
    correct_answer: 'A',
    explanation: 'Look for surrounding perfect squares: 7² = 49 and 8² = 64. Since 49 < 53 < 64, √53 lies between 7 and 8.',
    distractor_diagnostics: {
      B: {
        error: 'The student chose 6 and 7 (6² = 36, 7² = 49), which are both less than 53.',
        remediation: 'Check the squares: 7² = 49 and 8² = 64. Since 53 is between 49 and 64, √53 is between 7 and 8.'
      },
      C: {
        error: 'The student chose 8 and 9 (8² = 64, 9² = 81), which are both greater than 53.',
        remediation: '53 is less than 64, so it must be below 8.'
      },
      D: {
        error: 'The student divided 53 by 2.',
        remediation: 'Do not divide by 2; compare to perfect squares (49 and 64).'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Integer Exponents & Radicals',
    subtopic_id: 179,
    question_text: 'Simplify 3⁷ / 3¹⁰ using a positive exponent.',
    option_a: '1/3³ (or 1/27)',
    option_b: '3³',
    option_c: '3¹⁷',
    option_d: '1/3¹⁷',
    correct_answer: 'A',
    explanation: 'Quotient of powers rule: 3^(7 - 10) = 3⁻³ = 1/3³ = 1/27.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted 10 - 7 = 3 and kept it in the numerator.',
        remediation: 'Subtract numerator exponent minus denominator exponent: 7 - 10 = -3, so 1/3³.'
      },
      C: {
        error: 'The student added the exponents instead of subtracting.',
        remediation: 'In division of like bases, SUBTRACT exponents: 7 - 10 = -3.'
      },
      D: {
        error: 'The student added exponents and inverted.',
        remediation: 'Subtract exponents: 7 - 10 = -3, giving 1/3³.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Square Roots',
    subtopic_id: 180,
    question_text: 'What are the solutions to the equation x² = 49?',
    option_a: 'x = 7 and x = -7',
    option_b: 'x = 7 only',
    option_c: 'x = 24.5',
    option_d: 'x = 14',
    correct_answer: 'A',
    explanation: 'Both 7² = 49 and (-7)² = 49. Therefore, x = ±√49 = ±7.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot the negative solution.',
        remediation: 'Quadratic equations of the form x² = p have two solutions: both positive and negative (±7).'
      },
      C: {
        error: 'The student divided 49 by 2.',
        remediation: 'Take the square root, not half: 7 × 7 = 49.'
      },
      D: {
        error: 'The student multiplied 7 × 2.',
        remediation: 'Square root means finding the base that multiplies by itself to make 49 (7 and -7).'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Scientific Notation',
    subtopic_id: 183,
    question_text: 'What is 0.00032 written in scientific notation?',
    option_a: '3.2 × 10⁻⁴',
    option_b: '3.2 × 10⁴',
    option_c: '32 × 10⁻⁵',
    option_d: '3.2 × 10⁻³',
    correct_answer: 'A',
    explanation: 'Move the decimal point 4 places to the right to get 3.2. Because the original number is less than 1, the exponent is negative: 3.2 × 10⁻⁴.',
    distractor_diagnostics: {
      B: {
        error: 'The student used a positive exponent for a decimal number less than 1.',
        remediation: 'Numbers smaller than 1 always have NEGATIVE exponents in scientific notation: 10⁻⁴.'
      },
      C: {
        error: 'The student used 32, which is not between 1 and 10.',
        remediation: 'The coefficient must be between 1 and 10 (3.2).'
      },
      D: {
        error: 'The student counted 3 zeros instead of counting the total decimal jumps.',
        remediation: 'Count jumps from original decimal to after the first non-zero digit (4 jumps = 10⁻⁴).'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Rational Approximations',
    subtopic_id: 178,
    question_text: 'Which number is GREATER: π or √10?',
    option_a: '√10 is greater because √10 ≈ 3.162 and π ≈ 3.141',
    option_b: 'π is greater because π is infinite',
    option_c: 'They are exactly equal',
    option_d: 'π is greater because 3.14 > 3.10',
    correct_answer: 'A',
    explanation: 'Approximate both values: π ≈ 3.1416, and √10 ≈ 3.1623. Comparing tenths and hundredths: 3.162 > 3.141, so √10 is greater.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought being irrational/infinite makes a number larger.',
        remediation: 'Both π and √10 are infinite non-repeating decimals; compare their numerical values directly.'
      },
      C: {
        error: 'The student assumed they are equal.',
        remediation: 'Square both: π² ≈ 9.87, while (√10)² = 10. Since 10 > 9.87, √10 > π.'
      },
      D: {
        error: 'The student incorrectly approximated √10 as 3.10.',
        remediation: '3.16 × 3.16 = 9.9856, which is close to 10. So √10 ≈ 3.16, which is greater than 3.14.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Scientific Notation',
    subtopic_id: 183,
    question_text: 'What is (2 × 10³) × (4 × 10⁵) in scientific notation?',
    option_a: '8 × 10⁸',
    option_b: '8 × 10¹⁵',
    option_c: '6 × 10⁸',
    option_d: '8 × 10²',
    correct_answer: 'A',
    explanation: 'Multiply coefficients: 2 × 4 = 8. Add exponents of 10: 10^(3 + 5) = 10⁸. Product = 8 × 10⁸.',
    distractor_diagnostics: {
      B: {
        error: 'The student multiplied the exponents (3 × 5 = 15) instead of adding them.',
        remediation: 'When multiplying powers of 10, ADD the exponents: 3 + 5 = 8.'
      },
      C: {
        error: 'The student added the coefficients (2 + 4 = 6) instead of multiplying them.',
        remediation: 'Multiply the coefficients: 2 × 4 = 8.'
      },
      D: {
        error: 'The student subtracted the exponents.',
        remediation: 'Add exponents in multiplication: 10³ × 10⁵ = 10⁸.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: HIGH DIFFICULTY (Questions 15 to 20)
  // ----------------------------------------------------
  {
    difficulty: 'High',
    subtopic_name: 'Decimal Expansions',
    subtopic_id: 177,
    question_text: 'What is the fraction in simplest form for the repeating decimal 0.4545... (0.4̄5̄)?',
    option_a: '5/11',
    option_b: '45/100',
    option_c: '45/99',
    option_d: '9/20',
    correct_answer: 'A',
    explanation: 'Let x = 0.4545... Then 100x = 45.4545... Subtract: 99x = 45, so x = 45/99. Simplifying by dividing top and bottom by 9 gives 5/11.',
    distractor_diagnostics: {
      B: {
        error: 'The student treated it as a terminating decimal (45/100).',
        remediation: 'Repeating decimals have denominators of 9s (45/99), not 100.'
      },
      C: {
        error: 'The student found 45/99 but forgot to simplify by dividing by 9.',
        remediation: 'Divide 45 and 99 by their GCF 9 to get simplest form: 5/11.'
      },
      D: {
        error: 'The student simplified 45/100 instead of 45/99.',
        remediation: 'Use 99 in denominator for two repeating digits: 45/99 = 5/11.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Integer Exponents & Radicals',
    subtopic_id: 179,
    question_text: 'Simplify: (2⁻³)⁻²',
    option_a: '64',
    option_b: '1/64',
    option_c: '-64',
    option_d: '1/32',
    correct_answer: 'A',
    explanation: 'Power of a power rule: multiply exponents: (-3) × (-2) = +6. Then 2⁶ = 64.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought the negative exponents remained negative.',
        remediation: 'Negative times negative is positive: (-3) × (-2) = +6, so 2⁶ = 64.'
      },
      C: {
        error: 'The student made the final result negative.',
        remediation: 'A positive base raised to any real power is always positive: 2⁶ = +64.'
      },
      D: {
        error: 'The student added exponents (-3 + -2 = -5) giving 1/32.',
        remediation: 'Power of a power rule requires MULTIPLYING exponents: (-3) × (-2) = 6.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Cube Roots',
    subtopic_id: 181,
    question_text: 'What is the real solution to the equation y³ = -125?',
    option_a: 'y = -5',
    option_b: 'y = 5 and y = -5',
    option_c: 'No real solution',
    option_d: 'y = 5',
    correct_answer: 'A',
    explanation: 'Since (-5) × (-5) × (-5) = -125, the cube root of -125 is -5. Cube roots of negative numbers have exactly one real negative solution.',
    distractor_diagnostics: {
      B: {
        error: 'The student included both +5 and -5, confusing cube roots with square roots.',
        remediation: 'Cube roots have only ONE real root: 5³ = +125 (not -125). Only (-5)³ = -125.'
      },
      C: {
        error: 'The student thought negative numbers cannot have cube roots.',
        remediation: 'Odd roots of negative numbers exist and are negative: ∛(-125) = -5.'
      },
      D: {
        error: 'The student omitted the negative sign.',
        remediation: '5³ = +125; since the equation equals -125, y must be -5.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Scientific Notation',
    subtopic_id: 183,
    question_text: 'What is (3.2 × 10⁴) + (5.1 × 10³) written in scientific notation?',
    option_a: '3.71 × 10⁴',
    option_b: '8.3 × 10⁷',
    option_c: '8.3 × 10⁴',
    option_d: '3.71 × 10³',
    correct_answer: 'A',
    explanation: 'Match exponents: 5.1 × 10³ = 0.51 × 10⁴. Add: (3.2 + 0.51) × 10⁴ = 3.71 × 10⁴.',
    distractor_diagnostics: {
      B: {
        error: 'The student added coefficients and added exponents (3.2 + 5.1 = 8.3, 10^(4+3) = 10⁷).',
        remediation: 'You cannot add numbers in scientific notation until their powers of 10 match.'
      },
      C: {
        error: 'The student added coefficients directly without matching exponents.',
        remediation: 'Convert 5.1 × 10³ to 0.51 × 10⁴ before adding.'
      },
      D: {
        error: 'The student used the smaller exponent 10³.',
        remediation: '3.71 × 10⁴ is in proper scientific notation with coefficient 3.71.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Scientific Notation',
    subtopic_id: 183,
    question_text: 'What is (8.4 × 10⁷) ÷ (2.1 × 10³) in scientific notation?',
    option_a: '4.0 × 10⁴',
    option_b: '4.0 × 10¹⁰',
    option_c: '4.0 × 10²',
    option_d: '6.3 × 10⁴',
    correct_answer: 'A',
    explanation: 'Divide coefficients: 8.4 ÷ 2.1 = 4.0. Subtract exponents: 7 - 3 = 4. Quotient = 4.0 × 10⁴.',
    distractor_diagnostics: {
      B: {
        error: 'The student added the exponents (7 + 3 = 10) instead of subtracting them.',
        remediation: 'When dividing powers of 10, SUBTRACT the exponents: 7 - 3 = 4.'
      },
      C: {
        error: 'The student divided the exponents (7 ÷ 3).',
        remediation: 'Subtract exponents in division: 10^(7 - 3) = 10⁴.'
      },
      D: {
        error: 'The student subtracted the coefficients (8.4 - 2.1 = 6.3) instead of dividing.',
        remediation: 'Divide the coefficients: 8.4 ÷ 2.1 = 4.0.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Rational Approximations',
    subtopic_id: 178,
    question_text: 'Which shows the numbers ordered from LEAST to GREATEST: √8, 3, π, √15?',
    option_a: '√8, 3, π, √15',
    option_b: '3, √8, π, √15',
    option_c: '√8, π, 3, √15',
    option_d: '√15, π, 3, √8',
    correct_answer: 'A',
    explanation: 'Approximate each value: √8 ≈ 2.83, 3 = 3.00, π ≈ 3.14, √15 ≈ 3.87. Order: 2.83 < 3.00 < 3.14 < 3.87, which is √8 < 3 < π < √15.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought √8 is greater than 3.',
        remediation: '3² = 9; since 8 < 9, √8 is less than 3 (approx 2.83 < 3).'
      },
      C: {
        error: 'The student placed π before 3.',
        remediation: 'π ≈ 3.14, which is greater than 3.00.'
      },
      D: {
        error: 'The student ordered from greatest to least.',
        remediation: 'Least to greatest begins with the smallest number (√8 ≈ 2.83).'
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

  console.log(`Starting insertion of ${grade8QuestionsData.length} Grade 8 questions...`);

  let inserted = 0;
  let updated = 0;

  for (const q of grade8QuestionsData) {
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = 8',
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
          grade_id = 8,
          grade = 8,
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
          8, 8, ?, ?,
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

  console.log(`\nComplete! Inserted: ${inserted}, Updated: ${updated}, Total: ${grade8QuestionsData.length}`);

  const [totalG8Number] = await pool.query(
    'SELECT COUNT(*) as count FROM questions WHERE grade = 8 AND topic_id = 3 AND is_active = 1'
  );
  console.log(`Total active Grade 8 Number & Operations questions in DB: ${totalG8Number[0].count}`);

  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding Grade 8 questions:', err);
  process.exit(1);
});
