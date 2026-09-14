const mysql = require('mysql2/promise');
require('dotenv').config();

const grade3QuestionsData = [
  // ----------------------------------------------------
  // LEVEL 1: LOW DIFFICULTY (Questions 1 to 7)
  // ----------------------------------------------------
  {
    difficulty: 'Low',
    subtopic_name: 'Rounding & Place Value',
    subtopic_id: 150,
    question_text: 'What is 74 rounded to the nearest ten?',
    option_a: '70',
    option_b: '80',
    option_c: '75',
    option_d: '100',
    correct_answer: 'A',
    explanation: 'In 74, the ones digit is 4. Since 4 is less than 5, round down to 70.',
    distractor_diagnostics: {
      B: {
        error: 'The student rounded up instead of down (thought 4 rounds up to the next ten).',
        remediation: 'Remember the rounding rule: if the ones digit is 0, 1, 2, 3, or 4, round down to the current ten.'
      },
      C: {
        error: 'The student identified the midpoint number instead of rounding to a multiple of ten.',
        remediation: 'Multiples of ten always end in 0 (such as 60, 70, 80).'
      },
      D: {
        error: 'The student rounded to the nearest hundred instead of the nearest ten.',
        remediation: 'Check the place value asked in the question: nearest ten means looking at the ones digit.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: '3-Digit Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 342 + 235?',
    option_a: '577',
    option_b: '587',
    option_c: '677',
    option_d: '576',
    correct_answer: 'A',
    explanation: 'Add column by column: Ones: 2 + 5 = 7. Tens: 4 + 3 = 7. Hundreds: 3 + 2 = 5. Total = 577.',
    distractor_diagnostics: {
      B: {
        error: 'The student miscalculated the tens column (4 + 3 = 8 instead of 7).',
        remediation: 'Practice single-digit addition facts using a number line or counters.'
      },
      C: {
        error: 'The student made an addition error in the hundreds column (3 + 2 = 6).',
        remediation: 'Review basic addition facts within 10 to ensure accurate column sums.'
      },
      D: {
        error: 'The student made an off-by-one error in the ones column (2 + 5 = 6).',
        remediation: 'Touch-count or use fingers to double check 2 + 5 = 7.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multiply by Multiples of Ten',
    subtopic_id: 157,
    question_text: 'What is 6 × 40?',
    option_a: '24',
    option_b: '240',
    option_c: '260',
    option_d: '204',
    correct_answer: 'B',
    explanation: 'Multiply the non-zero digits first: 6 × 4 = 24. Since 40 is 4 tens, 6 × 4 tens = 24 tens = 240.',
    distractor_diagnostics: {
      A: {
        error: 'The student multiplied 6 × 4 but forgot to append the zero for the tens place.',
        remediation: 'Remember that multiplying by a multiple of 10 means the answer must end in zero.'
      },
      C: {
        error: 'The student made a basic multiplication fact error (thought 6 × 4 = 26).',
        remediation: 'Practice the 6 times table and 4 times table to master single-digit facts.'
      },
      D: {
        error: 'The student inserted a zero between the digits instead of placing it at the end.',
        remediation: 'Place-value multiplication appends zeros to the right of the product.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Understanding Fractions as Equal Parts',
    subtopic_id: 159,
    question_text: 'A pizza is cut into 4 equal slices. Sarah eats 1 slice. What fraction of the pizza did Sarah eat?',
    option_a: '1/4',
    option_b: '1/3',
    option_c: '4/1',
    option_d: '3/4',
    correct_answer: 'A',
    explanation: 'Sarah ate 1 slice out of 4 total equal slices. The fraction is 1/4.',
    distractor_diagnostics: {
      B: {
        error: 'The student compared the 1 eaten slice to the 3 remaining slices instead of total slices.',
        remediation: 'The denominator (bottom number) is always the total number of equal parts in the whole.'
      },
      C: {
        error: 'The student inverted the numerator and denominator.',
        remediation: 'Remember: top number is the parts chosen, bottom number is the total parts.'
      },
      D: {
        error: 'The student found the fraction of pizza remaining instead of the fraction eaten.',
        remediation: 'Reread the question carefully to identify whether it asks for parts eaten or parts left.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Understanding Fractions as Equal Parts',
    subtopic_id: 159,
    question_text: 'A rectangle is divided into 8 equal parts. 3 parts are shaded blue. What fraction of the rectangle is shaded?',
    option_a: '3/8',
    option_b: '5/8',
    option_c: '3/5',
    option_d: '8/3',
    correct_answer: 'A',
    explanation: 'The number of shaded parts is 3 (numerator). The total number of equal parts is 8 (denominator). Fraction = 3/8.',
    distractor_diagnostics: {
      B: {
        error: 'The student counted the unshaded parts instead of the shaded parts.',
        remediation: 'Count only the parts specified in the question (shaded parts = 3).'
      },
      C: {
        error: 'The student compared shaded parts to unshaded parts (ratio) instead of part-to-whole.',
        remediation: 'The bottom number of a fraction must always represent ALL parts combined (3 + 5 = 8).'
      },
      D: {
        error: 'The student swapped the numerator and denominator.',
        remediation: 'The numerator (top) is the count of parts, and denominator (bottom) is the total.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Equivalent Fractions & Whole Numbers',
    subtopic_id: 159,
    question_text: 'Which fraction is equivalent to 1/2?',
    option_a: '2/4',
    option_b: '1/4',
    option_c: '2/3',
    option_d: '3/5',
    correct_answer: 'A',
    explanation: 'Multiplying both numerator and denominator of 1/2 by 2 gives 2/4. Both represent half of a whole.',
    distractor_diagnostics: {
      B: {
        error: 'The student kept the numerator the same and doubled only the denominator.',
        remediation: 'To make an equivalent fraction, you must multiply BOTH top and bottom by the same number.'
      },
      C: {
        error: 'The student added 1 to both top and bottom (1+1)/(2+1) instead of multiplying.',
        remediation: 'Adding the same number to numerator and denominator does NOT create an equivalent fraction.'
      },
      D: {
        error: 'The student guessed a fraction with numbers close to half.',
        remediation: 'Draw two fraction strips of equal length to test equivalence visually.'
      }
    }
  },
  {
    difficulty: 'Low',
    subtopic_name: 'Multiplication & Division Operations',
    subtopic_id: 157,
    question_text: '35 candies are shared equally among 5 children. How many candies does each child get?',
    option_a: '6',
    option_b: '7',
    option_c: '8',
    option_d: '30',
    correct_answer: 'B',
    explanation: 'Equal sharing division: 35 ÷ 5 = 7 because 5 × 7 = 35.',
    distractor_diagnostics: {
      A: {
        error: 'The student miscalculated division by 5 (thought 5 × 6 = 35 instead of 30).',
        remediation: 'Count by 5s up to 35 (5, 10, 15, 20, 25, 30, 35) to find that 7 steps are needed.'
      },
      C: {
        error: 'The student overestimated the quotient (thought 5 × 8 = 35 instead of 40).',
        remediation: 'Review 5s multiplication facts to find the exact factor.'
      },
      D: {
        error: 'The student subtracted 35 - 5 instead of dividing into 5 equal groups.',
        remediation: 'Look for keywords: "shared equally among" signifies division, not subtraction.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 2: MEDIUM DIFFICULTY (Questions 8 to 14)
  // ----------------------------------------------------
  {
    difficulty: 'Medium',
    subtopic_name: 'Rounding & Place Value',
    subtopic_id: 150,
    question_text: 'What is 384 rounded to the nearest hundred?',
    option_a: '380',
    option_b: '400',
    option_c: '300',
    option_d: '500',
    correct_answer: 'B',
    explanation: 'To round to the nearest hundred, look at the tens digit. In 384, the tens digit is 8. Since 8 >= 5, round up to 400.',
    distractor_diagnostics: {
      A: {
        error: 'The student rounded to the nearest ten instead of the nearest hundred.',
        remediation: 'When rounding to the nearest hundred, look at the tens digit and end with two zeros.'
      },
      C: {
        error: 'The student rounded down to 300 even though the tens digit (8) is 5 or greater.',
        remediation: 'Practice using a number line between 300 and 400 to see that 384 is much closer to 400.'
      },
      D: {
        error: 'The student jumped two hundreds ahead instead of rounding to the next hundred (400).',
        remediation: 'Identify the two boundary hundreds (300 and 400) before deciding which is closer.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: '3-Digit Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 468 + 275?',
    option_a: '743',
    option_b: '643',
    option_c: '733',
    option_d: '7143',
    correct_answer: 'A',
    explanation: 'Ones: 8 + 5 = 13 (write 3, carry 1 ten). Tens: 6 + 7 + 1 = 14 (write 4, carry 1 hundred). Hundreds: 4 + 2 + 1 = 7. Total = 743.',
    distractor_diagnostics: {
      B: {
        error: 'The student forgot to carry the hundred into the hundreds column (4 + 2 = 6).',
        remediation: 'Always write the regrouped 1 above the hundreds column and add it to the total.'
      },
      C: {
        error: 'The student forgot to add the carried ten in the tens column (6 + 7 = 13).',
        remediation: 'Cross off carried digits after adding them so no regrouped values are missed.'
      },
      D: {
        error: 'The student wrote 14 directly in the tens column instead of regrouping 1 to the hundreds place.',
        remediation: 'Remember that only one digit fits in each place value column; regroup any group of 10.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: '3-Digit Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 752 - 384?',
    option_a: '432',
    option_b: '368',
    option_c: '378',
    option_d: '468',
    correct_answer: 'B',
    explanation: 'Regroup from tens: 12 - 4 = 8. Regroup from hundreds: 14 - 8 = 6. Hundreds: 6 - 3 = 3. Result = 368.',
    distractor_diagnostics: {
      A: {
        error: 'The student subtracted smaller digits from larger digits in each column without regrouping.',
        remediation: 'When the top digit is smaller than the bottom digit, borrow 1 from the next place value.'
      },
      C: {
        error: 'The student made a subtraction error in the tens column (14 - 8 = 7 instead of 6).',
        remediation: 'Practice subtraction facts from 14 using the think-addition strategy (8 + 6 = 14).'
      },
      D: {
        error: 'The student forgot to reduce the hundreds digit from 7 to 6 after borrowing.',
        remediation: 'Slash and rewrite the decreased digit at the top before completing the subtraction.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Multiply by Multiples of Ten',
    subtopic_id: 354,
    question_text: 'A school ordered 8 boxes of markers. Each box contains 30 markers. How many markers did the school order in all?',
    option_a: '240',
    option_b: '38',
    option_c: '210',
    option_d: '2400',
    correct_answer: 'A',
    explanation: '8 groups of 30: 8 × 30 = 8 × 3 tens = 24 tens = 240 markers.',
    distractor_diagnostics: {
      B: {
        error: 'The student added 30 + 8 instead of multiplying 8 groups of 30.',
        remediation: 'Identify word problem phrasing: "boxes each containing" means equal groups, so multiply.'
      },
      C: {
        error: 'The student miscalculated 8 × 3 as 21 instead of 24.',
        remediation: 'Review multiplication facts for 8 (8, 16, 24, 32).'
      },
      D: {
        error: 'The student added two zeros instead of one (treated 30 as 300).',
        remediation: 'Count the number of zeros in the factors: 30 has exactly one zero, so add one zero to 24.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Fractions on a Number Line',
    subtopic_id: 159,
    question_text: 'A number line from 0 to 1 is divided into 6 equal spaces. Starting from 0, you jump forward 4 spaces. Which fraction represents this point?',
    option_a: '4/6',
    option_b: '2/6',
    option_c: '4/5',
    option_d: '6/4',
    correct_answer: 'A',
    explanation: 'Each equal space is 1/6. Jumping 4 spaces from 0 lands on 4/6.',
    distractor_diagnostics: {
      B: {
        error: 'The student counted the remaining spaces to 1 instead of the distance from 0.',
        remediation: 'Always measure fractions on a number line starting from 0 moving to the right.'
      },
      C: {
        error: 'The student counted tick marks instead of equal intervals, misidentifying the denominator.',
        remediation: 'Count the spaces (intervals) between 0 and 1 to find the denominator.'
      },
      D: {
        error: 'The student inverted the fraction on the number line.',
        remediation: 'Since the point is between 0 and 1, the numerator must be smaller than the denominator.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Equivalent Fractions & Whole Numbers',
    subtopic_id: 159,
    question_text: 'Which fraction is equal to the whole number 4?',
    option_a: '1/4',
    option_b: '4/4',
    option_c: '4/1',
    option_d: '4/2',
    correct_answer: 'C',
    explanation: 'Any whole number n can be written as n/1 because 4 whole units divided into 1 part each equals 4 (4 ÷ 1 = 4).',
    distractor_diagnostics: {
      A: {
        error: 'The student confused a whole number (4) with a unit fraction (one-fourth).',
        remediation: '1/4 is less than 1, whereas 4 wholes is represented by 4/1.'
      },
      B: {
        error: 'The student selected 4/4, which equals 1 whole, not 4 wholes.',
        remediation: 'When the numerator and denominator are equal, the fraction equals 1 (e.g., 4/4 = 1).'
      },
      D: {
        error: 'The student chose 4/2, which simplifies to 2 wholes (4 ÷ 2 = 2).',
        remediation: 'Divide the top number by the bottom number to check: 4 ÷ 1 = 4.'
      }
    }
  },
  {
    difficulty: 'Medium',
    subtopic_name: 'Comparing Fractions',
    subtopic_id: 159,
    question_text: 'Which statement correctly compares the fractions 3/8 and 5/8?',
    option_a: '3/8 > 5/8',
    option_b: '3/8 < 5/8',
    option_c: '3/8 = 5/8',
    option_d: '5/8 < 3/8',
    correct_answer: 'B',
    explanation: 'When fractions have the same denominator (8), compare numerators directly. Since 3 < 5, 3/8 < 5/8.',
    distractor_diagnostics: {
      A: {
        error: 'The student reversed the inequality symbol, thinking > means less than.',
        remediation: 'Remember: the wide opening of the symbol always faces the larger quantity.'
      },
      C: {
        error: 'The student assumed the fractions are equal because both denominators are 8.',
        remediation: 'Check the numerators: 5 parts is more than 3 parts of the same size.'
      },
      D: {
        error: 'The student stated that 5 eighths is less than 3 eighths.',
        remediation: 'Model both fractions using fraction bars to see that 5 eighths covers more area.'
      }
    }
  },

  // ----------------------------------------------------
  // LEVEL 3: HIGH DIFFICULTY (Questions 15 to 20)
  // ----------------------------------------------------
  {
    difficulty: 'High',
    subtopic_name: 'Rounding & Place Value',
    subtopic_id: 150,
    question_text: 'A bookstore has 248 science books and 361 math books. About how many books are there in total, rounded to the nearest hundred?',
    option_a: '500',
    option_b: '600',
    option_c: '700',
    option_d: '610',
    correct_answer: 'B',
    explanation: 'Round each number to the nearest hundred: 248 rounds to 200, and 361 rounds to 400. Estimated sum = 200 + 400 = 600 books.',
    distractor_diagnostics: {
      A: {
        error: 'The student rounded both numbers down (200 + 300 = 500) ignoring that 361 is closer to 400.',
        remediation: 'Check each number individually: since the tens digit in 361 is 6, it rounds up to 400.'
      },
      C: {
        error: 'The student rounded both numbers up (300 + 400 = 700).',
        remediation: 'Look at the tens digit of 248 (4); since 4 is less than 5, 248 rounds down to 200.'
      },
      D: {
        error: 'The student rounded to the nearest ten instead of the nearest hundred.',
        remediation: 'Remember that rounding to the nearest hundred results in a number ending in two zeros (e.g., 600).'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: '3-Digit Addition & Subtraction',
    subtopic_id: 360,
    question_text: 'What is 600 - 247?',
    option_a: '447',
    option_b: '363',
    option_c: '353',
    option_d: '453',
    correct_answer: 'C',
    explanation: 'Regroup 1 hundred from 6 to make 9 tens and 10 ones. Ones: 10 - 7 = 3. Tens: 9 - 4 = 5. Hundreds: 5 - 2 = 3. Total = 353.',
    distractor_diagnostics: {
      A: {
        error: 'The student brought down the bottom digits 4 and 7 without regrouping from the hundreds place.',
        remediation: 'You cannot subtract from 0 without borrowing from the left first.'
      },
      B: {
        error: 'The student made an error in the tens column (10 - 4 = 6 instead of 9 - 4 = 5).',
        remediation: 'Remember that when borrowing across zeros, the middle tens column becomes 9.'
      },
      D: {
        error: 'The student forgot to decrease the hundreds digit from 6 to 5 after borrowing.',
        remediation: 'Decompose 600 into 5 hundreds, 9 tens, and 10 ones before subtracting each column.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Fractions on a Number Line',
    subtopic_id: 159,
    question_text: 'A number line starts at 0. Each whole unit (from 0 to 1, and 1 to 2) is divided into 3 equal parts (thirds). Which fraction is located at 5 tick marks past 0?',
    option_a: '3/5',
    option_b: '5/3',
    option_c: '5/6',
    option_d: '2/3',
    correct_answer: 'B',
    explanation: 'Each space represents 1/3. Five jumps of 1/3 equals 5/3 (which is equal to 1 whole and 2/3).',
    distractor_diagnostics: {
      A: {
        error: 'The student inverted the fraction, confusing the interval size (thirds) with the count.',
        remediation: 'The denominator is the number of parts in ONE whole (3), so 5 parts of size 1/3 is 5/3.'
      },
      C: {
        error: 'The student counted all intervals across both whole units (3 + 3 = 6) as the denominator.',
        remediation: 'Denominator is defined by the number of equal parts in a SINGLE whole, not across multiple wholes.'
      },
      D: {
        error: 'The student looked only at the fractional part beyond 1 and omitted the whole unit.',
        remediation: 'Remember that 5 thirds is 1 whole (3/3) plus 2 more thirds (2/3), giving 5/3.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Comparing Fractions',
    subtopic_id: 159,
    question_text: 'Which comparison is true, and why?',
    option_a: '1/3 > 1/6 because third-parts are larger than sixth-parts',
    option_b: '1/6 > 1/3 because 6 is greater than 3',
    option_c: '1/3 = 1/6 because both have a numerator of 1',
    option_d: '1/6 > 1/3 because a circle cut into 6 slices has more slices',
    correct_answer: 'A',
    explanation: 'When dividing a whole into fewer pieces (3), each piece is larger than when dividing into more pieces (6). Thus 1/3 > 1/6.',
    distractor_diagnostics: {
      B: {
        error: 'The student applied whole-number rules to denominators, assuming a bigger denominator means a bigger fraction.',
        remediation: 'Remember: the more pieces you cut a whole into, the SMALLER each individual piece becomes.'
      },
      C: {
        error: 'The student thought fractions with the same numerator are always equal regardless of denominator.',
        remediation: 'The denominator determines the size of each piece; 1 big third is not equal to 1 small sixth.'
      },
      D: {
        error: 'The student confused having more pieces with having a larger portion.',
        remediation: 'More slices means smaller slices when sharing one whole.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Properties of Operations',
    subtopic_id: 157,
    question_text: 'Which expression shows how to break down 7 × 8 using the Distributive Property?',
    option_a: '(7 × 5) + (7 × 3)',
    option_b: '(7 + 5) × (7 + 3)',
    option_c: '(7 × 8) + 1',
    option_d: '7 + 8',
    correct_answer: 'A',
    explanation: 'Break 8 into 5 + 3. Distribute 7 to both parts: 7 × 8 = 7 × (5 + 3) = (7 × 5) + (7 × 3) = 35 + 21 = 56.',
    distractor_diagnostics: {
      B: {
        error: 'The student added inside parentheses instead of multiplying the distributed factor.',
        remediation: 'In the distributive property, multiply the outside factor by each addend inside the parentheses.'
      },
      C: {
        error: 'The student added 1 to the product instead of breaking down a factor.',
        remediation: 'Distributive property breaks down difficult multiplication into two simpler known multiplication facts.'
      },
      D: {
        error: 'The student replaced multiplication with addition.',
        remediation: 'Remember that multiplication represents repeated addition of groups, not simple addition of factors.'
      }
    }
  },
  {
    difficulty: 'High',
    subtopic_name: 'Two-Step Word Problems',
    subtopic_id: 191,
    question_text: 'Maya bought 4 packs of juice boxes. Each pack has 6 juice boxes. Her friends drank 9 juice boxes at a party. How many juice boxes are left?',
    option_a: '24',
    option_b: '15',
    option_c: '33',
    option_d: '19',
    correct_answer: 'B',
    explanation: 'Step 1: Total juice boxes = 4 × 6 = 24. Step 2: Subtract juice boxes drank: 24 - 9 = 15 juice boxes left.',
    distractor_diagnostics: {
      A: {
        error: 'The student calculated only Step 1 (4 × 6 = 24) and forgot to subtract the 9 juice boxes drank.',
        remediation: 'Complete both steps of the word problem: first find the starting total, then subtract what was used.'
      },
      C: {
        error: 'The student added 24 + 9 instead of subtracting what was drank.',
        remediation: 'Keywords: "drank" or "left" means items were taken away, which requires subtraction.'
      },
      D: {
        error: 'The student made a subtraction calculation error in 24 - 9 (subtracted 5 instead of 9).',
        remediation: 'Break down 9 into 4 and 5: 24 - 4 = 20, then 20 - 5 = 15.'
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

  console.log(`Starting insertion of ${grade3QuestionsData.length} Grade 3 questions...`);

  let inserted = 0;
  let updated = 0;

  for (const q of grade3QuestionsData) {
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = 3',
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
          grade_id = 3,
          grade = 3,
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
          3, 3, ?, ?,
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

  console.log(`\nComplete! Inserted: ${inserted}, Updated: ${updated}, Total: ${grade3QuestionsData.length}`);

  const [totalG3Number] = await pool.query(
    'SELECT COUNT(*) as count FROM questions WHERE grade = 3 AND topic_id = 3 AND is_active = 1'
  );
  console.log(`Total active Grade 3 Number & Operations questions in DB: ${totalG3Number[0].count}`);

  await pool.end();
}

seed().catch(err => {
  console.error('Error seeding Grade 3 questions:', err);
  process.exit(1);
});
