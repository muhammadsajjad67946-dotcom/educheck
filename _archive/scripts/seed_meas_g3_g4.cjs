const mysql = require('mysql2/promise');
require('dotenv').config();

const g3Questions = [
  // Low (8)
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Time & Time Intervals', subtopic_id: 231,
    question_text: 'A clock shows 4:18. What time will it be in 12 minutes?',
    option_a: '4:30', option_b: '4:20', option_c: '5:30', option_d: '4:28',
    correct_answer: 'A',
    explanation: 'Add 12 minutes to the minutes: 18 + 12 = 30. The time will be 4:30.',
    distractor_diagnostics: {
      B: { error: 'Student added 2 minutes instead of 12.', remediation: '18 + 12 = 30 minutes past 4: 4:30.' },
      C: { error: 'Student changed the hour to 5.', remediation: 'The hour is still 4: 4:30.' },
      D: { error: 'Student made an addition error.', remediation: '18 + 12 = 30.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Mass & Liquid Volume', subtopic_id: 232,
    question_text: 'Which unit is best suited to measure the mass of a single paper clip?',
    option_a: 'Grams', option_b: 'Kilograms', option_c: 'Liters', option_d: 'Meters',
    correct_answer: 'A',
    explanation: 'A paper clip is very light (about 1 gram). Grams are used for light objects, while kilograms are for heavy objects.',
    distractor_diagnostics: {
      B: { error: 'Kilograms measure heavy objects (1 kg = 1,000 grams).', remediation: 'Use grams for very light objects like paperclips or feathers.' },
      C: { error: 'Liters measure liquid capacity, not mass.', remediation: 'Grams measure mass/weight.' },
      D: { error: 'Meters measure length, not mass.', remediation: 'Mass is measured in grams or kilograms.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Mass & Liquid Volume', subtopic_id: 232,
    question_text: 'A large pitcher contains 2 liters of lemonade. How many milliliters of lemonade is that?',
    option_a: '2,000 milliliters', option_b: '200 milliliters', option_c: '20 milliliters', option_d: '20,000 milliliters',
    correct_answer: 'A',
    explanation: '1 liter equals 1,000 milliliters. So 2 liters = 2 × 1,000 = 2,000 milliliters.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied by 100 instead of 1,000.', remediation: 'Remember: 1 liter = 1,000 milliliters, so 2 L = 2,000 mL.' },
      C: { error: 'Student multiplied by 10.', remediation: '1 L = 1,000 mL: 2 L = 2,000 mL.' },
      D: { error: 'Student multiplied by 10,000.', remediation: 'Multiply by 1,000: 2,000 mL.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Area of Rectangles', subtopic_id: 236,
    question_text: 'A rectangle has a length of 7 cm and a width of 4 cm. What is the AREA of the rectangle?',
    option_a: '28 square cm', option_b: '22 cm', option_c: '11 square cm', option_d: '14 square cm',
    correct_answer: 'A',
    explanation: 'Area of a rectangle = length × width = 7 × 4 = 28 square cm.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the perimeter: 2(7 + 4) = 22 cm.', remediation: 'Area is length MULTIPLIED by width (7 × 4 = 28 sq cm), not perimeter.' },
      C: { error: 'Student added 7 + 4 = 11.', remediation: 'Multiply length by width to find area: 7 × 4 = 28.' },
      D: { error: 'Student multiplied 7 by 2.', remediation: 'Area = 7 × 4 = 28 square cm.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Perimeter', subtopic_id: 238,
    question_text: 'What is the PERIMETER of a square with a side length of 6 inches?',
    option_a: '24 inches', option_b: '36 square inches', option_c: '12 inches', option_d: '18 inches',
    correct_answer: 'A',
    explanation: 'A square has 4 equal sides: Perimeter = 4 × 6 = 24 inches.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the area: 6 × 6 = 36 sq inches.', remediation: 'Perimeter is the distance around: add all 4 sides (6 + 6 + 6 + 6 = 24 in).' },
      C: { error: 'Student only added two sides (6 + 6 = 12).', remediation: 'A square has 4 sides: 4 × 6 = 24 inches.' },
      D: { error: 'Student multiplied 6 by 3.', remediation: 'A square has 4 sides: 4 × 6 = 24 inches.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Area Concepts & Unit Squares', subtopic_id: 235,
    question_text: 'A rectangle is completely tiled with 5 rows of 3 square units with no gaps or overlaps. What is the area?',
    option_a: '15 square units', option_b: '8 square units', option_c: '16 square units', option_d: '12 square units',
    correct_answer: 'A',
    explanation: 'Multiply rows by unit squares in each row: 5 × 3 = 15 square units.',
    distractor_diagnostics: {
      B: { error: 'Student added 5 + 3 = 8.', remediation: 'Area is total squares: 5 rows of 3 = 5 × 3 = 15 square units.' },
      C: { error: 'Student calculated perimeter: 2(5 + 3) = 16.', remediation: 'Area counts inside squares: 5 × 3 = 15.' },
      D: { error: 'Student miscalculated.', remediation: '5 × 3 = 15 square units.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Time & Time Intervals', subtopic_id: 231,
    question_text: 'A science experiment starts at 9:15 a.m. and ends at 9:50 a.m. How many minutes did the experiment take?',
    option_a: '35 minutes', option_b: '45 minutes', option_c: '25 minutes', option_d: '65 minutes',
    correct_answer: 'A',
    explanation: 'Subtract the starting minutes from ending minutes: 50 - 15 = 35 minutes.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 50 - 5 = 45.', remediation: '50 - 15 = 35 minutes.' },
      C: { error: 'Student miscalculated.', remediation: '50 - 15 = 35 minutes.' },
      D: { error: 'Student added 50 + 15 = 65.', remediation: 'Find the elapsed time by subtracting: 50 - 15 = 35 minutes.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Perimeter', subtopic_id: 238,
    question_text: 'A triangle has sides of lengths 5 cm, 7 cm, and 9 cm. What is its perimeter?',
    option_a: '21 cm', option_b: '315 square cm', option_c: '16 cm', option_d: '26 cm',
    correct_answer: 'A',
    explanation: 'Perimeter is the sum of all side lengths: 5 + 7 + 9 = 21 cm.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied the side lengths: 5 × 7 × 9 = 315.', remediation: 'Perimeter is the sum of sides (addition): 5 + 7 + 9 = 21 cm.' },
      C: { error: 'Student added only two sides (7 + 9 = 16).', remediation: 'Add all three sides: 5 + 7 + 9 = 21 cm.' },
      D: { error: 'Student made an addition error.', remediation: '5 + 7 + 9 = 21 cm.' }
    }
  },

  // Medium (9)
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Time & Time Intervals', subtopic_id: 231,
    question_text: 'A movie started at 1:45 p.m. and lasted for 50 minutes. At what time did the movie end?',
    option_a: '2:35 p.m.', option_b: '1:95 p.m.', option_c: '2:45 p.m.', option_d: '2:25 p.m.',
    correct_answer: 'A',
    explanation: 'From 1:45, it takes 15 minutes to reach 2:00. Remaining minutes = 50 - 15 = 35 minutes. Ending time = 2:35 p.m.',
    distractor_diagnostics: {
      B: { error: 'Student used base-10 addition (45 + 50 = 95), forgetting an hour has 60 minutes.', remediation: '60 minutes makes a new hour: 1:45 + 15 min = 2:00, then + 35 min = 2:35 p.m.' },
      C: { error: 'Student added 1 hour (60 min) instead of 50 minutes.', remediation: '50 minutes is 10 minutes less than an hour: 2:45 - 10 min = 2:35 p.m.' },
      D: { error: 'Student subtracted 10 minutes too many.', remediation: '1:45 + 50 minutes = 2:35 p.m.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Area of Rectangles', subtopic_id: 236,
    question_text: 'A rectangular classroom rug has an area of 54 square feet. The width of the rug is 6 feet. What is the LENGTH of the rug?',
    option_a: '9 feet', option_b: '8 feet', option_c: '48 feet', option_d: '324 feet',
    correct_answer: 'A',
    explanation: 'Area = length × width. Length = Area ÷ width = 54 ÷ 6 = 9 feet.',
    distractor_diagnostics: {
      B: { error: '6 × 8 = 48, not 54.', remediation: '54 ÷ 6 = 9 feet.' },
      C: { error: 'Student subtracted 54 - 6 = 48.', remediation: 'Divide area by width to find length: 54 ÷ 6 = 9 feet.' },
      D: { error: 'Student multiplied 54 × 6 = 324.', remediation: 'Length is a factor of area: divide 54 by 6 = 9.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Decomposing Area', subtopic_id: 237,
    question_text: 'An L-shaped figure is formed by two non-overlapping rectangles: Rectangle A has dimensions 4 m by 5 m, and Rectangle B has dimensions 3 m by 2 m. What is the TOTAL area of the figure?',
    option_a: '26 square meters', option_b: '20 square meters', option_c: '14 square meters', option_d: '40 square meters',
    correct_answer: 'A',
    explanation: 'Area of Rectangle A = 4 × 5 = 20 sq m. Area of Rectangle B = 3 × 2 = 6 sq m. Total area = 20 + 6 = 26 sq m.',
    distractor_diagnostics: {
      B: { error: 'Student only calculated Rectangle A (20 sq m).', remediation: 'Add the area of both rectangles: 20 + 6 = 26 sq meters.' },
      C: { error: 'Student added the dimensions: 4 + 5 + 3 + 2 = 14.', remediation: 'Calculate individual areas first and then add: (4×5) + (3×2) = 26.' },
      D: { error: 'Student multiplied 20 × 2.', remediation: 'Total area = 20 + 6 = 26 square meters.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Mass & Liquid Volume', subtopic_id: 232,
    question_text: 'A baker has a bowl containing 450 grams of flour. He adds 375 grams more flour. Then he uses 280 grams for a cake. How many grams of flour are left in the bowl?',
    option_a: '545 grams', option_b: '825 grams', option_c: '525 grams', option_d: '645 grams',
    correct_answer: 'A',
    explanation: 'Step 1: 450 + 375 = 825 grams. Step 2: 825 - 280 = 545 grams.',
    distractor_diagnostics: {
      B: { error: 'Student stopped after adding (825 g) and did not subtract the used flour.', remediation: 'Subtract the 280 g used: 825 - 280 = 545 grams.' },
      C: { error: 'Student made an error in regrouping.', remediation: '825 - 280 = 545 grams.' },
      D: { error: 'Student made an arithmetic error.', remediation: '450 + 375 = 825; 825 - 280 = 545 g.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Perimeter', subtopic_id: 238,
    question_text: 'A rectangle has a length of 8 cm and a perimeter of 26 cm. What is the WIDTH of the rectangle?',
    option_a: '5 cm', option_b: '10 cm', option_c: '18 cm', option_d: '9 cm',
    correct_answer: 'A',
    explanation: 'Perimeter = 2(L + W) = 26. Semi-perimeter L + W = 13. Width = 13 - 8 = 5 cm.',
    distractor_diagnostics: {
      B: { error: 'Student found the sum of both widths (2W = 26 - 16 = 10 cm) without dividing by 2.', remediation: 'Divide the remaining 10 cm by 2 to find one width: 10 ÷ 2 = 5 cm.' },
      C: { error: 'Student subtracted 26 - 8 = 18.', remediation: 'Account for both lengths: 26 - 16 = 10, then 10 / 2 = 5 cm.' },
      D: { error: 'Student made an arithmetic error.', remediation: 'Width = (26 - 16) / 2 = 5 cm.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Area of Rectangles', subtopic_id: 236,
    question_text: 'Which two rectangles have the SAME perimeter but DIFFERENT areas?',
    option_a: 'Rectangle 1 (2 by 8) and Rectangle 2 (4 by 6)', option_b: 'Rectangle 1 (3 by 4) and Rectangle 2 (4 by 3)', option_c: 'Rectangle 1 (2 by 5) and Rectangle 2 (3 by 5)', option_d: 'Rectangle 1 (4 by 4) and Rectangle 2 (2 by 8)',
    correct_answer: 'A',
    explanation: 'Perimeter 1: 2(2+8) = 20; Area 1: 2×8 = 16. Perimeter 2: 2(4+6) = 20; Area 2: 4×6 = 24. Same perimeter (20), different areas (16 vs 24).',
    distractor_diagnostics: {
      B: { error: 'These are the exact same rectangle rotated (same perimeter and same area).', remediation: 'Rotated shapes have the identical area and perimeter.' },
      C: { error: 'These have different perimeters (14 vs 16).', remediation: 'Perimeters must be equal.' },
      D: { error: 'Perimeter 1 is 16, Perimeter 2 is 20 (different perimeters).', remediation: 'Both must have the same perimeter (Option A: both have perimeter 20).' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Mass & Liquid Volume', subtopic_id: 232,
    question_text: 'A beaker has 700 mL of water. A student pours in 4 equal small cups of water, bringing the total to 900 mL. How many mL of water were in each cup?',
    option_a: '50 mL', option_b: '200 mL', option_c: '25 mL', option_d: '100 mL',
    correct_answer: 'A',
    explanation: 'Total added = 900 - 700 = 200 mL. Since there are 4 equal cups: 200 ÷ 4 = 50 mL per cup.',
    distractor_diagnostics: {
      B: { error: '200 mL is the total water added, not the amount in one cup.', remediation: 'Divide the added 200 mL by the 4 cups: 200 ÷ 4 = 50 mL.' },
      C: { error: 'Student divided 100 by 4.', remediation: '200 / 4 = 50 mL.' },
      D: { error: 'Student divided 200 by 2.', remediation: 'Divide by 4 cups: 50 mL.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Time & Time Intervals', subtopic_id: 231,
    question_text: 'Oliver finished his homework at 5:20 p.m. He spent 45 minutes doing math and 20 minutes reading. At what time did Oliver START his homework?',
    option_a: '4:15 p.m.', option_b: '4:35 p.m.', option_c: '6:25 p.m.', option_d: '3:55 p.m.',
    correct_answer: 'A',
    explanation: 'Total time spent = 45 + 20 = 65 minutes = 1 hour and 5 minutes. Count back 1 hour from 5:20: 4:20. Count back 5 minutes: 4:15 p.m.',
    distractor_diagnostics: {
      B: { error: 'Student only subtracted 45 minutes.', remediation: 'Subtract total time (65 min): 5:20 - 1 hr 5 min = 4:15 p.m.' },
      C: { error: 'Student added 65 minutes instead of counting backwards.', remediation: 'To find start time, subtract elapsed time from finish time: 4:15 p.m.' },
      D: { error: 'Student subtracted too many minutes.', remediation: '5:20 - 65 minutes = 4:15 p.m.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Area of Rectangles', subtopic_id: 236,
    question_text: 'A garden bed is 8 feet long and 5 feet wide. If the length is increased by 2 feet, by how many square feet does the AREA increase?',
    option_a: '10 square feet', option_b: '16 square feet', option_c: '50 square feet', option_d: '2 square feet',
    correct_answer: 'A',
    explanation: 'Original area = 8 × 5 = 40 sq ft. New area = (8 + 2) × 5 = 10 × 5 = 50 sq ft. Increase = 50 - 40 = 10 square feet (or 2 ft × 5 ft = 10 sq ft).',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 8 × 2 = 16.', remediation: 'The width is 5 ft, so adding 2 ft of length adds 2 × 5 = 10 sq ft.' },
      C: { error: '50 sq ft is the new total area, not the increase.', remediation: 'Subtract original area: 50 - 40 = 10 sq ft increase.' },
      D: { error: '2 feet is the linear increase, not area increase.', remediation: 'Area increase = 2 ft × 5 ft = 10 square feet.' }
    }
  },

  // High (8)
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Decomposing Area', subtopic_id: 237,
    question_text: 'An artist paints an irregular room shaped like an L. The main rectangle is 9 ft by 6 ft, with a 4 ft by 3 ft rectangular section cut out from one corner. What is the area of the floor?',
    option_a: '42 square feet', option_b: '54 square feet', option_c: '66 square feet', option_d: '36 square feet',
    correct_answer: 'A',
    explanation: 'Full rectangle area = 9 × 6 = 54 sq ft. Subtract the cutout corner: 4 × 3 = 12 sq ft. Floor area = 54 - 12 = 42 square feet.',
    distractor_diagnostics: {
      B: { error: '54 sq ft is the full area without subtracting the cutout corner.', remediation: 'Subtract the cutout: 54 - 12 = 42 sq ft.' },
      C: { error: 'Student added the cutout area (54 + 12 = 66).', remediation: 'The corner is cut out, so subtract: 54 - 12 = 42.' },
      D: { error: 'Student made an arithmetic error.', remediation: '54 - 12 = 42 square feet.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Time & Time Intervals', subtopic_id: 231,
    question_text: 'A flight departs at 11:35 a.m. and lands at 2:10 p.m. How long was the flight in hours and minutes?',
    option_a: '2 hours and 35 minutes', option_b: '3 hours and 25 minutes', option_c: '2 hours and 25 minutes', option_d: '3 hours and 35 minutes',
    correct_answer: 'A',
    explanation: 'From 11:35 a.m. to 1:35 p.m. is 2 hours. From 1:35 p.m. to 2:00 p.m. is 25 minutes, plus 10 minutes to 2:10 p.m. = 35 minutes. Total = 2 hr 35 min.',
    distractor_diagnostics: {
      B: { error: 'Student counted 3 full hours.', remediation: '11:35 to 2:35 would be 3 hours. 2:10 is 25 minutes before 2:35, so 2 hr 35 min.' },
      C: { error: 'Student miscalculated the minutes.', remediation: '25 min to 2:00 + 10 min = 35 minutes.' },
      D: { error: 'Student added an extra hour.', remediation: 'Flight duration is 2 hours and 35 minutes.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Perimeter', subtopic_id: 238,
    question_text: 'A rectangular field has a perimeter of 40 meters. Which dimensions would give this field the GREATEST possible area?',
    option_a: '10 meters by 10 meters (Area = 100 sq m)', option_b: '12 meters by 8 meters (Area = 96 sq m)', option_c: '15 meters by 5 meters (Area = 75 sq m)', option_d: '18 meters by 2 meters (Area = 36 sq m)',
    correct_answer: 'A',
    explanation: 'For a given perimeter, a square (equal sides) always produces the maximum possible area: 10 × 10 = 100 sq meters (perimeter = 4 × 10 = 40 m).',
    distractor_diagnostics: {
      B: { error: '96 sq m is less than 100 sq m.', remediation: 'A square yields the maximum area: 10 × 10 = 100 sq m.' },
      C: { error: '75 sq m is smaller than 100 sq m.', remediation: 'The closer the dimensions are to each other, the larger the area.' },
      D: { error: 'Long narrow rectangles produce the smallest area for a given perimeter.', remediation: 'Maximum area is 100 sq m (10 by 10).' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Mass & Liquid Volume', subtopic_id: 232,
    question_text: 'A crate has a mass of 4 kg. Inside are 6 identical boxes. The total mass of the crate and the boxes is 22 kg. What is the mass of ONE box?',
    option_a: '3 kg', option_b: '4 kg', option_c: '18 kg', option_d: '2.5 kg',
    correct_answer: 'A',
    explanation: 'Mass of 6 boxes = 22 - 4 = 18 kg. Mass of one box = 18 ÷ 6 = 3 kg.',
    distractor_diagnostics: {
      B: { error: 'Student guessed 4 kg.', remediation: 'Subtract the crate mass first: 22 - 4 = 18 kg, then 18 ÷ 6 = 3 kg.' },
      C: { error: '18 kg is the mass of all 6 boxes combined.', remediation: 'Divide 18 kg by 6 to find the mass of one box: 3 kg.' },
      D: { error: 'Student made an arithmetic error.', remediation: '18 / 6 = 3 kg.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Area of Rectangles', subtopic_id: 236,
    question_text: 'A wall is 12 feet long and 8 feet high. It has a window that is 3 feet by 4 feet. What is the area of the wall that needs to be painted (excluding the window)?',
    option_a: '84 square feet', option_b: '96 square feet', option_c: '12 square feet', option_d: '82 square feet',
    correct_answer: 'A',
    explanation: 'Total wall area = 12 × 8 = 96 sq ft. Window area = 3 × 4 = 12 sq ft. Paint area = 96 - 12 = 84 sq ft.',
    distractor_diagnostics: {
      B: { error: '96 sq ft is the total area without subtracting the window.', remediation: 'The window is not painted: subtract 12 sq ft from 96 sq ft = 84 sq ft.' },
      C: { error: '12 sq ft is the area of the window.', remediation: 'Subtract window from total wall: 96 - 12 = 84 sq ft.' },
      D: { error: 'Student made an arithmetic error.', remediation: '96 - 12 = 84 square feet.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Perimeter', subtopic_id: 238,
    question_text: 'Two identical squares, each with a side length of 5 cm, are placed side-by-side to form a rectangle. What is the PERIMETER of the new rectangle?',
    option_a: '30 cm', option_b: '40 cm', option_c: '20 cm', option_d: '50 cm',
    correct_answer: 'A',
    explanation: 'The new rectangle has length = 5 + 5 = 10 cm and width = 5 cm. Perimeter = 2(10 + 5) = 2(15) = 30 cm. (The two joined sides are interior and not counted).',
    distractor_diagnostics: {
      B: { error: 'Student added the perimeters of both independent squares (20 + 20 = 40 cm).', remediation: 'The joined inside sides disappear from the perimeter: 40 - 10 = 30 cm.' },
      C: { error: '20 cm is the perimeter of a single square.', remediation: 'Perimeter of the 10 by 5 rectangle is 2(10 + 5) = 30 cm.' },
      D: { error: '50 is the area (10 × 5), not perimeter.', remediation: 'Perimeter is the distance around: 10 + 5 + 10 + 5 = 30 cm.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Time & Time Intervals', subtopic_id: 231,
    question_text: 'A marathon runner started running at 7:48 a.m. and finished at 10:15 a.m. Exactly how many minutes did the runner take?',
    option_a: '147 minutes', option_b: '167 minutes', option_c: '127 minutes', option_d: '187 minutes',
    correct_answer: 'A',
    explanation: 'From 7:48 to 8:00 is 12 min. From 8:00 to 10:00 is 120 min (2 hours). From 10:00 to 10:15 is 15 min. Total = 12 + 120 + 15 = 147 minutes.',
    distractor_diagnostics: {
      B: { error: 'Student added an extra 20 minutes.', remediation: '12 min + 120 min + 15 min = 147 minutes.' },
      C: { error: 'Student counted only 1 hour between 8 and 10.', remediation: 'From 8:00 to 10:00 is 2 hours (120 min): total = 147 minutes.' },
      D: { error: 'Student miscalculated elapsed time.', remediation: 'Total duration is 147 minutes.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Decomposing Area', subtopic_id: 237,
    question_text: 'A rectangular patio measures 7 meters by 8 meters. A square fountain with sides of 3 meters sits in the middle. What is the remaining patio area surrounding the fountain?',
    option_a: '47 square meters', option_b: '56 square meters', option_c: '9 square meters', option_d: '38 square meters',
    correct_answer: 'A',
    explanation: 'Total patio area = 7 × 8 = 56 sq m. Fountain area = 3 × 3 = 9 sq m. Remaining area = 56 - 9 = 47 square meters.',
    distractor_diagnostics: {
      B: { error: '56 sq m is the patio area without subtracting the fountain.', remediation: 'Subtract fountain area (9 sq m): 56 - 9 = 47 sq m.' },
      C: { error: '9 sq m is only the fountain area.', remediation: 'Subtract 9 from 56 to find the surrounding area: 47 sq m.' },
      D: { error: 'Student subtracted 3 × 6 = 18.', remediation: 'Fountain area is 3 × 3 = 9 sq m. 56 - 9 = 47 sq m.' }
    }
  }
];

const g4Questions = [
  // Low (8)
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 239,
    question_text: 'How many meters are in 5 kilometers?',
    option_a: '5,000 meters', option_b: '500 meters', option_c: '50 meters', option_d: '50,000 meters',
    correct_answer: 'A',
    explanation: '1 kilometer = 1,000 meters. Therefore, 5 kilometers = 5 × 1,000 = 5,000 meters.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied by 100 instead of 1,000.', remediation: 'Kilo- means 1,000. 1 km = 1,000 m, so 5 km = 5,000 m.' },
      C: { error: 'Student multiplied by 10.', remediation: '1 km = 1,000 m.' },
      D: { error: 'Student multiplied by 10,000.', remediation: '5 × 1,000 = 5,000 meters.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 239,
    question_text: 'How many ounces are in 3 pounds?',
    option_a: '48 ounces', option_b: '30 ounces', option_c: '36 ounces', option_d: '24 ounces',
    correct_answer: 'A',
    explanation: '1 pound = 16 ounces. Therefore, 3 pounds = 3 × 16 = 48 ounces.',
    distractor_diagnostics: {
      B: { error: 'Student assumed 1 pound = 10 ounces (base-10 assumption).', remediation: 'In customary units, 1 pound = 16 ounces. 3 × 16 = 48 ounces.' },
      C: { error: 'Student multiplied 3 × 12.', remediation: 'There are 16 ounces in a pound: 3 × 16 = 48 oz.' },
      D: { error: 'Student multiplied 3 × 8.', remediation: '16 ounces per pound: 3 × 16 = 48 oz.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Angle Concepts', subtopic_id: 243,
    question_text: 'An angle that turns through 90 one-degree angles is called what type of angle?',
    option_a: 'A right angle', option_b: 'An acute angle', option_c: 'An obtuse angle', option_d: 'A straight angle',
    correct_answer: 'A',
    explanation: 'An angle measuring exactly 90 degrees is a right angle.',
    distractor_diagnostics: {
      B: { error: 'Acute angles are strictly less than 90 degrees.', remediation: 'An angle of exactly 90° is a right angle.' },
      C: { error: 'Obtuse angles are greater than 90 degrees.', remediation: 'Exactly 90° is a right angle.' },
      D: { error: 'A straight angle is 180 degrees.', remediation: '90° is a right angle.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Measuring Angles', subtopic_id: 244,
    question_text: 'A student uses a protractor to measure an acute angle. The protractor shows rays passing through 65° and 115°. What is the measure of the acute angle?',
    option_a: '65°', option_b: '115°', option_c: '180°', option_d: '50°',
    correct_answer: 'A',
    explanation: 'An acute angle is strictly less than 90°. Since 65° < 90° and 115° > 90°, the angle measures 65°.',
    distractor_diagnostics: {
      B: { error: 'Student read the wrong (obtuse) scale on the protractor.', remediation: 'Acute angles are less than 90°, so choose 65°.' },
      C: { error: '180° is a straight line.', remediation: 'The acute angle measures 65°.' },
      D: { error: 'Student subtracted 115 - 65 = 50.', remediation: 'Read the scale starting from 0: 65°.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Rectangle Area & Perimeter', subtopic_id: 241,
    question_text: 'A rectangle has a length of 9 meters and a width of 5 meters. What is its PERIMETER?',
    option_a: '28 meters', option_b: '45 square meters', option_c: '14 meters', option_d: '38 meters',
    correct_answer: 'A',
    explanation: 'Perimeter = 2(length + width) = 2(9 + 5) = 2(14) = 28 meters.',
    distractor_diagnostics: {
      B: { error: '45 sq m is the area (9 × 5), not perimeter.', remediation: 'Perimeter is distance around: 2(9 + 5) = 28 meters.' },
      C: { error: 'Student only added length and width (9 + 5 = 14) without multiplying by 2.', remediation: 'A rectangle has 4 sides: 2 × 14 = 28 meters.' },
      D: { error: 'Student made an arithmetic error.', remediation: '2(9 + 5) = 28 meters.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Unknown Angles', subtopic_id: 245,
    question_text: 'A right angle (90°) is decomposed into two smaller angles. One angle measures 35°. What is the measure of the other angle?',
    option_a: '55°', option_b: '65°', option_c: '145°', option_d: '45°',
    correct_answer: 'A',
    explanation: 'Subtract from 90°: 90° - 35° = 55°.',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated 90 - 35.', remediation: '90 - 35 = 55°.' },
      C: { error: 'Student subtracted from 180° (supplementary angle).', remediation: 'A right angle is 90°, so subtract from 90°: 90 - 35 = 55°.' },
      D: { error: 'Student guessed 45°.', remediation: '90 - 35 = 55°.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 239,
    question_text: 'How many minutes are in 4 hours?',
    option_a: '240 minutes', option_b: '400 minutes', option_c: '160 minutes', option_d: '200 minutes',
    correct_answer: 'A',
    explanation: '1 hour = 60 minutes. 4 hours = 4 × 60 = 240 minutes.',
    distractor_diagnostics: {
      B: { error: 'Student assumed 1 hour = 100 minutes.', remediation: 'There are 60 minutes in an hour: 4 × 60 = 240 minutes.' },
      C: { error: 'Student multiplied 4 × 40.', remediation: '4 × 60 = 240 minutes.' },
      D: { error: 'Student made an arithmetic error.', remediation: '4 × 60 = 240 minutes.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Angle Concepts', subtopic_id: 243,
    question_text: 'How many degrees are in a complete full-circle rotation?',
    option_a: '360°', option_b: '180°', option_c: '90°', option_d: '100°',
    correct_answer: 'A',
    explanation: 'A complete full circle consists of 360 degrees.',
    distractor_diagnostics: {
      B: { error: '180° is a half circle (straight line).', remediation: 'A full circle is 360°.' },
      C: { error: '90° is a quarter circle (right angle).', remediation: 'A full circle is 360°.' },
      D: { error: 'Student guessed 100°.', remediation: 'There are 360 degrees in a full rotation.' }
    }
  },

  // Medium (9)
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Measurement Word Problems', subtopic_id: 240,
    question_text: 'A runner trains on a track. On Monday she runs 2 kilometers. On Tuesday she runs 850 meters. What is the TOTAL distance she ran in meters?',
    option_a: '2,850 meters', option_b: '852 meters', option_c: '2,085 meters', option_d: '1,050 meters',
    correct_answer: 'A',
    explanation: 'Convert 2 km to meters: 2 × 1,000 = 2,000 meters. Total = 2,000 + 850 = 2,850 meters.',
    distractor_diagnostics: {
      B: { error: 'Student added 2 + 850 directly without converting kilometers to meters.', remediation: 'Convert 2 km to 2,000 m first: 2,000 + 850 = 2,850 m.' },
      C: { error: 'Student miswrote the digits.', remediation: '2,000 + 850 = 2,850 meters.' },
      D: { error: 'Student subtracted 2000 - 850 = 1150 or miscalculated.', remediation: 'Add the two distances: 2,000 + 850 = 2,850 meters.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Rectangle Area & Perimeter', subtopic_id: 241,
    question_text: 'The perimeter of a rectangular swimming pool is 64 meters. The width of the pool is 12 meters. What is the LENGTH of the pool?',
    option_a: '20 meters', option_b: '26 meters', option_c: '52 meters', option_d: '40 meters',
    correct_answer: 'A',
    explanation: 'Perimeter P = 2(L + W) = 64. Semi-perimeter L + W = 32. Length = 32 - 12 = 20 meters.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 64 - 12 = 52, then divided by 2 = 26.', remediation: 'Both widths must be subtracted: 64 - 24 = 40, then 40 ÷ 2 = 20 meters.' },
      C: { error: 'Student subtracted 64 - 12 = 52 and forgot to divide by 2.', remediation: 'Length = (64 - 24) / 2 = 20 meters.' },
      D: { error: '40 meters is the sum of both lengths (2L), not a single length.', remediation: 'Divide 40 by 2 to find length: 20 meters.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Unknown Angles', subtopic_id: 245,
    question_text: 'Three angles form a straight line (180°). Angle 1 measures 45° and Angle 2 measures 75°. What is the measure of Angle 3?',
    option_a: '60°', option_b: '120°', option_c: '50°', option_d: '70°',
    correct_answer: 'A',
    explanation: 'Sum of known angles = 45° + 75° = 120°. Angle 3 = 180° - 120° = 60°.',
    distractor_diagnostics: {
      B: { error: '120° is the sum of the first two angles, not Angle 3.', remediation: 'Subtract 120° from 180° to find Angle 3: 180° - 120° = 60°.' },
      C: { error: 'Student miscalculated 180 - 120.', remediation: '180 - 120 = 60°.' },
      D: { error: 'Student made an arithmetic error.', remediation: '180 - (45 + 75) = 60°.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 239,
    question_text: 'A punch bowl contains 3 gallons of juice. How many quarts of juice are in the bowl?',
    option_a: '12 quarts', option_b: '6 quarts', option_c: '24 quarts', option_d: '15 quarts',
    correct_answer: 'A',
    explanation: '1 gallon = 4 quarts. 3 gallons = 3 × 4 = 12 quarts.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 3 × 2.', remediation: 'There are 4 quarts in 1 gallon: 3 × 4 = 12 quarts.' },
      C: { error: '24 is the number of pints, not quarts.', remediation: '1 gal = 4 qt, so 3 gal = 12 qt.' },
      D: { error: 'Student multiplied by 5.', remediation: '3 × 4 = 12 quarts.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Measuring Angles', subtopic_id: 244,
    question_text: 'An angle turns through 3/4 of a full circle. How many degrees does this angle measure?',
    option_a: '270°', option_b: '180°', option_c: '90°', option_d: '240°',
    correct_answer: 'A',
    explanation: 'A full circle is 360°. (3/4) × 360° = 3 × 90° = 270°.',
    distractor_diagnostics: {
      B: { error: '180° is 1/2 of a circle.', remediation: '(3/4) × 360° = 270°.' },
      C: { error: '90° is 1/4 of a circle.', remediation: 'Multiply 90° by 3: 270°.' },
      D: { error: 'Student calculated (2/3) × 360° = 240°.', remediation: '(3/4) of 360° is 270°.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Measurement Word Problems', subtopic_id: 240,
    question_text: 'A bag of potatoes weighs 4 pounds and 6 ounces. How many TOTAL ounces does the bag weigh?',
    option_a: '70 ounces', option_b: '46 ounces', option_c: '64 ounces', option_d: '74 ounces',
    correct_answer: 'A',
    explanation: 'Convert pounds to ounces: 4 × 16 = 64 ounces. Add remaining ounces: 64 + 6 = 70 ounces.',
    distractor_diagnostics: {
      B: { error: 'Student concatenated digits 4 and 6 to make 46.', remediation: '1 pound = 16 ounces. 4 × 16 = 64 oz, then 64 + 6 = 70 ounces.' },
      C: { error: '64 oz is only the 4 pounds, forgetting the 6 ounces.', remediation: 'Add the extra 6 ounces: 64 + 6 = 70 ounces.' },
      D: { error: 'Student made an addition error.', remediation: '64 + 6 = 70 ounces.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Rectangle Area & Perimeter', subtopic_id: 241,
    question_text: 'A rectangular painting has an area of 108 square inches and a width of 9 inches. What is the PERIMETER of the painting?',
    option_a: '42 inches', option_b: '21 inches', option_c: '38 inches', option_d: '48 inches',
    correct_answer: 'A',
    explanation: 'Length = Area ÷ width = 108 ÷ 9 = 12 inches. Perimeter = 2(12 + 9) = 2(21) = 42 inches.',
    distractor_diagnostics: {
      B: { error: '21 inches is the semi-perimeter (12 + 9) without multiplying by 2.', remediation: 'Perimeter requires 2(L + W): 2 × 21 = 42 inches.' },
      C: { error: 'Student made an arithmetic error.', remediation: '2(12 + 9) = 42 inches.' },
      D: { error: 'Student calculated 4 × 12 = 48.', remediation: 'Width is 9 in and length is 12 in: 2(12 + 9) = 42 inches.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Unknown Angles', subtopic_id: 245,
    question_text: 'Angle ABC is a straight angle (180°). Ray BD divides it into angle ABD and angle DBC. If angle ABD is twice as large as angle DBC, what is the measure of angle DBC?',
    option_a: '60°', option_b: '120°', option_c: '90°', option_d: '45°',
    correct_answer: 'A',
    explanation: 'Let angle DBC = x. Then angle ABD = 2x. 2x + x = 180° -> 3x = 180° -> x = 60°.',
    distractor_diagnostics: {
      B: { error: '120° is the measure of the larger angle (angle ABD = 2 × 60°).', remediation: 'The question asks for the smaller angle DBC: x = 60°.' },
      C: { error: 'Student assumed a right angle.', remediation: '3x = 180° -> x = 60°.' },
      D: { error: 'Student divided 180 by 4.', remediation: 'Divide 180 by 3 parts: 60°.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Measurement Word Problems', subtopic_id: 240,
    question_text: 'A science teacher pours 3 liters and 450 milliliters of solution into a container. Later she pours in 1 liter and 750 milliliters more. What is the total volume of solution?',
    option_a: '5 liters and 200 milliliters', option_b: '4 liters and 1,200 milliliters', option_c: '5 liters and 100 milliliters', option_d: '4 liters and 200 milliliters',
    correct_answer: 'A',
    explanation: 'Liters: 3 + 1 = 4 L. Milliliters: 450 + 750 = 1,200 mL = 1 L and 200 mL. Total = 4 L + 1 L + 200 mL = 5 L and 200 mL.',
    distractor_diagnostics: {
      B: { error: 'Student did not regroup 1,200 mL into 1 liter and 200 mL.', remediation: '1,000 mL = 1 L. Regroup 1,200 mL as 1 L 200 mL, giving 5 L 200 mL.' },
      C: { error: 'Student made an addition error in milliliters.', remediation: '450 + 750 = 1,200 mL, leaving 200 mL.' },
      D: { error: 'Student forgot to add the regrouped 1 liter.', remediation: '4 L + 1 L (from 1,000 mL) = 5 L 200 mL.' }
    }
  },

  // High (8)
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Measurement Word Problems', subtopic_id: 240,
    question_text: 'A carpenter needs 4 pieces of wood, each 2 feet 8 inches long. What is the TOTAL length of wood needed in feet and inches?',
    option_a: '10 feet 8 inches', option_b: '8 feet 32 inches', option_c: '9 feet 8 inches', option_d: '11 feet 2 inches',
    correct_answer: 'A',
    explanation: 'Multiply feet: 4 × 2 ft = 8 ft. Multiply inches: 4 × 8 in = 32 in. Convert 32 in to feet: 32 ÷ 12 = 2 ft with 8 in remaining. Total = 8 ft + 2 ft + 8 in = 10 ft 8 in.',
    distractor_diagnostics: {
      B: { error: 'Student did not regroup the 32 inches into feet.', remediation: '12 inches = 1 foot. 32 inches = 2 feet and 8 inches. 8 ft + 2 ft 8 in = 10 ft 8 in.' },
      C: { error: 'Student only added 1 foot from inches.', remediation: '32 inches has two 12-inch groups: 2 ft 8 in. 8 + 2 = 10 ft 8 in.' },
      D: { error: 'Student made an arithmetic error.', remediation: 'Total is 10 feet 8 inches.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Rectangle Area & Perimeter', subtopic_id: 241,
    question_text: 'A rectangular garden has a perimeter of 44 meters and an area of 112 square meters. What are the dimensions (length and width) of the garden?',
    option_a: '14 meters by 8 meters', option_b: '16 meters by 7 meters', option_c: '12 meters by 10 meters', option_d: '20 meters by 2 meters',
    correct_answer: 'A',
    explanation: 'Check perimeter: 2(14 + 8) = 2(22) = 44 m. Check area: 14 × 8 = 112 sq m. Both conditions are satisfied.',
    distractor_diagnostics: {
      B: { error: '16 × 7 = 112 sq m, but perimeter is 2(16 + 7) = 46 m (not 44 m).', remediation: 'Perimeter must be 44 m: 2(14 + 8) = 44.' },
      C: { error: 'Perimeter is 44 m, but area is 12 × 10 = 120 sq m (not 112 sq m).', remediation: 'Area must be 112 sq m: 14 × 8 = 112.' },
      D: { error: '20 × 2 = 40 sq m.', remediation: 'Dimensions are 14 m by 8 m.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Unknown Angles', subtopic_id: 245,
    question_text: 'In the diagram, four angles meet at a single central point to complete a full 360° circle. The angles measure 110°, 85°, 75°, and x. What is the value of x?',
    option_a: '90°', option_b: '100°', option_c: '80°', option_d: '70°',
    correct_answer: 'A',
    explanation: 'Sum of angles around a point is 360°. Sum of known angles: 110 + 85 + 75 = 270°. x = 360° - 270° = 90°.',
    distractor_diagnostics: {
      B: { error: 'Student made an addition or subtraction error.', remediation: '110 + 85 + 75 = 270°. 360 - 270 = 90°.' },
      C: { error: 'Student subtracted from 350°.', remediation: 'A full circle has 360°: 360 - 270 = 90°.' },
      D: { error: 'Student miscalculated.', remediation: 'x = 90°.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 239,
    question_text: 'A water jug holds 2 gallons of water. If students fill water bottles holding 1 pint each, how many bottles can be filled completely?',
    option_a: '16 bottles', option_b: '8 bottles', option_c: '4 bottles', option_d: '32 bottles',
    correct_answer: 'A',
    explanation: '1 gallon = 4 quarts = 8 pints. Therefore, 2 gallons = 2 × 8 = 16 pints. 16 bottles can be filled.',
    distractor_diagnostics: {
      B: { error: '8 pints is 1 gallon, not 2 gallons.', remediation: 'Multiply by 2 for 2 gallons: 8 × 2 = 16 bottles.' },
      C: { error: '4 is the number of quarts in 1 gallon.', remediation: 'There are 8 pints in 1 gallon, so 16 pints in 2 gallons.' },
      D: { error: '32 is the number of cups.', remediation: '1 gallon = 8 pints, so 2 gallons = 16 pints.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Measurement Word Problems', subtopic_id: 240,
    question_text: 'A train leaves Station A at 8:45 a.m. and travels for 3 hours and 35 minutes to Station B. It stops for 25 minutes, then travels for 1 hour and 40 minutes to Station C. What time does the train arrive at Station C?',
    option_a: '2:25 p.m.', option_b: '1:45 p.m.', option_c: '2:15 p.m.', option_d: '3:05 p.m.',
    correct_answer: 'A',
    explanation: 'Total travel and stop time = 3 hr 35 min + 25 min + 1 hr 40 min = 4 hr 100 min + 40 min = 5 hr 40 min. 8:45 a.m. + 5 hr 40 min: 8:45 + 5 hr = 1:45 p.m.; 1:45 + 40 min = 2:25 p.m.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to add the second leg of the trip.', remediation: 'Calculate total elapsed time (5 hours 40 minutes): 8:45 a.m. + 5:40 = 2:25 p.m.' },
      C: { error: 'Student miscalculated the minutes.', remediation: '8:45 + 5 hours 40 minutes = 2:25 p.m.' },
      D: { error: 'Student added an extra 40 minutes.', remediation: 'Arrival time is 2:25 p.m.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Rectangle Area & Perimeter', subtopic_id: 241,
    question_text: 'A square has an area of 64 square centimeters. A rectangle has the same perimeter as this square. If the width of the rectangle is 6 cm, what is the area of the rectangle?',
    option_a: '60 square centimeters', option_b: '64 square centimeters', option_c: '48 square centimeters', option_d: '72 square centimeters',
    correct_answer: 'A',
    explanation: 'Side of square = √64 = 8 cm. Perimeter of square = 4 × 8 = 32 cm. Rectangle perimeter = 2(L + 6) = 32 -> L + 6 = 16 -> L = 10 cm. Rectangle area = 10 × 6 = 60 sq cm.',
    distractor_diagnostics: {
      B: { error: 'Student assumed equal perimeter implies equal area.', remediation: 'Rectangles with the same perimeter have different areas: L = 10, W = 6 -> Area = 60 sq cm.' },
      C: { error: 'Student multiplied 8 × 6 = 48.', remediation: 'Length is 10 cm, so area = 10 × 6 = 60 sq cm.' },
      D: { error: 'Student made an arithmetic error.', remediation: 'Area is 60 square centimeters.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Unknown Angles', subtopic_id: 245,
    question_text: 'A ray divides a straight angle of 180° into two angles such that one angle is 30° more than twice the other angle. What is the measure of the smaller angle?',
    option_a: '50°', option_b: '130°', option_c: '60°', option_d: '45°',
    correct_answer: 'A',
    explanation: 'Let smaller angle = x. Larger angle = 2x + 30. Equation: x + (2x + 30) = 180 -> 3x + 30 = 180 -> 3x = 150 -> x = 50°.',
    distractor_diagnostics: {
      B: { error: '130° is the larger angle (2(50) + 30 = 130°).', remediation: 'The question asks for the smaller angle: x = 50°.' },
      C: { error: 'Student divided 180 by 3 without subtracting 30 first.', remediation: 'Subtract 30 first: 180 - 30 = 150. Then 150 ÷ 3 = 50°.' },
      D: { error: 'Student guessed 45°.', remediation: 'Smaller angle is 50°.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Measurement Word Problems', subtopic_id: 240,
    question_text: 'A chef bought 3 kg 600 g of beef and 2 kg 850 g of chicken. He cooked 4 kg 900 g of meat for a banquet. How much meat was left over in grams?',
    option_a: '1,550 grams', option_b: '1,450 grams', option_c: '2,550 grams', option_d: '1,650 grams',
    correct_answer: 'A',
    explanation: 'Total meat = 3,600 g + 2,850 g = 6,450 g. Cooked = 4,900 g. Left over = 6,450 - 4,900 = 1,550 grams.',
    distractor_diagnostics: {
      B: { error: 'Student made an error in subtraction: 6,450 - 4,900 = 1,550, not 1,450.', remediation: '6,450 - 4,900 = 1,550 grams.' },
      C: { error: 'Student made an arithmetic error in the thousands place.', remediation: '6,450 - 4,900 = 1,550 g.' },
      D: { error: 'Student added 100 g too much.', remediation: '1,550 grams remaining.' }
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
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 3 & Grade 4 Measurement...`);

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
          topic_id = 4,
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
          6, 4, NULL, ?, ?,
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
