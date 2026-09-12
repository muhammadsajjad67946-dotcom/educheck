export const GRADE_ONE_CURRICULUM = {
  'Operations & Algebraic Thinking': {
    'Represent and solve problems involving addition and subtraction': [
      'Addition and subtraction within 20', 'Word problems: adding to', 'Word problems: taking from',
      'Word problems: putting together', 'Word problems: taking apart', 'Comparison word problems',
      'Unknowns in all positions', 'Addition of three whole numbers (sum ≤ 20)',
    ],
    'Understand and apply properties of operations': [
      'Commutative property of addition', 'Associative property of addition',
      'Use properties to add and subtract', 'Addition strategies',
    ],
    'Understand relationship between addition and subtraction': [
      'Subtraction as an unknown-addend problem', 'Fact families', 'Use addition to solve subtraction',
    ],
    'Add and subtract within 20': [
      'Counting on', 'Making ten', 'Decomposing numbers',
      'Using addition/subtraction relationships', 'Creating equivalent sums',
    ],
    'Work with addition and subtraction equations': [
      'Meaning of equal sign', 'True equations', 'False equations',
      'Unknown whole number', 'Missing number equations',
    ],
  },
  'Number & Operations in Base Ten': {
    'Extend the counting sequence': [
      'Count to 120', 'Count starting from any number < 120', 'Read numerals',
      'Write numerals', 'Represent objects with numerals',
    ],
    'Understand place value': [
      'Tens and ones', 'Groups of ten', 'Numbers 11–19',
      'Tens with zero ones', 'Compare two-digit numbers',
      'Greater than (>)', 'Equal to (=)', 'Less than (<)',
    ],
    'Use place value to add and subtract': [
      'Add within 100', 'Two-digit + one-digit', 'Two-digit + multiple of 10',
      'Compose a ten', 'Add tens and ones', 'Find 10 more mentally',
      'Find 10 less mentally', 'Subtract multiples of 10',
    ],
  },
  'Measurement & Data': {
    'Measure lengths': [
      'Order objects by length', 'Compare lengths indirectly', 'Use a third object for comparison',
      'Measure using equal units', 'Count length units', 'Avoid gaps and overlaps',
    ],
    'Tell and write time': [
      'Read analog clock', 'Read digital clock', 'Tell time in hours', 'Tell time in half-hours',
    ],
    'Represent and interpret data': [
      'Organize data', 'Represent data', 'Up to three categories', 'Count total data points',
      'Count data in each category', 'Compare categories', 'Determine how many more/less',
    ],
  },
  Geometry: {
    'Reason with shapes and their attributes': [
      'Identify defining attributes', 'Identify non-defining attributes', 'Closed shapes',
      'Number of sides', 'Build shapes', 'Draw shapes',
    ],
    'Compose shapes': [
      'Compose 2D shapes', 'Rectangles', 'Squares', 'Trapezoids', 'Triangles',
      'Half-circles', 'Quarter-circles', 'Compose 3D shapes', 'Cubes',
      'Rectangular prisms', 'Cones', 'Cylinders', 'Create new shapes from composite shapes',
    ],
    'Partition shapes into equal shares': [
      'Partition circles', 'Partition rectangles', 'Two equal shares', 'Four equal shares',
      'Halves', 'Fourths', 'Quarters', 'Half of', 'Fourth of', 'Quarter of',
      'Whole = two/four equal shares',
    ],
  },
}

// Legacy topic names remain available for the existing question helpers.
export const GRADE_ONE_TAXONOMY = {
  Algebra: Object.values(GRADE_ONE_CURRICULUM['Operations & Algebraic Thinking']).flat(),
  'Number & Operations': Object.values(GRADE_ONE_CURRICULUM['Number & Operations in Base Ten']).flat(),
  Measurement: Object.values(GRADE_ONE_CURRICULUM['Measurement & Data']).flat(),
  Geometry: Object.values(GRADE_ONE_CURRICULUM.Geometry).flat(),
  'Data Analysis': GRADE_ONE_CURRICULUM['Measurement & Data']['Represent and interpret data'],
}

export const CONCEPT_FAMILY_MAP = {
  'Place Value': ['Place Value', 'Place Value System', 'Counting & Number Representation'],
  'Addition': ['Addition', 'Basic Addition', 'Addition Using Place Value', 'Addition & Subtraction Word Problems', 'Addition & Subtraction Strategies'],
  'Subtraction': ['Subtraction', 'Basic Subtraction', 'Addition & Subtraction Word Problems', 'Addition & Subtraction Strategies'],
  'Multiplication': ['Multiplication', 'Equal Groups', 'Rectangular Arrays', 'Times Tables'],
  'Division': ['Division', 'Long Division'],
  'Fractions': ['Fractions', 'Fraction Concepts', 'Fraction Addition & Subtraction'],
  'Decimals': ['Decimals', 'Decimal Place Value', 'Decimal Operations'],
  'Area': ['Area', 'Area of Shapes', 'Area through Shapes'],
  'Perimeter': ['Perimeter', 'Perimeter and Circumference'],
  'Probability': ['Probability', 'Chance', 'Data Representation & Interpretation'],
  'Patterns': ['Patterns', 'Arithmetic Patterns', 'Pattern Rules'],
}

export const GRADE_CONCEPT_FAMILY_MAP = {
  'Grade 1': {
    Algebra: ['Addition & Subtraction Word Problems', 'Properties & Relationships', 'Addition & Subtraction Strategies', 'Equations & Unknowns'],
    'Number & Operations': ['Counting & Number Representation', 'Place Value', 'Addition Using Place Value', 'Mental Addition & Subtraction'],
    Measurement: ['Length Comparison', 'Measuring Length', 'Time'],
    Geometry: ['Shapes & Attributes', 'Composing Shapes', 'Partitioning Shapes'],
    'Data Analysis': ['Data Representation & Interpretation'],
  },
  'Grade 2': {
    Algebra: ['Addition & Subtraction Word Problems', 'Properties & Relationships', 'Addition & Subtraction Strategies'],
    'Number & Operations': ['Counting & Number Representation', 'Place Value', 'Mental Addition & Subtraction', 'Equal Groups & Rectangular Arrays'],
    Measurement: ['Length Comparison', 'Measuring Length', 'Time', 'Money'],
    Geometry: ['Shapes & Attributes', 'Composing Shapes', 'Partitioning Shapes', 'Symmetry'],
    'Data Analysis': ['Data Representation & Interpretation', 'Picture Graphs', 'Bar Graphs'],
  },
  'Grade 3': {
    Algebra: ['Patterns', 'Arithmetic Patterns', 'Addition & Subtraction Word Problems', 'Unknown Numbers'],
    'Number & Operations': ['Place Value', 'Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions'],
    Measurement: ['Length', 'Time', 'Area', 'Perimeter', 'Liquid Volume'],
    Geometry: ['Shapes & Attributes', 'Area through Shapes', 'Perimeter', 'Lines & Angles'],
    'Data Analysis': ['Tables', 'Pictographs', 'Reading Data', 'Interpreting Data'],
  },
  'Grade 4': {
    Algebra: ['Patterns', 'Relationships', 'Equations', 'Multi-Step Word Problems'],
    'Number & Operations': ['Place Value', 'Addition', 'Subtraction', 'Multiplication', 'Division', 'Fractions', 'Decimals'],
    Measurement: ['Length', 'Mass', 'Time', 'Area', 'Perimeter', 'Volume'],
    Geometry: ['Lines & Angles', 'Shapes', 'Symmetry', 'Coordinate Plane'],
    'Data Analysis': ['Graphs', 'Tables', 'Line Plots', 'Probability'],
  },
  'Grade 5': {
    Algebra: ['Patterns', 'Number Patterns', 'Equations', 'Ordered Pairs'],
    'Number & Operations': ['Place Value System', 'Fractions', 'Decimals', 'Multi-Digit Operations'],
    Measurement: ['Area', 'Perimeter', 'Volume', 'Unit Conversion'],
    Geometry: ['Coordinate Plane', '2D Figures', 'Angles', 'Volume'],
    'Data Analysis': ['Line Plots', 'Data Representation & Interpretation', 'Mean', 'Median', 'Mode'],
  },
  'Grade 6': {
    Algebra: ['Expressions', 'Equations', 'Inequalities', 'Patterns'],
    'Number & Operations': ['Fractions', 'Decimals', 'Ratios', 'Percent', 'Integers'],
    Measurement: ['Area', 'Surface Area', 'Volume', 'Measurement Unit Conversion'],
    Geometry: ['Triangles', 'Polygons', 'Coordinate Plane', 'Area of Composite Figures'],
    'Data Analysis': ['Statistics', 'Probability', 'Data Displays', 'Measures of Center'],
  },
  'Grade 7': {
    Algebra: ['Linear Equations', 'Expressions', 'Inequalities', 'Patterns'],
    'Number & Operations': ['Integers', 'Fractions', 'Decimals', 'Ratios', 'Percent', 'Order of Operations'],
    Measurement: ['Area', 'Perimeter', 'Volume', 'Scale', 'Unit Conversion'],
    Geometry: ['Angles', 'Triangles', 'Circles', 'Transformations'],
    'Data Analysis': ['Graphs', 'Tables', 'Statistics', 'Probability'],
  },
  'Grade 8': {
    Algebra: ['Linear Equations', 'Quadratic Equations', 'Functions', 'Patterns'],
    'Number & Operations': ['Real Numbers', 'Exponents', 'Scientific Notation', 'Roots'],
    Measurement: ['Surface Area', 'Volume', 'Scale', 'Transformations'],
    Geometry: ['Pythagorean Theorem', 'Coordinate Geometry', 'Similarity', 'Transformations'],
    'Data Analysis': ['Scatter Plots', 'Trends', 'Probability', 'Statistics'],
  },
}

export function getConceptFamilyForGrade(grade, topic, subtopic = null) {
  const normalizedGrade = Number(grade) || 1
  const gradeKey = `Grade ${Math.min(8, Math.max(1, normalizedGrade))}`
  const topicMap = GRADE_CONCEPT_FAMILY_MAP[gradeKey] || {}
  const families = topicMap[topic] || []

  if (!subtopic) return families

  return families.filter((family) => {
    const familyText = String(family).toLowerCase()
    const subtopicText = String(subtopic).toLowerCase()
    return familyText === subtopicText || familyText.includes(subtopicText) || subtopicText.includes(familyText)
  })
}

export function inferGradeOneSubtopic(question) {
  const text = String(question.question || '').toLowerCase()
  const topic = question.topic

  if (topic === 'Algebra') {
    if (/has|gives|buys|ate|left|brother|total/.test(text)) return 'Addition & Subtraction Word Problems'
    if (/true|false|equals|equation|statement|same/.test(text)) return 'Properties & Relationships'
    if (/strategy|make-a-ten|sequence|pattern/.test(text)) return 'Addition & Subtraction Strategies'
    return 'Equations & Unknowns'
  }
  if (topic === 'Number & Operations') {
    if (/tens|ones|place|digit/.test(text)) return 'Place Value'
    if (/count|number comes|after|before|even|sequence|pattern|greater|less/.test(text)) return 'Counting & Number Representation'
    if (/10\s*[+]|using place/.test(text)) return 'Addition Using Place Value'
    return 'Mental Addition & Subtraction'
  }
  if (topic === 'Measurement') {
    if (/clock|time|hour|minute|sun|day|week/.test(text)) return 'Time'
    if (/longer|shorter|heavier|heavy|holds more|compare/.test(text)) return 'Length Comparison'
    return 'Measuring Length'
  }
  if (topic === 'Geometry') {
    if (/join|joining|make by|compose/.test(text)) return 'Composing Shapes'
    if (/half|quarter|part|divided|cut/.test(text)) return 'Partitioning Shapes'
    return 'Shapes & Attributes'
  }
  return 'Data Representation & Interpretation'
}

export const GRADE_TWO_TAXONOMY = {
  Algebra: ['Addition & Subtraction Word Problems'],
  'Number & Operations': ['Mental Addition & Subtraction', 'Counting & Number Representation', 'Equal Groups & Rectangular Arrays'],
}

export const GRADE_TWO_CURRICULUM = {
  'Operations & Algebraic Thinking': {
    'Addition & Subtraction Word Problems': {
      'Add To Problems': 0, 'Take From Problems': 0, 'Put Together Problems': 0, 'Take Apart Problems': 0,
      'Compare Problems': 0, 'One-Step Word Problems': 0, 'Two-Step Word Problems': 0,
    },
    'Add & Subtract Within 20': {
      'Addition Within 20': 0, 'Subtraction Within 20': 0, 'Mental Addition Strategies': 0,
      'Mental Subtraction Strategies': 0, 'Addition Facts Within 20': 0,
    },
    'Odd & Even Numbers': {
      'Identify Odd Numbers': 0, 'Identify Even Numbers': 0, 'Counting by 2s': 0,
      'Pairing Objects': 0, 'Equal Addends for Even Numbers': 0,
    },
    'Equal Groups & Rectangular Arrays': {
      'Equal Groups': 0, 'Counting Equal Groups': 0, 'Rectangular Arrays': 0,
      'Rows and Columns': 0, 'Repeated Addition': 0, 'Represent Arrays Using Addition': 0,
    },
  },
  'Number & Operations in Base Ten': {
    'Understand Place Value': {
      '3-Digit Place Value Concepts (Hundreds, Tens, Ones)': 5,
      'Special Cases (10 Tens = 100, Bundles of Hundreds)': 3,
      'Skip-Counting by 5s, 10s, and 100s': 4,
      'Read & Write Numbers (Base-Ten, Names, Expanded Form)': 4,
      'Compare 3-Digit Numbers (<, >, =)': 4,
    },
    'Use Place Value Understanding to Add & Subtract': {
      'Fluently Add & Subtract within 100': 4,
      'Add Up to Four Two-Digit Numbers': 4,
      'Add & Subtract within 1000 (Regrouping / Composing & Decomposing)': 4,
      'Mentally Add/Subtract 10 or 100': 4,
      'Explaining Strategies using Place Value & Properties': 4,
    },
  },
  'Measurement & Data': {
    'Measure & Estimate Lengths in Standard Units': {
      'Selecting Appropriate Measuring Tools': 3, 'Measuring Same Object with Two Different Units': 3,
      'Estimating Lengths (Inches, Feet, CM, Meters)': 3, 'Comparing Lengths & Calculating Difference': 3,
    },
    'Relate Addition & Subtraction to Length': {
      'Length Word Problems (Single Unit)': 4, 'Number Line Diagrams (Sums & Differences)': 4,
    },
    'Work with Time & Money': {
      'Telling & Writing Time to Nearest 5 Minutes (a.m./p.m.)': 5,
      'Money Word Problems (Bills, Quarters, Dimes, Nickels, Pennies)': 5,
    },
    'Represent & Interpret Data': {
      'Line Plots with Measurement Data': 4, 'Picture Graphs & Bar Graphs Data Problems': 4,
    },
  },
  Geometry: {
    'Reason with Shapes & Their Attributes': {
      'Identifying & Drawing Shapes (Triangles, Quadrilaterals, Pentagons, Hexagons, Cubes)': 8,
      'Partitioning Rectangles into Rows & Columns (Counting Grid Squares)': 6,
      'Partitioning Shapes into Equal Shares (Halves, Thirds, Fourths & Non-Identical Equal Shares)': 8,
    },
  },
}

export const GRADE_THREE_TAXONOMY = {
  'Number & Operations': ['Multiplication, Division & Fractions'],
  Algebra: ['Patterns, Multiplication & Unknowns'],
  Geometry: ['Shapes, Area & Perimeter'],
  Measurement: ['Units, Time, Area & Perimeter'],
  'Data Analysis': ['Data Representation & Interpretation'],
}

export const GRADE_THREE_CURRICULUM = {
  'Number System & Operations': {
    'Place Value & Number Sense': [],
    'Addition & Subtraction': [],
    Multiplication: [],
    Division: [],
    'Multiplication & Division Relationships': [],
    'Problem Solving': [],
    Fractions: ['Unit Fractions', 'Fractions as Numbers', 'Fractions Less Than/Equal to/Greater Than 1', 'Comparing Fractions'],
  },
  Algebra: {
    'Properties of Operations': [],
    'Multiplication & Division Relationships': [],
    'Unknown Numbers': [],
    'Number Patterns': [],
    'Arithmetic Patterns': [],
    'Problem Solving': [],
  },
  Geometry: {
    '2D Shapes': [],
    'Sides & Angles': [],
    'Shape Attributes': [],
    'Classifying Shapes': [],
    'Comparing Shapes': [],
    'Rectangular Arrays': [],
    'Area through Shapes': [],
  },
  Measurement: {
    Time: [],
    Length: [],
    'Liquid Volume': [],
    Mass: [],
    Area: [],
    Perimeter: [],
    'Measurement Problem Solving': [],
  },
  'Data Analysis': {
    'Collecting Data': [],
    'Organizing Data': [],
    Tables: [],
    Pictographs: [],
    'Reading Data': [],
    'Interpreting Data': [],
  },
}

export const GRADE_FIVE_CURRICULUM = {
  'Operations & Algebraic Thinking': {
    'Numerical Expressions': {
      'Write & Interpret Numerical Expressions': [
        'Parentheses, Brackets & Braces',
        'Evaluate Numerical Expressions',
        'Write Expressions from Verbal Statements',
        'Interpret Expressions Without Evaluating',
      ],
    },
    'Patterns & Relationships': {
      'Analyze Patterns and Relationships': [
        'Generate Numerical Patterns',
        'Pattern Rules',
        'Compare Corresponding Terms',
        'Ordered Pairs',
        'Graph Patterns on Coordinate Plane',
      ],
    },
  },
  'Number & Operations in Base Ten': {
    'Place Value System': [
      'Relationship Between Place Values',
      'Powers of 10',
      'Multiplying by Powers of 10',
      'Dividing by Powers of 10',
      'Read & Write Decimals to Thousandths',
      'Expanded Form of Decimals',
      'Compare Decimals to Thousandths',
      'Round Decimals',
    ],
    'Multi-Digit & Decimal Operations': [
      'Multi-Digit Multiplication',
      'Multi-Digit Division',
      'Decimal Addition',
      'Decimal Subtraction',
      'Decimal Multiplication',
      'Decimal Division',
    ],
  },
  'Number & Operations - Fractions': {
    'Fraction Addition & Subtraction': [
      'Equivalent Fractions',
      'Unlike Denominators',
      'Mixed Numbers',
      'Fraction Word Problems',
      'Estimate & Check Reasonableness',
    ],
    'Fraction Multiplication & Division': [
      'Fraction as Division',
      'Multiply Fraction by Whole Number',
      'Multiply Fraction by Fraction',
      'Fraction Scaling',
      'Fraction Multiplication Word Problems',
      'Divide Unit Fraction by Whole Number',
      'Divide Whole Number by Unit Fraction',
      'Fraction Division Word Problems',
    ],
  },
  'Measurement & Data': {
    'Measurement Unit Conversion': ['Convert Like Measurement Units'],
    'Data Representation & Interpretation': [
      'Line Plots',
      'Fraction Measurements on Line Plots',
      'Solve Problems Using Line Plot Data',
    ],
    Volume: [
      'Concept of Volume',
      'Unit Cubes',
      'Cubic Units',
      'Measure Volume by Counting Cubes',
      'Volume Using Multiplication',
      'Volume Using Addition',
      'Volume of Rectangular Prisms',
      'V = l x w x h',
      'V = b x h',
      'Volume of Composite Figures',
    ],
  },
  Geometry: {
    'Coordinate Plane': [
      'Coordinate System',
      'X-Axis & Y-Axis',
      'Origin',
      'Ordered Pairs',
      'Plot Points',
      'Interpret Coordinates in Real-World Problems',
    ],
    'Classify 2D Figures': [
      'Properties of 2D Figures',
      'Categories of Figures',
      'Subcategories',
      'Quadrilaterals',
      'Rectangles',
      'Squares',
    ],
  },
}

export const GRADE_SIX_CURRICULUM = {
  'Ratios and Proportional Relationships': {
    'Understand ratio concepts and use ratio reasoning to solve problems': [
      'Concept of a ratio and ratio language', 'Unit rate associated with a ratio',
      'Tables of equivalent ratios', 'Unit rate problems (pricing and constant speed)',
      'Percent as a rate per 100', 'Convert measurement units using ratios',
    ],
  },
  'The Number System': {
    'Apply and extend previous understandings of multiplication and division to divide fractions by fractions': [
      'Interpret and compute quotients of fractions', 'Word problems involving division of fractions',
    ],
    'Compute fluently with multi-digit numbers and find common factors and multiples': [
      'Fluently divide multi-digit numbers', 'Fluently operate with multi-digit decimals',
      'Greatest common factor (GCF)', 'Least common multiple (LCM)', 'Distributive property with common factors',
    ],
    'Apply and extend previous understandings of numbers to the system of rational numbers': [
      'Positive and negative numbers in real-world contexts', 'Opposite signs and opposites',
      'Signs of numbers in ordered pairs and quadrants', 'Ordering and absolute value of rational numbers',
      'Absolute value as distance from zero', 'Graphing points in four quadrants and finding distances',
    ],
  },
  'Expressions and Equations': {
    'Apply and extend previous understandings of arithmetic to algebraic expressions': [
      'Numerical expressions involving whole-number exponents', 'Write expressions that record operations',
      'Identify parts of an expression', 'Evaluate expressions at specific values (including formulas)',
      'Generate equivalent expressions using properties', 'Identify when two expressions are equivalent',
    ],
    'Reason about and solve one-variable equations and inequalities': [
      'Solve equations of the form x + p = q', 'Solve equations of the form px = q',
      'Write and represent inequalities x > c or x < c',
    ],
    'Represent and analyze quantitative relationships between dependent and independent variables': [
      'Write equations relating dependent and independent variables',
    ],
  },
  Geometry: {
    'Solve real-world and mathematical problems involving area, surface area, and volume': [
      'Area of triangles by composing/decomposing', 'Area of special quadrilaterals and parallelograms',
      'Volume of right rectangular prism with fractional edge lengths', 'Draw polygons in the coordinate plane and find side lengths',
      'Nets and surface area of three-dimensional figures', 'Area of polygons by composing into rectangles or decomposing into triangles',
    ],
  },
  'Statistics and Probability': {
    'Develop understanding of statistical variability': [
      'Recognize a statistical question', 'Data distribution described by center, spread, and shape',
      'Measures of center vs measures of variation',
    ],
    'Summarize and describe distributions': [
      'Display numerical data in plots (dot plots, histograms, box plots)',
      'Summarize numerical data sets (center and variability)',
    ],
  },
}

export const GRADE_SIX_DETAILED_CURRICULUM = {
  'Ratios & Proportional Relationships': {
    'Ratio Concepts & Language': [
      'Ratio Definition & Relationships',
      'Unit Rates & Rate Language',
    ],
    'Problem Solving with Ratios & Rates': [
      'Equivalent Ratio Tables',
      'Tape Diagrams & Double Number Lines',
      'Unit Pricing & Constant Speed Problems',
      'Percentages as Rates per 100',
      'Solving Whole & Part Problems',
      'Measurement Unit Conversion',
    ],
  },
  'The Number System': {
    'Fraction Division': [
      'Dividing Fractions by Fractions',
      'Visual Fraction Models',
      'Fraction Division Word Problems',
    ],
    'Multi-Digit Computation & Factors': [
      'Standard Algorithm Division',
      'Multi-Digit Decimal Operations',
      'Greatest Common Factor (GCF)',
      'Least Common Multiple (LCM)',
      'Distributive Property Factoring',
    ],
    'Rational Numbers & Coordinate Plane': [
      'Positive & Negative Real-World Contexts',
      'Number Line & Opposites',
      'Quadrants of the Coordinate Plane',
      'Point Reflections Across Axes',
      'Absolute Value',
      'Ordering & Comparing Rational Numbers',
    ],
  },
  'Expressions & Equations': {
    'Algebraic Expressions': [
      'Numerical Expressions with Exponents',
      'Writing & Evaluating Variable Expressions',
      'Expression Components',
      'Order of Operations (PEMDAS)',
      'Generating Equivalent Expressions',
    ],
    'One-Variable Equations & Inequalities': [
      'Solution Testing via Substitution',
      'One-Step Equations',
      'Writing Inequalities',
      'Graphing Inequalities on Number Lines',
    ],
    'Quantitative Relationships': [
      'Independent & Dependent Variables',
      'Equation Modeling',
      'Analyzing Variables via Graphs & Tables',
    ],
  },
  Geometry: {
    'Area, Surface Area & Volume': [
      'Area of Triangles & Polygons',
      'Decomposing Shapes into Rectangles',
      'Volume with Fractional Edge Lengths',
      'Polygons on the Coordinate Plane',
      '2D Nets of 3D Figures',
      'Surface Area of Prisms & Pyramids',
    ],
  },
  'Statistics & Probability': {
    'Statistical Variability': [
      'Identifying Statistical Questions',
        'Data Distribution (Center, Spread, Shape)',
      'Measures of Center (Mean, Median)',
      'Measures of Variability (IQR, MAD)',
    ],
    'Data Displays & Summaries': [
      'Dot Plots, Histograms & Box Plots',
      'Summarize Numerical Data Sets',
    ],
  },
}

export const GRADE_SEVEN_CURRICULUM = {
  'Number & Operations': {
    'The Number System': {
      'Add and Subtract Rational Numbers': [
        'Add rational numbers', 'Subtract rational numbers', 'Represent operations on number lines',
        'Opposite quantities', 'Additive inverses', 'Absolute value', 'Real-world rational number contexts',
      ],
      'Multiply and Divide Rational Numbers': [
        'Multiply rational numbers', 'Divide rational numbers', 'Rules for signed numbers',
        'Distributive property', 'Integer division', 'Rational number quotients',
      ],
      'Properties of Operations with Rational Numbers': [
        'Addition properties', 'Subtraction properties', 'Multiplication properties', 'Division properties',
      ],
      'Convert Rational Numbers to Decimals': [
        'Long division', 'Terminating decimals', 'Repeating decimals',
      ],
      'Apply Rational Numbers to Problems': [
        'Addition problems', 'Subtraction problems', 'Multiplication problems',
        'Division problems', 'Real-world rational number problems',
      ],
    },
  },
  Algebra: {
    'Expressions & Equations': {
      'Equivalent Expressions': [
        'Add linear expressions', 'Subtract linear expressions', 'Factor expressions',
        'Expand expressions', 'Properties of operations', 'Rewrite expressions',
      ],
      'Numerical and Algebraic Expressions': [
        'Positive rational numbers', 'Negative rational numbers', 'Fractions',
        'Decimals', 'Estimation', 'Reasonableness of answers',
      ],
      'Variables, Equations & Inequalities': [
        'Represent quantities with variables', 'Construct equations',
        'Construct inequalities', 'Reason about quantities',
      ],
      'Solve Linear Equations': [
        'px + q = r', 'p(x + q) = r', 'Multi-step equations',
        'Rational coefficients', 'Word problems', 'Arithmetic vs algebraic solutions',
      ],
      'Solve Linear Inequalities': [
        'px + q > r', 'px + q < r', 'Solve inequalities',
        'Graph solution sets', 'Interpret solutions in context',
      ],
    },
    'Ratios & Proportional Relationships': {
      'Unit Rates': [
        'Calculate unit rates', 'Ratios of fractions', 'Ratios of lengths',
        'Ratios of areas', 'Different measurement units',
      ],
      'Recognize Proportional Relationships': [
        'Equivalent ratios', 'Tables', 'Graphs', 'Coordinate plane',
        'Straight line through origin',
      ],
      'Constant of Proportionality': [
        'Tables', 'Graphs', 'Equations', 'Diagrams', 'Verbal descriptions',
      ],
      'Proportional Equations': [
        'Write proportional equations', 'Identify variables', 'Use unit rate', 'Interpret equations',
      ],
      'Interpret Proportional Graphs': [
        'Interpret points (x, y)', 'Interpret (0, 0)', 'Interpret (1, r)',
        'Interpret unit rate from graph',
      ],
      'Ratio and Percent Problems': [
        'Multi-step ratio problems', 'Percent problems', 'Simple interest', 'Tax',
        'Markups', 'Markdowns', 'Gratuities', 'Commissions', 'Fees',
        'Percent increase', 'Percent decrease', 'Percent error',
      ],
    },
  },
  Measurement: {
    'Geometric Measurement': {
      'Scale Drawings': [
        'Interpret scale', 'Calculate actual lengths', 'Calculate actual areas',
        'Create scale drawings', 'Reproduce drawings at different scales',
      ],
      'Circle Measurement': [
        'Area of circles', 'Circumference of circles',
        'Relationship between circumference and area',
      ],
      'Area, Surface Area & Volume': [
        'Area of triangles', 'Area of quadrilaterals', 'Area of polygons', 'Surface area',
        'Volume', 'Cubes', 'Right prisms', 'Composite 2D/3D objects',
      ],
    },
  },
  Geometry: {
    'Geometric Figures & Relationships': {
      'Scale Drawings': ['Solve problems involving geometric scale drawings'],
      'Construct Geometric Shapes': [
        'Construct triangles', 'Given three angle measures', 'Given three side measures',
        'Unique triangle', 'More than one triangle', 'No possible triangle',
      ],
      'Cross-Sections': [
        'Slice 3D figures', 'Plane sections', 'Rectangular prisms', 'Rectangular pyramids',
      ],
    },
    Angles: {
      'Angle Relationships': [
        'Complementary angles', 'Supplementary angles', 'Vertical angles', 'Adjacent angles',
      ],
      'Solve Unknown Angles': [
        'Write equations', 'Solve equations', 'Multi-step angle problems', 'Real-world angle problems',
      ],
    },
  },
  'Data Analysis': {
    'Statistics & Probability': {
      'Random Sampling': [
        'Population', 'Sample', 'Representative sample', 'Random sampling',
        'Draw population inferences', 'Sampling variation',
      ],
      'Compare Two Populations': [
        'Compare distributions', 'Visual overlap', 'Measures of center',
        'Measures of variability', 'Mean', 'Mean absolute deviation', 'Comparative inferences',
      ],
      Probability: [
        'Probability from 0 to 1', 'Likelihood', 'Unlikely events', 'Likely events',
        'Events with probability near 1/2',
      ],
      'Experimental Probability': [
        'Collect data', 'Chance processes', 'Long-run relative frequency', 'Predict relative frequency',
      ],
      'Probability Models': [
        'Develop probability models', 'Compare model vs observed frequency',
        'Uniform probability model', 'Non-uniform probability model', 'Explain discrepancies',
      ],
      'Compound Events': [
        'Compound probability', 'Sample spaces', 'Organized lists', 'Tables',
        'Tree diagrams', 'Identify outcomes', 'Simulations',
      ],
    },
  },
}

export const GRADE_EIGHT_CURRICULUM = {
  'Number & Operations': {
    'The Number System': {
      'Rational & Irrational Numbers': [
        'Rational numbers', 'Irrational numbers', 'Identify irrational numbers',
        'Decimal expansions of rational numbers', 'Terminating decimals',
        'Repeating decimals', 'Convert repeating decimals to rational numbers',
      ],
      'Approximate Irrational Numbers': [
        'Rational approximations', 'Approximate irrational numbers', 'Compare irrational numbers',
        'Locate irrational numbers on a number line', 'Estimate expressions involving irrational numbers',
        'Approximate square roots',
      ],
    },
  },
  Algebra: {
    'Expressions & Equations': {
      'Integer Exponents': [
        'Properties of integer exponents', 'Positive exponents', 'Negative exponents',
        'Generate equivalent expressions', 'Simplify exponential expressions',
      ],
      'Square Roots & Cube Roots': [
        'Square root symbol', 'Cube root symbol', 'Solve x² = p', 'Solve x³ = p',
        'Perfect square roots', 'Perfect cube roots', '√2 as an irrational number',
      ],
      'Scientific Notation': [
        'Very large quantities', 'Very small quantities', 'Powers of 10',
        'Compare quantities in scientific notation', 'Convert decimal notation to scientific notation',
        'Convert scientific notation to decimal notation', 'Operations with scientific notation',
        'Select appropriate measurement units', 'Interpret technology-generated scientific notation',
      ],
      'Proportional Relationships, Lines & Linear Equations': [
        'Graph proportional relationships', 'Unit rate as slope', 'Compare proportional relationships',
        'Slope between two points', 'Similar triangles and slope', 'Equation y = mx', 'Equation y = mx + b',
      ],
      'Linear Equations in One Variable': [
        'Solve linear equations', 'One solution', 'Infinitely many solutions', 'No solution',
        'Transform equations', 'Rational coefficients', 'Distributive property', 'Combine like terms',
      ],
      'Systems of Linear Equations': [
        'Two linear equations', 'Two variables', 'Intersection of graphs', 'Algebraic solution',
        'Graphical solution', 'Solve by inspection', 'One solution', 'No solution',
        'Infinite solutions', 'Real-world system problems',
      ],
    },
    Functions: {
      'Understanding Functions': [
        'Definition of a function', 'Input', 'Output', 'Function rules', 'Ordered pairs', 'Function graphs',
      ],
      'Compare Functions': [
        'Algebraic representation', 'Graphical representation', 'Tables', 'Verbal descriptions',
        'Compare rates of change',
      ],
      'Linear Functions': [
        'y = mx + b', 'Slope', 'Y-intercept', 'Straight-line graphs', 'Nonlinear functions',
      ],
      'Model Linear Relationships': [
        'Construct linear functions', 'Rate of change', 'Initial value', 'Use two points',
        'Use tables', 'Use graphs', 'Interpret functions in context',
      ],
      'Analyze Graphs': [
        'Increasing functions', 'Decreasing functions', 'Linear relationships',
        'Nonlinear relationships', 'Sketch graphs from descriptions',
      ],
    },
  },
  Measurement: {
    'Volume & Measurement': {
      'Volume of 3D Objects': [
        'Volume of cylinders', 'Volume of cones', 'Volume of spheres',
        'Apply volume formulas', 'Real-world volume problems',
      ],
    },
  },
  Geometry: {
    'Congruence & Transformations': {
      Rotations: ['Rotate figures', 'Effects of rotations'],
      Reflections: ['Reflect figures', 'Effects of reflections'],
      Translations: ['Translate figures', 'Effects of translations'],
      'Congruent Figures': ['Definition of congruence', 'Sequence of transformations', 'Prove/describe congruence'],
      'Dilations & Similarity': [
        'Dilations', 'Similar figures', 'Coordinate transformations', 'Scale factors',
        'Sequence of transformations',
      ],
    },
    'Angles & Similarity': {
      'Triangle Angle Relationships': ['Interior angle sum', 'Exterior angles', 'Angle relationships'],
      'Parallel Lines & Transversals': ['Angles formed by parallel lines', 'Transversals', 'Angle relationships'],
      'Triangle Similarity': ['Similar triangles', 'Angle-angle criterion', 'Informal proof of similarity'],
    },
    'Pythagorean Theorem': {
      'Pythagorean Theorem': ['Pythagorean Theorem', 'Proof of the theorem', 'Converse of the theorem', 'Right triangles'],
      'Apply Pythagorean Theorem': ['Find unknown side lengths', 'Real-world problems', 'Two-dimensional problems'],
      'Distance in Coordinate Plane': ['Distance between two points', 'Coordinate system', 'Apply Pythagorean Theorem to coordinates'],
    },
  },
  'Data Analysis': {
    'Statistics & Probability': {
      'Bivariate Data': {
        'Scatter Plots': [
          'Construct scatter plots', 'Interpret scatter plots', 'Clusters', 'Outliers',
          'Positive association', 'Negative association', 'Linear association', 'Nonlinear association',
        ],
        'Linear Models': [
          'Fit a straight line', 'Estimate line of best fit', 'Assess model fit',
          'Interpret slope', 'Interpret intercept', 'Solve contextual problems',
        ],
        'Two-Way Tables': [
          'Categorical data', 'Frequency tables', 'Relative frequency', 'Construct two-way tables',
          'Interpret two-way tables', 'Row relative frequencies', 'Column relative frequencies',
          'Identify possible associations',
        ],
      },
    },
  },
}