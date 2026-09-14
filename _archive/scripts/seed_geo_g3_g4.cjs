const mysql = require('mysql2/promise');
require('dotenv').config();

const g3Questions = [
  // Low (8)
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Quadrilaterals', subtopic_id: 275,
    question_text: 'Which attribute do ALL quadrilaterals share?',
    option_a: 'They all have exactly 4 straight sides and 4 angles', option_b: 'They all have 4 right angles', option_c: 'All 4 sides are equal in length', option_d: 'They all have at least one curved side',
    correct_answer: 'A',
    explanation: 'By definition, every quadrilateral is a 2D closed polygon with exactly 4 straight sides and 4 angles.',
    distractor_diagnostics: {
      B: { error: 'The student thought all quadrilaterals have right angles (confused with rectangles).', remediation: 'Only rectangles and squares must have right angles; trapezoids and rhombuses do not.' },
      C: { error: 'The student confused all quadrilaterals with squares or rhombuses.', remediation: 'Sides can have different lengths in a quadrilateral.' },
      D: { error: 'The student allowed curved sides.', remediation: 'Polygons and quadrilaterals must have straight sides.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'Which shape ALWAYS has 4 right angles AND 4 equal sides?',
    option_a: 'Square', option_b: 'Rectangle', option_c: 'Rhombus', option_d: 'Trapezoid',
    correct_answer: 'A',
    explanation: 'A square has both 4 equal sides and 4 right angles.',
    distractor_diagnostics: {
      B: { error: 'The student chose rectangle, which has 4 right angles but not necessarily 4 equal sides.', remediation: 'Rectangles have opposite sides equal, but a square has all 4 sides equal.' },
      C: { error: 'The student chose rhombus, which has 4 equal sides but not necessarily 4 right angles.', remediation: 'A rhombus does not have to have right angles; a square must have right angles.' },
      D: { error: 'The student chose trapezoid.', remediation: 'A trapezoid only has one pair of parallel sides.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'Which quadrilateral ALWAYS has 4 equal sides, but its angles do NOT have to be 90 degrees?',
    option_a: 'Rhombus', option_b: 'Rectangle', option_c: 'Trapezoid', option_d: 'Pentagon',
    correct_answer: 'A',
    explanation: 'A rhombus is defined as any parallelogram with 4 equal sides.',
    distractor_diagnostics: {
      B: { error: 'The student chose rectangle.', remediation: 'A rectangle must have 90-degree angles and does not require 4 equal sides.' },
      C: { error: 'The student chose trapezoid.', remediation: 'A trapezoid does not have 4 equal sides.' },
      D: { error: 'The student chose pentagon (5 sides).', remediation: 'A rhombus is a 4-sided quadrilateral.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Equal Areas & Unit Fractions', subtopic_id: 278,
    question_text: 'A hexagon is partitioned into 6 equal parts. What unit fraction represents the area of EACH part?',
    option_a: '1/6', option_b: '1/4', option_c: '6/1', option_d: '1/3',
    correct_answer: 'A',
    explanation: 'Each equal part of a shape divided into 6 equal areas is 1/6 of the total area.',
    distractor_diagnostics: {
      B: { error: 'The student used denominator 4.', remediation: 'There are 6 equal parts, so the unit fraction is 1/6.' },
      C: { error: 'The student inverted the fraction.', remediation: 'The numerator is 1 (one part) and denominator is 6 (total parts): 1/6.' },
      D: { error: 'The student chose 1/3.', remediation: '1 part out of 6 is 1/6.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Quadrilaterals', subtopic_id: 275,
    question_text: 'Which of the following is NOT a quadrilateral?',
    option_a: 'Triangle', option_b: 'Rectangle', option_c: 'Rhombus', option_d: 'Square',
    correct_answer: 'A',
    explanation: 'A triangle has 3 sides, so it is not a quadrilateral (which requires 4 sides).',
    distractor_diagnostics: {
      B: { error: 'The student chose rectangle.', remediation: 'A rectangle has 4 sides, so it is a quadrilateral.' },
      C: { error: 'The student chose rhombus.', remediation: 'A rhombus has 4 sides, so it is a quadrilateral.' },
      D: { error: 'The student chose square.', remediation: 'A square has 4 sides, so it is a quadrilateral.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'Is every square also a rectangle?',
    option_a: 'Yes, because a square has 4 right angles and opposite sides that are parallel and equal', option_b: 'No, a square can never be a rectangle', option_c: 'Only if the square is very large', option_d: 'No, rectangles must have two sides longer than the others',
    correct_answer: 'A',
    explanation: 'A rectangle is defined as a quadrilateral with 4 right angles. Since every square has 4 right angles, every square is a special rectangle.',
    distractor_diagnostics: {
      B: { error: 'The student thinks squares and rectangles are mutually exclusive.', remediation: 'A square satisfies all definitions of a rectangle (4 right angles).' },
      C: { error: 'The student based geometry on size.', remediation: 'Shape definitions depend on angles and sides, not size.' },
      D: { error: 'The student believes rectangles cannot have equal sides.', remediation: 'A rectangle can have all sides equal; that special rectangle is called a square.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Partitioning Shapes', subtopic_id: 279,
    question_text: 'A square is divided into 4 equal triangles by two diagonal lines. What fraction of the square is each triangle?',
    option_a: '1/4', option_b: '1/2', option_c: '1/8', option_d: '4/1',
    correct_answer: 'A',
    explanation: 'Each of the 4 equal triangular sections represents 1/4 of the total area of the square.',
    distractor_diagnostics: {
      B: { error: 'The student chose 1/2.', remediation: 'There are 4 equal triangles, so each one is 1/4.' },
      C: { error: 'The student chose 1/8.', remediation: 'Count the triangles: there are 4, so each is 1/4.' },
      D: { error: 'The student inverted the fraction.', remediation: 'Write 1 over the total number of pieces: 1/4.' }
    }
  },
  {
    grade: 3, difficulty: 'Low', subtopic_name: 'Quadrilaterals', subtopic_id: 275,
    question_text: 'Which shape has 4 sides with exactly ONE pair of parallel sides?',
    option_a: 'Trapezoid', option_b: 'Parallelogram', option_c: 'Rectangle', option_d: 'Rhombus',
    correct_answer: 'A',
    explanation: 'A trapezoid is a quadrilateral that has exactly one pair of parallel opposite sides.',
    distractor_diagnostics: {
      B: { error: 'The student chose parallelogram.', remediation: 'A parallelogram has TWO pairs of parallel sides.' },
      C: { error: 'The student chose rectangle.', remediation: 'A rectangle has two pairs of parallel sides.' },
      D: { error: 'The student chose rhombus.', remediation: 'A rhombus has two pairs of parallel sides.' }
    }
  },

  // Medium (9)
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'Which statement is true about BOTH rectangles and rhombuses?',
    option_a: 'Both are parallelograms with two pairs of parallel opposite sides', option_b: 'Both must always have 4 right angles', option_c: 'Both must always have 4 equal sides', option_d: 'Neither has parallel sides',
    correct_answer: 'A',
    explanation: 'Both rectangles and rhombuses are types of parallelograms, meaning their opposite sides are parallel and equal.',
    distractor_diagnostics: {
      B: { error: 'The student applied rectangle angle rules to rhombuses.', remediation: 'A rhombus does not need to have right angles.' },
      C: { error: 'The student applied rhombus side rules to rectangles.', remediation: 'A rectangle does not need to have 4 equal sides.' },
      D: { error: 'The student claimed neither has parallel sides.', remediation: 'Both shapes have 2 pairs of parallel sides.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Equal Areas & Unit Fractions', subtopic_id: 278,
    question_text: 'A rectangle is partitioned into 8 equal parts. 3 parts are shaded. What fraction of the area of the rectangle is shaded?',
    option_a: '3/8', option_b: '5/8', option_c: '1/8', option_d: '3/5',
    correct_answer: 'A',
    explanation: 'Since each part has an area of 1/8, three shaded parts have a combined area of 3/8.',
    distractor_diagnostics: {
      B: { error: 'The student counted unshaded parts.', remediation: 'Count the shaded parts (3) over total parts (8): 3/8.' },
      C: { error: 'The student gave the unit fraction of a single part.', remediation: 'There are 3 shaded parts, so multiply 3 × 1/8 = 3/8.' },
      D: { error: 'The student compared shaded to unshaded (ratio).', remediation: 'The denominator must represent ALL parts: 3/8.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Quadrilaterals', subtopic_id: 275,
    question_text: 'Which shape is a quadrilateral with NO parallel sides?',
    option_a: 'Kite (or irregular 4-sided polygon)', option_b: 'Rectangle', option_c: 'Parallelogram', option_d: 'Square',
    correct_answer: 'A',
    explanation: 'A general kite or irregular quadrilateral has 4 sides but no pairs of parallel sides.',
    distractor_diagnostics: {
      B: { error: 'The student chose rectangle.', remediation: 'Rectangles have 2 pairs of parallel sides.' },
      C: { error: 'The student chose parallelogram.', remediation: 'Parallelograms have 2 pairs of parallel sides.' },
      D: { error: 'The student chose square.', remediation: 'Squares have 2 pairs of parallel sides.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'A parallelogram has 4 equal sides. Each side measures 5 cm. What specific name describes this shape?',
    option_a: 'Rhombus', option_b: 'Trapezoid', option_c: 'Pentagon', option_d: 'Triangle',
    correct_answer: 'A',
    explanation: 'A parallelogram with all 4 sides of equal length is a rhombus.',
    distractor_diagnostics: {
      B: { error: 'The student chose trapezoid.', remediation: 'A trapezoid is not a parallelogram with 4 equal sides.' },
      C: { error: 'The student chose pentagon.', remediation: 'A parallelogram has 4 sides, not 5.' },
      D: { error: 'The student chose triangle.', remediation: 'Triangles have 3 sides.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Equal Areas & Unit Fractions', subtopic_id: 278,
    question_text: 'A large circle is divided into 2 equal halves. Each half is then cut into 2 equal parts. What fraction of the whole circle is each final piece?',
    option_a: '1/4', option_b: '1/2', option_c: '1/8', option_d: '2/4',
    correct_answer: 'A',
    explanation: 'Cutting 2 halves in half produces 4 equal fourths: each piece is 1/4 of the circle.',
    distractor_diagnostics: {
      B: { error: 'The student gave the first cut size.', remediation: 'The halves were cut again, creating smaller pieces of 1/4.' },
      C: { error: 'The student divided by 8.', remediation: '2 halves cut into 2 pieces each make 4 total pieces: 1/4.' },
      D: { error: 'The student wrote 2/4 for a single piece.', remediation: 'Each single piece is 1/4.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Partitioning Shapes', subtopic_id: 279,
    question_text: 'A garden bed is divided into 5 sections of equal area. Herbs are planted in 1 section, flowers in 2 sections, and vegetables in 2 sections. What fraction of the garden has vegetables?',
    option_a: '2/5', option_b: '1/5', option_c: '3/5', option_d: '2/3',
    correct_answer: 'A',
    explanation: 'Vegetables occupy 2 out of 5 equal sections, which represents 2/5 of the total area.',
    distractor_diagnostics: {
      B: { error: 'The student gave the fraction for herbs (1/5).', remediation: 'Vegetables have 2 sections, so the fraction is 2/5.' },
      C: { error: 'The student added flowers and vegetables.', remediation: 'Count only the vegetable sections: 2/5.' },
      D: { error: 'The student used denominator 3.', remediation: 'There are 5 total sections: 2/5.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Quadrilaterals', subtopic_id: 275,
    question_text: 'Which shape belongs to the quadrilateral family but is NEITHER a rectangle nor a rhombus?',
    option_a: 'Trapezoid', option_b: 'Square', option_c: 'Hexagon', option_d: 'Circle',
    correct_answer: 'A',
    explanation: 'A trapezoid has 4 sides (quadrilateral), but does not have 4 right angles (not a rectangle) and does not have 4 equal sides (not a rhombus).',
    distractor_diagnostics: {
      B: { error: 'The student chose square, which IS both a rectangle and a rhombus.', remediation: 'A square is both a rectangle and a rhombus.' },
      C: { error: 'The student chose hexagon (6 sides).', remediation: 'A hexagon is not a quadrilateral.' },
      D: { error: 'The student chose circle.', remediation: 'A circle is not a quadrilateral.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'A rectangle has a length of 6 inches and a width of 4 inches. Can this rectangle also be called a square?',
    option_a: 'No, because a square must have all 4 sides equal in length', option_b: 'Yes, all rectangles are squares', option_c: 'Yes, because it has 4 right angles', option_d: 'No, because its angles are not 90 degrees',
    correct_answer: 'A',
    explanation: 'A square must have 4 equal sides. Since length (6) does not equal width (4), it cannot be a square.',
    distractor_diagnostics: {
      B: { error: 'The student thought all rectangles are squares.', remediation: 'All squares are rectangles, but not all rectangles are squares.' },
      C: { error: 'The student checked only the angles.', remediation: 'A square requires both 4 right angles AND 4 equal sides.' },
      D: { error: 'The student claimed the angles are not 90 degrees.', remediation: 'Rectangles always have 90-degree angles, but sides must also be equal to be a square.' }
    }
  },
  {
    grade: 3, difficulty: 'Medium', subtopic_name: 'Partitioning Shapes', subtopic_id: 279,
    question_text: 'If a rectangle is partitioned into 3 equal columns, and each column is divided into 2 equal rows, how many total equal parts are created?',
    option_a: '6 equal parts', option_b: '5 equal parts', option_c: '8 equal parts', option_d: '9 equal parts',
    correct_answer: 'A',
    explanation: '3 columns × 2 rows = 6 equal parts. Each part has an area of 1/6 of the rectangle.',
    distractor_diagnostics: {
      B: { error: 'The student added 3 + 2 = 5.', remediation: 'Multiply rows by columns: 2 × 3 = 6 equal parts.' },
      C: { error: 'The student made an arithmetic error.', remediation: '3 × 2 = 6 parts.' },
      D: { error: 'The student squared 3.', remediation: 'There are only 2 rows: 2 × 3 = 6.' }
    }
  },

  // High (8)
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'Why is a square considered both a rectangle AND a rhombus at the same time?',
    option_a: 'Because it satisfies the rules of both: 4 right angles (rectangle) and 4 equal sides (rhombus)', option_b: 'Because all shapes with 4 sides are both rectangles and rhombuses', option_c: 'Because it can be turned into a circle', option_d: 'Because its perimeter is equal to its area',
    correct_answer: 'A',
    explanation: 'A square inherits the defining properties of both rectangles (4 right angles) and rhombuses (4 congruent sides).',
    distractor_diagnostics: {
      B: { error: 'The student overgeneralized to all 4-sided shapes.', remediation: 'A trapezoid has 4 sides but is neither a rectangle nor a rhombus.' },
      C: { error: 'The student made an irrelevant statement.', remediation: 'Shape classification is based on angles and sides.' },
      D: { error: 'The student confused perimeter and area with geometric classification.', remediation: 'Classification depends on angles and side relationships.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Equal Areas & Unit Fractions', subtopic_id: 278,
    question_text: 'A square is divided into 4 parts with equal areas. Student A divides it using a vertical and horizontal line (4 smaller squares). Student B divides it using two diagonal lines (4 triangles). Which is true?',
    option_a: 'Each small square has the exact same area as each small triangle (1/4 of the whole)', option_b: 'The small squares have more area because squares are larger than triangles', option_c: 'The triangles have more area because diagonals are longer', option_d: 'The areas cannot be compared because their shapes are different',
    correct_answer: 'A',
    explanation: 'Since both wholes are identical and both were divided into 4 equal shares, each share has an area of exactly 1/4 of the whole square.',
    distractor_diagnostics: {
      B: { error: 'The student assumed shape appearance dictates area size.', remediation: 'Equal shares of identical wholes have the same area regardless of shape.' },
      C: { error: 'The student confused line length with area.', remediation: 'Both represent exactly 1/4 of the total area.' },
      D: { error: 'The student thought different shapes cannot have equal areas.', remediation: 'Area is the measure of surface space, which is identical (1/4).' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Quadrilaterals', subtopic_id: 275,
    question_text: 'Which category includes ALL of the following: Squares, Rectangles, Rhombuses, and Parallelograms?',
    option_a: 'Quadrilaterals', option_b: 'Trapezoids', option_c: 'Triangles', option_d: 'Pentagons',
    correct_answer: 'A',
    explanation: 'The overarching category that includes all 4-sided closed polygons is Quadrilaterals.',
    distractor_diagnostics: {
      B: { error: 'The student chose trapezoids.', remediation: 'A trapezoid is only one specific subcategory, not the parent category.' },
      C: { error: 'The student chose triangles (3 sides).', remediation: 'All of these shapes have 4 sides.' },
      D: { error: 'The student chose pentagons (5 sides).', remediation: 'All of these shapes have 4 sides.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Equal Areas & Unit Fractions', subtopic_id: 278,
    question_text: 'A rectangle is partitioned into 6 parts with equal area. If 4 of the parts are unshaded, what fraction of the area is SHADED?',
    option_a: '2/6 (or 1/3)', option_b: '4/6', option_c: '1/6', option_d: '2/4',
    correct_answer: 'A',
    explanation: 'Total parts = 6. Unshaded = 4. Shaded = 6 - 4 = 2 parts. Shaded fraction = 2/6 = 1/3.',
    distractor_diagnostics: {
      B: { error: 'The student gave the fraction of unshaded parts.', remediation: 'Subtract unshaded from total: 6 - 4 = 2 shaded parts (2/6).' },
      C: { error: 'The student gave the unit fraction for 1 part.', remediation: 'There are 2 shaded parts: 2/6.' },
      D: { error: 'The student used unshaded as denominator (ratio).', remediation: 'The denominator is the total parts (6): 2/6.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Squares, Rectangles & Rhombuses', subtopic_id: 276,
    question_text: 'A teacher draws a quadrilateral with opposite sides parallel and equal, but NONE of the angles are 90 degrees. Can this shape be a rectangle?',
    option_a: 'No, because a rectangle MUST have four 90-degree right angles', option_b: 'Yes, any parallelogram is a rectangle', option_c: 'Yes, if the sides are long enough', option_d: 'Only if it has 4 equal sides',
    correct_answer: 'A',
    explanation: 'By mathematical definition, a rectangle must have 4 right angles ($90^\circ$). If it has no right angles, it is a general parallelogram or rhombus.',
    distractor_diagnostics: {
      B: { error: 'The student thought all parallelograms are rectangles.', remediation: 'A parallelogram only becomes a rectangle if its angles are right angles.' },
      C: { error: 'The student based geometry on side length.', remediation: 'Angles determine whether a parallelogram is a rectangle.' },
      D: { error: 'The student described a rhombus.', remediation: 'Without 90-degree angles, it cannot be a rectangle.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Partitioning Shapes', subtopic_id: 279,
    question_text: 'A square has an area of 36 square inches. It is partitioned into 4 equal sections. What is the area of EACH section in square inches?',
    option_a: '9 square inches', option_b: '6 square inches', option_c: '12 square inches', option_d: '18 square inches',
    correct_answer: 'A',
    explanation: 'Divide the total area by the number of equal parts: 36 ÷ 4 = 9 square inches per section.',
    distractor_diagnostics: {
      B: { error: 'The student found the side length of the square (√36 = 6).', remediation: 'Divide the total area (36) by 4 parts: 36 ÷ 4 = 9 square inches.' },
      C: { error: 'The student divided by 3 instead of 4.', remediation: 'There are 4 equal sections: 36 ÷ 4 = 9.' },
      D: { error: 'The student divided by 2 (found halves).', remediation: 'Divide by 4 for fourths: 36 ÷ 4 = 9.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Quadrilaterals', subtopic_id: 275,
    question_text: 'Which shape is a parallelogram, a rectangle, and a rhombus all at once?',
    option_a: 'Square', option_b: 'Trapezoid', option_c: 'Kite', option_d: 'Regular hexagon',
    correct_answer: 'A',
    explanation: 'A square has parallel opposite sides (parallelogram), 4 right angles (rectangle), and 4 equal sides (rhombus).',
    distractor_diagnostics: {
      B: { error: 'The student chose trapezoid.', remediation: 'A trapezoid is none of these.' },
      C: { error: 'The student chose kite.', remediation: 'A kite does not have parallel sides or right angles.' },
      D: { error: 'The student chose hexagon (6 sides).', remediation: 'A hexagon is not a quadrilateral.' }
    }
  },
  {
    grade: 3, difficulty: 'High', subtopic_name: 'Equal Areas & Unit Fractions', subtopic_id: 278,
    question_text: 'Three identical rectangles are partitioned into equal shares. Rectangle X has 2 equal shares, Rectangle Y has 3 equal shares, and Rectangle Z has 4 equal shares. Which rectangle has the LARGEST individual share?',
    option_a: 'Rectangle X (halves)', option_b: 'Rectangle Y (thirds)', option_c: 'Rectangle Z (fourths)', option_d: 'All individual shares are the same size',
    correct_answer: 'A',
    explanation: 'Decomposing a whole into fewer shares produces larger shares. 1/2 is larger than 1/3 and 1/4.',
    distractor_diagnostics: {
      B: { error: 'The student chose thirds.', remediation: 'Halves (divided by 2) are bigger than thirds (divided by 3).' },
      C: { error: 'The student thought fourths are largest because 4 is greater than 2.', remediation: 'More pieces means smaller pieces when dividing the same whole.' },
      D: { error: 'The student assumed all shares are equal.', remediation: 'Fewer divisions produce larger individual parts: 1/2 > 1/3 > 1/4.' }
    }
  }
];

const g4Questions = [
  // Low (8)
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Lines & Line Segments', subtopic_id: 280,
    question_text: 'What is a part of a line that has ONE endpoint and extends infinitely in the other direction?',
    option_a: 'Ray', option_b: 'Line segment', option_c: 'Point', option_d: 'Line',
    correct_answer: 'A',
    explanation: 'A ray has exactly one starting endpoint and continues without end in one direction.',
    distractor_diagnostics: {
      B: { error: 'The student selected line segment, which has TWO endpoints.', remediation: 'A line segment stops at both ends; a ray continues forever in one direction.' },
      C: { error: 'The student selected a point.', remediation: 'A point is an exact location with no length.' },
      D: { error: 'The student selected a line, which extends in BOTH directions.', remediation: 'A line has no endpoints; a ray has 1 endpoint.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Angles', subtopic_id: 281,
    question_text: 'What do we call an angle that measures EXACTLY 90 degrees?',
    option_a: 'Right angle', option_b: 'Acute angle', option_c: 'Obtuse angle', option_d: 'Straight angle',
    correct_answer: 'A',
    explanation: 'An angle measuring exactly 90 degrees is a right angle (forms a square corner).',
    distractor_diagnostics: {
      B: { error: 'The student chose acute angle (less than 90 degrees).', remediation: 'Acute angles are less than 90 degrees; right angles are exactly 90 degrees.' },
      C: { error: 'The student chose obtuse angle (greater than 90 degrees).', remediation: 'Obtuse angles are greater than 90 degrees.' },
      D: { error: 'The student chose straight angle (180 degrees).', remediation: 'A straight angle measures 180 degrees.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Angles', subtopic_id: 281,
    question_text: 'What do we call an angle that is LESS than 90 degrees?',
    option_a: 'Acute angle', option_b: 'Obtuse angle', option_c: 'Right angle', option_d: 'Straight angle',
    correct_answer: 'A',
    explanation: 'An acute angle measures between 0 degrees and 90 degrees (smaller than a square corner).',
    distractor_diagnostics: {
      B: { error: 'The student chose obtuse angle.', remediation: 'Obtuse angles are wide (greater than 90 degrees); acute angles are small (less than 90).' },
      C: { error: 'The student chose right angle.', remediation: 'Right angles are exactly 90 degrees.' },
      D: { error: 'The student chose straight angle.', remediation: 'Straight angles measure 180 degrees.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Parallel', subtopic_id: 282,
    question_text: 'What is the term for two straight lines that stay the same distance apart and NEVER intersect?',
    option_a: 'Parallel lines', option_b: 'Perpendicular lines', option_c: 'Intersecting lines', option_d: 'Rays',
    correct_answer: 'A',
    explanation: 'Parallel lines lie in the same plane and never cross or touch, like railroad tracks.',
    distractor_diagnostics: {
      B: { error: 'The student chose perpendicular lines.', remediation: 'Perpendicular lines cross each other at 90-degree right angles.' },
      C: { error: 'The student chose intersecting lines.', remediation: 'Intersecting lines cross each other; parallel lines never cross.' },
      D: { error: 'The student chose rays.', remediation: 'Parallel describes the relationship between two lines that never meet.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Parallel', subtopic_id: 282,
    question_text: 'Two lines cross each other and form square corners (90-degree angles). What type of lines are they?',
    option_a: 'Perpendicular lines', option_b: 'Parallel lines', option_c: 'Rays', option_d: 'Curved lines',
    correct_answer: 'A',
    explanation: 'Lines that intersect to form 90-degree right angles are perpendicular lines.',
    distractor_diagnostics: {
      B: { error: 'The student chose parallel lines.', remediation: 'Parallel lines never cross; perpendicular lines cross at 90 degrees.' },
      C: { error: 'The student chose rays.', remediation: 'The question describes the relationship between crossing lines (perpendicular).' },
      D: { error: 'The student chose curved lines.', remediation: 'Perpendicular lines are straight lines forming 90-degree angles.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Classifying Shapes', subtopic_id: 283,
    question_text: 'What do we call a triangle that has exactly ONE 90-degree right angle?',
    option_a: 'Right triangle', option_b: 'Acute triangle', option_c: 'Obtuse triangle', option_d: 'Equilateral triangle',
    correct_answer: 'A',
    explanation: 'A triangle containing one right angle is classified as a right triangle.',
    distractor_diagnostics: {
      B: { error: 'The student chose acute triangle.', remediation: 'An acute triangle has all 3 angles less than 90 degrees.' },
      C: { error: 'The student chose obtuse triangle.', remediation: 'An obtuse triangle has one angle greater than 90 degrees.' },
      D: { error: 'The student chose equilateral triangle.', remediation: 'All angles in an equilateral triangle are 60 degrees.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Symmetry', subtopic_id: 284,
    question_text: 'How many lines of symmetry does a rectangle have (that is NOT a square)?',
    option_a: '2 lines of symmetry', option_b: '4 lines of symmetry', option_c: '1 line of symmetry', option_d: '0 lines of symmetry',
    correct_answer: 'A',
    explanation: 'A non-square rectangle can be folded in half horizontally and vertically (2 lines of symmetry). Diagonals do not match up when folded.',
    distractor_diagnostics: {
      B: { error: 'The student chose 4 (confused with a square).', remediation: 'A square has 4 lines of symmetry, but a rectangle only has 2 (horizontal and vertical).' },
      C: { error: 'The student counted only 1 line.', remediation: 'A rectangle has both a vertical fold line and a horizontal fold line (2 lines).' },
      D: { error: 'The student thought it has no symmetry.', remediation: 'A rectangle has 2 lines of symmetry.' }
    }
  },
  {
    grade: 4, difficulty: 'Low', subtopic_name: 'Lines & Line Segments', subtopic_id: 280,
    question_text: 'What has TWO distinct endpoints and a definite length that can be measured?',
    option_a: 'Line segment', option_b: 'Line', option_c: 'Ray', option_d: 'Angle',
    correct_answer: 'A',
    explanation: 'A line segment connects two endpoints and has a measurable finite length.',
    distractor_diagnostics: {
      B: { error: 'The student chose line, which goes on forever.', remediation: 'A line has no endpoints and infinite length.' },
      C: { error: 'The student chose ray, which has only 1 endpoint.', remediation: 'A ray extends forever in one direction; a line segment has 2 endpoints.' },
      D: { error: 'The student chose angle.', remediation: 'An angle is formed by two rays meeting at a vertex.' }
    }
  },

  // Medium (9)
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Angles', subtopic_id: 281,
    question_text: 'An angle measures 135 degrees. How is this angle classified?',
    option_a: 'Obtuse angle', option_b: 'Acute angle', option_c: 'Right angle', option_d: 'Straight angle',
    correct_answer: 'A',
    explanation: 'An obtuse angle measures greater than 90 degrees and less than 180 degrees. 135 degrees is obtuse.',
    distractor_diagnostics: {
      B: { error: 'The student classified 135 as acute.', remediation: 'Acute angles are less than 90 degrees; 135 is greater than 90.' },
      C: { error: 'The student classified 135 as a right angle.', remediation: 'Right angles measure exactly 90 degrees.' },
      D: { error: 'The student classified 135 as straight.', remediation: 'Straight angles measure exactly 180 degrees.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Symmetry', subtopic_id: 284,
    question_text: 'How many lines of symmetry does a square have?',
    option_a: '4 lines of symmetry', option_b: '2 lines of symmetry', option_c: '8 lines of symmetry', option_d: '1 line of symmetry',
    correct_answer: 'A',
    explanation: 'A square has 4 lines of symmetry: 1 horizontal, 1 vertical, and 2 diagonals.',
    distractor_diagnostics: {
      B: { error: 'The student counted only horizontal and vertical lines, omitting the diagonals.', remediation: 'A square can also be folded along both diagonals, giving 2 + 2 = 4 lines.' },
      C: { error: 'The student doubled the count.', remediation: 'Each fold line passes through opposite sides or opposite corners: exactly 4 lines.' },
      D: { error: 'The student counted only 1 line.', remediation: 'A square has 4 lines of symmetry.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Classifying Shapes', subtopic_id: 283,
    question_text: 'A triangle has angles measuring 35 degrees, 55 degrees, and 90 degrees. What type of triangle is it?',
    option_a: 'Right triangle', option_b: 'Obtuse triangle', option_c: 'Acute triangle', option_d: 'Equilateral triangle',
    correct_answer: 'A',
    explanation: 'Since one of the angles is exactly 90 degrees, it is classified as a right triangle.',
    distractor_diagnostics: {
      B: { error: 'The student classified it as obtuse.', remediation: 'None of the angles are greater than 90 degrees.' },
      C: { error: 'The student classified it as acute because two angles are acute.', remediation: 'Even though two angles are acute, the presence of a 90-degree angle makes it a right triangle.' },
      D: { error: 'The student chose equilateral.', remediation: 'Equilateral triangles have all angles equal to 60 degrees.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Parallel', subtopic_id: 282,
    question_text: 'Which capital letter of the alphabet contains BOTH parallel line segments and perpendicular line segments?',
    option_a: 'Letter H', option_b: 'Letter L', option_c: 'Letter X', option_d: 'Letter O',
    correct_answer: 'A',
    explanation: 'In the letter H, the two vertical sides are parallel to each other, and the horizontal crossbar is perpendicular to both sides.',
    distractor_diagnostics: {
      B: { error: 'The student chose L, which has perpendicular lines but NO parallel lines.', remediation: 'Letter L has only 2 segments that meet at 90 degrees; it has no parallel lines.' },
      C: { error: 'The student chose X, which has intersecting lines but no parallel lines.', remediation: 'Letter X does not have parallel segments.' },
      D: { error: 'The student chose O, which has curved lines.', remediation: 'Letter O has no straight line segments.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Classifying Shapes', subtopic_id: 283,
    question_text: 'Which shape ALWAYS has two pairs of parallel sides and all 4 sides equal, but no right angles are required?',
    option_a: 'Rhombus', option_b: 'Trapezoid', option_c: 'Rectangle', option_d: 'Kite',
    correct_answer: 'A',
    explanation: 'A rhombus has 2 pairs of parallel sides and all 4 sides equal.',
    distractor_diagnostics: {
      B: { error: 'The student chose trapezoid.', remediation: 'A trapezoid only has 1 pair of parallel sides.' },
      C: { error: 'The student chose rectangle.', remediation: 'A rectangle requires 4 right angles and does not require 4 equal sides.' },
      D: { error: 'The student chose kite.', remediation: 'A kite has no parallel sides.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Symmetry', subtopic_id: 284,
    question_text: 'Which of the following figures has NO lines of symmetry?',
    option_a: 'Scalene triangle (all 3 sides different lengths)', option_b: 'Equilateral triangle', option_c: 'Isosceles triangle', option_d: 'Regular hexagon',
    correct_answer: 'A',
    explanation: 'A scalene triangle has all sides and angles of different measures, so it cannot be folded into matching halves (0 lines of symmetry).',
    distractor_diagnostics: {
      B: { error: 'The student chose equilateral triangle, which has 3 lines of symmetry.', remediation: 'An equilateral triangle has 3 lines of symmetry.' },
      C: { error: 'The student chose isosceles triangle, which has 1 line of symmetry.', remediation: 'An isosceles triangle has 1 line of symmetry down the middle.' },
      D: { error: 'The student chose regular hexagon, which has 6 lines of symmetry.', remediation: 'Regular hexagons have 6 lines of symmetry.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Angles', subtopic_id: 281,
    question_text: 'What type of angle is formed by the hands of a clock at exactly 3:00?',
    option_a: 'Right angle (90 degrees)', option_b: 'Acute angle', option_c: 'Obtuse angle', option_d: 'Straight angle',
    correct_answer: 'A',
    explanation: 'At 3:00, the minute hand points to 12 and the hour hand points to 3, forming a 90-degree right angle.',
    distractor_diagnostics: {
      B: { error: 'The student chose acute angle.', remediation: 'At 3:00, the angle is exactly 90 degrees (a right angle).' },
      C: { error: 'The student chose obtuse angle.', remediation: 'Obtuse angles are greater than 90 degrees (like at 4:00 or 5:00).' },
      D: { error: 'The student chose straight angle.', remediation: 'A straight angle occurs at 6:00 (180 degrees).' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Lines & Line Segments', subtopic_id: 280,
    question_text: 'How many endpoints does a geometric line have?',
    option_a: '0 endpoints', option_b: '1 endpoint', option_c: '2 endpoints', option_d: 'Infinite endpoints',
    correct_answer: 'A',
    explanation: 'A line has zero endpoints because it extends without ending in both opposite directions.',
    distractor_diagnostics: {
      B: { error: 'The student chose 1 (confused line with ray).', remediation: 'A ray has 1 endpoint; a line has 0 endpoints.' },
      C: { error: 'The student chose 2 (confused line with line segment).', remediation: 'A line segment has 2 endpoints; a line extends forever with 0 endpoints.' },
      D: { error: 'The student confused infinite length with endpoints.', remediation: 'A line has infinite points, but zero endpoints.' }
    }
  },
  {
    grade: 4, difficulty: 'Medium', subtopic_name: 'Classifying Shapes', subtopic_id: 283,
    question_text: 'A quadrilateral has exactly ONE pair of parallel sides. How is this quadrilateral classified?',
    option_a: 'Trapezoid', option_b: 'Parallelogram', option_c: 'Rhombus', option_d: 'Rectangle',
    correct_answer: 'A',
    explanation: 'In elementary geometry, a quadrilateral with exactly one pair of parallel sides is a trapezoid.',
    distractor_diagnostics: {
      B: { error: 'The student chose parallelogram.', remediation: 'A parallelogram must have TWO pairs of parallel sides.' },
      C: { error: 'The student chose rhombus.', remediation: 'A rhombus has two pairs of parallel sides.' },
      D: { error: 'The student chose rectangle.', remediation: 'A rectangle has two pairs of parallel sides.' }
    }
  },

  // High (8)
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Classifying Shapes', subtopic_id: 283,
    question_text: 'Can a triangle have TWO right angles? Why or why not?',
    option_a: 'No, because the angles of a triangle add up to 180 degrees; two right angles would equal 180 degrees, leaving 0 for the third angle', option_b: 'Yes, any right triangle has two right angles', option_c: 'Yes, if the triangle is very large', option_d: 'No, because triangles cannot have any right angles',
    correct_answer: 'A',
    explanation: 'A triangle can have at most ONE right angle because the sum of all three angles is always 180 degrees ($90 + 90 = 180$).',
    distractor_diagnostics: {
      B: { error: 'The student thought right triangles have two right angles.', remediation: 'A right triangle has only ONE right angle and two acute angles.' },
      C: { error: 'The student thought size changes angle sum.', remediation: 'All flat triangles have an angle sum of 180 degrees regardless of size.' },
      D: { error: 'The student claimed triangles cannot have right angles.', remediation: 'A triangle can have exactly one right angle.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Symmetry', subtopic_id: 284,
    question_text: 'How many lines of symmetry does a regular pentagon have?',
    option_a: '5 lines of symmetry', option_b: '1 line of symmetry', option_c: '10 lines of symmetry', option_d: '0 lines of symmetry',
    correct_answer: 'A',
    explanation: 'A regular polygon with n equal sides has n lines of symmetry. A regular pentagon has 5 lines of symmetry (from each vertex to the opposite midpoint).',
    distractor_diagnostics: {
      B: { error: 'The student counted only 1 line.', remediation: 'A regular pentagon can be folded from all 5 vertices, giving 5 lines of symmetry.' },
      C: { error: 'The student doubled the count.', remediation: 'Each line connects one vertex to one midpoint: exactly 5 lines.' },
      D: { error: 'The student thought it has no symmetry.', remediation: 'Regular polygons are symmetric; a regular pentagon has 5 lines.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Angles', subtopic_id: 281,
    question_text: 'An angle turns through 1/4 of a full circle. How many degrees does this angle measure?',
    option_a: '90 degrees', option_b: '180 degrees', option_c: '45 degrees', option_d: '360 degrees',
    correct_answer: 'A',
    explanation: 'A full circle is 360 degrees. 1/4 of a circle is 360 ÷ 4 = 90 degrees (a right angle).',
    distractor_diagnostics: {
      B: { error: 'The student calculated 1/2 of a circle (180 degrees).', remediation: 'Half a circle is 180 degrees; one-fourth of a circle is 90 degrees.' },
      C: { error: 'The student calculated 1/8 of a circle.', remediation: 'Divide 360 by 4: 360 ÷ 4 = 90 degrees.' },
      D: { error: 'The student gave the full circle degrees.', remediation: 'A full circle is 360 degrees; multiply 360 × 1/4 = 90 degrees.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Classifying Shapes', subtopic_id: 283,
    question_text: 'A shape is a polygon with 4 sides. It has two pairs of parallel sides, and adjacent sides meet at right angles. All 4 sides are 8 cm long. What is the MOST SPECIFIC name for this shape?',
    option_a: 'Square', option_b: 'Rectangle', option_c: 'Parallelogram', option_d: 'Quadrilateral',
    correct_answer: 'A',
    explanation: 'While all these names apply, "Square" is the most specific name because it includes 4 right angles and 4 equal sides.',
    distractor_diagnostics: {
      B: { error: 'The student chose rectangle, which is correct but less specific than square.', remediation: 'Because all sides are equal, "Square" is more specific than "Rectangle".' },
      C: { error: 'The student chose parallelogram, which is a broad category.', remediation: 'Square is the most precise classification.' },
      D: { error: 'The student chose quadrilateral, the broadest category.', remediation: 'Look for the most specific classification: Square.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Parallel', subtopic_id: 282,
    question_text: 'How many pairs of perpendicular sides does a standard rectangle have?',
    option_a: '4 pairs of perpendicular sides', option_b: '2 pairs of perpendicular sides', option_c: '1 pair of perpendicular sides', option_d: '0 pairs',
    correct_answer: 'A',
    explanation: 'A rectangle has 4 corners, and at each corner two adjacent sides meet at 90 degrees. Therefore, it has 4 pairs of perpendicular sides.',
    distractor_diagnostics: {
      B: { error: 'The student confused perpendicular pairs with parallel pairs (it has 2 pairs of parallel sides).', remediation: 'A rectangle has 2 pairs of parallel sides, but 4 corners forming 4 pairs of perpendicular sides.' },
      C: { error: 'The student counted only 1 corner.', remediation: 'All 4 corners form perpendicular intersections.' },
      D: { error: 'The student thought rectangles have no perpendicular sides.', remediation: 'All 4 corners are 90-degree right angles.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Angles', subtopic_id: 281,
    question_text: 'Two acute angles are placed side by side to form a new combined angle. Can the combined angle be obtuse?',
    option_a: 'Yes, for example 50 degrees + 60 degrees = 110 degrees, which is obtuse', option_b: 'No, two acute angles can only ever make an acute angle', option_c: 'No, they will always equal exactly 90 degrees', option_d: 'Yes, but only if one angle is negative',
    correct_answer: 'A',
    explanation: 'Two acute angles (both $< 90^\circ$) can sum to any value between $0^\circ$ and $< 180^\circ$. If each is greater than $45^\circ$ (e.g. $50^\circ + 60^\circ = 110^\circ$), the result is obtuse.',
    distractor_diagnostics: {
      B: { error: 'The student assumed adding acute angles always stays acute.', remediation: 'Adding two angles larger than 45 degrees results in an angle greater than 90 degrees (obtuse).' },
      C: { error: 'The student thought they always form a right angle.', remediation: 'They only form 90 degrees if they are complementary.' },
      D: { error: 'The student introduced negative angles.', remediation: 'Geometric angles in elementary math are positive.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Symmetry', subtopic_id: 284,
    question_text: 'How many lines of symmetry does a regular hexagon have?',
    option_a: '6 lines of symmetry', option_b: '3 lines of symmetry', option_c: '12 lines of symmetry', option_d: '4 lines of symmetry',
    correct_answer: 'A',
    explanation: 'A regular hexagon has 6 lines of symmetry: 3 connecting opposite vertices and 3 connecting midpoints of opposite sides.',
    distractor_diagnostics: {
      B: { error: 'The student counted only vertex lines and missed side midpoint lines.', remediation: 'A regular hexagon has 3 vertex-to-vertex lines + 3 side-to-side lines = 6 lines.' },
      C: { error: 'The student doubled the count.', remediation: 'There are exactly 6 unique lines of symmetry.' },
      D: { error: 'The student chose 4.', remediation: 'A regular polygon with 6 sides has 6 lines of symmetry.' }
    }
  },
  {
    grade: 4, difficulty: 'High', subtopic_name: 'Classifying Shapes', subtopic_id: 283,
    question_text: 'Which statement is ALWAYS true about any equilateral triangle?',
    option_a: 'It is always an acute triangle because all 3 angles are 60 degrees', option_b: 'It can be a right triangle', option_c: 'It can be an obtuse triangle', option_d: 'It has 0 lines of symmetry',
    correct_answer: 'A',
    explanation: 'In an equilateral triangle, all 3 angles are equal: $180^\circ \div 3 = 60^\circ$. Since $60^\circ < 90^\circ$, it is always an acute triangle.',
    distractor_diagnostics: {
      B: { error: 'The student thought an equilateral triangle can have a 90-degree angle.', remediation: 'All angles in an equilateral triangle must be 60 degrees; it cannot have a 90-degree angle.' },
      C: { error: 'The student thought it can be obtuse.', remediation: 'None of the angles can be greater than 90 degrees.' },
      D: { error: 'The student thought it has no symmetry.', remediation: 'An equilateral triangle has 3 lines of symmetry.' }
    }
  }
];

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'neweducheck'
  });

  const allQuestions = [...g3Questions, ...g4Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 3 & Grade 4 Geometry...`);

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
          topic_id = 1,
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
          6, 1, NULL, ?, ?,
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
