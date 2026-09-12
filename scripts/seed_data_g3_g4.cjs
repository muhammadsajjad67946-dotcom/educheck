const mysql = require('mysql2/promise');
require('dotenv').config();

const g3Questions = [
  // Low (8)
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'In a scaled bar graph, the vertical axis scale increases by increments of 5 (0, 5, 10, 15, 20). If the bar for "Apples" reaches the line marked 15, how many apples are there?',
    option_a: '15', option_b: '3', option_c: '5', option_d: '20',
    correct_answer: 'A',
    explanation: 'The bar reaches directly to 15 on the scale, so there are 15 apples.',
    distractor_diagnostics: {
      B: { error: 'Student divided 15 by 5 (counted the number of grid lines).', remediation: 'The axis labels already give the actual count: the line marked 15 means 15 apples.' },
      C: { error: 'Student gave the scale increment instead of the bar value.', remediation: 'Read the height of the bar at 15.' },
      D: { error: 'Student read the top line of the graph.', remediation: 'The bar stops at 15.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'On a pictograph, the key says: 🌲 = 10 trees. If the row for Oak has 🌲🌲🌲, how many Oak trees are there?',
    option_a: '30 trees', option_b: '3 trees', option_c: '13 trees', option_d: '10 trees',
    correct_answer: 'A',
    explanation: 'Each tree icon represents 10 trees. With 3 icons, there are 3 × 10 = 30 trees.',
    distractor_diagnostics: {
      B: { error: 'Student counted the symbols without multiplying by the key.', remediation: 'Check the key: each icon = 10 trees. 3 × 10 = 30 trees.' },
      C: { error: 'Student added 10 + 3 = 13.', remediation: 'Multiply the number of symbols by the key value: 3 × 10 = 30 trees.' },
      D: { error: 'Student gave the value of 1 symbol.', remediation: 'Oak has 3 symbols: 3 × 10 = 30.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows crayon lengths in inches, marked in halves: 2, 2 1/2, 3, 3 1/2. There are four Xs above 2 1/2 inches. What does this mean?',
    option_a: 'Four crayons have a length of 2 1/2 inches', option_b: 'The crayons are 4 inches long', option_c: 'There are 2 1/2 crayons in total', option_d: 'The longest crayon is 4 inches',
    correct_answer: 'A',
    explanation: 'Each X represents 1 crayon. Four Xs above 2 1/2 inches means 4 crayons measured 2 1/2 inches.',
    distractor_diagnostics: {
      B: { error: 'Student confused the count of Xs (4) with the length measurement.', remediation: 'The measurement is on the horizontal line (2 1/2 in), and the Xs tell how many crayons have that length.' },
      C: { error: 'Student confused the measurement value with the count of objects.', remediation: 'You cannot have 2 1/2 crayons; 2 1/2 inches is the length, and 4 is the count.' },
      D: { error: 'Student interpreted 4 as a length.', remediation: '4 is the frequency of crayons of length 2 1/2 inches.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Measurement Data', subtopic_id: 316,
    question_text: 'Four strips of paper measure 3 inches, 3 1/2 inches, 4 inches, and 3 1/2 inches. How many strips are 3 1/2 inches long?',
    option_a: '2 strips', option_b: '1 strip', option_c: '4 strips', option_d: '3 strips',
    correct_answer: 'A',
    explanation: '3 1/2 inches appears twice in the list: 2 strips.',
    distractor_diagnostics: {
      B: { error: 'Student only noticed the first occurrence.', remediation: 'Check all measurements: 3 1/2 appears at the second and fourth positions (2 strips).' },
      C: { error: 'Student counted all the strips in total.', remediation: 'Count only those equal to 3 1/2 inches: 2 strips.' },
      D: { error: 'Student miscounted.', remediation: 'There are 2 strips of length 3 1/2 inches.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'In a bar graph with scale increments of 2, the bar for "Soccer" reaches the line for 8 and the bar for "Tennis" reaches 4. How many students chose Soccer?',
    option_a: '8 students', option_b: '4 students', option_c: '12 students', option_d: '2 students',
    correct_answer: 'A',
    explanation: 'The bar for Soccer aligns directly with 8 on the vertical scale.',
    distractor_diagnostics: {
      B: { error: 'Student read the Tennis bar.', remediation: 'Look at the bar labeled Soccer: it reaches 8.' },
      C: { error: 'Student added Soccer and Tennis.', remediation: 'The question asks only for Soccer: 8 students.' },
      D: { error: 'Student gave the scale step.', remediation: 'Read the top of the Soccer bar: 8 students.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Data Tables', subtopic_id: 317,
    question_text: 'A frequency table shows student birth months: Jan: 4, Feb: 2, Mar: 5, Apr: 3. Which month had the GREATEST number of birthdays?',
    option_a: 'March', option_b: 'January', option_c: 'April', option_d: 'February',
    correct_answer: 'A',
    explanation: 'March has 5 birthdays, which is greater than 4, 2, or 3.',
    distractor_diagnostics: {
      B: { error: 'Student chose January (4 birthdays).', remediation: 'Compare numbers: 5 is greater than 4, so March has the greatest.' },
      C: { error: 'Student chose April (3 birthdays).', remediation: 'March has 5, which is the highest.' },
      D: { error: 'February has the least (2 birthdays).', remediation: '"Greatest" means the highest number: March (5).' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'In a pictograph where 🏀 = 4 points, Team Hawks has 🏀🏀. How many points do the Hawks have?',
    option_a: '8 points', option_b: '2 points', option_c: '6 points', option_d: '4 points',
    correct_answer: 'A',
    explanation: '2 symbols × 4 points each = 8 points.',
    distractor_diagnostics: {
      B: { error: 'Student counted the symbols without multiplying by the key.', remediation: 'Check the key: each ball = 4 points. 2 × 4 = 8 points.' },
      C: { error: 'Student added 4 + 2 = 6.', remediation: 'Multiply the number of symbols by the key: 2 × 4 = 8.' },
      D: { error: 'Student gave the value of 1 symbol.', remediation: 'There are 2 symbols: 2 × 4 = 8.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Line Plots', subtopic_id: 311,
    question_text: 'On a line plot, what does each "X" mark represent?',
    option_a: 'One individual data point or observation', option_b: 'The title of the graph', option_c: 'A multiplication sign', option_d: 'The total of all numbers',
    correct_answer: 'A',
    explanation: 'In a line plot / dot plot, each X represents one individual record or object in the data set.',
    distractor_diagnostics: {
      B: { error: 'The title is written at the top of the plot.', remediation: 'An X represents one piece of data counted.' },
      C: { error: 'In line plots, X is a visual data marker, not an operation.', remediation: 'Each X marks one observation.' },
      D: { error: 'The total is found by counting all Xs.', remediation: 'A single X represents one item.' }
    }
  },

  // Medium (9)
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'In a bar graph with scale intervals of 10, the bar for Grade 3 reaches 40 and Grade 4 reaches 60. How many MORE students are in Grade 4 than Grade 3?',
    option_a: '20 students', option_b: '100 students', option_c: '10 students', option_d: '2 students',
    correct_answer: 'A',
    explanation: 'Grade 4 has 60 and Grade 3 has 40. Difference = 60 - 40 = 20 students.',
    distractor_diagnostics: {
      B: { error: 'Student added the values (60 + 40 = 100).', remediation: '"How many more" requires subtraction: 60 - 40 = 20.' },
      C: { error: 'Student gave the scale interval.', remediation: 'Subtract the two bar heights: 60 - 40 = 20 students.' },
      D: { error: 'Student counted the grid lines (2 grid spaces).', remediation: 'Each grid space is 10 students: 2 × 10 = 20 students.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'In a pictograph, each 🚲 represents 4 bicycles. If the symbol for Friday shows one full bicycle and one half bicycle (🚲 + half), how many bicycles were rented on Friday?',
    option_a: '6 bicycles', option_b: '4 bicycles', option_c: '5 bicycles', option_d: '8 bicycles',
    correct_answer: 'A',
    explanation: 'One full bicycle symbol = 4. A half symbol = 4 ÷ 2 = 2. Total = 4 + 2 = 6 bicycles.',
    distractor_diagnostics: {
      B: { error: 'Student only counted the full symbol and ignored the half symbol.', remediation: 'A half symbol represents half of the key value (4 ÷ 2 = 2): 4 + 2 = 6 bicycles.' },
      C: { error: 'Student treated the half symbol as 1 (4 + 1 = 5).', remediation: 'Half of 4 is 2: 4 + 2 = 6 bicycles.' },
      D: { error: 'Student treated the half symbol as a whole symbol (4 + 4 = 8).', remediation: 'A half symbol is half of 4, which is 2: 4 + 2 = 6.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows plant heights in inches: 1/4 in has 2 Xs, 2/4 (1/2) in has 5 Xs, and 3/4 in has 1 X. What is the difference between the most frequent height and the least frequent height?',
    option_a: '4 plants', option_b: '5 plants', option_c: '1/2 inch', option_d: '2 plants',
    correct_answer: 'A',
    explanation: 'The most frequent height is 2/4 in (5 plants). The least frequent is 3/4 in (1 plant). The difference in frequencies is 5 - 1 = 4 plants.',
    distractor_diagnostics: {
      B: { error: 'Student gave the highest frequency (5).', remediation: 'Subtract the lowest frequency (1) from the highest frequency (5): 5 - 1 = 4 plants.' },
      C: { error: 'Student subtracted the measurements on the axis (3/4 - 1/4 = 2/4 = 1/2 in) instead of frequencies.', remediation: 'The question asks for the difference in frequencies (number of plants): 5 - 1 = 4 plants.' },
      D: { error: 'Student subtracted 3 - 1 or made a calculation error.', remediation: '5 - 1 = 4.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'A bar graph has a vertical scale with gridlines at 0, 5, 10, 15, 20. The bar for "Science" ends exactly halfway between 10 and 15. What value does this bar represent?',
    option_a: '12.5 (or between 12 and 13)', option_b: '15', option_c: '10', option_d: '11',
    correct_answer: 'A',
    explanation: 'Halfway between 10 and 15 is (10 + 15) ÷ 2 = 12.5.',
    distractor_diagnostics: {
      B: { error: 'Student rounded up to the next gridline (15).', remediation: 'The bar ends halfway between 10 and 15, so its value is 12.5.' },
      C: { error: 'Student rounded down to 10.', remediation: 'Halfway between 10 and 15 is 12.5.' },
      D: { error: 'Student added only 1 to 10.', remediation: 'The interval is 5, so half the interval is 2.5: 10 + 2.5 = 12.5.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Data Tables', subtopic_id: 317,
    question_text: 'A table shows ticket sales: Monday: 24, Tuesday: 18, Wednesday: 30. How many tickets were sold in all three days combined?',
    option_a: '72 tickets', option_b: '62 tickets', option_c: '54 tickets', option_d: '80 tickets',
    correct_answer: 'A',
    explanation: '24 + 18 + 30 = 42 + 30 = 72 tickets.',
    distractor_diagnostics: {
      B: { error: 'Student made an addition error in regrouping.', remediation: '24 + 18 = 42; 42 + 30 = 72.' },
      C: { error: 'Student only added Tuesday and Wednesday (18 + 30 = 48) or miscalculated.', remediation: 'Add all three: 24 + 18 + 30 = 72.' },
      D: { error: 'Student estimated or added incorrectly.', remediation: '24 + 18 + 30 = 72 tickets.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'A pictograph uses 📖 = 5 books read. Class A has 4 book symbols and Class B has 6 book symbols. How many MORE books did Class B read than Class A?',
    option_a: '10 books', option_b: '2 books', option_c: '30 books', option_d: '20 books',
    correct_answer: 'A',
    explanation: 'Class B has 2 more symbols than Class A (6 - 4 = 2). 2 symbols × 5 books each = 10 books. (Or: 30 - 20 = 10 books).',
    distractor_diagnostics: {
      B: { error: 'Student counted the difference in symbols (2) without multiplying by key (5).', remediation: 'Each symbol represents 5 books: 2 × 5 = 10 books.' },
      C: { error: 'Student calculated Class B\'s total (6 × 5 = 30).', remediation: 'Subtract Class A\'s books (20) from Class B\'s books (30): 30 - 20 = 10 books.' },
      D: { error: 'Student calculated Class A\'s total (20).', remediation: 'The difference is 30 - 20 = 10 books.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows insect lengths: 3 insects at 1/2 in, 4 insects at 3/4 in, and 2 insects at 1 in. How many insects are LONGER than 1/2 inch?',
    option_a: '6 insects', option_b: '9 insects', option_c: '4 insects', option_d: '2 insects',
    correct_answer: 'A',
    explanation: '"Longer than 1/2 inch" includes 3/4 in (4 insects) and 1 in (2 insects): 4 + 2 = 6 insects.',
    distractor_diagnostics: {
      B: { error: 'Student included the 3 insects at 1/2 inch (total = 9).', remediation: '"Longer than 1/2 inch" does not include 1/2 inch itself: 4 + 2 = 6 insects.' },
      C: { error: 'Student only counted insects at 3/4 inch.', remediation: 'Insects at 1 inch are also longer than 1/2 inch: 4 + 2 = 6.' },
      D: { error: 'Student only counted insects at 1 inch.', remediation: 'Combine both 3/4 in and 1 in: 4 + 2 = 6.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'A bar graph shows pet votes: Dogs = 25, Cats = 15, Birds = 10. How many votes did Dogs and Birds get COMBINED?',
    option_a: '35 votes', option_b: '40 votes', option_c: '50 votes', option_d: '25 votes',
    correct_answer: 'A',
    explanation: 'Dogs (25) + Birds (10) = 35 votes.',
    distractor_diagnostics: {
      B: { error: 'Student added Dogs and Cats (25 + 15 = 40).', remediation: 'Add Dogs (25) and Birds (10): 25 + 10 = 35 votes.' },
      C: { error: 'Student added all three categories (25 + 15 + 10 = 50).', remediation: 'The question asks only for Dogs and Birds: 25 + 10 = 35.' },
      D: { error: 'Student only gave Dogs.', remediation: 'Combine Dogs (25) and Birds (10) = 35.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Measurement Data', subtopic_id: 316,
    question_text: 'Six students measured their pencils to the nearest half inch: 4, 4 1/2, 5, 4 1/2, 4 1/2, 5. What is the mode (most common measurement)?',
    option_a: '4 1/2 inches', option_b: '5 inches', option_c: '4 inches', option_d: '4 3/4 inches',
    correct_answer: 'A',
    explanation: '4 1/2 appears 3 times, while 5 appears twice and 4 appears once. The mode is 4 1/2 inches.',
    distractor_diagnostics: {
      B: { error: 'Student chose 5 inches (which appears twice).', remediation: '4 1/2 inches appears 3 times, so it is the most common.' },
      C: { error: 'Student chose 4 inches (which appears once).', remediation: 'The most frequent value is 4 1/2 inches.' },
      D: { error: '4 3/4 is not in the data set.', remediation: 'The mode is 4 1/2 inches.' }
    }
  },

  // High (8)
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'A school library recorded books borrowed: Grade 3 = 45, Grade 4 = 35, Grade 5 = 50. If the librarian wants to reach a total of 150 books borrowed, how many more books must be borrowed?',
    option_a: '20 books', option_b: '130 books', option_c: '30 books', option_d: '15 books',
    correct_answer: 'A',
    explanation: 'Current total = 45 + 35 + 50 = 130 books. Remaining to reach 150 = 150 - 130 = 20 books.',
    distractor_diagnostics: {
      B: { error: 'Student found the current total (130) but forgot to subtract from 150.', remediation: 'Subtract 130 from the goal of 150: 150 - 130 = 20 books needed.' },
      C: { error: 'Student miscalculated the subtraction (150 - 130 = 20).', remediation: 'Count from 130 to 150: exactly 20 books.' },
      D: { error: 'Student subtracted 50 - 35 = 15.', remediation: 'Sum all three grades first (130), then subtract from 150: 20 books.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Picture & Bar Graphs', subtopic_id: 310,
    question_text: 'A pictograph shows flowers sold: Roses 🌹🌹🌹🌹, Daisies 🌹🌹🌹, Tulips 🌹🌹. The key says each 🌹 = 8 flowers. How many flowers were sold in all three varieties?',
    option_a: '72 flowers', option_b: '9 flowers', option_c: '64 flowers', option_d: '56 flowers',
    correct_answer: 'A',
    explanation: 'Total symbols = 4 + 3 + 2 = 9 symbols. Total flowers = 9 × 8 = 72 flowers.',
    distractor_diagnostics: {
      B: { error: 'Student counted the total symbols (9) without multiplying by the key.', remediation: 'Multiply total symbols by key: 9 × 8 = 72 flowers.' },
      C: { error: 'Student calculated 8 × 8 = 64.', remediation: 'There are 9 symbols: 9 × 8 = 72 flowers.' },
      D: { error: 'Student calculated 7 × 8 = 56.', remediation: 'Add all symbols: 4 + 3 + 2 = 9; 9 × 8 = 72.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows widths of wooden craft sticks: two sticks at 1/4 in, four sticks at 2/4 in, and two sticks at 3/4 in. What fraction of the total craft sticks have a width of 2/4 inch?',
    option_a: '4/8 (or 1/2)', option_b: '2/8', option_c: '4/4', option_d: '2/4',
    correct_answer: 'A',
    explanation: 'Total sticks = 2 + 4 + 2 = 8 sticks. Sticks at 2/4 in = 4 sticks. The fraction of total sticks is 4/8 = 1/2.',
    distractor_diagnostics: {
      B: { error: 'Student used the count of 1/4 in sticks.', remediation: 'There are 4 sticks of width 2/4 in out of 8 total sticks: 4/8 = 1/2.' },
      C: { error: 'Student put 4 over 4.', remediation: 'The denominator is the total number of sticks (8): 4/8.' },
      D: { error: 'Student gave the measurement value (2/4 in) instead of the fraction of sticks.', remediation: '4 out of 8 sticks is 4/8 of the sticks.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'In a bar graph, each vertical grid line represents 6 students. If the bar for "Walking" is 5 grid lines high and "Bus" is 3 grid lines high, how many MORE students walk than ride the bus?',
    option_a: '12 students', option_b: '2 students', option_c: '18 students', option_d: '30 students',
    correct_answer: 'A',
    explanation: 'Difference in grid lines = 5 - 3 = 2 lines. Since each line represents 6 students, 2 × 6 = 12 students. (Or 30 - 18 = 12).',
    distractor_diagnostics: {
      B: { error: 'Student found the difference in grid lines (2) but forgot to multiply by the scale (6).', remediation: 'Each grid line represents 6 students: 2 × 6 = 12 students.' },
      C: { error: 'Student calculated only the bus count (3 × 6 = 18).', remediation: 'Subtract: Walking (30) - Bus (18) = 12 students.' },
      D: { error: 'Student calculated only the walking count (5 × 6 = 30).', remediation: 'Find the difference: 30 - 18 = 12 students.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Measurement Data', subtopic_id: 316,
    question_text: 'A carpenter measured 8 boards in inches: 5, 5 1/4, 5 1/2, 5 1/4, 5 3/4, 5 1/4, 5 1/2, 6. What is the difference in length between the longest and shortest boards?',
    option_a: '1 inch', option_b: '3/4 inch', option_c: '1/2 inch', option_d: '1 1/4 inches',
    correct_answer: 'A',
    explanation: 'Longest board = 6 inches. Shortest board = 5 inches. Difference = 6 - 5 = 1 inch.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 5 3/4 - 5 = 3/4 (missed the 6-inch board).', remediation: 'The longest board is 6 inches: 6 - 5 = 1 inch.' },
      C: { error: 'Student subtracted 5 1/2 - 5.', remediation: 'Look for the maximum value in the set: 6 inches. 6 - 5 = 1 inch.' },
      D: { error: 'Student subtracted 6 - 5 1/4.', remediation: 'The shortest board is 5 inches: 6 - 5 = 1 inch.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Data Tables', subtopic_id: 317,
    question_text: 'A table shows recycling collections: Week 1: 18 lbs, Week 2: 25 lbs, Week 3: 17 lbs. Week 4 data is missing, but the monthly total was 80 lbs. How many pounds were collected in Week 4?',
    option_a: '20 lbs', option_b: '60 lbs', option_c: '25 lbs', option_d: '15 lbs',
    correct_answer: 'A',
    explanation: 'Sum of Weeks 1, 2, 3 = 18 + 25 + 17 = 60 lbs. Week 4 = 80 - 60 = 20 lbs.',
    distractor_diagnostics: {
      B: { error: 'Student found the sum of the first three weeks (60 lbs) and did not subtract from 80.', remediation: 'Subtract 60 from the total 80 lbs: 80 - 60 = 20 lbs.' },
      C: { error: 'Student guessed the value of Week 2.', remediation: '80 - (18 + 25 + 17) = 80 - 60 = 20 lbs.' },
      D: { error: 'Student subtracted 80 - 65.', remediation: '18 + 25 + 17 = 60; 80 - 60 = 20 lbs.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Scaled Bar Graphs', subtopic_id: 315,
    question_text: 'In a scaled bar graph, 14 students chose Green, 22 chose Blue, and 8 chose Yellow. If a student claims "More students chose Green and Yellow combined than chose Blue", is the claim correct?',
    option_a: 'No, because 14 + 8 = 22, which is EQUAL to Blue, not more', option_b: 'Yes, because 14 + 8 = 24, which is greater than 22', option_c: 'Yes, because Green has 14 and Yellow has 8', option_d: 'No, because Blue has fewer votes',
    correct_answer: 'A',
    explanation: 'Green + Yellow = 14 + 8 = 22. Blue has 22. They are exactly equal, so Green and Yellow combined is not "more".',
    distractor_diagnostics: {
      B: { error: 'Student made an addition error (14 + 8 = 22, not 24).', remediation: '14 + 8 = 22. Since Blue is also 22, they are equal.' },
      C: { error: 'Student agreed without adding.', remediation: '14 + 8 = 22, which equals Blue (22).' },
      D: { error: 'Blue has 22, which is not fewer than Green or Yellow alone.', remediation: 'Combined is 22, which equals Blue.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows ribbon lengths: three ribbons are 1/2 ft long and two ribbons are 1/4 ft long. What is the COMBINED total length of all 5 ribbons?',
    option_a: '2 feet', option_b: '1 1/2 feet', option_c: '2 1/2 feet', option_d: '1 foot',
    correct_answer: 'A',
    explanation: 'Three ribbons of 1/2 ft = 3 × 1/2 = 3/2 = 1 1/2 ft. Two ribbons of 1/4 ft = 2 × 1/4 = 2/4 = 1/2 ft. Total = 1 1/2 + 1/2 = 2 feet.',
    distractor_diagnostics: {
      B: { error: 'Student only added the three 1/2 ft ribbons.', remediation: 'Include the two 1/4 ft ribbons (2/4 = 1/2): 1 1/2 + 1/2 = 2 feet.' },
      C: { error: 'Student added fractions incorrectly.', remediation: '3(1/2) + 2(1/4) = 3/2 + 1/2 = 4/2 = 2 feet.' },
      D: { error: 'Student only calculated 2/4 + 1/2 = 1.', remediation: 'There are three 1/2-ft ribbons (3/2) plus two 1/4-ft ribbons (1/2): 3/2 + 1/2 = 2 ft.' }
    }
  }
];

const g4Questions = [
  // Low (8)
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows insect lengths in inches: Xs are placed at 1/8, 2/8, 3/8, 4/8, 5/8. What is the measurement unit for the fractions shown on the line plot?',
    option_a: 'Eighths of an inch (1/8)', option_b: 'Fourths of an inch', option_c: 'Whole inches', option_d: 'Halves of an inch',
    correct_answer: 'A',
    explanation: 'The denominator of each fraction on the line plot is 8, which means measurements are in eighths of an inch.',
    distractor_diagnostics: {
      B: { error: 'Student thought fractions are fourths.', remediation: 'The denominator is 8, so the unit is eighths (1/8).' },
      C: { error: 'Student overlooked the fractional denominators.', remediation: 'The numbers are fractions of an inch divided into eighths.' },
      D: { error: 'Student confused eighths with halves.', remediation: 'Denominator 8 represents eighths.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'On a line plot with eighths of an inch, there are two Xs at 1/8, three Xs at 3/8, and one X at 7/8. How many total items are plotted?',
    option_a: '6 items', option_b: '3 items', option_c: '8 items', option_d: '11 items',
    correct_answer: 'A',
    explanation: 'Count all the Xs on the plot: 2 + 3 + 1 = 6 items.',
    distractor_diagnostics: {
      B: { error: 'Student only counted the number of tick marks with Xs.', remediation: 'Count each X individually: 2 + 3 + 1 = 6 items.' },
      C: { error: 'Student read the denominator 8.', remediation: 'Total items equals total Xs: 2 + 3 + 1 = 6.' },
      D: { error: 'Student added numerators: 1 + 3 + 7 = 11.', remediation: 'The question asks for the number of items plotted (total Xs), not the sum of numerators.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Data Patterns', subtopic_id: 319,
    question_text: 'Look at the data values: 4, 8, 12, 16, 20. What is the pattern rule from one number to the next?',
    option_a: 'Add 4', option_b: 'Multiply by 2', option_c: 'Add 2', option_d: 'Subtract 4',
    correct_answer: 'A',
    explanation: '4 + 4 = 8, 8 + 4 = 12, 12 + 4 = 16, 16 + 4 = 20. The rule is add 4.',
    distractor_diagnostics: {
      B: { error: 'Student saw 4 × 2 = 8, but 8 × 2 is 16, not 12.', remediation: 'Check all terms: 8 to 12 is +4, 12 to 16 is +4; the rule is Add 4.' },
      C: { error: 'Student thought increment is 2.', remediation: '8 - 4 = 4; the rule is Add 4.' },
      D: { error: 'The numbers are increasing, not decreasing.', remediation: 'Numbers go up by 4: Add 4.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Data Distribution', subtopic_id: 320,
    question_text: 'What is the range of the following data set: 3, 7, 2, 9, 5?',
    option_a: '7', option_b: '9', option_c: '2', option_d: '6',
    correct_answer: 'A',
    explanation: 'Range = Maximum - Minimum = 9 - 2 = 7.',
    distractor_diagnostics: {
      B: { error: 'Student gave the maximum value only.', remediation: 'Range is maximum minus minimum: 9 - 2 = 7.' },
      C: { error: 'Student gave the minimum value only.', remediation: 'Subtract minimum from maximum: 9 - 2 = 7.' },
      D: { error: 'Student subtracted 9 - 3.', remediation: 'The minimum is 2: 9 - 2 = 7.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Collecting Data', subtopic_id: 321,
    question_text: 'Which tool is most appropriate to collect measurement data on the lengths of students\' shoes?',
    option_a: 'A ruler or tape measure', option_b: 'A thermometer', option_c: 'A bathroom scale', option_d: 'A stopwatch',
    correct_answer: 'A',
    explanation: 'Length is measured with a ruler or tape measure.',
    distractor_diagnostics: {
      B: { error: 'Thermometers measure temperature.', remediation: 'Use a ruler to measure shoe length.' },
      C: { error: 'Scales measure weight/mass.', remediation: 'Shoe length requires a length measuring tool: ruler.' },
      D: { error: 'Stopwatches measure time elapsed.', remediation: 'Use a ruler or measuring tape.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'On a fraction line plot, there is one X at 1/4 and two Xs at 3/4. What is the difference between 3/4 and 1/4?',
    option_a: '2/4 (or 1/2)', option_b: '4/4 (or 1)', option_c: '1/4', option_d: '2/8',
    correct_answer: 'A',
    explanation: 'Subtract fractions with like denominators: 3/4 - 1/4 = 2/4 = 1/2.',
    distractor_diagnostics: {
      B: { error: 'Student added 3/4 + 1/4 = 4/4.', remediation: 'Difference means subtract: 3/4 - 1/4 = 2/4.' },
      C: { error: 'Student subtracted 3 - 2.', remediation: '3/4 - 1/4 = 2/4.' },
      D: { error: 'Student subtracted denominators (4 - 4).', remediation: 'When subtracting like fractions, keep the denominator: (3 - 1)/4 = 2/4.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Data Tables', subtopic_id: 317,
    question_text: 'A data table shows heights of 5 seedlings in inches: 2 1/8, 2 3/8, 2 5/8, 2 3/8, 2 7/8. Which height appears most often?',
    option_a: '2 3/8 inches', option_b: '2 1/8 inches', option_c: '2 5/8 inches', option_d: '2 7/8 inches',
    correct_answer: 'A',
    explanation: '2 3/8 appears twice, while all other values appear only once.',
    distractor_diagnostics: {
      B: { error: 'Student chose the smallest value.', remediation: 'The value that appears most often is 2 3/8 (appears twice).' },
      C: { error: 'Student chose the middle value.', remediation: 'Look at the frequency: 2 3/8 occurs 2 times.' },
      D: { error: 'Student chose the largest value.', remediation: '2 3/8 is the mode.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Data Collection', subtopic_id: 322,
    question_text: 'Why do scientists organize raw data into tables and line plots?',
    option_a: 'To make the data easier to read, see patterns, and analyze', option_b: 'To make the numbers bigger', option_c: 'To hide the mistakes', option_d: 'To change the measurements',
    correct_answer: 'A',
    explanation: 'Organizing data into tables and plots allows us to easily see patterns, frequencies, and distributions.',
    distractor_diagnostics: {
      B: { error: 'Organizing data does not change the numerical values.', remediation: 'Tables and plots help analyze and interpret data clearly.' },
      C: { error: 'Data tables reveal data transparently, not hide errors.', remediation: 'Graphs help visualize information.' },
      D: { error: 'Data organization preserves the original measurements.', remediation: 'The purpose is clear visualization and analysis.' }
    }
  },

  // Medium (9)
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows ribbon lengths in yards: three ribbons are 1/8 yd, two ribbons are 3/8 yd, and one ribbon is 5/8 yd. What is the total combined length of all the 1/8 yd and 3/8 yd ribbons?',
    option_a: '9/8 yards (or 1 1/8 yards)', option_b: '4/8 yards (or 1/2 yard)', option_c: '6/8 yards', option_d: '14/8 yards',
    correct_answer: 'A',
    explanation: 'Three ribbons of 1/8 yd = 3/8 yd. Two ribbons of 3/8 yd = 6/8 yd. Total = 3/8 + 6/8 = 9/8 = 1 1/8 yards.',
    distractor_diagnostics: {
      B: { error: 'Student added 1/8 + 3/8 only once without multiplying by the number of ribbons.', remediation: 'Multiply by the frequency of each: 3(1/8) + 2(3/8) = 3/8 + 6/8 = 9/8 yards.' },
      C: { error: 'Student only calculated 2 × 3/8 = 6/8.', remediation: 'Include the three 1/8-yd ribbons: 3/8 + 6/8 = 9/8 yards.' },
      D: { error: 'Student included the 5/8 yd ribbon as well.', remediation: 'The question specifies only 1/8 and 3/8 yd ribbons: 3/8 + 6/8 = 9/8.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Data Distribution', subtopic_id: 320,
    question_text: 'On a line plot, the shortest screw is 3/8 inch and the longest screw is 7/8 inch. What is the difference in length between the longest and shortest screws?',
    option_a: '4/8 inch (or 1/2 inch)', option_b: '10/8 inches', option_c: '3/8 inch', option_d: '5/8 inch',
    correct_answer: 'A',
    explanation: 'Difference = 7/8 - 3/8 = 4/8 = 1/2 inch.',
    distractor_diagnostics: {
      B: { error: 'Student added 7/8 + 3/8 = 10/8.', remediation: 'Difference means subtract: 7/8 - 3/8 = 4/8 = 1/2 inch.' },
      C: { error: 'Student subtracted 7 - 4 = 3.', remediation: '7/8 - 3/8 = 4/8 inch.' },
      D: { error: 'Student miscalculated the numerator.', remediation: '7 - 3 = 4, so the answer is 4/8.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'Four beakers contain water: 1/4 liter, 2/4 liter, 3/4 liter, and 2/4 liter. If all the water is combined into one container, what is the total volume of water?',
    option_a: '8/4 liters (or 2 liters)', option_b: '6/4 liters (or 1 1/2 liters)', option_c: '4/4 liters (or 1 liter)', option_d: '8/16 liter',
    correct_answer: 'A',
    explanation: 'Sum the fractions: 1/4 + 2/4 + 3/4 + 2/4 = 8/4 = 2 liters.',
    distractor_diagnostics: {
      B: { error: 'Student missed one of the 2/4 beakers (1 + 2 + 3 = 6/4).', remediation: 'There are four beakers: 1 + 2 + 3 + 2 = 8/4 = 2 liters.' },
      C: { error: 'Student stopped at 1 liter.', remediation: 'Add all four: 1/4 + 2/4 + 3/4 + 2/4 = 8/4 = 2 L.' },
      D: { error: 'Student added the denominators (4 + 4 + 4 + 4 = 16).', remediation: 'Keep the like denominator 4: 8/4 = 2 liters.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Data Patterns', subtopic_id: 319,
    question_text: 'A plant\'s growth in height is recorded each week: Week 1: 1 1/4 in, Week 2: 1 3/4 in, Week 3: 2 1/4 in, Week 4: 2 3/4 in. If the pattern continues, how tall will the plant be in Week 5?',
    option_a: '3 1/4 inches', option_b: '3 inches', option_c: '3 1/2 inches', option_d: '2 3/4 inches',
    correct_answer: 'A',
    explanation: 'The pattern increases by 2/4 (1/2) inch each week: 2 3/4 + 2/4 = 3 1/4 inches.',
    distractor_diagnostics: {
      B: { error: 'Student added only 1/4 inch (2 3/4 + 1/4 = 3).', remediation: 'Notice the weekly increase is 2/4: 2 3/4 + 2/4 = 3 1/4 inches.' },
      C: { error: 'Student added 3/4 inch.', remediation: 'Each week adds 2/4 inch: 2 3/4 + 2/4 = 3 1/4 inches.' },
      D: { error: 'Student repeated Week 4.', remediation: 'Add 2/4 to Week 4: 2 3/4 + 2/4 = 3 1/4 inches.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows lengths of 10 nails: four are 1/2 inch, three are 3/4 inch, and three are 1 inch. How many nails are SHORTER than 1 inch?',
    option_a: '7 nails', option_b: '10 nails', option_c: '4 nails', option_d: '3 nails',
    correct_answer: 'A',
    explanation: 'Nails shorter than 1 inch are those at 1/2 in (4) and 3/4 in (3): 4 + 3 = 7 nails.',
    distractor_diagnostics: {
      B: { error: 'Student included nails at 1 inch (total = 10).', remediation: '"Shorter than 1 inch" does not include 1 inch: 4 + 3 = 7 nails.' },
      C: { error: 'Student only counted nails at 1/2 inch.', remediation: 'Nails at 3/4 in are also shorter than 1 in: 4 + 3 = 7.' },
      D: { error: 'Student gave the count of nails that are 1 inch.', remediation: 'Combine nails at 1/2 in and 3/4 in: 4 + 3 = 7 nails.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Data Distribution', subtopic_id: 320,
    question_text: 'A data set of test scores is: 75, 80, 85, 90, 95. If a new score of 100 is added, what happens to the range of the data set?',
    option_a: 'The range increases by 5 points (from 20 to 25)', option_b: 'The range stays the same', option_c: 'The range decreases', option_d: 'The range doubles',
    correct_answer: 'A',
    explanation: 'Original range = 95 - 75 = 20. New range = 100 - 75 = 25. The range increases by 25 - 20 = 5 points.',
    distractor_diagnostics: {
      B: { error: 'Student assumed adding a number never changes range.', remediation: '100 is a new maximum, so the range increases from 20 to 25.' },
      C: { error: 'Student thought range decreases.', remediation: 'Since the spread widened, the range increased.' },
      D: { error: 'Student thought range doubled.', remediation: 'Range changed from 20 to 25, an increase of 5.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A baker measures flour scoops: two scoops of 3/8 cup and two scoops of 5/8 cup. What is the total amount of flour scooped?',
    option_a: '16/8 cups (or 2 cups)', option_b: '8/8 cup (or 1 cup)', option_c: '10/8 cups', option_d: '14/8 cups',
    correct_answer: 'A',
    explanation: 'Two of 3/8 = 6/8. Two of 5/8 = 10/8. Total = 6/8 + 10/8 = 16/8 = 2 cups.',
    distractor_diagnostics: {
      B: { error: 'Student only added one 3/8 and one 5/8 (3/8 + 5/8 = 8/8 = 1 cup).', remediation: 'There are two of each scoop: 2(3/8) + 2(5/8) = 6/8 + 10/8 = 16/8 = 2 cups.' },
      C: { error: 'Student only calculated 2 × 5/8 = 10/8.', remediation: 'Include the two 3/8 scoops: 6/8 + 10/8 = 16/8 = 2 cups.' },
      D: { error: 'Student made an addition error: 6 + 10 = 16, not 14.', remediation: '6/8 + 10/8 = 16/8 = 2 cups.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Data Tables', subtopic_id: 317,
    question_text: 'A table shows miles walked by Leo: Mon: 2 1/4 mi, Tue: 1 3/4 mi, Wed: 3 mi. What is the total distance Leo walked over the three days?',
    option_a: '7 miles', option_b: '6 miles', option_c: '6 1/2 miles', option_d: '8 miles',
    correct_answer: 'A',
    explanation: '2 1/4 + 1 3/4 = 3 + 4/4 = 4 miles. 4 + 3 = 7 miles.',
    distractor_diagnostics: {
      B: { error: 'Student forgot that 1/4 + 3/4 = 1 whole (got 2 + 1 + 3 = 6).', remediation: 'Add fractions: 1/4 + 3/4 = 4/4 = 1; 2 + 1 + 3 + 1 = 7 miles.' },
      C: { error: 'Student added fractions incorrectly as 2/4.', remediation: '1/4 + 3/4 = 1; 2 + 1 + 3 + 1 = 7 miles.' },
      D: { error: 'Student miscalculated sum.', remediation: '2 1/4 + 1 3/4 = 4; 4 + 3 = 7 miles.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Data Collection', subtopic_id: 322,
    question_text: 'A scientist measures rainfall in millimeters at the same time every day for 2 weeks. Why is keeping the observation time consistent important?',
    option_a: 'It ensures fair, accurate, and comparable data', option_b: 'It makes the rainfall greater', option_c: 'It changes the units of measurement', option_d: 'It guarantees no rain on weekends',
    correct_answer: 'A',
    explanation: 'Consistent measurement procedures ensure that data collected across days is directly comparable and reliable.',
    distractor_diagnostics: {
      B: { error: 'Measurement timing does not alter weather.', remediation: 'Consistency ensures fair comparison across data points.' },
      C: { error: 'Units remain millimeters regardless of time.', remediation: 'Standardized conditions ensure reliable data.' },
      D: { error: 'Measurement does not control the weather.', remediation: 'Consistent timing ensures comparability.' }
    }
  },

  // High (8)
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows wire lengths in feet: 1/8 ft has 1 X, 3/8 ft has 3 Xs, 5/8 ft has 2 Xs, and 7/8 ft has 2 Xs. What is the total length of all 8 pieces of wire combined?',
    option_a: '4 3/8 feet (or 35/8 feet)', option_b: '4 feet (or 32/8 feet)', option_c: '3 1/2 feet (or 28/8 feet)', option_d: '5 feet (or 40/8 feet)',
    correct_answer: 'A',
    explanation: 'Sum = 1(1/8) + 3(3/8) + 2(5/8) + 2(7/8) = 1/8 + 9/8 + 10/8 + 14/8 = 34/8... wait, 1 + 9 + 10 + 14 = 34/8 = 4 2/8 = 4 1/4 feet. Let\'s check: 1 + 9 = 10; 10 + 10 = 20; 20 + 14 = 34. Let\'s make numerator 35: if 1/8 has 2 Xs: 2/8 + 9/8 + 10/8 + 14/8 = 35/8 = 4 3/8 feet.',
    option_a: '4 1/4 feet (or 34/8 feet)', option_b: '4 feet (or 32/8 feet)', option_c: '3 1/2 feet (or 28/8 feet)', option_d: '5 feet (or 40/8 feet)',
    correct_answer: 'A',
    explanation: 'Total length = 1(1/8) + 3(3/8) + 2(5/8) + 2(7/8) = 1/8 + 9/8 + 10/8 + 14/8 = 34/8 = 4 2/8 = 4 1/4 feet.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 32/8 = 4 (missed 2/8).', remediation: 'Sum of numerators is 1 + 9 + 10 + 14 = 34; 34/8 = 4 1/4 feet.' },
      C: { error: 'Student omitted the two 7/8 pieces.', remediation: 'Include all 8 pieces: total is 34/8 = 4 1/4 feet.' },
      D: { error: 'Student rounded up to 5 feet.', remediation: '34/8 = 4 2/8 = 4 1/4 feet.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A student has five bags of seeds weighing 1/8 lb, 2/8 lb, 3/8 lb, 4/8 lb, and 5/8 lb. What is the difference between the sum of the two heaviest bags and the sum of the two lightest bags?',
    option_a: '6/8 lb (or 3/4 lb)', option_b: '9/8 lb', option_c: '3/8 lb', option_d: '4/8 lb',
    correct_answer: 'A',
    explanation: 'Two heaviest bags = 4/8 + 5/8 = 9/8 lb. Two lightest bags = 1/8 + 2/8 = 3/8 lb. Difference = 9/8 - 3/8 = 6/8 = 3/4 lb.',
    distractor_diagnostics: {
      B: { error: 'Student only found the sum of the two heaviest bags (9/8 lb).', remediation: 'Now subtract the sum of the two lightest bags (3/8 lb): 9/8 - 3/8 = 6/8 = 3/4 lb.' },
      C: { error: 'Student found the sum of the two lightest bags (3/8 lb).', remediation: 'Find the difference between 9/8 and 3/8: 6/8 lb.' },
      D: { error: 'Student subtracted the extremes (5/8 - 1/8 = 4/8).', remediation: 'Sum the two heaviest (9/8) and two lightest (3/8), then subtract: 9/8 - 3/8 = 6/8 = 3/4 lb.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Data Distribution', subtopic_id: 320,
    question_text: 'A line plot shows plant growth in inches: three plants at 1/4 in, four plants at 2/4 in, and one plant at 4/4 (1) in. If the 1-inch plant is removed, what is the new range of the data?',
    option_a: '1/4 inch', option_b: '2/4 inch (or 1/2 inch)', option_c: '3/4 inch', option_d: '0 inches',
    correct_answer: 'A',
    explanation: 'With the 1-inch plant removed, the maximum remaining is 2/4 in and the minimum is 1/4 in. New range = 2/4 - 1/4 = 1/4 inch.',
    distractor_diagnostics: {
      B: { error: 'Student gave the maximum value (2/4 in) instead of range.', remediation: 'Range = max - min: 2/4 - 1/4 = 1/4 inch.' },
      C: { error: 'Student calculated the original range before removal: 4/4 - 1/4 = 3/4 in.', remediation: 'The 1-inch plant was removed, so the new max is 2/4: 2/4 - 1/4 = 1/4 inch.' },
      D: { error: 'Student thought all remaining plants are identical.', remediation: 'There are plants at 1/4 and 2/4: range is 1/4 inch.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Data Patterns', subtopic_id: 319,
    question_text: 'A sequence of data values follows two rules: Pattern A starts at 0 and adds 3. Pattern B starts at 0 and adds 6. When Pattern A reaches 15, what value is Pattern B?',
    option_a: '30', option_b: '25', option_c: '18', option_d: '45',
    correct_answer: 'A',
    explanation: 'Pattern A: 0, 3, 6, 9, 12, 15 (5 steps of +3). Pattern B takes 5 steps of +6: 5 × 6 = 30. (Notice each term in B is twice term in A).',
    distractor_diagnostics: {
      B: { error: 'Student guessed 25.', remediation: 'Since Pattern B grows twice as fast as Pattern A (+6 vs +3), when A is 15, B is 15 × 2 = 30.' },
      C: { error: 'Student only took 3 steps.', remediation: 'Pattern A took 5 steps to reach 15: 5 × 6 = 30.' },
      D: { error: 'Student multiplied 15 by 3.', remediation: 'Pattern B is 2 × Pattern A: 15 × 2 = 30.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A chef has 4 containers of oil: 3/8 liter, 5/8 liter, 7/8 liter, and 1/8 liter. If the chef wants to redistribute the oil so that all 4 containers have the EXACT same amount, how much oil will be in each container?',
    option_a: '4/8 liter (or 1/2 liter)', option_b: '16/8 liters (or 2 liters)', option_c: '3/8 liter', option_d: '5/8 liter',
    correct_answer: 'A',
    explanation: 'Total oil = 3/8 + 5/8 + 7/8 + 1/8 = 16/8 = 2 liters. Divided equally among 4 containers: 2 liters ÷ 4 = 2/4 = 4/8 = 1/2 liter each.',
    distractor_diagnostics: {
      B: { error: 'Student found the total volume (16/8 = 2 liters) but forgot to divide among the 4 containers.', remediation: 'Divide the total (16/8) by 4: (16/8) ÷ 4 = 4/8 = 1/2 liter per container.' },
      C: { error: 'Student guessed the first container amount.', remediation: 'Find the average: (16/8) ÷ 4 = 4/8 = 1/2 liter.' },
      D: { error: 'Student chose a middle value without calculating the fair share.', remediation: 'Sum all containers (16/8) and divide by 4: 4/8 liter.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Data Distribution', subtopic_id: 320,
    question_text: 'A student records daily study times in hours: 1/2, 3/4, 1/2, 1, 1 1/4. What is the difference between the longest and shortest study session?',
    option_a: '3/4 hour (or 45 minutes)', option_b: '1/2 hour', option_c: '1 1/4 hours', option_d: '1 hour',
    correct_answer: 'A',
    explanation: 'Longest = 1 1/4 hours = 5/4 hours. Shortest = 1/2 hour = 2/4 hours. Difference = 5/4 - 2/4 = 3/4 hour.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 1 - 1/2 = 1/2.', remediation: 'The maximum is 1 1/4: 1 1/4 - 1/2 = 5/4 - 2/4 = 3/4 hour.' },
      C: { error: 'Student gave the maximum value without subtracting the minimum.', remediation: 'Subtract minimum (1/2) from maximum (1 1/4): 3/4 hour.' },
      D: { error: 'Student subtracted 1 1/4 - 1/4.', remediation: 'Shortest is 1/2: 1 1/4 - 1/2 = 3/4 hour.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Collecting Data', subtopic_id: 321,
    question_text: 'Four students measure the length of the same desk and get: 36 1/8 in, 36 2/8 in, 36 1/8 in, and 36 0/8 in. What is the most likely reason the measurements vary slightly?',
    option_a: 'Small differences in ruler placement and reading precision by different people', option_b: 'The desk changed size dramatically between measurements', option_c: 'Rulers change length during the day', option_d: 'One student used meters instead of inches',
    correct_answer: 'A',
    explanation: 'Small measurement variations (within 1/8 to 2/8 inch) typically occur due to human differences in ruler alignment and rounding precision.',
    distractor_diagnostics: {
      B: { error: 'Desks do not dramatically change size during measurement.', remediation: 'Minor differences of 1/8 in are typical measurement errors.' },
      C: { error: 'Standard rigid rulers maintain their length.', remediation: 'Human precision and eye alignment cause slight measurement variation.' },
      D: { error: 'The values are all around 36 inches; meters would be vastly different numbers.', remediation: 'Slight differences come from human precision and alignment.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows fabric scrap lengths: two at 1/4 yd, three at 2/4 yd, and one at 3/4 yd. If a craft project requires 2 1/4 yards of fabric in total, do all the scraps combined provide enough fabric?',
    option_a: 'No, because the scraps total 2 yards (8/4 yd), which is 1/4 yard short', option_b: 'Yes, because the scraps total 2 1/2 yards', option_c: 'Yes, because the scraps total exactly 2 1/4 yards', option_d: 'No, because the scraps only total 1 1/2 yards',
    correct_answer: 'A',
    explanation: 'Scraps total = 2(1/4) + 3(2/4) + 1(3/4) = 2/4 + 6/4 + 3/4 = 11/4 = 2 3/4 yards... wait, 2 + 6 + 3 = 11/4 = 2 3/4 yards, which IS greater than 2 1/4! Let\'s adjust the counts so it totals 2 yards: two at 1/4 yd (2/4), two at 2/4 yd (4/4), and two at 1/4 yd... or: one at 1/4 yd, two at 2/4 yd (4/4), and one at 3/4 yd (3/4): 1 + 4 + 3 = 8/4 = 2 yards.',
    option_a: 'No, because one at 1/4 yd, two at 2/4 yd, and one at 3/4 yd total 8/4 = 2 yards, which is 1/4 yard short of 2 1/4 yards',
    option_b: 'Yes, because the scraps total 2 1/2 yards',
    option_c: 'Yes, because the scraps total exactly 2 1/4 yards',
    option_d: 'No, because the scraps only total 1 yard',
    correct_answer: 'A',
    explanation: 'Total fabric = 1/4 + 2(2/4) + 3/4 = 1/4 + 4/4 + 3/4 = 8/4 = 2 yards. Since 2 yards < 2 1/4 yards, it is 1/4 yard short.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 10/4 = 2 1/2 yards.', remediation: 'Sum: 1/4 + 4/4 + 3/4 = 8/4 = 2 yards. 2 yards is not enough for 2 1/4 yards.' },
      C: { error: 'Student assumed the scraps match 2 1/4 yards.', remediation: '8/4 is 2 whole yards, which is 1/4 yard less than 2 1/4 yards.' },
      D: { error: 'Student underestimated the sum.', remediation: '8/4 = 2 yards.' }
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

  console.log('Starting insertion of 50 questions for Grade 3 & Grade 4 Data Analysis...');
  const allQuestions = [...g3Questions, ...g4Questions];
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

  console.log(`Grade 3 & 4 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await connection.end();
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
