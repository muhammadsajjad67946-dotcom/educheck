/**
 * Curriculum Prerequisite Knowledge Graph & Learning Progression
 * 
 * Maps mathematical dependencies across 5 Core Domains for Grades 1–8:
 * - Number & Operations
 * - Algebra
 * - Geometry
 * - Measurement
 * - Data Analysis
 * 
 * Implements:
 * 1. Upward Inferred Mastery: Correct answers prove foundational prerequisites.
 * 2. Downward Diagnostic Isolation: Wrong answers isolate immediate root weakness without blind Grade 1 failure.
 */

export const DOMAIN_PROGRESSIONS = {
  'Number & Operations': [
    {
      grade: 1,
      skills: ['Counting & Number Representation', 'Place Value - Tens & Ones', 'Mental Math - 10 More & 10 Less'],
      prereqs: [],
    },
    {
      grade: 2,
      skills: ['Place Value Addition & Subtraction', 'Equal Groups & Rectangular Arrays', 'Mental Addition & Subtraction'],
      prereqs: ['Counting & Number Representation', 'Place Value - Tens & Ones'],
    },
    {
      grade: 3,
      skills: ['Multiplication, Division & Fractions', 'Basic Arithmetic & Problem Solving', 'Fractions'],
      prereqs: ['Place Value Addition & Subtraction', 'Equal Groups & Rectangular Arrays'],
    },
    {
      grade: 4,
      skills: ['Multi-Digit Computation', 'Fraction Addition & Subtraction', 'Factors & Multiples'],
      prereqs: ['Multiplication, Division & Fractions', 'Basic Arithmetic & Problem Solving'],
    },
    {
      grade: 5,
      skills: ['Multi-Digit & Decimal Operations', 'Fraction Multiplication & Division', 'Place Value System'],
      prereqs: ['Multi-Digit Computation', 'Fraction Addition & Subtraction'],
    },
    {
      grade: 6,
      skills: ['Factors & Multiples (LCM/HCF)', 'Fraction Division', 'Rational Numbers'],
      prereqs: ['Multi-Digit & Decimal Operations', 'Fraction Multiplication & Division'],
    },
    {
      grade: 7,
      skills: ['Integers', 'Percentages', 'Rational Numbers Operations'],
      prereqs: ['Factors & Multiples (LCM/HCF)', 'Fraction Division'],
    },
    {
      grade: 8,
      skills: ['Square Roots', 'Cube Roots', 'Integer Exponents & Radicals', 'Scientific Notation'],
      prereqs: ['Integers', 'Percentages', 'Rational Numbers Operations'],
    },
  ],

  'Algebra': [
    {
      grade: 1,
      skills: ['Equations & Unknowns', 'Addition & Subtraction Strategies', 'Properties & Relationships'],
      prereqs: [],
    },
    {
      grade: 2,
      skills: ['Addition & Subtraction Word Problems', 'Arrays & Repeated Addition', 'Odd & Even Numbers'],
      prereqs: ['Equations & Unknowns', 'Addition & Subtraction Strategies'],
    },
    {
      grade: 3,
      skills: ['Patterns, Multiplication & Unknowns', 'Properties of Multiplication', 'Two-Step Word Problems'],
      prereqs: ['Addition & Subtraction Word Problems', 'Arrays & Repeated Addition'],
    },
    {
      grade: 4,
      skills: ['Number Patterns', 'Unknowns', 'Relationships'],
      prereqs: ['Patterns, Multiplication & Unknowns', 'Two-Step Word Problems'],
    },
    {
      grade: 5,
      skills: ['Numerical Expressions', 'Patterns & Relationships', 'Order of Operations'],
      prereqs: ['Number Patterns', 'Unknowns'],
    },
    {
      grade: 6,
      skills: ['Algebraic Expressions', 'One-Variable Equations', 'Inequalities', 'Dependent & Independent Variables'],
      prereqs: ['Numerical Expressions', 'Patterns & Relationships'],
    },
    {
      grade: 7,
      skills: ['Linear Equations', 'Two-Variable Equations', 'Multi-Step Equations', 'Word Problems & Applications'],
      prereqs: ['Algebraic Expressions', 'One-Variable Equations'],
    },
    {
      grade: 8,
      skills: ['Systems of Linear Equations', 'Slope-Intercept Form', 'Functions & Linear Models', 'Proportional Relationships & Linear Equations'],
      prereqs: ['Linear Equations', 'Two-Variable Equations', 'Multi-Step Equations'],
    },
  ],

  'Geometry': [
    {
      grade: 1,
      skills: ['2D & 3D Shapes', 'Shape Attributes', 'Composing Shapes', 'Halves & Fourths'],
      prereqs: [],
    },
    {
      grade: 2,
      skills: ['Equal Rows & Columns', 'Fractions of Shapes', 'Shape Identification'],
      prereqs: ['2D & 3D Shapes', 'Shape Attributes'],
    },
    {
      grade: 3,
      skills: ['Equal Areas & Unit Fractions', 'Partitioning Shapes', 'Quadrilaterals', 'Squares, Rectangles & Rhombuses'],
      prereqs: ['Equal Rows & Columns', 'Fractions of Shapes'],
    },
    {
      grade: 4,
      skills: ['Angles', 'Classifying Shapes', 'Lines & Line Segments', 'Parallel', 'Symmetry'],
      prereqs: ['Quadrilaterals', 'Partitioning Shapes'],
    },
    {
      grade: 5,
      skills: ['Coordinate Plane', 'Graphing Points', 'Hierarchy of Shape', 'Shape Classification'],
      prereqs: ['Angles', 'Classifying Shapes', 'Lines & Line Segments'],
    },
    {
      grade: 6,
      skills: ['Area of Polygons', 'Area of Quadrilaterals', 'Area of Triangles', 'Surface Area', 'Volume of Rectangular Prisms'],
      prereqs: ['Coordinate Plane', 'Graphing Points'],
    },
    {
      grade: 7,
      skills: ['Scale Drawings', 'Triangle Construction', 'Angles & Parallel Lines'],
      prereqs: ['Area of Polygons', 'Area of Triangles'],
    },
    {
      grade: 8,
      skills: ['Pythagorean Theorem', 'Similarity & Dilations', 'Transformations', 'Volume of Cylinders, Cones & Spheres'],
      prereqs: ['Scale Drawings', 'Triangle Construction', 'Angles & Parallel Lines'],
    },
  ],

  'Measurement': [
    {
      grade: 1,
      skills: ['Length Comparison', 'Measuring Length with Units', 'Time'],
      prereqs: [],
    },
    {
      grade: 2,
      skills: ['Comparing Lengths', 'Estimating Length', 'Measuring Length', 'Money'],
      prereqs: ['Length Comparison', 'Measuring Length with Units'],
    },
    {
      grade: 3,
      skills: ['Area Concepts & Unit Squares', 'Area of Rectangles', 'Decomposing Area', 'Perimeter', 'Mass & Liquid Volume'],
      prereqs: ['Comparing Lengths', 'Measuring Length'],
    },
    {
      grade: 4,
      skills: ['Angle Concepts', 'Measuring Angles', 'Rectangle Area & Perimeter', 'Measurement Unit Conversion', 'Unknown Angles'],
      prereqs: ['Area Concepts & Unit Squares', 'Area of Rectangles', 'Perimeter'],
    },
    {
      grade: 5,
      skills: ['Volume Concepts', 'Volume of Rectangular Prisms', 'Composite Volume', 'Unit Cubes'],
      prereqs: ['Rectangle Area & Perimeter', 'Measurement Unit Conversion'],
    },
    {
      grade: 6,
      skills: ['Area of Triangles', 'Area of Polygons', 'Surface Area', 'Volume of Composite Figures'],
      prereqs: ['Rectangle Area & Perimeter', 'Decomposing Area', 'Volume Concepts', 'Volume of Rectangular Prisms'],
    },
    {
      grade: 7,
      skills: ['Circumference', 'Area of Circles', 'Area of Composite Figures', 'Cross-Sections'],
      prereqs: ['Area of Triangles', 'Area of Polygons'],
    },
    {
      grade: 8,
      skills: ['Volume of Cylinders', 'Volume of Cones', 'Volume of Spheres', 'Composite 3D Figures', 'Real-World Volume Applications'],
      prereqs: ['Circumference', 'Area of Circles', 'Area of Composite Figures'],
    },
  ],

  'Data Analysis': [
    {
      grade: 1,
      skills: ['Categories', 'Picture Graphs', 'Simple Data Questions', 'Sorting & Categorizing Data'],
      prereqs: [],
    },
    {
      grade: 2,
      skills: ['Choosing Graphs', 'Comparing Data', 'Line Plots', 'Picture & Bar Graphs'],
      prereqs: ['Categories', 'Picture Graphs'],
    },
    {
      grade: 3,
      skills: ['Scaled Bar Graphs', 'Frequency', 'Interpreting Data', 'Measurement Data'],
      prereqs: ['Choosing Graphs', 'Picture & Bar Graphs'],
    },
    {
      grade: 4,
      skills: ['Collecting Data', 'Data Distribution', 'Data Patterns', 'Fraction Line Plots'],
      prereqs: ['Scaled Bar Graphs', 'Interpreting Data'],
    },
    {
      grade: 5,
      skills: ['Coordinate Data', 'Ordered Pairs', 'Data Tables', 'Data Representation'],
      prereqs: ['Collecting Data', 'Data Distribution'],
    },
    {
      grade: 6,
      skills: ['Dot Plots', 'Mean', 'Median', 'Measures of Center', 'Range', 'Variability', 'Statistical Questions'],
      prereqs: ['Coordinate Data', 'Ordered Pairs'],
    },
    {
      grade: 7,
      skills: ['Probability', 'Compound Probability', 'Sample Space', 'Random Sampling', 'Comparing Distributions'],
      prereqs: ['Dot Plots', 'Measures of Center'],
    },
    {
      grade: 8,
      skills: ['Scatter Plots', 'Linear Models', 'Two-Way Tables', 'Association & Clusters', 'Initial Value & Slope'],
      prereqs: ['Coordinate Data', 'Probability', 'Comparing Distributions'],
    },
  ],
}

export const DIAGNOSTIC_BRANCH_PREREQUISITES = {
  // Number & Operations - Decimal & Multi-Digit Progression Tree
  'number & operations:multi-digit & decimal operations': [
    'place value & powers of 10',
    'decimals',
    'decimals to thousandths',
    'rounding decimals',
    'place value system',
    'place value & 10x relationships',
    'multi-digit computation',
    'multi-digit multiplication',
    'multi-digit division & remainders',
    'multi-digit addition & subtraction',
    'multi-digit representation & expanded form',
    'addition using place value',
    '3-digit addition & subtraction',
    'place value addition & subtraction',
    'place value',
    'understand place value - tens & ones',
    'counting & number representation',
  ],
  'number & operations:decimals': [
    'place value & powers of 10',
    'rounding decimals',
    'place value system',
    'addition using place value',
    'place value addition & subtraction',
    'place value',
  ],
  'number & operations:rounding decimals': [
    'place value & powers of 10',
    'rounding multi-digit numbers',
    'place value system',
    'place value',
  ],
  'number & operations:place value & powers of 10': [
    'place value system',
    'place value & 10x relationships',
    'multiply by multiples of ten',
    'place value',
    'understand place value - tens & ones',
  ],
  'number & operations:multi-digit multiplication': [
    'multiplication & division operations',
    'properties of multiplication',
    'multiplication, division & fractions',
    'equal groups & rectangular arrays',
    'addition using place value',
  ],

  // Number & Operations - Fraction Progression Tree (Strict 1-Way Dependency: Mult -> Div)
  'number & operations:fraction multiplication & division': [
    'fraction addition & subtraction',
    'fractions',
    'comparing fractions',
    'equivalent fractions & whole numbers',
    'fractions on a number line',
    'understanding fractions as equal parts',
    'equal areas & unit fractions',
    'fractions of shapes',
  ],
  'number & operations:fraction division': [
    'fraction multiplication & division',
    'fraction addition & subtraction',
    'fractions',
    'comparing fractions',
    'equivalent fractions & whole numbers',
  ],
  'number & operations:fraction addition & subtraction': [
    'fractions',
    'comparing fractions',
    'equivalent fractions & whole numbers',
    'fractions on a number line',
    'understanding fractions as equal parts',
  ],

  // Number & Operations - Exponents & Radicals Tree
  'number & operations:square roots': [
    'integer exponents & radicals',
    'factors & multiples (lcm/hcf)',
    'multiplication & division operations',
  ],
  'number & operations:integer exponents & radicals': [
    'integers',
    'multiplication, division & fractions',
    'factors & multiples',
  ],
  'number & operations:rational numbers operations': [
    'integers',
    'rational numbers',
    'multi-digit & decimal operations',
    'fraction multiplication & division',
  ],

  // Algebra Progression Tree
  'algebra:systems of linear equations': [
    'linear equations',
    'slope-intercept form',
    'two-variable equations',
    'multi-step equations',
    'one-variable equations',
    'algebraic expressions',
    'numerical expressions',
    'order of operations',
  ],
  'algebra:linear equations': [
    'one-variable equations',
    'multi-step equations',
    'algebraic expressions',
    'inequalities',
    'numerical expressions',
    'order of operations',
    'two-step word problems',
  ],
  'algebra:algebraic expressions': [
    'numerical expressions',
    'order of operations',
    'number patterns',
    'unknowns',
    'two-step word problems',
  ],

  // Geometry Progression Tree
  'geometry:pythagorean theorem': [
    'square roots',
    'squares, rectangles & rhombuses',
    'area of triangles',
    'triangle construction',
    'area of rectangles',
  ],
  'geometry:volume of cylinders, cones & spheres': [
    'area of circles',
    'circumference',
    'volume of rectangular prisms',
    'volume concepts',
    'composite volume',
    'unit cubes',
  ],
  'geometry:area of composite figures': [
    'area of polygons',
    'area of triangles',
    'area of quadrilaterals',
    'rectangle area & perimeter',
    'area of rectangles',
    'area concepts & unit squares',
    'perimeter',
  ],
  'geometry:area of polygons': [
    'area of triangles',
    'area of quadrilaterals',
    'coordinate plane',
    'graphing points',
    'quadrilaterals',
    'squares, rectangles & rhombuses',
  ],
  'geometry:area of triangles': [
    'coordinate plane',
    'graphing points',
    'quadrilaterals',
    'squares, rectangles & rhombuses',
  ],
  'geometry:surface area': [
    'area of polygons',
    'area of quadrilaterals',
    'coordinate plane',
    'graphing points',
  ],

  // Measurement Progression Tree
  'measurement:area of triangles': [
    'rectangle area & perimeter',
    'area of rectangles',
    'decomposing area',
    'area concepts & unit squares',
    'perimeter',
  ],
  'measurement:area of polygons': [
    'rectangle area & perimeter',
    'area of rectangles',
    'decomposing area',
    'area concepts & unit squares',
    'perimeter',
  ],
  'measurement:surface area': [
    'area of rectangles',
    'rectangle area & perimeter',
    'area of triangles',
    'area of polygons',
    'volume of rectangular prisms',
    'volume concepts',
  ],
  'measurement:volume of composite figures': [
    'composite volume',
    'volume of rectangular prisms',
    'volume concepts',
    'unit cubes',
  ],
  'measurement:real-world volume applications': [
    'measurement unit conversion',
    'volume concepts',
    'volume of rectangular prisms',
    'measurement word problems',
    'mass & liquid volume',
  ],
  'measurement:scale & measurement applications': [
    'scale drawings',
    'measurement unit conversion',
    'measuring length',
    'length word problems',
  ],

  // Data Analysis Progression Tree
  'data analysis:scatter plots': [
    'coordinate data',
    'ordered pairs',
    'line plots',
    'dot plots',
    'scaled bar graphs',
    'data tables',
  ],
  'data analysis:two-way tables': [
    'data tables',
    'data representation',
    'scaled bar graphs',
    'categories',
  ],
  'data analysis:compound probability': [
    'probability',
    'sample space',
    'probability models',
    'comparing data',
  ],
  'data analysis:measures of center': [
    'mean',
    'median',
    'range',
    'dot plots',
    'data distribution',
    'data tables',
  ],
}

/**
 * Normalizes strand names to match the 5 standard keys
 */
export function normalizeStrand(rawStrand) {
  const s = String(rawStrand || '').toLowerCase()
  if (s.includes('number') || s.includes('operat') || s.includes('arithmetic')) return 'Number & Operations'
  if (s.includes('algebra') || s.includes('pattern') || s.includes('equation')) return 'Algebra'
  if (s.includes('geom') || s.includes('shape')) return 'Geometry'
  if (s.includes('measur') || s.includes('volume') || s.includes('area') || s.includes('length')) return 'Measurement'
  if (s.includes('data') || s.includes('stat') || s.includes('prob') || s.includes('graph')) return 'Data Analysis'
  return 'Number & Operations'
}

/**
 * Safely tests whether candidateSubtopic matches targetSubtopic using exact or word-boundary token matching.
 * Prevents loose substring false-positives (e.g., 'area' matching 'area of triangles').
 */
export function matchSubtopic(a, b) {
  if (!a || !b) return false
  const s1 = String(a).toLowerCase().trim()
  const s2 = String(b).toLowerCase().trim()
  if (s1 === s2) return true

  // Escape special regex characters
  const escapeRegex = (str) => str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

  // Check whole-phrase match with word boundaries
  const r1 = new RegExp(`(^|\\b)${escapeRegex(s1)}(\\b|$)`, 'i')
  const r2 = new RegExp(`(^|\\b)${escapeRegex(s2)}(\\b|$)`, 'i')

  const minLength = Math.min(s1.length, s2.length)
  const maxLength = Math.max(s1.length, s2.length)
  // Short tokens (like "area", "data", "unit") should never match distinct composite topics
  if (minLength < 4) return false

  // Allow match if one is a major word-bounded substring of the other (at least 70% of total length)
  if (r1.test(s2) && s1.length >= maxLength * 0.7) return true
  if (r2.test(s1) && s2.length >= maxLength * 0.7) return true

  return false
}

/**
 * Matches a branch key against a subtopic name, verifying both the strand prefix and subtopic token match.
 */
export function matchBranchKey(branchKey, subtopicName, rawStrand) {
  if (!branchKey || !subtopicName) return false
  const normTargetStrand = normalizeStrand(rawStrand).toLowerCase()
  const parts = branchKey.split(':')
  if (parts.length > 1) {
    const keyStrand = parts[0].trim().toLowerCase()
    if (keyStrand !== normTargetStrand) return false
    const keySubtopic = parts.slice(1).join(':').trim()
    return matchSubtopic(keySubtopic, subtopicName)
  }
  return matchSubtopic(branchKey, subtopicName)
}

/**
 * Checks whether candidateSubtopic is a subordinate prerequisite of masteredSubtopic.
 * (ADAM Topic Skipping Rule: If masteredSubtopic is correct, candidateSubtopic is bypassed).
 */
export function isPrerequisiteOf(candidateSubtopic, masteredSubtopic, rawStrand = 'Number & Operations') {
  if (!candidateSubtopic || !masteredSubtopic) return false
  const cNorm = String(candidateSubtopic).toLowerCase().trim()
  const mNorm = String(masteredSubtopic).toLowerCase().trim()
  if (cNorm === mNorm) return false

  const strandKey = normalizeStrand(rawStrand)

  // 1. Direct match in strand-scoped diagnostic branch tree
  for (const [branchKey, prereqs] of Object.entries(DIAGNOSTIC_BRANCH_PREREQUISITES)) {
    if (matchBranchKey(branchKey, mNorm, strandKey)) {
      if (prereqs.some((p) => matchSubtopic(p, cNorm))) {
        return true
      }
    }
  }

  // 2. Conceptual family check
  const isDecimalOrMultFamily = (s) => /decimal|place value|multi-digit|powers of 10|rounding|addition using place value/i.test(s)
  const isFractionFamily = (s) => /fraction/i.test(s)
  const isAlgebraFamily = (s) => /equation|expression|variable|unknown|pattern|slope/i.test(s)
  const isGeometryAreaFamily = (s) => /area|perimeter|polygon|rectangle|triangle|circle|circumference/i.test(s)
  const isGeometryVolumeFamily = (s) => /volume|prism|cube|cylinder|cone|sphere/i.test(s)

  const progression = DOMAIN_PROGRESSIONS[strandKey] || []

  let masteredGrade = -1
  let candidateGrade = -1

  for (const step of progression) {
    if (step.skills.some((sk) => matchSubtopic(sk, mNorm))) {
      if (masteredGrade === -1 || step.grade > masteredGrade) masteredGrade = step.grade
    }
    if (step.skills.some((sk) => matchSubtopic(sk, cNorm))) {
      if (candidateGrade === -1 || step.grade < candidateGrade) candidateGrade = step.grade
    }
  }

  if (masteredGrade > 0 && candidateGrade > 0 && candidateGrade < masteredGrade) {
    // Prevent 2D Area and 3D Volume from cross-pollinating unless bridged by surface area
    if (isGeometryAreaFamily(mNorm) && isGeometryVolumeFamily(cNorm) && !mNorm.includes('surface')) return false
    if (isGeometryVolumeFamily(mNorm) && isGeometryAreaFamily(cNorm) && !mNorm.includes('surface')) return false

    if (isDecimalOrMultFamily(mNorm) && isDecimalOrMultFamily(cNorm)) return true
    if (isFractionFamily(mNorm) && isFractionFamily(cNorm)) return true
    if (isAlgebraFamily(mNorm) && isAlgebraFamily(cNorm)) return true
    if (isGeometryAreaFamily(mNorm) && isGeometryAreaFamily(cNorm)) return true
    if (isGeometryVolumeFamily(mNorm) && isGeometryVolumeFamily(cNorm)) return true

    const currentStep = progression.find((step) => step.grade === masteredGrade)
    if (currentStep && currentStep.prereqs.some((pr) => matchSubtopic(pr, cNorm))) {
      return true
    }
  }

  return false
}

/**
 * Returns all subordinate prerequisite subtopic names for a given mastered subtopic.
 */
export function getPrerequisiteSubtopicNames(masteredSubtopic, rawStrand = 'Number & Operations') {
  if (!masteredSubtopic) return []
  const mNorm = String(masteredSubtopic).toLowerCase().trim()
  const strandKey = normalizeStrand(rawStrand)
  const results = new Set()

  for (const [branchKey, prereqs] of Object.entries(DIAGNOSTIC_BRANCH_PREREQUISITES)) {
    if (matchBranchKey(branchKey, mNorm, strandKey)) {
      prereqs.forEach((p) => results.add(p))
    }
  }

  const progression = DOMAIN_PROGRESSIONS[strandKey] || []
  let foundGrade = -1
  for (const step of progression) {
    if (step.skills.some((sk) => matchSubtopic(sk, mNorm))) {
      foundGrade = step.grade
      break
    }
  }

  if (foundGrade > 1) {
    progression.forEach((step) => {
      if (step.grade < foundGrade) {
        step.skills.forEach((skill) => results.add(skill))
      }
    })
  }

  return [...results]
}

/**
 * Returns foundational subtopics that are INFERRED MASTERED when a higher grade question is correct.
 */
export function getInferredPrerequisites(subtopicName, rawStrand, targetGrade = 8) {
  const strandKey = normalizeStrand(rawStrand)
  const progression = DOMAIN_PROGRESSIONS[strandKey] || []
  const normSub = String(subtopicName || '').toLowerCase()

  // Find the grade level of this subtopic
  let foundGrade = Number(targetGrade) || 8
  for (const step of progression) {
    if (step.skills.some((sk) => matchSubtopic(sk, normSub))) {
      foundGrade = step.grade
      break
    }
  }

  const inferred = []
  const seenSkills = new Set()

  // 1. Collect from explicit strand-scoped branch prerequisites
  for (const [branchKey, prereqs] of Object.entries(DIAGNOSTIC_BRANCH_PREREQUISITES)) {
    if (matchBranchKey(branchKey, normSub, strandKey)) {
      prereqs.forEach((p) => {
        if (!seenSkills.has(p.toLowerCase())) {
          seenSkills.add(p.toLowerCase())
          inferred.push({
            subtopicName: p,
            grade: Math.max(1, foundGrade - 1),
            strand: strandKey,
            isInferred: true,
          })
        }
      })
    }
  }

  // 2. Collect all foundational skills strictly below this grade
  progression.forEach((step) => {
    if (step.grade < foundGrade) {
      step.skills.forEach((skill) => {
        if (!seenSkills.has(skill.toLowerCase())) {
          seenSkills.add(skill.toLowerCase())
          inferred.push({
            subtopicName: skill,
            grade: step.grade,
            strand: strandKey,
            isInferred: true,
          })
        }
      })
    }
  })

  return inferred
}

/**
 * Returns the exact isolated root weakness when a question is wrong.
 * Avoids blind Grade 1 drop; pinpoints immediate prerequisite grade dynamically from the DAG graph.
 */
export function getDiagnosedPrerequisiteGap(subtopicName, rawStrand, testedGrade = 8, dbPrereqGrade = null, distractorDiagnostic = null) {
  const strandKey = normalizeStrand(rawStrand)
  const progression = DOMAIN_PROGRESSIONS[strandKey] || []
  const currentGrade = Number(testedGrade) || 8
  const normSub = String(subtopicName || '').toLowerCase()

  // 1. Find the current progression step for the tested grade or skill
  let currentStep = progression.find((step) => step.grade === currentGrade)
  if (!currentStep) {
    currentStep = progression.find((step) =>
      step.skills.some((sk) => matchSubtopic(sk, normSub))
    )
  }

  // 2. Collect candidate prerequisites:
  // First priority: strand-scoped DIAGNOSTIC_BRANCH_PREREQUISITES
  let candidatePrereqs = []
  for (const [branchKey, prereqs] of Object.entries(DIAGNOSTIC_BRANCH_PREREQUISITES)) {
    if (matchBranchKey(branchKey, normSub, strandKey)) {
      candidatePrereqs = prereqs
      break
    }
  }

  // Second priority: current step's prereqs in DOMAIN_PROGRESSIONS
  if (candidatePrereqs.length === 0 && currentStep && Array.isArray(currentStep.prereqs)) {
    candidatePrereqs = currentStep.prereqs
  }

  const isAreaFamily = (s) => /area|perimeter|polygon|rectangle|triangle|circle|circumference/i.test(s)
  const isVolumeFamily = (s) => /volume|prism|cube|cylinder|cone|sphere/i.test(s)
  const isFractionFamily = (s) => /fraction/i.test(s)
  const isDecimalOrMultFamily = (s) => /decimal|place value|multi-digit|powers of 10|rounding|addition using place value/i.test(s)
  const isAlgebraFamily = (s) => /equation|expression|variable|unknown|pattern|slope|linear/i.test(s)
  const isDataFamily = (s) => /data|plot|graph|table|probability|statistic|mean|median|scatter/i.test(s)

  const getFamily = (s) => {
    if (isVolumeFamily(s)) return 'volume'
    if (isAreaFamily(s)) return 'area'
    if (isFractionFamily(s)) return 'fraction'
    if (isDecimalOrMultFamily(s)) return 'decimal_mult'
    if (isAlgebraFamily(s)) return 'algebra'
    if (isDataFamily(s)) return 'data'
    return null
  }

  // 3. Generic DAG Derivation:
  // Find which grade step in DOMAIN_PROGRESSIONS[strandKey] defines the candidate prerequisite skill
  let matchedRootGrade = null
  let matchedRootSkill = null

  if (candidatePrereqs.length > 0) {
    for (const prereqName of candidatePrereqs) {
      for (let i = progression.length - 1; i >= 0; i--) {
        const step = progression[i]
        if (step.grade < currentGrade) {
          const found = step.skills.find((sk) => matchSubtopic(sk, prereqName))
          if (found) {
            matchedRootGrade = step.grade
            matchedRootSkill = found
            break
          }
        }
      }
      if (matchedRootGrade !== null) break
    }
  }

  // 4. Resolve rootGrade:
  // Prefer explicit dbPrereqGrade if valid, else dynamically matched grade, else N-1 (max drop 2 grades)
  let rootGrade = dbPrereqGrade
    ? Number(dbPrereqGrade)
    : (matchedRootGrade !== null ? matchedRootGrade : Math.max(1, currentGrade - 1))

  if (rootGrade > currentGrade) rootGrade = currentGrade
  if (rootGrade < Math.max(1, currentGrade - 2)) rootGrade = Math.max(1, currentGrade - 2)

  // 5. Resolve rootSkill with intelligent conceptual fallback and consistency synchronization:
  let rootSkill = matchedRootSkill

  if (!rootSkill || matchedRootGrade !== rootGrade) {
    const rootStep = progression.find((step) => step.grade === rootGrade)
    let resolvedClampedSkill = null

    if (rootStep) {
      // a) Check if the clamped grade contains a skill directly in candidatePrereqs
      resolvedClampedSkill = rootStep.skills.find((sk) =>
        candidatePrereqs.some((cp) => matchSubtopic(sk, cp))
      )

      // b) Check if the clamped grade contains a skill in the same conceptual family
      if (!resolvedClampedSkill) {
        const targetFamily = getFamily(normSub) || getFamily(matchedRootSkill)
        if (targetFamily) {
          resolvedClampedSkill = rootStep.skills.find((sk) => getFamily(sk) === targetFamily)
        }
      }
    }

    if (resolvedClampedSkill) {
      rootSkill = resolvedClampedSkill
    } else if (matchedRootSkill) {
      // Consistency-Fix: When clamped grade has no related concept, preserve high-fidelity matchedRootSkill
      // AND synchronize rootGrade to matchedRootGrade so grade & skill are 100% consistent!
      rootSkill = matchedRootSkill
      if (matchedRootGrade !== null) {
        rootGrade = matchedRootGrade
      }
    } else {
      rootSkill = rootStep ? rootStep.skills[0] : `Grade ${rootGrade} Foundation`
    }
  }

  // 6. Build clean recommendation
  let recommendation = `Review Grade ${rootGrade} ${rootSkill} to master this concept.`
  if (distractorDiagnostic?.remediation) {
    recommendation = distractorDiagnostic.remediation
  }

  return {
    rootGrade,
    rootSkill,
    recommendation,
    testedGrade: currentGrade,
    strand: strandKey,
  }
}

/**
 * Calculates a mathematically sound Domain Level Score for a strand
 */
export function calculateStrandDomainScore(rows, targetGrade = 8) {
  const baseTarget = Number(targetGrade) || 8
  const maxScore = Math.max(0.0, Number((baseTarget - 0.1).toFixed(1))) // E.g. 7.9 for Grade 8
  const floorGrade = Math.max(0.0, baseTarget - 1.0) // E.g. 7.0 for Grade 8

  if (!rows || rows.length === 0) return `Grade ${maxScore.toFixed(1)}`

  const total = rows.length
  const mastered = rows.filter((r) => r.isSuccess).length

  if (mastered === total) {
    return `Grade ${maxScore.toFixed(1)} (Mastered)`
  }

  const ratio = mastered / total
  let estimatedGE = 0
  if (ratio > 0) {
    estimatedGE = floorGrade + ratio * 0.9
  }
  estimatedGE = Math.min(maxScore, Math.max(0.0, estimatedGE))

  return `Grade ${estimatedGE.toFixed(1)}`
}

