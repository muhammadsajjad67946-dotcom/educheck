const mysql = require('mysql2/promise');
require('dotenv').config();

const g1Questions = [
  // Low (8)
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Addition Word Problems', subtopic_id: 186,
    question_text: 'Sam has 4 apples. His mother gives him 3 more apples. How many apples does Sam have in all?',
    option_a: '7', option_b: '6', option_c: '8', option_d: '1',
    correct_answer: 'A',
    explanation: 'Add the two amounts together: 4 + 3 = 7 apples.',
    distractor_diagnostics: {
      B: { error: 'The student miscounted by 1.', remediation: 'Count forward 3 steps from 4: 5, 6, 7.' },
      C: { error: 'The student miscounted by 1 too many.', remediation: '4 + 3 = 7.' },
      D: { error: 'The student subtracted 4 - 3.', remediation: 'The problem asks for "in all", which means add: 4 + 3 = 7.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Subtraction Word Problems', subtopic_id: 187,
    question_text: 'There were 9 birds on a fence. 4 birds flew away. How many birds are left on the fence?',
    option_a: '5', option_b: '13', option_c: '4', option_d: '6',
    correct_answer: 'A',
    explanation: 'Subtract the birds that flew away: 9 - 4 = 5 birds.',
    distractor_diagnostics: {
      B: { error: 'The student added 9 + 4 instead of subtracting.', remediation: '"Flew away" means subtract: 9 - 4 = 5.' },
      C: { error: 'The student repeated the number that flew away.', remediation: 'Subtract 4 from 9 to get 5.' },
      D: { error: 'The student counted back incorrectly.', remediation: 'Start at 9 and count back 4: 8, 7, 6, 5.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Properties & Relationships', subtopic_id: 188,
    question_text: 'If 3 + 5 = 8, what is 5 + 3?',
    option_a: '8', option_b: '2', option_c: '15', option_d: '7',
    correct_answer: 'A',
    explanation: 'By the commutative property of addition, changing the order of the addends does not change the sum: 5 + 3 = 8.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 5 - 3.', remediation: 'Changing the order of addition gives the same sum: 3 + 5 = 5 + 3 = 8.' },
      C: { error: 'The student multiplied 5 × 3.', remediation: 'This is addition: 5 + 3 = 8.' },
      D: { error: 'The student miscalculated.', remediation: '3 + 5 and 5 + 3 both equal 8.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Addition & Subtraction Strategies', subtopic_id: 189,
    question_text: 'Which double fact helps you solve 6 + 7?',
    option_a: '6 + 6 = 12', option_b: '5 + 5 = 10', option_c: '8 + 8 = 16', option_d: '4 + 4 = 8',
    correct_answer: 'A',
    explanation: '6 + 7 is a near-double: 6 + 6 + 1 = 12 + 1 = 13. So 6 + 6 helps solve it.',
    distractor_diagnostics: {
      B: { error: 'The student chose doubles of 5.', remediation: 'Look at the numbers in the problem: 6 + 7 is one more than 6 + 6.' },
      C: { error: 'The student chose a larger double fact.', remediation: 'Use the double of the smaller addend: 6 + 6 = 12.' },
      D: { error: 'The student picked an unrelated double.', remediation: '6 + 6 = 12 is the near-double for 6 + 7.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'What number makes this equation true? 6 + ___ = 10',
    option_a: '4', option_b: '16', option_c: '3', option_d: '5',
    correct_answer: 'A',
    explanation: 'Count up from 6 to 10: 7, 8, 9, 10 (4 counts). So 6 + 4 = 10.',
    distractor_diagnostics: {
      B: { error: 'The student added 6 + 10.', remediation: 'Find what must be added to 6 to reach 10: 10 - 6 = 4.' },
      C: { error: 'The student counted 1 short.', remediation: '6 + 4 = 10.' },
      D: { error: 'The student thought 5 + 5.', remediation: 'Starting from 6, you need 4 more to make 10.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'Which equation is TRUE?',
    option_a: '5 + 2 = 7', option_b: '4 + 3 = 8', option_c: '6 + 1 = 5', option_d: '3 + 3 = 7',
    correct_answer: 'A',
    explanation: '5 + 2 = 7 is a true mathematical statement.',
    distractor_diagnostics: {
      B: { error: '4 + 3 is 7, not 8.', remediation: 'Add 4 and 3 to get 7.' },
      C: { error: '6 + 1 is 7, not 5.', remediation: '6 + 1 = 7.' },
      D: { error: '3 + 3 is 6, not 7.', remediation: 'Doubling 3 gives 6.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Properties & Relationships', subtopic_id: 188,
    question_text: 'Which addition sentence can help you solve 12 - 5 = ___?',
    option_a: '5 + 7 = 12', option_b: '12 + 5 = 17', option_c: '5 + 5 = 10', option_d: '7 + 7 = 14',
    correct_answer: 'A',
    explanation: 'Subtraction is the inverse of addition: 12 - 5 = ? is the same as finding 5 + ? = 12, which is 5 + 7 = 12.',
    distractor_diagnostics: {
      B: { error: 'The student added the two numbers together.', remediation: 'Think of fact families: 12 - 5 = 7 because 5 + 7 = 12.' },
      C: { error: 'The student chose doubles of 5.', remediation: 'You need an equation with sum 12 and part 5: 5 + 7 = 12.' },
      D: { error: 'The student chose doubles of 7.', remediation: 'Relate the known part (5) and total (12): 5 + 7 = 12.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Addition Word Problems', subtopic_id: 186,
    question_text: 'Maya has 2 red crayons, 3 blue crayons, and 4 green crayons. How many crayons does she have altogether?',
    option_a: '9', option_b: '8', option_c: '7', option_d: '10',
    correct_answer: 'A',
    explanation: 'Add all three numbers: 2 + 3 + 4 = 5 + 4 = 9 crayons.',
    distractor_diagnostics: {
      B: { error: 'The student miscounted by 1.', remediation: '2 + 3 = 5, and 5 + 4 = 9.' },
      C: { error: 'The student added only two colors (3 + 4 = 7).', remediation: 'Make sure to add all three numbers: 2 + 3 + 4 = 9.' },
      D: { error: 'The student counted 1 too many.', remediation: '2 + 3 + 4 = 9.' }
    }
  },

  // Medium (9)
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Addition Word Problems', subtopic_id: 186,
    question_text: 'Leo has 7 stickers. He buys some more stickers. Now he has 13 stickers. How many stickers did Leo buy?',
    option_a: '6', option_b: '20', option_c: '5', option_d: '7',
    correct_answer: 'A',
    explanation: 'Set up the equation 7 + ? = 13. Subtract: 13 - 7 = 6 stickers.',
    distractor_diagnostics: {
      B: { error: 'The student added 7 + 13.', remediation: 'Leo started with 7 and ended with 13, so find the difference: 13 - 7 = 6.' },
      C: { error: 'The student miscalculated.', remediation: 'Count from 7 up to 13: 8, 9, 10, 11, 12, 13 (6 stickers).' },
      D: { error: 'The student repeated the starting amount.', remediation: 'Subtract 13 - 7 = 6.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Subtraction Word Problems', subtopic_id: 187,
    question_text: 'There were some frogs on a log. 6 frogs jumped into the pond. Now there are 8 frogs on the log. How many frogs were on the log at first?',
    option_a: '14', option_b: '2', option_c: '12', option_d: '8',
    correct_answer: 'A',
    explanation: 'Start unknown: ? - 6 = 8. Add to find the total: 8 + 6 = 14 frogs.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 8 - 6.', remediation: 'To find how many were there at first before 6 jumped away, add 8 + 6 = 14.' },
      C: { error: 'The student miscalculated 8 + 6.', remediation: '8 + 6 = 14.' },
      D: { error: 'The student just took the remaining frogs.', remediation: 'Combine the remaining frogs and the ones that jumped away: 8 + 6 = 14.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Addition & Subtraction Strategies', subtopic_id: 189,
    question_text: 'To solve 8 + 5 using the "make a ten" strategy, how should 5 be broken apart?',
    option_a: '2 + 3', option_b: '1 + 4', option_c: '3 + 2', option_d: '4 + 1',
    correct_answer: 'A',
    explanation: '8 needs 2 to make 10. Breaking 5 into 2 + 3 gives (8 + 2) + 3 = 10 + 3 = 13.',
    distractor_diagnostics: {
      B: { error: '8 + 1 is 9, not 10.', remediation: '8 needs 2 to make 10, so split 5 into 2 and 3.' },
      C: { error: 'Giving 3 to 8 makes 11.', remediation: 'Take 2 first to complete 10: 8 + 2 = 10, then add 3.' },
      D: { error: '8 + 4 is 12, not 10.', remediation: 'Find the partner to 10 for 8, which is 2. 5 splits into 2 + 3.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'Which number makes the equation true? 15 - ___ = 8',
    option_a: '7', option_b: '23', option_c: '6', option_d: '8',
    correct_answer: 'A',
    explanation: '15 - 7 = 8, because 8 + 7 = 15.',
    distractor_diagnostics: {
      B: { error: 'The student added 15 + 8.', remediation: 'Subtract 8 from 15 to find the missing subtrahend: 15 - 8 = 7.' },
      C: { error: 'The student miscounted.', remediation: '15 - 7 = 8.' },
      D: { error: 'The student guessed 8.', remediation: '15 - 8 = 7, so the missing number is 7.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'Is the equation 4 + 5 = 6 + 3 true or false?',
    option_a: 'True, because both sides equal 9', option_b: 'False, because 4 + 5 is 8', option_c: 'False, because the numbers are different', option_d: 'True, because both sides equal 10',
    correct_answer: 'A',
    explanation: 'Left side: 4 + 5 = 9. Right side: 6 + 3 = 9. Since 9 = 9, the equation is true.',
    distractor_diagnostics: {
      B: { error: 'The student added 4 + 5 incorrectly.', remediation: '4 + 5 = 9 and 6 + 3 = 9.' },
      C: { error: 'The student thought expressions must use the same numbers to be equal.', remediation: 'An equals sign means both sides have the same value, even with different numbers.' },
      D: { error: 'The student miscalculated the total as 10.', remediation: 'Both sides equal 9.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Properties & Relationships', subtopic_id: 188,
    question_text: 'Which grouping shows the associative property of addition for 2 + 3 + 4?',
    option_a: '(2 + 3) + 4 = 2 + (3 + 4)', option_b: '2 + 3 = 3 + 2', option_c: '2 + 3 + 4 = 9', option_d: '2 + 4 + 3 = 4 + 2 + 3',
    correct_answer: 'A',
    explanation: 'The associative property states that grouping addends differently does not change the sum: (2 + 3) + 4 = 2 + (3 + 4).',
    distractor_diagnostics: {
      B: { error: 'This shows the commutative property of two numbers.', remediation: 'The associative property involves grouping 3 numbers with parentheses: (a + b) + c = a + (b + c).' },
      C: { error: 'This just evaluates the sum.', remediation: 'The property shows how grouping with parentheses can change without changing the sum.' },
      D: { error: 'This only reorders numbers without parentheses.', remediation: 'Look for parentheses grouping the numbers differently.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Addition Word Problems', subtopic_id: 186,
    question_text: 'Liam has 14 toy cars. Emma has 8 toy cars. How many MORE toy cars does Liam have than Emma?',
    option_a: '6', option_b: '22', option_c: '7', option_d: '5',
    correct_answer: 'A',
    explanation: 'To compare amounts, subtract: 14 - 8 = 6 toy cars.',
    distractor_diagnostics: {
      B: { error: 'The student added 14 + 8.', remediation: '"How many more" means find the difference by subtracting: 14 - 8 = 6.' },
      C: { error: 'The student miscounted.', remediation: '14 - 8 = 6.' },
      D: { error: 'The student subtracted 13 - 8.', remediation: '14 - 8 = 6.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Addition & Subtraction Strategies', subtopic_id: 189,
    question_text: 'What is 14 - 6 using the "take from ten" strategy?',
    option_a: '10 - 6 = 4, then 4 + 4 = 8', option_b: '14 - 4 = 10, then 10 - 6 = 4', option_c: '6 + 6 = 12, then 12 + 2 = 14', option_d: '14 - 10 = 4, then 4 + 6 = 10',
    correct_answer: 'A',
    explanation: 'Break 14 into 10 and 4. Subtract 6 from 10 to get 4, then add the other 4: 4 + 4 = 8.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 6 twice.', remediation: '14 = 10 + 4. Take 6 from 10: 10 - 6 = 4, then add back the 4 to get 8.' },
      C: { error: 'The student used a doubles fact incorrectly.', remediation: 'The take-from-ten strategy subtracts from 10 first.' },
      D: { error: 'The student made an error in steps.', remediation: '10 - 6 = 4, then 4 + 4 = 8.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'What number makes this equation true? ___ - 4 = 7',
    option_a: '11', option_b: '3', option_c: '10', option_d: '12',
    correct_answer: 'A',
    explanation: 'Add the known parts: 7 + 4 = 11. Checking: 11 - 4 = 7.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 7 - 4.', remediation: 'Since you started with a total and took away 4 to leave 7, add: 7 + 4 = 11.' },
      C: { error: 'The student added 7 + 3.', remediation: '7 + 4 = 11.' },
      D: { error: 'The student miscounted.', remediation: '7 + 4 = 11.' }
    }
  },

  // High (8)
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Addition Word Problems', subtopic_id: 186,
    question_text: 'Ava had 5 pencils. She found 4 more pencils, and then her teacher gave her some more. Now Ava has 16 pencils. How many pencils did the teacher give her?',
    option_a: '7', option_b: '9', option_c: '6', option_d: '8',
    correct_answer: 'A',
    explanation: 'Ava had 5 + 4 = 9 pencils. She ended with 16. To find the teacher\'s pencils: 16 - 9 = 7 pencils.',
    distractor_diagnostics: {
      B: { error: 'The student found the sum of 5 + 4 (9) but didn\'t subtract from 16.', remediation: 'Subtract 9 from 16 to find the remaining pencils: 16 - 9 = 7.' },
      C: { error: 'The student miscounted by 1.', remediation: '16 - 9 = 7.' },
      D: { error: 'The student thought 16 - 8 = 8.', remediation: 'Ava had 9 pencils, so 16 - 9 = 7.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'Which number makes the equation true? 8 + 3 = ___ + 4',
    option_a: '7', option_b: '11', option_c: '15', option_d: '6',
    correct_answer: 'A',
    explanation: 'Left side: 8 + 3 = 11. Right side must also equal 11: ___ + 4 = 11. So ___ = 11 - 4 = 7.',
    distractor_diagnostics: {
      B: { error: 'The student put the sum of the left side (11) into the blank.', remediation: 'Both sides must balance. Left is 11, so the blank + 4 must equal 11: 11 - 4 = 7.' },
      C: { error: 'The student added all numbers: 8 + 3 + 4 = 15.', remediation: 'Balance both sides: 8 + 3 = 11, so ? + 4 = 11, ? = 7.' },
      D: { error: 'The student miscalculated.', remediation: '11 - 4 = 7.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'Which equation has the same unknown value as 14 - ___ = 9?',
    option_a: '9 + ___ = 14', option_b: '14 + 9 = ___', option_c: '9 - ___ = 14', option_d: '___ - 9 = 14',
    correct_answer: 'A',
    explanation: '14 - ? = 9 means 14 is the whole and 9 and ? are parts. The addition fact with the same unknown is 9 + ? = 14.',
    distractor_diagnostics: {
      B: { error: 'The student added the whole and a part.', remediation: '14 is the total. The related addition is 9 + ? = 14.' },
      C: { error: 'The student subtracted from the smaller part.', remediation: 'You cannot subtract to get a larger whole in Grade 1.' },
      D: { error: 'In this equation the total would be 23.', remediation: 'The total is 14, so 9 + ? = 14.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Subtraction Word Problems', subtopic_id: 187,
    question_text: 'There are 15 children on the playground. 8 are playing soccer and the rest are on swings. How many children are on swings?',
    option_a: '7', option_b: '8', option_c: '6', option_d: '23',
    correct_answer: 'A',
    explanation: 'Subtract the children playing soccer from the total: 15 - 8 = 7 children on swings.',
    distractor_diagnostics: {
      B: { error: 'The student guessed 8.', remediation: '15 - 8 = 7, not 8.' },
      C: { error: 'The student miscalculated by 1.', remediation: 'Count from 8 up to 15: 9, 10, 11, 12, 13, 14, 15 (7 children).' },
      D: { error: 'The student added 15 + 8.', remediation: 'The total is 15. Subtract to find the missing part: 15 - 8 = 7.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Properties & Relationships', subtopic_id: 188,
    question_text: 'Emma wants to add 7 + 5 + 3. Which is the easiest way to group the numbers?',
    option_a: '(7 + 3) + 5, because 7 + 3 makes a 10', option_b: '(5 + 3) + 7, because 5 + 3 is 8', option_c: '(7 + 5) + 3, adding in order', option_d: 'Any order, but (7 + 5) is easiest',
    correct_answer: 'A',
    explanation: 'Using the commutative and associative properties, grouping 7 and 3 first makes 10. Then 10 + 5 = 15 is very easy to solve.',
    distractor_diagnostics: {
      B: { error: '8 + 7 requires another step.', remediation: 'Making a ten first (7 + 3 = 10) is the most efficient strategy.' },
      C: { error: '7 + 5 = 12 requires adding 12 + 3.', remediation: 'Look for number bonds to 10: 7 + 3 = 10.' },
      D: { error: 'Making 12 is harder than making 10.', remediation: 'Combine 7 and 3 first to make 10, then add 5.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'Which value of the unknown makes BOTH equations true?  (1) 6 + ? = 11   and   (2) 15 - ? = 10',
    option_a: '5', option_b: '6', option_c: '4', option_d: '7',
    correct_answer: 'A',
    explanation: 'For equation (1): 11 - 6 = 5. For equation (2): 15 - 10 = 5. The unknown value 5 satisfies both equations.',
    distractor_diagnostics: {
      B: { error: '6 makes 6 + 6 = 12 and 15 - 6 = 9.', remediation: 'Test 5: 6 + 5 = 11 and 15 - 5 = 10.' },
      C: { error: '4 makes 6 + 4 = 10, not 11.', remediation: '6 + 5 = 11, so ? must be 5.' },
      D: { error: '7 makes 6 + 7 = 13.', remediation: 'Both equations require ? = 5.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Addition Word Problems', subtopic_id: 186,
    question_text: 'Lucas had 18 marbles. He gave 5 marbles to Noah and 4 marbles to Jack. How many marbles does Lucas have left?',
    option_a: '9', option_b: '10', option_c: '8', option_d: '13',
    correct_answer: 'A',
    explanation: 'Total marbles given away = 5 + 4 = 9. Marbles left = 18 - 9 = 9 marbles.',
    distractor_diagnostics: {
      B: { error: 'The student miscalculated.', remediation: '18 - 5 = 13, then 13 - 4 = 9.' },
      C: { error: 'The student subtracted 1 too many.', remediation: '18 - 9 = 9.' },
      D: { error: 'The student subtracted only the first 5 marbles.', remediation: 'Remember to also subtract the 4 marbles given to Jack: 13 - 4 = 9.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Equations & Unknowns', subtopic_id: 190,
    question_text: 'There are 12 birds in a tree. Some more birds join them. Then 3 birds fly away, leaving 14 birds. How many birds joined them?',
    option_a: '5', option_b: '2', option_c: '6', option_d: '4',
    correct_answer: 'A',
    explanation: 'Work backwards: Before 3 flew away, there were 14 + 3 = 17 birds. Since there were initially 12, the birds that joined were 17 - 12 = 5.',
    distractor_diagnostics: {
      B: { error: 'The student just subtracted 14 - 12 = 2.', remediation: 'Don\'t forget 3 birds flew away! 12 + ? - 3 = 14 -> 12 + ? = 17 -> ? = 5.' },
      C: { error: 'The student added 3 to 2 plus 1.', remediation: '17 - 12 = 5.' },
      D: { error: 'The student calculated incorrectly.', remediation: '12 + 5 = 17, and 17 - 3 = 14.' }
    }
  }
];

const g2Questions = [
  // Low (8)
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'A toy store had 28 teddy bears. They received a shipment of 15 more teddy bears. How many teddy bears do they have now?',
    option_a: '43', option_b: '33', option_c: '45', option_d: '13',
    correct_answer: 'A',
    explanation: 'Add 28 + 15: 28 + 10 = 38, 38 + 5 = 43 teddy bears.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to regroup the ones (8 + 5 = 13).', remediation: '8 + 5 = 13 ones, which is 1 ten and 3 ones. 20 + 10 + 10 + 3 = 43.' },
      C: { error: 'The student miscalculated the ones.', remediation: '28 + 15 = 43.' },
      D: { error: 'The student subtracted 28 - 15.', remediation: '"Received more" means add: 28 + 15 = 43.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'There were 52 books on a shelf. Students checked out 20 books. How many books are still on the shelf?',
    option_a: '32', option_b: '72', option_c: '22', option_d: '30',
    correct_answer: 'A',
    explanation: 'Subtract the checked-out books: 52 - 20 = 32 books.',
    distractor_diagnostics: {
      B: { error: 'The student added 52 + 20.', remediation: '"Checked out" means subtract: 52 - 20 = 32.' },
      C: { error: 'The student subtracted 30 instead of 20.', remediation: '5 tens - 2 tens = 3 tens. 52 - 20 = 32.' },
      D: { error: 'The student lost the 2 ones.', remediation: '52 - 20 = 32.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Odd & Even Numbers', subtopic_id: 362,
    question_text: 'Which number is an EVEN number?',
    option_a: '16', option_b: '15', option_c: '19', option_d: '13',
    correct_answer: 'A',
    explanation: 'An even number ends in 0, 2, 4, 6, or 8 and can be divided into two equal groups without leftovers. 16 ends in 6, so it is even.',
    distractor_diagnostics: {
      B: { error: '15 ends in 5, which is odd.', remediation: 'Even numbers end in 0, 2, 4, 6, or 8.' },
      C: { error: '19 ends in 9, which is odd.', remediation: 'Check the ones digit: 16 ends in 6 (even).' },
      D: { error: '13 ends in 3, which is odd.', remediation: 'Odd numbers end in 1, 3, 5, 7, or 9.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Odd & Even Numbers', subtopic_id: 362,
    question_text: 'Which addition sentence shows that 14 is an even number?',
    option_a: '7 + 7 = 14', option_b: '10 + 4 = 14', option_c: '9 + 5 = 14', option_d: '8 + 6 = 14',
    correct_answer: 'A',
    explanation: 'An even number can be expressed as the sum of two equal whole numbers: 7 + 7 = 14.',
    distractor_diagnostics: {
      B: { error: '10 and 4 are not equal addends.', remediation: 'An even number can be split into two identical halves: 7 + 7 = 14.' },
      C: { error: '9 and 5 are not equal.', remediation: 'To prove a number is even, write it as a double of equal numbers: 7 + 7 = 14.' },
      D: { error: '8 and 6 are not equal.', remediation: 'Look for two identical addends: 7 + 7 = 14.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Arrays & Repeated Addition', subtopic_id: 363,
    question_text: 'An array has 3 rows of apples. Each row has 4 apples. How many apples are there in total?',
    option_a: '12', option_b: '7', option_c: '15', option_d: '10',
    correct_answer: 'A',
    explanation: 'Use repeated addition for 3 rows of 4: 4 + 4 + 4 = 12 apples.',
    distractor_diagnostics: {
      B: { error: 'The student added 3 + 4.', remediation: 'Add 4 three times: 4 + 4 + 4 = 12.' },
      C: { error: 'The student counted an extra row of 4 (12 + 3).', remediation: '3 rows of 4 is 4 + 4 + 4 = 12.' },
      D: { error: 'The student miscalculated.', remediation: '4 + 4 = 8, and 8 + 4 = 12.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Arrays & Repeated Addition', subtopic_id: 363,
    question_text: 'Which repeated addition equation matches an array with 4 rows and 2 dots in each row?',
    option_a: '2 + 2 + 2 + 2 = 8', option_b: '4 + 2 = 6', option_c: '4 + 4 = 8', option_d: '2 + 4 + 2 = 8',
    correct_answer: 'A',
    explanation: '4 rows with 2 dots each means adding 2 four times: 2 + 2 + 2 + 2 = 8.',
    distractor_diagnostics: {
      B: { error: 'The student added the row count to the dot count.', remediation: 'Add the items in each row (2) for every row (4 times): 2 + 2 + 2 + 2 = 8.' },
      C: { error: 'This represents 2 rows of 4.', remediation: '4 rows of 2 is written as 2 + 2 + 2 + 2 = 8.' },
      D: { error: 'This is not standard repeated addition.', remediation: 'Write 2 four times: 2 + 2 + 2 + 2 = 8.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'Oliver has 46 pennies. He spends 14 pennies. How many pennies does he have left?',
    option_a: '32', option_b: '60', option_c: '34', option_d: '22',
    correct_answer: 'A',
    explanation: 'Subtract: 46 - 14 = (40 - 10) + (6 - 4) = 30 + 2 = 32 pennies.',
    distractor_diagnostics: {
      B: { error: 'The student added 46 + 14.', remediation: '"Spends" means take away: 46 - 14 = 32.' },
      C: { error: 'The student miscalculated the ones digit.', remediation: '6 - 4 = 2, so 46 - 14 = 32.' },
      D: { error: 'The student subtracted 20 instead of 10.', remediation: '4 tens - 1 ten = 3 tens: 32.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Odd & Even Numbers', subtopic_id: 362,
    question_text: 'What happens when you add two even numbers together, like 4 + 6?',
    option_a: 'The sum is always EVEN', option_b: 'The sum is always ODD', option_c: 'The sum is sometimes odd, sometimes even', option_d: 'The sum is zero',
    correct_answer: 'A',
    explanation: 'Adding two even numbers always results in an even number (e.g., 4 + 6 = 10, which is even).',
    distractor_diagnostics: {
      B: { error: 'The student confused even + even with even + odd.', remediation: 'Even + even is always even because both numbers can be split into pairs without leftovers.' },
      C: { error: 'The rule is constant, not variable.', remediation: 'Every pair of even numbers sums to an even number.' },
      D: { error: 'Adding positive numbers does not yield zero.', remediation: 'Even + even = even.' }
    }
  },

  // Medium (9)
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'At the park, there were 34 children. 18 more children arrived. Then 12 children went home. How many children are at the park now?',
    option_a: '40', option_b: '52', option_c: '64', option_d: '28',
    correct_answer: 'A',
    explanation: 'Step 1: 34 + 18 = 52. Step 2: 52 - 12 = 40 children.',
    distractor_diagnostics: {
      B: { error: 'The student did not subtract the 12 children who went home.', remediation: 'Remember the second step: subtract 12 from 52 to get 40.' },
      C: { error: 'The student added all three numbers: 34 + 18 + 12 = 64.', remediation: '"Went home" means subtract: 52 - 12 = 40.' },
      D: { error: 'The student subtracted both numbers from 34.', remediation: 'First add 18, then subtract 12: 34 + 18 = 52, 52 - 12 = 40.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'Farmer Brown had 65 eggs. He sold some eggs at the market. Now he has 28 eggs left. How many eggs did he sell?',
    option_a: '37', option_b: '93', option_c: '47', option_d: '33',
    correct_answer: 'A',
    explanation: 'Subtract the remaining eggs from the starting amount: 65 - 28 = 37 eggs.',
    distractor_diagnostics: {
      B: { error: 'The student added 65 + 28.', remediation: 'Find the difference between what he started with and what is left: 65 - 28 = 37.' },
      C: { error: 'The student subtracted smaller digits from larger digits (6 - 2 = 4, 8 - 5 = 3 -> 43 or 47).', remediation: 'Regroup 65 into 50 + 15: 15 - 8 = 7, and 50 - 20 = 30. Result: 37.' },
      D: { error: 'The student made an error in regrouping.', remediation: '65 - 28 = 37.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Odd & Even Numbers', subtopic_id: 362,
    question_text: 'Ella has 19 marbles. Can she share them equally with her friend with no marbles left over?',
    option_a: 'No, because 19 is an odd number', option_b: 'Yes, because 19 is an even number', option_c: 'Yes, each gets 9 marbles with 0 left', option_d: 'Yes, each gets 10 marbles',
    correct_answer: 'A',
    explanation: '19 ends in 9, making it an odd number. Odd numbers cannot be divided into two equal whole-number groups without a remainder (9 + 9 = 18, 1 left over).',
    distractor_diagnostics: {
      B: { error: '19 is not even.', remediation: 'Numbers ending in 1, 3, 5, 7, 9 are odd and cannot be shared equally between 2 people.' },
      C: { error: '9 + 9 is 18, leaving 1 marble remaining.', remediation: '19 leaves 1 marble leftover, so it cannot be shared equally.' },
      D: { error: '10 + 10 = 20, but Ella only has 19.', remediation: 'Ella cannot give 10 to each because that requires 20.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Arrays & Repeated Addition', subtopic_id: 363,
    question_text: 'Which array has a total of 15 objects?',
    option_a: '3 rows of 5', option_b: '3 rows of 4', option_c: '4 rows of 5', option_d: '2 rows of 7',
    correct_answer: 'A',
    explanation: '3 rows of 5 = 5 + 5 + 5 = 15 objects.',
    distractor_diagnostics: {
      B: { error: '3 rows of 4 is 4 + 4 + 4 = 12.', remediation: 'Check repeated addition: 5 + 5 + 5 = 15.' },
      C: { error: '4 rows of 5 is 20.', remediation: '3 rows of 5 equals 15.' },
      D: { error: '2 rows of 7 is 14.', remediation: '3 rows of 5 = 15.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Arrays & Repeated Addition', subtopic_id: 363,
    question_text: 'An array of stickers has 5 rows and 3 columns. Which two repeated addition equations represent this array?',
    option_a: '3 + 3 + 3 + 3 + 3 = 15  and  5 + 5 + 5 = 15', option_b: '5 + 3 = 8  and  3 + 5 = 8', option_c: '5 + 5 + 5 + 5 + 5 = 25  and  3 + 3 + 3 = 9', option_d: '3 + 3 + 3 = 9  and  5 + 5 = 10',
    correct_answer: 'A',
    explanation: 'By rows: 5 rows of 3 = 3 + 3 + 3 + 3 + 3 = 15. By columns: 3 columns of 5 = 5 + 5 + 5 = 15.',
    distractor_diagnostics: {
      B: { error: 'The student added 5 + 3.', remediation: 'Arrays use repeated addition: 5 groups of 3 or 3 groups of 5.' },
      C: { error: 'The student changed the dimensions.', remediation: '5 rows of 3 gives 15 stickers total.' },
      D: { error: 'The student wrote incomplete sums.', remediation: 'Both repeated additions must total 15: 3+3+3+3+3 = 15 and 5+5+5 = 15.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'Chloe had some stickers. She gave 24 stickers to her brother. Now she has 39 stickers left. How many stickers did Chloe have to begin with?',
    option_a: '63', option_b: '15', option_c: '53', option_d: '62',
    correct_answer: 'A',
    explanation: 'Start unknown: ? - 24 = 39. Add to find the start: 39 + 24 = 63 stickers.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 39 - 24.', remediation: 'Chloe started with more stickers before giving some away: add 39 + 24 = 63.' },
      C: { error: 'The student forgot to regroup 9 + 4 = 13.', remediation: '39 + 24 = 30 + 20 + 13 = 63.' },
      D: { error: 'The student miscalculated by 1.', remediation: '39 + 24 = 63.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Odd & Even Numbers', subtopic_id: 362,
    question_text: 'Which statement is TRUE about the sum of an ODD number and an EVEN number (for example, 5 + 4)?',
    option_a: 'The sum is always ODD', option_b: 'The sum is always EVEN', option_c: 'The sum is always 10', option_d: 'The sum is always a multiple of 4',
    correct_answer: 'A',
    explanation: 'An even number pairs up completely, but an odd number always has 1 left over. When added, that 1 remains unpaired, so the sum is always odd (e.g., 5 + 4 = 9).',
    distractor_diagnostics: {
      B: { error: 'Odd + even is never even.', remediation: 'Try examples: 3 + 2 = 5 (odd), 7 + 4 = 11 (odd). Odd + even = odd.' },
      C: { error: 'The sum depends on the numbers chosen.', remediation: '5 + 4 = 9, not 10.' },
      D: { error: '9 is not a multiple of 4.', remediation: 'Odd + even is always an odd number.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'Liam scored 47 points in a game. Noah scored 19 fewer points than Liam. How many points did Noah score?',
    option_a: '28', option_b: '66', option_c: '38', option_d: '26',
    correct_answer: 'A',
    explanation: 'Subtract: 47 - 19 = 28 points.',
    distractor_diagnostics: {
      B: { error: 'The student added 47 + 19.', remediation: '"Fewer than" means subtract: 47 - 19 = 28.' },
      C: { error: 'The student subtracted digits incorrectly (9 - 7 = 2, 4 - 1 = 3).', remediation: 'Regroup: 17 - 9 = 8, and 30 - 10 = 20. Total = 28.' },
      D: { error: 'The student made an arithmetic error.', remediation: '47 - 19 = 28.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Arrays & Repeated Addition', subtopic_id: 363,
    question_text: 'Mason baked cookies and placed them in 4 rows with 5 cookies in each row. Which equation shows the total number of cookies?',
    option_a: '5 + 5 + 5 + 5 = 20', option_b: '4 + 5 = 9', option_c: '4 + 4 + 4 + 4 = 16', option_d: '5 + 5 + 5 = 15',
    correct_answer: 'A',
    explanation: '4 rows of 5 cookies means adding 5 four times: 5 + 5 + 5 + 5 = 20 cookies.',
    distractor_diagnostics: {
      B: { error: 'The student added the two dimensions.', remediation: 'Multiply rows by cookies per row: 4 × 5 = 20 (or 5 + 5 + 5 + 5 = 20).' },
      C: { error: 'This is 4 rows of 4.', remediation: 'Each row has 5 cookies: add 5 four times.' },
      D: { error: 'This is only 3 rows of 5.', remediation: 'There are 4 rows: 5 + 5 + 5 + 5 = 20.' }
    }
  },

  // High (8)
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'A bakery had 82 muffins in the morning. They sold 37 muffins by noon and 26 muffins in the afternoon. How many muffins were left at the end of the day?',
    option_a: '19', option_b: '29', option_c: '45', option_d: '119',
    correct_answer: 'A',
    explanation: 'Total sold = 37 + 26 = 63 muffins. Muffins left = 82 - 63 = 19 muffins.',
    distractor_diagnostics: {
      B: { error: 'The student miscalculated 82 - 63.', remediation: '82 - 63: 12 - 3 = 9, 7 - 6 = 1. Answer: 19.' },
      C: { error: 'The student only subtracted the first batch (82 - 37 = 45).', remediation: 'Don\'t forget to also subtract the 26 afternoon muffins: 45 - 26 = 19.' },
      D: { error: 'The student added all numbers.', remediation: 'Muffins are sold, so subtract from 82: 82 - 37 - 26 = 19.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'Ben has 35 baseball cards. Jack has 18 more cards than Ben. How many baseball cards do Ben and Jack have TOGETHER?',
    option_a: '88', option_b: '53', option_c: '71', option_d: '85',
    correct_answer: 'A',
    explanation: 'Jack\'s cards = 35 + 18 = 53 cards. Together = Ben + Jack = 35 + 53 = 88 cards.',
    distractor_diagnostics: {
      B: { error: 'The student found only Jack\'s cards (53) without adding Ben\'s cards.', remediation: 'The problem asks for both together: add Ben\'s 35 + Jack\'s 53 = 88 cards.' },
      C: { error: 'The student added 35 + 18 + 18.', remediation: 'Jack has 35 + 18 = 53 cards. Together they have 35 + 53 = 88 cards.' },
      D: { error: 'The student miscalculated the addition.', remediation: '35 + 53 = 88.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Odd & Even Numbers', subtopic_id: 362,
    question_text: 'Lucas writes down three numbers: 12, 17, and 24. He wants to know: what will be the result if he adds all three numbers together?',
    option_a: 'ODD, because even + odd + even = odd', option_b: 'EVEN, because two numbers are even', option_c: 'ODD, because all three numbers are odd', option_d: 'EVEN, because the sum ends in 0',
    correct_answer: 'A',
    explanation: '12 + 24 = 36 (even). Then 36 (even) + 17 (odd) = 53 (odd). An even sum plus an odd number is always odd.',
    distractor_diagnostics: {
      B: { error: 'The student thought having more even numbers makes the sum even.', remediation: 'The single odd number (17) leaves 1 unpaired, making the total sum (53) odd.' },
      C: { error: '12 and 24 are even numbers, not odd.', remediation: '12 and 24 are even; only 17 is odd.' },
      D: { error: '12 + 17 + 24 = 53, which ends in 3, not 0.', remediation: '53 ends in 3, which is an odd number.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Arrays & Repeated Addition', subtopic_id: 363,
    question_text: 'A grid of squares has 4 rows and 5 columns. If 1 row is completely removed, what is the repeated addition equation for the remaining squares?',
    option_a: '5 + 5 + 5 = 15', option_b: '4 + 4 + 4 + 4 = 16', option_c: '5 + 5 + 5 + 5 = 20', option_d: '3 + 5 = 8',
    correct_answer: 'A',
    explanation: 'Originally 4 rows of 5. Removing 1 row leaves 3 rows of 5 columns: 5 + 5 + 5 = 15 squares.',
    distractor_diagnostics: {
      B: { error: 'This represents 4 rows of 4.', remediation: 'Each remaining row still has 5 columns: 5 + 5 + 5 = 15.' },
      C: { error: 'This is the original grid before removing a row.', remediation: 'One row was removed, leaving 3 rows: 5 + 5 + 5 = 15.' },
      D: { error: 'The student added row and column numbers.', remediation: 'Repeated addition of 3 rows of 5 is 5 + 5 + 5 = 15.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'In a school library, there are 94 mystery books. 48 are checked out on Monday, and 15 of those are returned on Tuesday. How many mystery books are in the library on Tuesday afternoon?',
    option_a: '61', option_b: '46', option_c: '31', option_d: '76',
    correct_answer: 'A',
    explanation: 'Step 1 (after Monday): 94 - 48 = 46 books in library. Step 2 (after Tuesday returns): 46 + 15 = 61 books.',
    distractor_diagnostics: {
      B: { error: 'The student stopped after Monday\'s checkout (94 - 48 = 46).', remediation: 'Remember that 15 books were returned: 46 + 15 = 61.' },
      C: { error: 'The student subtracted 15 instead of adding.', remediation: 'Returned books go back into the library, so add 15: 46 + 15 = 61.' },
      D: { error: 'The student made an arithmetic error.', remediation: '94 - 48 = 46, and 46 + 15 = 61.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Odd & Even Numbers', subtopic_id: 362,
    question_text: 'Which expression always results in an EVEN number for ANY whole number n?',
    option_a: 'n + n', option_b: 'n + 1', option_c: 'n + 3', option_d: 'n - 1',
    correct_answer: 'A',
    explanation: 'n + n = 2n, which means doubling n. Doubling any whole number always produces an even number.',
    distractor_diagnostics: {
      B: { error: 'If n = 2, n + 1 = 3 (odd).', remediation: 'Adding 1 changes an even number into an odd number.' },
      C: { error: 'If n = 4, n + 3 = 7 (odd).', remediation: 'Adding 3 to an even number gives an odd number.' },
      D: { error: 'If n = 4, n - 1 = 3 (odd).', remediation: 'Only n + n (doubling) guarantees an even result every time.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Arrays & Repeated Addition', subtopic_id: 363,
    question_text: 'Sophie has 24 tiles. Which arrangement CANNOT form a rectangular array with no tiles left over?',
    option_a: '5 rows of 5', option_b: '4 rows of 6', option_c: '3 rows of 8', option_d: '2 rows of 12',
    correct_answer: 'A',
    explanation: '5 rows of 5 requires 25 tiles (5 + 5 + 5 + 5 + 5 = 25). Sophie only has 24 tiles, so she cannot make 5 rows of 5.',
    distractor_diagnostics: {
      B: { error: '4 rows of 6 = 24 tiles (valid array).', remediation: '4 × 6 = 24, which uses exactly 24 tiles.' },
      C: { error: '3 rows of 8 = 24 tiles (valid array).', remediation: '3 × 8 = 24, which uses exactly 24 tiles.' },
      D: { error: '2 rows of 12 = 24 tiles (valid array).', remediation: '2 × 12 = 24, which uses exactly 24 tiles.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Addition & Subtraction Word Problems', subtopic_id: 191,
    question_text: 'Grace had $75. She bought a dress for $38 and a hat for $19. How much money did Grace have left?',
    option_a: '$18', option_b: '$28', option_c: '$57', option_d: '$19',
    correct_answer: 'A',
    explanation: 'Total spent = $38 + $19 = $57. Money left = $75 - $57 = $18.',
    distractor_diagnostics: {
      B: { error: 'The student miscalculated 75 - 57.', remediation: '75 - 57 = 15 - 7 = 8, 60 - 50 = 10 -> $18.' },
      C: { error: 'The student calculated the total spent ($57) without subtracting from $75.', remediation: 'Subtract the total spent ($57) from Grace\'s initial $75: $75 - $57 = $18.' },
      D: { error: 'The student guessed $19.', remediation: '$75 - ($38 + $19) = $75 - $57 = $18.' }
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

  const allQuestions = [...g1Questions, ...g2Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 1 & Grade 2 Algebra...`);

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

  console.log(`Grade 1 & 2 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
