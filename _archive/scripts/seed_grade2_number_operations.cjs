const mysql = require('mysql2/promise');
require('dotenv').config();

const questionsData = [
  // ----------------------------------------------------
  // LEVEL 1: LOW DIFFICULTY (Questions 1 to 7)
  // ----------------------------------------------------
  {
    difficulty: 'Low',
    subtopic_name: 'Mental Addition & Subtraction',
    subtopic_id: 152,
    question_text: 'What is 8 + 7?',
    option_a: '14',
    option_b: '15',
    option_c: '16',
    option_d: '13',
    correct_answer: 'B',
    explanation: 'Use doubles strategy: 7 + 7 = 14, so 8 + 7 = 14 + 1 = 15. Or make 10: 8 + 2 = 10, and 10 + 5 = 15.',
    distractor_diagnostics: {
      A: {
        error: 'The student made a doubling error (7 + 7 = 14 without adding the extra 1).',
        remediation: 'Practice "doubles plus one" mental addition facts within 20.'
      },
      C: {
        error: 'The student made an off-by-one counting error while counting up.',
        remediation: 'Use number lines or ten-frames to verify mental sums.'
      },
      D: {
        error: 'The student confused addition with subtraction or miscounted backwards.',
        remediation: 'Practice basic addition combinations that make 10.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Counting & Number Representation',
    subtopic_id: 149,
    question_text: 'What is the missing number in this pattern: 35, 40, 45, __, 55?',
    option_a: '46',
    option_b: '48',
    option_c: '50',
    option_d: '52',
    correct_answer: 'C',
    explanation: 'The numbers increase by 5 each step (35 + 5 = 40, 40 + 5 = 45). Adding 5 to 45 gives 50.',
    distractor_diagnostics: {
      A: {
        error: 'The student counted by 1s instead of recognizing the skip-count pattern of 5s.',
        remediation: 'Practice skip-counting out loud by 5s using a 100-chart.'
      },
      B: {
        error: 'The student guessed a number between 45 and 55 without checking the constant rule (+5).',
        remediation: 'Find the rule of a pattern by calculating the difference between consecutive numbers.'
      },
      D: {
        error: 'The student added the wrong step value (+7 instead of +5).',
        remediation: 'Practice counting sequences ending in 0 and 5 up to 100.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Counting & Number Representation',
    subtopic_id: 149,
    question_text: 'Which group of numbers are ALL even numbers?',
    option_a: '2, 5, 8',
    option_b: '4, 8, 12',
    option_c: '3, 7, 9',
    option_d: '6, 9, 14',
    correct_answer: 'B',
    explanation: 'Even numbers can be paired equally and end in 0, 2, 4, 6, or 8. The numbers 4, 8, and 12 are all even.',
    distractor_diagnostics: {
      A: {
        error: 'The student overlooked the odd number 5 because 2 and 8 are even.',
        remediation: 'Check every number individually in a list to verify if it ends in 0, 2, 4, 6, or 8.'
      },
      C: {
        error: 'The student confused the definition of even numbers with odd numbers.',
        remediation: 'Use counters in pairs of two to visually see the difference between odd and even.'
      },
      D: {
        error: 'The student ignored that 9 cannot be split into two equal whole numbers.',
        remediation: 'Practice pairing objects to test for remainders.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Mental Addition & Subtraction',
    subtopic_id: 152,
    question_text: 'What is 16 - 9?',
    option_a: '7',
    option_b: '8',
    option_c: '9',
    option_d: '6',
    correct_answer: 'A',
    explanation: 'Think of addition: 9 + 7 = 16, so 16 - 9 = 7. Or subtract to 10: 16 - 6 = 10, then 10 - 3 = 7.',
    distractor_diagnostics: {
      B: {
        error: 'The student confused with half of 16 (16 - 8 = 8) or made an off-by-one counting error.',
        remediation: 'Practice subtracting 9 by taking away 10 and adding back 1.'
      },
      C: {
        error: 'The student misunderstood subtraction as finding doubles (9 + 9 = 18).',
        remediation: 'Use fact families (7 + 9 = 16, 16 - 9 = 7) to relate subtraction to addition.'
      },
      D: {
        error: 'The student subtracted only the ones place (16 - 10 = 6) without adjusting for 9.',
        remediation: 'Break numbers down using ten-frames when subtracting across 10.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Place Value',
    subtopic_id: 150,
    question_text: 'In the number 348, what is the value of the digit 4?',
    option_a: '4',
    option_b: '40',
    option_c: '400',
    option_d: '48',
    correct_answer: 'B',
    explanation: 'In 348, the digit 3 is in the hundreds place (300), the digit 4 is in the tens place (4 tens = 40), and 8 is in the ones place (8).',
    distractor_diagnostics: {
      A: {
        error: 'The student stated the face value of the digit instead of its place value in the tens column.',
        remediation: 'Practice naming the value of digits based on their position (Hundreds, Tens, Ones).'
      },
      C: {
        error: 'The student confused the tens place with the hundreds place.',
        remediation: 'Use a place value chart to align 3-digit numbers into H, T, and O columns.'
      },
      D: {
        error: 'The student combined the tens and ones digits together rather than identifying digit 4 alone.',
        remediation: 'Isolate individual column values using base-ten blocks.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Mental Math - 10 More & 10 Less',
    subtopic_id: 359,
    question_text: 'What number is 10 more than 53?',
    option_a: '54',
    option_b: '63',
    option_c: '43',
    option_d: '73',
    correct_answer: 'B',
    explanation: 'Adding 10 increases only the tens digit by 1: 5 tens + 1 ten = 6 tens. The ones digit stays 3. So, 53 + 10 = 63.',
    distractor_diagnostics: {
      A: {
        error: 'The student added 1 instead of adding 10 (changed the ones digit instead of tens).',
        remediation: 'Practice distinguishing between "+1" (next number) and "+10" (next row on a 100-chart).'
      },
      C: {
        error: 'The student subtracted 10 instead of adding 10 (confused "10 more" with "10 less").',
        remediation: 'Highlight keywords: "more" means increase (+), "less" means decrease (-).'
      },
      D: {
        error: 'The student added 20 instead of 10.',
        remediation: 'Practice jumping one row down (+10) on a hundred chart.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Equal Groups & Rectangular Arrays',
    subtopic_id: 156,
    question_text: 'A baker puts cookies in 3 rows with 4 cookies in each row. Which addition sentence shows the total number of cookies?',
    option_a: '3 + 4 = 7',
    option_b: '4 + 4 + 4 = 12',
    option_c: '3 + 3 + 3 = 9',
    option_d: '4 + 4 + 4 + 4 = 16',
    correct_answer: 'B',
    explanation: 'There are 3 groups of 4 cookies. Repeated addition is 4 + 4 + 4 = 12.',
    distractor_diagnostics: {
      A: {
        error: 'The student added the number of rows to the number in each row instead of using repeated addition.',
        remediation: 'Draw an array with rows and columns to show that arrays represent repeated addition.'
      },
      C: {
        error: 'The student repeated the number of rows (3) three times instead of the cookies in each row (4).',
        remediation: 'Identify the group size first, then repeat it by the number of rows.'
      },
      D: {
        error: 'The student added an extra fourth row (used 4 groups of 4).',
        remediation: 'Count rows carefully before writing repeated addition sentences.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: MEDIUM DIFFICULTY (Questions 8 to 14)
  // ----------------------------------------------------
  {
    difficulty: 'Medium',
    subtopic_name: 'Place Value Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 43 + 25?',
    option_a: '68',
    option_b: '58',
    option_c: '78',
    option_d: '67',
    correct_answer: 'A',
    explanation: 'Add the ones: 3 + 5 = 8. Add the tens: 4 + 2 = 6. Total = 68.',
    distractor_diagnostics: {
      B: {
        error: 'The student miscalculated the tens column (4 + 2 = 5 instead of 6).',
        remediation: 'Practice adding multiples of 10 separately from ones.'
      },
      C: {
        error: 'The student unnecessarily carried a ten into the tens column when ones did not exceed 9.',
        remediation: 'Check if the ones sum is 10 or greater before regrouping.'
      },
      D: {
        error: 'The student made an off-by-one calculation error in the ones column (3 + 5 = 7).',
        remediation: 'Use touch points or fingers to verify single-digit sums.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Place Value',
    subtopic_id: 150,
    question_text: 'Sana has 14 tens blocks. How can 14 tens be written as hundreds and tens?',
    option_a: '1 hundred and 4 tens (140)',
    option_b: '14 hundreds (1400)',
    option_c: '1 hundred and 4 ones (104)',
    option_d: '4 hundreds and 1 ten (410)',
    correct_answer: 'A',
    explanation: '10 tens make 1 hundred (100). The remaining 4 tens make 40. So 14 tens = 1 hundred and 4 tens = 140.',
    distractor_diagnostics: {
      B: {
        error: 'The student confused the unit "tens" with "hundreds".',
        remediation: 'Trade 10 ten-rods for 1 hundred-flat using base-ten manipulatives.'
      },
      C: {
        error: 'The student treated leftover tens as ones (confused 40 with 4).',
        remediation: 'Practice regrouping tens: remember each remaining ten rod has a value of 10.'
      },
      D: {
        error: 'The student reversed the digits (put 4 in hundreds place and 1 in tens place).',
        remediation: 'Draw a place value table to place regrouped hundreds on the left.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Compare Two-Digit Numbers',
    subtopic_id: 358,
    question_text: 'Which symbol makes this comparison true: 562 __ 526?',
    option_a: '>',
    option_b: '<',
    option_c: '=',
    option_d: '+',
    correct_answer: 'A',
    explanation: 'Both numbers have 5 hundreds. Comparing the tens place: 562 has 6 tens and 526 has 2 tens. Since 6 > 2, 562 > 526.',
    distractor_diagnostics: {
      B: {
        error: 'The student looked at the ones digits (2 < 6) instead of comparing from left to right (tens digit).',
        remediation: 'Always compare digits starting from the highest place value (hundreds, then tens, then ones).'
      },
      C: {
        error: 'The student saw that both numbers contain the digits 5, 6, and 2 and assumed they are equal regardless of order.',
        remediation: 'Review how digit order affects place value and total number size.'
      },
      D: {
        error: 'The student selected an operation symbol instead of an inequality comparison symbol.',
        remediation: 'Review the comparison symbols (>, <, =) and what each represents.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Place Value Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 57 + 26?',
    option_a: '73',
    option_b: '83',
    option_c: '713',
    option_d: '84',
    correct_answer: 'B',
    explanation: 'Add ones: 7 + 6 = 13 (write 3, regroup 1 ten). Add tens: 5 + 2 + 1 = 8 tens. Total = 83.',
    distractor_diagnostics: {
      A: {
        error: 'The student forgot to add the regrouped 1 ten to the tens column (5 + 2 = 7).',
        remediation: 'Practice writing the carried ten above the tens column and crossing it off after adding.'
      },
      C: {
        error: 'The student wrote the full 13 in the answer instead of regrouping 1 ten to the tens place.',
        remediation: 'Reinforce place value rules: only one digit can sit in each place value column.'
      },
      D: {
        error: 'The student miscalculated ones place (7 + 6 = 14 instead of 13).',
        remediation: 'Practice addition facts that cross 10 using the "make a ten" strategy.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Mental Math - 10 More & 10 Less',
    subtopic_id: 359,
    question_text: 'What number is 100 less than 745?',
    option_a: '735',
    option_b: '645',
    option_c: '845',
    option_d: '635',
    correct_answer: 'B',
    explanation: 'Subtracting 100 changes only the hundreds place: 7 hundreds - 1 hundred = 6 hundreds. Tens and ones stay 45. Answer = 645.',
    distractor_diagnostics: {
      A: {
        error: 'The student subtracted 10 instead of 100 (reduced the tens column instead of hundreds).',
        remediation: 'Verify which place value column changes when dealing with 10 vs 100.'
      },
      C: {
        error: 'The student added 100 instead of subtracting (confused "less" with "more").',
        remediation: 'Practice matching "less" to subtraction (moving left/down).'
      },
      D: {
        error: 'The student subtracted from both hundreds and tens columns at the same time.',
        remediation: 'Practice isolating single place values during mental arithmetic.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Addition & Subtraction Word Problems',
    subtopic_id: 191,
    question_text: 'A fruit shop had 64 oranges. By afternoon, 28 oranges were sold. How many oranges are left in the shop?',
    option_a: '44',
    option_b: '92',
    option_c: '36',
    option_d: '46',
    correct_answer: 'C',
    explanation: 'Subtract oranges sold: 64 - 28. Regroup 1 ten into 14 ones: 14 - 8 = 6. Tens: 5 - 2 = 3. Answer is 36.',
    distractor_diagnostics: {
      A: {
        error: 'The student subtracted smaller digit from larger digit in ones place (8 - 4 = 4) instead of regrouping.',
        remediation: 'If the top digit is smaller than the bottom digit, remember to borrow/regroup from the tens.'
      },
      B: {
        error: 'The student added 64 + 28 instead of subtracting (misread the action "were sold / left").',
        remediation: 'Identify word problem clues: "sold" or "left" signifies taking away (subtraction).'
      },
      D: {
        error: 'The student subtracted ones with regrouping (14 - 8 = 6) but forgot to reduce the tens digit from 6 to 5 (6 - 2 = 4).',
        remediation: 'Cross out the tens digit when borrowing so you remember its new value.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Counting & Number Representation',
    subtopic_id: 149,
    question_text: 'Count by 100s starting from 320: 320, 420, 520, __, 720. What is the missing number?',
    option_a: '530',
    option_b: '620',
    option_c: '600',
    option_d: '521',
    correct_answer: 'B',
    explanation: 'Counting by 100s means adding 1 to the hundreds place each time while tens and ones stay unchanged: 520 + 100 = 620.',
    distractor_diagnostics: {
      A: {
        error: 'The student counted by 10s instead of 100s (520 + 10 = 530).',
        remediation: 'Pay attention to the specified skip step (100 vs 10).'
      },
      C: {
        error: 'The student rounded to nearest hundred instead of continuing the non-zero tens pattern.',
        remediation: 'Keep the tens and ones digits intact when adding hundreds.'
      },
      D: {
        error: 'The student counted by 1s instead of 100s.',
        remediation: 'Practice skip-counting by 100s starting from off-decade numbers (e.g., 115, 215, 315).'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: HIGH DIFFICULTY (Questions 15 to 20)
  // ----------------------------------------------------
  {
    difficulty: 'High',
    subtopic_name: 'Place Value Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 72 - 38?',
    option_a: '46',
    option_b: '34',
    option_c: '44',
    option_d: '36',
    correct_answer: 'B',
    explanation: 'Since 2 < 8, borrow 1 ten from 7: 12 - 8 = 4. The 7 tens become 6 tens: 6 - 3 = 3. Result = 34.',
    distractor_diagnostics: {
      A: {
        error: 'The student reversed subtraction in both columns (8 - 2 = 6 and 7 - 3 = 4).',
        remediation: 'Use base-ten blocks to model vertical subtraction where bottom cannot subtract from top without borrowing.'
      },
      C: {
        error: 'The student regrouped ones (12 - 8 = 4) but forgot to decrement the tens digit from 7 to 6 (7 - 3 = 4).',
        remediation: 'Practice two-digit subtraction with explicit regrouping boxes above the numbers.'
      },
      D: {
        error: 'The student miscalculated 12 - 8 = 6 in the ones column.',
        remediation: 'Review subtraction facts from 12 to build automaticity.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Addition & Subtraction Word Problems',
    subtopic_id: 191,
    question_text: 'Ali had 25 stickers. His brother gave him 15 more stickers. Then Ali gave 12 stickers to his friend. How many stickers does Ali have now?',
    option_a: '40',
    option_b: '52',
    option_c: '28',
    option_d: '22',
    correct_answer: 'C',
    explanation: 'Step 1: Add stickers received: 25 + 15 = 40. Step 2: Subtract stickers given away: 40 - 12 = 28.',
    distractor_diagnostics: {
      A: {
        error: 'The student completed only Step 1 (25 + 15 = 40) and stopped before subtracting the 12 stickers given away.',
        remediation: 'Read the entire word problem and underline all actions to complete all steps.'
      },
      B: {
        error: 'The student added all three numbers (25 + 15 + 12 = 52) without noticing "gave away" means subtraction.',
        remediation: 'Break multi-step word problems into two distinct timeline events (+ then -).'
      },
      D: {
        error: 'The student subtracted both numbers from 25 (25 - 15 = 10, 10 + 12 = 22) or made a regrouping mistake in 40 - 12.',
        remediation: 'Check subtraction across zeros (40 - 12 = 28).'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Place Value Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 348 + 275?',
    option_a: '623',
    option_b: '613',
    option_c: '523',
    option_d: '513',
    correct_answer: 'A',
    explanation: 'Ones: 8 + 5 = 13 (write 3, carry 1). Tens: 4 + 7 + 1 = 12 (write 2, carry 1). Hundreds: 3 + 2 + 1 = 6. Total = 623.',
    distractor_diagnostics: {
      B: {
        error: 'The student added ones (8 + 5 = 13, carried 1) but forgot to add the carried ten in the tens column (4 + 7 = 11).',
        remediation: 'Always write carried numbers at the top of the columns to include them in the addition.'
      },
      C: {
        error: 'The student forgot to carry 1 hundred to the hundreds column (3 + 2 = 5).',
        remediation: 'Practice double-regrouping problems (regrouping ones to tens AND tens to hundreds).'
      },
      D: {
        error: 'The student forgot both regroupings in tens and hundreds.',
        remediation: 'Use expanded addition: (300+200) + (40+70) + (8+5).'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Equal Groups & Rectangular Arrays',
    subtopic_id: 156,
    question_text: 'An array has 4 rows and 5 columns of stars. Which two addition sentences can be used to find the total number of stars?',
    option_a: '5 + 5 + 5 + 5 = 20 and 4 + 4 + 4 + 4 + 4 = 20',
    option_b: '4 + 5 = 9 and 5 + 4 = 9',
    option_c: '4 + 4 + 4 + 4 = 16 and 5 + 5 + 5 = 15',
    option_d: '20 - 4 = 16 and 20 - 5 = 15',
    correct_answer: 'A',
    explanation: 'Count by rows: 4 rows of 5 = 5 + 5 + 5 + 5 = 20. Count by columns: 5 columns of 4 = 4 + 4 + 4 + 4 + 4 = 20.',
    distractor_diagnostics: {
      B: {
        error: 'The student added row count and column count together instead of repeated addition.',
        remediation: 'Draw the grid of dots to visualize how rows and columns create a total area.'
      },
      C: {
        error: 'The student used only 4 groups of 4 instead of representing 5 columns.',
        remediation: 'Count rows horizontally and columns vertically before writing expressions.'
      },
      D: {
        error: 'The student used subtraction operations instead of repeated addition sentences.',
        remediation: 'Remember that arrays represent equal groups combined (addition/multiplication).'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Place Value Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 500 - 236?',
    option_a: '336',
    option_b: '274',
    option_c: '264',
    option_d: '374',
    correct_answer: 'C',
    explanation: 'Regroup 1 hundred into 9 tens and 10 ones. Ones: 10 - 6 = 4. Tens: 9 - 3 = 6. Hundreds: 4 - 2 = 2. Result = 264.',
    distractor_diagnostics: {
      A: {
        error: 'The student subtracted 0 from bottom numbers (6 - 0 = 6, 3 - 0 = 3) without regrouping.',
        remediation: 'When subtracting from zeros on top, you must regroup from the hundreds place first.'
      },
      B: {
        error: 'The student made a subtraction error in the tens place (10 - 3 = 7 instead of 9 - 3 = 6).',
        remediation: 'Remember the tens digit becomes 9 when regrouping across a zero to the ones place.'
      },
      D: {
        error: 'The student did not decrease the hundreds digit from 5 to 4 after regrouping.',
        remediation: 'Practice decomposing 500 into 4 hundreds + 9 tens + 10 ones before subtracting.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Mental Addition & Subtraction',
    subtopic_id: 152,
    question_text: 'Zain wants to solve 63 - 19 mentally. Which strategy gives the correct answer?',
    option_a: 'Subtract 20, then add 1 back: (63 - 20) + 1 = 43 + 1 = 44',
    option_b: 'Subtract 20, then subtract 1: (63 - 20) - 1 = 43 - 1 = 42',
    option_c: 'Subtract 10, then subtract 9: 63 - 10 = 53, then 53 - 9 = 45',
    option_d: 'Add 19 to 63: 63 + 19 = 82',
    correct_answer: 'A',
    explanation: 'Since 19 = 20 - 1, subtracting 19 is the same as subtracting 20 (63 - 20 = 43) and then adding back the extra 1 that was subtracted: 43 + 1 = 44.',
    distractor_diagnostics: {
      B: {
        error: 'The student subtracted the compensation adjustment instead of adding it back (subtracted 21 instead of 19).',
        remediation: 'Remember that if you take away too much (-20 instead of -19), you must put 1 back (+1).'
      },
      C: {
        error: 'The student made an off-by-one arithmetic error when subtracting 9 from 53 (53 - 9 = 44, not 45).',
        remediation: 'Use number bonds to break 9 into 3 and 6 when subtracting from 53.'
      },
      D: {
        error: 'The student confused subtraction operation with addition.',
        remediation: 'Read the operation symbol carefully before choosing a mental math pathway.'
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

  console.log(`Starting insertion of ${questionsData.length} questions for Grade 2 Number & Operations...`);

  let inserted = 0;
  let updated = 0;

  for (const q of questionsData) {
    // Check if question already exists by exact question_text
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = 2',
      [q.question_text]
    );

    const diagnosticsJson = JSON.stringify(q.distractor_diagnostics);

    if (existing.length > 0) {
      // Update existing question
      await pool.query(
        `UPDATE questions SET
          subject_id = 6,
          topic_id = 3,
          subtopic_name = ?,
          subtopic_id = ?,
          grade_id = 2,
          grade = 2,
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
      // Insert new question
      const [res] = await pool.query(
        `INSERT INTO questions (
          subject_id, topic_id, chapter_id, subtopic_name, subtopic_id,
          grade_id, grade, difficulty, question_text,
          option_a, option_b, option_c, option_d,
          correct_answer, status, is_active, explanation, distractor_diagnostics
        ) VALUES (
          6, 3, NULL, ?, ?,
          2, 2, ?, ?,
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

  console.log(`\nComplete! Inserted: ${inserted}, Updated: ${updated}, Total: ${questionsData.length}`);

  // Quick verification query
  const [totalG2Number] = await pool.query(
    'SELECT COUNT(*) as count FROM questions WHERE grade = 2 AND topic_id = 3 AND is_active = 1'
  );
  console.log(`Total active Grade 2 Number & Operations questions in DB: ${totalG2Number[0].count}`);

  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding questions:', err);
  process.exit(1);
});
