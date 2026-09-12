// Grade 8 Math MCQ Distribution
export const grade8Topics = [
  {
    topic: 'Rational & Irrational Numbers',
    subtopics: [
      'Rational Numbers',
      'Irrational Numbers',
      'Decimal Expansions',
      'Rational Approximations of Irrational Numbers'
    ],
    count: 25,
    qStart: 8001
  },
  {
    topic: 'Integer Exponents & Radicals',
    subtopics: [
      'Integer Exponents',
      'Square Roots',
      'Cube Roots',
      'Radicals'
    ],
    count: 25,
    qStart: 8026
  },
  {
    topic: 'Scientific Notation',
    subtopics: [
      'Writing Numbers in Scientific Notation',
      'Converting Scientific Notation',
      'Comparing Scientific Notation',
      'Operations with Scientific Notation'
    ],
    count: 20,
    qStart: 8051
  },
  {
    topic: 'Proportional Relationships & Linear Equations',
    subtopics: [
      'Proportional Relationships',
      'Slope',
      'Linear Equations',
      'Slope-Intercept Form',
      'Graphs of Linear Equations'
    ],
    count: 25,
    qStart: 8071
  },
  {
    topic: 'Linear Equations',
    subtopics: [
      'Solving One-Variable Equations',
      'Equations with One Solution',
      'Equations with No Solution',
      'Equations with Infinitely Many Solutions',
      'Multi-Step Linear Equations'
    ],
    count: 25,
    qStart: 8096
  },
  {
    topic: 'Systems of Linear Equations',
    subtopics: [
      'Understanding Systems',
      'Solving Systems Algebraically',
      'Solving Systems by Graphing',
      'One Solution, No Solution & Infinite Solutions',
      'Real-World Problems with Systems'
    ],
    count: 25,
    qStart: 8121
  },
  {
    topic: 'Functions',
    subtopics: [
      'Understanding Functions',
      'Inputs & Outputs',
      'Function Tables',
      'Comparing Functions',
      'Linear & Nonlinear Functions',
      'Real-World Function Models'
    ],
    count: 30,
    qStart: 8146
  },
  {
    topic: 'Transformations',
    subtopics: [
      'Translations',
      'Reflections',
      'Rotations',
      'Dilations',
      'Coordinates After Transformations'
    ],
    count: 25,
    qStart: 8176
  },
  {
    topic: 'Congruence & Similarity',
    subtopics: [
      'Congruent Figures',
      'Similar Figures',
      'Scale Factors',
      'Similarity Transformations',
      'Angle Relationships'
    ],
    count: 25,
    qStart: 8201
  },
  {
    topic: 'Pythagorean Theorem',
    subtopics: [
      'Understanding the Pythagorean Theorem',
      'Finding Missing Side Lengths',
      'Pythagorean Theorem Converse',
      'Real-World Applications',
      'Distance on the Coordinate Plane'
    ],
    count: 25,
    qStart: 8226
  },
  {
    topic: 'Volume',
    subtopics: [
      'Volume of Cylinders',
      'Volume of Cones',
      'Volume of Spheres',
      'Real-World Volume Problems'
    ],
    count: 20,
    qStart: 8251
  },
  {
    topic: 'Statistics & Probability',
    subtopics: [
      'Scatter Plots',
      'Positive & Negative Association',
      'Linear & Nonlinear Association',
      'Clusters & Outliers',
      'Linear Models',
      'Slope & Intercept in Data',
      'Two-Way Tables & Relative Frequencies'
    ],
    count: 30,
    qStart: 8271
  }
]

// MCQ Sample Questions for each topic
export const mcqBanks = {
  'Rational & Irrational Numbers': {
    'Rational Numbers': [
      { q: 'Which number is rational?', opts: ['π', '√2', '3/4', 'e'], ans: 'c' },
      { q: 'Express 0.75 as a fraction', opts: ['1/2', '2/3', '3/4', '4/5'], ans: 'c' },
      { q: 'Is -2 a rational number?', opts: ['Yes', 'No', 'Maybe', 'Undefined'], ans: 'a' },
      { q: 'Which fraction equals 0.6̄ (0.6666...)?', opts: ['1/2', '2/3', '3/5', '5/8'], ans: 'b' },
      { q: 'Compare: 3/5 and 0.6', opts: ['3/5 > 0.6', '3/5 < 0.6', 'Equal', 'Cannot compare'], ans: 'c' },
      { q: 'Is 1/3 rational?', opts: ['Yes', 'No', 'Sometimes', 'Unknown'], ans: 'a' },
      { q: 'Express 0.125 as a fraction', opts: ['1/8', '1/7', '1/6', '1/5'], ans: 'a' }
    ],
    'Irrational Numbers': [
      { q: 'Which number is irrational?', opts: ['5', '√16', '√7', '3/4'], ans: 'c' },
      { q: 'Is π irrational?', opts: ['Yes', 'No', 'Sometimes', 'Undefined'], ans: 'a' },
      { q: 'Which is NOT irrational?', opts: ['√2', '√3', '√4', 'e'], ans: 'c' },
      { q: 'The decimal expansion of an irrational number', opts: ['Terminates', 'Repeats', 'Never terminates or repeats', 'Cannot determine'], ans: 'c' },
      { q: 'Between which integers is √50?', opts: ['6 and 7', '7 and 8', 'Before 6', 'After 8'], ans: 'b' },
      { q: 'Is e irrational?', opts: ['Yes', 'No', 'Sometimes', 'Unknown'], ans: 'a' }
    ],
    'Decimal Expansions': [
      { q: 'What is the decimal expansion of 1/3?', opts: ['0.33', '0.333...', '0.3̄', 'Non-terminating repeating'], ans: 'd' },
      { q: 'Does 5/8 have a terminating decimal?', opts: ['Yes', 'No', 'Maybe', 'Undefined'], ans: 'a' },
      { q: 'Decimal: 0.142857142857... represents', opts: ['1/6', '1/7', '2/7', '3/7'], ans: 'b' },
      { q: 'Which fraction has non-terminating decimal?', opts: ['1/2', '1/4', '1/3', '1/8'], ans: 'c' },
      { q: 'Expand 7/12 as decimal', opts: ['0.58̄3̄', '0.583̄', '0.5833...', 'All above'], ans: 'd' },
      { q: 'Express 2/5 as a decimal', opts: ['0.4', '0.45', '0.5', '0.6'], ans: 'a' }
    ],
    'Rational Approximations of Irrational Numbers': [
      { q: 'Approximate √10 to nearest integer', opts: ['3', '3.1', '3.2', '4'], ans: 'a' },
      { q: 'Rational approximation of π', opts: ['22/7', '3.14', '3.14159...', 'All above'], ans: 'd' },
      { q: 'Best rational approximation of √5', opts: ['2', '2.2', '2.24', '2.236'], ans: 'c' },
      { q: 'Which rational best approximates √2?', opts: ['1.4', '1.41', '1.414', 'All reasonable'], ans: 'c' },
      { q: 'Error between √3 and 1.732', opts: ['Less than 0.001', 'About 0.001', 'Greater than 0.01', 'Cannot calculate'], ans: 'a' },
      { q: 'Approximate √7 to nearest tenth', opts: ['2.6', '2.7', '2.8', '3'], ans: 'c' }
    ]
  },

  'Integer Exponents & Radicals': {
    'Integer Exponents': [
      { q: '2^4 =', opts: ['8', '16', '32', '4'], ans: 'b' },
      { q: '(-2)^3 =', opts: ['8', '-8', '6', '-6'], ans: 'b' },
      { q: 'Simplify: 3^2 × 3^3', opts: ['3^5', '3^6', '9^6', '27'], ans: 'a' },
      { q: '5^0 =', opts: ['0', '1', '5', 'Undefined'], ans: 'b' },
      { q: '2^(-2) =', opts: ['4', '-4', '1/4', '-1/4'], ans: 'c' },
      { q: '10^(-1) =', opts: ['10', '0.1', '-10', '-0.1'], ans: 'b' },
      { q: '4^2 =', opts: ['8', '16', '2', '32'], ans: 'b' }
    ],
    'Square Roots': [
      { q: '√64 =', opts: ['6', '8', '32', '4096'], ans: 'b' },
      { q: 'Simplify √50', opts: ['5√2', '2√5', '10√5', '5√10'], ans: 'a' },
      { q: '√(144/25) =', opts: ['12/5', '144/25', '6/5', '48/5'], ans: 'a' },
      { q: 'Which equals √100?', opts: ['-10', '10', 'Both ±10', 'Cannot determine'], ans: 'b' },
      { q: 'Estimate √95', opts: ['9', '9.5', '10', '11'], ans: 'b' },
      { q: 'Simplify √72', opts: ['6√2', '8√2', '6√3', '8√3'], ans: 'a' }
    ],
    'Cube Roots': [
      { q: '∛27 =', opts: ['3', '9', '81', '729'], ans: 'a' },
      { q: '∛(-8) =', opts: ['2', '-2', '±2', 'Undefined'], ans: 'b' },
      { q: 'Simplify ∛54', opts: ['3∛2', '∛54', '2∛27', '27∛2'], ans: 'a' },
      { q: '∛(64/125) =', opts: ['4/5', '8/25', '2/5', '16/25'], ans: 'a' },
      { q: '∛1000 =', opts: ['10', '100', '1000', '10000'], ans: 'a' },
      { q: '∛(-1) =', opts: ['1', '-1', '±1', 'Undefined'], ans: 'b' }
    ],
    'Radicals': [
      { q: 'Simplify √18 + √32', opts: ['5√2', '7√2', '√50', '6√2'], ans: 'b' },
      { q: 'Simplify 3√12 - √27', opts: ['2√3', '3√3', '√3', '6√3'], ans: 'b' },
      { q: '(√5)^2 =', opts: ['5', '√5', '25', '10'], ans: 'a' },
      { q: 'Rationalize: 1/√2', opts: ['√2/2', '1/2', '2√2', '√2'], ans: 'a' },
      { q: 'Simplify √(16x²)', opts: ['4x', '8x', '4|x|', '16|x|'], ans: 'c' },
      { q: 'Simplify √(x² + 4x + 4)', opts: ['x+2', '|x+2|', 'x+4', 'x-2'], ans: 'b' }
    ]
  },

  'Scientific Notation': {
    'Writing Numbers in Scientific Notation': [
      { q: 'Write 5,300 in scientific notation', opts: ['5.3 × 10²', '5.3 × 10³', '53 × 10²', '0.53 × 10⁴'], ans: 'b' },
      { q: 'Write 0.00042 in scientific notation', opts: ['4.2 × 10⁻⁴', '4.2 × 10⁻³', '42 × 10⁻⁵', '0.42 × 10⁻³'], ans: 'a' },
      { q: 'Express 1,000,000 in scientific notation', opts: ['1 × 10⁶', '10 × 10⁵', '100 × 10⁴', '1 × 10⁵'], ans: 'a' },
      { q: 'Write 0.0001 in scientific notation', opts: ['1 × 10⁻⁴', '1 × 10⁻³', '10 × 10⁻⁵', '1 × 10⁴'], ans: 'a' },
      { q: 'Scientific notation of 23,500', opts: ['2.35 × 10³', '2.35 × 10⁴', '235 × 10²', '0.235 × 10⁵'], ans: 'b' }
    ],
    'Converting Scientific Notation': [
      { q: 'Convert 3 × 10² to standard form', opts: ['30', '300', '3,000', '30,000'], ans: 'b' },
      { q: 'Expand: 5.6 × 10⁻³', opts: ['0.0056', '0.056', '560', '5,600'], ans: 'a' },
      { q: '7.25 × 10⁴ =', opts: ['72,500', '7,250', '725', '0.000725'], ans: 'a' },
      { q: 'Write 9.8 × 10⁻² in decimal form', opts: ['0.098', '0.98', '98', '980'], ans: 'a' },
      { q: '1.5 × 10⁻¹ =', opts: ['0.015', '0.15', '1.5', '15'], ans: 'b' }
    ],
    'Comparing Scientific Notation': [
      { q: 'Which is larger: 3 × 10³ or 5 × 10²?', opts: ['3 × 10³', '5 × 10²', 'Equal', 'Cannot determine'], ans: 'a' },
      { q: 'Order from least to greatest: 2×10², 5×10¹, 3×10³', opts: ['5×10¹, 2×10², 3×10³', '2×10², 5×10¹, 3×10³', '3×10³, 2×10², 5×10¹', 'Cannot order'], ans: 'a' },
      { q: 'Is 4.5 × 10⁻² < 4.5 × 10⁻¹?', opts: ['Yes', 'No', 'Equal', 'Unknown'], ans: 'a' },
      { q: 'Compare: 1 × 10⁻³ and 1 × 10⁻⁴', opts: ['First is larger', 'Second is larger', 'Equal', 'Indeterminate'], ans: 'a' },
      { q: 'Which is smallest?', opts: ['2 × 10⁻¹', '2 × 10⁻²', '2 × 10¹', '2 × 10⁰'], ans: 'b' }
    ],
    'Operations with Scientific Notation': [
      { q: '(2 × 10³) × (3 × 10²) =', opts: ['6 × 10⁵', '6 × 10⁶', '5 × 10⁵', '6 × 10⁴'], ans: 'a' },
      { q: '(8 × 10⁴) ÷ (2 × 10²) =', opts: ['4 × 10²', '4 × 10³', '16 × 10²', '4 × 10¹'], ans: 'b' },
      { q: '(1.5 × 10³) + (2.5 × 10³) =', opts: ['4 × 10³', '3 × 10³', '4 × 10⁶', '3.5 × 10³'], ans: 'a' },
      { q: 'Distance: 2.5 × 10⁷ ÷ Speed: 5 × 10³ = Time', opts: ['5 × 10³', '5 × 10⁴', '5 × 10²', '0.5 × 10⁴'], ans: 'b' },
      { q: '(4 × 10⁻³) × (5 × 10⁻²) =', opts: ['20 × 10⁻⁵', '2 × 10⁻⁴', '20 × 10⁻⁶', '2 × 10⁻⁵'], ans: 'b' }
    ]
  },

  'Proportional Relationships & Linear Equations': {
    'Proportional Relationships': [
      { q: 'If y = 2x, is this proportional?', opts: ['Yes', 'No', 'Sometimes', 'Unknown'], ans: 'a' },
      { q: 'Unit rate for 3 gallons costing $12', opts: ['$3/gal', '$4/gal', '$12/gal', '$36/gal'], ans: 'b' },
      { q: 'Car travels 60 km in 1 hour. Distance in 3 hours?', opts: ['20 km', '120 km', '180 km', '240 km'], ans: 'c' },
      { q: 'Is the relation proportional? (2,4), (3,6), (4,8)', opts: ['Yes', 'No', 'Maybe', 'Undefined'], ans: 'a' },
      { q: 'Constant of proportionality for y = 5x', opts: ['5', '1', '0', 'x'], ans: 'a' }
    ],
    'Slope': [
      { q: 'Slope between (0,0) and (2,4)', opts: ['1', '2', '0.5', '4'], ans: 'b' },
      { q: 'Rise = 3, Run = 5. Slope =', opts: ['5/3', '3/5', '2/3', '1.5'], ans: 'b' },
      { q: 'Horizontal line has slope', opts: ['0', '1', 'Undefined', 'Negative'], ans: 'a' },
      { q: 'Vertical line has slope', opts: ['0', '1', 'Undefined', 'Positive'], ans: 'c' },
      { q: 'Slope between (1,2) and (4,8)', opts: ['2', '3', '6', '1'], ans: 'a' }
    ],
    'Linear Equations': [
      { q: 'Solve: x + 5 = 12', opts: ['7', '17', '-7', '5'], ans: 'a' },
      { q: 'Solve: 2x = 10', opts: ['5', '12', '8', '20'], ans: 'a' },
      { q: 'Solve: x/2 = 6', opts: ['3', '8', '12', '4'], ans: 'c' },
      { q: 'Solve: 3x - 5 = 10', opts: ['5', '15/3', '5', '-5/3'], ans: 'a' },
      { q: 'Solve: 2(x - 3) = 8', opts: ['7', '11', '3.5', '5'], ans: 'a' }
    ],
    'Slope-Intercept Form': [
      { q: 'y = 2x + 3: slope and y-intercept?', opts: ['m=2, b=3', 'm=3, b=2', 'm=-2, b=3', 'm=2, b=-3'], ans: 'a' },
      { q: 'Write equation: slope 3, y-intercept -2', opts: ['y=3x-2', 'y=-3x+2', 'y=2x-3', 'y=3x+2'], ans: 'a' },
      { q: 'y-intercept of y = -x + 5', opts: ['5', '-1', '-5', '1'], ans: 'a' },
      { q: 'Slope of y = (1/2)x - 4', opts: ['1/2', '2', '-4', '4'], ans: 'a' },
      { q: 'Which has slope 2?', opts: ['y=x+2', 'y=2x+1', 'y=2+x', 'y=1/2·x'], ans: 'b' }
    ],
    'Graphs of Linear Equations': [
      { q: 'Graph y = x passes through which?', opts: ['(0,1)', '(1,1)', '(0,0)', '(1,0)'], ans: 'c' },
      { q: 'Line y = -2x + 1 has negative slope?', opts: ['Yes', 'No', 'Slope is 0', 'Undefined'], ans: 'a' },
      { q: 'Which point satisfies y = x + 2?', opts: ['(0,0)', '(1,3)', '(1,1)', '(2,3)'], ans: 'b' },
      { q: 'x-intercept of y = 2x - 6', opts: ['3', '-3', '6', '-6'], ans: 'a' },
      { q: 'Equation of line through (0,0) and (1,1)?', opts: ['y=x', 'y=x+1', 'y=1', 'x=1'], ans: 'a' }
    ]
  },

  'Linear Equations': {
    'Solving One-Variable Equations': [
      { q: 'Solve: x - 7 = 3', opts: ['10', '-4', '3/7', '21'], ans: 'a' },
      { q: 'Solve: 5x = 25', opts: ['5', '20', '30', '125'], ans: 'a' },
      { q: 'Solve: x/3 = 4', opts: ['12', '7', '1', '1/3'], ans: 'a' },
      { q: 'Solve: 2x + 1 = 9', opts: ['4', '5', '10', '8'], ans: 'a' },
      { q: 'Solve: 3x - 2 = 7', opts: ['3', '5/3', '9/3', '-3'], ans: 'a' }
    ],
    'Equations with One Solution': [
      { q: 'Does 2x + 3 = 5 have one solution?', opts: ['Yes', 'No', 'Infinite', 'None'], ans: 'a' },
      { q: 'Solve 4x - 6 = 2x + 2', opts: ['4', '2', '-2', '1'], ans: 'a' },
      { q: 'How many solutions: x + 1 = 5?', opts: ['None', 'One', 'Infinite', 'Two'], ans: 'b' },
      { q: 'Solve: 3(x - 1) = 6', opts: ['3', '1', '9', '2'], ans: 'a' },
      { q: 'Find x: 2x = 3x - 5', opts: ['5', '-5', '3', '-3'], ans: 'a' }
    ],
    'Equations with No Solution': [
      { q: 'Which equation has no solution?', opts: ['x = 5', 'x + 1 = x + 2', '2x = 4', 'x - 1 = 3'], ans: 'b' },
      { q: 'Does x + 3 = x + 3 have solutions?', opts: ['No', 'One', 'Infinite', 'Cannot solve'], ans: 'c' },
      { q: '2x + 1 = 2x has how many solutions?', opts: ['None', 'One', 'Infinite', 'Two'], ans: 'a' },
      { q: 'Simplify: 3x + 2 = 3x - 1', opts: ['No solution', 'x = 1', 'Infinite', 'x = 0'], ans: 'a' },
      { q: 'Which is impossible?', opts: ['x = 0', 'x + 5 = x', 'x - 1 = -1', 'x/2 = 0'], ans: 'b' }
    ],
    'Equations with Infinitely Many Solutions': [
      { q: 'Which has infinite solutions?', opts: ['x = 5', '2x = 2x', 'x + 1 = 2', 'x = x + 1'], ans: 'b' },
      { q: 'Simplify: 2x + 4 = 2(x + 2)', opts: ['No solution', 'x = 0', 'Infinite solutions', 'x = 4'], ans: 'c' },
      { q: 'Does 3x - 1 = 3x - 1 have infinite solutions?', opts: ['No', 'Yes', 'Maybe', 'Unknown'], ans: 'b' },
      { q: 'How many solutions: x + x = 2x?', opts: ['None', 'One', 'Infinite', 'Two'], ans: 'c' },
      { q: 'Equation: 5(x + 1) = 5x + 5', opts: ['No solution', 'x = 0', 'Infinitely many', 'x = 1'], ans: 'c' }
    ],
    'Multi-Step Linear Equations': [
      { q: 'Solve: 2x + 5 = 3x - 1', opts: ['6', '-6', '4', '-4'], ans: 'a' },
      { q: 'Solve: 3(x - 2) = 12', opts: ['6', '4', '2', '8'], ans: 'a' },
      { q: 'Solve: (x + 3)/2 = 5', opts: ['7', '10', '4', '13'], ans: 'a' },
      { q: 'Solve: 2x - 3 = x + 4', opts: ['7', '-7', '1', '11'], ans: 'a' },
      { q: 'Solve: 4x + 2 = 3x + 8', opts: ['6', '-6', '2', '10'], ans: 'a' }
    ]
  },

  'Systems of Linear Equations': {
    'Understanding Systems': [
      { q: 'What is a system of equations?', opts: ['One equation', 'Two or more equations', 'Many variables', 'No variables'], ans: 'b' },
      { q: 'Solution to system is where?', opts: ['Lines intersect', 'Lines are parallel', 'Lines are same', 'Cannot tell'], ans: 'a' },
      { q: 'How many solutions can a 2×2 system have?', opts: ['1', '0', 'Infinite', 'All of above'], ans: 'd' },
      { q: 'Parallel lines in system have:', opts: ['1 solution', '0 solutions', 'Infinite', 'Undefined'], ans: 'b' },
      { q: 'Same line represented twice means:', opts: ['No solution', 'One solution', 'Infinite solutions', 'Undefined'], ans: 'c' }
    ],
    'Solving Systems Algebraically': [
      { q: 'Solve: x + y = 5, x = 2', opts: ['(2,3)', '(3,2)', '(5,0)', '(0,5)'], ans: 'a' },
      { q: 'Solve: y = 2x, x + y = 9', opts: ['(3,6)', '(2,4)', '(4,2)', '(6,3)'], ans: 'a' },
      { q: 'Substitute to solve: x = 3, 2x + y = 8', opts: ['y = 2', 'y = -2', 'y = 5', 'y = 14'], ans: 'a' },
      { q: 'Elimination: x + y = 10, x - y = 2', opts: ['(6,4)', '(4,6)', '(8,2)', '(5,5)'], ans: 'a' },
      { q: '2x + y = 7, x + y = 4', opts: ['(3,1)', '(1,3)', '(2,3)', '(3,2)'], ans: 'a' }
    ],
    'Solving Systems by Graphing': [
      { q: 'Lines intersect at (2,3). Solution is?', opts: ['(2,3)', '(3,2)', 'No solution', 'Infinite solutions'], ans: 'a' },
      { q: 'Two parallel lines have how many intersections?', opts: ['0', '1', 'Infinite', '2'], ans: 'a' },
      { q: 'Same line graphed twice:', opts: ['No solution', '1 solution', 'Infinite', 'Undefined'], ans: 'c' },
      { q: 'Lines y = x and y = -x intersect at?', opts: ['(0,0)', '(1,1)', '(-1,-1)', 'No intersection'], ans: 'a' },
      { q: 'Find solution by graphing:', opts: ['Read intersection point', 'Find y-intercepts', 'Count grid squares', 'Find slope'], ans: 'a' }
    ],
    'One Solution, No Solution & Infinite Solutions': [
      { q: 'System with one solution has:', opts: ['Intersecting lines', 'Parallel lines', 'Same line', 'Cannot determine'], ans: 'a' },
      { q: 'System with no solution has:', opts: ['Intersecting lines', 'Parallel lines', 'Same line', 'Different slopes'], ans: 'b' },
      { q: 'System with infinite solutions has:', opts: ['Parallel lines', 'Perpendicular lines', 'Same line', 'Different slopes'], ans: 'c' },
      { q: 'Determine solution type for y = x + 1 and y = x - 1', opts: ['One', 'None', 'Infinite', 'Cannot determine'], ans: 'b' },
      { q: 'For y = 2x + 3 and y = 2x + 3:', opts: ['One solution', 'No solution', 'Infinite solutions', 'Undefined'], ans: 'c' }
    ],
    'Real-World Problems with Systems': [
      { q: 'Cost = 5x + 10, Revenue = 8x. Break-even when?', opts: ['x = 10/3', 'x = 3', 'x = 5', 'x = 2'], ans: 'a' },
      { q: 'Two plans: A = 20 + 5x, B = 10x. Equal cost at?', opts: ['x = 4', 'x = 2', 'x = 10', 'x = 20'], ans: 'a' },
      { q: 'Rate problem: 50x + 30 = 40x + 50. Find x.', opts: ['2', '5', '10', '20'], ans: 'a' },
      { q: 'Car A: y = 60t, Car B: y = 50t + 20. Meet when?', opts: ['t = 2', 't = 4', 't = 1', 't = 3'], ans: 'a' },
      { q: 'Investment: 5x + 8y = 1000. Real-world meaning?', opts: ['Total invested', 'Return rate', 'Interest earned', 'Cannot determine'], ans: 'a' }
    ]
  },

  'Functions': {
    'Understanding Functions': [
      { q: 'Is (1,2), (1,3) a function?', opts: ['Yes', 'No', 'Maybe', 'Unknown'], ans: 'b' },
      { q: 'Function means:', opts: ['Each x maps to one y', 'Each y maps to one x', 'Multiple outputs ok', 'No rule'], ans: 'a' },
      { q: 'Which is a function?', opts: ['(1,2), (1,3)', '(1,2), (2,3)', 'All y = x²', 'Cannot determine'], ans: 'b' },
      { q: 'Vertical line test checks:', opts: ['If graph is function', 'Slope value', 'y-intercept', 'Domain'], ans: 'a' },
      { q: 'Is y = |x| a function?', opts: ['Yes', 'No', 'Sometimes', 'Undefined'], ans: 'a' }
    ],
    'Inputs & Outputs': [
      { q: 'f(x) = 2x + 1. Find f(3)', opts: ['7', '5', '4', '6'], ans: 'a' },
      { q: 'If f(2) = 5, input is:', opts: ['2', '5', 'Unknown', 'Both'], ans: 'a' },
      { q: 'f(x) = x². Find f(-2)', opts: ['4', '-4', '2', '-2'], ans: 'a' },
      { q: 'Input 3, function f(x) = 5x. Output is?', opts: ['15', '8', '5', '3'], ans: 'a' },
      { q: 'g(x) = (x + 1)/2. Find g(5)', opts: ['3', '4', '2.5', '1.5'], ans: 'a' }
    ],
    'Function Tables': [
      { q: 'Complete table: f(x) = 2x, if x = 3, f(x) = ?', opts: ['6', '5', '3', '2'], ans: 'a' },
      { q: 'Table shows x: 1,2,3 y: 2,4,6. Rule is?', opts: ['y = 2x', 'y = x + 1', 'y = 3x', 'y = x²'], ans: 'a' },
      { q: 'Function table with x = 0, y = 5. Pattern?', opts: ['y = x + 5', 'y = 5x', 'y = 5', 'Cannot determine'], ans: 'a' },
      { q: 'Extend: x: 1,2,3,?, y: 3,6,9,?', opts: ['4, 12', '3, 12', '5, 15', '4, 10'], ans: 'a' },
      { q: 'Which table shows function?', opts: ['Repeated x values', 'All different x values', 'y repeats', 'Cannot determine'], ans: 'b' }
    ],
    'Comparing Functions': [
      { q: 'f(x) = x², g(x) = 2x. At x = 2, which is larger?', opts: ['f(x) = 4', 'g(x) = 4', 'Equal', 'Cannot tell'], ans: 'c' },
      { q: 'f(x) = 2x + 1 vs g(x) = x + 5. Which is faster growing?', opts: ['f(x)', 'g(x)', 'Same', 'Unknown'], ans: 'a' },
      { q: 'Compare slopes: f(x) = 3x and g(x) = 2x', opts: ['f steeper', 'g steeper', 'Equal', 'Cannot compare'], ans: 'a' },
      { q: 'Which has greater y-intercept?', opts: ['f(x) = x + 3', 'g(x) = x + 2', 'f(x) = 2x + 1', 'Cannot determine'], ans: 'a' },
      { q: 'f(0) = 5, g(0) = 3. Which has larger y-intercept?', opts: ['f(x)', 'g(x)', 'Equal', 'Unknown'], ans: 'a' }
    ],
    'Linear & Nonlinear Functions': [
      { q: 'Is y = 2x + 3 linear?', opts: ['Yes', 'No', 'Maybe', 'Cannot tell'], ans: 'a' },
      { q: 'Nonlinear function example:', opts: ['y = 3x', 'y = x²', 'y = 2x - 1', 'y = 5x'], ans: 'b' },
      { q: 'Which is nonlinear?', opts: ['y = 4x', 'y = 2x + 5', 'y = 1/x', 'y = 3x - 2'], ans: 'c' },
      { q: 'Graph of y = x² is:', opts: ['Straight line', 'Parabola', 'Curve', 'Both b and c'], ans: 'd' },
      { q: 'Linear means constant:', opts: ['Rate of change', 'Output', 'Input', 'Slope and y-intercept'], ans: 'a' }
    ],
    'Real-World Function Models': [
      { q: 'Distance = 60t (t = hours). Function or not?', opts: ['Yes', 'No', 'Maybe', 'Unknown'], ans: 'a' },
      { q: 'Profit = 5x - 100. At x = 30, profit is?', opts: ['50', '150', '250', '-50'], ans: 'b' },
      { q: 'Temperature model T(h) = 70 - 2h (h = hours). Linear?', opts: ['Yes', 'No', 'Maybe', 'Cannot tell'], ans: 'a' },
      { q: 'Cost C(n) = 10n + 50. Meaning?', opts: ['$50 fixed, $10 per item', '$10 fixed, $50 per item', 'Only depends on n', 'Unknown'], ans: 'a' },
      { q: 'Population growth P(t) = 1000 × 2^t. Function type?', opts: ['Linear', 'Exponential', 'Quadratic', 'Constant'], ans: 'b' }
    ]
  },

  'Transformations': {
    'Translations': [
      { q: 'Translate (2,3) by 1 right, 2 up', opts: ['(3,5)', '(1,1)', '(2,5)', '(4,3)'], ans: 'a' },
      { q: 'Shift point (0,0) left 3 units', opts: ['(-3,0)', '(3,0)', '(0,3)', '(0,-3)'], ans: 'a' },
      { q: 'Move (4,1) down 2 units', opts: ['(4,-1)', '(2,1)', '(4,3)', '(6,1)'], ans: 'a' },
      { q: 'Translate right 5, up 3: (1,2) → ?', opts: ['(6,5)', '(4,0)', '(-4,-1)', '(3,4)'], ans: 'a' },
      { q: 'Vector (2,3) added to (1,1)', opts: ['(3,4)', '(1,4)', '(3,2)', '(1,1)'], ans: 'a' }
    ],
    'Reflections': [
      { q: 'Reflect (3,2) over x-axis', opts: ['(3,-2)', '(-3,2)', '(2,3)', '(-3,-2)'], ans: 'a' },
      { q: 'Reflect (1,4) over y-axis', opts: ['(-1,4)', '(1,-4)', '(4,1)', '(-1,-4)'], ans: 'a' },
      { q: 'Reflect (2,2) over y = x', opts: ['(2,2)', '(-2,-2)', '(2,-2)', '(-2,2)'], ans: 'a' },
      { q: 'Point (0,5) reflected over x-axis goes to', opts: ['(0,-5)', '(5,0)', '(0,5)', '(-5,0)'], ans: 'a' },
      { q: 'Reflect (-2,3) over origin', opts: ['(2,-3)', '(-2,-3)', '(2,3)', '(3,2)'], ans: 'a' }
    ],
    'Rotations': [
      { q: 'Rotate (1,0) 90° counterclockwise around origin', opts: ['(0,1)', '(0,-1)', '(1,1)', '(-1,1)'], ans: 'a' },
      { q: 'Rotate (2,0) 180° around origin', opts: ['(-2,0)', '(2,0)', '(0,2)', '(0,-2)'], ans: 'a' },
      { q: 'Rotate (0,3) 270° counterclockwise', opts: ['(3,0)', '(-3,0)', '(0,3)', '(0,-3)'], ans: 'a' },
      { q: '90° rotation of (x,y) gives', opts: ['(-y,x)', '(y,-x)', '(-x,-y)', '(x,-y)'], ans: 'a' },
      { q: 'Point (1,1) rotated 180° → ?', opts: ['(-1,-1)', '(1,1)', '(-1,1)', '(1,-1)'], ans: 'a' }
    ],
    'Dilations': [
      { q: 'Dilate (2,4) by scale factor 2', opts: ['(4,8)', '(2,4)', '(1,2)', '(6,12)'], ans: 'a' },
      { q: 'Scale factor 1/2 on (6,8) gives', opts: ['(3,4)', '(12,16)', '(6,8)', '(1,1.3)'], ans: 'a' },
      { q: 'Dilate (1,1) by factor 3', opts: ['(3,3)', '(1,1)', '(0,0)', '(1/3,1/3)'], ans: 'a' },
      { q: 'Scale factor 0.5 shrinks or enlarges?', opts: ['Shrinks', 'Enlarges', 'No change', 'Depends'], ans: 'a' },
      { q: 'Enlarge (2,3) by factor 2.5', opts: ['(5,7.5)', '(2,3)', '(0.8,1.2)', '(4,6)'], ans: 'a' }
    ],
    'Coordinates After Transformations': [
      { q: 'After reflection over y-axis and translation right 2, (1,3) becomes?', opts: ['(1,3)', '(-1,3)', '(1,3)', '(3,3)'], ans: 'd' },
      { q: 'Rotate 90° then reflect over x-axis: (1,0) → ?', opts: ['(0,-1)', '(0,1)', '(-1,0)', '(1,0)'], ans: 'a' },
      { q: 'Translate (1,1) up 3, then dilate by 2', opts: ['(2,8)', '(2,6)', '(3,4)', '(4,6)'], ans: 'a' },
      { q: 'Multiple transformations track:', opts: ['Original coords', 'After each step', 'Only final', 'Cannot determine'], ans: 'b' },
      { q: 'Composition of transformations: (2,0) reflect + rotate 90°', opts: ['(0,-2)', '(0,2)', '(-2,0)', '(2,0)'], ans: 'a' }
    ]
  },

  'Congruence & Similarity': {
    'Congruent Figures': [
      { q: 'Congruent means:', opts: ['Same size and shape', 'Same shape only', 'Same size only', 'Related'], ans: 'a' },
      { q: 'Are these congruent? Triangle ABC ≅ Triangle DEF', opts: ['Yes', 'No', 'Maybe', 'Depends'], ans: 'a' },
      { q: 'If congruent, corresponding angles are:', opts: ['Equal', 'Supplementary', 'Different', 'Unknown'], ans: 'a' },
      { q: 'Corresponding sides in congruent figures are:', opts: ['Equal', 'Proportional', 'Different', 'Can vary'], ans: 'a' },
      { q: 'SSS means:', opts: ['Side-Side-Side', 'Sum of Sides', 'Super Side Set', 'Sequential Sides'], ans: 'a' }
    ],
    'Similar Figures': [
      { q: 'Similar means:', opts: ['Same shape, same size', 'Same shape, different size', 'Different shape', 'Congruent'], ans: 'b' },
      { q: 'Similar figures have corresponding angles:', opts: ['Equal', 'Different', 'Proportional', 'Supplementary'], ans: 'a' },
      { q: 'Are all squares similar?', opts: ['Yes', 'No', 'Sometimes', 'Never'], ans: 'a' },
      { q: 'Triangle ABC ~ Triangle DEF means:', opts: ['Similar', 'Congruent', 'Same area', 'Parallel'], ans: 'a' },
      { q: 'AA similarity test means:', opts: ['Two angles equal', 'All angles equal', 'Two sides equal', 'All sides proportional'], ans: 'a' }
    ],
    'Scale Factors': [
      { q: 'Scale factor from 2 to 6:', opts: ['3', '1/3', '4', '8'], ans: 'a' },
      { q: 'If scale factor is 2, figure is:', opts: ['Doubled', 'Halved', 'Same', 'Tripled'], ans: 'a' },
      { q: 'Scale factor 1/2 makes figure:', opts: ['Half size', 'Double size', 'Same size', 'Triple size'], ans: 'a' },
      { q: 'Figure scaled by 3: side 2 becomes?', opts: ['6', '2/3', '5', '1'], ans: 'a' },
      { q: 'Original 4 cm, scaled 0.5, new length?', opts: ['2 cm', '4 cm', '8 cm', '0.25 cm'], ans: 'a' }
    ],
    'Similarity Transformations': [
      { q: 'Similarity transformation includes:', opts: ['Dilation + isometry', 'Rotation + reflection', 'Translation + rotation', 'Any transformation'], ans: 'a' },
      { q: 'Which preserves shape?', opts: ['All transformations', 'Only translations', 'Dilations & isometries', 'Reflections only'], ans: 'c' },
      { q: 'Dilation is similarity transformation?', opts: ['Yes', 'No', 'Sometimes', 'Rarely'], ans: 'a' },
      { q: 'Rotation is similarity transformation?', opts: ['Yes', 'No', 'Maybe', 'Cannot determine'], ans: 'a' },
      { q: 'Scale factor 1 in dilation means:', opts: ['No change', 'Figure doubles', 'Figure halves', 'Varies'], ans: 'a' }
    ],
    'Angle Relationships': [
      { q: 'Corresponding angles in similar figures:', opts: ['Equal', 'Different', 'Proportional', 'Supplementary'], ans: 'a' },
      { q: 'If angles equal, figures might be:', opts: ['Similar', 'Congruent', 'Both', 'Neither'], ans: 'c' },
      { q: 'Vertical angles are:', opts: ['Equal', 'Supplementary', 'Complementary', 'Different'], ans: 'a' },
      { q: 'Alternate interior angles:', opts: ['Equal', 'Sum to 180°', 'Proportional', 'Different'], ans: 'a' },
      { q: 'Triangle angles sum to:', opts: ['180°', '360°', '90°', 'Varies'], ans: 'a' }
    ]
  },

  'Pythagorean Theorem': {
    'Understanding the Pythagorean Theorem': [
      { q: 'Pythagorean Theorem: a² + b² = ?', opts: ['c²', 'c', 'ab', '2c'], ans: 'a' },
      { q: 'In right triangle, c is:', opts: ['Hypotenuse', 'Leg', 'Angle', 'Median'], ans: 'a' },
      { q: 'Applies to:', opts: ['Right triangles', 'All triangles', 'Acute triangles', 'Never'], ans: 'a' },
      { q: 'Is 3-4-5 a Pythagorean triple?', opts: ['Yes', 'No', 'Maybe', 'Unknown'], ans: 'a' },
      { q: 'Pythagorean theorem states:', opts: ['Sum of leg squares = hypotenuse square', 'Legs equal hypotenuse', 'Area theorem', 'Angle relationship'], ans: 'a' }
    ],
    'Finding Missing Side Lengths': [
      { q: 'Right triangle: a=3, b=4, c=?', opts: ['5', '7', '12', '1'], ans: 'a' },
      { q: 'Legs 6 and 8, hypotenuse = ?', opts: ['10', '14', '48', '2'], ans: 'a' },
      { q: 'c = 13, a = 5, b = ?', opts: ['12', '8', '18', '65'], ans: 'a' },
      { q: 'Missing leg: hypotenuse 15, known leg 9', opts: ['12', '24', '6', '144'], ans: 'a' },
      { q: 'If a = 7, b = 7, c = ?', opts: ['7√2', '14', '49', '98'], ans: 'a' }
    ],
    'Pythagorean Theorem Converse': [
      { q: 'Converse: if a² + b² = c², then:', opts: ['Right triangle', 'Isosceles', 'Obtuse', 'Cannot determine'], ans: 'a' },
      { q: 'Check if right triangle: 5, 12, 13', opts: ['Yes (5²+12²=13²)', 'No', 'Maybe', 'Undefined'], ans: 'a' },
      { q: 'Is 6-8-10 a right triangle?', opts: ['Yes', 'No', 'Maybe', 'Cannot check'], ans: 'a' },
      { q: 'Sides 3-4-6: right triangle?', opts: ['No', 'Yes', 'Maybe', 'Always'], ans: 'a' },
      { q: 'Triangle with sides satisfying a²+b²=c² is:', opts: ['Right', 'Obtuse', 'Acute', 'Equilateral'], ans: 'a' }
    ],
    'Real-World Applications': [
      { q: 'Ladder 10 ft, base 6 ft from wall, height = ?', opts: ['8', '16', '4', '12'], ans: 'a' },
      { q: 'Distance from (0,0) to (3,4):', opts: ['5', '7', '1', '12'], ans: 'a' },
      { q: 'Diagonal of 8×6 rectangle:', opts: ['10', '14', '48', '2'], ans: 'a' },
      { q: 'Ship 12 km east, then 5 km north. Distance from start?', opts: ['13', '17', '7', '60'], ans: 'a' },
      { q: 'Right triangle real-world use:', opts: ['Architecture', 'Navigation', 'Engineering', 'All'], ans: 'd' }
    ],
    'Distance on the Coordinate Plane': [
      { q: 'Distance from (1,1) to (4,5)', opts: ['5', '7', '8', '3'], ans: 'a' },
      { q: 'Distance between (0,0) and (5,12)', opts: ['13', '17', '7', '60'], ans: 'a' },
      { q: 'Distance from (-2,3) to (1,7)', opts: ['5', '4', '3', '6'], ans: 'a' },
      { q: 'Find distance: (1,0) to (1,4)', opts: ['4', '5', '1', '16'], ans: 'a' },
      { q: 'Use Pythagorean theorem for coordinate distance?', opts: ['Yes', 'No', 'Sometimes', 'Never'], ans: 'a' }
    ]
  },

  'Volume': {
    'Volume of Cylinders': [
      { q: 'Cylinder volume formula:', opts: ['πr²h', '2πrh', 'πr²', '2πr²h'], ans: 'a' },
      { q: 'Cylinder r=2, h=5, volume = ?', opts: ['20π', '10π', '4π', '100π'], ans: 'a' },
      { q: 'If V = πr²h and r=3, h=10:', opts: ['90π', '30π', '900π', '9π'], ans: 'a' },
      { q: 'Radius 5 cm, height 12 cm, volume ≈', opts: ['942 cm³', '314 cm³', '60 cm³', '3768 cm³'], ans: 'a' },
      { q: 'Volume units for cylinder:', opts: ['Cubic units', 'Square units', 'Linear units', 'Radians'], ans: 'a' }
    ],
    'Volume of Cones': [
      { q: 'Cone volume formula:', opts: ['(1/3)πr²h', 'πr²h', '(1/3)πrh', '(1/3)πr'], ans: 'a' },
      { q: 'Cone r=3, h=9, volume = ?', opts: ['27π', '9π', '81π', '3π'], ans: 'a' },
      { q: 'If cone volume = (1/3)πr²h, r=4, h=6:', opts: ['32π', '96π', '8π', '48π'], ans: 'a' },
      { q: 'Cone radius 2, height 15, V ≈', opts: ['62.8', '188.4', '20', '30'], ans: 'a' },
      { q: 'Cone is 1/3 volume of which cylinder?', opts: ['Same r and h', 'Double h', 'Half r', 'Different shape'], ans: 'a' }
    ],
    'Volume of Spheres': [
      { q: 'Sphere volume formula:', opts: ['(4/3)πr³', '(4/3)πr²', 'πr³', '4πr²'], ans: 'a' },
      { q: 'Sphere r=3, volume = ?', opts: ['36π', '27π', '9π', '108π'], ans: 'a' },
      { q: 'Volume of sphere with r=2:', opts: ['(32/3)π', '8π', '4π', '16π'], ans: 'a' },
      { q: 'Sphere radius 5, volume ≈', opts: ['523.6', '78.5', '314', '1570'], ans: 'a' },
      { q: 'Diameter 10, sphere volume ≈', opts: ['523.6', '314', '1000', '785'], ans: 'a' }
    ],
    'Real-World Volume Problems': [
      { q: 'Pool (cylinder) r=5m, h=2m, capacity ≈', opts: ['157 m³', '50 m³', '314 m³', '25 m³'], ans: 'a' },
      { q: 'Ice cream cone (cone) r=2cm, h=8cm, V ≈', opts: ['33.5 cm³', '100 cm³', '64 cm³', '16 cm³'], ans: 'a' },
      { q: 'Basketball (sphere) diameter 24 cm, V ≈', opts: ['7238 cm³', '1809 cm³', '453 cm³', '4525 cm³'], ans: 'a' },
      { q: 'Water tank cylindrical, 2m radius, 3m high, holds ≈', opts: ['37.7 m³', '12 m³', '18.8 m³', '75.4 m³'], ans: 'a' },
      { q: 'Real-world volume used for:', opts: ['Capacity', 'Area', 'Perimeter', 'Density'], ans: 'a' }
    ]
  },

  'Statistics & Probability': {
    'Scatter Plots': [
      { q: 'Scatter plot shows:', opts: ['Relationship between variables', 'Time sequence', 'Frequency', 'Mean value'], ans: 'a' },
      { q: 'Points trending up show:', opts: ['Positive association', 'Negative association', 'No association', 'Correlation'], ans: 'a' },
      { q: 'Scatter plot with no pattern:', opts: ['No association', 'Positive association', 'Negative association', 'Strong relationship'], ans: 'a' },
      { q: 'Independent variable on:', opts: ['x-axis', 'y-axis', 'Both', 'Cannot determine'], ans: 'a' },
      { q: 'Dependent variable on:', opts: ['y-axis', 'x-axis', 'Both', 'Varies'], ans: 'a' }
    ],
    'Positive & Negative Association': [
      { q: 'Hours studied vs test score:', opts: ['Positive association', 'Negative association', 'No association', 'Cannot determine'], ans: 'a' },
      { q: 'Temperature vs heating cost:', opts: ['Positive association', 'Negative association', 'No association', 'Mixed'], ans: 'b' },
      { q: 'Age vs reading ability (young):', opts: ['Positive', 'Negative', 'None', 'Circular'], ans: 'a' },
      { q: 'Price increase vs quantity sold:', opts: ['Negative association', 'Positive association', 'No association', 'Random'], ans: 'a' },
      { q: 'Positive association means:', opts: ['One increases, other increases', 'Increases then decreases', 'Always equal', 'No trend'], ans: 'a' }
    ],
    'Linear & Nonlinear Association': [
      { q: 'Linear association has:', opts: ['Straight-line pattern', 'Curved pattern', 'Random points', 'No pattern'], ans: 'a' },
      { q: 'Nonlinear association example:', opts: ['Parabolic curve', 'Straight line', 'Random scatter', 'Horizontal'], ans: 'a' },
      { q: 'Which shows linear?', opts: ['Points form line', 'Points form curve', 'No pattern', 'Random'], ans: 'a' },
      { q: 'Best fit line for linear association?', opts: ['Straight line through points', 'Curve through points', 'Vertical line', 'No line'], ans: 'a' },
      { q: 'Exponential growth is:', opts: ['Nonlinear', 'Linear', 'Random', 'Periodic'], ans: 'a' }
    ],
    'Clusters & Outliers': [
      { q: 'Cluster in scatter plot is:', opts: ['Group of close points', 'Isolated point', 'Linear trend', 'Random spread'], ans: 'a' },
      { q: 'Outlier is:', opts: ['Point far from others', 'Close to trend line', 'Mean of data', 'Common value'], ans: 'a' },
      { q: 'Outlier affects:', opts: ['Mean significantly', 'Mode not at all', 'Range greatly', 'All of above'], ans: 'd' },
      { q: 'Remove outlier to:', opts: ['Better see trend', 'Increase variation', 'Find mean', 'Lose information'], ans: 'a' },
      { q: 'Two clusters suggest:', opts: ['Two groups', 'One trend', 'Linear', 'Random'], ans: 'a' }
    ],
    'Linear Models': [
      { q: 'Linear model is:', opts: ['Equation of trend line', 'Best-fit line', 'y = mx + b form', 'All of above'], ans: 'd' },
      { q: 'Use linear model to:', opts: ['Predict values', 'Show trend', 'Estimate', 'All of above'], ans: 'd' },
      { q: 'If model is y = 2x + 3, when x = 5, y = ?', opts: ['13', '10', '8', '15'], ans: 'a' },
      { q: 'Least squares line minimizes:', opts: ['Distance from points', 'Slope value', 'y-intercept', 'Sum of x'], ans: 'a' },
      { q: 'Linear regression gives:', opts: ['Best-fit line', 'Exact predictions', 'Only mean', 'Random line'], ans: 'a' }
    ],
    'Slope & Intercept in Data': [
      { q: 'Slope in y = mx + b represents:', opts: ['Rate of change', 'Starting value', 'Data spread', 'Correlation'], ans: 'a' },
      { q: 'If slope = 3, increase in x by 1 → increase in y by:', opts: ['3', '1', '0.3', 'Cannot determine'], ans: 'a' },
      { q: 'y-intercept (b) is:', opts: ['Starting value (x=0)', 'Slope value', 'Maximum', 'Outlier'], ans: 'a' },
      { q: 'Model: earnings = 12(hours) + 50. Intercept means:', opts: ['$50 starting bonus', '$12 per hour', 'Hours worked', 'Total earnings'], ans: 'a' },
      { q: 'Negative slope means:', opts: ['y decreases as x increases', 'y increases as x increases', 'No relationship', 'Constant'], ans: 'a' }
    ],
    'Two-Way Tables & Relative Frequencies': [
      { q: 'Two-way table shows:', opts: ['Two categorical variables', 'Two quantities', 'Time and value', 'Two groups only'], ans: 'a' },
      { q: 'Relative frequency is:', opts: ['Part/Total', 'Actual count', 'Percentage only', 'Decimal only'], ans: 'a' },
      { q: 'If 30 out of 100, relative frequency = ?', opts: ['0.30', '30%', '30 out of 100', 'All above'], ans: 'd' },
      { q: 'Marginal frequency is:', opts: ['Row or column total', 'Cell value', 'Relative value', 'Conditional'], ans: 'a' },
      { q: 'Two-way table usefulness:', opts: ['Spot patterns', 'Compare groups', 'Analyze relationships', 'All'], ans: 'd' }
    ]
  }
}

// Generate MCQs (WITHOUT DUPLICATES)
export function generateGrade8MCQs() {
  const allMCQs = []
  let currentId = 80001

  for (const topicInfo of grade8Topics) {
    const { topic, subtopics, count } = topicInfo
    const qPerSubtopic = Math.floor(count / subtopics.length)
    const remainder = count % subtopics.length

    for (let s = 0; s < subtopics.length; s++) {
      const subtopic = subtopics[s]
      const qCount = qPerSubtopic + (s < remainder ? 1 : 0)
      const bank = mcqBanks[topic]?.[subtopic] || []

      // Shuffle and limit to available questions
      const shuffled = [...bank].sort(() => Math.random() - 0.5)
      const selectedQuestions = shuffled.slice(0, Math.min(qCount, shuffled.length))

      for (let q = 0; q < selectedQuestions.length; q++) {
        const bankQ = selectedQuestions[q]
        const difficulty = ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]

        allMCQs.push({
          id: currentId++,
          grade: 8,
          subject: 'Math',
          topic,
          subtopic,
          difficulty,
          question: bankQ.q,
          option_a: bankQ.opts[0],
          option_b: bankQ.opts[1],
          option_c: bankQ.opts[2],
          option_d: bankQ.opts[3],
          correct_answer: bankQ.ans
        })
      }
    }
  }

  return allMCQs
}
