const mysql = require('mysql2/promise');
require('dotenv').config();

const g5Questions = [
  // Low (8)
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'What is the value of the numerical expression:  (6 + 4) × 3?',
    option_a: '30', option_b: '18', option_c: '42', option_d: '13',
    correct_answer: 'A',
    explanation: 'Evaluate operations inside parentheses first: 6 + 4 = 10. Then multiply: 10 × 3 = 30.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied 4 × 3 = 12 first and added 6.', remediation: 'Operations inside parentheses must always be performed first: (6 + 4) = 10, then 10 × 3 = 30.' },
      C: { error: 'The student miscalculated.', remediation: '10 × 3 = 30.' },
      D: { error: 'The student added all numbers: 6 + 4 + 3 = 13.', remediation: 'Follow the multiplication symbol: (6 + 4) × 3 = 30.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Which expression matches the phrase: "multiply 7 by 4, then add 5"?',
    option_a: '(7 × 4) + 5', option_b: '7 × (4 + 5)', option_c: '7 + 4 + 5', option_d: '(7 + 5) × 4',
    correct_answer: 'A',
    explanation: 'First multiply 7 and 4, then add 5 to that product: (7 × 4) + 5.',
    distractor_diagnostics: {
      B: { error: 'This expression adds 4 and 5 first, then multiplies by 7.', remediation: '"Multiply 7 by 4, then add 5" requires (7 × 4) + 5.' },
      C: { error: 'This expression only adds the numbers.', remediation: 'Use multiplication for the first step: (7 × 4) + 5.' },
      D: { error: 'This adds 7 and 5 first.', remediation: 'Follow the order of the sentence: 7 × 4 first, then + 5.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Evaluate the expression:  20 - 8 ÷ 2',
    option_a: '16', option_b: '6', option_c: '10', option_d: '14',
    correct_answer: 'A',
    explanation: 'According to the order of operations, division comes before subtraction: 8 ÷ 2 = 4. Then 20 - 4 = 16.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 20 - 8 = 12 first, then divided 12 ÷ 2 = 6.', remediation: 'Perform division before subtraction: 8 ÷ 2 = 4, then 20 - 4 = 16.' },
      C: { error: 'The student guessed 10.', remediation: 'Division has higher precedence: 20 - (8 ÷ 2) = 16.' },
      D: { error: 'The student made an arithmetic error.', remediation: '20 - 4 = 16.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'Pattern A starts at 0 and adds 2: 0, 2, 4, 6... Pattern B starts at 0 and adds 6: 0, 6, 12, 18... How do the terms in Pattern B compare to Pattern A?',
    option_a: 'Each term in Pattern B is 3 times the corresponding term in Pattern A', option_b: 'Each term in Pattern B is 4 more than Pattern A', option_c: 'Each term in Pattern B is half of Pattern A', option_d: 'There is no relationship between the terms',
    correct_answer: 'A',
    explanation: 'Comparing corresponding terms: 6 = 3 × 2, 12 = 3 × 4, 18 = 3 × 6. Each term in Pattern B is 3 times the corresponding term in Pattern A.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 6 - 2 = 4, but that difference changes for other terms (12 - 4 = 8).', remediation: 'Notice the multiplicative ratio: 6 ÷ 2 = 3, 12 ÷ 4 = 3.' },
      C: { error: 'Pattern B has larger numbers, not half.', remediation: 'Pattern B terms are 3 times larger than Pattern A.' },
      D: { error: 'A consistent multiplicative pattern exists.', remediation: 'The ratio of rules is 6 / 2 = 3 times.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Without calculating, how does the value of 5 × (240 + 68) compare to the value of (240 + 68)?',
    option_a: 'It is 5 times as large', option_b: 'It is 5 more', option_c: 'It is one-fifth as large', option_d: 'It has the same value',
    correct_answer: 'A',
    explanation: 'Multiplying any non-zero quantity by 5 makes the result 5 times as large.',
    distractor_diagnostics: {
      B: { error: 'The student confused multiplying by 5 with adding 5.', remediation: 'Multiplying by 5 means 5 times as large, not 5 more.' },
      C: { error: 'Multiplying by 5 increases the value, not decreases.', remediation: '5 × quantity is 5 times larger.' },
      D: { error: 'Multiplying by 5 changes the value.', remediation: 'The factor 5 scales the value 5 times.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'Given the ordered pairs (1, 3), (2, 6), (3, 9), and (4, 12), what is the relationship between the x-coordinate and the y-coordinate?',
    option_a: 'y is 3 times x (y = 3x)', option_b: 'y is 2 more than x (y = x + 2)', option_c: 'x is 3 times y', option_d: 'y is 4 times x',
    correct_answer: 'A',
    explanation: 'For each pair: 1 × 3 = 3, 2 × 3 = 6, 3 × 3 = 9, 4 × 3 = 12. So y = 3x.',
    distractor_diagnostics: {
      B: { error: '1 + 2 = 3, but 2 + 2 = 4 (not 6).', remediation: 'The rule must work for every pair: multiply x by 3 to get y.' },
      C: { error: 'y is larger than x, not smaller.', remediation: 'y is 3 times x.' },
      D: { error: '1 × 4 = 4, not 3.', remediation: 'Multiply x by 3: y = 3x.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'What is the value of:  15 - (3 + 2 × 4)?',
    option_a: '4', option_b: '48', option_c: '8', option_d: '2',
    correct_answer: 'A',
    explanation: 'Inside parentheses, multiply first: 2 × 4 = 8. Add: 3 + 8 = 11. Finally subtract: 15 - 11 = 4.',
    distractor_diagnostics: {
      B: { error: 'The student added 3 + 2 = 5 first and multiplied 5 × 4 = 20, then subtracted.', remediation: 'Multiply before adding inside parentheses: 2 × 4 = 8, then 3 + 8 = 11. 15 - 11 = 4.' },
      C: { error: 'The student made an arithmetic error.', remediation: '15 - 11 = 4.' },
      D: { error: 'The student miscalculated.', remediation: '15 - 11 = 4.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Which statement correctly describes the expression 4 × (18 - 6)?',
    option_a: '4 times the difference of 18 and 6', option_b: 'The sum of 4 and 18, minus 6', option_c: '18 minus the product of 4 and 6', option_d: 'The difference of 4 times 18 and 6',
    correct_answer: 'A',
    explanation: 'The parentheses enclose (18 - 6), which is the difference of 18 and 6. Multiplying by 4 gives: 4 times the difference of 18 and 6.',
    distractor_diagnostics: {
      B: { error: 'This describes (4 + 18) - 6.', remediation: '4 is multiplied by the entire difference (18 - 6).' },
      C: { error: 'This describes 18 - (4 × 6).', remediation: '4 multiplies the difference: 4 × (18 - 6).' },
      D: { error: 'This describes (4 × 18) - 6.', remediation: 'Parentheses around (18 - 6) mean subtract first, then multiply by 4.' }
    }
  },

  // Medium (9)
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Evaluate the expression with brackets and parentheses:  2 × [15 - (3 + 4)]',
    option_a: '16', option_b: '24', option_c: '14', option_d: '8',
    correct_answer: 'A',
    explanation: 'Innermost parentheses: 3 + 4 = 7. Brackets: 15 - 7 = 8. Multiply: 2 × 8 = 16.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 15 - 3 = 12 first and added 4 = 16, then... miscalculated.', remediation: 'Evaluate inner parentheses (3 + 4 = 7) first: 15 - 7 = 8, then 2 × 8 = 16.' },
      C: { error: 'The student made an arithmetic error.', remediation: '2 × [15 - 7] = 2 × 8 = 16.' },
      D: { error: 'The student forgot to multiply by 2 at the end.', remediation: 'Remember the outside multiplier: 2 × 8 = 16.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Which expression represents: "subtract 6 from 20, divide by 2, then add 9"?',
    option_a: '[(20 - 6) ÷ 2] + 9', option_b: '(20 - 6) ÷ (2 + 9)', option_c: '20 - (6 ÷ 2) + 9', option_d: '20 - [6 ÷ (2 + 9)]',
    correct_answer: 'A',
    explanation: 'Subtract 6 from 20: (20 - 6). Divide by 2: [(20 - 6) ÷ 2]. Then add 9: [(20 - 6) ÷ 2] + 9.',
    distractor_diagnostics: {
      B: { error: 'This divides by (2 + 9) = 11.', remediation: 'The addition of 9 happens after the division: [(20 - 6) ÷ 2] + 9.' },
      C: { error: 'This divides 6 by 2 before subtracting from 20.', remediation: 'The phrase specifies "subtract 6 from 20" first.' },
      D: { error: 'This groups operations incorrectly.', remediation: 'Follow the steps in chronological order: (20 - 6) ÷ 2 + 9.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'Sequence X starts at 1 and uses rule "add 3". Sequence Y starts at 2 and uses rule "add 6". What is the 4th ordered pair (x, y)?',
    option_a: '(10, 20)', option_b: '(7, 14)', option_c: '(13, 26)', option_d: '(10, 18)',
    correct_answer: 'A',
    explanation: 'Sequence X: 1, 4, 7, 10 (4th term is 10). Sequence Y: 2, 8, 14, 20 (4th term is 20). 4th ordered pair: (10, 20).',
    distractor_diagnostics: {
      B: { error: '(7, 14) is the 3rd ordered pair.', remediation: 'Find the 4th term of each sequence: X = 10, Y = 20.' },
      C: { error: '(13, 26) is the 5th ordered pair.', remediation: 'Calculate the 4th term: X: 1, 4, 7, 10 and Y: 2, 8, 14, 20.' },
      D: { error: 'The student added 4 to Y instead of 6.', remediation: 'Sequence Y: 2 + 6 = 8, 8 + 6 = 14, 14 + 6 = 20.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Evaluate:  3 × [4 + 2 × (8 - 3)]',
    option_a: '42', option_b: '34', option_c: '90', option_d: '45',
    correct_answer: 'A',
    explanation: 'Innermost: 8 - 3 = 5. Inside brackets: 2 × 5 = 10, then 4 + 10 = 14. Outside: 3 × 14 = 42.',
    distractor_diagnostics: {
      B: { error: 'The student added 4 + 2 = 6 first and multiplied 6 × 5 = 30, then 30 + ?.', remediation: 'Multiplication inside brackets comes before addition: 2 × 5 = 10, then 4 + 10 = 14. 3 × 14 = 42.' },
      C: { error: 'The student multiplied (4 + 2) × (8 - 3) = 6 × 5 = 30, 30 × 3 = 90.', remediation: 'Order of operations: 2 × 5 = 10; 4 + 10 = 14; 3 × 14 = 42.' },
      D: { error: 'The student made an arithmetic error.', remediation: '3 × 14 = 42.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Where should parentheses be placed to make this equation true?  18 - 4 × 3 + 2 = 44',
    option_a: '(18 - 4) × 3 + 2', option_b: '18 - (4 × 3) + 2', option_c: '(18 - 4) × (3 + 2)', option_d: '18 - (4 × 3 + 2)',
    correct_answer: 'A',
    explanation: 'Check (18 - 4) × 3 + 2: 18 - 4 = 14. 14 × 3 = 42. 42 + 2 = 44. True!',
    distractor_diagnostics: {
      B: { error: '18 - 12 + 2 = 8, not 44.', remediation: 'Test (18 - 4) × 3 + 2: 14 × 3 = 42, 42 + 2 = 44.' },
      C: { error: '(18 - 4) × (3 + 2) = 14 × 5 = 70.', remediation: 'Only placing parentheses around (18 - 4) yields 44.' },
      D: { error: '18 - 14 = 4, not 44.', remediation: '(18 - 4) × 3 + 2 = 44.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'Points A(2, 6), B(4, 12), and C(6, 18) are plotted on a coordinate grid. If a line is drawn through these points, what will be the y-coordinate when x = 10?',
    option_a: '30', option_b: '24', option_c: '20', option_d: '36',
    correct_answer: 'A',
    explanation: 'The rule is y = 3x (since 6 = 3×2, 12 = 3×4, 18 = 3×6). When x = 10, y = 3 × 10 = 30.',
    distractor_diagnostics: {
      B: { error: 'The student calculated for x = 8.', remediation: 'Multiply x by 3: y = 3 × 10 = 30.' },
      C: { error: 'The student added 10 + 10.', remediation: 'The relationship is multiplicative: y = 3x, so y = 30.' },
      D: { error: 'The student calculated for x = 12.', remediation: 'When x = 10, y = 3 × 10 = 30.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Compare Expression P:  (45 + 55) ÷ 5   and Expression Q:  (45 ÷ 5) + (55 ÷ 5). Which statement is true?',
    option_a: 'Both expressions are equal to 20', option_b: 'Expression P is larger than Expression Q', option_c: 'Expression Q is larger than Expression P', option_d: 'Expression P equals 100 and Expression Q equals 20',
    correct_answer: 'A',
    explanation: 'Expression P: 100 ÷ 5 = 20. Expression Q: 9 + 11 = 20. By the distributive property of division over addition, they are equal.',
    distractor_diagnostics: {
      B: { error: 'Both equal 20.', remediation: 'Division distributes over addition: (a + b) / c = a/c + b/c.' },
      C: { error: 'Both equal 20.', remediation: '100 / 5 = 20 and 9 + 11 = 20.' },
      D: { error: 'Expression P includes division by 5: 100 / 5 = 20.', remediation: 'Evaluate fully: 100 ÷ 5 = 20.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Evaluate:  {5 + [4 × (6 - 2)]} ÷ 3',
    option_a: '7', option_b: '9', option_c: '6', option_d: '8',
    correct_answer: 'A',
    explanation: 'Parentheses: 6 - 2 = 4. Brackets: 4 × 4 = 16. Braces: 5 + 16 = 21. Division: 21 ÷ 3 = 7.',
    distractor_diagnostics: {
      B: { error: 'The student made an error inside brackets.', remediation: 'Follow nesting order: (6 - 2) = 4, [4 × 4] = 16, {5 + 16} = 21, 21 ÷ 3 = 7.' },
      C: { error: 'The student subtracted 1.', remediation: '21 ÷ 3 = 7.' },
      D: { error: 'The student miscalculated 21 ÷ 3.', remediation: '21 ÷ 3 = 7.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'Two friends start running laps. Adam runs 3 laps each day. Ben runs 5 laps each day. After how many days will Ben have run 14 MORE laps than Adam?',
    option_a: '7 days', option_b: '5 days', option_c: '6 days', option_d: '14 days',
    correct_answer: 'A',
    explanation: 'Each day, Ben runs 5 - 3 = 2 more laps than Adam. To gain 14 more laps: 14 ÷ 2 = 7 days.',
    distractor_diagnostics: {
      B: { error: 'In 5 days, difference is 5 × 2 = 10 laps.', remediation: 'Divide the desired total difference (14) by daily difference (2): 14 ÷ 2 = 7 days.' },
      C: { error: 'In 6 days, difference is 12 laps.', remediation: '14 ÷ 2 = 7 days.' },
      D: { error: 'The student took 14 days without dividing by 2.', remediation: 'Daily gain is 2 laps: 14 ÷ 2 = 7 days.' }
    }
  },

  // High (8)
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Evaluate the complex expression:  4 × {18 - [2 × (3 + 1)]} + 12 ÷ 3',
    option_a: '44', option_b: '40', option_c: '52', option_d: '48',
    correct_answer: 'A',
    explanation: 'Innermost: 3 + 1 = 4. Next: 2 × 4 = 8. Braces: 18 - 8 = 10. Multiply: 4 × 10 = 40. Divide: 12 ÷ 3 = 4. Add: 40 + 4 = 44.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to add 12 ÷ 3 = 4 at the end.', remediation: 'Add 4 to 40: 40 + 4 = 44.' },
      C: { error: 'The student added before dividing (40 + 12) ÷ 3.', remediation: 'Division has higher precedence than addition: 12 ÷ 3 = 4, then 40 + 4 = 44.' },
      D: { error: 'The student made an arithmetic error in the brackets.', remediation: '4 × 10 + 4 = 44.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'A company produces 15 boxes in the morning and 25 boxes in the afternoon. Each box holds 12 items. At the end of the day, 40 items are damaged and discarded. Which expression gives the number of usable items?',
    option_a: '[(15 + 25) × 12] - 40', option_b: '(15 + 25 × 12) - 40', option_c: '15 + (25 × 12) - 40', option_d: '[(15 × 25) + 12] - 40',
    correct_answer: 'A',
    explanation: 'Total boxes = (15 + 25) = 40. Total items = 40 × 12 = 480. Usable items = 480 - 40 = 440. The expression is [(15 + 25) × 12] - 40.',
    distractor_diagnostics: {
      B: { error: 'Without parentheses around (15 + 25), 25 × 12 would be multiplied first.', remediation: 'Add morning and afternoon boxes first: [(15 + 25) × 12] - 40.' },
      C: { error: 'This leaves 15 boxes unmultiplied by 12.', remediation: 'All boxes contain 12 items: (15 + 25) × 12.' },
      D: { error: 'This multiplies boxes together.', remediation: 'Boxes are added, not multiplied: (15 + 25) × 12 - 40.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'Rule A starts at 0 and adds 4: 0, 4, 8, 12, ... Rule B starts at 0 and adds 10: 0, 10, 20, 30, ... If a term in Rule A is 48, what is the corresponding term in Rule B?',
    option_a: '120', option_b: '100', option_c: '140', option_d: '480',
    correct_answer: 'A',
    explanation: 'Term position in Rule A: 48 ÷ 4 = 12th step. Corresponding term in Rule B: 12 × 10 = 120 (or ratio is 10/4 = 2.5: 48 × 2.5 = 120).',
    distractor_diagnostics: {
      B: { error: '100 corresponds to 10 × 10 (when A = 40).', remediation: '48 is the 12th multiple of 4. The 12th multiple of 10 is 120.' },
      C: { error: 'The student miscalculated.', remediation: '(48 ÷ 4) × 10 = 12 × 10 = 120.' },
      D: { error: 'The student multiplied 48 × 10.', remediation: 'Scale by ratio 10/4 = 2.5: 48 × 2.5 = 120.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Which expression has a value of 10?',
    option_a: '[30 - (2 + 4) × 3] ÷ 1.2', option_b: '30 - 2 + 4 × 3 ÷ 2', option_c: '(30 - 2) + 4 × 3', option_d: '30 ÷ (2 + 4) + 3',
    correct_answer: 'A',
    explanation: 'Inside brackets: 2 + 4 = 6. 6 × 3 = 18. 30 - 18 = 12. Then 12 ÷ 1.2 = 10. (Alternatively in whole numbers: [30 - (2 + 4) × 3] + 2 = 12 - 2 = 10).',
    distractor_diagnostics: {
      B: { error: '30 - 2 + 6 = 34.', remediation: 'Calculate carefully with brackets to reach 10.' },
      C: { error: '28 + 12 = 40.', remediation: 'Evaluate operations step by step.' },
      D: { error: '30 ÷ 6 + 3 = 5 + 3 = 8.', remediation: 'Option A evaluates to 10.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'A sequence of rectangles has length L and width W. The length starts at 2 and increases by 3 each step (2, 5, 8, 11...). The width starts at 1 and increases by 2 each step (1, 3, 5, 7...). What is the AREA of the 4th rectangle in the sequence?',
    option_a: '77 square units', option_b: '64 square units', option_c: '88 square units', option_d: '56 square units',
    correct_answer: 'A',
    explanation: '4th length: 2, 5, 8, 11 (L = 11). 4th width: 1, 3, 5, 7 (W = 7). Area = L × W = 11 × 7 = 77 square units.',
    distractor_diagnostics: {
      B: { error: 'The student calculated 8 × 8.', remediation: '4th length is 11, 4th width is 7. Area = 11 × 7 = 77.' },
      C: { error: 'The student multiplied 11 × 8.', remediation: 'The 4th width is 1 + 3(2) = 7: 11 × 7 = 77.' },
      D: { error: 'The student calculated 3rd area (8 × 5 = 40) or miscalculated.', remediation: '11 × 7 = 77 square units.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'If A = 3 × (12 + 8) and B = 2 × [15 + (10 - 2)], what is the difference (A - B)?',
    option_a: '14', option_b: '60', option_c: '46', option_d: '16',
    correct_answer: 'A',
    explanation: 'A = 3 × 20 = 60. B = 2 × [15 + 8] = 2 × 23 = 46. Difference = A - B = 60 - 46 = 14.',
    distractor_diagnostics: {
      B: { error: '60 is the value of A.', remediation: 'Subtract B from A: 60 - 46 = 14.' },
      C: { error: '46 is the value of B.', remediation: 'Calculate A - B = 60 - 46 = 14.' },
      D: { error: 'The student made an error in subtracting 60 - 46.', remediation: '60 - 46 = 14.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Patterns & Relationships', subtopic_id: 197,
    question_text: 'Pattern 1 follows y = 2x + 1. Which set of ordered pairs correctly represents this pattern for x = 0, 1, 2, 3?',
    option_a: '(0, 1), (1, 3), (2, 5), (3, 7)', option_b: '(0, 0), (1, 2), (2, 4), (3, 6)', option_c: '(0, 3), (1, 5), (2, 7), (3, 9)', option_d: '(0, 1), (1, 2), (2, 3), (3, 4)',
    correct_answer: 'A',
    explanation: 'When x=0, y=1. When x=1, y=2(1)+1=3. When x=2, y=2(2)+1=5. When x=3, y=2(3)+1=7. Points: (0, 1), (1, 3), (2, 5), (3, 7).',
    distractor_diagnostics: {
      B: { error: 'This represents y = 2x without adding 1.', remediation: 'Add 1 after multiplying by 2: 2(0)+1 = 1, 2(1)+1 = 3.' },
      C: { error: 'This starts at y = 3.', remediation: 'At x = 0, y = 2(0) + 1 = 1.' },
      D: { error: 'This represents y = x + 1.', remediation: 'Multiply x by 2 first, then add 1: (0, 1), (1, 3), (2, 5), (3, 7).' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Numerical Expressions', subtopic_id: 196,
    question_text: 'Two expressions are given:  X = 8 × (250 + 75)   and   Y = 2 × (250 + 75). Without evaluating the sums, how many times larger is X than Y?',
    option_a: '4 times larger', option_b: '6 times larger', option_c: '8 times larger', option_d: '2 times larger',
    correct_answer: 'A',
    explanation: 'Both expressions have the identical factor (250 + 75). Comparing the outside factors: 8 ÷ 2 = 4. Therefore, X is 4 times larger than Y.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 8 - 2 = 6.', remediation: 'To find how many "times larger", divide the multipliers: 8 ÷ 2 = 4 times.' },
      C: { error: 'The student picked the factor 8 from X.', remediation: 'Compare the ratio of the factors: 8 / 2 = 4.' },
      D: { error: 'The student picked the factor 2 from Y.', remediation: '8 is 4 times larger than 2.' }
    }
  }
];

const g6Questions = [
  // Low (8)
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'What is the value of 3⁴?',
    option_a: '81', option_b: '12', option_c: '64', option_d: '27',
    correct_answer: 'A',
    explanation: '3⁴ means 3 multiplied by itself 4 times: 3 × 3 × 3 × 3 = 9 × 9 = 81.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied base by exponent: 3 × 4 = 12.', remediation: 'An exponent indicates repeated multiplication: 3 × 3 × 3 × 3 = 81, not 3 × 4.' },
      C: { error: 'The student calculated 4³ = 64.', remediation: 'The base is 3 and exponent is 4: 3⁴ = 81.' },
      D: { error: 'The student calculated 3³ = 27.', remediation: 'Multiply by 3 one more time: 27 × 3 = 81.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'In the algebraic expression 7x + 5, what is the COEFFICIENT of x?',
    option_a: '7', option_b: '5', option_c: 'x', option_d: '12',
    correct_answer: 'A',
    explanation: 'The coefficient is the numerical factor multiplied by the variable. Here, 7 is the coefficient of x.',
    distractor_diagnostics: {
      B: { error: '5 is the constant term, not the coefficient.', remediation: 'The coefficient is the number multiplying the variable: 7.' },
      C: { error: 'x is the variable, not the coefficient.', remediation: 'The coefficient is the numerical factor in front of the variable (7).' },
      D: { error: 'The student added 7 + 5.', remediation: 'The coefficient of x is 7.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'One-Variable Equations', subtopic_id: 199,
    question_text: 'Solve for x:  x + 9 = 23',
    option_a: '14', option_b: '32', option_c: '12', option_d: '15',
    correct_answer: 'A',
    explanation: 'Subtract 9 from both sides: x = 23 - 9 = 14.',
    distractor_diagnostics: {
      B: { error: 'The student added 23 + 9.', remediation: 'To isolate x, perform the inverse operation: subtract 9 from 23 to get 14.' },
      C: { error: 'The student made an arithmetic error.', remediation: '23 - 9 = 14.' },
      D: { error: 'The student miscounted.', remediation: '23 - 9 = 14.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'One-Variable Equations', subtopic_id: 199,
    question_text: 'Solve for m:  4m = 36',
    option_a: '9', option_b: '32', option_c: '40', option_d: '144',
    correct_answer: 'A',
    explanation: 'Divide both sides by 4: m = 36 ÷ 4 = 9.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 36 - 4.', remediation: '4m means 4 times m. The inverse operation is division: 36 ÷ 4 = 9.' },
      C: { error: 'The student added 36 + 4.', remediation: 'Divide 36 by 4: m = 9.' },
      D: { error: 'The student multiplied 36 × 4.', remediation: 'Divide both sides by 4 to solve for m: m = 9.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Inequalities', subtopic_id: 200,
    question_text: 'Which inequality represents the statement: "The temperature t is greater than 32 degrees"?',
    option_a: 't > 32', option_b: 't < 32', option_c: 't ≥ 32', option_d: 't ≤ 32',
    correct_answer: 'A',
    explanation: '"Greater than" is represented by the strict inequality symbol >: t > 32.',
    distractor_diagnostics: {
      B: { error: 'This represents "less than".', remediation: '"Greater than" uses the > symbol: t > 32.' },
      C: { error: 'This represents "greater than or equal to".', remediation: '"Greater than" means strictly greater (>).' },
      D: { error: 'This represents "less than or equal to".', remediation: 'Use > for greater than: t > 32.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'Evaluate the expression 2y + 3 when y = 5.',
    option_a: '13', option_b: '28', option_c: '10', option_d: '15',
    correct_answer: 'A',
    explanation: 'Substitute 5 for y: 2(5) + 3 = 10 + 3 = 13.',
    distractor_diagnostics: {
      B: { error: 'The student concatenated 2 and 5 to make 25, then added 3 = 28.', remediation: '2y means 2 multiplied by y: 2 × 5 = 10, then 10 + 3 = 13.' },
      C: { error: 'The student forgot to add 3.', remediation: '2(5) = 10, then add 3: 10 + 3 = 13.' },
      D: { error: 'The student added 5 + 3 = 8, then multiplied by 2.', remediation: 'Multiply before adding: 2 × 5 = 10, then + 3 = 13.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Dependent & Independent Variables', subtopic_id: 201,
    question_text: 'In the equation d = 50t, where d is total distance traveled and t is time in hours, which variable is the INDEPENDENT variable?',
    option_a: 't (time)', option_b: 'd (distance)', option_c: '50', option_d: 'Both d and t',
    correct_answer: 'A',
    explanation: 'Time t is the independent variable (input) because distance depends on how many hours you travel.',
    distractor_diagnostics: {
      B: { error: 'Distance d is the dependent variable.', remediation: 'Distance depends on time, so time t is independent and distance d is dependent.' },
      C: { error: '50 is a constant rate, not a variable.', remediation: 'The independent variable is t.' },
      D: { error: 'One is independent and one is dependent.', remediation: 't is the independent input variable.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Inequalities', subtopic_id: 200,
    question_text: 'Which number is a solution to the inequality:  x - 3 < 7?',
    option_a: '8', option_b: '10', option_c: '12', option_d: '15',
    correct_answer: 'A',
    explanation: 'Add 3 to both sides: x < 10. Among the choices, 8 is the only number strictly less than 10 (8 - 3 = 5 < 7).',
    distractor_diagnostics: {
      B: { error: '10 - 3 = 7, which is equal to 7, not strictly less than 7.', remediation: 'The inequality is strict (<), so x must be less than 10.' },
      C: { error: '12 - 3 = 9, which is greater than 7.', remediation: 'Substitute and check: 8 - 3 = 5 < 7 is true.' },
      D: { error: '15 - 3 = 12 > 7.', remediation: '8 is less than 10.' }
    }
  },

  // Medium (9)
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'Simplify the expression by combining like terms:  4x + 7 + 3x - 2',
    option_a: '7x + 5', option_b: '12x + 5', option_c: '7x + 9', option_d: '12x',
    correct_answer: 'A',
    explanation: 'Combine x-terms: 4x + 3x = 7x. Combine constant terms: 7 - 2 = 5. Result: 7x + 5.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied 4 × 3 = 12x.', remediation: 'Add the coefficients of like terms: 4x + 3x = 7x.' },
      C: { error: 'The student added 7 + 2 = 9 instead of subtracting 2.', remediation: 'Notice the minus sign in front of 2: 7 - 2 = 5.' },
      D: { error: 'The student combined unlike terms (7x + 5 = 12x).', remediation: 'Variables and constants cannot be combined into a single term: 7x + 5.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'Which expression is equivalent to 3(4x + 5) using the distributive property?',
    option_a: '12x + 15', option_b: '12x + 5', option_c: '7x + 8', option_d: '12x + 8',
    correct_answer: 'A',
    explanation: 'Distribute 3 to both terms inside the parentheses: 3 × 4x + 3 × 5 = 12x + 15.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to multiply 3 by 5.', remediation: 'Multiply 3 by both terms: 3 × 4x = 12x, and 3 × 5 = 15.' },
      C: { error: 'The student added 3 + 4 = 7 and 3 + 5 = 8.', remediation: 'The distributive property requires multiplication: 3 × 4x = 12x, 3 × 5 = 15.' },
      D: { error: 'The student added 3 + 5 = 8.', remediation: '3 × 5 = 15, so 12x + 15.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'Which expression is the factored form of 18x + 24 using the greatest common factor (GCF)?',
    option_a: '6(3x + 4)', option_b: '3(6x + 8)', option_c: '2(9x + 12)', option_d: '6(3x + 24)',
    correct_answer: 'A',
    explanation: 'The GCF of 18 and 24 is 6. Factoring out 6 gives: 18x ÷ 6 = 3x and 24 ÷ 6 = 4. Form: 6(3x + 4).',
    distractor_diagnostics: {
      B: { error: '3 is a common factor, but not the GREATEST common factor.', remediation: 'Factor out the GCF (6) to completely factor: 6(3x + 4).' },
      C: { error: '2 is not the greatest common factor.', remediation: 'The GCF of 18 and 24 is 6: 6(3x + 4).' },
      D: { error: 'The student forgot to divide 24 by 6.', remediation: 'Divide both terms by 6: 24 ÷ 6 = 4.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'One-Variable Equations', subtopic_id: 199,
    question_text: 'Solve for w:  w / 6 = 4.5',
    option_a: '27', option_b: '24', option_c: '10.5', option_d: '0.75',
    correct_answer: 'A',
    explanation: 'Multiply both sides by 6: w = 4.5 × 6 = 27.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied 4 × 6 = 24 and omitted the 0.5.', remediation: '4.5 × 6 = 27.' },
      C: { error: 'The student added 4.5 + 6 = 10.5.', remediation: 'The inverse of division is multiplication: w = 4.5 × 6 = 27.' },
      D: { error: 'The student divided 4.5 ÷ 6 = 0.75.', remediation: 'Multiply both sides by 6 to isolate w: w = 27.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Inequalities', subtopic_id: 200,
    question_text: 'On a number line, which graph correctly represents the inequality  x ≤ -2?',
    option_a: 'A closed circle at -2 with an arrow pointing to the left', option_b: 'An open circle at -2 with an arrow pointing to the left', option_c: 'A closed circle at -2 with an arrow pointing to the right', option_d: 'An open circle at -2 with an arrow pointing to the right',
    correct_answer: 'A',
    explanation: 'The "≤" symbol includes the endpoint (closed solid circle) and means values less than -2 (arrow points left).',
    distractor_diagnostics: {
      B: { error: 'An open circle is used for strict inequalities (< or >).', remediation: '≤ includes the equal sign, so use a closed/solid circle.' },
      C: { error: 'Pointing right represents greater than (≥).', remediation: '"Less than" points to the left towards smaller numbers.' },
      D: { error: 'This represents x > -2.', remediation: 'x ≤ -2 has a closed circle and points left.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'One-Variable Equations', subtopic_id: 199,
    question_text: 'A rectangular garden has an area of 84 square meters. The length of the garden is 12 meters. What is the width w of the garden?',
    option_a: '7 meters', option_b: '6 meters', option_c: '72 meters', option_d: '96 meters',
    correct_answer: 'A',
    explanation: 'Area = length × width: 84 = 12 × w. Divide by 12: w = 84 ÷ 12 = 7 meters.',
    distractor_diagnostics: {
      B: { error: '12 × 6 = 72, not 84.', remediation: '84 ÷ 12 = 7 meters.' },
      C: { error: 'The student subtracted 84 - 12.', remediation: 'To find width from area, divide: 84 ÷ 12 = 7.' },
      D: { error: 'The student added 84 + 12.', remediation: 'Divide area by length: 84 ÷ 12 = 7.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Dependent & Independent Variables', subtopic_id: 201,
    question_text: 'A movie streaming service charges a $10 monthly base fee plus $3 for each premium movie rented (m). Which equation gives the total monthly cost C?',
    option_a: 'C = 3m + 10', option_b: 'C = 10m + 3', option_c: 'C = 13m', option_d: 'C = (m + 3) × 10',
    correct_answer: 'A',
    explanation: 'The variable cost is $3 per movie (3m) and the flat base fee is $10: C = 3m + 10.',
    distractor_diagnostics: {
      B: { error: 'The student switched the rate and the flat fee.', remediation: '$3 is multiplied by the number of movies m, and $10 is added once: C = 3m + 10.' },
      C: { error: 'The student added 10 + 3 = 13 and multiplied by m.', remediation: 'The $10 fee is a one-time flat charge, not per movie: C = 3m + 10.' },
      D: { error: 'The student set up the operations incorrectly.', remediation: 'Cost = 3m + 10.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'Evaluate the expression  a² + 3b - c  when a = 4, b = 5, and c = 7.',
    option_a: '24', option_b: '16', option_c: '32', option_d: '26',
    correct_answer: 'A',
    explanation: 'Substitute: 4² + 3(5) - 7 = 16 + 15 - 7 = 31 - 7 = 24.',
    distractor_diagnostics: {
      B: { error: 'The student calculated 4 × 2 instead of 4² (8 + 15 - 7 = 16).', remediation: '4² means 4 × 4 = 16. Then 16 + 15 - 7 = 24.' },
      C: { error: 'The student added 7 instead of subtracting 7: 31 + 7 = 38.', remediation: 'Subtract c: 31 - 7 = 24.' },
      D: { error: 'The student made an arithmetic error.', remediation: '16 + 15 - 7 = 24.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Inequalities', subtopic_id: 200,
    question_text: 'A roller coaster requires passengers to be at least 48 inches tall to ride. If h represents height in inches, which inequality represents this rule?',
    option_a: 'h ≥ 48', option_b: 'h > 48', option_c: 'h ≤ 48', option_d: 'h = 48',
    correct_answer: 'A',
    explanation: '"At least 48" means 48 inches or taller, which is represented by h ≥ 48.',
    distractor_diagnostics: {
      B: { error: '"At least" includes 48, so it cannot be strictly greater than.', remediation: '"At least" means greater than or equal to: h ≥ 48.' },
      C: { error: 'This means 48 or shorter.', remediation: '"At least" sets a minimum, so height must be ≥ 48.' },
      D: { error: 'Passengers can be taller than 48 as well.', remediation: 'Use the inequality h ≥ 48.' }
    }
  },

  // High (8)
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'Which two expressions are EQUIVALENT for all positive values of x?',
    option_a: '5(2x + 3) - 4x   and   6x + 15', option_b: '3(x + 4)   and   3x + 4', option_c: '2x + 3x   and   5x²', option_d: '4(2x - 1)   and   8x - 1',
    correct_answer: 'A',
    explanation: 'Expand 5(2x + 3) - 4x = 10x + 15 - 4x = 6x + 15. This is identical to 6x + 15.',
    distractor_diagnostics: {
      B: { error: '3(x + 4) expands to 3x + 12, not 3x + 4.', remediation: 'Distribute 3 to both terms: 3 × 4 = 12.' },
      C: { error: '2x + 3x = 5x, not 5x².', remediation: 'When adding like terms, add coefficients: 2 + 3 = 5, keep variable x.' },
      D: { error: '4(2x - 1) expands to 8x - 4, not 8x - 1.', remediation: 'Multiply 4 by -1 to get -4.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'One-Variable Equations', subtopic_id: 199,
    question_text: 'Solve the equation for x:  (2/3)x = 18',
    option_a: '27', option_b: '12', option_c: '54', option_d: '9',
    correct_answer: 'A',
    explanation: 'Multiply both sides by the reciprocal of 2/3, which is 3/2: x = 18 × (3/2) = (18 ÷ 2) × 3 = 9 × 3 = 27.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied 18 by 2/3 instead of dividing.', remediation: 'Multiply by the reciprocal (3/2): 18 × 3/2 = 27.' },
      C: { error: 'The student multiplied 18 × 3 without dividing by 2.', remediation: 'Divide by 2 after multiplying by 3: 54 / 2 = 27.' },
      D: { error: 'The student divided 18 by 2.', remediation: 'x = 18 × (3/2) = 27.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Inequalities', subtopic_id: 200,
    question_text: 'A delivery truck can carry at most 2,500 pounds. It is already loaded with 1,350 pounds of cargo. The driver wants to load crates weighing 50 pounds each. What is the maximum number of crates (c) the driver can load?',
    option_a: '23 crates', option_b: '25 crates', option_c: '22 crates', option_d: '50 crates',
    correct_answer: 'A',
    explanation: 'Inequality: 1350 + 50c ≤ 2500. Subtract 1350: 50c ≤ 1150. Divide by 50: c ≤ 23 crates.',
    distractor_diagnostics: {
      B: { error: '50 × 25 = 1250, and 1350 + 1250 = 2600 > 2500 (overweight).', remediation: '1150 ÷ 50 = 23 crates maximum.' },
      C: { error: '22 crates weighs 1100 lbs, but 23 crates can still fit (1150 lbs).', remediation: '50 × 23 = 1150, which matches the remaining capacity exactly.' },
      D: { error: '50 crates would weigh 2,500 pounds alone.', remediation: 'Account for the existing 1,350 lbs: (2500 - 1350) / 50 = 23.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Dependent & Independent Variables', subtopic_id: 201,
    question_text: 'A car rental company uses the formula C = 0.25m + 35 to calculate total charge C for driving m miles. If a customer has a budget of $85, what is the maximum number of miles they can drive?',
    option_a: '200 miles', option_b: '340 miles', option_c: '140 miles', option_d: '480 miles',
    correct_answer: 'A',
    explanation: 'Set up inequality: 0.25m + 35 ≤ 85. Subtract 35: 0.25m ≤ 50. Divide by 0.25 (multiply by 4): m ≤ 200 miles.',
    distractor_diagnostics: {
      B: { error: 'The student divided 85 by 0.25 without subtracting the $35 base fee.', remediation: 'Subtract the $35 flat fee first: 85 - 35 = 50. Then 50 / 0.25 = 200 miles.' },
      C: { error: 'The student subtracted 50 - 35.', remediation: '0.25m = 50, so m = 50 × 4 = 200 miles.' },
      D: { error: 'The student made an arithmetic error.', remediation: '50 ÷ 0.25 = 200 miles.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'The perimeter of an equilateral triangle is represented by the expression 6x + 15. What is the length of ONE side of the triangle?',
    option_a: '2x + 5', option_b: '3x + 5', option_c: '2x + 15', option_d: '18x + 45',
    correct_answer: 'A',
    explanation: 'An equilateral triangle has 3 equal sides. Divide perimeter by 3: (6x + 15) ÷ 3 = (6x/3) + (15/3) = 2x + 5.',
    distractor_diagnostics: {
      B: { error: 'The student divided 6 by 2 instead of 3.', remediation: 'A triangle has 3 sides: divide both terms by 3: 6x ÷ 3 = 2x, 15 ÷ 3 = 5.' },
      C: { error: 'The student divided only the variable term by 3 and left 15 unchanged.', remediation: 'Divide all terms by 3: (6x + 15) ÷ 3 = 2x + 5.' },
      D: { error: 'The student multiplied by 3 instead of dividing.', remediation: 'Perimeter is divided by 3 to find one side: 2x + 5.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'One-Variable Equations', subtopic_id: 199,
    question_text: 'Solve for p:  3.4 + p = 9.15',
    option_a: '5.75', option_b: '6.75', option_c: '12.55', option_d: '5.25',
    correct_answer: 'A',
    explanation: 'Subtract: p = 9.15 - 3.40 = 5.75.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to regroup across the whole number.', remediation: '9.15 - 3.40 = 5.75.' },
      C: { error: 'The student added 9.15 + 3.4.', remediation: 'Subtract 3.4 from 9.15 to isolate p: p = 5.75.' },
      D: { error: 'The student subtracted 3.9 instead of 3.4.', remediation: '9.15 - 3.40 = 5.75.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Algebraic Expressions', subtopic_id: 198,
    question_text: 'Evaluate  x³ - (2y + z²)  when x = 3, y = 4, and z = 2.',
    option_a: '15', option_b: '19', option_c: '9', option_d: '11',
    correct_answer: 'A',
    explanation: 'x³ = 3³ = 27. Inside parentheses: 2(4) + 2² = 8 + 4 = 12. Evaluate: 27 - 12 = 15.',
    distractor_diagnostics: {
      B: { error: 'The student evaluated 2² as 2 × 2 = 4, but subtracted only 8: 27 - 8 = 19.', remediation: 'Both terms inside parentheses are subtracted: 27 - (8 + 4) = 27 - 12 = 15.' },
      C: { error: 'The student evaluated 3³ as 3 × 3 = 9.', remediation: '3³ = 3 × 3 × 3 = 27. Then 27 - 12 = 15.' },
      D: { error: 'The student made an arithmetic error.', remediation: '27 - 12 = 15.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Dependent & Independent Variables', subtopic_id: 201,
    question_text: 'A table shows values: (x=2, y=7), (x=4, y=13), (x=6, y=19). Which equation models this relationship, and what is y when x = 10?',
    option_a: 'y = 3x + 1; when x = 10, y = 31', option_b: 'y = 4x - 1; when x = 10, y = 39', option_c: 'y = 3x + 1; when x = 10, y = 30', option_d: 'y = 2x + 3; when x = 10, y = 23',
    correct_answer: 'A',
    explanation: 'Check rate of change: (13 - 7) / (4 - 2) = 6 / 2 = 3. Equation: y = 3x + b. Using (2, 7): 7 = 3(2) + b -> b = 1. So y = 3x + 1. When x = 10: y = 3(10) + 1 = 31.',
    distractor_diagnostics: {
      B: { error: 'Testing (2, 7): 4(2) - 1 = 7, but for x=4: 4(4) - 1 = 15 (not 13).', remediation: 'The constant rate of change is 3, giving y = 3x + 1. At x=10, y = 31.' },
      C: { error: 'The student forgot to add 1 when evaluating x = 10.', remediation: '3(10) + 1 = 31.' },
      D: { error: 'Testing x=2: 2(2) + 3 = 7, but for x=4: 2(4) + 3 = 11 (not 13).', remediation: 'The correct linear rule is y = 3x + 1.' }
    }
  }
];

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Haroon12345@',
    database: process.env.DB_NAME || 'neweducheck'
  });

  const allQuestions = [...g5Questions, ...g6Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 5 & Grade 6 Algebra...`);

  let inserted = 0;
  let updated = 0;

  for (const q of allQuestions) {
    const [existing] = await pool.query(
      'SELECT id FROM questions WHERE question_text = ? AND grade = ?',
      [q.question_text, q.grade]
    );

    const diagnosticsJson = JSON.stringify(q.distractor_diagnostics);

    if (existing.length > 0) {
      await pool.query(
        `UPDATE questions SET
          subject_id = 6,
          topic_id = 2,
          subtopic_name = ?,
          subtopic_id = ?,
          grade_id = ?,
          grade = ?,
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
          q.grade,
          q.grade,
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
      updated++;
    } else {
      await pool.query(
        `INSERT INTO questions (
          subject_id, topic_id, chapter_id, subtopic_name, subtopic_id,
          grade_id, grade, difficulty, question_text,
          option_a, option_b, option_c, option_d,
          correct_answer, status, is_active, explanation, distractor_diagnostics
        ) VALUES (
          6, 2, NULL, ?, ?,
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

  console.log(`Grade 5 & 6 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
