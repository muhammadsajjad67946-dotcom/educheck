const mysql = require('mysql2/promise');
require('dotenv').config();

const remainingT3Questions = [
  // Grade 1 (needs 3 Low, 2 Med, 1 High = 6)
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Understand Place Value - Tens & Ones', subtopic_id: 357,
    question_text: 'In the number 47, how many tens and how many ones are there?',
    option_a: '4 tens and 7 ones', option_b: '7 tens and 4 ones', option_c: '47 tens and 0 ones', option_d: '40 tens and 7 ones',
    correct_answer: 'A',
    explanation: 'The digit 4 is in the tens place (4 tens = 40), and 7 is in the ones place (7 ones).',
    distractor_diagnostics: {
      B: { error: 'Student reversed the tens and ones digits.', remediation: 'The first digit in a 2-digit number is the tens place, and the second is ones: 4 tens and 7 ones.' },
      C: { error: 'Student treated the entire number as tens.', remediation: '47 means 4 bundles of ten and 7 extra ones.' },
      D: { error: 'Student wrote 40 tens (which would be 400).', remediation: 'There are 4 tens, not 40 tens.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Extend Counting Sequence to 120', subtopic_id: 356,
    question_text: 'What number comes immediately after 69 when counting by ones?',
    option_a: '70', option_b: '60', option_c: '79', option_d: '68',
    correct_answer: 'A',
    explanation: 'Counting forward by ones: 68, 69, 70.',
    distractor_diagnostics: {
      B: { error: 'Student went back to the beginning of the decade.', remediation: 'After 69, you enter the next ten: 70.' },
      C: { error: 'Student added ten instead of one (69 + 10 = 79).', remediation: 'Counting by ones: 69 + 1 = 70.' },
      D: { error: 'Student gave the number before 69 (68).', remediation: 'The question asks for the number after 69: 70.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Mental Math - 10 More & 10 Less', subtopic_id: 359,
    question_text: 'What is 10 more than 35?',
    option_a: '45', option_b: '36', option_c: '25', option_d: '55',
    correct_answer: 'A',
    explanation: '10 more increases the tens digit by 1: 3 tens become 4 tens, so 35 + 10 = 45.',
    distractor_diagnostics: {
      B: { error: 'Student added 1 instead of 10 (35 + 1 = 36).', remediation: '"10 more" changes the tens digit: 3 tens + 1 ten = 4 tens (45).' },
      C: { error: 'Student subtracted 10 (10 less) instead of adding.', remediation: '"10 more" means add: 35 + 10 = 45.' },
      D: { error: 'Student added 20 instead of 10.', remediation: '35 + 10 = 45.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Compare Two-Digit Numbers', subtopic_id: 358,
    question_text: 'Which symbol makes the statement true: 58 ___ 62?',
    option_a: '<', option_b: '>', option_c: '=', option_d: '+',
    correct_answer: 'A',
    explanation: 'Comparing tens: 5 tens (50) is less than 6 tens (60), so 58 < 62.',
    distractor_diagnostics: {
      B: { error: 'Student confused the greater-than and less-than symbols.', remediation: 'The open mouth of the symbol faces the larger number: 58 < 62.' },
      C: { error: 'Student thought the numbers are equal.', remediation: '58 and 62 are different; 58 is smaller.' },
      D: { error: '+ is an addition operator, not a comparison symbol.', remediation: 'Use < (less than) to compare.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Place Value Addition & Subtraction', subtopic_id: 360,
    question_text: 'What is 50 + 30?',
    option_a: '80', option_b: '70', option_c: '90', option_d: '53',
    correct_answer: 'A',
    explanation: '5 tens + 3 tens = 8 tens = 80.',
    distractor_diagnostics: {
      B: { error: 'Student made an addition error: 5 + 3 = 8, not 7.', remediation: 'Think 5 tens + 3 tens = 8 tens = 80.' },
      C: { error: 'Student added 5 + 4.', remediation: '50 + 30 = 80.' },
      D: { error: 'Student added 3 to 50 instead of 30.', remediation: '30 is 3 tens: 50 + 30 = 80.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Unknown Addends & Equations', subtopic_id: 361,
    question_text: 'Find the missing number: 45 + ___ = 85.',
    option_a: '40', option_b: '30', option_c: '50', option_d: '130',
    correct_answer: 'A',
    explanation: 'Subtract: 85 - 45 = 40. Checking: 45 + 40 = 85.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted incorrectly (85 - 45 = 40, not 30).', remediation: '8 tens - 4 tens = 4 tens; 5 ones - 5 ones = 0 ones: 40.' },
      C: { error: 'Student added 50.', remediation: '45 + 50 = 95; 85 - 45 = 40.' },
      D: { error: 'Student added 85 + 45 = 130 instead of finding the missing addend.', remediation: 'Subtract 85 - 45 = 40.' }
    }
  },

  // Grade 2 (needs 1 Low, 2 Med, 2 High = 5)
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Place Value', subtopic_id: 150,
    question_text: 'What is the value of the digit 6 in the number 642?',
    option_a: '600', option_b: '60', option_c: '6', option_d: '640',
    correct_answer: 'A',
    explanation: 'The 6 is in the hundreds place, so its value is 6 × 100 = 600.',
    distractor_diagnostics: {
      B: { error: 'Student thought 6 is in the tens place.', remediation: 'In 642, the order from right to left is ones, tens, hundreds. 6 is in the hundreds place = 600.' },
      C: { error: 'Student gave the face value of the digit.', remediation: 'The value depends on its place: hundreds place = 600.' },
      D: { error: 'Student included the tens digit.', remediation: 'The value of the 6 digit alone is 600.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Equal Groups & Rectangular Arrays', subtopic_id: 156,
    question_text: 'An array of stickers has 3 rows with 5 stickers in each row. Which addition sentence shows the total number of stickers?',
    option_a: '5 + 5 + 5 = 15', option_b: '3 + 5 = 8', option_c: '3 + 3 + 3 = 9', option_d: '5 + 3 + 5 = 13',
    correct_answer: 'A',
    explanation: '3 rows of 5 means adding 5 three times: 5 + 5 + 5 = 15.',
    distractor_diagnostics: {
      B: { error: 'Student added rows and columns (3 + 5 = 8).', remediation: 'Each row has 5 items; add 5 three times: 5 + 5 + 5 = 15.' },
      C: { error: 'Student added 3 only three times.', remediation: 'There are 3 rows of 5 (or 5 columns of 3: 3 + 3 + 3 + 3 + 3 = 15).' },
      D: { error: 'Student wrote an inconsistent sum.', remediation: 'Equal groups: 5 + 5 + 5 = 15.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Addition Using Place Value', subtopic_id: 151,
    question_text: 'What is 348 + 225?',
    option_a: '573', option_b: '563', option_c: '572', option_d: '673',
    correct_answer: 'A',
    explanation: 'Add ones: 8 + 5 = 13 (write 3, carry 1). Add tens: 4 + 2 + 1 = 7. Add hundreds: 3 + 2 = 5. Total = 573.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to add the regrouped 1 to the tens place.', remediation: '8 + 5 = 13, so carry 1 ten: 4 + 2 + 1 = 7 tens: 573.' },
      C: { error: 'Student made an error adding ones (8 + 5 = 13, not 12).', remediation: '8 + 5 = 13; ones digit is 3: 573.' },
      D: { error: 'Student carried 1 to hundreds place incorrectly.', remediation: 'Tens place: 4 + 2 + 1 = 7 (no carry to hundreds): 3 + 2 = 5: 573.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Mental Addition & Subtraction', subtopic_id: 152,
    question_text: 'What is 600 - 247?',
    option_a: '353', option_b: '453', option_c: '363', option_d: '343',
    correct_answer: 'A',
    explanation: 'Regroup across zeros: 600 becomes 5 hundreds, 9 tens, 10 ones. 10 - 7 = 3 ones; 9 - 4 = 5 tens; 5 - 2 = 3 hundreds: 353.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 6 - 2 = 4 without regrouping from the hundreds place.', remediation: 'When regrouping across zeros, 6 hundreds becomes 5 hundreds: 5 - 2 = 3: 353.' },
      C: { error: 'Student made an error in the tens place.', remediation: '9 tens - 4 tens = 5 tens: 353.' },
      D: { error: 'Student subtracted 4 - 0 = 4.', remediation: 'Regroup properly across zeros: 353.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Equal Groups & Rectangular Arrays', subtopic_id: 156,
    question_text: 'Is the number 17 even or odd, and why?',
    option_a: 'Odd, because when paired up into groups of 2, there is 1 left over', option_b: 'Even, because it ends in 7', option_c: 'Even, because it has two digits', option_d: 'Odd, because it is greater than 10',
    correct_answer: 'A',
    explanation: 'An even number divides into pairs with no remainder. 17 ÷ 2 = 8 pairs with 1 left over, making it odd.',
    distractor_diagnostics: {
      B: { error: 'Numbers ending in 1, 3, 5, 7, 9 are odd, not even.', remediation: 'Even numbers end in 0, 2, 4, 6, 8. Numbers ending in 7 are odd.' },
      C: { error: 'Number of digits does not determine even or odd.', remediation: 'Check the ones digit: 7 is odd.' },
      D: { error: 'Being greater than 10 does not make a number odd.', remediation: 'Odd numbers have 1 remainder when divided by 2.' }
    }
  },

  // Grade 3 (needs 1 Low, 2 Med, 2 High = 5)
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Multiplication Word Problems', subtopic_id: 354,
    question_text: 'A baker puts 6 cookies in each box. How many cookies are in 4 boxes?',
    option_a: '24 cookies', option_b: '10 cookies', option_c: '20 cookies', option_d: '28 cookies',
    correct_answer: 'A',
    explanation: 'Multiply the number of boxes by cookies per box: 4 × 6 = 24 cookies.',
    distractor_diagnostics: {
      B: { error: 'Student added 4 + 6 = 10 instead of multiplying.', remediation: 'Equal groups require multiplication: 4 boxes × 6 cookies = 24.' },
      C: { error: 'Student multiplied 4 × 5 = 20.', remediation: '4 × 6 = 24 cookies.' },
      D: { error: 'Student multiplied 4 × 7 = 28.', remediation: '4 × 6 = 24.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Fractions', subtopic_id: 159,
    question_text: 'Which fraction is equivalent to 2/4?',
    option_a: '1/2', option_b: '1/4', option_c: '3/4', option_d: '2/8',
    correct_answer: 'A',
    explanation: 'Divide numerator and denominator by 2: (2÷2)/(4÷2) = 1/2.',
    distractor_diagnostics: {
      B: { error: 'Student halved the numerator but kept denominator.', remediation: 'Divide both numerator and denominator by 2: 2/4 = 1/2.' },
      C: { error: '3/4 is greater than 2/4.', remediation: '2/4 simplifies to 1/2.' },
      D: { error: '2/8 equals 1/4, which is smaller than 2/4.', remediation: '2/4 = 1/2 (or 4/8).' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Multiplication, Division & Fractions', subtopic_id: 157,
    question_text: 'What is the unknown number that makes the equation true: 7 × ___ = 56?',
    option_a: '8', option_b: '7', option_c: '9', option_d: '6',
    correct_answer: 'A',
    explanation: 'Divide: 56 ÷ 7 = 8. Checking: 7 × 8 = 56.',
    distractor_diagnostics: {
      B: { error: '7 × 7 = 49, not 56.', remediation: 'Recall multiplication facts: 7 × 8 = 56.' },
      C: { error: '7 × 9 = 63.', remediation: '56 ÷ 7 = 8.' },
      D: { error: '7 × 6 = 42.', remediation: '7 × 8 = 56.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Basic Arithmetic & Problem Solving', subtopic_id: 160,
    question_text: 'Emma bought 3 packs of pens with 8 pens in each pack. She shared them equally among herself and 3 friends (4 people total). How many pens did each person get?',
    option_a: '6 pens', option_b: '8 pens', option_c: '4 pens', option_d: '7 pens',
    correct_answer: 'A',
    explanation: 'Total pens = 3 × 8 = 24 pens. Divided among 4 people: 24 ÷ 4 = 6 pens each.',
    distractor_diagnostics: {
      B: { error: 'Student divided by 3 friends and ignored Emma: 24 ÷ 3 = 8.', remediation: 'Include Emma: 1 + 3 = 4 people total. 24 ÷ 4 = 6 pens each.' },
      C: { error: 'Student divided 24 by 6.', remediation: '24 pens ÷ 4 people = 6 pens each.' },
      D: { error: 'Student made a division error.', remediation: '24 ÷ 4 = 6.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Fractions', subtopic_id: 159,
    question_text: 'Which comparison statement between two fractions with the same numerator is correct?',
    option_a: '3/4 > 3/8 because fourths are larger parts than eighths', option_b: '3/8 > 3/4 because 8 is bigger than 4', option_c: '3/4 = 3/8 because numerators are equal', option_d: '3/4 < 3/8',
    correct_answer: 'A',
    explanation: 'When numerators are equal, the fraction with the smaller denominator has larger parts: fourths are twice as large as eighths, so 3/4 > 3/8.',
    distractor_diagnostics: {
      B: { error: 'Student thought larger denominator means larger fraction.', remediation: 'A larger denominator means the whole is divided into more, smaller pieces: 1/8 is smaller than 1/4, so 3/4 > 3/8.' },
      C: { error: 'Student ignored denominators.', remediation: 'Equal numerators does not mean equal fractions if denominators differ: 3/4 > 3/8.' },
      D: { error: '3/4 is 6/8, which is greater than 3/8.', remediation: '3/4 > 3/8.' }
    }
  },

  // Grade 4 (needs 1 Low, 2 Med, 2 High = 5)
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Place Value System', subtopic_id: 161,
    question_text: 'In the number 35,500, how does the value of the 5 in the thousands place compare to the value of the 5 in the hundreds place?',
    option_a: 'It is 10 times greater', option_b: 'It is 100 times greater', option_c: 'They have the same value', option_d: 'It is 2 times greater',
    correct_answer: 'A',
    explanation: 'The 5 in thousands place = 5,000. The 5 in hundreds place = 500. 5,000 ÷ 500 = 10 times greater.',
    distractor_diagnostics: {
      B: { error: 'Student thought two adjacent places differ by 100.', remediation: 'Each place value to the left is 10 times the value of the place to its right: 5,000 is 10 × 500.' },
      C: { error: 'The digits are the same, but their place values differ.', remediation: '5,000 is 10 times 500.' },
      D: { error: 'Place values scale by powers of 10, not 2.', remediation: 'It is 10 times greater.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Factors & Multiples', subtopic_id: 168,
    question_text: 'Which number is a common factor of both 24 and 36?',
    option_a: '12', option_b: '16', option_c: '8', option_d: '72',
    correct_answer: 'A',
    explanation: '24 ÷ 12 = 2 and 36 ÷ 12 = 3. 12 divides evenly into both numbers.',
    distractor_diagnostics: {
      B: { error: '16 is not a factor of 24 or 36.', remediation: 'A factor must divide evenly into both numbers: 36 is not divisible by 16.' },
      C: { error: '8 is a factor of 24, but 36 is not divisible by 8.', remediation: 'A common factor must divide both numbers: 36 ÷ 8 is not a whole number.' },
      D: { error: '72 is a common multiple, not a factor.', remediation: 'Factors are less than or equal to the numbers: 12 is a common factor.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Fraction Addition & Subtraction', subtopic_id: 163,
    question_text: 'What is 2 3/5 + 1 4/5?',
    option_a: '4 2/5', option_b: '3 7/5', option_c: '3 2/5', option_d: '4 1/5',
    correct_answer: 'A',
    explanation: 'Add wholes: 2 + 1 = 3. Add fractions: 3/5 + 4/5 = 7/5 = 1 2/5. Combine: 3 + 1 2/5 = 4 2/5.',
    distractor_diagnostics: {
      B: { error: 'Student left the improper fraction 7/5 without converting to a mixed number.', remediation: '7/5 = 1 2/5; add the 1 to the whole number 3: 3 + 1 2/5 = 4 2/5.' },
      C: { error: 'Student converted 7/5 to 2/5 but forgot to add 1 to the whole numbers.', remediation: '7/5 = 1 and 2/5; 3 + 1 = 4: 4 2/5.' },
      D: { error: 'Student made an arithmetic error in the fraction sum.', remediation: '3/5 + 4/5 = 7/5 = 1 2/5; 3 + 1 2/5 = 4 2/5.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Multi-Digit Computation', subtopic_id: 167,
    question_text: 'A theater has 28 rows of seats with 35 seats in each row. How many seats are in the theater?',
    option_a: '980 seats', option_b: '840 seats', option_c: '1,020 seats', option_d: '950 seats',
    correct_answer: 'A',
    explanation: '28 × 35 = 28 × (30 + 5) = 840 + 140 = 980 seats.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 28 × 30 = 840 and forgot 28 × 5.', remediation: 'Remember to multiply by both tens and ones: 840 + 140 = 980 seats.' },
      C: { error: 'Student made a multiplication error with regrouping.', remediation: '28 × 35 = 980.' },
      D: { error: 'Student miscalculated the partial products.', remediation: '28 × 35 = 980 seats.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Fraction Multiplication & Division', subtopic_id: 165,
    question_text: 'A recipe requires 3/4 cup of sugar. If you make 6 batches of the recipe, how many cups of sugar do you need in total?',
    option_a: '4 1/2 cups (or 18/4 cups)', option_b: '4 cups (or 16/4 cups)', option_c: '2 1/4 cups', option_d: '6 3/4 cups',
    correct_answer: 'A',
    explanation: '6 × (3/4) = 18/4 = 4 2/4 = 4 1/2 cups.',
    distractor_diagnostics: {
      B: { error: 'Student rounded down to 4 cups.', remediation: '18/4 = 4 with remainder 2/4 = 4 1/2 cups.' },
      C: { error: 'Student divided 6 by 3/4 instead of multiplying.', remediation: 'Multiply batches by amount per batch: 6 × (3/4) = 18/4 = 4 1/2 cups.' },
      D: { error: 'Student added 6 + 3/4.', remediation: 'Multiply 6 × (3/4) = 18/4 = 4 1/2 cups.' }
    }
  },

  // Grade 5 (needs 1 Low, 2 Med, 2 High = 5)
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Decimals', subtopic_id: 173,
    question_text: 'What is 3.45 + 2.8?',
    option_a: '6.25', option_b: '5.53', option_c: '5.25', option_d: '6.53',
    correct_answer: 'A',
    explanation: 'Line up decimal points: 3.45 + 2.80 = 6.25.',
    distractor_diagnostics: {
      B: { error: 'Student aligned digits to the right (added 3.45 + 0.28 = 3.73 or 2.8 as 0.08).', remediation: 'Always align decimal points: 3.45 + 2.80 = 6.25.' },
      C: { error: 'Student forgot to carry 1 from the tenths place (4 + 8 = 12).', remediation: '4 tenths + 8 tenths = 12 tenths (write 2, carry 1 to whole numbers): 6.25.' },
      D: { error: 'Student misaligned the decimal column.', remediation: '3.45 + 2.80 = 6.25.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Fraction Addition & Subtraction', subtopic_id: 163,
    question_text: 'What is 2/3 + 3/5?',
    option_a: '19/15 (or 1 4/15)', option_b: '5/8', option_c: '5/15 (or 1/3)', option_d: '1 1/15',
    correct_answer: 'A',
    explanation: 'Common denominator is 15. 2/3 = 10/15, 3/5 = 9/15. Sum = 10/15 + 9/15 = 19/15 = 1 4/15.',
    distractor_diagnostics: {
      B: { error: 'Student added numerators and denominators directly: (2+3)/(3+5) = 5/8.', remediation: 'Never add denominators directly. Find a common denominator first: 10/15 + 9/15 = 19/15.' },
      C: { error: 'Student subtracted instead of adding.', remediation: 'Add the converted fractions: 10/15 + 9/15 = 19/15.' },
      D: { error: 'Student miscalculated the numerator sum.', remediation: '10 + 9 = 19; 19/15 = 1 4/15.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Multi-Digit & Decimal Operations', subtopic_id: 162,
    question_text: 'What is 4.2 × 0.3?',
    option_a: '1.26', option_b: '12.6', option_c: '0.126', option_d: '1.2',
    correct_answer: 'A',
    explanation: '42 × 3 = 126. Since there is 1 decimal place in 4.2 and 1 in 0.3 (total 2 decimal places), the answer is 1.26.',
    distractor_diagnostics: {
      B: { error: 'Student placed only 1 decimal place instead of 2: 12.6.', remediation: 'Count total decimal places in both factors: 1 + 1 = 2 decimal places: 1.26.' },
      C: { error: 'Student placed 3 decimal places.', remediation: 'There are 2 decimal places total: 1.26.' },
      D: { error: 'Student rounded or dropped the hundredths digit.', remediation: '4.2 × 0.3 = 1.26.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Fraction Division Word Problems', subtopic_id: 355,
    question_text: 'A runner has 4 liters of sports drink. If each cup holds 1/3 liter, how many full cups can be poured?',
    option_a: '12 cups', option_b: '1 1/3 cups', option_c: '7 cups', option_d: '4/3 cups',
    correct_answer: 'A',
    explanation: 'Divide total liters by cup capacity: 4 ÷ (1/3) = 4 × 3 = 12 cups.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 4 × (1/3) = 4/3 = 1 1/3 instead of dividing.', remediation: 'Dividing by a fraction means multiplying by its reciprocal: 4 ÷ (1/3) = 4 × 3 = 12.' },
      C: { error: 'Student added 4 + 3 = 7.', remediation: '4 ÷ (1/3) = 4 × 3 = 12 cups.' },
      D: { error: 'Student gave 4/3.', remediation: 'Dividing by 1/3 yields 4 × 3 = 12.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Multi-Digit & Decimal Operations', subtopic_id: 162,
    question_text: 'What is 7.5 ÷ 0.25?',
    option_a: '30', option_b: '3', option_c: '1.875', option_d: '300',
    correct_answer: 'A',
    explanation: 'Multiply both by 100: 750 ÷ 25 = 30.',
    distractor_diagnostics: {
      B: { error: 'Student misplaced the decimal point by 1 place: 3.', remediation: 'Shift decimals 2 places: 750 ÷ 25 = 30.' },
      C: { error: 'Student multiplied 7.5 × 0.25 = 1.875 instead of dividing.', remediation: 'The operation is division: 7.5 ÷ 0.25 = 30.' },
      D: { error: 'Student shifted decimal point too many times.', remediation: '7.5 / 0.25 = 750 / 25 = 30.' }
    }
  },

  // Grade 6 (needs 1 Low, 2 Med, 2 High = 5)
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Integers', subtopic_id: 171,
    question_text: 'What is the absolute value of -14, written as |-14|?',
    option_a: '14', option_b: '-14', option_c: '0', option_d: '1/14',
    correct_answer: 'A',
    explanation: 'Absolute value represents the distance of a number from zero on the number line, which is always non-negative: |-14| = 14.',
    distractor_diagnostics: {
      B: { error: 'Student kept the negative sign.', remediation: 'Absolute value is distance, which is always non-negative: |-14| = 14.' },
      C: { error: 'Absolute value is zero only for 0.', remediation: '|-14| = 14.' },
      D: { error: 'Student took the reciprocal instead of absolute value.', remediation: 'Absolute value removes the negative sign: 14.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Percentages', subtopic_id: 174,
    question_text: 'What is 35% of 80?',
    option_a: '28', option_b: '35', option_c: '24', option_d: '32',
    correct_answer: 'A',
    explanation: '35% = 0.35. 0.35 × 80 = 28. (Or: 10% is 8, 30% is 24, 5% is 4: 24 + 4 = 28).',
    distractor_diagnostics: {
      B: { error: 'Student gave the percentage value itself.', remediation: 'Multiply 80 by 0.35: 0.35 × 80 = 28.' },
      C: { error: 'Student calculated 30% only (24) and forgot the 5%.', remediation: 'Add 5% (4) to 30% (24): 24 + 4 = 28.' },
      D: { error: 'Student calculated 40% of 80.', remediation: '35% of 80 is 28.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Fraction Division', subtopic_id: 166,
    question_text: 'What is 3/4 ÷ 2/5?',
    option_a: '15/8 (or 1 7/8)', option_b: '6/20 (or 3/10)', option_c: '5/8', option_d: '8/15',
    correct_answer: 'A',
    explanation: 'Multiply by the reciprocal of the second fraction: 3/4 × 5/2 = (3×5)/(4×2) = 15/8 = 1 7/8.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied the fractions directly without inverting the divisor: (3×2)/(4×5) = 6/20.', remediation: 'When dividing fractions, invert the second fraction and multiply: 3/4 × 5/2 = 15/8.' },
      C: { error: 'Student inverted the wrong fraction.', remediation: 'Invert ONLY the divisor (second fraction): 3/4 × 5/2 = 15/8.' },
      D: { error: 'Student inverted the entire product.', remediation: '3/4 × 5/2 = 15/8.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Rational Numbers', subtopic_id: 169,
    question_text: 'Which list of rational numbers is in order from LEAST to GREATEST?',
    option_a: '-3.5, -2, 0, 1/2, 2.7', option_b: '0, -2, -3.5, 1/2, 2.7', option_c: '-2, -3.5, 0, 1/2, 2.7', option_d: '-3.5, -2, 1/2, 0, 2.7',
    correct_answer: 'A',
    explanation: 'On a number line, values further left are smaller: -3.5 is the smallest, followed by -2, then 0, then 0.5 (1/2), and 2.7 is the largest.',
    distractor_diagnostics: {
      B: { error: 'Student placed 0 before negative numbers.', remediation: 'Negative numbers are less than 0: -3.5 < -2 < 0.' },
      C: { error: 'Student thought -2 is less than -3.5.', remediation: '-3.5 is further left on the number line than -2, so -3.5 < -2.' },
      D: { error: 'Student placed 1/2 before 0.', remediation: '1/2 (0.5) is greater than 0.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Percentages', subtopic_id: 174,
    question_text: 'A jacket originally priced at $80 is on sale for 25% off. If sales tax is 5% on the discounted price, what is the final cost of the jacket?',
    option_a: '$63.00', option_b: '$60.00', option_c: '$64.00', option_d: '$68.00',
    correct_answer: 'A',
    explanation: 'Discount = 25% of $80 = $20. Discounted price = $80 - $20 = $60. Tax = 5% of $60 = $3. Final cost = $60 + $3 = $63.00.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to add sales tax.', remediation: 'Add 5% tax on $60: $60 × 0.05 = $3; $60 + $3 = $63.00.' },
      C: { error: 'Student calculated 5% tax on original $80 ($4) and added to $60.', remediation: 'Tax applies to the discounted price $60: 5% of $60 is $3: $63.00.' },
      D: { error: 'Student miscalculated the discount.', remediation: '$80 - 25% = $60; $60 + 5% = $63.00.' }
    }
  },

  // Grade 7 (needs 1 Low, 2 Med, 2 High = 5)
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Integers', subtopic_id: 171,
    question_text: 'What is -8 + (-5)?',
    option_a: '-13', option_b: '-3', option_c: '13', option_d: '3',
    correct_answer: 'A',
    explanation: 'Adding two negative numbers: add their absolute values and keep the negative sign: 8 + 5 = 13 => -13.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 8 - 5 = 3 and made it negative.', remediation: 'Adding two negatives makes a larger negative: -8 + (-5) = -13.' },
      C: { error: 'Student dropped the negative sign.', remediation: 'Adding two negative numbers always yields a negative result: -13.' },
      D: { error: 'Student treated it as positive subtraction.', remediation: '-8 + (-5) = -13.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Rational Numbers', subtopic_id: 175,
    question_text: 'What is (-3/4) × (-8/9)?',
    option_a: '2/3', option_b: '-2/3', option_c: '24/36 (which simplifies to 2/3, but sign error?)', option_d: '12/13',
    correct_answer: 'A',
    explanation: 'A negative times a negative is positive. (-3/4) × (-8/9) = +(3 × 8)/(4 × 9) = 24/36 = 2/3.',
    distractor_diagnostics: {
      B: { error: 'Student kept a negative sign.', remediation: 'Negative × Negative = Positive: the answer must be positive 2/3.' },
      C: { error: 'Student added numerators and denominators.', remediation: 'Multiply straight across and simplify: 24/36 = 2/3.' },
      D: { error: 'Student added fractions.', remediation: 'Multiply numerators and denominators: 2/3.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Converting', subtopic_id: 184,
    question_text: 'Convert the fraction 7/8 into a decimal.',
    option_a: '0.875', option_b: '0.78', option_c: '0.87', option_d: '0.75',
    correct_answer: 'A',
    explanation: 'Divide 7 by 8: 7 ÷ 8 = 0.875.',
    distractor_diagnostics: {
      B: { error: 'Student just joined the digits 7 and 8 into 0.78.', remediation: 'Divide 7 by 8 using long division: 7 ÷ 8 = 0.875.' },
      C: { error: 'Student truncated without the last digit.', remediation: '7 ÷ 8 = 0.875.' },
      D: { error: '0.75 is 6/8 (or 3/4).', remediation: '7/8 = 0.875.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Rational Numbers', subtopic_id: 175,
    question_text: 'A scuba diver is 18 meters below sea level (-18 m). She ascends 7.5 meters, then descends 4.2 meters. What is her current elevation relative to sea level?',
    option_a: '-14.7 meters', option_b: '-11.3 meters', option_c: '-21.3 meters', option_d: '-6.3 meters',
    correct_answer: 'A',
    explanation: 'Start at -18. Ascend (+7.5): -18 + 7.5 = -10.5. Descend (-4.2): -10.5 - 4.2 = -14.7 meters.',
    distractor_diagnostics: {
      B: { error: 'Student added 4.2 instead of subtracting.', remediation: 'Descending means moving deeper (subtracting): -10.5 - 4.2 = -14.7 m.' },
      C: { error: 'Student subtracted both 7.5 and 4.2: -18 - 7.5 - 4.2 = -29.7 or made an arithmetic slip.', remediation: 'Ascending is positive (+7.5) and descending is negative (-4.2): -18 + 7.5 - 4.2 = -14.7 m.' },
      D: { error: 'Student subtracted from 0.', remediation: 'Net elevation is -14.7 meters.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Decimal Expansions', subtopic_id: 177,
    question_text: 'Which fraction converts into a REPEATING decimal rather than a terminating decimal?',
    option_a: '5/12', option_b: '3/8', option_c: '7/20', option_d: '9/25',
    correct_answer: 'A',
    explanation: 'A fraction in simplest form terminates if and only if the prime factorization of its denominator contains only 2s and/or 5s. 12 = 2² × 3 (contains a 3), so 5/12 = 0.41666... is a repeating decimal.',
    distractor_diagnostics: {
      B: { error: '3/8 = 0.375, which terminates (denominator 8 = 2³).', remediation: 'Fractions with denominators having only 2 and 5 terminate; 12 has a factor of 3, so 5/12 repeats.' },
      C: { error: '7/20 = 0.35, which terminates (20 = 2² × 5).', remediation: '20 only has prime factors 2 and 5, so it terminates.' },
      D: { error: '9/25 = 0.36, which terminates (25 = 5²).', remediation: '5/12 produces 0.41666..., which repeats.' }
    }
  },

  // Grade 8 (needs 1 Low, 2 Med, 2 High = 5)
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Square Roots', subtopic_id: 180,
    question_text: 'What is √144?',
    option_a: '12', option_b: '72', option_c: '14', option_d: '24',
    correct_answer: 'A',
    explanation: 'Since 12 × 12 = 144, √144 = 12.',
    distractor_diagnostics: {
      B: { error: 'Student divided 144 by 2 (144 ÷ 2 = 72) instead of taking square root.', remediation: 'Square root asks what number multiplied by itself equals 144: 12 × 12 = 144.' },
      C: { error: '14 × 14 = 196, not 144.', remediation: '12² = 144, so √144 = 12.' },
      D: { error: 'Student divided 144 by 6.', remediation: '√144 = 12.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Scientific Notation', subtopic_id: 183,
    question_text: 'How is the number 4,500,000 written in scientific notation?',
    option_a: '4.5 × 10⁶', option_b: '45 × 10⁵', option_c: '4.5 × 10⁵', option_d: '0.45 × 10⁷',
    correct_answer: 'A',
    explanation: 'In scientific notation a × 10ⁿ, 1 ≤ a < 10. Shifting the decimal 6 places left gives 4.5 × 10⁶.',
    distractor_diagnostics: {
      B: { error: '45 is not between 1 and 10.', remediation: 'The coefficient a must satisfy 1 ≤ a < 10: shift one more place to get 4.5 × 10⁶.' },
      C: { error: 'Student only shifted 5 decimal places.', remediation: 'Count from the end: 6 places to place decimal after 4: 4.5 × 10⁶.' },
      D: { error: '0.45 is less than 1.', remediation: 'Coefficient must be at least 1: 4.5 × 10⁶.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Integer Exponents & Radicals', subtopic_id: 179,
    question_text: 'Simplify: (2³ × 2⁵) ÷ 2⁴.',
    option_a: '2⁴ (or 16)', option_b: '2¹⁵', option_c: '2²', option_d: '2⁸',
    correct_answer: 'A',
    explanation: 'Using exponent rules: 2³ × 2⁵ = 2³⁺⁵ = 2⁸. Then 2⁸ ÷ 2⁴ = 2⁸⁻⁴ = 2⁴ = 16.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied exponents in the numerator: 3 × 5 = 15.', remediation: 'When multiplying powers with the same base, ADD the exponents: 3 + 5 = 8.' },
      C: { error: 'Student divided exponents: 8 ÷ 4 = 2.', remediation: 'When dividing powers with the same base, SUBTRACT the exponents: 8 - 4 = 4: 2⁴ = 16.' },
      D: { error: 'Student forgot to divide by 2⁴.', remediation: 'Subtract 4 from the exponent: 8 - 4 = 4: 2⁴.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Irrational Numbers', subtopic_id: 176,
    question_text: 'Which of the following numbers is an IRRATIONAL number?',
    option_a: '√5', option_b: '√16', option_c: '3/7', option_d: '0.333...',
    correct_answer: 'A',
    explanation: '√5 cannot be expressed as a ratio of two integers because 5 is not a perfect square; its decimal expansion is non-terminating and non-repeating.',
    distractor_diagnostics: {
      B: { error: '√16 = 4, which is an integer (rational).', remediation: '16 is a perfect square (4² = 16), so √16 is rational. 5 is not a perfect square, so √5 is irrational.' },
      C: { error: '3/7 is explicitly written as a ratio of two integers (rational).', remediation: 'Any number of the form a/b with integers a and b is rational.' },
      D: { error: '0.333... is a repeating decimal, which equals 1/3 (rational).', remediation: 'Repeating decimals are rational: 0.333... = 1/3. √5 is irrational.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Rational Approximations', subtopic_id: 178,
    question_text: 'Between which two consecutive whole numbers does √53 lie on the number line?',
    option_a: 'Between 7 and 8', option_b: 'Between 6 and 7', option_c: 'Between 8 and 9', option_d: 'Between 26 and 27',
    correct_answer: 'A',
    explanation: '7² = 49 and 8² = 64. Since 49 < 53 < 64, √53 lies between √49 and √64, which is between 7 and 8.',
    distractor_diagnostics: {
      B: { error: '6² = 36 and 7² = 49, both of which are less than 53.', remediation: 'Compare to perfect squares: 49 < 53 < 64, so it is between 7 and 8.' },
      C: { error: '8² = 64, which is already greater than 53.', remediation: '53 is between 49 (7²) and 64 (8²): between 7 and 8.' },
      D: { error: 'Student divided 53 by 2.', remediation: 'Square root is not division by 2: compare squares: 7² = 49, 8² = 64.' }
    }
  }
];

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  console.log('Starting insertion of 41 questions for Topic 3 (Number & Operations)...');
  let inserted = 0;
  let updated = 0;

  for (const q of remainingT3Questions) {
    const [existing] = await connection.execute(
      'SELECT id FROM questions WHERE question_text = ? AND grade = ? AND topic_id = 3',
      [q.question_text, q.grade]
    );

    const diagnosticsJson = JSON.stringify(q.distractor_diagnostics);

    if (existing.length > 0) {
      await connection.execute(
        `UPDATE questions SET 
          option_a = ?, option_b = ?, option_c = ?, option_d = ?,
          correct_answer = ?, explanation = ?, difficulty = ?,
          subtopic_id = ?, subtopic_name = ?, grade_id = ?, distractor_diagnostics = ?,
          status = 'active', is_active = 1, subject_id = 6
        WHERE id = ?`,
        [
          q.option_a, q.option_b, q.option_c, q.option_d,
          q.correct_answer, q.explanation, q.difficulty,
          q.subtopic_id, q.subtopic_name, q.grade, diagnosticsJson,
          existing[0].id
        ]
      );
      updated++;
    } else {
      await connection.execute(
        `INSERT INTO questions (
          subject_id, topic_id, chapter_id, subtopic_name, subtopic_id,
          grade_id, grade, difficulty, question_text,
          option_a, option_b, option_c, option_d,
          correct_answer, status, is_active, explanation, distractor_diagnostics
        ) VALUES (
          6, 3, NULL, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, 'active', 1, ?, ?
        )`,
        [
          q.subtopic_name,
          q.subtopic_id,
          q.grade,
          q.grade,
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
      inserted++;
    }
  }

  console.log(`Topic 3 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await connection.end();
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
