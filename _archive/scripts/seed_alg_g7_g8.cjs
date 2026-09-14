const mysql = require('mysql2/promise');
require('dotenv').config();

const g7Questions = [
  // Low (8)
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'Simplify the linear expression:  (3x + 5) + (2x - 1)',
    option_a: '5x + 4', option_b: '5x + 6', option_c: '6x + 4', option_d: '5x - 4',
    correct_answer: 'A',
    explanation: 'Combine like terms: 3x + 2x = 5x, and 5 + (-1) = 5 - 1 = 4. The simplified expression is 5x + 4.',
    distractor_diagnostics: {
      B: { error: 'The student added 5 + 1 instead of 5 - 1.', remediation: 'Pay close attention to signs: 5 + (-1) = 4.' },
      C: { error: 'The student multiplied 3 × 2 = 6x.', remediation: 'When adding polynomials, add coefficients: 3 + 2 = 5.' },
      D: { error: 'The student used a minus sign for 4.', remediation: '5 - 1 = +4.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'Solve the two-step equation:  3x + 7 = 22',
    option_a: '5', option_b: '10', option_c: '15', option_d: '9',
    correct_answer: 'A',
    explanation: 'Step 1: Subtract 7 from both sides: 3x = 22 - 7 = 15. Step 2: Divide by 3: x = 15 ÷ 3 = 5.',
    distractor_diagnostics: {
      B: { error: 'The student added 7 instead of subtracting (3x = 29 -> ~10).', remediation: 'Subtract 7 first: 22 - 7 = 15, then divide by 3: x = 5.' },
      C: { error: '15 is the value of 3x, not x.', remediation: 'Divide 15 by 3 to isolate x: x = 5.' },
      D: { error: 'The student made an arithmetic error.', remediation: '3x = 15, so x = 5.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Word Problems & Applications', subtopic_id: 205,
    question_text: 'Solve the inequality:  x + 8 > 15',
    option_a: 'x > 7', option_b: 'x < 7', option_c: 'x > 23', option_d: 'x ≥ 7',
    correct_answer: 'A',
    explanation: 'Subtract 8 from both sides: x > 15 - 8 -> x > 7.',
    distractor_diagnostics: {
      B: { error: 'The student flipped the inequality sign.', remediation: 'Subtracting a number from both sides does not flip the inequality sign: x > 7.' },
      C: { error: 'The student added 15 + 8 = 23.', remediation: 'Subtract 8 from 15: 15 - 8 = 7.' },
      D: { error: 'The student changed > to ≥.', remediation: 'Keep the original strict inequality: x > 7.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'Expand the expression using the distributive property:  -4(2x - 3)',
    option_a: '-8x + 12', option_b: '-8x - 12', option_c: '-8x - 3', option_d: '8x - 12',
    correct_answer: 'A',
    explanation: 'Multiply -4 by both terms: (-4)(2x) + (-4)(-3) = -8x + 12.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied -4 by -3 and wrote -12.', remediation: 'Negative times negative is positive: (-4) × (-3) = +12.' },
      C: { error: 'The student forgot to multiply -4 by -3.', remediation: 'Distribute -4 to both terms: -4 × 2x = -8x, and -4 × -3 = +12.' },
      D: { error: 'The student forgot the negative sign on the first term.', remediation: '-4 × 2x = -8x.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'Solve for y:  2(y + 4) = 18',
    option_a: '5', option_b: '7', option_c: '9', option_d: '13',
    correct_answer: 'A',
    explanation: 'Divide by 2: y + 4 = 9. Subtract 4: y = 9 - 4 = 5. (Or expand: 2y + 8 = 18 -> 2y = 10 -> y = 5).',
    distractor_diagnostics: {
      B: { error: 'The student made an arithmetic error.', remediation: '2y + 8 = 18 -> 2y = 10 -> y = 5.' },
      C: { error: '9 is the value of y + 4, not y.', remediation: 'Subtract 4 from 9: y = 5.' },
      D: { error: 'The student subtracted 18 - 5.', remediation: 'y + 4 = 9, so y = 5.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'Factor the linear expression:  14x - 21',
    option_a: '7(2x - 3)', option_b: '7(2x + 3)', option_c: '14(x - 3)', option_d: '7(2x - 21)',
    correct_answer: 'A',
    explanation: 'The GCF of 14 and 21 is 7. Factoring out 7: 14x ÷ 7 = 2x, -21 ÷ 7 = -3. Result: 7(2x - 3).',
    distractor_diagnostics: {
      B: { error: 'The student changed the minus sign to plus.', remediation: 'Keep the original minus sign: 7(2x - 3).' },
      C: { error: '14 is not a factor of 21.', remediation: 'The greatest common factor is 7: 7(2x - 3).' },
      D: { error: 'The student forgot to divide 21 by 7.', remediation: 'Divide both terms by 7: 21 ÷ 7 = 3.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Two-Variable Equations', subtopic_id: 204,
    question_text: 'A taxi charges a flat fee of $3.00 plus $2.00 per mile m. Which equation gives the total cost C?',
    option_a: 'C = 2m + 3', option_b: 'C = 3m + 2', option_c: 'C = 5m', option_d: 'C = 2m - 3',
    correct_answer: 'A',
    explanation: 'The rate per mile is 2 (giving 2m) and the initial flat fee is 3: C = 2m + 3.',
    distractor_diagnostics: {
      B: { error: 'The student swapped the rate and the flat fee.', remediation: 'The cost per mile is $2 (so 2m), and flat fee is $3: C = 2m + 3.' },
      C: { error: 'The student combined 2 + 3 = 5m.', remediation: 'The $3 is paid once, not per mile: C = 2m + 3.' },
      D: { error: 'The flat fee is added, not subtracted.', remediation: 'C = 2m + 3.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Word Problems & Applications', subtopic_id: 205,
    question_text: 'Which inequality represents the sentence: "Five less than twice a number x is at most 19"?',
    option_a: '2x - 5 ≤ 19', option_b: '5 - 2x ≤ 19', option_c: '2x - 5 ≥ 19', option_d: '2x - 5 < 19',
    correct_answer: 'A',
    explanation: '"Twice a number x" is 2x. "Five less than" means subtract 5: 2x - 5. "At most 19" means ≤ 19. Expression: 2x - 5 ≤ 19.',
    distractor_diagnostics: {
      B: { error: 'The student wrote "5 less 2x".', remediation: '"Five less than twice x" means start with 2x and subtract 5: 2x - 5.' },
      C: { error: '"At most" means less than or equal to, not greater than or equal to.', remediation: '"At most 19" means cannot exceed 19 (≤ 19).' },
      D: { error: '"At most" includes equality (≤).', remediation: 'Use ≤ for "at most": 2x - 5 ≤ 19.' }
    }
  },

  // Medium (9)
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'Subtract the linear expressions:  (5x - 4) - (8x - 9)',
    option_a: '-3x + 5', option_b: '-3x - 13', option_c: '3x + 5', option_d: '-3x - 5',
    correct_answer: 'A',
    explanation: 'Distribute the minus sign: (5x - 4) - 8x + 9. Combine like terms: 5x - 8x = -3x, and -4 + 9 = 5. Result: -3x + 5.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to distribute the negative to -9 (-4 - 9 = -13).', remediation: 'Subtracting -9 becomes addition: -4 - (-9) = -4 + 9 = 5.' },
      C: { error: '5x - 8x is -3x, not +3x.', remediation: '5 - 8 = -3, so -3x + 5.' },
      D: { error: 'The student wrote -5.', remediation: '-4 + 9 = +5.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'Solve the equation with rational numbers:  (1/2)x - 4 = 7',
    option_a: '22', option_b: '6', option_c: '15', option_d: '11',
    correct_answer: 'A',
    explanation: 'Step 1: Add 4 to both sides: (1/2)x = 7 + 4 = 11. Step 2: Multiply by 2: x = 11 × 2 = 22.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 4 from 7 = 3, then multiplied by 2 = 6.', remediation: 'Add 4 to both sides: 7 + 4 = 11, then 11 × 2 = 22.' },
      C: { error: 'The student added 4 to 11.', remediation: 'Multiply by 2 to clear the fraction 1/2: x = 22.' },
      D: { error: '11 is the value of (1/2)x, not x.', remediation: 'Multiply 11 by 2 to find x: x = 22.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Word Problems & Applications', subtopic_id: 205,
    question_text: 'Solve the inequality:  -3x + 7 < 22',
    option_a: 'x > -5', option_b: 'x < -5', option_c: 'x > 5', option_d: 'x < 5',
    correct_answer: 'A',
    explanation: 'Subtract 7: -3x < 15. Divide by -3 and REVERSE the inequality sign: x > 15 / (-3) -> x > -5.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to reverse the inequality sign when dividing by -3.', remediation: 'Rule: Whenever you multiply or divide an inequality by a negative number, flip the sign (< becomes >).' },
      C: { error: '15 / (-3) is -5, not +5.', remediation: 'A positive divided by a negative is negative: -5, so x > -5.' },
      D: { error: 'The student forgot the negative sign and didn\'t flip.', remediation: 'Flip the inequality sign and calculate 15 / -3 = -5: x > -5.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'A jacket originally priced at p dollars is on sale for 25% off. Which expression represents the sale price of the jacket?',
    option_a: '0.75p', option_b: '0.25p', option_c: 'p - 0.25', option_d: '1.25p',
    correct_answer: 'A',
    explanation: 'The discount is 0.25p. Sale price = p - 0.25p = 1.00p - 0.25p = 0.75p.',
    distractor_diagnostics: {
      B: { error: '0.25p is the amount of the discount, not the final sale price.', remediation: 'Subtract the discount from the original: p - 0.25p = 0.75p.' },
      C: { error: '25% must be multiplied by p, not subtracted as a flat 25 cents.', remediation: '25% of p is 0.25p, so price is p - 0.25p = 0.75p.' },
      D: { error: '1.25p represents a 25% price increase (markup).', remediation: 'A discount lowers the price: 0.75p.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'Solve for k:  -4(k - 3) = 28',
    option_a: '-4', option_b: '10', option_c: '4', option_d: '-10',
    correct_answer: 'A',
    explanation: 'Divide both sides by -4: k - 3 = 28 / (-4) = -7. Add 3: k = -7 + 3 = -4.',
    distractor_diagnostics: {
      B: { error: 'The student divided 28 / 4 = 7 and added 3 = 10, ignoring the negative.', remediation: 'Divide by -4: 28 / (-4) = -7. Then -7 + 3 = -4.' },
      C: { error: 'The student got the opposite sign.', remediation: 'k = -7 + 3 = -4.' },
      D: { error: 'The student subtracted 3 from -7.', remediation: 'To cancel -3, add 3: -7 + 3 = -4.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Two-Variable Equations', subtopic_id: 204,
    question_text: 'A plumber charges a $45 service call fee plus $30 for each hour worked. If a customer was billed $195, how many hours h did the plumber work?',
    option_a: '5 hours', option_b: '4 hours', option_c: '6.5 hours', option_d: '8 hours',
    correct_answer: 'A',
    explanation: 'Equation: 30h + 45 = 195. Subtract 45: 30h = 150. Divide by 30: h = 150 ÷ 30 = 5 hours.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 45 and made a division error.', remediation: '195 - 45 = 150. 150 / 30 = 5 hours.' },
      C: { error: 'The student divided 195 by 30 without subtracting 45.', remediation: 'Subtract the flat $45 fee first: 195 - 45 = 150, then 150 / 30 = 5.' },
      D: { error: 'The student made an arithmetic error.', remediation: 'h = 5 hours.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Word Problems & Applications', subtopic_id: 205,
    question_text: 'Maya has $60 to spend at a carnival. Admission is $12, and each game ticket costs $2.50. What is the maximum number of game tickets (t) Maya can buy?',
    option_a: '19 tickets', option_b: '24 tickets', option_c: '20 tickets', option_d: '18 tickets',
    correct_answer: 'A',
    explanation: 'Inequality: 2.50t + 12 ≤ 60. Subtract 12: 2.50t ≤ 48. Divide: t ≤ 48 ÷ 2.50 = 19.2. Since tickets are whole numbers: maximum 19 tickets.',
    distractor_diagnostics: {
      B: { error: 'The student divided 60 by 2.50 without subtracting admission.', remediation: 'Subtract admission first: 60 - 12 = 48. 48 / 2.50 = 19.2 -> 19 tickets.' },
      C: { error: 'The student rounded up to 20, which would cost $12 + 20(2.50) = $62 (exceeds budget).', remediation: 'You cannot spend more than $60, so round down: 19 tickets.' },
      D: { error: '18 tickets is less than the maximum possible.', remediation: '19 tickets cost 12 + 47.50 = $59.50 ≤ $60.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'Which expression is equivalent to:  0.4(5x - 10) + 1.2x?',
    option_a: '3.2x - 4', option_b: '3.2x - 10', option_c: '2x - 4', option_d: '2x - 2.8',
    correct_answer: 'A',
    explanation: 'Distribute: 0.4(5x) - 0.4(10) = 2x - 4. Combine with 1.2x: 2x + 1.2x - 4 = 3.2x - 4.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to multiply 0.4 by -10.', remediation: '0.4 × (-10) = -4, so the constant term is -4: 3.2x - 4.' },
      C: { error: 'The student forgot to add the 1.2x term.', remediation: 'Combine 2x + 1.2x = 3.2x.' },
      D: { error: 'The student added 1.2 to -4.', remediation: '1.2x has a variable and cannot be added to the constant -4.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'Solve for m:  (m - 5) / 4 = -3',
    option_a: '-7', option_b: '-17', option_c: '7', option_d: '-12',
    correct_answer: 'A',
    explanation: 'Multiply both sides by 4: m - 5 = -12. Add 5: m = -12 + 5 = -7.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 5 from -12: -12 - 5 = -17.', remediation: 'Add 5 to both sides to cancel -5: m = -12 + 5 = -7.' },
      C: { error: 'The student got the opposite sign.', remediation: '-12 + 5 = -7.' },
      D: { error: '-12 is the value of m - 5, not m.', remediation: 'Add 5 to -12 to find m: m = -7.' }
    }
  },

  // High (8)
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'Solve the equation with fractions:  (2/5)x + (1/3) = (7/15)',
    option_a: '1/3', option_b: '1/5', option_c: '2/3', option_d: '5/6',
    correct_answer: 'A',
    explanation: 'Multiply entire equation by LCD 15: 15(2/5)x + 15(1/3) = 15(7/15) -> 6x + 5 = 7. Subtract 5: 6x = 2. Divide by 6: x = 2/6 = 1/3.',
    distractor_diagnostics: {
      B: { error: 'The student made an arithmetic error.', remediation: '6x = 7 - 5 = 2 -> x = 2/6 = 1/3.' },
      C: { error: 'The student miscalculated 2/6.', remediation: '2/6 simplifies to 1/3.' },
      D: { error: 'The student added 1/3 to 7/15.', remediation: 'Subtract 1/3: 7/15 - 5/15 = 2/15. (2/15) ÷ (2/5) = 1/3.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'Which expression represents the perimeter of a rectangle with length (3x - 4) and width (2x + 1)?',
    option_a: '10x - 6', option_b: '5x - 3', option_c: '6x² - 5x - 4', option_d: '10x - 3',
    correct_answer: 'A',
    explanation: 'Perimeter = 2(length + width) = 2[(3x - 4) + (2x + 1)] = 2(5x - 3) = 10x - 6.',
    distractor_diagnostics: {
      B: { error: '5x - 3 is the semi-perimeter (length + width) without multiplying by 2.', remediation: 'Perimeter requires 2 × (length + width): 2(5x - 3) = 10x - 6.' },
      C: { error: 'This is the area (length × width), not perimeter.', remediation: 'Perimeter is distance around: 2L + 2W = 10x - 6.' },
      D: { error: 'The student forgot to multiply -3 by 2.', remediation: 'Distribute 2: 2 × (-3) = -6, so 10x - 6.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Word Problems & Applications', subtopic_id: 205,
    question_text: 'Solve the two-step inequality and identify the correct solution set:  -5(2x - 3) ≥ 35',
    option_a: 'x ≤ -2', option_b: 'x ≥ -2', option_c: 'x ≤ 2', option_d: 'x ≥ 2',
    correct_answer: 'A',
    explanation: 'Divide both sides by -5 and FLIP the inequality sign: 2x - 3 ≤ -7. Add 3: 2x ≤ -4. Divide by 2: x ≤ -2.',
    distractor_diagnostics: {
      B: { error: 'The student did not flip the inequality sign when dividing by -5.', remediation: 'Dividing by -5 flips ≥ to ≤: 2x - 3 ≤ -7 -> x ≤ -2.' },
      C: { error: 'The student made a sign error on -4 / 2.', remediation: '-4 / 2 = -2, so x ≤ -2.' },
      D: { error: 'The student both forgot to flip and made a sign error.', remediation: 'Result is x ≤ -2.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'A gym charges an initiation fee plus a monthly rate. Member A paid $155 for 3 months. Member B paid $275 for 6 months. What is the monthly rate and the initiation fee?',
    option_a: 'Monthly rate: $40, Initiation fee: $35', option_b: 'Monthly rate: $35, Initiation fee: $40', option_c: 'Monthly rate: $45, Initiation fee: $20', option_d: 'Monthly rate: $50, Initiation fee: $25',
    correct_answer: 'A',
    explanation: 'Rate = (275 - 155) / (6 - 3) = 120 / 3 = $40/month. Initiation fee = 155 - 3(40) = 155 - 120 = $35.',
    distractor_diagnostics: {
      B: { error: 'The student swapped the monthly rate and initiation fee.', remediation: 'The change in cost over 3 months is $120, so monthly rate is $40, fee is $35.' },
      C: { error: 'Testing 3 months: 3(45) + 20 = 135 + 20 = 155, but for 6 months: 6(45) + 20 = 290 != 275.', remediation: 'Rate = 120 / 3 = 40.' },
      D: { error: 'Testing 3 months: 3(50) + 25 = 175 != 155.', remediation: 'Monthly rate = $40, initiation fee = $35.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'A store marks up the wholesale price of an item w by 40%, and then offers a coupon for $15 off. Which expression represents the final retail price?',
    option_a: '1.40w - 15', option_b: '0.40w - 15', option_c: '1.40(w - 15)', option_d: 'w + 0.40 - 15',
    correct_answer: 'A',
    explanation: 'Marking up by 40% gives w + 0.40w = 1.40w. Then taking $15 off gives 1.40w - 15.',
    distractor_diagnostics: {
      B: { error: '0.40w is only the markup amount, not the whole marked-up price.', remediation: 'Wholesale plus markup is 1.40w. After coupon: 1.40w - 15.' },
      C: { error: 'The coupon is applied AFTER markup, not before.', remediation: 'Markup is applied to w (1.40w), then subtract 15: 1.40w - 15.' },
      D: { error: '40% must be multiplied by w, not added as $0.40.', remediation: '40% markup is 0.40w, so marked up price is 1.40w.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Word Problems & Applications', subtopic_id: 205,
    question_text: 'An elevator has a maximum weight capacity of 1,800 pounds. An operator weighing 180 pounds enters with boxes weighing 45 pounds each. What is the greatest number of boxes (b) that can safely be loaded?',
    option_a: '36 boxes', option_b: '40 boxes', option_c: '35 boxes', option_d: '37 boxes',
    correct_answer: 'A',
    explanation: 'Inequality: 45b + 180 ≤ 1800. Subtract 180: 45b ≤ 1620. Divide by 45: b ≤ 36 boxes.',
    distractor_diagnostics: {
      B: { error: 'The student divided 1800 by 45 without accounting for the operator\'s weight.', remediation: 'Subtract operator\'s weight first: 1800 - 180 = 1620, then 1620 / 45 = 36.' },
      C: { error: '35 boxes is safe, but not the greatest number.', remediation: '45 × 36 = 1620, which exactly matches remaining capacity.' },
      D: { error: '37 boxes would weigh 45(37) + 180 = 1665 + 180 = 1845 > 1800 (unsafe).', remediation: 'Maximum is 36 boxes.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Linear Equations', subtopic_id: 203,
    question_text: 'Solve for x:  0.6x - 1.5 = 0.2x + 2.5',
    option_a: '10', option_b: '5', option_c: '2.5', option_d: '8',
    correct_answer: 'A',
    explanation: 'Subtract 0.2x from both sides: 0.4x - 1.5 = 2.5. Add 1.5: 0.4x = 4.0. Divide: x = 4.0 ÷ 0.4 = 10.',
    distractor_diagnostics: {
      B: { error: 'The student divided 4 by 0.8.', remediation: '0.6x - 0.2x = 0.4x. Then 4 / 0.4 = 10.' },
      C: { error: 'The student made an arithmetic error.', remediation: '0.4x = 4 -> x = 10.' },
      D: { error: 'The student miscalculated.', remediation: '0.4x = 4, so x = 10.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Algebraic Expressions', subtopic_id: 202,
    question_text: 'Which expression is equivalent to:  -(4x - 7) + 3(2 - x)?',
    option_a: '-7x + 13', option_b: '-7x - 1', option_c: '-x + 13', option_d: '-7x + 1',
    correct_answer: 'A',
    explanation: 'Distribute negative: -4x + 7. Distribute 3: 6 - 3x. Combine: (-4x - 3x) + (7 + 6) = -7x + 13.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied -( -7 ) as -7 instead of +7: -7 + 6 = -1.', remediation: 'A negative times -7 is +7: 7 + 6 = 13. Result: -7x + 13.' },
      C: { error: 'The student added 3x instead of subtracting 3x.', remediation: '-4x - 3x = -7x.' },
      D: { error: 'The student subtracted 7 - 6 = 1.', remediation: '7 + 6 = 13.' }
    }
  }
];

const g8Questions = [
  // Low (8)
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Slope', subtopic_id: 207,
    question_text: 'What is the slope m of the line passing through points (0, 0) and (4, 12)?',
    option_a: '3', option_b: '1/3', option_c: '4', option_d: '8',
    correct_answer: 'A',
    explanation: 'Slope m = (y2 - y1) / (x2 - x1) = (12 - 0) / (4 - 0) = 12 / 4 = 3.',
    distractor_diagnostics: {
      B: { error: 'The student inverted the slope formula: run/rise (4/12 = 1/3).', remediation: 'Slope is rise over run: Δy / Δx = 12 / 4 = 3.' },
      C: { error: '4 is the change in x, not the slope.', remediation: 'Divide change in y by change in x: 12 / 4 = 3.' },
      D: { error: 'The student subtracted 12 - 4.', remediation: 'Slope = 12 / 4 = 3.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Slope-Intercept Form', subtopic_id: 209,
    question_text: 'In the linear equation y = -4x + 7, what is the y-intercept of the line?',
    option_a: '(0, 7)', option_b: '(0, -4)', option_c: '(7, 0)', option_d: '(-4, 7)',
    correct_answer: 'A',
    explanation: 'In slope-intercept form y = mx + b, b is the y-intercept. Here b = 7, which corresponds to the point (0, 7).',
    distractor_diagnostics: {
      B: { error: '-4 is the slope m, not the y-intercept.', remediation: 'Slope is m = -4; y-intercept is b = 7 (point (0, 7)).' },
      C: { error: 'The coordinates are inverted.', remediation: 'The y-intercept is on the y-axis where x = 0: (0, 7).' },
      D: { error: 'The student combined slope and intercept into coordinates.', remediation: 'The y-intercept is (0, 7).' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Multi-Step Equations', subtopic_id: 216,
    question_text: 'Solve for x:  5x + 3 = 2x + 18',
    option_a: '5', option_b: '7', option_c: '3', option_d: '15',
    correct_answer: 'A',
    explanation: 'Subtract 2x from both sides: 3x + 3 = 18. Subtract 3: 3x = 15. Divide by 3: x = 5.',
    distractor_diagnostics: {
      B: { error: 'The student added 2x instead of subtracting.', remediation: 'Subtract 2x from 5x to get 3x. 3x = 15 -> x = 5.' },
      C: { error: 'The student made an arithmetic error.', remediation: '3x = 15, so x = 5.' },
      D: { error: '15 is the value of 3x, not x.', remediation: 'Divide 15 by 3 to isolate x: x = 5.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Proportional Relationships & Linear Equations', subtopic_id: 206,
    question_text: 'Which equation represents a proportional relationship?',
    option_a: 'y = 5x', option_b: 'y = 5x + 2', option_c: 'y = 5x - 3', option_d: 'y = x² + 5',
    correct_answer: 'A',
    explanation: 'A proportional relationship has the form y = kx and always passes through the origin (0, 0). Only y = 5x satisfies this.',
    distractor_diagnostics: {
      B: { error: 'This has a y-intercept of 2, so it does not pass through the origin.', remediation: 'Proportional relationships have b = 0: y = kx.' },
      C: { error: 'This has a non-zero y-intercept (-3).', remediation: 'A proportional line passes through (0, 0).' },
      D: { error: 'This is a quadratic equation, not a linear proportional relationship.', remediation: 'Proportional relationships are linear: y = kx.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Functions & Linear Models', subtopic_id: 366,
    question_text: 'Which set of ordered pairs represents a FUNCTION?',
    option_a: '{(1, 2), (2, 4), (3, 6), (4, 8)}', option_b: '{(1, 2), (1, 3), (2, 4), (3, 5)}', option_c: '{(2, 5), (2, 7), (4, 9), (6, 11)}', option_d: '{(0, 1), (0, 2), (0, 3), (0, 4)}',
    correct_answer: 'A',
    explanation: 'A relation is a function if every input (x) has exactly ONE output (y). In option A, each x-value is unique.',
    distractor_diagnostics: {
      B: { error: 'Input 1 has two different outputs (2 and 3), so it is not a function.', remediation: 'A function cannot have the same x paired with different y values.' },
      C: { error: 'Input 2 has two different outputs (5 and 7).', remediation: 'Each input must map to exactly one output.' },
      D: { error: 'Input 0 is mapped to four different outputs.', remediation: 'In a function, x-values cannot repeat with different y-values.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Systems of Linear Equations', subtopic_id: 217,
    question_text: 'What does the intersection point of two lines on a graph represent in a system of linear equations?',
    option_a: 'The unique solution to the system', option_b: 'The y-intercept of both lines', option_c: 'The origin (0, 0)', option_d: 'A point where no solution exists',
    correct_answer: 'A',
    explanation: 'The point of intersection (x, y) satisfies both linear equations simultaneously, making it the solution to the system.',
    distractor_diagnostics: {
      B: { error: 'The intersection does not have to be on the y-axis.', remediation: 'The point where two lines cross is the solution (x, y) to both equations.' },
      C: { error: 'Lines can intersect anywhere on the coordinate plane, not just at (0, 0).', remediation: 'The intersection point is the shared solution.' },
      D: { error: 'No solution occurs when lines are parallel and never intersect.', remediation: 'Intersecting lines have exactly one solution.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Multi-Step Equations', subtopic_id: 216,
    question_text: 'How many solutions does the equation  3x + 6 = 3x + 10  have?',
    option_a: 'No solution', option_b: 'Infinitely many solutions', option_c: 'Exactly one solution (x = 4)', option_d: 'Two solutions',
    correct_answer: 'A',
    explanation: 'Subtract 3x from both sides: 6 = 10. Since 6 is never equal to 10 (a contradiction), there is no solution.',
    distractor_diagnostics: {
      B: { error: 'Infinitely many solutions occur when both sides are completely identical (e.g., 6 = 6).', remediation: 'Here 6 = 10 is false, so there is NO solution.' },
      C: { error: 'The variable x cancels out completely, so x cannot equal 4.', remediation: 'Subtracting 3x leaves 6 = 10 (false), meaning no solution.' },
      D: { error: 'Linear equations in one variable never have exactly two solutions.', remediation: 'Possible solutions are: 0, 1, or infinitely many. Here it is no solution.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Slope', subtopic_id: 207,
    question_text: 'What is the slope of any horizontal line?',
    option_a: '0', option_b: 'Undefined', option_c: '1', option_d: '-1',
    correct_answer: 'A',
    explanation: 'For a horizontal line, the rise (change in y) is 0: slope m = 0 / Δx = 0.',
    distractor_diagnostics: {
      B: { error: 'A vertical line has an undefined slope (division by 0).', remediation: 'Horizontal lines have a flat slope of 0; vertical lines have undefined slope.' },
      C: { error: 'A slope of 1 rises at a 45-degree angle.', remediation: 'A flat horizontal line has slope 0.' },
      D: { error: '-1 slants downward.', remediation: 'Horizontal lines have slope 0.' }
    }
  },

  // Medium (9)
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Multi-Step Equations', subtopic_id: 216,
    question_text: 'Solve for x:  2(3x - 4) = 4x + 10',
    option_a: '9', option_b: '7', option_c: '1', option_d: '5',
    correct_answer: 'A',
    explanation: 'Distribute: 6x - 8 = 4x + 10. Subtract 4x: 2x - 8 = 10. Add 8: 2x = 18. Divide by 2: x = 9.',
    distractor_diagnostics: {
      B: { error: 'The student made an error in adding 10 + 8.', remediation: '2x = 10 + 8 = 18 -> x = 9.' },
      C: { error: 'The student subtracted 10 - 8 instead of adding 8.', remediation: 'Add 8 to cancel -8: 10 + 8 = 18, so x = 9.' },
      D: { error: 'The student made an arithmetic error.', remediation: '6x - 4x = 2x, 10 + 8 = 18, x = 9.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Slope-Intercept Form', subtopic_id: 209,
    question_text: 'What is the equation of the line that has a slope of -3 and passes through the point (2, 5)?',
    option_a: 'y = -3x + 11', option_b: 'y = -3x + 5', option_c: 'y = -3x - 1', option_d: 'y = 3x - 1',
    correct_answer: 'A',
    explanation: 'Use y = mx + b: 5 = -3(2) + b -> 5 = -6 + b -> b = 11. The equation is y = -3x + 11.',
    distractor_diagnostics: {
      B: { error: 'The student used the y-coordinate of the point (5) as the y-intercept.', remediation: 'Substitute (2, 5) into y = mx + b to solve for b: 5 = -3(2) + b -> b = 11.' },
      C: { error: 'The student subtracted 6: 5 - 6 = -1.', remediation: 'To isolate b, add 6 to both sides: 5 + 6 = 11.' },
      D: { error: 'The slope is -3, not +3.', remediation: 'm = -3 and b = 11: y = -3x + 11.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Systems of Linear Equations', subtopic_id: 217,
    question_text: 'Solve the system of equations:  y = 2x + 1  and  y = -x + 7. What is the value of x?',
    option_a: '2', option_b: '3', option_c: '5', option_d: '1',
    correct_answer: 'A',
    explanation: 'Set equations equal: 2x + 1 = -x + 7. Add x: 3x + 1 = 7. Subtract 1: 3x = 6. Divide: x = 2. (Then y = 2(2) + 1 = 5).',
    distractor_diagnostics: {
      B: { error: 'The student made an algebraic error: 3x = 6 gives x = 2, not 3.', remediation: '6 / 3 = 2, so x = 2.' },
      C: { error: '5 is the value of y, not x.', remediation: 'The question asks for x: x = 2 (while y = 5).' },
      D: { error: 'The student miscalculated.', remediation: '2x + x = 7 - 1 -> 3x = 6 -> x = 2.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Functions & Linear Models', subtopic_id: 366,
    question_text: 'Which function is NONLINEAR?',
    option_a: 'y = 4x² - 3', option_b: 'y = 4x - 3', option_c: 'y = -2x', option_d: 'y = (1/2)x + 5',
    correct_answer: 'A',
    explanation: 'A linear function must have the variable x to the first power (y = mx + b). The term 4x² contains an exponent of 2, making it nonlinear (quadratic).',
    distractor_diagnostics: {
      B: { error: 'y = 4x - 3 is linear with slope 4 and y-intercept -3.', remediation: 'A linear equation has x to the 1st power. x² is nonlinear.' },
      C: { error: 'y = -2x is a proportional linear function.', remediation: 'It is a straight line with slope -2.' },
      D: { error: 'y = (1/2)x + 5 is linear with slope 1/2.', remediation: 'Only the x² term creates a curved nonlinear graph.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Slope', subtopic_id: 207,
    question_text: 'Why does the slope of a straight line remain constant between ANY two points chosen on the line?',
    option_a: 'Because the slope triangles formed along the line are similar triangles', option_b: 'Because the x-coordinates are always equal', option_c: 'Because the line always passes through the origin', option_d: 'Because the line is parallel to the x-axis',
    correct_answer: 'A',
    explanation: 'By the properties of similar triangles, the ratio of vertical change to horizontal change (rise/run) is equal for any two slope triangles drawn on the same line.',
    distractor_diagnostics: {
      B: { error: 'x-coordinates change along a non-vertical line.', remediation: 'Constant slope is explained by similar triangles with equal rise/run ratios.' },
      C: { error: 'Lines with non-zero y-intercepts also have constant slope.', remediation: 'The geometric proof relies on similar right triangles.' },
      D: { error: 'Only horizontal lines are parallel to the x-axis.', remediation: 'Similar triangles guarantee constant slope for any straight line.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Multi-Step Equations', subtopic_id: 216,
    question_text: 'Which equation has INFINITELY MANY solutions?',
    option_a: '4(2x - 1) = 8x - 4', option_b: '4(2x - 1) = 8x + 4', option_c: '4(2x - 1) = 6x - 4', option_d: '4(2x - 1) = 8x',
    correct_answer: 'A',
    explanation: 'Expand the left side: 8x - 4. Since both sides are identically 8x - 4, subtracting 8x gives -4 = -4 (always true for all x).',
    distractor_diagnostics: {
      B: { error: '8x - 4 = 8x + 4 gives -4 = 4 (no solution).', remediation: 'Infinitely many solutions require identical expressions on both sides: 8x - 4 = 8x - 4.' },
      C: { error: 'This has one unique solution (8x - 4 = 6x - 4 -> 2x = 0 -> x = 0).', remediation: 'For infinite solutions, the variable coefficients must be equal and constants equal.' },
      D: { error: '8x - 4 = 8x gives -4 = 0 (no solution).', remediation: 'Option A is an identity.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Functions & Linear Models', subtopic_id: 366,
    question_text: 'A candle is 12 inches tall when lit and burns down at a constant rate of 1.5 inches per hour (h). Which linear function models the height H of the candle?',
    option_a: 'H = -1.5h + 12', option_b: 'H = 1.5h + 12', option_c: 'H = 12h - 1.5', option_d: 'H = -1.5h - 12',
    correct_answer: 'A',
    explanation: 'The initial height is 12 (positive y-intercept). Burning down means height decreases, so the rate of change is -1.5: H = -1.5h + 12.',
    distractor_diagnostics: {
      B: { error: 'A positive slope means the candle is growing taller.', remediation: 'Burning decreases height, so slope is negative: -1.5h + 12.' },
      C: { error: 'The student switched the rate and the initial height.', remediation: 'The candle starts at 12 and burns 1.5 per hour: H = -1.5h + 12.' },
      D: { error: 'The initial height is positive (+12), not negative.', remediation: 'Initial height is +12: H = -1.5h + 12.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Systems of Linear Equations', subtopic_id: 217,
    question_text: 'Two lines are defined by  y = 3x - 5  and  y = 3x + 2. How many solutions does this system have?',
    option_a: 'No solution', option_b: 'Exactly one solution', option_c: 'Infinitely many solutions', option_d: 'Two solutions',
    correct_answer: 'A',
    explanation: 'Both lines have the same slope (m = 3) but different y-intercepts (-5 and 2). Therefore, the lines are parallel and will never intersect: no solution.',
    distractor_diagnostics: {
      B: { error: 'Lines with the same slope never cross.', remediation: 'Parallel lines (same slope, different intercepts) never intersect, meaning NO solution.' },
      C: { error: 'Infinitely many solutions require the exact same line (same slope and same intercept).', remediation: 'Since the intercepts are different, the lines are parallel: no solution.' },
      D: { error: 'Linear systems cannot have 2 solutions.', remediation: 'Parallel lines have 0 solutions.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Proportional Relationships & Linear Equations', subtopic_id: 206,
    question_text: 'Car A travels at a rate represented by the equation d = 60t. Car B\'s travel is shown on a graph with points (0, 0) and (2, 130). Which car is traveling faster?',
    option_a: 'Car B is faster (65 mph vs. 60 mph)', option_b: 'Car A is faster (60 mph vs. 50 mph)', option_c: 'Both cars travel at the exact same speed', option_d: 'Car B is traveling at 130 mph',
    correct_answer: 'A',
    explanation: 'Car A speed = 60 mph. Car B speed = 130 ÷ 2 = 65 mph. Since 65 > 60, Car B is faster.',
    distractor_diagnostics: {
      B: { error: 'The student divided 130 / 2 incorrectly.', remediation: '130 / 2 = 65 mph for Car B, which is faster than Car A\'s 60 mph.' },
      C: { error: '65 mph is not equal to 60 mph.', remediation: 'Car B travels 65 miles each hour.' },
      D: { error: '130 miles is the distance in 2 hours, not 1 hour.', remediation: 'Speed is rate per 1 hour: 130 / 2 = 65 mph.' }
    }
  },

  // High (8)
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Systems of Linear Equations', subtopic_id: 217,
    question_text: 'Solve the system of equations using elimination:  3x + 2y = 16   and   5x - 2y = 8. What is the value of y?',
    option_a: '3.5', option_b: '3', option_c: '5', option_d: '2',
    correct_answer: 'A',
    explanation: 'Add the two equations to eliminate y: (3x + 5x) + (2y - 2y) = 16 + 8 -> 8x = 24 -> x = 3. Substitute x = 3 into first equation: 3(3) + 2y = 16 -> 9 + 2y = 16 -> 2y = 7 -> y = 3.5.',
    distractor_diagnostics: {
      B: { error: '3 is the value of x, not y.', remediation: 'The question asks for y: x = 3, so 2y = 7 -> y = 3.5.' },
      C: { error: 'The student miscalculated.', remediation: 'Substitute x = 3: 3(3) + 2y = 16 -> 2y = 7 -> y = 3.5.' },
      D: { error: 'The student made an arithmetic error.', remediation: 'y = 3.5.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Multi-Step Equations', subtopic_id: 216,
    question_text: 'Solve for x:  (1/2)(4x - 6) + 5 = 3(x + 1) - x - 1',
    option_a: 'Infinitely many solutions', option_b: 'No solution', option_c: 'x = 0', option_d: 'x = 2',
    correct_answer: 'A',
    explanation: 'Left side: 2x - 3 + 5 = 2x + 2. Right side: 3x + 3 - x - 1 = 2x + 2. Since 2x + 2 = 2x + 2 is an identity, there are infinitely many solutions.',
    distractor_diagnostics: {
      B: { error: 'The student made a sign error.', remediation: 'Both sides simplify to 2x + 2, which is always true for any real number x.' },
      C: { error: 'x = 0 is a solution, but so is every other number.', remediation: 'Because both sides are identical, there are infinitely many solutions.' },
      D: { error: 'The student solved for a single value.', remediation: '2x + 2 = 2x + 2 has infinitely many solutions.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Functions & Linear Models', subtopic_id: 366,
    question_text: 'A function is represented by the table: (x=1, y=3), (x=2, y=7), (x=3, y=13), (x=4, y=21). Is this function linear or nonlinear, and why?',
    option_a: 'Nonlinear, because the rate of change is not constant (differences are 4, 6, 8)', option_b: 'Linear, because y increases as x increases', option_c: 'Linear, because it has a constant rate of change of 4', option_d: 'Nonlinear, because it passes through negative values',
    correct_answer: 'A',
    explanation: 'First differences in y: 7 - 3 = 4; 13 - 7 = 6; 21 - 13 = 8. Since the rate of change increases, the function is nonlinear (it is quadratic: y = x² + x + 1).',
    distractor_diagnostics: {
      B: { error: 'Increasing values do not guarantee linearity.', remediation: 'Linearity requires a CONSTANT rate of change. Here differences are 4, 6, 8 (nonlinear).' },
      C: { error: 'The rate of change is 4, then 6, then 8 (not constant).', remediation: 'A linear function must have the same difference between consecutive terms.' },
      D: { error: 'All values are positive.', remediation: 'It is nonlinear because the rate of change is not constant.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Systems of Linear Equations', subtopic_id: 217,
    question_text: 'A movie theater sold 300 tickets for a total of $2,300. Student tickets cost $5 each and adult tickets cost $9 each. How many adult tickets (a) were sold?',
    option_a: '200 adult tickets', option_b: '100 adult tickets', option_c: '150 adult tickets', option_d: '250 adult tickets',
    correct_answer: 'A',
    explanation: 'Let s = student, a = adult. (1) s + a = 300 -> s = 300 - a. (2) 5s + 9a = 2300. Substitute: 5(300 - a) + 9a = 2300 -> 1500 + 4a = 2300 -> 4a = 800 -> a = 200 adult tickets.',
    distractor_diagnostics: {
      B: { error: '100 is the number of student tickets (300 - 200 = 100).', remediation: 'The question asks for adult tickets: a = 200.' },
      C: { error: '150 adult tickets would give 150(9) + 150(5) = 1350 + 750 = $2100 != $2300.', remediation: '4a = 800 -> a = 200 adult tickets.' },
      D: { error: '250 adult tickets would exceed the total revenue.', remediation: '200 adult tickets and 100 student tickets.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Slope-Intercept Form', subtopic_id: 209,
    question_text: 'Line L passes through (-2, -5) and (4, 7). What are the coordinates of the x-intercept of Line L?',
    option_a: '(0.5, 0)', option_b: '(0, -1)', option_c: '(1, 0)', option_d: '(-1, 0)',
    correct_answer: 'A',
    explanation: 'Slope m = [7 - (-5)] / [4 - (-2)] = 12 / 6 = 2. Equation: y = 2x + b -> 7 = 2(4) + b -> b = -1. Line: y = 2x - 1. Set y = 0 for x-intercept: 0 = 2x - 1 -> 2x = 1 -> x = 0.5. Point: (0.5, 0).',
    distractor_diagnostics: {
      B: { error: '(0, -1) is the y-intercept, not the x-intercept.', remediation: 'For the x-intercept, set y = 0: 0 = 2x - 1 -> x = 0.5, so (0.5, 0).' },
      C: { error: 'Testing x = 1: y = 2(1) - 1 = 1 != 0.', remediation: '2x - 1 = 0 -> x = 1/2 = 0.5.' },
      D: { error: 'The student made a sign error.', remediation: '2x = 1 -> x = +0.5.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Functions & Linear Models', subtopic_id: 366,
    question_text: 'Function 1 is given by the equation y = 4x - 5. Function 2 is represented by a line passing through (1, 2) and (3, 12). Which function has the GREATER rate of change?',
    option_a: 'Function 2 has the greater rate of change (5 > 4)', option_b: 'Function 1 has the greater rate of change (4 > 3)', option_c: 'Both functions have the exact same rate of change', option_d: 'Function 1 because its y-intercept is negative',
    correct_answer: 'A',
    explanation: 'Function 1 rate of change (slope) = 4. Function 2 slope = (12 - 2) / (3 - 1) = 10 / 2 = 5. Since 5 > 4, Function 2 has the greater rate of change.',
    distractor_diagnostics: {
      B: { error: 'Function 2\'s rate of change is 5, not 3.', remediation: 'Slope of Function 2 is (12 - 2) / 2 = 5, which is greater than 4.' },
      C: { error: '4 is not equal to 5.', remediation: 'Compare slopes: 4 vs 5. 5 is larger.' },
      D: { error: 'y-intercept does not determine rate of change.', remediation: 'Rate of change is determined by the slope (m), not the y-intercept.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Systems of Linear Equations', subtopic_id: 217,
    question_text: 'For what value of k will the system of equations have NO solution?   2x - 3y = 9   and   6x + ky = 15',
    option_a: 'k = -9', option_b: 'k = 9', option_c: 'k = -3', option_d: 'k = 3',
    correct_answer: 'A',
    explanation: 'Multiply the first equation by 3: 6x - 9y = 27. To have parallel lines (no solution), the coefficients of x and y must be proportional: 6x + ky must match 6x - 9y. Thus, k = -9 (and constants 27 != 15 confirms no solution).',
    distractor_diagnostics: {
      B: { error: 'If k = 9, the slopes are different and the lines will intersect in one point.', remediation: 'The y-coefficient must be -9 so both equations have slope 2/3.' },
      C: { error: 'The student did not scale by 3 (from 2x to 6x).', remediation: 'Multiply -3 by 3 to get k = -9.' },
      D: { error: 'If k = 3, slopes are different.', remediation: 'k must equal -9 to create parallel lines.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Proportional Relationships & Linear Equations', subtopic_id: 206,
    question_text: 'A water tank is draining. The relationship between time in minutes m and gallons remaining g is modeled by g = -12m + 360. What is the meaning of the y-intercept (360) and the x-intercept (30) in this context?',
    option_a: '360 gallons is the initial amount of water; 30 minutes is the time it takes for the tank to be completely empty', option_b: '360 minutes is the total draining time; 30 gallons is the initial amount', option_c: 'The tank drains 360 gallons every 30 minutes', option_d: 'The tank holds a maximum of 30 gallons and drains at 360 gallons per minute',
    correct_answer: 'A',
    explanation: 'At m = 0 (y-intercept), g = 360 gallons (starting amount). At g = 0 (x-intercept), 0 = -12m + 360 -> 12m = 360 -> m = 30 minutes (time until tank is completely empty).',
    distractor_diagnostics: {
      B: { error: 'The student reversed the units of the intercepts.', remediation: 'g is gallons (y-intercept: 360 gal), m is minutes (x-intercept: 30 min).' },
      C: { error: 'The draining rate is 12 gallons per minute, not 360 in 30 minutes.', remediation: 'Intercepts represent starting capacity and total drain time.' },
      D: { error: 'The student mixed up all variables.', remediation: 'Start: 360 gallons; Empty after: 30 minutes.' }
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

  const allQuestions = [...g7Questions, ...g8Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 7 & Grade 8 Algebra...`);

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

  console.log(`Grade 7 & 8 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
