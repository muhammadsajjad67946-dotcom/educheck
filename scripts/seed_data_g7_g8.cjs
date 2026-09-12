const mysql = require('mysql2/promise');
require('dotenv').config();

const g7Questions = [
  // Low (8)
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Probability', subtopic_id: 340,
    question_text: 'A fair six-sided number cube is rolled once. What is the theoretical probability of rolling a 4?',
    option_a: '1/6', option_b: '1/4', option_c: '4/6 (or 2/3)', option_d: '1/2',
    correct_answer: 'A',
    explanation: 'There is only 1 four on a six-sided die, and 6 possible outcomes. Probability = 1/6.',
    distractor_diagnostics: {
      B: { error: 'Student used the number 4 as the denominator.', remediation: 'The denominator is the total number of sides (6): 1/6.' },
      C: { error: 'Student put the number 4 in the numerator.', remediation: 'There is only ONE side that has a 4 on it, so numerator is 1: 1/6.' },
      D: { error: 'Student gave the probability of rolling an even number.', remediation: 'The question asks for the specific number 4: 1/6.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Probability Models', subtopic_id: 341,
    question_text: 'Which probability value represents an event that is IMPOSSIBLE to occur?',
    option_a: '0', option_b: '0.5', option_c: '1', option_d: '-1',
    correct_answer: 'A',
    explanation: 'A probability of 0 indicates an impossible event that can never happen.',
    distractor_diagnostics: {
      B: { error: '0.5 represents an equally likely event (50% chance).', remediation: '0 means impossible, 0.5 means equally likely, and 1 means certain.' },
      C: { error: '1 represents a certain event that is guaranteed to happen.', remediation: '0 represents an impossible event.' },
      D: { error: 'Probabilities cannot be negative.', remediation: 'Probabilities always range from 0 to 1 inclusive.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Random Sampling', subtopic_id: 337,
    question_text: 'A school principal wants to know the favorite lunch of the entire school. Which group is a REPRESENTATIVE random sample?',
    option_a: '50 students selected randomly from an alphabetical list of all students in the school', option_b: 'The 10 students sitting at the first cafeteria table', option_c: 'Members of the school cooking club', option_d: 'The principal\'s own children',
    correct_answer: 'A',
    explanation: 'A representative random sample gives every student in the population an equal chance of being selected, avoiding convenience or group bias.',
    distractor_diagnostics: {
      B: { error: 'This is a convenience sample of students who sit together and may share similar food preferences.', remediation: 'Randomly selecting from the complete school roster avoids clustering bias.' },
      C: { error: 'Cooking club members have specialized food interests that do not represent all students.', remediation: 'A random sample across the entire student population is needed.' },
      D: { error: 'A personal convenience sample of family members is heavily biased.', remediation: 'Use a random sample of the full student body.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Sample Space', subtopic_id: 343,
    question_text: 'A coin is flipped and a spinner with 3 equal colors (Red, Blue, Green) is spun. How many total outcomes are in the sample space?',
    option_a: '6 outcomes', option_b: '5 outcomes', option_c: '3 outcomes', option_d: '8 outcomes',
    correct_answer: 'A',
    explanation: 'The coin has 2 outcomes (Heads, Tails) and the spinner has 3 outcomes. Total outcomes = 2 × 3 = 6 outcomes.',
    distractor_diagnostics: {
      B: { error: 'Student added 2 + 3 = 5 instead of multiplying.', remediation: 'By the Fundamental Counting Principle, multiply the number of outcomes: 2 × 3 = 6.' },
      C: { error: 'Student only counted the spinner colors.', remediation: 'Combine coin (2) and spinner (3): 2 × 3 = 6.' },
      D: { error: 'Student calculated 2³ = 8.', remediation: 'Multiply outcomes: 2 × 3 = 6.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Experimental Probability', subtopic_id: 342,
    question_text: 'A bag has colored marbles. In 50 random draws (with replacement), a green marble was drawn 15 times. What is the experimental probability of drawing a green marble?',
    option_a: '15/50 (or 3/10 = 0.30)', option_b: '35/50', option_c: '15/35', option_d: '50/15',
    correct_answer: 'A',
    explanation: 'Experimental probability = (Number of times event occurred) ÷ (Total number of trials) = 15 ÷ 50 = 3/10.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the probability of NOT drawing green (35/50).', remediation: 'Experimental probability of green is the green count divided by total: 15/50.' },
      C: { error: 'Student divided by the non-green count instead of total trials.', remediation: 'The denominator must be the total trials (50): 15/50.' },
      D: { error: 'Student inverted the fraction (50/15 > 1).', remediation: 'Probability is between 0 and 1: 15/50.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Samples & Populations', subtopic_id: 338,
    question_text: 'In a random sample of 100 city residents, 20 people ride the bus to work. In a city of 10,000 residents, about how many people would you expect to ride the bus?',
    option_a: '2,000 people', option_b: '200 people', option_c: '20 people', option_d: '5,000 people',
    correct_answer: 'A',
    explanation: 'Sample proportion = 20/100 = 20% (0.20). Estimated population = 0.20 × 10,000 = 2,000 people.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 20 by 10 instead of 100 (or misplaced decimal).', remediation: 'Set up proportion: 20/100 = x/10,000 => x = 20 × 100 = 2,000.' },
      C: { error: 'Student stated the sample count directly without scaling to the population.', remediation: 'Multiply sample rate (20%) by total population (10,000) = 2,000.' },
      D: { error: 'Student guessed half the population.', remediation: '20% of 10,000 is 2,000.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Probability', subtopic_id: 340,
    question_text: 'A spinner has 8 equal sections numbered 1 through 8. What is the probability of spinning an ODD number?',
    option_a: '4/8 (or 1/2 = 50%)', option_b: '1/8', option_c: '3/8', option_d: '5/8',
    correct_answer: 'A',
    explanation: 'The odd numbers are {1, 3, 5, 7} (4 numbers out of 8). Probability = 4/8 = 1/2.',
    distractor_diagnostics: {
      B: { error: 'Student found the probability of spinning one specific odd number.', remediation: 'There are 4 odd numbers in total: 4/8 = 1/2.' },
      C: { error: 'Student only counted 3 odd numbers.', remediation: 'Count: 1, 3, 5, 7 = 4 odd numbers; 4/8 = 1/2.' },
      D: { error: 'Student counted 5 odd numbers.', remediation: 'Half the numbers 1 to 8 are odd (4 of 8 = 1/2).' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Comparing Distributions', subtopic_id: 339,
    question_text: 'Two box plots show test scores: Class 1 has a median of 85 and Class 2 has a median of 70. On average, which class scored higher?',
    option_a: 'Class 1', option_b: 'Class 2', option_c: 'Both scored the same', option_d: 'Cannot be determined',
    correct_answer: 'A',
    explanation: 'The median represents the center of the distribution; Class 1 has a higher median (85 vs 70).',
    distractor_diagnostics: {
      B: { error: 'Class 2 has a lower median (70).', remediation: 'Class 1 has the higher center: 85 > 70.' },
      C: { error: 'The medians are 85 and 70, which are distinctly different.', remediation: '85 is higher than 70.' },
      D: { error: 'Box plot medians provide clear comparison of centers.', remediation: 'Class 1 scored higher on average.' }
    }
  },

  // Medium (9)
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Compound Probability', subtopic_id: 344,
    question_text: 'You flip a fair coin twice. What is the probability of getting Heads on BOTH flips?',
    option_a: '1/4', option_b: '1/2', option_c: '2/4 (or 1/2)', option_d: '3/4',
    correct_answer: 'A',
    explanation: 'The events are independent: P(H and H) = P(H) × P(H) = 1/2 × 1/2 = 1/4. (Outcomes: HH, HT, TH, TT).',
    distractor_diagnostics: {
      B: { error: 'Student gave the probability of one flip (1/2).', remediation: 'For two independent flips, multiply the probabilities: 1/2 × 1/2 = 1/4.' },
      C: { error: 'Student added 1/2 + 1/2 or counted 2 heads out of 4 coin sides.', remediation: 'Multiply probabilities for compound independent events: 1/2 × 1/2 = 1/4.' },
      D: { error: 'Student calculated the probability of getting at least one Head.', remediation: 'Getting Heads on both flips is only outcome HH (1 out of 4) = 1/4.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Experimental Probability', subtopic_id: 342,
    question_text: 'A coin is flipped 200 times and lands on Heads 112 times. What is the experimental probability of landing on Tails?',
    option_a: '88/200 (or 0.44 = 44%)', option_b: '112/200 (or 0.56 = 56%)', option_c: '100/200 (or 0.50 = 50%)', option_d: '88/112',
    correct_answer: 'A',
    explanation: 'Number of Tails = 200 - 112 = 88. Experimental probability = 88/200 = 0.44 = 44%.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the probability for Heads (112/200).', remediation: 'The question asks for Tails: 200 - 112 = 88 tails; 88/200 = 44%.' },
      C: { error: 'Student gave the theoretical probability (50%) instead of experimental.', remediation: 'Experimental probability is based on the actual trial data: 88/200 = 44%.' },
      D: { error: 'Student divided by Heads count instead of total trials.', remediation: 'The denominator must be the total number of flips: 88/200.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Random Sampling', subtopic_id: 337,
    question_text: 'A survey asks 40 people exiting an ice cream parlor what their favorite dessert is, and 36 say ice cream. Why is this sample biased?',
    option_a: 'The location (an ice cream parlor) means participants are already predisposed to liking ice cream', option_b: 'The sample size of 40 is too large', option_c: 'Ice cream is not a dessert', option_d: 'There was no coin flipped',
    correct_answer: 'A',
    explanation: 'Surveying people at an ice cream parlor creates location bias (convenience sampling), as patrons of an ice cream shop naturally favor ice cream.',
    distractor_diagnostics: {
      B: { error: '40 is a standard sample size, not too large.', remediation: 'Bias comes from non-random sampling location, where respondents are not representative of the general population.' },
      C: { error: 'Ice cream is a dessert.', remediation: 'The sampling method itself is biased because of the location.' },
      D: { error: 'Coin flips are not required for valid random sampling.', remediation: 'Surveying at an ice cream shop biases responses toward ice cream.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Probability Models', subtopic_id: 341,
    question_text: 'A jar contains 4 red, 6 blue, and 10 yellow marbles. A marble is picked at random. What is the probability that it is NOT red?',
    option_a: '16/20 (or 4/5 = 80%)', option_b: '4/20 (or 1/5 = 20%)', option_c: '6/20 (or 3/10)', option_d: '10/20 (or 1/2)',
    correct_answer: 'A',
    explanation: 'Total marbles = 4 + 6 + 10 = 20. Marbles that are NOT red = 6 + 10 = 16. P(not red) = 16/20 = 4/5 = 80%. (Or: 1 - 4/20 = 16/20).',
    distractor_diagnostics: {
      B: { error: 'Student calculated the probability that it IS red.', remediation: 'The question asks for NOT red: 1 - P(red) = 1 - 4/20 = 16/20.' },
      C: { error: 'Student only counted the blue marbles.', remediation: 'Include yellow as well: 6 + 10 = 16 non-red marbles; 16/20 = 4/5.' },
      D: { error: 'Student only counted the yellow marbles.', remediation: 'Both blue and yellow are not red: 6 + 10 = 16.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Comparing Distributions', subtopic_id: 339,
    question_text: 'The heights of two plant groups have the same MAD of 2 cm. Group A has a mean of 18 cm and Group B has a mean of 12 cm. What is the difference between the two means expressed as a multiple of the MAD?',
    option_a: '3 times the MAD', option_b: '6 times the MAD', option_c: '2 times the MAD', option_d: '1.5 times the MAD',
    correct_answer: 'A',
    explanation: 'Difference between means = 18 - 12 = 6 cm. Since MAD = 2 cm, the difference is 6 ÷ 2 = 3 times the MAD.',
    distractor_diagnostics: {
      B: { error: 'Student gave the difference in means (6 cm) without dividing by MAD.', remediation: 'Divide the difference (6) by the MAD (2): 6 ÷ 2 = 3 times the MAD.' },
      C: { error: 'Student used the MAD value itself.', remediation: '(18 - 12) / 2 = 6 / 2 = 3.' },
      D: { error: 'Student divided 3 by 2.', remediation: 'Difference in means is 6; 6 / 2 = 3.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Compound Probability', subtopic_id: 344,
    question_text: 'A spinner has 4 equal sections labeled 1, 2, 3, 4. What is the probability of spinning a number greater than 2 on the first spin, AND an even number on the second spin?',
    option_a: '1/4 (or 25%)', option_b: '1/2', option_c: '1/8', option_d: '3/4',
    correct_answer: 'A',
    explanation: 'Numbers > 2: {3, 4} (2/4 = 1/2). Even numbers: {2, 4} (2/4 = 1/2). P(Both) = 1/2 × 1/2 = 1/4.',
    distractor_diagnostics: {
      B: { error: 'Student added 1/2 + 1/2 or gave single spin probability.', remediation: 'Multiply probabilities for independent events: 1/2 × 1/2 = 1/4.' },
      C: { error: 'Student multiplied 1/2 × 1/4.', remediation: 'Even numbers are 2 and 4 (2 of 4 = 1/2): 1/2 × 1/2 = 1/4.' },
      D: { error: 'Student added probabilities incorrectly.', remediation: 'Compound probability multiplies: 1/2 × 1/2 = 1/4.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Samples & Populations', subtopic_id: 338,
    question_text: 'A quality inspector tests a random sample of 250 lightbulbs and finds 5 defective bulbs. If the factory produces 50,000 lightbulbs this week, how many bulbs are expected to be defective?',
    option_a: '1,000 bulbs', option_b: '500 bulbs', option_c: '250 bulbs', option_d: '2,000 bulbs',
    correct_answer: 'A',
    explanation: 'Defect rate = 5 / 250 = 1/50 = 0.02 (2%). Expected defective = 0.02 × 50,000 = 1,000 bulbs.',
    distractor_diagnostics: {
      B: { error: 'Student used 1% instead of 2% (500).', remediation: 'Defect rate is 5/250 = 2%: 0.02 × 50,000 = 1,000 bulbs.' },
      C: { error: 'Student confused the sample size (250) with the answer.', remediation: 'Scale the proportion: (5 / 250) × 50,000 = 1,000 bulbs.' },
      D: { error: 'Student doubled the estimate.', remediation: '5/250 × 50,000 = 1,000.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Sample Space', subtopic_id: 343,
    question_text: 'A restaurant offers a lunch special with 3 choices of sandwich (Turkey, Ham, Veggie), 2 choices of side (Soup, Salad), and 4 choices of drink. How many different lunch combinations are possible?',
    option_a: '24 combinations', option_b: '9 combinations', option_c: '12 combinations', option_d: '14 combinations',
    correct_answer: 'A',
    explanation: 'By the Fundamental Counting Principle: 3 × 2 × 4 = 24 combinations.',
    distractor_diagnostics: {
      B: { error: 'Student added 3 + 2 + 4 = 9 instead of multiplying.', remediation: 'Multiply the number of choices for each item: 3 × 2 × 4 = 24.' },
      C: { error: 'Student only multiplied 3 × 4 = 12.', remediation: 'Multiply all three categories: 3 × 2 × 4 = 24.' },
      D: { error: 'Student multiplied 2 × 7.', remediation: '3 × 2 = 6; 6 × 4 = 24 combinations.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Probability', subtopic_id: 340,
    question_text: 'If the probability of rain tomorrow is 35%, what is the probability that it will NOT rain tomorrow?',
    option_a: '65%', option_b: '35%', option_c: '50%', option_d: '75%',
    correct_answer: 'A',
    explanation: 'The sum of probabilities of complementary events is 100%: 100% - 35% = 65%.',
    distractor_diagnostics: {
      B: { error: 'Student gave the probability that it will rain.', remediation: 'Complement rule: P(not rain) = 100% - P(rain) = 100% - 35% = 65%.' },
      C: { error: 'Student assumed 50/50 chance.', remediation: 'Subtract from 100%: 100 - 35 = 65%.' },
      D: { error: 'Student miscalculated the subtraction.', remediation: '100 - 35 = 65%.' }
    }
  },

  // High (8)
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Compound Probability', subtopic_id: 344,
    question_text: 'A drawer contains 5 blue socks and 5 black socks. You pick one sock at random, do NOT replace it, and then pick a second sock. What is the probability that BOTH socks picked are blue?',
    option_a: '2/9 (or 20/90)', option_b: '1/4 (or 25/100)', option_c: '1/2', option_d: '5/18',
    correct_answer: 'A',
    explanation: 'First pick: P(Blue) = 5/10. Second pick without replacement: 4 blue socks left out of 9 total socks: P(Blue | Blue) = 4/9. P(Both) = (5/10) × (4/9) = (1/2) × (4/9) = 4/18 = 2/9.',
    distractor_diagnostics: {
      B: { error: 'Student assumed replacement: (5/10) × (5/10) = 1/4.', remediation: 'Without replacement, the total socks decrease from 10 to 9, and blue socks from 5 to 4: (5/10) × (4/9) = 2/9.' },
      C: { error: 'Student gave the probability of the first sock only (1/2).', remediation: 'Multiply the conditional probabilities: (5/10) × (4/9) = 2/9.' },
      D: { error: 'Student kept 5 in numerator: 5/18.', remediation: 'After drawing one blue sock, only 4 blue socks remain: 4/18 = 2/9.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Samples & Populations', subtopic_id: 338,
    question_text: 'A wildlife biologist catches, tags, and releases 60 fish in a lake. Later, she catches a random sample of 150 fish and finds that 12 of them have tags. What is the estimated total fish population in the lake?',
    option_a: '750 fish', option_b: '300 fish', option_c: '1,800 fish', option_d: '900 fish',
    correct_answer: 'A',
    explanation: 'Using mark-recapture proportion: (Tagged in sample) / (Total sample) = (Total tagged initially) / (Total population N). 12 / 150 = 60 / N. Cross-multiplying: 12N = 60 × 150 = 9,000 => N = 9,000 ÷ 12 = 750 fish.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 60 by 5 or miscalculated.', remediation: 'Set up proportion: 12/150 = 60/N => N = (60 × 150) / 12 = 750 fish.' },
      C: { error: 'Student divided 9,000 by 5.', remediation: '9,000 ÷ 12 = 750.' },
      D: { error: 'Student calculated 60 × 15 = 900.', remediation: 'Solve 12N = 9,000 => N = 750 fish.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Experimental Probability', subtopic_id: 342,
    question_text: 'A player rolls a standard die 600 times. Theoretical probability predicts rolling a 6 approximately 100 times. If the player actually rolls a 6 exactly 140 times, what can be concluded?',
    option_a: 'The experimental probability is 140/600 ≈ 23.3%, which is higher than the theoretical 16.7%, possibly suggesting the die is weighted/unfair if this persists over large trials', option_b: 'Theoretical probability is always wrong', option_c: 'The next 100 rolls will have zero 6s to even it out', option_d: 'The die must have eight sides',
    correct_answer: 'A',
    explanation: 'Experimental probability = 140/600 ≈ 23.3%, whereas theoretical is 1/6 ≈ 16.7%. A significant deviation over a large sample (600 trials) may indicate a biased die.',
    distractor_diagnostics: {
      B: { error: 'Theoretical probability represents true mathematical expectations for fair trials.', remediation: 'Theoretical probability is sound; deviations reflect random variation or an unfair die.' },
      C: { error: 'This is the Gambler\'s Fallacy; die rolls are independent and previous outcomes do not alter future probabilities.', remediation: 'Dice have no memory; each roll remains independent.' },
      D: { error: 'The prompt specifies a standard die.', remediation: 'The data suggests an experimental deviation from theoretical probability.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Comparing Distributions', subtopic_id: 339,
    question_text: 'Group X and Group Y both have 20 students. Group X has Mean = 75, MAD = 5. Group Y has Mean = 85, MAD = 5. How many MADs separate the two means, and is there significant overlap between the two distributions?',
    option_a: '2 MADs separate the means; there is moderate overlap between the distributions', option_b: '10 MADs separate the means; there is zero overlap', option_c: '1 MAD separates the means; distributions are completely identical', option_d: '0 MADs separate them',
    correct_answer: 'A',
    explanation: 'Difference in means = 85 - 75 = 10. Since MAD = 5, the separation is 10 ÷ 5 = 2 MADs. A separation of 2 MADs indicates moderate overlap between the score distributions.',
    distractor_diagnostics: {
      B: { error: 'Student used the difference in raw points (10) as the number of MADs.', remediation: 'Divide difference by MAD: 10 ÷ 5 = 2 MADs.' },
      C: { error: 'Student divided incorrectly.', remediation: '10 ÷ 5 = 2 MADs.' },
      D: { error: 'The means are not identical (75 vs 85).', remediation: 'Difference is 10 points = 2 MADs.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Compound Probability', subtopic_id: 344,
    question_text: 'Two fair six-sided dice are rolled simultaneously. What is the probability that the sum of the two numbers is equal to 7?',
    option_a: '6/36 (or 1/6)', option_b: '1/36', option_c: '7/36', option_d: '1/12',
    correct_answer: 'A',
    explanation: 'Total outcomes = 6 × 6 = 36. Pairs that sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 pairs. P(sum = 7) = 6/36 = 1/6.',
    distractor_diagnostics: {
      B: { error: 'Student assumed only one combination sums to 7.', remediation: 'There are 6 distinct ordered pairs that sum to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1); 6/36 = 1/6.' },
      C: { error: 'Student put the sum (7) in the numerator.', remediation: 'The numerator is the number of successful outcomes (6), not the target sum.' },
      D: { error: 'Student simplified 6/36 incorrectly.', remediation: '6/36 simplifies to 1/6.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Random Sampling', subtopic_id: 337,
    question_text: 'A pollster conducts an online poll by posting: "Click here to vote if you think taxes should be lowered." 92% of respondents vote "Yes". Why is this survey unreliable for estimating the town\'s opinion?',
    option_a: 'It relies on voluntary response bias; people with strong feelings on the issue are far more likely to participate', option_b: 'Online polls are illegal', option_c: '92% is too high a number mathematically', option_d: 'The question was answered by too many people',
    correct_answer: 'A',
    explanation: 'Voluntary response samples suffer from strong self-selection bias because respondents choose whether to participate, usually over-representing strong or extreme views.',
    distractor_diagnostics: {
      B: { error: 'Online polls are not illegal.', remediation: 'The statistical flaw is voluntary response bias.' },
      C: { error: 'Percentages can legitimately reach 92%.', remediation: 'The sampling method was not random, invalidating the conclusion.' },
      D: { error: 'High participation does not cause bias; self-selection causes bias.', remediation: 'Voluntary response creates unrepresentative samples.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Compound Probability', subtopic_id: 344,
    question_text: 'A bag contains 3 red marbles and 2 blue marbles. Two marbles are drawn one after the other WITHOUT replacement. What is the probability of drawing a red marble first AND a blue marble second?',
    option_a: '6/20 (or 3/10 = 30%)', option_b: '6/25 (or 24%)', option_c: '5/20 (or 1/4)', option_d: '1/2',
    correct_answer: 'A',
    explanation: 'P(Red 1st) = 3/5. Since there is no replacement, 4 marbles remain, with 2 blue. P(Blue 2nd | Red 1st) = 2/4. P(Red then Blue) = (3/5) × (2/4) = 6/20 = 3/10.',
    distractor_diagnostics: {
      B: { error: 'Student assumed replacement: (3/5) × (2/5) = 6/25.', remediation: 'Without replacement, the denominator on the second draw becomes 4: (3/5) × (2/4) = 6/20 = 3/10.' },
      C: { error: 'Student added numerators: (3 + 2)/20.', remediation: 'Multiply probabilities: (3/5) × (2/4) = 6/20 = 3/10.' },
      D: { error: 'Student guessed 1/2.', remediation: 'Multiply: (3/5) × (1/2) = 3/10.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Samples & Populations', subtopic_id: 338,
    question_text: 'Three different random samples of 50 students were asked if they favor a new school dress code. Sample 1: 18 favored (36%). Sample 2: 22 favored (44%). Sample 3: 20 favored (40%). What is the best point estimate for the percentage of the entire student body that favors the dress code?',
    option_a: '40% (average of the three samples)', option_b: '36%', option_c: '44%', option_d: '100%',
    correct_answer: 'A',
    explanation: 'Combining multiple random samples or averaging their proportions reduces sampling error: (36% + 44% + 40%) ÷ 3 = 120% ÷ 3 = 40%.',
    distractor_diagnostics: {
      B: { error: 'Student chose only the lowest sample estimate.', remediation: 'Averaging the three independent random samples provides a more reliable estimate: (36 + 44 + 40)/3 = 40%.' },
      C: { error: 'Student chose only the highest sample estimate.', remediation: 'The mean of the sample estimates (40%) gives the best overall point estimate.' },
      D: { error: '100% represents all students favoring, which contradicts the sample data.', remediation: 'Average the samples: 40%.' }
    }
  }
];

const g8Questions = [
  // Low (8)
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Scatter Plots', subtopic_id: 345,
    question_text: 'What type of data is displayed on a scatter plot?',
    option_a: 'Bivariate measurement data (two quantitative variables)', option_b: 'Single category data only', option_c: 'Words only', option_d: 'Daily weather names only',
    correct_answer: 'A',
    explanation: 'A scatter plot displays bivariate data (pairs of numerical values) to investigate relationships between two variables.',
    distractor_diagnostics: {
      B: { error: 'Single category data is displayed on bar graphs or dot plots.', remediation: 'Scatter plots show two variables simultaneously (bivariate data).' },
      C: { error: 'Scatter plots display quantitative numerical points (x, y).', remediation: 'Scatter plots are for two numerical variables.' },
      D: { error: 'Weather names are categorical.', remediation: 'Scatter plots display bivariate measurement data.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'positive Assocaition', subtopic_id: 346,
    question_text: 'In a scatter plot, as the x-values increase, the y-values also tend to increase. What type of association is this?',
    option_a: 'Positive association', option_b: 'Negative association', option_c: 'No association', option_d: 'Non-linear circular association',
    correct_answer: 'A',
    explanation: 'When both variables increase together, the relationship has a positive association.',
    distractor_diagnostics: {
      B: { error: 'Negative association occurs when y decreases as x increases.', remediation: 'When both x and y increase together, it is a positive association.' },
      C: { error: 'No association shows randomly scattered points with no upward or downward trend.', remediation: 'Upward trend = positive association.' },
      D: { error: 'A straight upward slant indicates a positive linear association.', remediation: 'Positive association.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Negative Association', subtopic_id: 347,
    question_text: 'A scatter plot compares vehicle age (in years) to its resale value (in dollars). As vehicle age increases, the resale value decreases. What type of association is this?',
    option_a: 'Negative association', option_b: 'Positive association', option_c: 'Zero association', option_d: 'Exponential increase',
    correct_answer: 'A',
    explanation: 'As one variable increases while the other decreases, the data exhibits a negative association.',
    distractor_diagnostics: {
      B: { error: 'Positive association means both increase together.', remediation: 'As age increases, value decreases: this is a negative association.' },
      C: { error: 'There is a clear downward relationship, not zero association.', remediation: 'Downward trend = negative association.' },
      D: { error: 'The value is decreasing, not increasing.', remediation: 'Negative association.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Cluster', subtopic_id: 349,
    question_text: 'What is a "cluster" in a scatter plot?',
    option_a: 'A distinct group of data points positioned closely together', option_b: 'A single point far away from all others', option_c: 'The line of best fit', option_d: 'The title of the graph',
    correct_answer: 'A',
    explanation: 'A cluster is an isolated, dense grouping of data points in a scatter plot.',
    distractor_diagnostics: {
      B: { error: 'A single point far away from others is an outlier, not a cluster.', remediation: 'A cluster is a group of multiple points packed closely together.' },
      C: { error: 'The line of best fit is a model line drawn through data.', remediation: 'A cluster is a tight group of data points.' },
      D: { error: 'Title is text at the top.', remediation: 'Cluster describes grouping of points.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Outliers', subtopic_id: 328,
    question_text: 'What is an "outlier" in a scatter plot?',
    option_a: 'A point that lies unusually far away from the overall pattern or trend of the data', option_b: 'The center of the cluster', option_c: 'The y-intercept', option_d: 'The origin (0, 0)',
    correct_answer: 'A',
    explanation: 'An outlier is an individual data point that departs significantly from the overall pattern exhibited by the rest of the data.',
    distractor_diagnostics: {
      B: { error: 'The center of a cluster is where points are densest.', remediation: 'An outlier is isolated far from the cluster or trend line.' },
      C: { error: 'The y-intercept is where the line crosses the vertical axis.', remediation: 'An outlier is an atypical isolated data point.' },
      D: { error: 'The origin is just (0, 0).', remediation: 'Outliers deviate from the main pattern.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Linear Models', subtopic_id: 350,
    question_text: 'What is the purpose of drawing a "line of best fit" (trend line) on a scatter plot?',
    option_a: 'To model the linear trend and make predictions for values within or near the data', option_b: 'To connect every single dot like a dot-to-dot puzzle', option_c: 'To measure the area under the points', option_d: 'To erase outliers',
    correct_answer: 'A',
    explanation: 'A line of best fit models the linear relationship between variables, allowing estimation and prediction.',
    distractor_diagnostics: {
      B: { error: 'A line of best fit is a straight line through the middle of points, not a connect-the-dots line.', remediation: 'The trend line passes near the points to capture the overall pattern.' },
      C: { error: 'Trend lines do not calculate area.', remediation: 'Trend lines are used to model relationships and make predictions.' },
      D: { error: 'Trend lines do not delete data.', remediation: 'The purpose is modeling the relationship: y = mx + b.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Two-Way Tables', subtopic_id: 352,
    question_text: 'What kind of data is typically organized and analyzed in a two-way frequency table?',
    option_a: 'Bivariate categorical data (two categorical variables)', option_b: 'Single numerical continuous measurements', option_c: 'Geometric shapes only', option_d: 'Ruler inches only',
    correct_answer: 'A',
    explanation: 'A two-way table organizes data involving two categorical variables (e.g., gender and favorite sport).',
    distractor_diagnostics: {
      B: { error: 'Continuous numerical data is plotted on histograms or scatter plots.', remediation: 'Two-way tables categorize bivariate categorical data into rows and columns.' },
      C: { error: 'Tables display categorical data frequencies, not physical shapes.', remediation: 'Two-way tables summarize counts for two categorical variables.' },
      D: { error: 'Ruler measurements are continuous numerical data.', remediation: 'Two-way tables are for categorical data.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Initial Value', subtopic_id: 351,
    question_text: 'In the linear equation y = 3x + 25 representing total cost y for x gym visits, what is the initial value (y-intercept)?',
    option_a: '25', option_b: '3', option_c: '28', option_d: '0',
    correct_answer: 'A',
    explanation: 'In y = mx + b, b is the initial value (y-intercept) when x = 0, which is 25.',
    distractor_diagnostics: {
      B: { error: '3 is the slope (rate of change per gym visit).', remediation: 'The constant term 25 is the initial value (membership fee) when x = 0.' },
      C: { error: 'Student added 3 + 25 = 28.', remediation: 'In y = mx + b, b = 25 is the initial value.' },
      D: { error: 'When x = 0, y = 25, not 0.', remediation: 'The initial value is 25.' }
    }
  },

  // Medium (9)
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Linear Models', subtopic_id: 350,
    question_text: 'A scatter plot has a line of best fit with equation y = 2x + 10, where x is study time (hours) and y is test score. What test score does the model predict for a student who studies for 6 hours?',
    option_a: '22', option_b: '16', option_c: '32', option_d: '12',
    correct_answer: 'A',
    explanation: 'Substitute x = 6 into the linear model: y = 2(6) + 10 = 12 + 10 = 22.',
    distractor_diagnostics: {
      B: { error: 'Student added 6 + 10 = 16 (forgot to multiply by 2).', remediation: 'Multiply x by slope first: 2 × 6 = 12, then add 10 = 22.' },
      C: { error: 'Student calculated 2 × (6 + 10) = 32.', remediation: 'Follow order of operations: 2(6) + 10 = 12 + 10 = 22.' },
      D: { error: 'Student calculated 2 × 6 = 12 and forgot to add 10.', remediation: 'Add the y-intercept: 12 + 10 = 22.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Initial Value', subtopic_id: 351,
    question_text: 'In the linear model y = -1.5x + 50 modeling water level in a draining pool (where x is hours elapsed), what does the slope -1.5 represent?',
    option_a: 'The water level drops by 1.5 units each hour', option_b: 'The starting water level was 1.5 units', option_c: 'The pool drains in 1.5 hours', option_d: 'The water level increases by 1.5 units each hour',
    correct_answer: 'A',
    explanation: 'Slope represents the rate of change. A slope of -1.5 means the water level decreases by 1.5 units per hour.',
    distractor_diagnostics: {
      B: { error: 'The starting water level is the y-intercept (50 units).', remediation: 'The slope (-1.5) represents the rate of change per hour.' },
      C: { error: 'Draining time is found when y = 0: 50 / 1.5 ≈ 33.3 hours.', remediation: 'Slope is the rate of water drop per hour (-1.5).' },
      D: { error: 'The negative sign indicates a decrease, not an increase.', remediation: 'Negative slope means decreasing by 1.5 units/hour.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Assoication', subtopic_id: 348,
    question_text: 'A scatter plot of points curves upward sharply like an exponential curve rather than forming a straight line. How should this association be described?',
    option_a: 'Non-linear association', option_b: 'Negative linear association', option_c: 'No association', option_d: 'Constant linear association',
    correct_answer: 'A',
    explanation: 'When data points show a clear pattern that bends or curves rather than following a straight line, it is a non-linear association.',
    distractor_diagnostics: {
      B: { error: 'The points curve upward, not downward in a straight line.', remediation: 'Curved patterns represent non-linear associations.' },
      C: { error: 'There is a strong clear pattern, so association exists (it is non-linear).', remediation: 'It is a non-linear association.' },
      D: { error: 'A straight line is linear; a curve is non-linear.', remediation: 'A curved trend is non-linear.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Two-Way Tables', subtopic_id: 352,
    question_text: 'A survey of 100 students records pet ownership and sports participation: 40 play sports and own a pet, 20 play sports and do not own a pet, 30 do not play sports and own a pet, and 10 do neither. How many total students own a pet?',
    option_a: '70 students', option_b: '60 students', option_c: '40 students', option_d: '50 students',
    correct_answer: 'A',
    explanation: 'Add the two pet-owning groups: 40 (sports + pet) + 30 (no sports + pet) = 70 students.',
    distractor_diagnostics: {
      B: { error: 'Student added those who play sports (40 + 20 = 60).', remediation: 'Add all students in the "own a pet" row/column: 40 + 30 = 70 students.' },
      C: { error: 'Student only counted those who play sports and own a pet.', remediation: 'Include pet owners who do not play sports: 40 + 30 = 70.' },
      D: { error: 'Student guessed half.', remediation: '40 + 30 = 70 pet owners.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Scatter Plots', subtopic_id: 345,
    question_text: 'Which pair of variables is most likely to show NO association on a scatter plot?',
    option_a: 'Shoe size and scores on a history exam', option_b: 'Hours spent studying and exam score', option_c: 'Car speed and travel time for a fixed distance', option_d: 'Outside temperature and heating bill cost',
    correct_answer: 'A',
    explanation: 'There is no plausible relationship between a person\'s shoe size and their score on a history test.',
    distractor_diagnostics: {
      B: { error: 'Studying and exam scores typically have a positive association.', remediation: 'Shoe size and history scores have no causal or statistical relationship (no association).' },
      C: { error: 'Speed and travel time have a strong negative association.', remediation: 'Shoe size and history test scores show no association.' },
      D: { error: 'Temperature and heating bills have a strong negative association.', remediation: 'Shoe size has no link to test score.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Two-Way Tables', subtopic_id: 352,
    question_text: 'In a two-way table, 60 students were surveyed: 36 prefer dogs and 24 prefer cats. Of the 36 dog lovers, 27 are in 8th grade. What fraction of the dog lovers are in 8th grade?',
    option_a: '27/36 (or 3/4 = 75%)', option_b: '27/60 (or 45%)', option_c: '36/60 (or 60%)', option_d: '9/36 (or 25%)',
    correct_answer: 'A',
    explanation: 'The question asks for the conditional relative frequency among dog lovers: 27 out of 36 = 27/36 = 3/4 = 75%.',
    distractor_diagnostics: {
      B: { error: 'Student used the grand total (60) instead of the dog lovers total (36).', remediation: 'The condition is "of the dog lovers" (total 36): 27/36 = 75%.' },
      C: { error: 'Student calculated the fraction of all students who love dogs.', remediation: 'The question specifies among dog lovers: 27/36 = 75%.' },
      D: { error: 'Student calculated the fraction NOT in 8th grade (9/36).', remediation: '27 of 36 are in 8th grade: 27/36 = 75%.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Linear Models', subtopic_id: 350,
    question_text: 'Which line of best fit would be considered a "good fit" for a scatter plot?',
    option_a: 'A line that follows the trend of the data with roughly equal numbers of points scattered closely above and below it', option_b: 'A line that connects the first and last point regardless of other points', option_c: 'A line that passes below all data points', option_d: 'A line that only touches one outlier',
    correct_answer: 'A',
    explanation: 'A good line of best fit captures the overall direction with points evenly balanced above and below and minimal vertical distances.',
    distractor_diagnostics: {
      B: { error: 'First and last points might be outliers and not represent the trend.', remediation: 'A good fit balances all points, not just the endpoints.' },
      C: { error: 'A line below all points underestimates the data.', remediation: 'The line should pass through the middle of the scatter.' },
      D: { error: 'Outliers should not dictate the trend line.', remediation: 'The line must reflect the overall cluster of data.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Interpreting Data', subtopic_id: 308,
    question_text: 'A scatter plot displays battery percentage remaining (y) versus hours of phone use (x). The trend line is y = -12x + 100. What does the y-intercept 100 represent?',
    option_a: 'The phone starts with 100% battery at 0 hours of use', option_b: 'The phone battery lasts 100 hours', option_c: 'The battery drains by 100% every hour', option_d: 'The phone takes 100 hours to charge',
    correct_answer: 'A',
    explanation: 'The y-intercept occurs when x = 0 (before use begins). At x = 0, y = 100%, which is the fully charged battery level.',
    distractor_diagnostics: {
      B: { error: 'Battery lasts until y = 0: 100 / 12 ≈ 8.3 hours, not 100 hours.', remediation: '100 is the starting battery percentage when time x = 0.' },
      C: { error: 'The battery drains by 12% per hour (the slope).', remediation: 'Slope is rate of drain (-12%/hr); 100% is initial charge.' },
      D: { error: 'Charging time is not modeled by this equation.', remediation: '100 is the initial battery level.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'positive Assocaition', subtopic_id: 346,
    question_text: 'A researcher plots height in inches (x) versus arm span in inches (y) for 50 people and observes a strong positive linear association. What does this mean?',
    option_a: 'Taller people generally tend to have longer arm spans', option_b: 'Taller people always have shorter arm spans', option_c: 'Height and arm span are completely unrelated', option_d: 'Every person has an arm span of 50 inches',
    correct_answer: 'A',
    explanation: 'A positive association means as height increases, arm span also increases.',
    distractor_diagnostics: {
      B: { error: 'This would describe a negative association.', remediation: 'Positive association means both variables increase together.' },
      C: { error: 'This would describe no association.', remediation: 'Strong positive association means taller height correlates with longer arm span.' },
      D: { error: '50 was the number of people sampled.', remediation: 'Taller height corresponds to longer arm span.' }
    }
  },

  // High (8)
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Linear Models', subtopic_id: 350,
    question_text: 'A line of best fit for candle height (cm) over time (hours) has equation y = -2.5x + 30. How many hours will it take for the candle to burn down completely (height = 0 cm)?',
    option_a: '12 hours', option_b: '30 hours', option_c: '10 hours', option_d: '75 hours',
    correct_answer: 'A',
    explanation: 'Set y = 0: 0 = -2.5x + 30 => 2.5x = 30 => x = 30 ÷ 2.5 = 12 hours.',
    distractor_diagnostics: {
      B: { error: 'Student gave the initial candle height (30 cm).', remediation: 'Set height y = 0 and solve for x: 2.5x = 30 => x = 12 hours.' },
      C: { error: 'Student divided 30 by 3.', remediation: '30 ÷ 2.5 = 12 hours.' },
      D: { error: 'Student multiplied 30 × 2.5 = 75.', remediation: 'Divide total height by burn rate: 30 / 2.5 = 12 hours.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Two-Way Tables', subtopic_id: 352,
    question_text: 'In a survey of 200 adults about movie preferences, 120 are under 40 years old and 80 are 40 or older. Of those under 40, 90 prefer Action movies. Of those 40 or older, 30 prefer Action movies. Which group has a higher conditional relative frequency of preferring Action movies?',
    option_a: 'Those under 40 (75% vs 37.5%)', option_b: 'Those 40 or older (60% vs 45%)', option_c: 'Both groups are equal', option_d: 'Cannot be determined without comedy data',
    correct_answer: 'A',
    explanation: 'Under 40: 90 ÷ 120 = 0.75 = 75%. 40 or older: 30 ÷ 80 = 0.375 = 37.5%. The under 40 group has a significantly higher preference (75% vs 37.5%).',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated the percentages.', remediation: '90/120 = 75% while 30/80 = 37.5%; those under 40 have a much higher rate.' },
      C: { error: '75% is double 37.5%; they are not equal.', remediation: 'Under 40 is 75%, older group is 37.5%.' },
      D: { error: 'The data provides complete information for Action movie preferences in both age groups.', remediation: 'Under 40: 75% vs 37.5%.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Linear Models', subtopic_id: 350,
    question_text: 'A trend line on a scatter plot passes through (2, 50) and (6, 110), where x is weeks of training and y is weight lifted (lbs). What is the equation of the line of best fit?',
    option_a: 'y = 15x + 20', option_b: 'y = 15x + 50', option_c: 'y = 10x + 30', option_d: 'y = 20x + 10',
    correct_answer: 'A',
    explanation: 'Slope m = (110 - 50) / (6 - 2) = 60 / 4 = 15. Using point (2, 50): 50 = 15(2) + b => 50 = 30 + b => b = 20. Equation: y = 15x + 20.',
    distractor_diagnostics: {
      B: { error: 'Student used the y-value of the first point (50) as the y-intercept without solving for b.', remediation: 'Solve for b: y = mx + b => 50 = 15(2) + b => b = 20; y = 15x + 20.' },
      C: { error: 'Student calculated slope as 60/6 = 10.', remediation: 'Change in x is 6 - 2 = 4: slope = 60/4 = 15.' },
      D: { error: 'Student guessed y = 20x + 10.', remediation: 'Slope is 15 and y-intercept is 20: y = 15x + 20.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Cluster', subtopic_id: 349,
    question_text: 'A scatter plot of engine size vs fuel efficiency shows two distinct clusters: one at small engine sizes with high MPG (around 35 MPG), and another at large engine sizes with low MPG (around 18 MPG). What does this clustering suggest?',
    option_a: 'Vehicles naturally group into distinct classes (e.g., compact economy cars vs large heavy trucks/SUVs)', option_b: 'The data has errors and should be deleted', option_c: 'Engine size has zero relationship with fuel efficiency', option_d: 'All vehicles have identical gas mileage',
    correct_answer: 'A',
    explanation: 'Clustering in real-world data often reflects distinct sub-populations or categories (such as compact cars vs large trucks).',
    distractor_diagnostics: {
      B: { error: 'Clusters are meaningful statistical patterns, not errors.', remediation: 'Clusters indicate sub-groups within the population.' },
      C: { error: 'There is a clear negative relationship across the clusters.', remediation: 'Clustering reveals distinct categories in the data.' },
      D: { error: 'The two clusters have very different MPG values (35 vs 18).', remediation: 'It suggests two distinct vehicle classes.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Outliers', subtopic_id: 328,
    question_text: 'A scatter plot shows hours studied vs exam score with a strong positive trend, but one student who studied for 10 hours received a score of 20%. How does this point affect the slope of the line of best fit?',
    option_a: 'It pulls the right end of the line downward, decreasing the slope', option_b: 'It pulls the line upward, increasing the slope', option_c: 'It has no effect on the line of best fit', option_d: 'It makes the slope exactly zero',
    correct_answer: 'A',
    explanation: 'An outlier with high x and unusually low y exerts leverage on the regression line, pulling that end down and reducing the slope.',
    distractor_diagnostics: {
      B: { error: 'Because the score (20%) is far below the trend, it pulls downward, not upward.', remediation: 'A low y-value at a high x-value pulls the trend line down, decreasing slope.' },
      C: { error: 'Linear regression minimizes squared errors and is sensitive to outliers.', remediation: 'Extreme points exert leverage on the line of best fit.' },
      D: { error: 'One outlier reduces the slope, but does not completely flatten a strong dataset.', remediation: 'It pulls the slope down.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Two-Way Tables', subtopic_id: 352,
    question_text: 'A two-way table shows whether 100 students play an instrument and play a sport: Instrument: 30 play sport, 20 do not. No Instrument: 30 play sport, 20 do not. Is there evidence of an association between playing an instrument and playing a sport?',
    option_a: 'No, because exactly 60% (30/50) of both instrument players and non-players play a sport, showing independence', option_b: 'Yes, because 30 is greater than 20', option_c: 'Yes, because 100 students were surveyed', option_d: 'Cannot be determined without a scatter plot',
    correct_answer: 'A',
    explanation: 'Instrument group: 30/50 = 60% play a sport. No-instrument group: 30/50 = 60% play a sport. Since the conditional relative frequencies are identical, there is no association (the variables are independent).',
    distractor_diagnostics: {
      B: { error: 'Comparing raw cell counts inside a row does not determine association across groups.', remediation: 'Compare conditional relative frequencies: both are 60%, indicating independence (no association).' },
      C: { error: 'Sample size does not imply an association.', remediation: 'When proportions are identical between groups, no association exists.' },
      D: { error: 'Two-way tables evaluate association for categorical data.', remediation: 'Equal conditional percentages indicate no association.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Linear Models', subtopic_id: 350,
    question_text: 'A linear model for plant growth is y = 0.8x + 4.2, where x is weeks and y is height in cm. If a plant measured 15.0 cm at week 12, what is the residual (actual value minus predicted value)?',
    option_a: '1.2 cm', option_b: '-1.2 cm', option_c: '13.8 cm', option_d: '0.8 cm',
    correct_answer: 'A',
    explanation: 'Predicted height = 0.8(12) + 4.2 = 9.6 + 4.2 = 13.8 cm. Residual = Actual - Predicted = 15.0 - 13.8 = 1.2 cm.',
    distractor_diagnostics: {
      B: { error: 'Student calculated Predicted - Actual (13.8 - 15.0 = -1.2).', remediation: 'Residual is defined as Actual minus Predicted: 15.0 - 13.8 = +1.2 cm.' },
      C: { error: 'Student gave the predicted value (13.8 cm) instead of the residual.', remediation: 'Subtract predicted from actual: 15.0 - 13.8 = 1.2 cm.' },
      D: { error: 'Student stated the slope (0.8).', remediation: 'Residual = 15.0 - 13.8 = 1.2 cm.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Assoication', subtopic_id: 348,
    question_text: 'A company finds that employee productivity increases as room temperature rises from 60°F to 72°F, but as temperature rises from 72°F to 90°F, productivity drops sharply. What type of association exists between temperature and productivity?',
    option_a: 'Non-linear association (inverted U-shaped curve)', option_b: 'Positive linear association', option_c: 'Negative linear association', option_d: 'No association',
    correct_answer: 'A',
    explanation: 'The relationship first rises and then falls, forming an inverted U-shape. This is a classic non-linear association that cannot be modeled by a single straight line.',
    distractor_diagnostics: {
      B: { error: 'It only increases up to 72°F; beyond that it decreases.', remediation: 'Because the direction changes, it is non-linear, not positive linear.' },
      C: { error: 'It does not consistently decrease across the whole range.', remediation: 'A relationship that rises then falls is non-linear.' },
      D: { error: 'There is a strong predictable relationship, so an association clearly exists.', remediation: 'It is a non-linear (quadratic/curvilinear) association.' }
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

  console.log('Starting insertion of 50 questions for Grade 7 & Grade 8 Data Analysis...');
  const allQuestions = [...g7Questions, ...g8Questions];
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

  console.log(`Grade 7 & 8 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await connection.end();
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
