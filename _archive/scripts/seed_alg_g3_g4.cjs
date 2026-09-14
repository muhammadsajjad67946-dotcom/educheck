const mysql = require('mysql2/promise');
require('dotenv').config();

const g3Questions = [
  // Low (8)
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'There are 6 baskets. Each basket contains 4 apples. How many apples are there in total?',
    option_a: '24', option_b: '10', option_c: '20', option_d: '28',
    correct_answer: 'A',
    explanation: 'Multiply the number of baskets by apples per basket: 6 × 4 = 24 apples.',
    distractor_diagnostics: {
      B: { error: 'The student added 6 + 4 instead of multiplying.', remediation: 'Equal groups require multiplication: 6 groups of 4 is 6 × 4 = 24.' },
      C: { error: 'The student calculated 5 × 4.', remediation: '6 × 4 = 24.' },
      D: { error: 'The student calculated 7 × 4.', remediation: '6 × 4 = 24.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'A teacher divides 35 pencils equally among 5 students. How many pencils does each student receive?',
    option_a: '7', option_b: '30', option_c: '6', option_d: '8',
    correct_answer: 'A',
    explanation: 'Divide the total pencils by the number of students: 35 ÷ 5 = 7 pencils.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 35 - 5.', remediation: '"Divide equally" means division: 35 ÷ 5 = 7.' },
      C: { error: 'The student miscalculated 35 ÷ 5.', remediation: '5 × 7 = 35, so 35 ÷ 5 = 7.' },
      D: { error: 'The student miscalculated.', remediation: '35 ÷ 5 = 7.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Properties of Multiplication', subtopic_id: 364,
    question_text: 'Which property of multiplication is shown by 7 × 8 = 8 × 7?',
    option_a: 'Commutative Property', option_b: 'Associative Property', option_c: 'Distributive Property', option_d: 'Identity Property',
    correct_answer: 'A',
    explanation: 'The commutative property states that changing the order of the factors does not change the product: a × b = b × a.',
    distractor_diagnostics: {
      B: { error: 'Associative property involves grouping with parentheses (a × b) × c.', remediation: 'Order change of two numbers is the Commutative Property.' },
      C: { error: 'Distributive property involves multiplication across addition: a(b + c).', remediation: 'Flipping the order of factors is the Commutative Property.' },
      D: { error: 'Identity property involves multiplying by 1 (a × 1 = a).', remediation: '7 × 8 = 8 × 7 demonstrates the Commutative Property.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'What is the unknown number that makes this equation true?  ___ × 6 = 42',
    option_a: '7', option_b: '6', option_c: '8', option_d: '36',
    correct_answer: 'A',
    explanation: 'Divide 42 by 6 to find the missing factor: 42 ÷ 6 = 7.',
    distractor_diagnostics: {
      B: { error: '6 × 6 = 36, not 42.', remediation: 'Think: what number multiplied by 6 equals 42? 7 × 6 = 42.' },
      C: { error: '8 × 6 = 48, not 42.', remediation: '42 ÷ 6 = 7.' },
      D: { error: 'The student subtracted 42 - 6.', remediation: 'Find the factor, not the difference: 42 ÷ 6 = 7.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Properties of Multiplication', subtopic_id: 364,
    question_text: 'Any number multiplied by 0 is always equal to what?',
    option_a: '0', option_b: '1', option_c: 'The number itself', option_d: '10',
    correct_answer: 'A',
    explanation: 'By the Zero Property of Multiplication, any number multiplied by 0 is 0 (e.g., 9 × 0 = 0).',
    distractor_diagnostics: {
      B: { error: 'The student confused 0 with 1.', remediation: 'Multiplying by 0 always equals 0.' },
      C: { error: 'The student confused multiplying by 0 with multiplying by 1.', remediation: 'Multiplying by 1 gives the number itself; multiplying by 0 gives 0.' },
      D: { error: 'The student guessed 10.', remediation: 'Any number × 0 = 0.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'Tom has 3 packs of gum. Each pack has 5 sticks. He gives 4 sticks to his sister. How many sticks does Tom have left?',
    option_a: '11', option_b: '15', option_c: '19', option_d: '8',
    correct_answer: 'A',
    explanation: 'Step 1: 3 packs × 5 sticks = 15 sticks. Step 2: 15 - 4 = 11 sticks left.',
    distractor_diagnostics: {
      B: { error: 'The student calculated the total sticks (15) without subtracting the 4 given away.', remediation: 'Subtract the 4 sticks given to sister: 15 - 4 = 11.' },
      C: { error: 'The student added 4 instead of subtracting: 15 + 4 = 19.', remediation: '"Gives away" means subtract: 15 - 4 = 11.' },
      D: { error: 'The student added 3 + 5 then subtracted 4.', remediation: 'Multiply packs by sticks first: 3 × 5 = 15, then 15 - 4 = 11.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'Look at the pattern: 3, 6, 9, 12, 15, ___. What is the next number?',
    option_a: '18', option_b: '16', option_c: '20', option_d: '17',
    correct_answer: 'A',
    explanation: 'The pattern increases by adding 3 (multiples of 3): 15 + 3 = 18.',
    distractor_diagnostics: {
      B: { error: 'The student added 1.', remediation: 'Identify the rule: add 3 each time. 15 + 3 = 18.' },
      C: { error: 'The student added 5.', remediation: 'Keep the constant step of +3: 15 + 3 = 18.' },
      D: { error: 'The student added 2.', remediation: '15 + 3 = 18.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'Which division equation is in the same fact family as 4 × 9 = 36?',
    option_a: '36 ÷ 4 = 9', option_b: '36 ÷ 6 = 6', option_c: '40 ÷ 4 = 10', option_d: '36 - 9 = 27',
    correct_answer: 'A',
    explanation: 'The fact family for 4, 9, 36 includes: 4 × 9 = 36, 9 × 4 = 36, 36 ÷ 4 = 9, and 36 ÷ 9 = 4.',
    distractor_diagnostics: {
      B: { error: 'This fact uses different numbers (6 × 6 = 36).', remediation: 'Use the same numbers from the multiplication fact (4, 9, 36): 36 ÷ 4 = 9.' },
      C: { error: 'This uses 40 and 10.', remediation: 'A fact family contains the same set of numbers: 36 ÷ 4 = 9.' },
      D: { error: 'This is subtraction, not division.', remediation: 'The inverse operation of multiplication is division: 36 ÷ 4 = 9.' }
    }
  },

  // Medium (9)
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Properties of Multiplication', subtopic_id: 364,
    question_text: 'Which expression demonstrates the DISTRIBUTIVE property to solve 6 × 14?',
    option_a: '(6 × 10) + (6 × 4)', option_b: '6 × (10 × 4)', option_c: '(6 + 10) × (6 + 4)', option_d: '14 × 6',
    correct_answer: 'A',
    explanation: 'Break 14 into 10 + 4: 6 × (10 + 4) = (6 × 10) + (6 × 4) = 60 + 24 = 84.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied inside the parentheses (10 × 4 = 40, not 14).', remediation: '14 is broken into addition (10 + 4), so distribute: (6 × 10) + (6 × 4).' },
      C: { error: 'The student added 6 to both parts instead of multiplying.', remediation: 'Multiply 6 by each part: (6 × 10) + (6 × 4).' },
      D: { error: 'This demonstrates the Commutative Property.', remediation: 'The Distributive Property breaks an addend apart: 6 × (10 + 4) = (6 × 10) + (6 × 4).' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'Sarah bought 4 boxes of markers. Each box had 8 markers. She gave away 12 markers. Which equation can be used to find m, the number of markers she has left?',
    option_a: 'm = (4 × 8) - 12', option_b: 'm = (4 + 8) - 12', option_c: 'm = (4 × 8) + 12', option_d: 'm = 4 × (8 - 12)',
    correct_answer: 'A',
    explanation: 'First find total markers: 4 × 8. Then subtract the 12 given away: m = (4 × 8) - 12.',
    distractor_diagnostics: {
      B: { error: 'The student added 4 + 8 instead of multiplying.', remediation: '4 boxes of 8 markers means 4 × 8 = 32 markers.' },
      C: { error: 'The student added 12 instead of subtracting.', remediation: '"Gave away" means subtract: m = (4 × 8) - 12.' },
      D: { error: 'The student placed parentheses incorrectly.', remediation: 'Multiply 4 × 8 first, then subtract 12.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'Which number makes the equation true?  (4 × 2) × 5 = 4 × (___ × 5)',
    option_a: '2', option_b: '8', option_c: '10', option_d: '4',
    correct_answer: 'A',
    explanation: 'By the Associative Property of Multiplication, grouping does not change the product: (4 × 2) × 5 = 4 × (2 × 5). The missing number is 2.',
    distractor_diagnostics: {
      B: { error: 'The student evaluated 4 × 2 = 8 and put 8 in the blank.', remediation: 'The associative property keeps the numbers the same: (a × b) × c = a × (b × c). Here b is 2.' },
      C: { error: 'The student multiplied 2 × 5 = 10.', remediation: 'The missing factor inside the parentheses is 2.' },
      D: { error: 'The student repeated 4.', remediation: 'The factor paired with 5 is 2.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'A farmer has 5 rows of apple trees with 6 trees in each row. He also has 15 peach trees. How many fruit trees does the farmer have in all?',
    option_a: '45', option_b: '30', option_c: '35', option_d: '60',
    correct_answer: 'A',
    explanation: 'Apple trees = 5 × 6 = 30. Total trees = 30 + 15 = 45 fruit trees.',
    distractor_diagnostics: {
      B: { error: 'The student calculated only apple trees (5 × 6 = 30).', remediation: 'Add the 15 peach trees: 30 + 15 = 45.' },
      C: { error: 'The student added 5 + 6 + 15.', remediation: 'Multiply rows by trees first: 5 × 6 = 30, then 30 + 15 = 45.' },
      D: { error: 'The student made an addition error.', remediation: '30 + 15 = 45.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'In the multiplication table, every multiple of 9 has a special digit sum pattern. What is the sum of the digits for 9 × 4 = 36?',
    option_a: '9 (because 3 + 6 = 9)', option_b: '10', option_c: '7', option_d: '8',
    correct_answer: 'A',
    explanation: 'For single-digit multiples of 9, the sum of the digits is always 9: 3 + 6 = 9.',
    distractor_diagnostics: {
      B: { error: 'The student added incorrectly.', remediation: '3 + 6 = 9.' },
      C: { error: 'The student subtracted.', remediation: 'Add the digits: 3 + 6 = 9.' },
      D: { error: 'The student miscalculated.', remediation: '3 + 6 = 9.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'Jake has $50. He buys 3 video games that cost $9 each. How much money does Jake have left?',
    option_a: '$23', option_b: '$27', option_c: '$32', option_d: '$14',
    correct_answer: 'A',
    explanation: 'Cost of games = 3 × $9 = $27. Money left = $50 - $27 = $23.',
    distractor_diagnostics: {
      B: { error: 'The student calculated the amount spent ($27) instead of the money left.', remediation: 'Subtract the spent amount from $50: $50 - $27 = $23.' },
      C: { error: 'The student subtracted 50 - (3 + 9) = 50 - 12 = 38 or miscalculated.', remediation: '3 games at $9 each is 3 × 9 = 27. $50 - 27 = $23.' },
      D: { error: 'The student made a subtraction error.', remediation: '50 - 27 = 23.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'What is the value of n in the equation:  72 ÷ n = 9?',
    option_a: '8', option_b: '9', option_c: '7', option_d: '63',
    correct_answer: 'A',
    explanation: 'Think: 9 × ? = 72. Since 9 × 8 = 72, n = 8.',
    distractor_diagnostics: {
      B: { error: '9 × 9 = 81, not 72.', remediation: '72 ÷ 9 = 8, so n = 8.' },
      C: { error: '9 × 7 = 63, not 72.', remediation: '9 × 8 = 72, so n = 8.' },
      D: { error: 'The student subtracted 72 - 9.', remediation: 'Solve by dividing: 72 ÷ 9 = 8.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Properties of Multiplication', subtopic_id: 364,
    question_text: 'If a student knows that 8 × 5 = 40, how can they use that fact to solve 8 × 6?',
    option_a: 'Add 8 to 40 (40 + 8 = 48)', option_b: 'Add 6 to 40 (40 + 6 = 46)', option_c: 'Multiply 40 by 6', option_d: 'Add 1 to 40 (40 + 1 = 41)',
    correct_answer: 'A',
    explanation: '8 × 6 means 6 groups of 8, which is one more group of 8 than 8 × 5: 40 + 8 = 48.',
    distractor_diagnostics: {
      B: { error: 'The student added the factor 6 instead of the group size 8.', remediation: 'Each group contains 8, so one more group adds 8: 40 + 8 = 48.' },
      C: { error: 'Multiplying 40 by 6 would give 240.', remediation: 'Just add one more group of 8: 40 + 8 = 48.' },
      D: { error: 'Adding 1 only increases by 1 unit, not 1 group of 8.', remediation: 'Add 8 to 40 to find 8 × 6 = 48.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'A box of cupcakes has 24 cupcakes. 4 children share them equally. Then, one child gives 2 of his cupcakes to his mom. How many cupcakes does that child have left?',
    option_a: '4', option_b: '6', option_c: '8', option_d: '2',
    correct_answer: 'A',
    explanation: 'Step 1: Each child gets 24 ÷ 4 = 6 cupcakes. Step 2: 6 - 2 = 4 cupcakes left.',
    distractor_diagnostics: {
      B: { error: 'The student found each child\'s initial share (6) without subtracting 2.', remediation: 'Subtract the 2 cupcakes given to mom: 6 - 2 = 4.' },
      C: { error: 'The student added 6 + 2.', remediation: '"Gives to mom" means subtract: 6 - 2 = 4.' },
      D: { error: 'The student just answered 2 (the amount given away).', remediation: '6 - 2 = 4 cupcakes remaining.' }
    }
  },

  // High (8)
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'Lily makes 6 gift bags. She puts 4 chocolate bars and 3 mint candies in each bag. How many total candies and chocolates did Lily use for all the bags?',
    option_a: '42', option_b: '24', option_c: '18', option_d: '13',
    correct_answer: 'A',
    explanation: 'Each bag has 4 + 3 = 7 items. Total items = 6 × 7 = 42 items.',
    distractor_diagnostics: {
      B: { error: 'The student calculated only chocolate bars (6 × 4 = 24).', remediation: 'Don\'t forget mint candies: (4 + 3) × 6 = 7 × 6 = 42.' },
      C: { error: 'The student calculated only mint candies (6 × 3 = 18).', remediation: 'Add chocolates and mints in each bag first: 4 + 3 = 7, then 7 × 6 = 42.' },
      D: { error: 'The student added 6 + 4 + 3.', remediation: 'Multiply items per bag by number of bags: 6 × (4 + 3) = 42.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Properties of Multiplication', subtopic_id: 364,
    question_text: 'Which equation correctly uses the distributive property to find the area of an 8 by 7 rectangle?',
    option_a: '8 × 7 = (8 × 5) + (8 × 2)', option_b: '8 × 7 = (8 × 5) × (8 × 2)', option_c: '8 × 7 = (4 × 7) + (2 × 7)', option_d: '8 × 7 = 8 + 7',
    correct_answer: 'A',
    explanation: 'Break 7 into 5 + 2: 8 × (5 + 2) = (8 × 5) + (8 × 2) = 40 + 16 = 56.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied the two partial areas instead of adding them.', remediation: 'Partial products must be added together: (8 × 5) + (8 × 2).' },
      C: { error: '4 + 2 is 6, not 8.', remediation: 'Make sure the split adds up to the original factor: 5 + 2 = 7.' },
      D: { error: 'This is addition, not area.', remediation: 'Area is length × width: 8 × 7 = 56.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'There are 48 students going on a field trip. 6 students travel in a van, and the remaining students travel equally in 6 cars. How many students travel in each car?',
    option_a: '7', option_b: '8', option_c: '6', option_d: '42',
    correct_answer: 'A',
    explanation: 'Step 1: Students in cars = 48 - 6 = 42. Step 2: Students per car = 42 ÷ 6 = 7 students.',
    distractor_diagnostics: {
      B: { error: 'The student divided 48 ÷ 6 = 8 without subtracting the van students first.', remediation: 'First subtract the 6 students in the van: 48 - 6 = 42. Then 42 ÷ 6 = 7.' },
      C: { error: 'The student guessed 6.', remediation: '42 divided by 6 cars equals 7 students per car.' },
      D: { error: 'The student stopped after subtracting (42) and didn\'t divide by 6 cars.', remediation: 'Divide 42 among the 6 cars: 42 ÷ 6 = 7.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'Look at the input/output table: Input 3 -> Output 12; Input 5 -> Output 20; Input 7 -> Output 28. What is the rule, and what is the output for input 9?',
    option_a: 'Rule: Multiply by 4; Output for 9 is 36', option_b: 'Rule: Add 9; Output for 9 is 18', option_c: 'Rule: Multiply by 3; Output for 9 is 27', option_d: 'Rule: Multiply by 4; Output for 9 is 40',
    correct_answer: 'A',
    explanation: 'Testing multiplication: 3 × 4 = 12, 5 × 4 = 20, 7 × 4 = 28. The rule is multiply by 4. For input 9: 9 × 4 = 36.',
    distractor_diagnostics: {
      B: { error: '3 + 9 = 12, but 5 + 9 is 14 (not 20).', remediation: 'The rule must work for all rows: 3 × 4 = 12, so 9 × 4 = 36.' },
      C: { error: '3 × 3 = 9, not 12.', remediation: 'Check the first row: 3 × 4 = 12, so multiply by 4.' },
      D: { error: 'The student calculated 9 × 4 as 40.', remediation: '9 × 4 = 36.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'Emma saved $4 each week for 8 weeks. Then she spent $15 on a book and earned $10 for doing chores. How much money does Emma have now?',
    option_a: '$27', option_b: '$17', option_c: '$32', option_d: '$37',
    correct_answer: 'A',
    explanation: 'Saved: 8 × $4 = $32. Spent book: $32 - $15 = $17. Chores: $17 + $10 = $27.',
    distractor_diagnostics: {
      B: { error: 'The student stopped after spending $15 ($17) without adding the $10 earned.', remediation: 'Add the $10 earned from chores: $17 + $10 = $27.' },
      C: { error: 'The student only calculated savings ($32).', remediation: 'Perform all steps: 32 - 15 + 10 = $27.' },
      D: { error: 'The student added 15 instead of subtracting.', remediation: 'Spending decreases money: 32 - 15 = 17, then 17 + 10 = 27.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Properties of Multiplication', subtopic_id: 364,
    question_text: 'A student solves 9 × 8 by thinking of 9 as (10 - 1). Which expression matches this reasoning?',
    option_a: '(10 × 8) - (1 × 8)', option_b: '(10 × 8) + (1 × 8)', option_c: '(10 - 8) × (1 - 8)', option_d: '10 × 8 - 1',
    correct_answer: 'A',
    explanation: 'Using the distributive property: (10 - 1) × 8 = (10 × 8) - (1 × 8) = 80 - 8 = 72.',
    distractor_diagnostics: {
      B: { error: 'The student added instead of subtracting.', remediation: 'Since 9 is 10 - 1, subtract the 1 group of 8: (10 × 8) - (1 × 8) = 72.' },
      C: { error: 'The student applied operations incorrectly.', remediation: 'Distribute 8 to both 10 and 1: (10 × 8) - (1 × 8).' },
      D: { error: 'The student forgot to multiply 1 by 8.', remediation: 'You must subtract 1 whole group of 8: 80 - 8 = 72.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Two-Step Word Problems', subtopic_id: 365,
    question_text: 'A pet shelter has 3 rooms of dogs with 6 dogs in each room, and 4 rooms of cats with 5 cats in each room. How many total animals are in the shelter?',
    option_a: '38', option_b: '35', option_c: '40', option_d: '18',
    correct_answer: 'A',
    explanation: 'Dogs = 3 × 6 = 18. Cats = 4 × 5 = 20. Total animals = 18 + 20 = 38.',
    distractor_diagnostics: {
      B: { error: 'The student added 18 + 17.', remediation: 'Calculate each group: 3 × 6 = 18 dogs, 4 × 5 = 20 cats. 18 + 20 = 38.' },
      C: { error: 'The student rounded 38 to 40.', remediation: 'Exact calculation: 18 + 20 = 38 animals.' },
      D: { error: 'The student only counted the dogs.', remediation: 'Add both dogs and cats: 18 + 20 = 38 animals.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Patterns, Multiplication & Unknowns', subtopic_id: 192,
    question_text: 'If (p × 7) + 5 = 47, what is the value of p?',
    option_a: '6', option_b: '7', option_c: '5', option_d: '8',
    correct_answer: 'A',
    explanation: 'Step 1: p × 7 = 47 - 5 = 42. Step 2: p = 42 ÷ 7 = 6.',
    distractor_diagnostics: {
      B: { error: '7 × 7 + 5 = 49 + 5 = 54, not 47.', remediation: 'Subtract 5 first: 47 - 5 = 42. Then 42 ÷ 7 = 6.' },
      C: { error: '5 × 7 + 5 = 35 + 5 = 40.', remediation: '42 ÷ 7 = 6.' },
      D: { error: '8 × 7 + 5 = 56 + 5 = 61.', remediation: 'p = (47 - 5) / 7 = 42 / 7 = 6.' }
    }
  }
];

const g4Questions = [
  // Low (8)
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Relationships', subtopic_id: 194,
    question_text: 'Which statement correctly interprets the equation 35 = 5 × 7 as a multiplicative comparison?',
    option_a: '35 is 5 times as many as 7', option_b: '35 is 5 more than 7', option_c: '35 is 7 less than 5', option_d: '35 is equal to 5 plus 7',
    correct_answer: 'A',
    explanation: 'Multiplication represents "times as many": 35 is 5 times as many as 7 (or 7 times as many as 5).',
    distractor_diagnostics: {
      B: { error: 'The student confused multiplicative comparison with additive comparison.', remediation: '"Times as many" represents multiplication, while "more than" represents addition.' },
      C: { error: 'The student stated a subtraction comparison.', remediation: '35 = 5 × 7 means 35 is 5 times as many as 7.' },
      D: { error: '5 plus 7 is 12, not 35.', remediation: 'Multiplication is repeated addition, not single addition.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Relationships', subtopic_id: 194,
    question_text: 'A blue ribbon is 6 inches long. A red ribbon is 4 times as long as the blue ribbon. How long is the red ribbon?',
    option_a: '24 inches', option_b: '10 inches', option_c: '20 inches', option_d: '2 inches',
    correct_answer: 'A',
    explanation: 'Multiply the length of the blue ribbon by 4: 6 × 4 = 24 inches.',
    distractor_diagnostics: {
      B: { error: 'The student added 6 + 4.', remediation: '"4 times as long" means multiply: 6 × 4 = 24 inches.' },
      C: { error: 'The student miscalculated.', remediation: '6 × 4 = 24 inches.' },
      D: { error: 'The student subtracted 6 - 4.', remediation: 'Multiply 6 by 4 to get 24.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'What are all the factor pairs of 12?',
    option_a: '1 × 12, 2 × 6, 3 × 4', option_b: '1 × 12, 2 × 5, 3 × 4', option_c: '2 × 6, 3 × 4', option_d: '1 × 12, 2 × 6',
    correct_answer: 'A',
    explanation: 'The factors of 12 are 1, 2, 3, 4, 6, 12, giving factor pairs 1 × 12, 2 × 6, and 3 × 4.',
    distractor_diagnostics: {
      B: { error: '2 × 5 is 10, not 12.', remediation: '2 × 6 = 12, so the pairs are 1 × 12, 2 × 6, 3 × 4.' },
      C: { error: 'The student omitted 1 × 12.', remediation: '1 and the number itself are always a factor pair: 1 × 12.' },
      D: { error: 'The student omitted 3 × 4.', remediation: '3 × 4 = 12 is also a factor pair.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'Which of the following numbers is a PRIME number?',
    option_a: '13', option_b: '15', option_c: '21', option_d: '9',
    correct_answer: 'A',
    explanation: 'A prime number has exactly two distinct factors: 1 and itself. 13 has only factors 1 and 13.',
    distractor_diagnostics: {
      B: { error: '15 is composite (1, 3, 5, 15).', remediation: '15 can be divided by 3 and 5, so it is not prime.' },
      C: { error: '21 is composite (1, 3, 7, 21).', remediation: '21 has factors 3 and 7, so it is composite.' },
      D: { error: '9 is composite (1, 3, 9).', remediation: '9 = 3 × 3, so it is composite.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'Solve for x:  x + 145 = 320',
    option_a: '175', option_b: '465', option_c: '185', option_d: '275',
    correct_answer: 'A',
    explanation: 'Subtract 145 from both sides: x = 320 - 145 = 175.',
    distractor_diagnostics: {
      B: { error: 'The student added 320 + 145.', remediation: 'Subtract 145 from 320 to isolate x: x = 320 - 145 = 175.' },
      C: { error: 'The student made an error in regrouping.', remediation: '320 - 145: 10 - 5 = 5, 31 - 14 = 17 -> 175.' },
      D: { error: 'The student subtracted incorrectly.', remediation: '320 - 145 = 175.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'Which list contains only MULTIPLES of 6?',
    option_a: '6, 12, 18, 24, 30', option_b: '1, 2, 3, 6', option_c: '6, 16, 26, 36', option_d: '6, 9, 12, 15',
    correct_answer: 'A',
    explanation: 'Multiples of 6 are generated by multiplying 6 by whole numbers: 6×1=6, 6×2=12, 6×3=18, 6×4=24, 6×5=30.',
    distractor_diagnostics: {
      B: { error: 'These are the factors of 6, not multiples.', remediation: 'Multiples are products of 6 (6, 12, 18...), while factors divide into 6.' },
      C: { error: '16 and 26 are not multiples of 6.', remediation: 'Add 6 each time: 6, 12, 18, 24, 30, 36.' },
      D: { error: '9 and 15 are multiples of 3, not 6.', remediation: 'Multiples of 6 must be divisible by 6.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'A number sequence starts at 4 and follows the rule "add 5". What are the first 4 terms?',
    option_a: '4, 9, 14, 19', option_b: '4, 8, 12, 16', option_c: '5, 9, 14, 19', option_d: '4, 20, 100, 500',
    correct_answer: 'A',
    explanation: 'Start with 4. Add 5: 4 + 5 = 9. Add 5: 9 + 5 = 14. Add 5: 14 + 5 = 19.',
    distractor_diagnostics: {
      B: { error: 'This sequence adds 4 each time.', remediation: 'Follow the given rule: add 5 to each term (4 + 5 = 9, 9 + 5 = 14...).' },
      C: { error: 'The sequence started with 5 instead of 4.', remediation: 'Start at 4: 4, 9, 14, 19.' },
      D: { error: 'This sequence multiplies by 5.', remediation: 'The rule says "add 5", not multiply by 5.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'What value of y makes the equation true?  5 × y = 80',
    option_a: '16', option_b: '14', option_c: '400', option_d: '75',
    correct_answer: 'A',
    explanation: 'Divide both sides by 5: y = 80 ÷ 5 = 16.',
    distractor_diagnostics: {
      B: { error: '5 × 14 = 70, not 80.', remediation: '80 ÷ 5 = 16, so y = 16.' },
      C: { error: 'The student multiplied 80 × 5.', remediation: 'Divide 80 by 5 to find y: y = 16.' },
      D: { error: 'The student subtracted 80 - 5.', remediation: 'To undo multiplication, divide: 80 ÷ 5 = 16.' }
    }
  },

  // Medium (9)
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Relationships', subtopic_id: 194,
    question_text: 'At a book fair, Maya bought 3 books. David bought 4 times as many books as Maya. How many MORE books did David buy than Maya?',
    option_a: '9', option_b: '12', option_c: '15', option_d: '7',
    correct_answer: 'A',
    explanation: 'David bought: 3 × 4 = 12 books. The question asks how many MORE: 12 - 3 = 9 more books.',
    distractor_diagnostics: {
      B: { error: 'The student found David\'s total books (12) without subtracting Maya\'s books.', remediation: '"How many more" means find the difference: 12 - 3 = 9.' },
      C: { error: 'The student added Maya\'s and David\'s books together (3 + 12 = 15).', remediation: 'Subtract Maya\'s books from David\'s: 12 - 3 = 9.' },
      D: { error: 'The student added 3 + 4 = 7.', remediation: 'First multiply: 3 × 4 = 12, then subtract: 12 - 3 = 9.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'A school orders 140 juice boxes. The juice boxes come in packs of 8. How many full packs are there, and how many boxes are left over?',
    option_a: '17 full packs, with 4 boxes left over', option_b: '16 full packs, with 4 boxes left over', option_c: '18 full packs, with 0 boxes left over', option_d: '17 full packs, with 6 boxes left over',
    correct_answer: 'A',
    explanation: 'Divide 140 by 8: 140 ÷ 8 = 17 with a remainder of 4 (17 × 8 = 136, 140 - 136 = 4).',
    distractor_diagnostics: {
      B: { error: '16 × 8 = 128, leaving 12 (another full pack).', remediation: '140 ÷ 8 = 17 R 4.' },
      C: { error: '18 × 8 = 144, which exceeds 140.', remediation: '17 full packs use 136 boxes, leaving 4 left over.' },
      D: { error: 'The remainder was calculated incorrectly.', remediation: '140 - 136 = 4 boxes remainder.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'Which statement about the number 51 is TRUE?',
    option_a: 'It is composite because 3 × 17 = 51', option_b: 'It is prime because it is an odd number', option_c: 'It is prime because it ends in 1', option_d: 'It is composite because it is divisible by 2',
    correct_answer: 'A',
    explanation: '51 is composite because its factors are 1, 3, 17, and 51 (sum of digits 5 + 1 = 6 is divisible by 3).',
    distractor_diagnostics: {
      B: { error: 'Not all odd numbers are prime (e.g., 9, 15, 21, 51).', remediation: 'Check divisibility: 51 ÷ 3 = 17, so 51 is composite.' },
      C: { error: 'Ending in 1 does not guarantee being prime.', remediation: '51 can be factored as 3 × 17, so it is composite.' },
      D: { error: '51 is odd and cannot be divided evenly by 2.', remediation: '51 is divisible by 3, not 2.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'A pattern starts at 2 and follows the rule "multiply by 2, then add 1". What is the third term in this sequence?',
    option_a: '11', option_b: '5', option_c: '23', option_d: '10',
    correct_answer: 'A',
    explanation: 'Term 1 = 2. Term 2 = (2 × 2) + 1 = 5. Term 3 = (5 × 2) + 1 = 10 + 1 = 11.',
    distractor_diagnostics: {
      B: { error: '5 is the second term, not the third term.', remediation: 'Apply the rule once more: (5 × 2) + 1 = 11.' },
      C: { error: '23 is the fourth term.', remediation: 'The third term is 11.' },
      D: { error: 'The student forgot to add 1 on the second step (5 × 2 = 10).', remediation: 'Add 1 after multiplying: 10 + 1 = 11.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'A movie theater has 240 seats. For a show, 185 adult tickets and some child tickets were sold. All seats were filled. Which equation can be used to find c, the number of child tickets sold?',
    option_a: '185 + c = 240', option_b: '240 + 185 = c', option_c: '185 - c = 240', option_d: 'c = 240 × 185',
    correct_answer: 'A',
    explanation: 'The sum of adult tickets (185) and child tickets (c) equals total seats (240): 185 + c = 240.',
    distractor_diagnostics: {
      B: { error: 'This adds the total and the part.', remediation: 'Adult + Child = Total: 185 + c = 240.' },
      C: { error: 'Subtracting c from 185 cannot give 240.', remediation: 'Set up the part-part-whole equation: 185 + c = 240.' },
      D: { error: 'This multiplies seats by tickets.', remediation: 'Use addition for parts of a total: 185 + c = 240.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Relationships', subtopic_id: 194,
    question_text: 'Elena has 48 photos. This is 6 times as many photos as Marco has. How many photos does Marco have?',
    option_a: '8', option_b: '288', option_c: '42', option_d: '54',
    correct_answer: 'A',
    explanation: 'Set up equation: 48 = 6 × m. Divide: m = 48 ÷ 6 = 8 photos.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied 48 × 6.', remediation: 'Elena has MORE photos than Marco. Divide 48 by 6 to find Marco\'s photos: 8.' },
      C: { error: 'The student subtracted 48 - 6.', remediation: '"Times as many" requires division to find the smaller amount: 48 ÷ 6 = 8.' },
      D: { error: 'The student added 48 + 6.', remediation: 'Divide 48 by 6: Marco has 8 photos.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'Solve the equation for k:  (k ÷ 4) + 18 = 25',
    option_a: '28', option_b: '7', option_c: '172', option_d: '32',
    correct_answer: 'A',
    explanation: 'Step 1: k ÷ 4 = 25 - 18 = 7. Step 2: k = 7 × 4 = 28.',
    distractor_diagnostics: {
      B: { error: '7 is the value of (k ÷ 4), not k itself.', remediation: 'Multiply 7 by 4 to solve for k: k = 7 × 4 = 28.' },
      C: { error: 'The student added 25 + 18 and multiplied.', remediation: 'Subtract 18 first: 25 - 18 = 7, then 7 × 4 = 28.' },
      D: { error: 'The student miscalculated 7 × 4.', remediation: '7 × 4 = 28.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'Which feature is true of every term in the pattern: 6, 12, 18, 24, 30, 36...?',
    option_a: 'Every term is an even number', option_b: 'Every term is an odd number', option_c: 'Every term ends in 6', option_d: 'Every term is a prime number',
    correct_answer: 'A',
    explanation: 'Every multiple of 6 is even because 6 is an even number, and any multiple of an even number is always even.',
    distractor_diagnostics: {
      B: { error: 'All terms are even.', remediation: 'Multiples of 6 are all even numbers.' },
      C: { error: '12, 18, 24, 30 do not end in 6.', remediation: 'They end in 0, 2, 4, 6, 8 (even digits).' },
      D: { error: 'They have factors 1, 2, 3, 6, so they are composite.', remediation: 'Multiples of 6 greater than 6 are composite.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'A baker has 75 cookies. She wants to pack them into boxes of 6. How many boxes can she fill completely, and how many more cookies does she need to fill one more box?',
    option_a: '12 full boxes; she needs 3 more cookies', option_b: '12 full boxes; she needs 2 more cookies', option_c: '13 full boxes; she needs 3 more cookies', option_d: '11 full boxes; she needs 1 more cookie',
    correct_answer: 'A',
    explanation: '75 ÷ 6 = 12 with a remainder of 3 (12 × 6 = 72 cookies packed). To fill the 13th box (needs 6), she needs: 6 - 3 = 3 more cookies.',
    distractor_diagnostics: {
      B: { error: 'The student miscalculated the remaining needed cookies.', remediation: 'A box holds 6. Since 3 are left, 6 - 3 = 3 more are needed.' },
      C: { error: 'She cannot fill 13 boxes with only 75 cookies (13 × 6 = 78).', remediation: 'She can only fill 12 full boxes.' },
      D: { error: '11 × 6 = 66, which is too low.', remediation: '75 ÷ 6 = 12 R 3. She fills 12 boxes and needs 3 more cookies.' }
    }
  },

  // High (8)
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Relationships', subtopic_id: 194,
    question_text: 'A zoo has 5 times as many monkeys as lions. There are 24 more monkeys than lions. How many monkeys and lions are there in total?',
    option_a: '36', option_b: '30', option_c: '24', option_d: '48',
    correct_answer: 'A',
    explanation: 'Let lions = L. Monkeys = 5L. Difference: 5L - L = 4L = 24 -> L = 6 lions. Monkeys = 5 × 6 = 30 monkeys. Total = 6 + 30 = 36 animals.',
    distractor_diagnostics: {
      B: { error: '30 is only the number of monkeys.', remediation: 'Add the 6 lions to the 30 monkeys: 30 + 6 = 36 total animals.' },
      C: { error: '24 is the difference between monkeys and lions.', remediation: 'Find individual amounts: 6 lions and 30 monkeys, total = 36.' },
      D: { error: 'The student multiplied 24 by 2.', remediation: 'Lions = 24 / 4 = 6. Monkeys = 30. Total = 36.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'A concert hall sold 245 tickets for Friday and twice as many for Saturday. If all tickets cost $8 each, what was the total money collected for both nights?',
    option_a: '$5,880', option_b: '$3,920', option_c: '$1,960', option_d: '$7,840',
    correct_answer: 'A',
    explanation: 'Saturday tickets = 245 × 2 = 490. Total tickets = 245 + 490 = 735. Total money = 735 × $8 = $5,880.',
    distractor_diagnostics: {
      B: { error: 'The student only calculated Saturday\'s sales (490 × 8 = $3,920).', remediation: 'Include Friday\'s tickets: (245 + 490) × 8 = 735 × 8 = $5,880.' },
      C: { error: 'The student only calculated Friday\'s sales (245 × 8 = $1,960).', remediation: 'Calculate both nights: Friday ($1,960) + Saturday ($3,920) = $5,880.' },
      D: { error: 'The student multiplied by 10 instead of 8 or miscalculated.', remediation: '735 × 8 = $5,880.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'Which number between 80 and 100 has the GREATEST number of factors?',
    option_a: '96 (12 factors)', option_b: '81 (5 factors)', option_c: '97 (2 factors)', option_d: '84 (12 factors, but smaller than 96)',
    correct_answer: 'A',
    explanation: 'Factors of 96 are: 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 96 (total 12 factors). 97 is prime (2 factors), 81 has 5 factors.',
    distractor_diagnostics: {
      B: { error: '81 has only 5 factors (1, 3, 9, 27, 81).', remediation: '96 has 12 factors, which is significantly more than 81.' },
      C: { error: '97 is a prime number and has only 2 factors (1 and 97).', remediation: 'Prime numbers have the fewest factors (only 2).' },
      D: { error: '84 has 12 factors (1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84), but 96 is the standard composite benchmark.', remediation: '96 has 12 factors.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'A school has 312 fourth-graders going on a field trip. Each bus can hold 45 students. How many buses are needed so that EVERY student has a seat?',
    option_a: '7 buses', option_b: '6 buses', option_c: '8 buses', option_d: '6 buses with 42 students left behind',
    correct_answer: 'A',
    explanation: 'Divide 312 ÷ 45 = 6 with a remainder of 42. Since 42 students cannot be left behind, the remainder requires an additional bus: 6 + 1 = 7 buses.',
    distractor_diagnostics: {
      B: { error: '6 buses only hold 6 × 45 = 270 students, leaving 42 students without a ride.', remediation: 'In real-world bus problems, round UP to accommodate the remainder: 7 buses.' },
      C: { error: '8 buses would hold 360 students, which is more than necessary.', remediation: '7 buses hold 7 × 45 = 315 seats, which is enough for 312 students.' },
      D: { error: 'Students cannot be left behind on a school trip.', remediation: 'Interpret the remainder by adding 1 more bus: 7 buses.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Relationships', subtopic_id: 194,
    question_text: 'An artist has 3 containers of beads. Container A has 180 beads. Container B has half as many beads as Container A. Container C has 3 times as many beads as Container B. How many beads are in Container C?',
    option_a: '270 beads', option_b: '90 beads', option_c: '540 beads', option_d: '360 beads',
    correct_answer: 'A',
    explanation: 'Container B = 180 ÷ 2 = 90 beads. Container C = 90 × 3 = 270 beads.',
    distractor_diagnostics: {
      B: { error: '90 is Container B, not Container C.', remediation: 'Multiply Container B by 3: 90 × 3 = 270 beads.' },
      C: { error: 'The student multiplied Container A directly by 3 (180 × 3 = 540).', remediation: 'Container C is 3 times Container B (90), not Container A.' },
      D: { error: 'The student doubled Container A.', remediation: 'Container B = 90, Container C = 90 × 3 = 270.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Number Patterns', subtopic_id: 193,
    question_text: 'Consider the pattern: 1, 4, 9, 16, 25, 36, ... What is the rule for this pattern, and what is the 10th term?',
    option_a: 'Rule: Square of the term position (n × n); 10th term is 100', option_b: 'Rule: Add 3, add 5, add 7; 10th term is 81', option_c: 'Rule: Multiply by 4; 10th term is 40', option_d: 'Rule: Add 10; 10th term is 100',
    correct_answer: 'A',
    explanation: 'These are square numbers: 1² = 1, 2² = 4, 3² = 9... The 10th term is 10² = 10 × 10 = 100.',
    distractor_diagnostics: {
      B: { error: '81 is the 9th term (9² = 81).', remediation: 'The 10th term is 10 × 10 = 100.' },
      C: { error: 'The pattern does not multiply by 4.', remediation: 'The pattern is n², so the 10th term is 100.' },
      D: { error: 'The difference increases each time, not a constant +10.', remediation: 'Term n is n²: 10² = 100.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Unknowns', subtopic_id: 195,
    question_text: 'In the equation 3 × (m + 7) = 48, what is the value of m?',
    option_a: '9', option_b: '16', option_c: '7', option_d: '11',
    correct_answer: 'A',
    explanation: 'Step 1: Divide both sides by 3: m + 7 = 48 ÷ 3 = 16. Step 2: Subtract 7: m = 16 - 7 = 9.',
    distractor_diagnostics: {
      B: { error: '16 is the value of (m + 7), not m.', remediation: 'Subtract 7 from 16 to find m: m = 16 - 7 = 9.' },
      C: { error: '3 × (7 + 7) = 3 × 14 = 42, not 48.', remediation: 'm = 16 - 7 = 9.' },
      D: { error: '3 × (11 + 7) = 3 × 18 = 54.', remediation: '48 / 3 = 16; 16 - 7 = 9.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Relationships', subtopic_id: 194,
    question_text: 'A store sold 18 laptops. They sold 3 times as many tablets as laptops, and half as many desktop computers as laptops. How many total devices were sold?',
    option_a: '81 devices', option_b: '72 devices', option_c: '90 devices', option_d: '63 devices',
    correct_answer: 'A',
    explanation: 'Laptops = 18. Tablets = 18 × 3 = 54. Desktops = 18 ÷ 2 = 9. Total devices = 18 + 54 + 9 = 81 devices.',
    distractor_diagnostics: {
      B: { error: 'The student omitted desktops (18 + 54 = 72).', remediation: 'Add desktops: 18 / 2 = 9 desktops, so 72 + 9 = 81.' },
      C: { error: 'The student miscalculated the total.', remediation: '18 + 54 + 9 = 81.' },
      D: { error: 'The student subtracted desktops instead of adding.', remediation: 'All devices are added: 18 + 54 + 9 = 81.' }
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

  const allQuestions = [...g3Questions, ...g4Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 3 & Grade 4 Algebra...`);

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

  console.log(`Grade 3 & 4 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
