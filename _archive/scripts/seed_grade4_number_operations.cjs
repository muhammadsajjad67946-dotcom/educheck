const mysql = require('mysql2/promise');
require('dotenv').config();

const grade4QuestionsData = [
  // ----------------------------------------------------
  // LEVEL 1: LOW DIFFICULTY (Questions 1 to 7)
  // ----------------------------------------------------
  {
    difficulty: 'Low',
    subtopic_name: 'Place Value & 10x Relationships',
    subtopic_id: 161,
    question_text: 'In the number 550, how does the value of the 5 in the hundreds place compare to the value of the 5 in the tens place?',
    option_a: 'It is 10 times greater',
    option_b: 'It is 100 times greater',
    option_c: 'It is 10 less',
    option_d: 'They have the exact same value',
    correct_answer: 'A',
    explanation: 'The 5 in the hundreds place represents 500. The 5 in the tens place represents 50. Since 500 = 50 × 10, it is 10 times greater.',
    distractor_diagnostics: {
      B: {
        error: 'The student confused the 10x adjacent step with a 100x jump (confused tens place with ones place).',
        remediation: 'Remember: each step to the left on a place value chart multiplies the value by 10.'
      },
      C: {
        error: 'The student subtracted instead of recognizing the multiplicative 10x relationship.',
        remediation: 'Place value positions grow by multiplying by 10, not by addition or subtraction.'
      },
      D: {
        error: 'The student looked only at the face value (both are the digit 5) ignoring their positions.',
        remediation: 'Always consider the column position: 5 hundreds (500) is much larger than 5 tens (50).'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multi-Digit Representation & Expanded Form',
    subtopic_id: 161,
    question_text: 'What is the standard form of 60,000 + 4,000 + 300 + 20 + 8?',
    option_a: '64,328',
    option_b: '604,328',
    option_c: '640,328',
    option_d: '64,238',
    correct_answer: 'A',
    explanation: 'Combine the place values: 6 ten thousands, 4 thousands, 3 hundreds, 2 tens, and 8 ones = 64,328.',
    distractor_diagnostics: {
      B: {
        error: 'The student inserted an extra zero, shifting 60,000 into the hundred-thousands place.',
        remediation: 'Count the digits: 60,000 has 5 digits, so the standard number must be a 5-digit number.'
      },
      C: {
        error: 'The student inserted an extra zero in the thousands place.',
        remediation: 'Use a place-value grid to place each digit into its matching column (T-Th, Th, H, T, O).'
      },
      D: {
        error: 'The student reversed the tens and ones digits (wrote 38 instead of 28).',
        remediation: 'Match each part carefully: 20 is 2 tens, and 8 is 8 ones.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Rounding Multi-Digit Numbers',
    subtopic_id: 161,
    question_text: 'What is 43,628 rounded to the nearest thousand?',
    option_a: '44,000',
    option_b: '43,000',
    option_c: '43,600',
    option_d: '50,000',
    correct_answer: 'A',
    explanation: 'To round to the nearest thousand, look at the hundreds digit (6). Since 6 >= 5, round up: 43 thousands becomes 44,000.',
    distractor_diagnostics: {
      B: {
        error: 'The student rounded down to 43,000 even though the hundreds digit (6) is 5 or greater.',
        remediation: 'Follow the rounding rule: if the digit to the right is 5, 6, 7, 8, or 9, round UP to the next thousand.'
      },
      C: {
        error: 'The student rounded to the nearest hundred instead of the nearest thousand.',
        remediation: 'Check the question target: rounding to the nearest thousand means replacing hundreds, tens, and ones with zeros.'
      },
      D: {
        error: 'The student rounded to the nearest ten thousand instead of nearest thousand.',
        remediation: 'Underline the thousands place digit (3) and circle the hundreds digit (6) before rounding.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multi-Digit Addition & Subtraction',
    subtopic_id: 167,
    question_text: 'What is 34,512 + 23,169?',
    option_a: '57,681',
    option_b: '57,671',
    option_c: '57,680',
    option_d: '58,681',
    correct_answer: 'A',
    explanation: 'Add column by column: Ones: 2 + 9 = 11 (write 1, carry 1). Tens: 1 + 6 + 1 = 8. Hundreds: 5 + 1 = 6. Thousands: 4 + 3 = 7. Ten thousands: 3 + 2 = 5. Total = 57,681.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot to add the carried 1 in the tens column (1 + 6 = 7).',
        remediation: 'Always write carried digits at the top of the next column and cross them off after adding.'
      },
      C: {
        error: 'The student made an addition error in the ones column (2 + 9 = 10 instead of 11).',
        remediation: 'Practice single-digit sums that cross 10 using mental math or finger counting.'
      },
      D: {
        error: 'The student carried an extra 1 into the thousands column when no carrying was required.',
        remediation: 'Only carry when the column sum is 10 or greater.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multi-Digit Multiplication',
    subtopic_id: 167,
    question_text: 'What is 423 × 4?',
    option_a: '1,692',
    option_b: '1,682',
    option_c: '1,612',
    option_d: '16,92',
    correct_answer: 'A',
    explanation: '4 × 3 ones = 12 (write 2, carry 1 ten). 4 × 2 tens = 8 + 1 = 9 tens. 4 × 4 hundreds = 16 hundreds. Total = 1,692.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot to add the carried 1 ten to the tens place (4 × 2 = 8).',
        remediation: 'Remember to multiply first, then add the carried amount: (4 × 2) + 1 = 9.'
      },
      C: {
        error: 'The student did not carry to the tens place and wrote 1 directly.',
        remediation: 'Practice vertical multiplication with clear regrouping boxes at the top.'
      },
      D: {
        error: 'The student misplaced the thousands comma.',
        remediation: 'Count three digits from the right to place the comma (1,692).'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multi-Digit Multiplication',
    subtopic_id: 167,
    question_text: 'What is 20 × 30?',
    option_a: '600',
    option_b: '60',
    option_c: '6,000',
    option_d: '500',
    correct_answer: 'A',
    explanation: 'Multiply the non-zero digits: 2 × 3 = 6. Count the zeros in both factors: two zeros. Append two zeros: 600.',
    distractor_diagnostics: {
      B: {
        error: 'The student appended only one zero instead of two (20 × 3 = 60).',
        remediation: 'Count all ending zeros in both factors: 20 has one zero and 30 has one zero, so total 2 zeros.'
      },
      C: {
        error: 'The student added too many zeros (thought 20 × 30 = 6,000).',
        remediation: 'Match the zero count: 1 zero + 1 zero = 2 zeros in the product.'
      },
      D: {
        error: 'The student added 20 + 30 = 50 and appended a zero.',
        remediation: 'Remember that multiplication scales factors; 2 tens × 3 tens = 6 hundreds (600).'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multi-Digit Division & Remainders',
    subtopic_id: 167,
    question_text: 'What is 428 ÷ 4?',
    option_a: '107',
    option_b: '17',
    option_c: '170',
    option_d: '102',
    correct_answer: 'A',
    explanation: '4 ÷ 4 = 1 hundred. 2 tens ÷ 4 = 0 tens (remainder 2). 28 ones ÷ 4 = 7 ones. Result = 107.',
    distractor_diagnostics: {
      B: {
        error: 'The student omitted the zero in the tens place (wrote 17 instead of 107).',
        remediation: 'When a divisor does not go into a digit (2 < 4), you MUST put a 0 in the quotient before bringing down the next digit.'
      },
      C: {
        error: 'The student placed the zero at the end instead of in the tens column.',
        remediation: 'Keep quotient digits strictly aligned above the dividend column being divided.'
      },
      D: {
        error: 'The student made a division fact error with 28 ÷ 4 (thought it was 2).',
        remediation: 'Review the 4 times table: 4 × 7 = 28.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: MEDIUM DIFFICULTY (Questions 8 to 14)
  // ----------------------------------------------------
  {
    difficulty: 'Medium',
    subtopic_name: 'Place Value & 10x Relationships',
    subtopic_id: 161,
    question_text: 'How many times larger is 7,000 than 700?',
    option_a: '10 times',
    option_b: '100 times',
    option_c: '7 times',
    option_d: '1,000 times',
    correct_answer: 'A',
    explanation: '7,000 ÷ 700 = 10. Since thousands is exactly one place to the left of hundreds, it is 10 times larger.',
    distractor_diagnostics: {
      B: {
        error: 'The student thought the difference of 2 zeros vs 3 zeros meant 100 times.',
        remediation: 'Compare the number of zeros: 7,000 has only one more zero than 700, which means 10 times.'
      },
      C: {
        error: 'The student used the leading digit (7) as the ratio.',
        remediation: 'The ratio depends on place value position (powers of 10), not the face value digit.'
      },
      D: {
        error: 'The student named the place value of the larger number instead of the comparison ratio.',
        remediation: 'Divide the larger number by the smaller number: 7,000 ÷ 700 = 10.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit Representation & Expanded Form',
    subtopic_id: 161,
    question_text: 'Which number represents "Five hundred four thousand, twenty-six"?',
    option_a: '504,026',
    option_b: '540,026',
    option_c: '504,260',
    option_d: '5,426',
    correct_answer: 'A',
    explanation: 'Thousands period: "Five hundred four thousand" = 504. Units period: "twenty-six" = 026. Combined = 504,026.',
    distractor_diagnostics: {
      B: {
        error: 'The student confused 504 thousand with 540 thousand (put 4 in ten-thousands instead of thousands).',
        remediation: '"Five hundred four" means 5 hundreds and 4 ones in the thousands period (504).'
      },
      C: {
        error: 'The student wrote twenty-six as 260 (confused tens with ones).',
        remediation: '"Twenty-six" has 2 tens and 6 ones (26), not 26 tens.'
      },
      D: {
        error: 'The student dropped internal placeholder zeros for hundreds and ten-thousands.',
        remediation: 'Every multi-digit standard number requires 3 digits in each period (use 0 for empty places).'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit Representation & Expanded Form',
    subtopic_id: 161,
    question_text: 'Which symbol makes this comparison true: 348,219 __ 348,291?',
    option_a: '<',
    option_b: '>',
    option_c: '=',
    option_d: '+',
    correct_answer: 'A',
    explanation: 'Compare from left to right: Hundred-thousands (3=3), Ten-thousands (4=4), Thousands (8=8), Hundreds (2=2). In the tens place, 1 < 9. Therefore, 348,219 < 348,291.',
    distractor_diagnostics: {
      B: {
        error: 'The student looked at the ones place (9 > 1) instead of comparing higher place value (tens: 1 < 9).',
        remediation: 'Always compare digits starting from left to right; stop at the first place where digits differ.'
      },
      C: {
        error: 'The student saw that both numbers have the same set of digits and assumed they are equal.',
        remediation: 'The position of each digit changes its value; 1 ten is not equal to 9 tens.'
      },
      D: {
        error: 'The student selected an operation symbol instead of a comparison symbol.',
        remediation: 'Use < (less than) when the number on the left is smaller.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Rounding Multi-Digit Numbers',
    subtopic_id: 161,
    question_text: 'What is 284,519 rounded to the nearest ten thousand?',
    option_a: '280,000',
    option_b: '290,000',
    option_c: '285,000',
    option_d: '300,000',
    correct_answer: 'A',
    explanation: 'The ten-thousands digit is 8. The digit to its right (thousands digit) is 4. Since 4 < 5, round down to 280,000.',
    distractor_diagnostics: {
      B: {
        error: 'The student rounded up to 290,000 because of the 5 in hundreds place instead of checking the thousands place (4).',
        remediation: 'Only look at the single digit immediately to the right of your target place (thousands digit 4).'
      },
      C: {
        error: 'The student rounded to the nearest thousand instead of ten thousand.',
        remediation: 'Rounding to nearest ten thousand means replacing thousands, hundreds, tens, and ones with four zeros.'
      },
      D: {
        error: 'The student rounded to the nearest hundred thousand.',
        remediation: 'Identify the target column: ten-thousands is the second digit from the left in a 6-digit number.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit Addition & Subtraction',
    subtopic_id: 167,
    question_text: 'What is 248,395 + 176,824?',
    option_a: '425,219',
    option_b: '415,219',
    option_c: '424,119',
    option_d: '425,119',
    correct_answer: 'A',
    explanation: 'Ones: 5+4=9. Tens: 9+2=11 (write 1, carry 1). Hundreds: 3+8+1=12 (write 2, carry 1). Thousands: 8+6+1=15 (write 5, carry 1). Ten-thousands: 4+7+1=12 (write 2, carry 1). Hundred-thousands: 2+1+1=4. Total = 425,219.',
    distractor_diagnostics: {
      B: {
        error: 'The student missed carrying into the ten-thousands place (4 + 7 = 11).',
        remediation: 'Track each carried 1 carefully above each column in multi-regrouping problems.'
      },
      C: {
        error: 'The student forgot to carry into the thousands place.',
        remediation: 'Practice multi-digit addition on lined grid paper to keep columns organized.'
      },
      D: {
        error: 'The student made a calculation error in the hundreds column (3 + 8 + 1 = 11 instead of 12).',
        remediation: 'Double-check sums greater than 10 using the make-ten strategy: 8 + 3 = 11, + 1 = 12.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit Addition & Subtraction',
    subtopic_id: 167,
    question_text: 'What is 62,415 - 28,173?',
    option_a: '34,242',
    option_b: '44,242',
    option_c: '34,342',
    option_d: '33,242',
    correct_answer: 'A',
    explanation: 'Ones: 5-3=2. Tens: 11-7=4 (borrow from 4 hundreds). Hundreds: 3-1=2. Thousands: 12-8=4 (borrow from 6 ten-thousands). Ten-thousands: 5-2=3. Total = 34,242.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot to decrease 6 to 5 after borrowing for the thousands column (6 - 2 = 4).',
        remediation: 'Always cross out and decrease the borrowed column before doing the subtraction.'
      },
      C: {
        error: 'The student forgot that 4 hundreds was reduced to 3 after borrowing for tens (calculated 4 - 1 = 3).',
        remediation: 'Rewrite the new values above the columns immediately when borrowing.'
      },
      D: {
        error: 'The student made a subtraction error in the thousands column (12 - 8 = 3 instead of 4).',
        remediation: 'Use addition to check: 8 + 4 = 12.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multi-Digit Division & Remainders',
    subtopic_id: 167,
    question_text: 'What is 539 ÷ 5?',
    option_a: '107 R 4',
    option_b: '17 R 4',
    option_c: '107 R 0',
    option_d: '109 R 4',
    correct_answer: 'A',
    explanation: '5 ÷ 5 = 1. 3 ÷ 5 = 0 (carry 3). 39 ÷ 5 = 7 with remainder 4 (5 × 7 = 35, 39 - 35 = 4). Quotient = 107 R 4.',
    distractor_diagnostics: {
      B: {
        error: 'The student missed the 0 in the tens place of the quotient.',
        remediation: 'Since 5 goes into 3 zero times, write 0 in the quotient before bringing down 9.'
      },
      C: {
        error: 'The student forgot to write the remainder.',
        remediation: 'Subtract the product from the dividend part: 39 - 35 = 4 remainder.'
      },
      D: {
        error: 'The student made a division fact error (thought 5 × 9 = 35).',
        remediation: 'Review 5s multiplication facts: 5 × 7 = 35 and 5 × 8 = 40.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: HIGH DIFFICULTY (Questions 15 to 20)
  // ----------------------------------------------------
  {
    difficulty: 'High',
    subtopic_name: 'Place Value & 10x Relationships',
    subtopic_id: 161,
    question_text: 'How does the value of the 4 in 40,000 compare to the value of the 4 in 400?',
    option_a: 'It is 100 times greater',
    option_b: 'It is 10 times greater',
    option_c: 'It is 1,000 times greater',
    option_d: 'It is 40 times greater',
    correct_answer: 'A',
    explanation: '40,000 ÷ 400 = 100. Moving two places to the left on a place value chart (hundreds -> thousands -> ten-thousands) multiplies the value by 10 × 10 = 100.',
    distractor_diagnostics: {
      B: {
        error: 'The student assumed all place value comparisons are 10 times, not noticing a two-column jump.',
        remediation: 'Count the number of columns shifted: 1 jump = 10x, 2 jumps = 100x, 3 jumps = 1,000x.'
      },
      C: {
        error: 'The student counted 3 extra zeros by mistake.',
        remediation: 'Divide: 40,000 ÷ 400 = 100 (remove two zeros from both).'
      },
      D: {
        error: 'The student confused the face value (4) with the base-ten power.',
        remediation: 'Powers of ten are always 10, 100, 1,000, etc., never multiples of the digit.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Rounding Multi-Digit Numbers',
    subtopic_id: 161,
    question_text: 'What is the SMALLEST whole number that rounds to 50,000 when rounded to the nearest ten thousand?',
    option_a: '45,000',
    option_b: '49,500',
    option_c: '44,999',
    option_d: '54,999',
    correct_answer: 'A',
    explanation: 'To round up to 50,000 to the nearest ten thousand, the thousands digit must be at least 5. The smallest number is 45,000.',
    distractor_diagnostics: {
      B: {
        error: 'The student chose 49,500 which is rounded to nearest thousand, not the minimum for ten-thousand.',
        remediation: 'Find the cutoff: any number from 45,000 to 54,999 rounds to 50,000; the smallest is 45,000.'
      },
      C: {
        error: 'The student chose 44,999, which rounds down to 40,000 because the thousands digit is 4.',
        remediation: 'Remember: 4 rounds down; you need a 5 in the thousands place to round up to 50,000.'
      },
      D: {
        error: 'The student selected the LARGEST number that rounds to 50,000 instead of the smallest.',
        remediation: 'Read the question carefully: it asks for the SMALLEST whole number, which is 45,000.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Multi-Digit Addition & Subtraction',
    subtopic_id: 167,
    question_text: 'What is 500,000 - 184,327?',
    option_a: '315,673',
    option_b: '325,673',
    option_c: '415,673',
    option_d: '316,673',
    correct_answer: 'A',
    explanation: 'Borrow 1 hundred-thousand from 5, leaving 4. Middle zeros become 9s: 9 ten-thousands, 9 thousands, 9 hundreds, 9 tens, and 10 ones. Subtracting gives 315,673.',
    distractor_diagnostics: {
      B: {
        error: 'The student made an error in the ten-thousands column (calculated 10 - 8 instead of 9 - 8).',
        remediation: 'When borrowing across multiple zeros, all intermediate zeros become 9, and only the final ones digit becomes 10.'
      },
      C: {
        error: 'The student forgot to decrement the leading 5 to 4 after borrowing.',
        remediation: 'Always decrease the original source column from which you borrowed.'
      },
      D: {
        error: 'The student made an off-by-one subtraction error in the thousands column (9 - 4 = 6).',
        remediation: 'Check each column subtraction: 9 - 4 = 5.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Multi-Digit Multiplication',
    subtopic_id: 167,
    question_text: 'What is 36 × 24?',
    option_a: '864',
    option_b: '724',
    option_c: '844',
    option_d: '216',
    correct_answer: 'A',
    explanation: 'Using partial products: (30 × 20) + (30 × 4) + (6 × 20) + (6 × 4) = 600 + 120 + 120 + 24 = 864.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot the placeholder zero when multiplying by the tens digit (20).',
        remediation: 'When multiplying by 2 tens, the partial product must end in 0 (36 × 20 = 720).'
      },
      C: {
        error: 'The student made a regrouping addition error in the tens column.',
        remediation: 'Align partial products vertically: 144 + 720 = 864.'
      },
      D: {
        error: 'The student completed only the first partial product (36 × 6) or (36 × 4 = 144) without finishing.',
        remediation: 'Multiply by both the ones digit and the tens digit, then add both partial products together.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Multi-Digit Multiplication',
    subtopic_id: 167,
    question_text: 'A factory packs 3,245 boxes of toys every day. How many boxes of toys does the factory pack in 6 days?',
    option_a: '19,470',
    option_b: '18,270',
    option_c: '19,270',
    option_d: '19,460',
    correct_answer: 'A',
    explanation: 'Multiply: 6 × 5 = 30 (write 0, carry 3). 6 × 4 = 24 + 3 = 27 (write 7, carry 2). 6 × 2 = 12 + 2 = 14 (write 4, carry 1). 6 × 3 = 18 + 1 = 19. Total = 19,470.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot all carried digits into the hundreds and thousands columns.',
        remediation: 'Write carried digits above each column and add them after multiplying.'
      },
      C: {
        error: 'The student forgot to carry 2 into the hundreds column (6 × 2 = 12, forgot +2 = 14).',
        remediation: 'Check each column step: (6 × 2) + 2 = 14.'
      },
      D: {
        error: 'The student misadded carried digits in the tens column (24 + 3 = 26 instead of 27).',
        remediation: 'Double-check simple addition of carried amounts.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Multi-Digit Division & Remainders',
    subtopic_id: 167,
    question_text: 'A farmer collected 3,124 eggs. He packs them into cartons that hold 6 eggs each. How many FULL cartons can he pack, and how many eggs will be left over?',
    option_a: '520 full cartons, 4 eggs left over',
    option_b: '52 full cartons, 4 eggs left over',
    option_c: '524 full cartons, 0 eggs left over',
    option_d: '520 full cartons, 0 eggs left over',
    correct_answer: 'A',
    explanation: 'Divide: 3,124 ÷ 6. 31 ÷ 6 = 5 (remainder 1). 12 ÷ 6 = 2 (remainder 0). 4 ÷ 6 = 0 (remainder 4). Result: 520 full cartons with 4 eggs left over.',
    distractor_diagnostics: {
      B: {
        error: 'The student omitted the zero in the quotient ones place (wrote 52 instead of 520).',
        remediation: 'Since 6 goes into 4 zero times, you MUST record 0 in the quotient before stating the remainder.'
      },
      C: {
        error: 'The student forced 4 into the quotient without dividing.',
        remediation: 'A remainder must be smaller than the divisor (4 < 6) and cannot be added as a quotient digit.'
      },
      D: {
        error: 'The student ignored the remainder of 4 eggs completely.',
        remediation: 'Always report leftover units: 3,124 = (520 × 6) + 4.'
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

  console.log(`Starting insertion of ${grade4QuestionsData.length} Grade 4 questions...`);

  let inserted = 0;
  let updated = 0;

  for (const q of grade4QuestionsData) {
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = 4',
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
          grade_id = 4,
          grade = 4,
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
          4, 4, ?, ?,
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

  console.log(`\nComplete! Inserted: ${inserted}, Updated: ${updated}, Total: ${grade4QuestionsData.length}`);

  const [totalG4Number] = await pool.query(
    'SELECT COUNT(*) as count FROM questions WHERE grade = 4 AND topic_id = 3 AND is_active = 1'
  );
  console.log(`Total active Grade 4 Number & Operations questions in DB: ${totalG4Number[0].count}`);

  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding Grade 4 questions:', err);
  process.exit(1);
});
