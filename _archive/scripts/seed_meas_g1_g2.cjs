const mysql = require('mysql2/promise');
require('dotenv').config();

const g1Questions = [
  // Low (8)
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'A red pencil and a blue pencil both start at the exact same edge of a desk. The red pencil stretches past the blue pencil. Which statement is true?',
    option_a: 'The red pencil is longer than the blue pencil', option_b: 'The blue pencil is longer than the red pencil', option_c: 'Both pencils have the exact same length', option_d: 'The blue pencil is heavier',
    correct_answer: 'A',
    explanation: 'Since both pencils start at the same baseline and the red pencil reaches further, the red pencil is longer.',
    distractor_diagnostics: {
      B: { error: 'Student reversed the length comparison.', remediation: 'The pencil that extends further from the common starting line is longer.' },
      C: { error: 'Student thought they are equal despite one reaching further.', remediation: 'Look at the endpoints: the red pencil stretches past the blue one.' },
      D: { error: 'Student confused length with weight.', remediation: 'Length measures how long an object is, not its weight.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Measuring Length with Units', subtopic_id: 222,
    question_text: 'How should paper clips be placed to measure the length of a marker correctly?',
    option_a: 'In a straight line end-to-end with no gaps and no overlaps', option_b: 'With small spaces between each paper clip', option_c: 'Overlapping each paper clip on top of the next', option_d: 'Scattered across the marker',
    correct_answer: 'A',
    explanation: 'To measure accurately, non-standard units must be placed end-to-end in a straight line without any gaps or overlaps.',
    distractor_diagnostics: {
      B: { error: 'Leaving gaps leads to undercounting the true length.', remediation: 'Units must touch end-to-end with zero gaps.' },
      C: { error: 'Overlapping units leads to overcounting.', remediation: 'Units should touch end-to-end without overlapping.' },
      D: { error: 'Scattered units cannot measure linear length.', remediation: 'Lay units in a straight line along the edge of the object.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'On an analog clock, which hand tells the HOUR?',
    option_a: 'The short hand', option_b: 'The long hand', option_c: 'The thinnest hand', option_d: 'The fastest hand',
    correct_answer: 'A',
    explanation: 'The short hand is the hour hand, and the long hand is the minute hand.',
    distractor_diagnostics: {
      B: { error: 'The long hand tells minutes, not hours.', remediation: 'Remember: short hand = hour, long hand = minute.' },
      C: { error: 'The thin hand typically counts seconds.', remediation: 'The short hand indicates the hour.' },
      D: { error: 'The hour hand is the slowest moving hand.', remediation: 'The short hand points to the hour.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'When the long minute hand points to 12 and the short hour hand points to 5, what time is it?',
    option_a: '5:00', option_b: '12:05', option_c: '5:12', option_d: '12:00',
    correct_answer: 'A',
    explanation: 'When the minute hand is on 12, it is an "o\'clock" time (:00). Since the hour hand is on 5, the time is 5:00.',
    distractor_diagnostics: {
      B: { error: 'Student swapped the hour and minute hands.', remediation: 'The short hand shows the hour (5) and minute hand on 12 means :00, so 5:00.' },
      C: { error: 'Student read the minute hand position as 12 minutes.', remediation: 'Minute hand pointing to 12 means 0 minutes past the hour (:00).' },
      D: { error: 'Student thought it is 12 o\'clock.', remediation: 'Look at the short hand: it points to 5, so it is 5:00.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'Ribbon A is longer than Ribbon B. Ribbon B is longer than Ribbon C. Which statement MUST be true?',
    option_a: 'Ribbon A is longer than Ribbon C', option_b: 'Ribbon C is the longest ribbon', option_c: 'Ribbon B is the longest ribbon', option_d: 'Ribbon A and Ribbon C are equal',
    correct_answer: 'A',
    explanation: 'By transitivity of length: If A > B and B > C, then Ribbon A is definitely longer than Ribbon C.',
    distractor_diagnostics: {
      B: { error: 'Ribbon C is shorter than B, which is shorter than A, so C is shortest.', remediation: 'A is longer than both B and C.' },
      C: { error: 'Ribbon A is longer than Ribbon B.', remediation: 'Ribbon A is the longest of all three.' },
      D: { error: 'A is longer than B and B is longer than C, so A cannot equal C.', remediation: 'Ribbon A is longer than Ribbon C.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Measuring Length with Units', subtopic_id: 222,
    question_text: 'A crayon is measured with connecting cubes. It takes 6 cubes lined up end-to-end to match the crayon. How long is the crayon?',
    option_a: '6 cubes long', option_b: '5 cubes long', option_c: '7 cubes long', option_d: '12 cubes long',
    correct_answer: 'A',
    explanation: 'Since 6 cubes match the length from end to end, the crayon is 6 cubes long.',
    distractor_diagnostics: {
      B: { error: 'Student undercounted by 1.', remediation: 'The measurement matches the total number of cubes: 6 cubes long.' },
      C: { error: 'Student overcounted by 1.', remediation: 'Count each cube exactly once: 6 cubes.' },
      D: { error: 'Student doubled the number of cubes.', remediation: 'The length is 6 cubes long.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'What time is shown on a clock when the minute hand points to 6 and the hour hand is halfway between 8 and 9?',
    option_a: '8:30', option_b: '9:30', option_c: '8:06', option_d: '6:40',
    correct_answer: 'A',
    explanation: 'The minute hand at 6 represents 30 minutes. Since the hour hand is between 8 and 9, it is half-past 8, or 8:30.',
    distractor_diagnostics: {
      B: { error: 'Student jumped ahead to the next hour (9:30).', remediation: 'The hour hand has passed 8 but has not reached 9 yet, so it is 8:30.' },
      C: { error: 'Student read the minute hand face number (6) as 6 minutes.', remediation: 'Minute hand pointing to 6 represents 30 minutes (6 × 5 = 30).' },
      D: { error: 'Student swapped the hour and minute positions.', remediation: 'Minute hand at 6 is :30, hour hand past 8 is 8:30.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'Which object is usually the SHORTEST in real life?',
    option_a: 'A paperclip', option_b: 'A pencil', option_c: 'A baseball bat', option_d: 'A school bus',
    correct_answer: 'A',
    explanation: 'A paperclip is typically about 1 to 2 inches long, making it much shorter than a pencil, bat, or bus.',
    distractor_diagnostics: {
      B: { error: 'A pencil is longer than a paperclip (about 7 inches).', remediation: 'A paperclip is much smaller and shorter than a pencil.' },
      C: { error: 'A baseball bat is about 30 inches long.', remediation: 'A paperclip is the shortest object listed.' },
      D: { error: 'A school bus is the longest object listed.', remediation: 'A paperclip is only about an inch long.' }
    }
  },

  // Medium (9)
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'Two strips of paper are shown on a table. Strip X starts at 0 cm and ends at 7 cm. Strip Y starts at 2 cm and ends at 8 cm. Which strip is longer?',
    option_a: 'Strip X is longer (7 cm vs 6 cm)', option_b: 'Strip Y is longer because 8 is greater than 7', option_c: 'Both strips have the exact same length', option_d: 'Strip Y is 8 cm long',
    correct_answer: 'A',
    explanation: 'Length of Strip X = 7 - 0 = 7 cm. Length of Strip Y = 8 - 2 = 6 cm. Strip X is longer.',
    distractor_diagnostics: {
      B: { error: 'Student looked only at the right endpoint (8) and ignored that Strip Y started at 2 cm.', remediation: 'Subtract the starting point from the endpoint: Strip Y is 8 - 2 = 6 cm long.' },
      C: { error: 'Student guessed they are equal.', remediation: 'Calculate actual lengths: 7 cm vs 6 cm.' },
      D: { error: 'Strip Y does not start at 0, so it is not 8 cm long.', remediation: 'Strip Y length is 8 - 2 = 6 cm.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'A digital clock displays 10:30. Where should the hands be on an analog clock to show the same time?',
    option_a: 'Hour hand halfway between 10 and 11, minute hand pointing directly at 6', option_b: 'Hour hand pointing directly at 10, minute hand pointing at 6', option_c: 'Hour hand at 6, minute hand at 10', option_d: 'Hour hand halfway between 9 and 10, minute hand at 6',
    correct_answer: 'A',
    explanation: 'At 10:30, 30 minutes have passed, so the minute hand points to 6 and the hour hand has moved halfway from 10 towards 11.',
    distractor_diagnostics: {
      B: { error: 'Student thought the hour hand stays pointing directly at 10.', remediation: 'As 30 minutes pass, the hour hand moves halfway between 10 and 11.' },
      C: { error: 'Student swapped the hour and minute hands.', remediation: 'Hour is 10 (short hand) and 30 minutes is 6 (long hand).' },
      D: { error: 'Between 9 and 10 would represent 9:30.', remediation: 'The time is 10:30, so the hour hand is between 10 and 11.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Measuring Length with Units', subtopic_id: 222,
    question_text: 'Mia measured a book using two different units: paperclips and new pencils. Which statement is correct?',
    option_a: 'She will need MORE paperclips than pencils because paperclips are shorter', option_b: 'She will need FEWER paperclips than pencils because paperclips are smaller', option_c: 'She will need the exact same number of each', option_d: 'She cannot measure a book with pencils',
    correct_answer: 'A',
    explanation: 'Smaller measurement units require a greater quantity of units to cover the same length (inverse relationship).',
    distractor_diagnostics: {
      B: { error: 'Student inverted the unit size relationship.', remediation: 'Shorter units mean you need MORE of them to span the same distance.' },
      C: { error: 'Different sized units cannot produce the same count.', remediation: 'Paperclips are shorter than pencils, so more paperclips are required.' },
      D: { error: 'Any straight unit can measure length.', remediation: 'You will need more paperclips than pencils.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'Pencil A is 5 paperclips long. Pencil B is 8 paperclips long. How many paperclips LONGER is Pencil B than Pencil A?',
    option_a: '3 paperclips', option_b: '13 paperclips', option_c: '4 paperclips', option_d: '8 paperclips',
    correct_answer: 'A',
    explanation: 'Subtract the shorter length from the longer length: 8 - 5 = 3 paperclips.',
    distractor_diagnostics: {
      B: { error: 'Student added the lengths together: 8 + 5 = 13.', remediation: '"How much longer" asks for the difference: subtract 8 - 5 = 3.' },
      C: { error: 'Student miscounted.', remediation: '8 - 5 = 3 paperclips.' },
      D: { error: 'Student just selected Pencil B\'s length.', remediation: 'Find the difference: 8 - 5 = 3.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'Recess begins at 1:00 and ends at 1:30. How many minutes long is recess?',
    option_a: '30 minutes', option_b: '60 minutes', option_c: '15 minutes', option_d: '1 hour',
    correct_answer: 'A',
    explanation: 'From 1:00 to 1:30 is half an hour, which equals exactly 30 minutes.',
    distractor_diagnostics: {
      B: { error: '60 minutes is a full hour.', remediation: 'From :00 to :30 is 30 minutes (half an hour).' },
      C: { error: 'Student guessed 15 minutes.', remediation: 'Count from 0 to 30 minutes: 30 minutes.' },
      D: { error: '1 hour would be until 2:00.', remediation: '1:00 to 1:30 is 30 minutes.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Measuring Length with Units', subtopic_id: 222,
    question_text: 'Sam lined up 4 small blocks to measure a paintbrush, but left spaces between the blocks. What will happen to his measurement?',
    option_a: 'His measurement will be an underestimate (too few blocks)', option_b: 'His measurement will be an overestimate (too many blocks)', option_c: 'His measurement will be completely accurate', option_d: 'The paintbrush will get shorter',
    correct_answer: 'A',
    explanation: 'Leaving gaps means empty space is not counted by blocks, so it takes fewer blocks than it should, underestimating the true length in blocks.',
    distractor_diagnostics: {
      B: { error: 'Overestimate happens with overlaps, not gaps.', remediation: 'Gaps take up space without blocks, so fewer blocks are used than actual.' },
      C: { error: 'Gaps cause measurement errors.', remediation: 'Units must touch end-to-end with no spaces.' },
      D: { error: 'Measuring does not change the physical size of the object.', remediation: 'The paintbrush stays the same size; only the measurement is inaccurate.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'Order the three strings from SHORTEST to LONGEST: String P is 4 cubes long, String Q is 9 cubes long, String R is 6 cubes long.',
    option_a: 'String P, String R, String Q', option_b: 'String Q, String R, String P', option_c: 'String P, String Q, String R', option_d: 'String R, String P, String Q',
    correct_answer: 'A',
    explanation: 'Comparing lengths: 4 < 6 < 9. So the order from shortest to longest is String P (4), String R (6), String Q (9).',
    distractor_diagnostics: {
      B: { error: 'Student ordered from longest to shortest.', remediation: 'Read carefully: the question asks for shortest to longest (4, 6, 9).' },
      C: { error: 'Student placed 9 before 6.', remediation: '6 is shorter than 9, so R comes before Q.' },
      D: { error: 'String P (4) is shorter than String R (6).', remediation: 'Shortest is String P (4 cubes).' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'How many minutes are in one FULL hour?',
    option_a: '60 minutes', option_b: '30 minutes', option_c: '100 minutes', option_d: '24 minutes',
    correct_answer: 'A',
    explanation: 'There are 60 minutes in one full hour. (Half an hour is 30 minutes).',
    distractor_diagnostics: {
      B: { error: '30 minutes is half an hour.', remediation: 'A full hour has 60 minutes.' },
      C: { error: 'Student assumed base-10 (100).', remediation: 'Time uses 60 minutes in an hour, not 100.' },
      D: { error: '24 is the number of hours in a full day.', remediation: '1 day = 24 hours, but 1 hour = 60 minutes.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Measuring Length with Units', subtopic_id: 222,
    question_text: 'If a toy car is 3 blocks long, and a toy truck is 2 times as long as the toy car, how many blocks long is the toy truck?',
    option_a: '6 blocks long', option_b: '5 blocks long', option_c: '1 block long', option_d: '8 blocks long',
    correct_answer: 'A',
    explanation: 'Multiply the length of the car by 2: 3 × 2 = 6 blocks long.',
    distractor_diagnostics: {
      B: { error: 'Student added 3 + 2 = 5.', remediation: '"2 times as long" means multiply: 3 × 2 = 6 blocks.' },
      C: { error: 'Student subtracted 3 - 2 = 1.', remediation: 'The truck is longer: multiply 3 by 2 = 6.' },
      D: { error: 'Student miscalculated.', remediation: '3 + 3 = 6 blocks.' }
    }
  },

  // High (8)
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'Stick A is longer than Stick B. Stick C is shorter than Stick B. Which stick is the SHORTEST of all three?',
    option_a: 'Stick C', option_b: 'Stick B', option_c: 'Stick A', option_d: 'Stick A and Stick C are equal',
    correct_answer: 'A',
    explanation: 'Stick A > Stick B, and Stick B > Stick C. Therefore, Stick A is longest, Stick B is in the middle, and Stick C is the shortest.',
    distractor_diagnostics: {
      B: { error: 'Stick B is longer than Stick C.', remediation: 'Stick C is shorter than Stick B, making Stick C the shortest.' },
      C: { error: 'Stick A is the longest stick.', remediation: 'Stick C is the shortest.' },
      D: { error: 'Stick A is longest and Stick C is shortest, so they are not equal.', remediation: 'Stick C is shorter than B, which is shorter than A.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'Ben leaves for soccer practice at 4:30. The practice lasts 1 hour. What time does practice end?',
    option_a: '5:30', option_b: '5:00', option_c: '6:30', option_d: '4:00',
    correct_answer: 'A',
    explanation: 'Add 1 full hour to 4:30: 4 + 1 = 5, and the minutes stay at 30. The practice ends at 5:30.',
    distractor_diagnostics: {
      B: { error: 'Student only added 30 minutes.', remediation: 'Add 1 full hour (60 minutes): 4:30 + 1 hour = 5:30.' },
      C: { error: 'Student added 2 hours.', remediation: '4:30 + 1 hour = 5:30.' },
      D: { error: 'Student subtracted 1 hour instead of adding.', remediation: 'Practice ends after starting, so add 1 hour: 5:30.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Measuring Length with Units', subtopic_id: 222,
    question_text: 'A table is measured with wooden craft sticks. 8 sticks are used. If each stick is replaced with two smaller paperclips of equal total length, how many paperclips will measure the table?',
    option_a: '16 paperclips', option_b: '4 paperclips', option_c: '10 paperclips', option_d: '8 paperclips',
    correct_answer: 'A',
    explanation: 'Each of the 8 sticks equals 2 paperclips: 8 × 2 = 16 paperclips.',
    distractor_diagnostics: {
      B: { error: 'Student divided 8 by 2.', remediation: 'Since each stick equals 2 paperclips, multiply: 8 × 2 = 16.' },
      C: { error: 'Student added 8 + 2.', remediation: 'Multiply 8 sticks by 2 paperclips per stick: 16 paperclips.' },
      D: { error: 'Paperclips are smaller, so more than 8 are required.', remediation: '8 × 2 = 16 paperclips.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'The hour hand of a clock is halfway between 11 and 12. The minute hand points directly at 6. What time will it be in 30 minutes?',
    option_a: '12:00', option_b: '11:30', option_c: '12:30', option_d: '1:00',
    correct_answer: 'A',
    explanation: 'Current time is 11:30. In 30 minutes, the minute hand moves to 12 and the hour hand reaches 12, making the time 12:00.',
    distractor_diagnostics: {
      B: { error: '11:30 is the current time, not the time in 30 minutes.', remediation: 'Add 30 minutes to 11:30: 11:30 + 30 min = 12:00.' },
      C: { error: 'Student added 1 hour instead of 30 minutes.', remediation: '30 minutes after 11:30 completes the hour: 12:00.' },
      D: { error: 'Student jumped too far ahead.', remediation: '11:30 + 30 minutes = 12:00.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'A teacher wants to measure the whiteboard. Which method gives the most accurate measurement?',
    option_a: 'Using 10 identical meter sticks laid end-to-end in a straight line', option_b: 'Using shoes of different students in the class', option_c: 'Using hands spread out with spaces between them', option_d: 'Pacing it out with steps of different sizes',
    correct_answer: 'A',
    explanation: 'Accurate measurement requires identical, standard units laid end-to-end without gaps or variations in size.',
    distractor_diagnostics: {
      B: { error: 'Students have different shoe sizes, making units inconsistent.', remediation: 'Units must all be the exact same size.' },
      C: { error: 'Hand spans vary and leaving spaces causes errors.', remediation: 'Units must touch without spaces.' },
      D: { error: 'Uneven steps produce inaccurate measurements.', remediation: 'Use identical standard units laid end-to-end.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Time', subtopic_id: 223,
    question_text: 'A movie starts at 6:00 and lasts for 1 hour and 30 minutes. What time does the movie finish?',
    option_a: '7:30', option_b: '7:00', option_c: '8:00', option_d: '8:30',
    correct_answer: 'A',
    explanation: '6:00 + 1 hour = 7:00. Adding the remaining 30 minutes gives 7:30.',
    distractor_diagnostics: {
      B: { error: 'Student forgot the 30 minutes.', remediation: 'Add both 1 hour and 30 minutes: 6:00 + 1:30 = 7:30.' },
      C: { error: 'Student rounded up to 2 hours.', remediation: '1 hour and 30 minutes after 6:00 is 7:30.' },
      D: { error: 'Student added 2 hours and 30 minutes.', remediation: '6:00 + 1:30 = 7:30.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Length Comparison', subtopic_id: 221,
    question_text: 'Rope 1 is 12 inches long. Rope 2 is 4 inches shorter than Rope 1. Rope 3 is 2 inches longer than Rope 2. How long is Rope 3?',
    option_a: '10 inches', option_b: '8 inches', option_c: '14 inches', option_d: '6 inches',
    correct_answer: 'A',
    explanation: 'Step 1: Rope 2 = 12 - 4 = 8 inches. Step 2: Rope 3 = 8 + 2 = 10 inches.',
    distractor_diagnostics: {
      B: { error: '8 inches is Rope 2, not Rope 3.', remediation: 'Add 2 inches to Rope 2 to find Rope 3: 8 + 2 = 10 inches.' },
      C: { error: 'Student added all numbers: 12 + 2.', remediation: 'Rope 2 is shorter (12 - 4 = 8), then Rope 3 is 8 + 2 = 10.' },
      D: { error: 'Student subtracted 2 from 8.', remediation: 'Rope 3 is longer than Rope 2: 8 + 2 = 10 inches.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Measuring Length with Units', subtopic_id: 222,
    question_text: 'A desk is 5 craft sticks long. Each craft stick is equal to 3 paper clips. How many paper clips long is the desk?',
    option_a: '15 paper clips', option_b: '8 paper clips', option_c: '12 paper clips', option_d: '2 paper clips',
    correct_answer: 'A',
    explanation: '5 craft sticks × 3 paper clips per craft stick = 15 paper clips.',
    distractor_diagnostics: {
      B: { error: 'Student added 5 + 3 = 8 instead of multiplying.', remediation: 'Each of the 5 sticks is 3 paperclips: 5 × 3 = 15 paperclips.' },
      C: { error: 'Student calculated 4 × 3.', remediation: '5 × 3 = 15 paperclips.' },
      D: { error: 'Student subtracted 5 - 3 = 2.', remediation: 'Multiply sticks by paper clips per stick: 5 × 3 = 15.' }
    }
  }
];

const g2Questions = [
  // Low (8)
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Measuring Length', subtopic_id: 225,
    question_text: 'When using a standard 12-inch ruler, where should you line up the beginning of an object?',
    option_a: 'At the 0 mark', option_b: 'At the 1-inch mark', option_c: 'At the very center of the ruler', option_d: 'At the 12-inch mark',
    correct_answer: 'A',
    explanation: 'To measure accurately, line up the left end of the object with the 0 mark on the ruler.',
    distractor_diagnostics: {
      B: { error: 'Starting at 1 results in an error of 1 inch.', remediation: 'Always start measuring at the 0 mark.' },
      C: { error: 'Measuring from center makes calculating length difficult.', remediation: 'Start at the 0 mark on the left.' },
      D: { error: '12 is the end of the ruler.', remediation: 'Begin at 0.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Estimating Length', subtopic_id: 226,
    question_text: 'What is the BEST estimate for the length of an unsharpened standard wooden pencil?',
    option_a: 'About 7 inches', option_b: 'About 7 feet', option_c: 'About 7 yards', option_d: 'About 7 meters',
    correct_answer: 'A',
    explanation: 'A standard pencil is about 7 to 8 inches long. Feet and yards are much too large.',
    distractor_diagnostics: {
      B: { error: '7 feet is taller than an adult human.', remediation: 'Use inches for small everyday objects like pencils.' },
      C: { error: '7 yards is 21 feet long.', remediation: 'A pencil is measured in inches: about 7 inches.' },
      D: { error: '7 meters is the length of a large vehicle.', remediation: 'Pencils are small objects measured in inches.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Time', subtopic_id: 229,
    question_text: 'When the minute hand of a clock points to the number 4, how many minutes past the hour is it?',
    option_a: '20 minutes', option_b: '4 minutes', option_c: '15 minutes', option_d: '40 minutes',
    correct_answer: 'A',
    explanation: 'Each number on the clock face represents 5 minutes: 4 × 5 = 20 minutes.',
    distractor_diagnostics: {
      B: { error: 'Student read the face number (4) directly as minutes.', remediation: 'Multiply the face number by 5: 4 × 5 = 20 minutes.' },
      C: { error: '15 minutes corresponds to the number 3.', remediation: 'Number 4 represents 20 minutes.' },
      D: { error: '40 minutes corresponds to the number 8.', remediation: '4 × 5 = 20 minutes.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Money', subtopic_id: 230,
    question_text: 'What is the value of 1 quarter, 2 dimes, and 1 nickel?',
    option_a: '50 cents', option_b: '40 cents', option_c: '45 cents', option_d: '35 cents',
    correct_answer: 'A',
    explanation: 'Quarter = 25¢, 2 dimes = 20¢, nickel = 5¢. Total = 25 + 20 + 5 = 50¢.',
    distractor_diagnostics: {
      B: { error: 'Student forgot the quarter or miscalculated.', remediation: 'Add: 25¢ (quarter) + 20¢ (dimes) + 5¢ (nickel) = 50¢.' },
      C: { error: 'Student miscalculated the nickel as 0.', remediation: '25 + 20 + 5 = 50¢.' },
      D: { error: 'Student added coin counts instead of coin values.', remediation: 'Count coin values: 25 + 10 + 10 + 5 = 50¢.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Comparing Lengths', subtopic_id: 227,
    question_text: 'Object A is 14 cm long. Object B is 9 cm long. How much longer is Object A than Object B?',
    option_a: '5 cm', option_b: '23 cm', option_c: '6 cm', option_d: '4 cm',
    correct_answer: 'A',
    explanation: 'Subtract the shorter length: 14 - 9 = 5 cm.',
    distractor_diagnostics: {
      B: { error: 'Student added 14 + 9 = 23.', remediation: '"How much longer" asks for the difference: subtract 14 - 9 = 5 cm.' },
      C: { error: 'Student miscounted by 1.', remediation: '14 - 9 = 5 cm.' },
      D: { error: 'Student subtracted incorrectly.', remediation: '14 - 9 = 5 cm.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Time', subtopic_id: 229,
    question_text: 'Which time label is appropriate for eating breakfast in the morning?',
    option_a: '7:30 a.m.', option_b: '7:30 p.m.', option_c: '12:00 a.m.', option_d: '3:00 p.m.',
    correct_answer: 'A',
    explanation: 'a.m. is used for morning hours from midnight to noon. 7:30 a.m. is morning breakfast time.',
    distractor_diagnostics: {
      B: { error: '7:30 p.m. is evening dinner time.', remediation: 'Morning hours use a.m.: 7:30 a.m.' },
      C: { error: '12:00 a.m. is midnight.', remediation: 'Morning breakfast is around 7:30 a.m.' },
      D: { error: '3:00 p.m. is afternoon.', remediation: 'Breakfast is in the morning: a.m.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Measuring Length', subtopic_id: 225,
    question_text: 'How many inches are in 1 foot?',
    option_a: '12 inches', option_b: '10 inches', option_c: '100 inches', option_d: '36 inches',
    correct_answer: 'A',
    explanation: 'There are exactly 12 inches in 1 standard foot.',
    distractor_diagnostics: {
      B: { error: 'Student assumed base-10.', remediation: 'The customary system uses 12 inches in 1 foot, not 10.' },
      C: { error: 'Student confused inches with metric centimeters.', remediation: '1 foot = 12 inches.' },
      D: { error: '36 inches is 1 yard.', remediation: '1 foot = 12 inches (3 feet = 1 yard = 36 inches).' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Money', subtopic_id: 230,
    question_text: 'Which coin has a value of 10 cents?',
    option_a: 'A dime', option_b: 'A nickel', option_c: 'A penny', option_d: 'A quarter',
    correct_answer: 'A',
    explanation: 'A dime is worth 10 cents. A nickel is 5¢, penny is 1¢, quarter is 25¢.',
    distractor_diagnostics: {
      B: { error: 'A nickel is worth 5 cents.', remediation: 'A dime is 10 cents, while a nickel is 5 cents.' },
      C: { error: 'A penny is worth 1 cent.', remediation: 'A dime is worth 10 cents.' },
      D: { error: 'A quarter is worth 25 cents.', remediation: '10 cents = 1 dime.' }
    }
  },

  // Medium (9)
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Measuring Length', subtopic_id: 225,
    question_text: 'A teacher measures a desk and finds it is 36 inches long. Then she measures it in feet. Which statement is TRUE?',
    option_a: 'The desk is 3 feet long because there are 12 inches in each foot', option_b: 'The desk will be more than 36 feet long', option_c: 'The desk is 4 feet long', option_d: 'The desk cannot be measured in feet',
    correct_answer: 'A',
    explanation: 'Divide 36 inches by 12 inches per foot: 36 ÷ 12 = 3 feet.',
    distractor_diagnostics: {
      B: { error: 'Feet are larger units than inches, so the number of feet must be smaller.', remediation: 'When converting to a larger unit (feet), the number gets smaller: 36 in = 3 ft.' },
      C: { error: '4 feet = 48 inches.', remediation: '36 / 12 = 3 feet.' },
      D: { error: 'Desks can be measured in both feet and inches.', remediation: '36 inches = 3 feet.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Time', subtopic_id: 229,
    question_text: 'A clock shows the hour hand between 6 and 7, and the minute hand pointing to 9. What time is it?',
    option_a: '6:45', option_b: '7:45', option_c: '6:09', option_d: '9:30',
    correct_answer: 'A',
    explanation: 'The hour hand has passed 6 but has not reached 7, so it is the 6 o\'clock hour. The minute hand at 9 means 9 × 5 = 45 minutes. The time is 6:45.',
    distractor_diagnostics: {
      B: { error: 'Student read the hour as 7 because the hand is close to 7.', remediation: 'The hour hand does not reach 7 until the minute hand reaches 12. It is still 6:45.' },
      C: { error: 'Student read the face number 9 as 9 minutes.', remediation: 'Minute hand at 9 represents 45 minutes: 6:45.' },
      D: { error: 'Student swapped the positions of the hands.', remediation: 'Hour hand near 7, minute hand at 9 = 6:45.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Money', subtopic_id: 230,
    question_text: 'Maya has 2 quarters, 3 dimes, and 4 pennies. She wants to buy a notebook that costs 85 cents. Does she have enough money?',
    option_a: 'under-budget by 1 cent (she has 84 cents)', option_b: 'Yes, she has 94 cents', option_c: 'Yes, she has exactly 85 cents', option_d: 'No, she only has 54 cents',
    correct_answer: 'A',
    explanation: '2 quarters = 50¢. 3 dimes = 30¢. 4 pennies = 4¢. Total = 50 + 30 + 4 = 84¢. Since 84¢ < 85¢, she is 1 cent short.',
    distractor_diagnostics: {
      B: { error: 'Student counted dimes as 40¢ or miscalculated.', remediation: '50 + 30 + 4 = 84¢, which is 1 cent less than 85¢.' },
      C: { error: 'Student calculated 85¢.', remediation: 'Total is 84¢, not 85¢.' },
      D: { error: 'Student omitted the quarters.', remediation: 'Total = 84¢.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Length Word Problems', subtopic_id: 228,
    question_text: 'A piece of yarn is 48 inches long. Carlos cuts off 19 inches to tie a package. How many inches of yarn are left?',
    option_a: '29 inches', option_b: '39 inches', option_c: '67 inches', option_d: '21 inches',
    correct_answer: 'A',
    explanation: 'Subtract: 48 - 19 = 29 inches.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted digits incorrectly (9 - 8 = 1, 4 - 1 = 3).', remediation: 'Regroup: 18 - 9 = 9, 3 - 1 = 2 -> 29 inches.' },
      C: { error: 'Student added 48 + 19.', remediation: '"Cuts off" means subtract: 48 - 19 = 29 inches.' },
      D: { error: 'Student made an arithmetic error.', remediation: '48 - 19 = 29.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Comparing Lengths', subtopic_id: 227,
    question_text: 'An eraser is 5 cm long. A pencil is 18 cm long. If you place 3 erasers end-to-end, how does their total length compare to the pencil?',
    option_a: 'The 3 erasers are 3 cm shorter than the pencil (15 cm vs 18 cm)', option_b: 'The 3 erasers are longer than the pencil', option_c: 'The 3 erasers are the exact same length as the pencil', option_d: 'The 3 erasers are 15 cm longer than the pencil',
    correct_answer: 'A',
    explanation: '3 erasers = 3 × 5 = 15 cm. Comparing to 18 cm: 18 - 15 = 3 cm shorter.',
    distractor_diagnostics: {
      B: { error: '15 cm is less than 18 cm.', remediation: '3 erasers total 15 cm, which is shorter than 18 cm.' },
      C: { error: '15 cm is not equal to 18 cm.', remediation: '18 - 15 = 3 cm difference.' },
      D: { error: 'Student misread "shorter" as "longer".', remediation: '15 cm is shorter than 18 cm.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Estimating Length', subtopic_id: 226,
    question_text: 'Which measurement unit would require the SMALLEST number to describe the height of a classroom door?',
    option_a: 'Yards', option_b: 'Feet', option_c: 'Inches', option_d: 'Centimeters',
    correct_answer: 'A',
    explanation: 'Yards are the largest unit among the options. Larger units result in a smaller numerical measurement count.',
    distractor_diagnostics: {
      B: { error: 'Feet are smaller than yards, so the number of feet will be larger (e.g. 7 ft vs ~2.3 yd).', remediation: 'The largest unit gives the smallest count: yards.' },
      C: { error: 'Inches will give a large count (~84 inches).', remediation: 'The larger the unit, the smaller the number needed.' },
      D: { error: 'Centimeters will give the largest numerical count (~210 cm).', remediation: 'Yards give the smallest numerical count.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Length Word Problems', subtopic_id: 228,
    question_text: 'On a number line diagram, point A is at 15 and point B is at 42. What is the distance between point A and point B?',
    option_a: '27', option_b: '57', option_c: '37', option_d: '23',
    correct_answer: 'A',
    explanation: 'Distance is the difference: 42 - 15 = 27 units.',
    distractor_diagnostics: {
      B: { error: 'Student added 42 + 15 = 57.', remediation: 'Distance between two points is found by subtraction: 42 - 15 = 27.' },
      C: { error: 'Student made an error in regrouping.', remediation: '42 - 15 = 27.' },
      D: { error: 'Student miscalculated.', remediation: '42 - 15 = 27.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Money', subtopic_id: 230,
    question_text: 'Liam pays for a toy costing $1.35 with a $2.00 bill. How much change should Liam receive?',
    option_a: '65 cents', option_b: '75 cents', option_c: '55 cents', option_d: '35 cents',
    correct_answer: 'A',
    explanation: '$2.00 - $1.35 = 200 cents - 135 cents = 65 cents.',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated 100 - 35 = 75 instead of 65.', remediation: '200 - 135 = 65 cents.' },
      C: { error: 'Student subtracted 10 cents too much.', remediation: '135 + 65 = 200 cents ($2.00).' },
      D: { error: 'Student repeated the 35 cents.', remediation: 'Subtract from $2.00: $2.00 - $1.35 = 65¢.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Time', subtopic_id: 229,
    question_text: 'Soccer practice starts at 3:15 p.m. and ends at 3:55 p.m. How many minutes long was soccer practice?',
    option_a: '40 minutes', option_b: '35 minutes', option_c: '45 minutes', option_d: '50 minutes',
    correct_answer: 'A',
    explanation: 'Subtract the minutes: 55 - 15 = 40 minutes.',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated 55 - 15.', remediation: '55 - 15 = 40 minutes.' },
      C: { error: 'Student added 5 minutes.', remediation: '55 - 15 = 40 minutes.' },
      D: { error: 'Student miscounted by 10.', remediation: '55 - 15 = 40 minutes.' }
    }
  },

  // High (8)
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Length Word Problems', subtopic_id: 228,
    question_text: 'Emma has three ribbons. Ribbon 1 is 24 cm. Ribbon 2 is 17 cm longer than Ribbon 1. Ribbon 3 is 15 cm shorter than Ribbon 2. What is the length of Ribbon 3?',
    option_a: '26 cm', option_b: '41 cm', option_c: '22 cm', option_d: '31 cm',
    correct_answer: 'A',
    explanation: 'Ribbon 2 = 24 + 17 = 41 cm. Ribbon 3 = 41 - 15 = 26 cm.',
    distractor_diagnostics: {
      B: { error: '41 cm is the length of Ribbon 2, not Ribbon 3.', remediation: 'Subtract 15 cm from Ribbon 2 to find Ribbon 3: 41 - 15 = 26 cm.' },
      C: { error: 'Student miscalculated 41 - 15.', remediation: '41 - 15 = 26 cm.' },
      D: { error: 'Student added 15 instead of subtracting.', remediation: '41 - 15 = 26 cm.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Money', subtopic_id: 230,
    question_text: 'Jack has 3 quarters, 4 dimes, and 5 nickels. He wants to buy two comic books that cost $0.65 each. Does he have enough money?',
    option_a: 'Yes, he has $1.40 and the books cost $1.30 (he has 10 cents left over)', option_b: 'No, he only has $1.15', option_c: 'No, the books cost $1.45', option_d: 'Yes, he has exactly $1.30',
    correct_answer: 'A',
    explanation: 'Jack\'s money: 3×25¢ = 75¢, 4×10¢ = 40¢, 5×5¢ = 25¢. Total = 75 + 40 + 25 = 140¢ = $1.40. Two books cost: 65¢ × 2 = $1.30. He has $1.40 - $1.30 = $0.10 left over.',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated Jack\'s coins.', remediation: '75¢ + 40¢ + 25¢ = $1.40.' },
      C: { error: '65¢ + 65¢ = $1.30, not $1.45.', remediation: 'Two books cost $1.30.' },
      D: { error: 'Jack has $1.40, which is more than $1.30.', remediation: 'He has 10 cents left over.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Measuring Length', subtopic_id: 225,
    question_text: 'A broken ruler starts at 3 inches and ends at 12 inches. A student places a toy car from the 4-inch mark to the 11-inch mark on this ruler. How long is the toy car?',
    option_a: '7 inches', option_b: '11 inches', option_c: '8 inches', option_d: '4 inches',
    correct_answer: 'A',
    explanation: 'Subtract starting mark from ending mark: 11 - 4 = 7 inches.',
    distractor_diagnostics: {
      B: { error: 'Student read the end mark directly (11 inches).', remediation: 'When the object does not start at 0, subtract: 11 - 4 = 7 inches.' },
      C: { error: 'Student counted marks instead of intervals.', remediation: 'Distance = 11 - 4 = 7 inches.' },
      D: { error: '4 inches is the starting point.', remediation: 'Length is 11 - 4 = 7 inches.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Time', subtopic_id: 229,
    question_text: 'It is 8:45 p.m. In 20 minutes, what time will the clock show?',
    option_a: '9:05 p.m.', option_b: '8:65 p.m.', option_c: '9:15 p.m.', option_d: '8:05 p.m.',
    correct_answer: 'A',
    explanation: '8:45 + 15 minutes = 9:00. Adding the remaining 5 minutes gives 9:05 p.m.',
    distractor_diagnostics: {
      B: { error: 'Clocks reset to 0 after 60 minutes; there is no :65.', remediation: '60 minutes makes a new hour: 45 + 20 = 65 min = 1 hr and 5 min -> 9:05 p.m.' },
      C: { error: 'Student added 30 minutes instead of 20 minutes.', remediation: '8:45 + 20 min = 9:05 p.m.' },
      D: { error: 'The hour must advance to 9.', remediation: 'After 8:59 comes 9:00, so it becomes 9:05 p.m.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Length Word Problems', subtopic_id: 228,
    question_text: 'A rectangular garden perimeter is 30 meters. Three of the sides measure 8 meters, 7 meters, and 8 meters. What is the length of the fourth side?',
    option_a: '7 meters', option_b: '15 meters', option_c: '9 meters', option_d: '23 meters',
    correct_answer: 'A',
    explanation: 'Sum of known sides = 8 + 7 + 8 = 23 meters. Fourth side = 30 - 23 = 7 meters.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted 30 - 15.', remediation: 'Add the 3 sides (23 m) and subtract from 30 m: 30 - 23 = 7 meters.' },
      C: { error: 'Student made an arithmetic error.', remediation: '30 - 23 = 7 meters.' },
      D: { error: '23 meters is the sum of the three known sides, not the missing side.', remediation: 'Subtract 23 from total 30: 7 meters.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Money', subtopic_id: 230,
    question_text: 'Which combination of coins has the GREATEST total value?',
    option_a: '3 quarters and 1 dime (85 cents)', option_b: '7 dimes and 2 nickels (80 cents)', option_c: '15 nickels (75 cents)', option_d: '2 quarters and 6 nickels (80 cents)',
    correct_answer: 'A',
    explanation: 'A: 3×25¢ + 10¢ = 85¢. B: 7×10¢ + 2×5¢ = 80¢. C: 15×5¢ = 75¢. D: 2×25¢ + 6×5¢ = 80¢. Greatest is 85¢.',
    distractor_diagnostics: {
      B: { error: '70 + 10 = 80¢, which is less than 85¢.', remediation: 'Option A totals 85¢, which is the greatest.' },
      C: { error: '15 × 5 = 75¢.', remediation: 'Option A has 85¢.' },
      D: { error: '50 + 30 = 80¢.', remediation: 'Option A has 85¢.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Measuring Length', subtopic_id: 225,
    question_text: 'A ribbon is 1 yard long. Sophia cuts off 14 inches. How many inches of ribbon are left?',
    option_a: '22 inches', option_b: '24 inches', option_c: '18 inches', option_d: '86 inches',
    correct_answer: 'A',
    explanation: '1 yard = 36 inches. Subtract 14 inches: 36 - 14 = 22 inches left.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted from 38 or made an arithmetic error.', remediation: '1 yard = 36 inches. 36 - 14 = 22 inches.' },
      C: { error: 'Student subtracted from 32 inches.', remediation: '36 - 14 = 22 inches.' },
      D: { error: 'Student thought 1 yard = 100 inches.', remediation: '1 yard = 36 inches, not 100.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Time', subtopic_id: 229,
    question_text: 'A bus journey starts at 10:40 a.m. and arrives at 11:25 a.m. How long was the bus journey in minutes?',
    option_a: '45 minutes', option_b: '85 minutes', option_c: '40 minutes', option_d: '35 minutes',
    correct_answer: 'A',
    explanation: 'From 10:40 to 11:00 is 20 minutes. From 11:00 to 11:25 is 25 minutes. Total = 20 + 25 = 45 minutes.',
    distractor_diagnostics: {
      B: { error: 'Student subtracted numbers without converting across the hour.', remediation: 'Count to the next hour: 20 min to 11:00, then 25 min to 11:25 = 45 minutes.' },
      C: { error: 'Student miscounted.', remediation: '20 + 25 = 45 minutes.' },
      D: { error: 'Student subtracted 40 - 25 = 15, then... miscalculated.', remediation: '10:40 to 11:25 is 45 minutes.' }
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
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 1 & Grade 2 Measurement...`);

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

  console.log(`Grade 1 & 2 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
