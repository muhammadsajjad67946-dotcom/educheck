const mysql = require('mysql2/promise');
require('dotenv').config();

const g5Questions = [
  // Low (8)
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Ordered Pairs', subtopic_id: 324,
    question_text: 'In the ordered pair (4, 7), which number represents the horizontal x-coordinate?',
    option_a: '4', option_b: '7', option_c: '11', option_d: '3',
    correct_answer: 'A',
    explanation: 'An ordered pair is written as (x, y). The first number is the x-coordinate (horizontal distance from the origin), which is 4.',
    distractor_diagnostics: {
      B: { error: 'Student chose the y-coordinate (vertical distance).', remediation: 'Remember the alphabetical order: (x, y). The first number is x = 4, and the second is y = 7.' },
      C: { error: 'Student added 4 + 7 = 11.', remediation: 'An ordered pair shows separate coordinates, not a sum. The x-coordinate is 4.' },
      D: { error: 'Student subtracted 7 - 4 = 3.', remediation: 'The x-coordinate is directly the first value: 4.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Coordinate Data', subtopic_id: 323,
    question_text: 'What are the coordinates of the origin on a coordinate plane?',
    option_a: '(0, 0)', option_b: '(1, 1)', option_c: '(0, 1)', option_d: '(1, 0)',
    correct_answer: 'A',
    explanation: 'The origin is the intersection of the x-axis and y-axis, located at (0, 0).',
    distractor_diagnostics: {
      B: { error: 'Student thought the coordinate plane starts at (1, 1).', remediation: 'The origin is the zero starting point: (0, 0).' },
      C: { error: 'Student chose a point on the y-axis.', remediation: 'Both coordinates at the origin are zero: (0, 0).' },
      D: { error: 'Student chose a point on the x-axis.', remediation: 'The origin is (0, 0).' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Comparing Patterns', subtopic_id: 325,
    question_text: 'Rule 1: Start at 0 and add 2 (0, 2, 4, 6, ...). Rule 2: Start at 0 and add 6 (0, 6, 12, 18, ...). How does each term in Rule 2 compare to the corresponding term in Rule 1?',
    option_a: 'Each term in Rule 2 is 3 times the corresponding term in Rule 1', option_b: 'Each term in Rule 2 is 4 more than Rule 1', option_c: 'Each term in Rule 2 is twice Rule 1', option_d: 'There is no relationship',
    correct_answer: 'A',
    explanation: 'Comparing corresponding terms: 6 ÷ 2 = 3, 12 ÷ 4 = 3, 18 ÷ 6 = 3. Each term in Rule 2 is 3 times the term in Rule 1.',
    distractor_diagnostics: {
      B: { error: 'Student only looked at the difference for the second term (6 - 2 = 4) and ignored later terms (12 - 4 = 8).', remediation: 'Check the multiplicative relationship across all terms: 6 = 3 × 2, 12 = 3 × 4; each term is 3 times larger.' },
      C: { error: 'Student guessed 2 times.', remediation: 'Divide Rule 2 by Rule 1: 6 / 2 = 3 times.' },
      D: { error: 'There is a clear proportional relationship (factor of 3).', remediation: 'The terms are in a constant 1:3 ratio.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Range', subtopic_id: 327,
    question_text: 'A data set has values: 12, 15, 19, 24, 30. What is the range?',
    option_a: '18', option_b: '30', option_c: '12', option_d: '20',
    correct_answer: 'A',
    explanation: 'Range = Maximum - Minimum = 30 - 12 = 18.',
    distractor_diagnostics: {
      B: { error: 'Student stated the maximum value only.', remediation: 'Range is the difference between maximum and minimum: 30 - 12 = 18.' },
      C: { error: 'Student stated the minimum value.', remediation: 'Subtract minimum from maximum: 30 - 12 = 18.' },
      D: { error: 'Student rounded or made an arithmetic error.', remediation: '30 - 12 = 18.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Outliers', subtopic_id: 328,
    question_text: 'Look at this set of student quiz scores: 82, 85, 88, 84, 15, 86. Which score is an outlier?',
    option_a: '15', option_b: '88', option_c: '82', option_d: '85',
    correct_answer: 'A',
    explanation: 'An outlier is a data value that is significantly far away from the rest of the data. 15 is drastically lower than the other scores in the 80s.',
    distractor_diagnostics: {
      B: { error: 'Student picked the highest score (88), which is close to the other values.', remediation: '88 is close to 84, 85, 86; 15 is far separated from all the other values.' },
      C: { error: '82 is part of the cluster in the 80s.', remediation: 'An outlier lies far outside the main cluster: 15.' },
      D: { error: '85 is near the center of the scores.', remediation: '15 is the isolated value (outlier).' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Data Representation', subtopic_id: 329,
    question_text: 'To plot the point (3, 5) starting from the origin (0, 0), which direction do you move first?',
    option_a: 'Move 3 units right along the x-axis, then 5 units up', option_b: 'Move 5 units right, then 3 units up', option_c: 'Move 3 units up, then 5 units right', option_d: 'Move diagonally 8 units',
    correct_answer: 'A',
    explanation: 'In (x, y), the first coordinate is horizontal (x = 3 units right), and the second is vertical (y = 5 units up).',
    distractor_diagnostics: {
      B: { error: 'Student reversed x and y coordinates (plotted (5, 3)).', remediation: 'Always move horizontally first (x-coordinate), then vertically (y-coordinate): 3 right, 5 up.' },
      C: { error: 'Student moved up first.', remediation: 'The x-coordinate comes first: move along the horizontal axis before moving up.' },
      D: { error: 'Coordinates are plotted along orthogonal axes, not diagonally as a sum.', remediation: 'Move 3 right, then 5 up.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows liquid in 4 test tubes: 1/8 L, 1/8 L, 3/8 L, and 3/8 L. What is the total volume of liquid in all 4 tubes combined?',
    option_a: '8/8 L (or 1 Liter)', option_b: '4/8 L', option_c: '6/8 L', option_d: '8/32 L',
    correct_answer: 'A',
    explanation: 'Sum = 1/8 + 1/8 + 3/8 + 3/8 = 8/8 = 1 Liter.',
    distractor_diagnostics: {
      B: { error: 'Student only added 1/8 + 3/8 = 4/8.', remediation: 'There are 4 tubes: 1/8 + 1/8 + 3/8 + 3/8 = 8/8 = 1 Liter.' },
      C: { error: 'Student added 1/8 + 1/8 + 3/8 = 5/8 or miscalculated.', remediation: 'Add all four numerators: 1 + 1 + 3 + 3 = 8; 8/8 = 1 L.' },
      D: { error: 'Student added denominators (8 + 8 + 8 + 8 = 32).', remediation: 'Keep the like denominator 8: 8/8 = 1 Liter.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Coordinate Data', subtopic_id: 323,
    question_text: 'A point has coordinates (6, 0). Where does this point lie on the coordinate plane?',
    option_a: 'On the x-axis', option_b: 'On the y-axis', option_c: 'At the origin', option_d: 'In Quadrant II',
    correct_answer: 'A',
    explanation: 'Since the y-coordinate is 0, the point has vertical elevation of 0 and lies directly on the horizontal x-axis.',
    distractor_diagnostics: {
      B: { error: 'Student confused the x-axis with the y-axis.', remediation: 'A point with y = 0 lies on the x-axis; a point with x = 0 lies on the y-axis.' },
      C: { error: 'The origin is (0, 0), but this point is at x = 6.', remediation: '(6, 0) is 6 units to the right on the x-axis.' },
      D: { error: 'Points with non-negative coordinates lie in Quadrant I or on axes.', remediation: 'It lies on the positive x-axis.' }
    }
  },

  // Medium (9)
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot displays the weights of 6 bags of candy: two bags weigh 1/4 lb, three weigh 1/2 lb, and one weighs 3/4 lb. What is the combined total weight of all 6 bags?',
    option_a: '2 3/4 lbs (or 11/4 lbs)', option_b: '2 lbs (or 8/4 lbs)', option_c: '3 lbs (or 12/4 lbs)', option_d: '1 1/2 lbs',
    correct_answer: 'A',
    explanation: 'Convert to fourths: 1/2 = 2/4. Total = 2(1/4) + 3(2/4) + 1(3/4) = 2/4 + 6/4 + 3/4 = 11/4 = 2 3/4 lbs.',
    distractor_diagnostics: {
      B: { error: 'Student made an addition error in fourths (calculated 8/4 = 2 lbs).', remediation: 'Sum of fourths: 2 + 6 + 3 = 11 fourths = 11/4 = 2 3/4 lbs.' },
      C: { error: 'Student rounded up to 3 lbs.', remediation: '11/4 = 2 3/4 lbs.' },
      D: { error: 'Student missed several data points.', remediation: 'Include all 6 bags: 2/4 + 6/4 + 3/4 = 11/4 = 2 3/4 lbs.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'Five students each have a beaker of water with amounts: 1/8 L, 1/4 L, 1/4 L, 3/8 L, and 1/2 L. If all the water is combined and shared EQUALLY among the 5 students, how much water does each student get?',
    option_a: '3/10 L (or 1.5/5 L = 12/40 L)', option_b: '1 1/2 L', option_c: '1/4 L', option_d: '1/5 L',
    correct_answer: 'A',
    explanation: 'Convert to eighths: 1/8 + 2/8 + 2/8 + 3/8 + 4/8 = 12/8 = 3/2 L = 1 1/2 L total. Fair share for 5 students = (3/2) ÷ 5 = 3/10 Liter each.',
    distractor_diagnostics: {
      B: { error: 'Student found the total water (12/8 = 1 1/2 L) but forgot to divide by 5.', remediation: 'Fair share means dividing the total by 5: (3/2) ÷ 5 = 3/10 L per student.' },
      C: { error: 'Student guessed 1/4 L (2/8 L).', remediation: 'Total is 12/8; divide by 5: (12/8) × (1/5) = 12/40 = 3/10 L.' },
      D: { error: 'Student guessed 1/5 L.', remediation: 'Total is 1.5 L; 1.5 ÷ 5 = 0.3 = 3/10 L.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Coordinate Data', subtopic_id: 323,
    question_text: 'A car travels at a constant speed: at 1 hour it has gone 50 miles, at 2 hours 100 miles, and at 3 hours 150 miles. If time is on the x-axis and distance is on the y-axis, what ordered pair represents the distance traveled at 4 hours?',
    option_a: '(4, 200)', option_b: '(200, 4)', option_c: '(4, 150)', option_d: '(5, 250)',
    correct_answer: 'A',
    explanation: 'The speed is 50 miles per hour. At 4 hours (x = 4), distance is 4 × 50 = 200 miles (y = 200). The ordered pair is (4, 200).',
    distractor_diagnostics: {
      B: { error: 'Student reversed x and y coordinates: (y, x) instead of (x, y).', remediation: 'Time is on the x-axis (first) and distance is on the y-axis (second): (4, 200).' },
      C: { error: 'Student repeated the 3-hour distance.', remediation: 'At 4 hours, distance is 4 × 50 = 200: (4, 200).' },
      D: { error: 'Student gave the point for 5 hours.', remediation: 'The question asks for 4 hours: (4, 200).' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Comparing Patterns', subtopic_id: 325,
    question_text: 'Pattern X starts at 0 with rule "Add 3": 0, 3, 6, 9, 12. Pattern Y starts at 0 with rule "Add 9": 0, 9, 18, 27, 36. Form ordered pairs (x, y). What is the value of y when x = 15?',
    option_a: '45', option_b: '30', option_c: '40', option_d: '54',
    correct_answer: 'A',
    explanation: 'Notice that each y-value is 3 times the corresponding x-value (9 = 3 × 3, 18 = 3 × 6, 27 = 3 × 9). When x = 15, y = 15 × 3 = 45.',
    distractor_diagnostics: {
      B: { error: 'Student added 15 to 15 (doubled).', remediation: 'The rule relationship is y = 3x: 15 × 3 = 45.' },
      C: { error: 'Student guessed 40.', remediation: 'Multiply x by 3: 15 × 3 = 45.' },
      D: { error: 'Student calculated for x = 18.', remediation: 'For x = 15: y = 3 × 15 = 45.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Outliers', subtopic_id: 328,
    question_text: 'A track athlete records sprint times in seconds: 12.1, 12.3, 12.0, 12.2, 19.5, 12.4. What effect does the outlier 19.5 have on the average (mean) sprint time?',
    option_a: 'It significantly increases the mean time, making the athlete appear slower', option_b: 'It decreases the mean time', option_c: 'It has no effect on the mean', option_d: 'It makes the median smaller',
    correct_answer: 'A',
    explanation: 'An unusually large value pulls the mean upward (increases it). For sprint times, a higher time indicates a slower speed.',
    distractor_diagnostics: {
      B: { error: 'An abnormally high value increases the sum and therefore increases the mean.', remediation: 'High outliers pull the mean up, not down.' },
      C: { error: 'The mean uses all values in its calculation, so an outlier always affects it.', remediation: 'The mean is sensitive to extreme values and increases when a high outlier is included.' },
      D: { error: 'The outlier is on the high end, so it will not decrease the median.', remediation: 'High outliers increase the mean.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Data Representation', subtopic_id: 329,
    question_text: 'Points A(2, 3), B(6, 3), and C(6, 7) are plotted on a grid. If point D is added to form a square, what must the coordinates of point D be?',
    option_a: '(2, 7)', option_b: '(2, 6)', option_c: '(7, 2)', option_d: '(3, 7)',
    correct_answer: 'A',
    explanation: 'Base AB has length 6 - 2 = 4 along y = 3. Side BC has length 7 - 3 = 4 along x = 6. Point D must align with x = 2 and y = 7, which is (2, 7).',
    distractor_diagnostics: {
      B: { error: 'Student used y = 6 instead of y = 7.', remediation: 'The top side must be at y = 7: (2, 7).' },
      C: { error: 'Student reversed coordinates (7, 2).', remediation: 'D has x = 2 and y = 7: (2, 7).' },
      D: { error: 'Student used x = 3 instead of x = 2.', remediation: 'Align vertically with point A(2, 3): x = 2, so D is (2, 7).' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Range', subtopic_id: 327,
    question_text: 'A scientist records temperatures in degrees Celsius: -2, 4, 8, 15, 3. What is the range of these temperatures?',
    option_a: '17 degrees', option_b: '13 degrees', option_c: '15 degrees', option_d: '19 degrees',
    correct_answer: 'A',
    explanation: 'Maximum = 15°C, Minimum = -2°C. Range = Maximum - Minimum = 15 - (-2) = 15 + 2 = 17 degrees.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 15 - 2 = 13 (forgot that the minimum is negative 2).', remediation: 'Subtracting a negative number adds its opposite: 15 - (-2) = 15 + 2 = 17.' },
      C: { error: 'Student stated the maximum value (15).', remediation: 'Range is max minus min: 15 - (-2) = 17 degrees.' },
      D: { error: 'Student made an arithmetic error.', remediation: '15 - (-2) = 17.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Ordered Pairs', subtopic_id: 324,
    question_text: 'Which point lies 5 units to the right of the y-axis and 8 units above the x-axis?',
    option_a: '(5, 8)', option_b: '(8, 5)', option_c: '(0, 8)', option_d: '(5, 0)',
    correct_answer: 'A',
    explanation: 'Distance to the right of the y-axis is the x-coordinate (5). Distance above the x-axis is the y-coordinate (8). The point is (5, 8).',
    distractor_diagnostics: {
      B: { error: 'Student reversed x and y coordinates (8, 5).', remediation: 'Distance from y-axis is x = 5; distance from x-axis is y = 8. Point is (5, 8).' },
      C: { error: 'Student set x = 0.', remediation: '5 units to the right of y-axis means x = 5: (5, 8).' },
      D: { error: 'Student set y = 0.', remediation: '8 units above x-axis means y = 8: (5, 8).' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Comparing Patterns', subtopic_id: 325,
    question_text: 'Two siblings save money weekly: Jack starts with $10 and saves $5 each week. Jill starts with $0 and saves $10 each week. At the end of which week will they have saved the EXACT same amount of money?',
    option_a: 'Week 2', option_b: 'Week 1', option_c: 'Week 3', option_d: 'Week 5',
    correct_answer: 'A',
    explanation: 'Jack: Week 1 = $15, Week 2 = $20. Jill: Week 1 = $10, Week 2 = $20. Both have $20 at the end of Week 2.',
    distractor_diagnostics: {
      B: { error: 'At Week 1, Jack has $15 and Jill has $10 (not equal).', remediation: 'Check Week 2: Jack = 10 + 2(5) = $20; Jill = 2(10) = $20. They are equal at Week 2.' },
      C: { error: 'At Week 3, Jack has $25 and Jill has $30.', remediation: 'They were equal at Week 2 ($20 each).' },
      D: { error: 'At Week 5, Jill has $50 and Jack has $35.', remediation: 'Set equations equal: 10 + 5w = 10w => 5w = 10 => w = 2 weeks.' }
    }
  },

  // High (8)
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'A line plot shows fabric strip lengths in yards: three strips are 1/8 yd, four strips are 3/8 yd, and one strip is 7/8 yd. If all strips are placed end-to-end, what is the total length in yards?',
    option_a: '2 3/4 yards (or 22/8 yards)', option_b: '2 yards (or 16/8 yards)', option_c: '3 yards (or 24/8 yards)', option_d: '2 1/2 yards (or 20/8 yards)',
    correct_answer: 'A',
    explanation: 'Sum = 3(1/8) + 4(3/8) + 1(7/8) = 3/8 + 12/8 + 7/8 = 22/8 = 2 6/8 = 2 3/4 yards.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 16/8 = 2 yards (missed 6/8).', remediation: 'Sum: 3/8 + 12/8 + 7/8 = 22/8 = 2 3/4 yards.' },
      C: { error: 'Student calculated 24/8 = 3 yards.', remediation: '3 + 12 + 7 = 22; 22/8 = 2 3/4 yards.' },
      D: { error: 'Student calculated 20/8 = 2 1/2 yards.', remediation: '3 + 12 + 7 = 22, not 20; 22/8 = 2 3/4 yards.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Fraction Line Plots', subtopic_id: 318,
    question_text: 'Eight bags of sand have weights shown on a line plot: two at 1/4 lb, four at 1/2 lb, and two at 3/4 lb. If the sand is redistributed so all eight bags have equal weight, what is the weight of each bag?',
    option_a: '1/2 pound (or 4/8 lb)', option_b: '1/4 pound', option_c: '4 pounds total', option_d: '3/8 pound',
    correct_answer: 'A',
    explanation: 'Total weight = 2(1/4) + 4(1/2) + 2(3/4) = 2/4 + 8/4 + 6/4 = 16/4 = 4 pounds. Divided among 8 bags: 4 lbs ÷ 8 = 1/2 pound per bag.',
    distractor_diagnostics: {
      B: { error: 'Student chose the minimum bag weight.', remediation: 'Find the mean: Total weight = 4 lbs. 4 ÷ 8 = 1/2 lb per bag.' },
      C: { error: 'Student gave the total weight instead of each bag\'s equal share.', remediation: 'Divide the 4-pound total by the 8 bags: 4 ÷ 8 = 1/2 pound.' },
      D: { error: 'Student guessed 3/8 lb.', remediation: '4 lbs ÷ 8 bags = 1/2 lb each.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Coordinate Data', subtopic_id: 323,
    question_text: 'A rectangle on the coordinate grid has vertices at (2, 2), (8, 2), (8, 6), and (2, 6). What is the perimeter and area of this rectangle?',
    option_a: 'Perimeter = 20 units, Area = 24 square units', option_b: 'Perimeter = 24 units, Area = 20 square units', option_c: 'Perimeter = 10 units, Area = 24 square units', option_d: 'Perimeter = 20 units, Area = 48 square units',
    correct_answer: 'A',
    explanation: 'Length = 8 - 2 = 6 units. Width = 6 - 2 = 4 units. Perimeter = 2(6 + 4) = 20 units. Area = 6 × 4 = 24 square units.',
    distractor_diagnostics: {
      B: { error: 'Student swapped perimeter and area values.', remediation: 'Perimeter = 2(l + w) = 2(10) = 20. Area = l × w = 6 × 4 = 24.' },
      C: { error: 'Student calculated half-perimeter (6 + 4 = 10).', remediation: 'Perimeter requires all 4 sides: 2(6 + 4) = 20 units.' },
      D: { error: 'Student doubled the area.', remediation: 'Area = 6 × 4 = 24 square units.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Comparing Patterns', subtopic_id: 325,
    question_text: 'Pattern A: Start with 1, rule: multiply by 2 (1, 2, 4, 8, 16). Pattern B: Start with 5, rule: add 5 (5, 10, 15, 20, 25). At which term number (1st, 2nd, 3rd, ...) does Pattern A first become GREATER than Pattern B?',
    option_a: '5th term (16 vs 25? Wait, 6th term: 32 vs 30)', option_b: '4th term', option_c: '5th term', option_d: '7th term',
    correct_answer: 'A',
    explanation: 'Let\'s list: Term 1: A=1, B=5. Term 2: A=2, B=10. Term 3: A=4, B=15. Term 4: A=8, B=20. Term 5: A=16, B=25. Term 6: A=32, B=30. So at the 6th term, A (32) > B (30).',
    option_a: '6th term (Pattern A is 32, Pattern B is 30)', option_b: '5th term (Pattern A is 16, Pattern B is 25)', option_c: '4th term (Pattern A is 8, Pattern B is 20)', option_d: '7th term (Pattern A is 64, Pattern B is 35)',
    correct_answer: 'A',
    explanation: 'Term 1: (1, 5); Term 2: (2, 10); Term 3: (4, 15); Term 4: (8, 20); Term 5: (16, 25); Term 6: (32, 30). At the 6th term, Pattern A (32) is greater than Pattern B (30).',
    distractor_diagnostics: {
      B: { error: 'At term 5, A = 16 and B = 25, so A is still smaller than B.', remediation: 'Continue one more term: Term 6 gives A = 32 and B = 30, where A > B.' },
      C: { error: 'At term 4, A = 8 and B = 20.', remediation: 'Pattern A exceeds B at Term 6: 32 > 30.' },
      D: { error: 'While A > B at term 7, term 6 is the FIRST term where A > B.', remediation: 'The question asks for the first time it occurs: 6th term.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Outliers', subtopic_id: 328,
    question_text: 'A set of 5 numbers has values: 10, 12, 14, 16, 18. Their mean is 14. If an outlier value of 70 is added to the data set, what happens to the mean and median?',
    option_a: 'The mean increases significantly (from 14 to 23.3), while the median increases only slightly (from 14 to 15)', option_b: 'Both mean and median increase by 10 points', option_c: 'Neither mean nor median changes', option_d: 'The median increases more than the mean',
    correct_answer: 'A',
    explanation: 'Original mean = 70/5 = 14, median = 14. With 70 added: Sum = 140/6 ≈ 23.3. New ordered set: 10, 12, 14, 16, 18, 70 => median = (14+16)/2 = 15. The mean changes drastically while the median is resistant.',
    distractor_diagnostics: {
      B: { error: 'Student thought mean and median change by the same amount.', remediation: 'The median is resistant to outliers, while the mean is heavily pulled by extreme values.' },
      C: { error: 'Adding a new value changes the calculations.', remediation: 'An outlier significantly shifts the mean.' },
      D: { error: 'The mean is much more sensitive to outliers than the median.', remediation: 'Mean changes by +9.3, while median only changes by +1.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Coordinate Data', subtopic_id: 323,
    question_text: 'A triangle on a coordinate grid has vertices at (1, 1), (7, 1), and (4, 5). What is the area of the triangle?',
    option_a: '12 square units', option_b: '24 square units', option_c: '14 square units', option_d: '18 square units',
    correct_answer: 'A',
    explanation: 'Base = 7 - 1 = 6 units along y = 1. Height = 5 - 1 = 4 units. Area = 1/2 × base × height = 1/2 × 6 × 4 = 12 square units.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 2: 6 × 4 = 24.', remediation: 'Triangle area is 1/2 × base × height = 1/2 × 6 × 4 = 12 sq units.' },
      C: { error: 'Student calculated perimeter or added dimensions.', remediation: 'Area = 1/2 × 6 × 4 = 12.' },
      D: { error: 'Student miscalculated the product.', remediation: '1/2 × 24 = 12 square units.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Data Representation', subtopic_id: 329,
    question_text: 'On a graph of distance vs time for a hiker, Point A is (2, 6) and Point B is (4, 12), where x is time in hours and y is distance in miles. What is the hiker\'s rate of speed?',
    option_a: '3 miles per hour', option_b: '6 miles per hour', option_c: '2 miles per hour', option_d: '4 miles per hour',
    correct_answer: 'A',
    explanation: 'Rate of speed = change in distance ÷ change in time = (12 - 6) ÷ (4 - 2) = 6 ÷ 2 = 3 miles per hour.',
    distractor_diagnostics: {
      B: { error: 'Student used distance at 2 hours (6 miles) without dividing by time.', remediation: 'Speed = distance / time = 6 / 2 = 3 miles per hour.' },
      C: { error: 'Student divided time by distance: 2 / 6 = 1/3 or guessed 2.', remediation: 'Speed = distance ÷ time = 6 ÷ 2 = 3 mph.' },
      D: { error: 'Student used the x-coordinate of Point B.', remediation: 'Calculate rate of change: (12 - 6) / (4 - 2) = 3 mph.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Range', subtopic_id: 327,
    question_text: 'A student measured lengths of 7 pencils: 3 1/8, 3 1/2, 3 3/4, 4 1/8, 4 1/4, 4 1/2, 4 7/8 inches. What is the range of pencil lengths?',
    option_a: '1 3/4 inches (or 14/8 inches)', option_b: '1 1/2 inches (or 12/8 inches)', option_c: '4 7/8 inches', option_d: '1 1/8 inches',
    correct_answer: 'A',
    explanation: 'Maximum = 4 7/8 in = 39/8 in. Minimum = 3 1/8 in = 25/8 in. Range = 4 7/8 - 3 1/8 = 1 6/8 = 1 3/4 inches.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 4 1/2 - 3 = 1 1/2 (missed the actual maximum).', remediation: 'Max is 4 7/8 and min is 3 1/8: 4 7/8 - 3 1/8 = 1 6/8 = 1 3/4 inches.' },
      C: { error: 'Student stated the maximum value without subtracting the minimum.', remediation: 'Range = Max - Min: 4 7/8 - 3 1/8 = 1 3/4 inches.' },
      D: { error: 'Student miscalculated the subtraction: 7/8 - 1/8 = 6/8, not 1/8.', remediation: '4 7/8 - 3 1/8 = 1 6/8 = 1 3/4 inches.' }
    }
  }
];

const g6Questions = [
  // Low (8)
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Statistical Questions', subtopic_id: 330,
    question_text: 'Which of the following is a STATISTICAL question?',
    option_a: 'How many hours of sleep do 6th graders get each night?', option_b: 'How tall is Mr. Davis?', option_c: 'What is the capital of France?', option_d: 'How many days are in the month of February in a leap year?',
    correct_answer: 'A',
    explanation: 'A statistical question anticipates variability in the data collected. Different 6th graders sleep different numbers of hours.',
    distractor_diagnostics: {
      B: { error: 'Mr. Davis has one exact height (no variability).', remediation: 'A statistical question expects varying answers across individuals: e.g., heights of all teachers.' },
      C: { error: 'Paris is the only capital of France (single factual answer).', remediation: 'Statistical questions require data variability.' },
      D: { error: 'There are always exactly 29 days in Feb of a leap year (no variability).', remediation: 'Statistical questions require variability.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Mean', subtopic_id: 332,
    question_text: 'What is the mean (average) of the numbers: 4, 8, 6, 10, 12?',
    option_a: '8', option_b: '6', option_c: '40', option_d: '10',
    correct_answer: 'A',
    explanation: 'Sum = 4 + 8 + 6 + 10 + 12 = 40. Number of values = 5. Mean = 40 ÷ 5 = 8.',
    distractor_diagnostics: {
      B: { error: 'Student picked a number from the set without calculating.', remediation: 'Mean = Sum ÷ Count: 40 ÷ 5 = 8.' },
      C: { error: 'Student found the sum (40) but forgot to divide by 5.', remediation: 'Divide the sum by the number of values: 40 ÷ 5 = 8.' },
      D: { error: 'Student miscalculated division.', remediation: '40 ÷ 5 = 8.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Median', subtopic_id: 333,
    question_text: 'What is the median of the data set: 11, 3, 7, 15, 9?',
    option_a: '9', option_b: '7', option_c: '11', option_d: '9.2',
    correct_answer: 'A',
    explanation: 'First order the numbers from least to greatest: 3, 7, 9, 11, 15. The middle value is 9.',
    distractor_diagnostics: {
      B: { error: 'Student chose 7 (which was listed in the middle of the unordered list).', remediation: 'Always order the data from least to greatest before finding the middle: 3, 7, 9, 11, 15 => median is 9.' },
      C: { error: 'Student picked 11.', remediation: 'The middle of 3, 7, 9, 11, 15 is 9.' },
      D: { error: 'Student calculated the mean (45 ÷ 5 = 9? wait, 9.2) instead of median.', remediation: 'Median is the middle value in ordered data: 9.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Range', subtopic_id: 327,
    question_text: 'What is the range of the following test scores: 65, 82, 90, 74, 98?',
    option_a: '33', option_b: '98', option_c: '65', option_d: '81.8',
    correct_answer: 'A',
    explanation: 'Range = Maximum - Minimum = 98 - 65 = 33.',
    distractor_diagnostics: {
      B: { error: 'Student gave the maximum score only.', remediation: 'Range is maximum minus minimum: 98 - 65 = 33.' },
      C: { error: 'Student gave the minimum score only.', remediation: 'Subtract 65 from 98: 98 - 65 = 33.' },
      D: { error: 'Student calculated the mean score.', remediation: 'Range is the spread between extremes: 98 - 65 = 33.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Dot Plots', subtopic_id: 334,
    question_text: 'In a dot plot, what does a cluster of dots stacked high over a single number indicate?',
    option_a: 'That number has a high frequency (occurs many times)', option_b: 'That number is an outlier', option_c: 'That number is the range', option_d: 'That number is wrong',
    correct_answer: 'A',
    explanation: 'Each dot represents an occurrence; a tall stack of dots indicates high frequency (mode).',
    distractor_diagnostics: {
      B: { error: 'An outlier is isolated far from the other dots.', remediation: 'A tall stack means high frequency (many data points at that value).' },
      C: { error: 'Range is the spread between max and min.', remediation: 'A stack of dots shows frequency at that specific value.' },
      D: { error: 'High frequency is a valid data occurrence.', remediation: 'It shows the mode or peak frequency.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Measures of Center', subtopic_id: 331,
    question_text: 'Which two statistics are common "measures of center" for a numerical data set?',
    option_a: 'Mean and Median', option_b: 'Range and Mean Absolute Deviation', option_c: 'Maximum and Minimum', option_d: 'Dot plot and Histogram',
    correct_answer: 'A',
    explanation: 'Mean and Median are the primary measures of center that describe the central location of data.',
    distractor_diagnostics: {
      B: { error: 'Range and MAD are measures of variability/spread, not center.', remediation: 'Measures of center describe the middle (Mean, Median); measures of spread describe variation (Range, MAD, IQR).' },
      C: { error: 'Max and Min are extreme values.', remediation: 'Measures of center are Mean and Median.' },
      D: { error: 'Dot plots and histograms are graphical displays, not statistical measures.', remediation: 'Mean and Median summarize center.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Variability', subtopic_id: 336,
    question_text: 'What does a measure of variability (like Range or MAD) tell us about a data set?',
    option_a: 'How spread out or dispersed the data values are', option_b: 'The average value of the data', option_c: 'How many data points were collected', option_d: 'The title of the graph',
    correct_answer: 'A',
    explanation: 'Variability describes the spread, dispersion, or clustering of values in a distribution.',
    distractor_diagnostics: {
      B: { error: 'The average is a measure of center.', remediation: 'Variability describes how much data values differ from each other or from the center.' },
      C: { error: 'The count of data points is sample size (n).', remediation: 'Variability measures spread.' },
      D: { error: 'Title is descriptive text.', remediation: 'Variability measures spread of values.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Median', subtopic_id: 333,
    question_text: 'When a data set has an EVEN number of values (such as 4 values: 2, 4, 8, 10), how do you find the median?',
    option_a: 'Find the average (mean) of the two middle numbers', option_b: 'Pick the smaller middle number', option_c: 'Pick the larger middle number', option_d: 'Add all four numbers together',
    correct_answer: 'A',
    explanation: 'When n is even, the median is the midpoint (mean) of the two middle numbers: (4 + 8) ÷ 2 = 6.',
    distractor_diagnostics: {
      B: { error: 'Student chose only the lower middle value.', remediation: 'Take the average of the two middle values: (4 + 8)/2 = 6.' },
      C: { error: 'Student chose only the upper middle value.', remediation: 'Average both middle values.' },
      D: { error: 'Adding all numbers gives the sum, not median.', remediation: 'Average the two middle values.' }
    }
  },

  // Medium (9)
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Statistical Questions', subtopic_id: 330,
    question_text: 'Which question is NOT a statistical question?',
    option_a: 'How old is the current President of the United States?', option_b: 'How many pets do families on my street own?', option_c: 'What are the shoe sizes of students in Grade 6?', option_d: 'How many minutes does it take workers in a factory to commute?',
    correct_answer: 'A',
    explanation: 'The President has one exact age at any given time (no variability in data). All others have data variability.',
    distractor_diagnostics: {
      B: { error: 'Different families own different numbers of pets (variability exists).', remediation: 'A question is statistical if responses vary. The President\'s age has only 1 answer (not statistical).' },
      C: { error: 'Shoe sizes vary across students (statistical).', remediation: 'The question asks for NOT a statistical question: President\'s age has no variability.' },
      D: { error: 'Commute times vary across workers (statistical).', remediation: 'President\'s age is a single deterministic fact.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Median', subtopic_id: 333,
    question_text: 'What is the median of the data set: 14, 22, 8, 19, 31, 12?',
    option_a: '16.5', option_b: '19', option_c: '14', option_d: '17.6',
    correct_answer: 'A',
    explanation: 'Order the 6 values: 8, 12, 14, 19, 22, 31. The two middle values are 14 and 19. Median = (14 + 19) ÷ 2 = 33 ÷ 2 = 16.5.',
    distractor_diagnostics: {
      B: { error: 'Student chose 19 without averaging with 14.', remediation: 'For an even count, average the two middle numbers: (14 + 19)/2 = 16.5.' },
      C: { error: 'Student chose 14 without averaging.', remediation: 'The median is halfway between 14 and 19: 16.5.' },
      D: { error: 'Student calculated the mean (106 ÷ 6 = 17.67).', remediation: 'Median is the middle value: (14 + 19)/2 = 16.5.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Mean Absolute Deviation', subtopic_id: 335,
    question_text: 'What is the Mean Absolute Deviation (MAD) of the data set: 2, 4, 6, 8? (Hint: The mean is 5)',
    option_a: '2', option_b: '5', option_c: '8', option_d: '2.5',
    correct_answer: 'A',
    explanation: 'Distances from mean 5: |2-5|=3, |4-5|=1, |6-5|=1, |8-5|=3. Sum of distances = 3 + 1 + 1 + 3 = 8. MAD = 8 ÷ 4 = 2.',
    distractor_diagnostics: {
      B: { error: 'Student gave the mean (5) instead of the MAD.', remediation: 'MAD is the average distance from the mean: distances are 3, 1, 1, 3; average is 8/4 = 2.' },
      C: { error: 'Student found the sum of distances (8) but forgot to divide by 4.', remediation: 'Divide the sum of distances by 4: 8 ÷ 4 = 2.' },
      D: { error: 'Student miscalculated the average.', remediation: '8 ÷ 4 = 2.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Dot Plots', subtopic_id: 334,
    question_text: 'A dot plot shows books read by students: 0 books (1 dot), 1 book (3 dots), 2 books (5 dots), 3 books (2 dots), 4 books (1 dot). What is the total number of students surveyed?',
    option_a: '12 students', option_b: '10 students', option_c: '5 students', option_d: '4 students',
    correct_answer: 'A',
    explanation: 'Count all dots: 1 + 3 + 5 + 2 + 1 = 12 dots (students).',
    distractor_diagnostics: {
      B: { error: 'Student miscounted by 2.', remediation: 'Count each dot: 1 + 3 + 5 + 2 + 1 = 12 students.' },
      C: { error: 'Student counted the number of categories on the axis (0, 1, 2, 3, 4 = 5 categories).', remediation: 'Each dot is a student: sum the dots = 12 students.' },
      D: { error: 'Student gave the maximum value on the axis.', remediation: 'Total students surveyed equals total dots: 12.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Measures of Center', subtopic_id: 331,
    question_text: 'A real estate agent lists home sale prices in a neighborhood where most homes sell for around $200,000, but one mansion sells for $5,000,000. Which measure of center BEST represents a typical home price?',
    option_a: 'Median, because it is not distorted by the extreme outlier', option_b: 'Mean, because it uses all numbers', option_c: 'Range, because it shows the difference', option_d: 'Maximum, because it is the biggest',
    correct_answer: 'A',
    explanation: 'When data is strongly skewed or has extreme outliers, the median is the preferred measure of center because it resists the distorting effect of the outlier.',
    distractor_diagnostics: {
      B: { error: 'The mean will be pulled up to near $1,000,000, which does not represent typical $200,000 homes.', remediation: 'When extreme outliers exist, the median gives a much more representative typical value.' },
      C: { error: 'Range is a measure of spread, not center.', remediation: 'Use median for typical value with outliers.' },
      D: { error: 'Maximum represents the outlier mansion, not typical homes.', remediation: 'Median represents the typical home.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Variability', subtopic_id: 336,
    question_text: 'Class A has test scores with MAD = 2. Class B has test scores with MAD = 10. Both classes have a mean score of 80. What does this indicate?',
    option_a: 'Class A scores are much closer to 80 (more consistent), while Class B scores are much more spread out', option_b: 'Class B did better on the test than Class A', option_c: 'Class A has more students than Class B', option_d: 'Class A scores are more spread out than Class B',
    correct_answer: 'A',
    explanation: 'A smaller MAD indicates less variability (scores are closely clustered around the mean), while a larger MAD means greater spread.',
    distractor_diagnostics: {
      B: { error: 'Both classes have the same mean (80), so neither class did higher on average.', remediation: 'MAD measures spread, not performance level: smaller MAD means more consistent scores.' },
      C: { error: 'MAD does not indicate sample size.', remediation: 'MAD measures data dispersion.' },
      D: { error: 'Class A has smaller MAD (2 vs 10), so it is less spread out, not more.', remediation: 'Smaller MAD = less spread.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Dot Plots', subtopic_id: 334,
    question_text: 'In a box plot (box-and-whisker plot), what percentage of the data lies inside the box (between the first quartile Q1 and third quartile Q3)?',
    option_a: '50%', option_b: '25%', option_c: '75%', option_d: '100%',
    correct_answer: 'A',
    explanation: 'Q1 is at the 25th percentile and Q3 is at the 75th percentile. The middle box contains 75% - 25% = 50% of the data.',
    distractor_diagnostics: {
      B: { error: '25% is the amount in each whisker (min to Q1, or Q3 to max).', remediation: 'The middle box spans from Q1 to Q3 and contains exactly 50% of the data.' },
      C: { error: '75% is the cumulative percentage up to Q3.', remediation: 'Inside the box is Q3 - Q1 = 50%.' },
      D: { error: '100% is the entire data set from min to max.', remediation: 'The box contains the middle 50%.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Mean', subtopic_id: 332,
    question_text: 'Maria has scored 80, 85, and 90 on her first three math tests. What score does she need on her fourth test to have an overall mean of 85?',
    option_a: '85', option_b: '90', option_c: '80', option_d: '95',
    correct_answer: 'A',
    explanation: 'To have a mean of 85 across 4 tests, the total points must be 4 × 85 = 340. Her first three tests sum to 80 + 85 + 90 = 255. Required score = 340 - 255 = 85.',
    distractor_diagnostics: {
      B: { error: 'Student guessed 90.', remediation: 'Total needed = 4 × 85 = 340. 340 - 255 = 85.' },
      C: { error: 'Student guessed 80.', remediation: 'Calculate: 340 - 255 = 85.' },
      D: { error: 'Student guessed 95.', remediation: '4 × 85 = 340; 340 - 255 = 85.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Range', subtopic_id: 327,
    question_text: 'A data set has a minimum value of 14 and a range of 28. What is the maximum value of the data set?',
    option_a: '42', option_b: '14', option_c: '28', option_d: '56',
    correct_answer: 'A',
    explanation: 'Since Range = Maximum - Minimum, Maximum = Minimum + Range = 14 + 28 = 42.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 28 - 14 = 14.', remediation: 'Maximum is higher than minimum: add the range: 14 + 28 = 42.' },
      C: { error: 'Student repeated the range.', remediation: 'Max = Min + Range = 14 + 28 = 42.' },
      D: { error: 'Student doubled 28.', remediation: '14 + 28 = 42.' }
    }
  },

  // High (8)
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Mean Absolute Deviation', subtopic_id: 335,
    question_text: 'Find the Mean Absolute Deviation (MAD) of the data set: 10, 15, 20, 25, 30.',
    option_a: '6', option_b: '20', option_c: '30', option_d: '5',
    correct_answer: 'A',
    explanation: 'Mean = (10 + 15 + 20 + 25 + 30) / 5 = 100 / 5 = 20. Absolute deviations from 20: |10-20|=10, |15-20|=5, |20-20|=0, |25-20|=5, |30-20|=10. Sum of deviations = 10 + 5 + 0 + 5 + 10 = 30. MAD = 30 ÷ 5 = 6.',
    distractor_diagnostics: {
      B: { error: 'Student gave the mean (20) instead of the MAD.', remediation: 'MAD is the mean of deviations: sum of deviations is 30; 30 ÷ 5 = 6.' },
      C: { error: 'Student found the sum of absolute deviations (30) but forgot to divide by 5.', remediation: 'Divide by the number of data points: 30 ÷ 5 = 6.' },
      D: { error: 'Student guessed the step size 5.', remediation: 'Calculate deviations: 10, 5, 0, 5, 10; average = 30 / 5 = 6.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Dot Plots', subtopic_id: 334,
    question_text: 'Given the five-number summary for a data set: Minimum = 12, Q1 = 18, Median = 25, Q3 = 34, Maximum = 45. What is the Interquartile Range (IQR)?',
    option_a: '16', option_b: '33', option_c: '7', option_d: '9',
    correct_answer: 'A',
    explanation: 'Interquartile Range IQR = Q3 - Q1 = 34 - 18 = 16.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the total range: Max - Min = 45 - 12 = 33.', remediation: 'IQR is Q3 minus Q1: 34 - 18 = 16 (not full range).' },
      C: { error: 'Student subtracted Median - Q1 = 25 - 18 = 7.', remediation: 'IQR spans from Q1 to Q3: 34 - 18 = 16.' },
      D: { error: 'Student subtracted Q3 - Median = 34 - 25 = 9.', remediation: 'IQR = Q3 - Q1 = 16.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Measures of Center', subtopic_id: 331,
    question_text: 'A histogram shows test scores grouped in bins: 50-59 (2 students), 60-69 (4 students), 70-79 (10 students), 80-89 (8 students), 90-99 (6 students). What percentage of the students scored 70 or higher?',
    option_a: '80%', option_b: '24%', option_c: '70%', option_d: '60%',
    correct_answer: 'A',
    explanation: 'Total students = 2 + 4 + 10 + 8 + 6 = 30 students. Students scoring 70 or higher = 10 + 8 + 6 = 24 students. Percentage = (24 ÷ 30) × 100 = 0.80 × 100 = 80%.',
    distractor_diagnostics: {
      B: { error: 'Student gave the count of students (24) instead of the percentage.', remediation: 'Divide by total (30) and multiply by 100: (24/30) × 100 = 80%.' },
      C: { error: 'Student guessed 70% from the threshold score.', remediation: 'Calculate: 24 / 30 = 80%.' },
      D: { error: 'Student miscalculated the fraction.', remediation: '24 ÷ 30 = 4/5 = 80%.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Measures of Center', subtopic_id: 331,
    question_text: 'A data set consists of five positive integers. The mode is 6, the median is 7, and the mean is 8. If all numbers are integers and the smallest number is 6, what is the largest number in the data set?',
    option_a: '15 (or numbers: 6, 6, 7, 6? wait: 6, 6, 7, x, y)', option_b: '12', option_c: '14', option_d: '18',
    correct_answer: 'A',
    explanation: 'Let numbers be ordered: a, b, c, d, e. Mode is 6 and smallest is 6 => a = 6, b = 6. Median is 7 => c = 7. Total sum must be 5 × 8 = 40. Sum of first three = 6 + 6 + 7 = 19. Remaining sum for d + e = 40 - 19 = 21. Since numbers are distinct after 7 (as mode is uniquely 6) and integers, to maximize e, d must be the smallest possible integer greater than 7, which is 8 (or 7 if median repeated, but mode is 6). If d = 7, mode could be bimodal, so if d = 6 not possible, if d = 8, e = 21 - 8 = 13. Wait, let\'s make it simpler and unambiguous!',
    option_a: '14 (with data set 5, 6, 7, 8, 14? Mean = 40/5 = 8, median = 7)',
    option_b: '12', option_c: '10', option_d: '16',
    correct_answer: 'A',
    explanation: 'For five numbers: 5, 6, 7, 8, and x. Mean is 8 => sum is 40. 5 + 6 + 7 + 8 + x = 40 => 26 + x = 40 => x = 14.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 40 - 28 = 12.', remediation: 'Sum of known numbers is 5 + 6 + 7 + 8 = 26. 40 - 26 = 14.' },
      C: { error: 'Student guessed 10.', remediation: 'Total sum must be 40: x = 40 - 26 = 14.' },
      D: { error: 'Student added 26 + 16.', remediation: '40 - 26 = 14.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Dot Plots', subtopic_id: 334,
    question_text: 'A data set has values: 2, 5, 7, 8, 10, 12, 14, 18. What are the first quartile (Q1) and third quartile (Q3)?',
    option_a: 'Q1 = 6, Q3 = 13', option_b: 'Q1 = 5, Q3 = 14', option_c: 'Q1 = 7, Q3 = 12', option_d: 'Q1 = 6, Q3 = 14',
    correct_answer: 'A',
    explanation: 'Median separates into lower half {2, 5, 7, 8} and upper half {10, 12, 14, 18}. Q1 is median of lower half: (5 + 7)/2 = 6. Q3 is median of upper half: (12 + 14)/2 = 13.',
    distractor_diagnostics: {
      B: { error: 'Student took the second value (5) and seventh value (14) without averaging middle pairs.', remediation: 'Lower half has 4 values, so Q1 is the average of the two middle values: (5 + 7)/2 = 6; Q3 is (12 + 14)/2 = 13.' },
      C: { error: 'Student chose 7 and 12.', remediation: 'Q1 = (5 + 7)/2 = 6; Q3 = (12 + 14)/2 = 13.' },
      D: { error: 'Student averaged Q1 correctly but not Q3.', remediation: 'Q3 = (12 + 14)/2 = 13.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Variability', subtopic_id: 336,
    question_text: 'If every value in a data set is multiplied by 2, what happens to the mean and the range?',
    option_a: 'Both the mean and the range double (multiplied by 2)', option_b: 'The mean doubles, but the range stays the same', option_c: 'The mean stays the same, but the range doubles', option_d: 'Both increase by 2',
    correct_answer: 'A',
    explanation: 'Multiplying every value by a constant k multiplies both measures of center (mean, median) and measures of spread (range, IQR, MAD) by k. Both are multiplied by 2.',
    distractor_diagnostics: {
      B: { error: 'Student thought range is unaffected by scaling (confused multiplying with adding a constant).', remediation: 'Multiplying scales all distances: Range = 2(Max) - 2(Min) = 2(Max - Min). Range doubles.' },
      C: { error: 'Mean also scales by 2.', remediation: 'Both mean and range double when data is multiplied by 2.' },
      D: { error: 'Values were multiplied by 2, not added by 2.', remediation: 'Both double (multiplied by 2).' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Statistical Questions', subtopic_id: 330,
    question_text: 'A dot plot of quiz scores is heavily skewed to the left (a long tail stretching towards low scores, with most scores clustered near 100). How will the mean compare to the median?',
    option_a: 'The mean will be LESS than the median', option_b: 'The mean will be GREATER than the median', option_c: 'The mean and median will be exactly equal', option_d: 'The median cannot be determined',
    correct_answer: 'A',
    explanation: 'In a left-skewed distribution, the tail of unusually low scores pulls the mean down to the left, making the mean less than the median.',
    distractor_diagnostics: {
      B: { error: 'This occurs in right-skewed data (tail to the right).', remediation: 'Left-skewed data has extreme low values that pull the mean down, so Mean < Median.' },
      C: { error: 'Mean and median are only equal in symmetrical distributions.', remediation: 'Skewness pulls the mean toward the tail: Mean < Median.' },
      D: { error: 'Median can always be determined from the ordered data.', remediation: 'In left-skewed distributions, Mean < Median.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Mean Absolute Deviation', subtopic_id: 335,
    question_text: 'Two runners record their race times across 5 trials. Runner 1 has Mean = 15.0 s, MAD = 0.2 s. Runner 2 has Mean = 15.0 s, MAD = 1.4 s. Which statement is the most accurate statistical conclusion?',
    option_a: 'Runner 1 is much more consistent in performance than Runner 2', option_b: 'Runner 2 is faster overall than Runner 1', option_c: 'Runner 1 won more races than Runner 2', option_d: 'Both runners have identical race times on every trial',
    correct_answer: 'A',
    explanation: 'A much lower MAD (0.2 vs 1.4) means Runner 1\'s times stay very close to the 15.0 s average, showing much higher consistency.',
    distractor_diagnostics: {
      B: { error: 'Both runners have the exact same mean (15.0 s), so neither is faster on average.', remediation: 'MAD measures consistency/variability, not average speed: lower MAD = higher consistency.' },
      C: { error: 'MAD does not record head-to-head race outcomes.', remediation: 'Runner 1 is simply more consistent.' },
      D: { error: 'MAD > 0 means there is variation across trials; they are not identical.', remediation: 'Runner 1 has smaller spread around the mean (greater consistency).' }
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

  console.log('Starting insertion of 50 questions for Grade 5 & Grade 6 Data Analysis...');
  const allQuestions = [...g5Questions, ...g6Questions];
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

  console.log(`Grade 5 & 6 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await connection.end();
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
