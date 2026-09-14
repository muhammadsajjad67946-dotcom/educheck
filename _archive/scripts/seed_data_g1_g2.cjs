const mysql = require('mysql2/promise');
require('dotenv').config();

const g1Questions = [
  // Low (8)
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Sorting & Categorizing Data', subtopic_id: 303,
    question_text: 'A group of blocks has 3 red squares, 4 blue circles, and 2 yellow triangles. How many circles are there?',
    option_a: '4', option_b: '3', option_c: '2', option_d: '9',
    correct_answer: 'A',
    explanation: 'Looking at the circle category, there are 4 blue circles.',
    distractor_diagnostics: {
      B: { error: 'Student counted the squares instead of circles.', remediation: 'Check the category requested: circles. There are 4 blue circles.' },
      C: { error: 'Student counted the triangles.', remediation: 'Count only the circles: there are 4 circles.' },
      D: { error: 'Student added all shapes together instead of identifying one category.', remediation: 'The question asks only for the number of circles (4), not the total.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Counting Categories', subtopic_id: 305,
    question_text: 'A tally chart shows |||| for apples and ||| for bananas. How many apples are recorded?',
    option_a: '4', option_b: '3', option_c: '7', option_d: '5',
    correct_answer: 'A',
    explanation: 'Each tally mark | represents 1 item. |||| has 4 tally marks, so there are 4 apples.',
    distractor_diagnostics: {
      B: { error: 'Student read the tally marks for bananas (||| = 3).', remediation: 'Look at the row for apples: |||| means 4.' },
      C: { error: 'Student added both tally groups together (4 + 3 = 7).', remediation: 'Read only the apples category: 4 tally marks.' },
      D: { error: 'Student assumed a bundle of 5 tallies.', remediation: 'Count the individual tally marks: 1, 2, 3, 4.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Picture Graphs', subtopic_id: 306,
    question_text: 'On a picture graph where each ⭐️ equals 1 student, Maya has ⭐️⭐️⭐️. How many stars did Maya get?',
    option_a: '3', option_b: '2', option_c: '4', option_d: '1',
    correct_answer: 'A',
    explanation: 'Count the star symbols: 1, 2, 3. Maya has 3 stars.',
    distractor_diagnostics: {
      B: { error: 'Student miscounted by 1 less.', remediation: 'Point and count each star: 1, 2, 3.' },
      C: { error: 'Student miscounted by 1 more.', remediation: 'There are exactly 3 stars.' },
      D: { error: 'Student thought the key (1 star) was the answer.', remediation: 'Count all of Maya\'s stars: 3.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Comparing Data', subtopic_id: 304,
    question_text: 'Tom has 5 toy cars and Sara has 3 toy cars. How many more toy cars does Tom have than Sara?',
    option_a: '2', option_b: '8', option_c: '3', option_d: '5',
    correct_answer: 'A',
    explanation: 'To find "how many more", subtract: 5 - 3 = 2.',
    distractor_diagnostics: {
      B: { error: 'Student added instead of finding the difference: 5 + 3 = 8.', remediation: '"How many more" means find the difference by subtracting: 5 - 3 = 2.' },
      C: { error: 'Student stated Sara\'s count.', remediation: 'Subtract Sara\'s cars from Tom\'s cars: 5 - 3 = 2.' },
      D: { error: 'Student stated Tom\'s count.', remediation: 'Compare the two amounts: 5 - 3 = 2.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Categories', subtopic_id: 309,
    question_text: 'Which category does a banana belong to?',
    option_a: 'Fruits', option_b: 'Vegetables', option_c: 'Dairy', option_d: 'Meat',
    correct_answer: 'A',
    explanation: 'A banana is classified under the fruit category.',
    distractor_diagnostics: {
      B: { error: 'Student confused fruits with vegetables.', remediation: 'Bananas grow on plants with seeds and are sweet fruits.' },
      C: { error: 'Dairy includes milk and cheese products.', remediation: 'Bananas belong to the fruit group.' },
      D: { error: 'Meat includes chicken, beef, and fish.', remediation: 'Bananas are fruits.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Simple Data Questions', subtopic_id: 307,
    question_text: 'In a class pet survey, 6 students have dogs, 4 students have cats, and 2 students have birds. How many students were surveyed in total?',
    option_a: '12', option_b: '10', option_c: '6', option_d: '8',
    correct_answer: 'A',
    explanation: 'Add all categories together: 6 + 4 + 2 = 12 students in total.',
    distractor_diagnostics: {
      B: { error: 'Student added only dogs and cats (6 + 4 = 10) and forgot birds.', remediation: 'Include all three categories: 6 + 4 + 2 = 12.' },
      C: { error: 'Student gave the largest category only.', remediation: 'The question asks for the total: add 6 + 4 + 2 = 12.' },
      D: { error: 'Student made an addition error.', remediation: '6 + 4 = 10; 10 + 2 = 12.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Picture Graphs', subtopic_id: 306,
    question_text: 'In a picture graph where each 🍎 = 1 apple, Liam has 🍎🍎🍎🍎🍎. How many apples does Liam have?',
    option_a: '5', option_b: '4', option_c: '6', option_d: '1',
    correct_answer: 'A',
    explanation: 'Count the apples: 1, 2, 3, 4, 5. Liam has 5 apples.',
    distractor_diagnostics: {
      B: { error: 'Student stopped counting at 4.', remediation: 'Count all symbols: Liam has 5 apples.' },
      C: { error: 'Student overcounted by 1.', remediation: 'There are exactly 5 apple symbols.' },
      D: { error: 'Student stated the value of 1 symbol.', remediation: 'Count the total number of apple symbols: 5.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Sorting & Categorizing Data', subtopic_id: 303,
    question_text: 'Look at the list: Red, Blue, Green, Square. Which one does NOT belong to the color category?',
    option_a: 'Square', option_b: 'Red', option_c: 'Blue', option_d: 'Green',
    correct_answer: 'A',
    explanation: 'Square is a shape, while Red, Blue, and Green are colors.',
    distractor_diagnostics: {
      B: { error: 'Red is a color.', remediation: 'Red, Blue, and Green are all colors; Square is a shape.' },
      C: { error: 'Blue is a color.', remediation: 'Square is a shape, so it does not belong in a list of colors.' },
      D: { error: 'Green is a color.', remediation: 'Square is the only shape in the list.' }
    }
  },

  // Medium (9)
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Comparing Data', subtopic_id: 304,
    question_text: 'In a survey, 7 kids like pizza and 4 kids like burgers. How many fewer kids like burgers than pizza?',
    option_a: '3', option_b: '11', option_c: '4', option_d: '7',
    correct_answer: 'A',
    explanation: '"How many fewer" means finding the difference: 7 - 4 = 3.',
    distractor_diagnostics: {
      B: { error: 'Student added both values (7 + 4 = 11).', remediation: '"How many fewer" asks for the difference: subtract 7 - 4 = 3.' },
      C: { error: 'Student just named the burger count.', remediation: 'Subtract to compare the two groups: 7 - 4 = 3.' },
      D: { error: 'Student named the pizza count.', remediation: 'Compare the groups by subtracting: 7 - 4 = 3.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Interpreting Data', subtopic_id: 308,
    question_text: 'A table shows: Red fish: 5, Blue fish: 3, Yellow fish: 4. Which color has the LEAST number of fish?',
    option_a: 'Blue', option_b: 'Red', option_c: 'Yellow', option_d: 'Green',
    correct_answer: 'A',
    explanation: 'Comparing 5, 3, and 4, the smallest number is 3, which corresponds to Blue fish.',
    distractor_diagnostics: {
      B: { error: 'Student chose the greatest number (Red = 5).', remediation: '"Least" means the smallest number: Blue has 3 fish.' },
      C: { error: 'Student chose the middle number (Yellow = 4).', remediation: 'Compare 5, 3, 4: 3 is the smallest (Blue).' },
      D: { error: 'Green is not in the table.', remediation: 'Choose from the colors in the table: Blue has the least (3).' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Picture Graphs', subtopic_id: 306,
    question_text: 'A picture graph shows student lunches: Sandwiches 🥪🥪🥪🥪, Salad 🥗🥗, Pizza 🍕🍕🍕🍕🍕. Each icon = 1 lunch. Which lunch was chosen the MOST?',
    option_a: 'Pizza', option_b: 'Sandwiches', option_c: 'Salad', option_d: 'All equal',
    correct_answer: 'A',
    explanation: 'Pizza has 5 icons, Sandwiches have 4, and Salad has 2. Pizza has the most.',
    distractor_diagnostics: {
      B: { error: 'Student chose Sandwiches (4 icons).', remediation: 'Compare the counts: 5 is greater than 4, so Pizza is the most.' },
      C: { error: 'Student chose the least (Salad = 2 icons).', remediation: '"Most" means the highest count: Pizza has 5.' },
      D: { error: 'The counts are different: 4, 2, and 5.', remediation: 'Pizza has the greatest number of icons: 5.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Simple Data Questions', subtopic_id: 307,
    question_text: 'A farmer counted 5 cows, 3 horses, and some sheep. If there are 12 farm animals in total, how many sheep are there?',
    option_a: '4', option_b: '8', option_c: '2', option_d: '5',
    correct_answer: 'A',
    explanation: 'Cows and horses = 5 + 3 = 8. Subtract from total 12: 12 - 8 = 4 sheep.',
    distractor_diagnostics: {
      B: { error: 'Student found the sum of cows and horses (5 + 3 = 8) and stopped.', remediation: 'Subtract 8 from the total 12 animals: 12 - 8 = 4 sheep.' },
      C: { error: 'Student subtracted 5 - 3 = 2.', remediation: 'Add known animals (5 + 3 = 8), then subtract from total: 12 - 8 = 4.' },
      D: { error: 'Student guessed the number of cows.', remediation: '12 - (5 + 3) = 12 - 8 = 4.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Comparing Data', subtopic_id: 304,
    question_text: 'In a game, Team Red scored 8 points and Team Green scored 5 points. How many points does Team Green need to tie Team Red?',
    option_a: '3', option_b: '13', option_c: '2', option_d: '8',
    correct_answer: 'A',
    explanation: 'To tie, Team Green must reach 8 points: 8 - 5 = 3 points needed.',
    distractor_diagnostics: {
      B: { error: 'Student added the scores together (8 + 5 = 13).', remediation: 'To tie, find the difference between the scores: 8 - 5 = 3.' },
      C: { error: 'Student subtracted incorrectly.', remediation: 'Count up from 5 to 8: 6, 7, 8 (3 points).' },
      D: { error: 'Student selected Team Red\'s score.', remediation: 'Subtract 8 - 5 = 3 points needed to tie.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Counting Categories', subtopic_id: 305,
    question_text: 'In a tally chart, a full bundle with a diagonal slash represents 5 tallies: [||||/]. If there is one full bundle and 2 single marks, what is the total count?',
    option_a: '7', option_b: '6', option_c: '8', option_d: '5',
    correct_answer: 'A',
    explanation: 'A full bundle is 5 tallies. Adding 2 single marks gives 5 + 2 = 7.',
    distractor_diagnostics: {
      B: { error: 'Student added only 1 to 5.', remediation: 'Add 2 single marks to 5: 5 + 2 = 7.' },
      C: { error: 'Student counted 5 + 3.', remediation: 'Count: 5, then 6, 7.' },
      D: { error: 'Student only counted the full bundle and ignored the single marks.', remediation: 'Do not forget the 2 single marks: 5 + 2 = 7.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Interpreting Data', subtopic_id: 308,
    question_text: 'Anna has 3 stickers, Ben has 5 stickers, and Clara has 2 stickers. Who has the MOST stickers?',
    option_a: 'Ben', option_b: 'Anna', option_c: 'Clara', option_d: 'Anna and Clara',
    correct_answer: 'A',
    explanation: 'Comparing 3, 5, and 2: 5 is the largest number, so Ben has the most stickers.',
    distractor_diagnostics: {
      B: { error: 'Student chose Anna (3 stickers).', remediation: 'Compare counts: 5 is greater than 3, so Ben has the most.' },
      C: { error: 'Student chose Clara (who has the least, 2 stickers).', remediation: '"Most" means the highest number: Ben has 5.' },
      D: { error: 'Anna and Clara have 3 and 2 stickers, both less than Ben.', remediation: 'Ben has the most with 5.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Sorting & Categorizing Data', subtopic_id: 303,
    question_text: 'A toy box has 4 soft bears, 3 hard trucks, and 5 soft rabbits. How many SOFT toys are in the box?',
    option_a: '9', option_b: '12', option_c: '4', option_d: '5',
    correct_answer: 'A',
    explanation: 'Identify the "soft" toys: 4 bears + 5 rabbits = 9 soft toys.',
    distractor_diagnostics: {
      B: { error: 'Student added all toys including hard trucks (4 + 3 + 5 = 12).', remediation: 'Only count toys in the "soft" category: 4 soft bears + 5 soft rabbits = 9.' },
      C: { error: 'Student only counted the soft bears.', remediation: 'Include all soft toys: 4 bears + 5 rabbits = 9.' },
      D: { error: 'Student only counted the soft rabbits.', remediation: 'Add both soft categories together: 4 + 5 = 9.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Simple Data Questions', subtopic_id: 307,
    question_text: 'Emma counts 6 birds in a tree: 2 are blue and the rest are red. How many red birds are there?',
    option_a: '4', option_b: '8', option_c: '2', option_d: '3',
    correct_answer: 'A',
    explanation: 'Subtract the 2 blue birds from the total 6 birds: 6 - 2 = 4 red birds.',
    distractor_diagnostics: {
      B: { error: 'Student added 6 + 2 = 8.', remediation: '6 is the total: subtract the blue birds to find the red birds: 6 - 2 = 4.' },
      C: { error: 'Student gave the count of blue birds.', remediation: 'The question asks for red birds: 6 - 2 = 4.' },
      D: { error: 'Student miscalculated the subtraction.', remediation: '6 - 2 = 4.' }
    }
  },

  // High (8)
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Comparing Data', subtopic_id: 304,
    question_text: 'In a vote for class mascot, Tiger got 6 votes, Eagle got 3 votes, and Bear got 5 votes. How many more votes did Tiger get than Eagle?',
    option_a: '3', option_b: '1', option_c: '9', option_d: '2',
    correct_answer: 'A',
    explanation: 'Tiger = 6, Eagle = 3. Subtract to compare: 6 - 3 = 3.',
    distractor_diagnostics: {
      B: { error: 'Student compared Tiger and Bear (6 - 5 = 1).', remediation: 'Compare Tiger (6) with Eagle (3): 6 - 3 = 3.' },
      C: { error: 'Student added Tiger and Eagle votes (6 + 3 = 9).', remediation: '"How many more" means subtract: 6 - 3 = 3.' },
      D: { error: 'Student compared Bear and Eagle (5 - 3 = 2).', remediation: 'Make sure to read the requested categories: Tiger (6) minus Eagle (3) = 3.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Interpreting Data', subtopic_id: 308,
    question_text: 'A chart shows books read: Sam read 4 books, Leo read 6 books, and Mia read 2 books. How many books did Sam and Mia read COMBINED?',
    option_a: '6', option_b: '12', option_c: '8', option_d: '10',
    correct_answer: 'A',
    explanation: 'Add Sam\'s books and Mia\'s books: 4 + 2 = 6 books.',
    distractor_diagnostics: {
      B: { error: 'Student added all three students\' books (4 + 6 + 2 = 12).', remediation: 'The question asks only for Sam (4) and Mia (2) combined: 4 + 2 = 6.' },
      C: { error: 'Student added Leo and Mia (6 + 2 = 8).', remediation: 'Add Sam and Mia: 4 + 2 = 6.' },
      D: { error: 'Student added Sam and Leo (4 + 6 = 10).', remediation: 'Only combine Sam and Mia: 4 + 2 = 6.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Simple Data Questions', subtopic_id: 307,
    question_text: 'A picture graph shows: Apples 🍎🍎🍎🍎, Oranges 🍊🍊🍊, Bananas 🍌🍌🍌🍌🍌. Each symbol = 1 fruit. If 2 bananas are eaten, how many bananas are left?',
    option_a: '3', option_b: '5', option_c: '7', option_d: '2',
    correct_answer: 'A',
    explanation: 'Initial bananas = 5. If 2 are eaten: 5 - 2 = 3 bananas left.',
    distractor_diagnostics: {
      B: { error: 'Student gave the original count of bananas without subtracting.', remediation: 'Subtract the 2 bananas that were eaten: 5 - 2 = 3.' },
      C: { error: 'Student added 5 + 2 = 7.', remediation: 'Eaten means removed: subtract 5 - 2 = 3.' },
      D: { error: 'Student stated the number eaten.', remediation: 'The question asks how many are left: 5 - 2 = 3.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Comparing Data', subtopic_id: 304,
    question_text: 'Class A has 4 girls and 5 boys. Class B has 3 girls and 7 boys. Which class has MORE total students, and by how many?',
    option_a: 'Class B, by 1 student', option_b: 'Class A, by 1 student', option_c: 'Both classes are equal', option_d: 'Class B, by 2 students',
    correct_answer: 'A',
    explanation: 'Class A total = 4 + 5 = 9. Class B total = 3 + 7 = 10. Class B has 10 - 9 = 1 more student.',
    distractor_diagnostics: {
      B: { error: 'Student chose Class A.', remediation: 'Class A has 9 students and Class B has 10 students; Class B has 1 more.' },
      C: { error: 'Student thought 9 equals 10.', remediation: 'Calculate totals: Class A has 9, Class B has 10. 10 > 9.' },
      D: { error: 'Student calculated difference as 2.', remediation: '10 - 9 = 1 student.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Counting Categories', subtopic_id: 305,
    question_text: 'In a game, 3 red tokens, 4 green tokens, and 3 yellow tokens are drawn. Are there more red tokens or yellow tokens?',
    option_a: 'They are equal (both have 3)', option_b: 'More red tokens', option_c: 'More yellow tokens', option_d: 'Green has the most',
    correct_answer: 'A',
    explanation: 'Red has 3 tokens and Yellow has 3 tokens. They have the exact same number.',
    distractor_diagnostics: {
      B: { error: 'Student guessed red.', remediation: 'Both red and yellow have 3 tokens, so they are equal.' },
      C: { error: 'Student guessed yellow.', remediation: 'Both red and yellow have 3 tokens: 3 = 3.' },
      D: { error: 'While green has 4, the question specifically compares red and yellow.', remediation: 'Read carefully: the question compares red and yellow, which are equal (3 each).' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Sorting & Categorizing Data', subtopic_id: 303,
    question_text: 'A child sorts 15 buttons into two piles: large buttons and small buttons. If there are 8 large buttons, how many small buttons are there?',
    option_a: '7', option_b: '8', option_c: '23', option_d: '9',
    correct_answer: 'A',
    explanation: 'Total buttons = 15. Subtract the large buttons: 15 - 8 = 7 small buttons.',
    distractor_diagnostics: {
      B: { error: 'Student repeated the number of large buttons.', remediation: 'Subtract 8 from 15: 15 - 8 = 7 small buttons.' },
      C: { error: 'Student added 15 + 8 = 23.', remediation: '15 is the total of both piles: subtract to find the other pile: 15 - 8 = 7.' },
      D: { error: 'Student miscalculated the subtraction.', remediation: '15 - 8 = 7.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Interpreting Data', subtopic_id: 308,
    question_text: 'A data table shows favorite seasons: Spring: 3, Summer: 7, Fall: 2, Winter: 4. How many MORE students chose Summer than Winter and Fall combined?',
    option_a: '1', option_b: '3', option_c: '5', option_d: '7',
    correct_answer: 'A',
    explanation: 'Winter and Fall combined = 4 + 2 = 6. Summer = 7. Subtract: 7 - 6 = 1.',
    distractor_diagnostics: {
      B: { error: 'Student compared Summer to Winter only (7 - 4 = 3).', remediation: 'Combine Winter and Fall first: 4 + 2 = 6; then 7 - 6 = 1.' },
      C: { error: 'Student compared Summer to Fall only (7 - 2 = 5).', remediation: 'Combine both Winter and Fall: 4 + 2 = 6, then subtract from Summer: 7 - 6 = 1.' },
      D: { error: 'Student just selected Summer\'s count.', remediation: 'Perform the two-step comparison: 7 - (4 + 2) = 1.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Simple Data Questions', subtopic_id: 307,
    question_text: 'A student makes a tally of birds seen: Robin: ||||, Bluejay: ||, Sparrow: |||||. How many FEWER Bluejays were seen than Sparrows?',
    option_a: '3', option_b: '5', option_c: '2', option_d: '7',
    correct_answer: 'A',
    explanation: 'Sparrows = 5, Bluejays = 2. Difference = 5 - 2 = 3.',
    distractor_diagnostics: {
      B: { error: 'Student gave the count of Sparrows.', remediation: 'Subtract Bluejays (2) from Sparrows (5): 5 - 2 = 3.' },
      C: { error: 'Student gave the count of Bluejays.', remediation: 'Find how many fewer by subtracting: 5 - 2 = 3.' },
      D: { error: 'Student added Sparrows and Bluejays: 5 + 2 = 7.', remediation: '"How many fewer" means subtract: 5 - 2 = 3.' }
    }
  }
];

const g2Questions = [
  // Low (8)
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'In a bar graph with scale 1 unit per line, the bar for "Cats" reaches up to 6 on the vertical axis. How many cats were counted?',
    option_a: '6', option_b: '5', option_c: '7', option_d: '1',
    correct_answer: 'A',
    explanation: 'The height of the bar corresponds to the number 6 on the axis, which represents 6 cats.',
    distractor_diagnostics: {
      B: { error: 'Student read one line below the top of the bar.', remediation: 'Look straight across from the top of the bar to the axis line: it aligns with 6.' },
      C: { error: 'Student read one line above the bar.', remediation: 'The bar ends at exactly 6.' },
      D: { error: 'Student stated the scale increment.', remediation: 'The bar height is 6 units.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'A horizontal bar graph shows lengths of ribbons: Red is 4 cm, Blue is 7 cm, and Yellow is 5 cm. Which ribbon is the LONGEST?',
    option_a: 'Blue', option_b: 'Red', option_c: 'Yellow', option_d: 'All are equal',
    correct_answer: 'A',
    explanation: 'Comparing lengths 4, 7, and 5 cm: 7 cm is the longest, which is the Blue ribbon.',
    distractor_diagnostics: {
      B: { error: 'Student chose the shortest ribbon (Red = 4 cm).', remediation: '"Longest" means greatest length: Blue is 7 cm.' },
      C: { error: 'Student chose the middle ribbon (Yellow = 5 cm).', remediation: '7 cm is greater than 5 cm, so Blue is longest.' },
      D: { error: 'The ribbons have different lengths: 4, 7, and 5.', remediation: 'Blue is the longest at 7 cm.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Line Plots', subtopic_id: 311,
    question_text: 'A line plot shows measurements of pencils in inches: there are three "X"s above 4 inches and two "X"s above 5 inches. How many pencils measured 4 inches?',
    option_a: '3', option_b: '4', option_c: '2', option_d: '5',
    correct_answer: 'A',
    explanation: 'Each X represents 1 pencil. There are 3 Xs above the number 4, meaning 3 pencils.',
    distractor_diagnostics: {
      B: { error: 'Student read the tick mark label (4 inches) instead of counting the Xs.', remediation: 'The number of Xs tells how many objects: count the Xs above 4: there are 3.' },
      C: { error: 'Student counted the Xs above 5.', remediation: 'Look at the column above 4: there are 3 Xs.' },
      D: { error: 'Student added 3 + 2 = 5 or read tick mark 5.', remediation: 'Count only the Xs above 4: 3 pencils.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Reading Data', subtopic_id: 312,
    question_text: 'A table shows students\' favorite sports: Soccer: 8, Baseball: 5, Basketball: 6. How many students chose Soccer?',
    option_a: '8', option_b: '5', option_c: '6', option_d: '19',
    correct_answer: 'A',
    explanation: 'Read directly from the table row for Soccer: 8 students.',
    distractor_diagnostics: {
      B: { error: 'Student read the row for Baseball.', remediation: 'Find Soccer in the table: it has 8 students.' },
      C: { error: 'Student read Basketball.', remediation: 'Soccer has 8 students.' },
      D: { error: 'Student added all students together.', remediation: 'The question asks only for Soccer: 8.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Frequency', subtopic_id: 313,
    question_text: 'What does the word "frequency" mean when looking at a data table?',
    option_a: 'How many times a value or item appears', option_b: 'How long an object is', option_c: 'The name of the graph', option_d: 'The color of the bars',
    correct_answer: 'A',
    explanation: 'Frequency means the number of times a particular event or value occurs in a data set.',
    distractor_diagnostics: {
      B: { error: 'Length is a physical measurement, not frequency.', remediation: 'Frequency is the count of occurrences (how many times something appears).' },
      C: { error: 'The name of a graph is the title.', remediation: 'Frequency represents counts or tallies.' },
      D: { error: 'Bar color is a design element.', remediation: 'Frequency is a numerical count.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Choosing Graphs', subtopic_id: 314,
    question_text: 'Which type of graph uses bars of different lengths or heights to compare categories?',
    option_a: 'Bar graph', option_b: 'Clock', option_c: 'Ruler', option_d: 'Tally mark',
    correct_answer: 'A',
    explanation: 'A bar graph displays categorical data using rectangular bars whose lengths/heights are proportional to the values.',
    distractor_diagnostics: {
      B: { error: 'A clock measures time.', remediation: 'A bar graph uses bars to represent data.' },
      C: { error: 'A ruler is a tool to measure length.', remediation: 'A bar graph is a visual graph for comparing data.' },
      D: { error: 'Tally marks are symbols used for counting, not full graphs with bars.', remediation: 'A graph with bars is called a bar graph.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'In a picture graph, each 😊 represents 1 happy face sticker. Liam has 😊😊😊😊 and Noah has 😊😊. How many stickers does Liam have?',
    option_a: '4', option_b: '2', option_c: '6', option_d: '8',
    correct_answer: 'A',
    explanation: 'Count Liam\'s stickers: 1, 2, 3, 4 stickers.',
    distractor_diagnostics: {
      B: { error: 'Student counted Noah\'s stickers.', remediation: 'Look at Liam\'s row: 4 smiley faces.' },
      C: { error: 'Student added Liam and Noah together (4 + 2 = 6).', remediation: 'The question asks only for Liam: 4 stickers.' },
      D: { error: 'Student doubled Liam\'s count.', remediation: 'Each symbol = 1: Liam has 4.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Line Plots', subtopic_id: 311,
    question_text: 'A teacher measures the lengths of 6 crayons and plots them on a line plot. How many total "X" marks should be on the line plot?',
    option_a: '6', option_b: '12', option_c: '1', option_d: '3',
    correct_answer: 'A',
    explanation: 'Each X on a line plot represents one object measured. For 6 crayons, there are 6 Xs in total.',
    distractor_diagnostics: {
      B: { error: 'Student doubled the count.', remediation: 'Every object gets exactly one X: 6 crayons = 6 Xs.' },
      C: { error: 'Student gave the value for one single crayon.', remediation: 'There must be an X for every crayon: 6 Xs.' },
      D: { error: 'Student divided by 2.', remediation: 'Total Xs equals total data points: 6.' }
    }
  },

  // Medium (9)
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'A bar graph shows fruit in a basket: Apples = 8, Bananas = 5, Oranges = 3. How many MORE apples are there than bananas?',
    option_a: '3', option_b: '5', option_c: '13', option_d: '2',
    correct_answer: 'A',
    explanation: 'Subtract the bananas from the apples: 8 - 5 = 3 more apples.',
    distractor_diagnostics: {
      B: { error: 'Student stated the number of bananas.', remediation: 'Subtract to find how many more: 8 - 5 = 3.' },
      C: { error: 'Student added apples and bananas (8 + 5 = 13).', remediation: '"How many more" requires subtraction: 8 - 5 = 3.' },
      D: { error: 'Student subtracted Oranges from Bananas (5 - 3 = 2).', remediation: 'Compare Apples (8) and Bananas (5): 8 - 5 = 3.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Line Plots', subtopic_id: 311,
    question_text: 'A line plot shows ribbon lengths in inches: Two Xs at 3 inches, four Xs at 4 inches, and one X at 6 inches. What is the MOST COMMON ribbon length?',
    option_a: '4 inches', option_b: '3 inches', option_c: '6 inches', option_d: '7 inches',
    correct_answer: 'A',
    explanation: 'The most common length has the highest stack of Xs. The 4-inch mark has 4 Xs, which is the most.',
    distractor_diagnostics: {
      B: { error: 'Student chose 3 inches (which has only 2 Xs).', remediation: 'The most common value has the most Xs: 4 inches has 4 Xs.' },
      C: { error: 'Student chose the largest number on the scale (6 inches) instead of the most frequent.', remediation: 'The most common length is the one with the most Xs (4 inches), not the largest measurement.' },
      D: { error: '7 inches has no Xs.', remediation: 'Look for the tallest column of Xs: 4 inches.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Reading Data', subtopic_id: 312,
    question_text: 'A data table shows books read by 3 students: Zoe = 6, Max = 9, Eli = 4. How many books did Zoe and Eli read TOGETHER?',
    option_a: '10', option_b: '13', option_c: '15', option_d: '19',
    correct_answer: 'A',
    explanation: 'Add Zoe\'s books and Eli\'s books: 6 + 4 = 10 books.',
    distractor_diagnostics: {
      B: { error: 'Student added Max and Eli (9 + 4 = 13).', remediation: 'Add Zoe (6) and Eli (4): 6 + 4 = 10.' },
      C: { error: 'Student added Zoe and Max (6 + 9 = 15).', remediation: 'Add Zoe and Eli: 6 + 4 = 10.' },
      D: { error: 'Student added all three students (6 + 9 + 4 = 19).', remediation: 'The question specifies only Zoe and Eli together: 6 + 4 = 10.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'In a bar graph, Red has 4 votes, Blue has 8 votes, and Green has 6 votes. How many votes were cast in ALL?',
    option_a: '18', option_b: '14', option_c: '12', option_d: '20',
    correct_answer: 'A',
    explanation: 'Add the votes from all categories: 4 + 8 + 6 = 18 votes in all.',
    distractor_diagnostics: {
      B: { error: 'Student added only Blue and Green (8 + 6 = 14).', remediation: 'Include Red as well: 4 + 8 + 6 = 18.' },
      C: { error: 'Student added only Red and Blue (4 + 8 = 12).', remediation: 'Add all three categories: 4 + 8 + 6 = 18.' },
      D: { error: 'Student made an addition error.', remediation: '4 + 8 = 12; 12 + 6 = 18.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Line Plots', subtopic_id: 311,
    question_text: 'On a line plot showing pencil lengths, the shortest pencil is 3 inches and the longest pencil is 8 inches. What is the difference in length between the longest and shortest pencils?',
    option_a: '5 inches', option_b: '11 inches', option_c: '8 inches', option_d: '3 inches',
    correct_answer: 'A',
    explanation: 'Subtract the shortest length from the longest length: 8 - 3 = 5 inches.',
    distractor_diagnostics: {
      B: { error: 'Student added 8 + 3 = 11.', remediation: 'Difference means subtract: 8 - 3 = 5 inches.' },
      C: { error: 'Student gave the longest length.', remediation: 'Subtract 8 - 3 = 5 inches.' },
      D: { error: 'Student gave the shortest length.', remediation: 'Subtract 8 - 3 = 5 inches.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Frequency', subtopic_id: 313,
    question_text: 'A student rolls a number cube 10 times and gets: 2, 4, 2, 5, 2, 6, 1, 2, 3, 2. What is the frequency of the number 2?',
    option_a: '5', option_b: '2', option_c: '4', option_d: '10',
    correct_answer: 'A',
    explanation: 'Count how many times 2 appears in the list: it appears 5 times. So its frequency is 5.',
    distractor_diagnostics: {
      B: { error: 'Student gave the number itself (2) instead of counting its frequency.', remediation: 'Frequency is the count of how many times 2 appears: count them (there are 5).' },
      C: { error: 'Student miscounted by 1.', remediation: 'Count each 2: 1st, 2nd, 3rd, 4th, 5th. Total = 5.' },
      D: { error: 'Student gave the total number of rolls.', remediation: 'The question asks for the frequency of 2 specifically: 5.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'A picture graph shows cars washed: Saturday 🚗🚗🚗🚗🚗, Sunday 🚗🚗🚗. If each 🚗 represents 2 cars, how many cars were washed on Saturday?',
    option_a: '10 cars', option_b: '5 cars', option_c: '7 cars', option_d: '6 cars',
    correct_answer: 'A',
    explanation: 'Each symbol represents 2 cars. Saturday has 5 symbols: 5 × 2 = 10 cars.',
    distractor_diagnostics: {
      B: { error: 'Student counted the symbols (5) without multiplying by the key (2).', remediation: 'Always check the key: each car symbol = 2 cars. 5 × 2 = 10 cars.' },
      C: { error: 'Student added 5 + 2 = 7.', remediation: 'Multiply the number of symbols by the key: 5 × 2 = 10.' },
      D: { error: 'Student calculated for Sunday: 3 × 2 = 6.', remediation: 'Look at Saturday: 5 symbols × 2 = 10 cars.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Choosing Graphs', subtopic_id: 314,
    question_text: 'Which display is BEST for showing how many students have heights of 40 inches, 41 inches, 42 inches, and 43 inches along a measurement scale?',
    option_a: 'A line plot', option_b: 'A pie chart with no numbers', option_c: 'A clock', option_d: 'A calendar',
    correct_answer: 'A',
    explanation: 'A line plot displays measurement data over a continuous numerical scale or number line.',
    distractor_diagnostics: {
      B: { error: 'Pie charts show parts of a whole, not continuous measurement line data.', remediation: 'Measurement data along a number scale is best shown on a line plot.' },
      C: { error: 'A clock measures time of day.', remediation: 'Use a line plot for measurements along a number line.' },
      D: { error: 'A calendar tracks dates.', remediation: 'Line plots are standard for length and height measurement data.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Reading Data', subtopic_id: 312,
    question_text: 'A bar graph shows pet ownership: 7 birds, 12 dogs, and 9 cats. How many FEWER birds are there than cats?',
    option_a: '2', option_b: '5', option_c: '9', option_d: '7',
    correct_answer: 'A',
    explanation: 'Cats = 9, Birds = 7. Subtract: 9 - 7 = 2.',
    distractor_diagnostics: {
      B: { error: 'Student compared dogs and birds (12 - 7 = 5).', remediation: 'Compare cats (9) and birds (7): 9 - 7 = 2.' },
      C: { error: 'Student gave the count of cats.', remediation: 'Subtract birds from cats: 9 - 7 = 2.' },
      D: { error: 'Student gave the count of birds.', remediation: 'Find the difference: 9 - 7 = 2.' }
    }
  },

  // High (8)
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'In a bar graph, Grade 2 collected 14 cans, Grade 3 collected 18 cans, and Grade 4 collected 12 cans. How many more cans did Grade 2 and Grade 4 collect TOGETHER than Grade 3?',
    option_a: '8', option_b: '26', option_c: '4', option_d: '6',
    correct_answer: 'A',
    explanation: 'Grade 2 + Grade 4 = 14 + 12 = 26 cans. Compare to Grade 3: 26 - 18 = 8 more cans.',
    distractor_diagnostics: {
      B: { error: 'Student found Grade 2 + Grade 4 (26) and forgot to subtract Grade 3.', remediation: 'Now subtract Grade 3\'s 18 cans: 26 - 18 = 8.' },
      C: { error: 'Student compared Grade 3 and Grade 2 only (18 - 14 = 4).', remediation: 'Combine Grade 2 and 4 first (14 + 12 = 26), then 26 - 18 = 8.' },
      D: { error: 'Student compared Grade 3 and Grade 4 only (18 - 12 = 6).', remediation: 'Add Grade 2 and 4 (26), then subtract Grade 3 (18): 26 - 18 = 8.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'In a picture graph, each 🏀 represents 2 points. Team A has 🏀🏀🏀🏀 and Team B has 🏀🏀🏀🏀🏀🏀. How many more points does Team B have than Team A?',
    option_a: '4 points', option_b: '2 points', option_c: '8 points', option_d: '12 points',
    correct_answer: 'A',
    explanation: 'Team B has 2 more symbols than Team A (6 - 4 = 2). Since each symbol = 2 points, 2 × 2 = 4 points. (Or: 12 - 8 = 4 points).',
    distractor_diagnostics: {
      B: { error: 'Student counted the difference in symbols (2) without multiplying by the key.', remediation: 'Multiply the 2 extra symbols by the key (2 points each): 2 × 2 = 4 points.' },
      C: { error: 'Student calculated Team A\'s total points (4 × 2 = 8).', remediation: 'Subtract Team A from Team B: 12 - 8 = 4 points.' },
      D: { error: 'Student calculated Team B\'s total points (6 × 2 = 12).', remediation: 'Find the difference between teams: 12 - 8 = 4 points.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Line Plots', subtopic_id: 311,
    question_text: 'A scientist measures 10 leaves in inches. On the line plot, there are two Xs at 2 in, three Xs at 3 in, four Xs at 4 in, and the rest at 5 in. How many Xs are at 5 in?',
    option_a: '1', option_b: '2', option_c: '9', option_d: '0',
    correct_answer: 'A',
    explanation: 'Total leaves = 10. Known leaves = 2 + 3 + 4 = 9. The remaining leaves at 5 in = 10 - 9 = 1 leaf (one X).',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated the remainder.', remediation: '2 + 3 + 4 = 9. Total is 10, so 10 - 9 = 1.' },
      C: { error: 'Student added 2 + 3 + 4 = 9 and gave that as the answer.', remediation: 'Subtract 9 from the total 10: 10 - 9 = 1.' },
      D: { error: 'Student thought all leaves were accounted for.', remediation: '9 leaves are accounted for, so 1 leaf must be at 5 inches: 10 - 9 = 1.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Reading Data', subtopic_id: 312,
    question_text: 'A bookstore tracks books sold: Mystery: 15, Sci-Fi: 8, Adventure: 12. If their goal was 40 books sold in total, how many more books do they need to sell?',
    option_a: '5', option_b: '35', option_c: '10', option_d: '8',
    correct_answer: 'A',
    explanation: 'Total sold so far = 15 + 8 + 12 = 35 books. Books needed = 40 - 35 = 5 books.',
    distractor_diagnostics: {
      B: { error: 'Student found the total sold so far (35) but did not subtract from the goal.', remediation: 'Subtract 35 from the goal of 40: 40 - 35 = 5 books needed.' },
      C: { error: 'Student miscalculated the difference: 40 - 35 = 5.', remediation: 'Count up from 35 to 40: 5 books.' },
      D: { error: 'Student stated the Sci-Fi count.', remediation: 'Total sold = 35; 40 - 35 = 5.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Line Plots', subtopic_id: 311,
    question_text: 'A line plot shows foot lengths in inches: 1 student at 6 in, 4 students at 7 in, and 3 students at 8 in. How many students have foot lengths GREATER than 6 inches?',
    option_a: '7', option_b: '8', option_c: '4', option_d: '3',
    correct_answer: 'A',
    explanation: '"Greater than 6 inches" means foot lengths of 7 and 8 inches: 4 + 3 = 7 students.',
    distractor_diagnostics: {
      B: { error: 'Student included the student at 6 inches (total students = 8).', remediation: '"Greater than 6" does not include 6 itself: count only 7 and 8 inches: 4 + 3 = 7.' },
      C: { error: 'Student only counted students at 7 inches.', remediation: 'Include students at 8 inches as well: 4 + 3 = 7.' },
      D: { error: 'Student only counted students at 8 inches.', remediation: 'Both 7 in and 8 in are greater than 6 in: 4 + 3 = 7.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Frequency', subtopic_id: 313,
    question_text: 'In a class of 20 students, a bar graph shows favorite juices: Apple = 8, Orange = 6, Grape = 4. The rest chose Cranberry. What is the frequency of Cranberry juice?',
    option_a: '2', option_b: '18', option_c: '4', option_d: '6',
    correct_answer: 'A',
    explanation: 'Sum of known juices = 8 + 6 + 4 = 18. Remaining students choosing Cranberry = 20 - 18 = 2 students.',
    distractor_diagnostics: {
      B: { error: 'Student found the sum of known juices (18) and did not subtract from 20.', remediation: 'Subtract 18 from the total 20 students: 20 - 18 = 2.' },
      C: { error: 'Student guessed Grape juice frequency.', remediation: '20 - (8 + 6 + 4) = 20 - 18 = 2.' },
      D: { error: 'Student miscalculated the subtraction.', remediation: '20 - 18 = 2.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'A bar graph has bars for 4 clubs: Art (12 members), Music (15 members), Chess (9 members), and Drama (14 members). What is the difference between the club with the MOST members and the club with the FEWEST members?',
    option_a: '6', option_b: '3', option_c: '5', option_d: '2',
    correct_answer: 'A',
    explanation: 'The club with the most members is Music (15). The club with the fewest is Chess (9). Difference = 15 - 9 = 6.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted Art from Music (15 - 12 = 3).', remediation: 'Compare the highest (Music = 15) with the lowest (Chess = 9): 15 - 9 = 6.' },
      C: { error: 'Student subtracted Drama from Music (15 - 14 = 1) or miscalculated.', remediation: 'Highest is 15, lowest is 9: 15 - 9 = 6.' },
      D: { error: 'Student subtracted Art from Drama (14 - 12 = 2).', remediation: 'Find the absolute maximum (15) and minimum (9): 15 - 9 = 6.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Choosing Graphs', subtopic_id: 314,
    question_text: 'Sam wants to show the number of sunny, cloudy, and rainy days in April. Which format allows easy comparison of the counts for each weather type?',
    option_a: 'A bar graph', option_b: 'A thermometer', option_c: 'A number sentence', option_d: 'A single tally mark',
    correct_answer: 'A',
    explanation: 'A bar graph is ideal for comparing distinct categorical groups (sunny, cloudy, rainy) side by side.',
    distractor_diagnostics: {
      B: { error: 'A thermometer measures temperature, not day counts.', remediation: 'A bar graph visually compares counts across categories.' },
      C: { error: 'A number sentence does not display visual comparison across categories.', remediation: 'A bar graph provides clear visual bars for comparing categories.' },
      D: { error: 'A single tally mark cannot display multi-category data.', remediation: 'Use a bar graph.' }
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

  console.log('Starting insertion of 50 questions for Grade 1 & Grade 2 Data Analysis...');
  const allQuestions = [...g1Questions, ...g2Questions];
  let inserted = 0;
  let updated = 0;

  for (const q of allQuestions) {
    const [existing] = await connection.execute(
      'SELECT id FROM questions WHERE question_text = ? AND grade = ? AND topic_id = 5',
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
          6, 5, NULL, ?, ?,
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
  await connection.end();
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
