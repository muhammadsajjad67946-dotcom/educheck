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
      prereqs: ['Volume Concepts', 'Volume of Rectangular Prisms'],
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
 * Returns foundational subtopics that are INFERRED MASTERED when a higher grade question is correct.
 */
export function getInferredPrerequisites(subtopicName, rawStrand, targetGrade = 8) {
  const strandKey = normalizeStrand(rawStrand)
  const progression = DOMAIN_PROGRESSIONS[strandKey] || []
  const normSub = String(subtopicName || '').toLowerCase()

  // Find the grade level of this subtopic
  let foundGrade = Number(targetGrade) || 8
  for (const step of progression) {
    if (step.skills.some((sk) => normSub.includes(sk.toLowerCase()) || sk.toLowerCase().includes(normSub))) {
      foundGrade = step.grade
      break
    }
  }

  // Collect all foundational skills strictly below this grade
  const inferred = []
  progression.forEach((step) => {
    if (step.grade < foundGrade) {
      step.skills.forEach((skill) => {
        inferred.push({
          subtopicName: skill,
          grade: step.grade,
          strand: strandKey,
          isInferred: true,
        })
      })
    }
  })

  return inferred
}

/**
 * Returns the exact isolated root weakness when a question is wrong.
 * Avoids blind Grade 1 drop; pinpoints immediate prerequisite grade (N-1 or N-2).
 */
export function getDiagnosedPrerequisiteGap(subtopicName, rawStrand, testedGrade = 8, dbPrereqGrade = null, distractorDiagnostic = null) {
  const strandKey = normalizeStrand(rawStrand)
  const progression = DOMAIN_PROGRESSIONS[strandKey] || []
  const currentGrade = Number(testedGrade) || 8
  const normSub = String(subtopicName || '').toLowerCase()

  // Find progression entry
  let matchedStepIndex = progression.findIndex((step) => step.grade === currentGrade)
  if (matchedStepIndex === -1) {
    matchedStepIndex = progression.findIndex((step) =>
      step.skills.some((sk) => normSub.includes(sk.toLowerCase()) || sk.toLowerCase().includes(normSub))
    )
  }

  // Determine root gap grade: prefer DB prereq if valid, else N-1 (max drop 2 grades)
  let rootGrade = dbPrereqGrade ? Number(dbPrereqGrade) : Math.max(1, currentGrade - 1)
  if (rootGrade > currentGrade) rootGrade = currentGrade
  if (rootGrade < Math.max(1, currentGrade - 2)) rootGrade = Math.max(1, currentGrade - 2)

  // Find the prerequisite skill at rootGrade
  const rootStep = progression.find((step) => step.grade === rootGrade)
  const rootSkill = rootStep ? rootStep.skills[0] : `Grade ${rootGrade} Foundation`

  // Build clean recommendation
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
  if (!rows || rows.length === 0) return `Grade ${targetGrade}.0`

  const total = rows.length
  const mastered = rows.filter((r) => r.isSuccess).length

  if (mastered === total) {
    return `Grade ${targetGrade}.0 (Mastered)`
  }

  // Calculate grade equivalent based on proportion of mastery
  // E.g. If target is 8 and 3/4 mastered => 8 - (1 - 3/4)*2 = 7.5
  const baseGrade = Number(targetGrade) || 8
  const ratio = mastered / total
  const estimatedGE = Math.max(1.0, baseGrade - (1 - ratio) * 2.0)

  return `Grade ${estimatedGE.toFixed(1)}`
}
