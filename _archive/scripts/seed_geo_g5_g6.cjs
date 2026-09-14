const mysql = require('mysql2/promise');
require('dotenv').config();

const g5Questions = [
  // Low (8)
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'What are the coordinates of the ORIGIN on a coordinate plane?',
    option_a: '(0, 0)', option_b: '(1, 1)', option_c: '(0, 1)', option_d: '(1, 0)',
    correct_answer: 'A',
    explanation: 'The origin is the intersection of the x-axis and y-axis where both coordinates are zero: (0, 0).',
    distractor_diagnostics: {
      B: { error: 'The student chose (1, 1).', remediation: 'The origin is the starting point at zero: (0, 0).' },
      C: { error: 'The student chose (0, 1).', remediation: 'Both x and y are zero at the origin.' },
      D: { error: 'The student chose (1, 0).', remediation: 'The origin has coordinates (0, 0).' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'In the ordered pair (4, 7), which number represents the x-coordinate?',
    option_a: '4', option_b: '7', option_c: '11', option_d: '28',
    correct_answer: 'A',
    explanation: 'In an ordered pair (x, y), the first number is the x-coordinate (horizontal distance). Here, x = 4.',
    distractor_diagnostics: {
      B: { error: 'The student chose 7, which is the y-coordinate.', remediation: 'Remember the alphabetical order: x comes before y, so the first number is x.' },
      C: { error: 'The student added the numbers.', remediation: 'The x-coordinate is simply the first number in the parentheses (4).' },
      D: { error: 'The student multiplied the numbers.', remediation: 'The x-coordinate is 4.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Graphing Points', subtopic_id: 286,
    question_text: 'To plot the point (3, 5) starting from the origin (0,0), how do you move?',
    option_a: 'Move 3 units right along the x-axis, then 5 units up along the y-axis', option_b: 'Move 5 units right, then 3 units up', option_c: 'Move 3 units up, then 5 units right', option_d: 'Move 3 units left, then 5 units down',
    correct_answer: 'A',
    explanation: 'First coordinate (3) is horizontal (move right). Second coordinate (5) is vertical (move up).',
    distractor_diagnostics: {
      B: { error: 'The student swapped the x and y movements.', remediation: 'Remember: run before you jump (x-axis horizontal first, then y-axis vertical).' },
      C: { error: 'The student moved vertical first.', remediation: 'Always move along the horizontal x-axis first.' },
      D: { error: 'The student moved in the negative direction.', remediation: 'Positive coordinates in Quadrant I move right and up.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Shape Classification', subtopic_id: 287,
    question_text: 'Which property is shared by ALL rectangles?',
    option_a: 'They all have 4 right angles and opposite sides that are parallel and equal', option_b: 'All 4 sides are always equal in length', option_c: 'They have 0 parallel sides', option_d: 'They have 5 sides',
    correct_answer: 'A',
    explanation: 'By definition, a rectangle has 4 right angles ($90^\circ$) and opposite sides that are parallel and equal in length.',
    distractor_diagnostics: {
      B: { error: 'The student described a square/rhombus.', remediation: 'A rectangle does not need all 4 sides equal; only opposite sides must be equal.' },
      C: { error: 'The student claimed 0 parallel sides.', remediation: 'Rectangles have 2 pairs of parallel sides.' },
      D: { error: 'The student gave 5 sides.', remediation: 'Rectangles have 4 sides.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Hierarchy of Shape', subtopic_id: 288,
    question_text: 'True or False: Every square is a rectangle, but not every rectangle is a square.',
    option_a: 'True', option_b: 'False, every rectangle is a square', option_c: 'False, squares and rectangles are completely unrelated', option_d: 'False, only small squares are rectangles',
    correct_answer: 'A',
    explanation: 'A rectangle requires 4 right angles (which all squares have). A square also requires 4 equal sides (which many rectangles do not have). Thus, all squares are rectangles.',
    distractor_diagnostics: {
      B: { error: 'The student reversed the hierarchy.', remediation: 'A rectangle with sides 4 and 8 is not a square, so not all rectangles are squares.' },
      C: { error: 'The student thought they are unrelated.', remediation: 'Square is a special subcategory of rectangle.' },
      D: { error: 'The student conditioned on size.', remediation: 'Geometric definitions apply to all sizes.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'A point is located at (6, 0). Where does this point lie?',
    option_a: 'Directly on the x-axis', option_b: 'Directly on the y-axis', option_c: 'At the origin', option_d: 'In Quadrant II',
    correct_answer: 'A',
    explanation: 'Since the y-coordinate is 0, the point has not moved vertically and lies directly on the horizontal x-axis.',
    distractor_diagnostics: {
      B: { error: 'The student chose y-axis.', remediation: 'Points on the y-axis have x = 0; here y = 0, so it is on the x-axis.' },
      C: { error: 'The student chose origin.', remediation: 'The origin is (0, 0); this point is at x = 6.' },
      D: { error: 'The student chose Quadrant II.', remediation: 'It lies on the positive x-axis boundary.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Shape Classification', subtopic_id: 287,
    question_text: 'Which shape has 4 equal sides and 2 pairs of parallel sides?',
    option_a: 'Rhombus', option_b: 'Trapezoid', option_c: 'Scalene triangle', option_d: 'Pentagon',
    correct_answer: 'A',
    explanation: 'A rhombus is an equilateral parallelogram with 4 equal sides and 2 pairs of parallel sides.',
    distractor_diagnostics: {
      B: { error: 'The student chose trapezoid.', remediation: 'A trapezoid only has 1 pair of parallel sides.' },
      C: { error: 'The student chose triangle.', remediation: 'A triangle has 3 sides; rhombus has 4.' },
      D: { error: 'The student chose pentagon.', remediation: 'A pentagon has 5 sides.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Graphing Points', subtopic_id: 286,
    question_text: 'What are the coordinates of a point that is 8 units right from the origin and 2 units up?',
    option_a: '(8, 2)', option_b: '(2, 8)', option_c: '(10, 0)', option_d: '(6, 2)',
    correct_answer: 'A',
    explanation: 'Horizontal movement is x = 8, vertical movement is y = 2: (8, 2).',
    distractor_diagnostics: {
      B: { error: 'The student swapped x and y.', remediation: 'Write horizontal distance first (8), then vertical distance (2): (8, 2).' },
      C: { error: 'The student added 8 + 2.', remediation: 'Coordinates are written as an ordered pair (8, 2).' },
      D: { error: 'The student subtracted.', remediation: 'Follow coordinates directly: (8, 2).' }
    }
  },

  // Medium (9)
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Hierarchy of Shape', subtopic_id: 288,
    question_text: 'If a category of polygons has a certain property, do all SUBCATEGORIES within it also share that property?',
    option_a: 'Yes, subcategories inherit all properties of their parent category', option_b: 'No, subcategories never share parent properties', option_c: 'Only if the polygon is a triangle', option_d: 'Only if the property is color',
    correct_answer: 'A',
    explanation: 'In geometric hierarchies, any property belonging to a category (e.g. parallelograms have opposite sides parallel) also belongs to all its subcategories (rectangles, rhombuses, squares).',
    distractor_diagnostics: {
      B: { error: 'The student misunderstood hierarchy inheritance.', remediation: 'Subcategories inherit all defining features of the larger category.' },
      C: { error: 'The student limited the rule to triangles.', remediation: 'Inheritance applies to all geometric hierarchies.' },
      D: { error: 'The student mentioned color.', remediation: 'Geometric definitions pertain to angles, sides, and symmetry.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'Point P is at (2, 3) and Point Q is at (7, 3). What is the distance between Point P and Point Q?',
    option_a: '5 units', option_b: '6 units', option_c: '10 units', option_d: '9 units',
    correct_answer: 'A',
    explanation: 'Since y-coordinates are the same (3), subtract x-coordinates: 7 - 2 = 5 units.',
    distractor_diagnostics: {
      B: { error: 'The student made an off-by-one counting error.', remediation: 'Subtract 7 - 2 = 5 units.' },
      C: { error: 'The student added the coordinates.', remediation: 'Subtract the differing coordinates to find distance: 7 - 2 = 5.' },
      D: { error: 'The student added 7 + 2.', remediation: 'Distance is the difference: 7 - 2 = 5.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Hierarchy of Shape', subtopic_id: 288,
    question_text: 'Which statement correctly explains why a rectangle is NOT always a rhombus?',
    option_a: 'A rectangle does not necessarily have all 4 sides equal in length', option_b: 'A rectangle does not have parallel sides', option_c: 'A rectangle has only 3 angles', option_d: 'A rhombus has right angles, but a rectangle does not',
    correct_answer: 'A',
    explanation: 'A rhombus must have 4 equal sides. Many rectangles have two long sides and two short sides, so they are not rhombuses.',
    distractor_diagnostics: {
      B: { error: 'The student claimed rectangles lack parallel sides.', remediation: 'Rectangles have 2 pairs of parallel sides.' },
      C: { error: 'The student stated 3 angles.', remediation: 'Rectangles have 4 angles.' },
      D: { error: 'The student reversed the angle rule.', remediation: 'Rectangles have right angles; rhombuses do not require right angles.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Graphing Points', subtopic_id: 286,
    question_text: 'Three vertices of a rectangle on a coordinate grid are at (1, 1), (5, 1), and (5, 4). What are the coordinates of the fourth vertex?',
    option_a: '(1, 4)', option_b: '(1, 5)', option_c: '(4, 1)', option_d: '(4, 5)',
    correct_answer: 'A',
    explanation: 'The missing vertex must share x = 1 with (1, 1) and y = 4 with (5, 4). The fourth vertex is (1, 4).',
    distractor_diagnostics: {
      B: { error: 'The student used y = 5 instead of y = 4.', remediation: 'The top edge has y = 4, so the vertex is (1, 4).' },
      C: { error: 'The student swapped coordinates.', remediation: 'x must be 1 and y must be 4: (1, 4).' },
      D: { error: 'The student miscalculated both coordinates.', remediation: 'Align vertically with (1, 1) and horizontally with (5, 4).' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Shape Classification', subtopic_id: 287,
    question_text: 'Which shape is a parallelogram with 4 equal sides AND 4 right angles?',
    option_a: 'Square', option_b: 'Trapezoid', option_c: 'Kite', option_d: 'Regular hexagon',
    correct_answer: 'A',
    explanation: 'A square is the unique shape that is simultaneously an equilateral rhombus and an equiangular rectangle.',
    distractor_diagnostics: {
      B: { error: 'The student chose trapezoid.', remediation: 'Trapezoids do not have 4 equal sides and 4 right angles.' },
      C: { error: 'The student chose kite.', remediation: 'A kite does not have 4 equal sides or 4 right angles.' },
      D: { error: 'The student chose hexagon.', remediation: 'A hexagon has 6 sides.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'A map has a school at (2, 5) and a library at (2, 9). How many blocks apart are the school and library?',
    option_a: '4 blocks', option_b: '7 blocks', option_c: '14 blocks', option_d: '2 blocks',
    correct_answer: 'A',
    explanation: 'Since x-coordinates are identical (2), subtract y-coordinates: 9 - 5 = 4 blocks.',
    distractor_diagnostics: {
      B: { error: 'The student made an arithmetic error.', remediation: 'Subtract 9 - 5 = 4 blocks.' },
      C: { error: 'The student added 9 + 5.', remediation: 'Distance between two points is the difference: 9 - 5 = 4.' },
      D: { error: 'The student took the x-coordinate.', remediation: 'The distance is along the y-axis: 9 - 5 = 4.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Hierarchy of Shape', subtopic_id: 288,
    question_text: 'Which classification hierarchy correctly orders shapes from MOST GENERAL to MOST SPECIFIC?',
    option_a: 'Polygon → Quadrilateral → Parallelogram → Rectangle → Square', option_b: 'Square → Rectangle → Parallelogram → Quadrilateral', option_c: 'Quadrilateral → Polygon → Square → Rectangle', option_d: 'Parallelogram → Quadrilateral → Square → Rectangle',
    correct_answer: 'A',
    explanation: 'Polygon is broadest (any closed multi-sided figure), followed by 4-sided (Quadrilateral), 2 parallel pairs (Parallelogram), 4 right angles (Rectangle), and finally 4 equal sides (Square).',
    distractor_diagnostics: {
      B: { error: 'The student ordered from most specific to most general.', remediation: 'General starts with Polygon and narrows down to Square.' },
      C: { error: 'The student placed quadrilateral before polygon.', remediation: 'All quadrilaterals are polygons, so polygon comes first.' },
      D: { error: 'The student placed parallelogram before quadrilateral.', remediation: 'All parallelograms are quadrilaterals, so quadrilateral is more general.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Graphing Points', subtopic_id: 286,
    question_text: 'Point M is at (0, 7). Which axis does Point M sit on?',
    option_a: 'y-axis', option_b: 'x-axis', option_c: 'z-axis', option_d: 'Both x-axis and y-axis',
    correct_answer: 'A',
    explanation: 'When x = 0, the point has zero horizontal distance and lies directly on the vertical y-axis.',
    distractor_diagnostics: {
      B: { error: 'The student chose x-axis.', remediation: 'Points on the x-axis have y = 0. Since x = 0 here, it is on the y-axis.' },
      C: { error: 'The student introduced z-axis (3D).', remediation: 'A 2D coordinate plane has only x and y axes.' },
      D: { error: 'The student chose both (origin).', remediation: 'Only (0, 0) sits on both axes.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Shape Classification', subtopic_id: 287,
    question_text: 'Can a trapezoid be classified as a parallelogram?',
    option_a: 'No, because a trapezoid has only 1 pair of parallel sides, while a parallelogram must have 2 pairs', option_b: 'Yes, all trapezoids are parallelograms', option_c: 'Yes, if all angles are right angles', option_d: 'Only if it has 5 sides',
    correct_answer: 'A',
    explanation: 'Under the standard exclusive definition, a trapezoid has exactly one pair of parallel sides, so it is not a parallelogram.',
    distractor_diagnostics: {
      B: { error: 'The student thought trapezoids are parallelograms.', remediation: 'Parallelograms require 2 pairs of parallel sides; trapezoids have only 1 pair.' },
      C: { error: 'The student made an assumption.', remediation: 'A shape with 4 right angles has 2 pairs of parallel sides, making it a rectangle.' },
      D: { error: 'The student mentioned 5 sides.', remediation: 'Both shapes are 4-sided quadrilaterals.' }
    }
  },

  // High (8)
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Hierarchy of Shape', subtopic_id: 288,
    question_text: 'A mystery shape is a quadrilateral with 4 equal sides. Which statement MUST be true about this mystery shape?',
    option_a: 'It must be a rhombus (and could also be a square)', option_b: 'It must be a trapezoid', option_c: 'It can never have right angles', option_d: 'It must have 4 lines of symmetry',
    correct_answer: 'A',
    explanation: 'Any quadrilateral with 4 congruent sides is guaranteed to be a rhombus. If it also has right angles, it is a square.',
    distractor_diagnostics: {
      B: { error: 'The student chose trapezoid.', remediation: 'A trapezoid does not have 4 equal sides.' },
      C: { error: 'The student claimed it can never have right angles.', remediation: 'A square is a rhombus that has right angles.' },
      D: { error: 'The student assumed 4 lines of symmetry.', remediation: 'A non-square rhombus has only 2 lines of symmetry.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'A rectangle on a coordinate grid has vertices at (2, 2), (8, 2), (8, 6), and (2, 6). What is the PERIMETER of the rectangle?',
    option_a: '20 units', option_b: '24 units', option_c: '10 units', option_d: '14 units',
    correct_answer: 'A',
    explanation: 'Length = 8 - 2 = 6 units. Width = 6 - 2 = 4 units. Perimeter = 2 × (length + width) = 2 × (6 + 4) = 20 units.',
    distractor_diagnostics: {
      B: { error: 'The student calculated area (6 × 4 = 24) instead of perimeter.', remediation: 'Perimeter is the distance around the outside: 6 + 4 + 6 + 4 = 20 units.' },
      C: { error: 'The student added length and width once (6 + 4 = 10).', remediation: 'Double the sum for perimeter: 2 × 10 = 20 units.' },
      D: { error: 'The student made an arithmetic error.', remediation: 'Perimeter = 2(6) + 2(4) = 12 + 8 = 20 units.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'What is the AREA of the rectangle with vertices at (2, 2), (8, 2), (8, 6), and (2, 6)?',
    option_a: '24 square units', option_b: '20 square units', option_c: '12 square units', option_d: '48 square units',
    correct_answer: 'A',
    explanation: 'Length = 8 - 2 = 6 units. Width = 6 - 2 = 4 units. Area = length × width = 6 × 4 = 24 square units.',
    distractor_diagnostics: {
      B: { error: 'The student calculated perimeter (20) instead of area.', remediation: 'Area is length × width: 6 × 4 = 24 square units.' },
      C: { error: 'The student halved the area.', remediation: 'Area of a rectangle is base × height: 6 × 4 = 24.' },
      D: { error: 'The student doubled the area.', remediation: 'Area = 6 × 4 = 24.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Hierarchy of Shape', subtopic_id: 288,
    question_text: 'Which statement is FALSE regarding geometric categories?',
    option_a: 'All rectangles are squares', option_b: 'All squares are rectangles', option_c: 'All squares are rhombuses', option_d: 'All rhombuses are parallelograms',
    correct_answer: 'A',
    explanation: 'Statement A is FALSE because a rectangle with sides 3 and 7 is not a square. All other statements are true.',
    distractor_diagnostics: {
      B: { error: 'The student thought squares are not rectangles.', remediation: 'All squares have 4 right angles, so they are all rectangles.' },
      C: { error: 'The student thought squares are not rhombuses.', remediation: 'All squares have 4 equal sides, so they are all rhombuses.' },
      D: { error: 'The student thought rhombuses are not parallelograms.', remediation: 'All rhombuses have 2 pairs of parallel sides, so they are parallelograms.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Graphing Points', subtopic_id: 286,
    question_text: 'A square has vertices at (3, 3), (7, 3), and (7, 7). What are the coordinates of the fourth vertex?',
    option_a: '(3, 7)', option_b: '(7, 3)', option_c: '(3, 3)', option_d: '(4, 4)',
    correct_answer: 'A',
    explanation: 'The missing vertex must align with x = 3 and y = 7: (3, 7).',
    distractor_diagnostics: {
      B: { error: 'The student selected an existing vertex.', remediation: 'The fourth vertex completes the square at (3, 7).' },
      C: { error: 'The student chose an existing corner.', remediation: 'The upper-left corner is at (3, 7).' },
      D: { error: 'The student calculated side length as coordinates.', remediation: 'The coordinates are (3, 7).' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Shape Classification', subtopic_id: 287,
    question_text: 'Why are all parallelograms classified as quadrilaterals?',
    option_a: 'Because every parallelogram has exactly 4 sides', option_b: 'Because all quadrilaterals have parallel sides', option_c: 'Because they have right angles', option_d: 'Because they have equal diagonals',
    correct_answer: 'A',
    explanation: 'The definition of a quadrilateral is any closed polygon with 4 sides. Every parallelogram has 4 sides, so it is a quadrilateral.',
    distractor_diagnostics: {
      B: { error: 'The student reversed the statement.', remediation: 'Not all quadrilaterals have parallel sides (e.g. kites, trapezoids).' },
      C: { error: 'The student thought all parallelograms have right angles.', remediation: 'Only rectangles and squares have right angles.' },
      D: { error: 'The student cited diagonal length.', remediation: 'The defining property is having 4 sides.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Coordinate Plane', subtopic_id: 285,
    question_text: 'If you start at point (4, 2), move 3 units left and 5 units up, what is your new location?',
    option_a: '(1, 7)', option_b: '(7, 7)', option_c: '(1, -3)', option_d: '(7, -3)',
    correct_answer: 'A',
    explanation: 'Moving left subtracts from x: 4 - 3 = 1. Moving up adds to y: 2 + 5 = 7. New point = (1, 7).',
    distractor_diagnostics: {
      B: { error: 'The student added 3 to x instead of moving left.', remediation: 'Moving left means subtracting from x: 4 - 3 = 1.' },
      C: { error: 'The student subtracted from y instead of moving up.', remediation: 'Moving up means adding to y: 2 + 5 = 7.' },
      D: { error: 'The student added to x and subtracted from y.', remediation: 'Left = subtract from x (1), Up = add to y (7): (1, 7).' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Hierarchy of Shape', subtopic_id: 288,
    question_text: 'Which shape possesses ALL the properties of a polygon, a quadrilateral, a trapezoid, a parallelogram, a rectangle, and a rhombus?',
    option_a: 'Square', option_b: 'Circle', option_c: 'Equilateral triangle', option_d: 'Kite',
    correct_answer: 'A',
    explanation: 'The square sits at the bottom of the quadrilateral hierarchy and inherits the defining properties of all these categories.',
    distractor_diagnostics: {
      B: { error: 'The student chose circle.', remediation: 'A circle is not a polygon.' },
      C: { error: 'The student chose triangle.', remediation: 'Triangles have 3 sides.' },
      D: { error: 'The student chose kite.', remediation: 'A kite does not have parallel sides or right angles.' }
    }
  }
];

const g6Questions = [
  // Low (8)
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Triangles', subtopic_id: 289,
    question_text: 'What is the formula for the area of any triangle with base b and height h?',
    option_a: 'A = 1/2 × b × h', option_b: 'A = b × h', option_c: 'A = 2 × (b + h)', option_d: 'A = b + h',
    correct_answer: 'A',
    explanation: 'The area of any triangle is half the area of a parallelogram with the same base and height: A = 1/2 × b × h.',
    distractor_diagnostics: {
      B: { error: 'The student gave the formula for a rectangle/parallelogram.', remediation: 'A triangle is half of a parallelogram, so multiply by 1/2: A = 1/2 bh.' },
      C: { error: 'The student gave a perimeter formula.', remediation: 'Area measures surface area: 1/2 × base × height.' },
      D: { error: 'The student added base and height.', remediation: 'Multiply base and height, then divide by 2.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Triangles', subtopic_id: 289,
    question_text: 'A right triangle has a base of 8 cm and a height of 6 cm. What is its area?',
    option_a: '24 cm²', option_b: '48 cm²', option_c: '14 cm²', option_d: '28 cm²',
    correct_answer: 'A',
    explanation: 'A = 1/2 × b × h = 1/2 × 8 × 6 = 1/2 × 48 = 24 cm².',
    distractor_diagnostics: {
      B: { error: 'The student forgot to multiply by 1/2 (calculated 8 × 6 = 48).', remediation: 'Remember to divide by 2 for triangle area: 48 ÷ 2 = 24 cm².' },
      C: { error: 'The student added base and height (8 + 6 = 14).', remediation: 'Multiply base and height, then divide by 2: (8 × 6)/2 = 24.' },
      D: { error: 'The student made an arithmetic error.', remediation: '1/2 × 48 = 24 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Quadrilaterals', subtopic_id: 290,
    question_text: 'What is the area of a parallelogram with a base of 10 meters and a perpendicular height of 7 meters?',
    option_a: '70 m²', option_b: '35 m²', option_c: '34 m²', option_d: '17 m²',
    correct_answer: 'A',
    explanation: 'Area of a parallelogram = base × height = 10 × 7 = 70 m².',
    distractor_diagnostics: {
      B: { error: 'The student divided by 2 (used triangle formula).', remediation: 'A parallelogram does not divide by 2: Area = base × height = 70 m².' },
      C: { error: 'The student calculated perimeter: 2(10 + 7) = 34.', remediation: 'Area is multiplication: 10 × 7 = 70 m².' },
      D: { error: 'The student added base and height: 10 + 7 = 17.', remediation: 'Multiply base by height: 10 × 7 = 70 m².' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 294,
    question_text: 'What is the volume of a rectangular prism with length 5 cm, width 3 cm, and height 4 cm?',
    option_a: '60 cm³', option_b: '12 cm³', option_c: '24 cm³', option_d: '47 cm³',
    correct_answer: 'A',
    explanation: 'Volume = length × width × height = 5 × 3 × 4 = 15 × 4 = 60 cm³.',
    distractor_diagnostics: {
      B: { error: 'The student added the dimensions: 5 + 3 + 4 = 12.', remediation: 'Volume is found by MULTIPLYING all three dimensions: 5 × 3 × 4 = 60 cm³.' },
      C: { error: 'The student multiplied only two dimensions (6 × 4 = 24).', remediation: 'Multiply all three dimensions: 5 × 3 = 15, and 15 × 4 = 60.' },
      D: { error: 'The student calculated surface area.', remediation: 'Volume formula is V = l × w × h = 60 cm³.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Surface Area', subtopic_id: 293,
    question_text: 'What is the 2D flat pattern called that can be folded to form a 3D solid figure?',
    option_a: 'Net', option_b: 'Prism', option_c: 'Volume', option_d: 'Perimeter',
    correct_answer: 'A',
    explanation: 'A net is a 2-dimensional representation that unfolds all the faces of a 3D solid.',
    distractor_diagnostics: {
      B: { error: 'The student named the 3D solid itself.', remediation: 'The unfolded flat pattern is called a net.' },
      C: { error: 'The student chose volume.', remediation: 'Volume measures internal space; a net is the unfolded 2D surface.' },
      D: { error: 'The student chose perimeter.', remediation: 'The unfolded pattern is a net.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Surface Area', subtopic_id: 293,
    question_text: 'A cube has edge length 3 cm. What is the area of ONE of its faces?',
    option_a: '9 cm²', option_b: '27 cm²', option_c: '54 cm²', option_d: '12 cm²',
    correct_answer: 'A',
    explanation: 'Each face of a cube is a square: Area = side × side = 3 × 3 = 9 cm².',
    distractor_diagnostics: {
      B: { error: 'The student calculated volume (3³ = 27 cm³).', remediation: 'The question asks for the area of ONE face: 3 × 3 = 9 cm².' },
      C: { error: 'The student calculated total surface area of all 6 faces (6 × 9 = 54).', remediation: 'Read carefully: the area of a SINGLE face is 3 × 3 = 9 cm².' },
      D: { error: 'The student calculated perimeter of a face (4 × 3 = 12).', remediation: 'Area is side squared: 3 × 3 = 9 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Quadrilaterals', subtopic_id: 290,
    question_text: 'What is the area of a trapezoid with parallel bases b1 = 4 cm and b2 = 6 cm, and height h = 5 cm?',
    option_a: '25 cm²', option_b: '50 cm²', option_c: '20 cm²', option_d: '30 cm²',
    correct_answer: 'A',
    explanation: 'Area = 1/2 × (b1 + b2) × h = 1/2 × (4 + 6) × 5 = 1/2 × 10 × 5 = 25 cm².',
    distractor_diagnostics: {
      B: { error: 'The student forgot to multiply by 1/2 (calculated 10 × 5 = 50).', remediation: 'Take half of the sum of bases before multiplying by height: 1/2 × 10 × 5 = 25 cm².' },
      C: { error: 'The student multiplied 4 × 5.', remediation: 'Add both bases together: 4 + 6 = 10, then 1/2 × 10 × 5 = 25.' },
      D: { error: 'The student multiplied 6 × 5.', remediation: 'Use the trapezoid formula: A = ((b1 + b2)/2) × h = 25 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 294,
    question_text: 'A box has a base area of 20 square inches and a height of 6 inches. What is its volume?',
    option_a: '120 cubic inches', option_b: '26 cubic inches', option_c: '60 cubic inches', option_d: '240 cubic inches',
    correct_answer: 'A',
    explanation: 'Volume = Base Area × height = B × h = 20 × 6 = 120 cubic inches.',
    distractor_diagnostics: {
      B: { error: 'The student added 20 + 6 = 26.', remediation: 'Volume is base area MULTIPLIED by height: 20 × 6 = 120.' },
      C: { error: 'The student divided by 2.', remediation: 'Prism volume does not divide by 2: V = B × h = 120.' },
      D: { error: 'The student doubled the volume.', remediation: 'V = 20 × 6 = 120 cubic inches.' }
    }
  },

  // Medium (9)
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Area of Polygons', subtopic_id: 291,
    question_text: 'A composite polygon is made of a rectangle (6 cm by 4 cm) with a triangle on top (base 6 cm, height 3 cm). What is the TOTAL area?',
    option_a: '33 cm²', option_b: '42 cm²', option_c: '24 cm²', option_d: '51 cm²',
    correct_answer: 'A',
    explanation: 'Rectangle Area = 6 × 4 = 24 cm². Triangle Area = 1/2 × 6 × 3 = 9 cm². Total Area = 24 + 9 = 33 cm².',
    distractor_diagnostics: {
      B: { error: 'The student forgot to divide triangle area by 2 (24 + 18 = 42).', remediation: 'Triangle area is 1/2 × 6 × 3 = 9. Total = 24 + 9 = 33 cm².' },
      C: { error: 'The student calculated only the rectangle area (24).', remediation: 'Add the triangle area (9) to the rectangle area (24): 33 cm².' },
      D: { error: 'The student made an arithmetic error.', remediation: '24 + 9 = 33 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 294,
    question_text: 'A small cube has edge length 1/2 inch. How many of these small cubes are needed to completely fill a prism with dimensions 2 inches by 1 1/2 inches by 1 inch?',
    option_a: '24 small cubes', option_b: '12 small cubes', option_c: '3 small cubes', option_d: '48 small cubes',
    correct_answer: 'A',
    explanation: 'Dimensions in 1/2-inch units: length = 4 units, width = 3 units, height = 2 units. Number of cubes = 4 × 3 × 2 = 24 cubes. (Or Volume = 3 in³; cube vol = 1/8 in³; 3 ÷ 1/8 = 24).',
    distractor_diagnostics: {
      B: { error: 'The student multiplied dimensions without accounting for unit volume 1/8.', remediation: 'Along each dimension, double the inches to count 1/2-inch units: 4 × 3 × 2 = 24 cubes.' },
      C: { error: 'The student gave the volume in cubic inches instead of the cube count.', remediation: 'Volume is 3 in³, and each cube is 1/8 in³, so 3 ÷ 1/8 = 24 cubes.' },
      D: { error: 'The student doubled 24.', remediation: '4 × 3 × 2 = 24 small cubes.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Surface Area', subtopic_id: 293,
    question_text: 'What is the TOTAL surface area of a cube with an edge length of 4 cm?',
    option_a: '96 cm²', option_b: '64 cm²', option_c: '16 cm²', option_d: '24 cm²',
    correct_answer: 'A',
    explanation: 'A cube has 6 faces. Area of 1 face = 4 × 4 = 16 cm². Total surface area = 6 × 16 = 96 cm².',
    distractor_diagnostics: {
      B: { error: 'The student calculated volume (4³ = 64 cm³) instead of surface area.', remediation: 'Surface area is the sum of all 6 square faces: 6 × 4² = 6 × 16 = 96 cm².' },
      C: { error: 'The student found the area of only 1 face.', remediation: 'Multiply by 6 for all faces of the cube: 6 × 16 = 96 cm².' },
      D: { error: 'The student calculated 6 × 4 = 24.', remediation: 'Each face area is 4 × 4 = 16, so 6 × 16 = 96 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Area of Polygons', subtopic_id: 291,
    question_text: 'On a coordinate grid, a triangle has vertices at (2, 2), (8, 2), and (8, 7). What is the area of this triangle?',
    option_a: '15 square units', option_b: '30 square units', option_c: '11 square units', option_d: '25 square units',
    correct_answer: 'A',
    explanation: 'Base = 8 - 2 = 6 units. Height = 7 - 2 = 5 units. Area = 1/2 × base × height = 1/2 × 6 × 5 = 15 square units.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to multiply by 1/2: 6 × 5 = 30.', remediation: 'Triangle area is 1/2 × base × height: 1/2 × 30 = 15 square units.' },
      C: { error: 'The student added base and height: 6 + 5 = 11.', remediation: 'Multiply base and height, then divide by 2: (6 × 5)/2 = 15.' },
      D: { error: 'The student squared 5.', remediation: '1/2 × 6 × 5 = 15.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Area of Triangles', subtopic_id: 289,
    question_text: 'An obtuse triangle has a base of 12 inches. Its perpendicular height drawn outside the triangle is 5 inches. What is its area?',
    option_a: '30 square inches', option_b: '60 square inches', option_c: '17 square inches', option_d: '25 square inches',
    correct_answer: 'A',
    explanation: 'Regardless of whether height falls inside or outside, Area = 1/2 × b × h = 1/2 × 12 × 5 = 30 square inches.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to multiply by 1/2 (12 × 5 = 60).', remediation: 'Divide by 2 for triangle area: 60 ÷ 2 = 30 sq inches.' },
      C: { error: 'The student added 12 + 5 = 17.', remediation: 'Multiply base by height, then divide by 2: (12 × 5)/2 = 30.' },
      D: { error: 'The student made an arithmetic error.', remediation: '1/2 × 12 × 5 = 30.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Surface Area', subtopic_id: 293,
    question_text: 'A net of a square pyramid consists of which shapes?',
    option_a: '1 square base and 4 triangles', option_b: '2 squares and 4 rectangles', option_c: '4 triangles only', option_d: '1 square and 3 triangles',
    correct_answer: 'A',
    explanation: 'A square pyramid has 1 square base and 4 triangular side faces that fold up to meet at the apex.',
    distractor_diagnostics: {
      B: { error: 'The student described a rectangular prism net.', remediation: 'A pyramid has triangular sides that meet at a point, not rectangles.' },
      C: { error: 'The student described a triangular pyramid (tetrahedron).', remediation: 'A square pyramid must have a square base + 4 triangles.' },
      D: { error: 'The student omitted 1 triangle.', remediation: 'A square has 4 sides, so there are 4 triangular faces.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 294,
    question_text: 'What is the volume of a rectangular prism with length 3/4 ft, width 1/2 ft, and height 2/3 ft?',
    option_a: '1/4 cubic foot', option_b: '6/9 cubic foot', option_c: '6/24 cubic foot', option_d: '1/2 cubic foot',
    correct_answer: 'A',
    explanation: 'Multiply dimensions: (3/4) × (1/2) × (2/3) = (3 × 1 × 2) / (4 × 2 × 3) = 6/24 = 1/4 cubic foot.',
    distractor_diagnostics: {
      B: { error: 'The student added numerators and denominators.', remediation: 'Multiply straight across: 3/4 × 1/2 × 2/3 = 6/24 = 1/4.' },
      C: { error: 'The student found 6/24 but did not simplify to 1/4.', remediation: 'Always simplify: 6/24 reduces to 1/4 cubic foot.' },
      D: { error: 'The student made a fraction multiplication error.', remediation: 'Cancel out 3s and 2s to get 1/4.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Area of Polygons', subtopic_id: 291,
    question_text: 'On a coordinate plane, a rectangle has vertices at (-3, 2), (4, 2), (4, -3), and (-3, -3). What is the area of the rectangle?',
    option_a: '35 square units', option_b: '24 square units', option_c: '12 square units', option_d: '70 square units',
    correct_answer: 'A',
    explanation: 'Horizontal length = 4 - (-3) = 7 units. Vertical width = 2 - (-3) = 5 units. Area = 7 × 5 = 35 square units.',
    distractor_diagnostics: {
      B: { error: 'The student calculated perimeter: 2(7 + 5) = 24.', remediation: 'Area is length × width: 7 × 5 = 35 square units.' },
      C: { error: 'The student added length and width: 7 + 5 = 12.', remediation: 'Multiply dimensions for area: 7 × 5 = 35.' },
      D: { error: 'The student doubled the area.', remediation: 'Area = 7 × 5 = 35.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Surface Area', subtopic_id: 293,
    question_text: 'What is the surface area of a rectangular prism with length 5 cm, width 2 cm, and height 3 cm?',
    option_a: '62 cm²', option_b: '30 cm²', option_c: '31 cm²', option_d: '60 cm²',
    correct_answer: 'A',
    explanation: 'Surface Area = 2(lw + lh + wh) = 2(5×2 + 5×3 + 2×3) = 2(10 + 15 + 6) = 2(31) = 62 cm².',
    distractor_diagnostics: {
      B: { error: 'The student calculated volume: 5 × 2 × 3 = 30 cm³.', remediation: 'Surface area is the total area of all 6 faces: 2(10 + 15 + 6) = 62 cm².' },
      C: { error: 'The student added the 3 face areas without doubling for opposite faces.', remediation: 'There are 2 of each face: 2 × 31 = 62 cm².' },
      D: { error: 'The student doubled volume.', remediation: 'Use SA formula = 2(lw + lh + wh) = 62 cm².' }
    }
  },

  // High (8)
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Surface Area', subtopic_id: 293,
    question_text: 'A triangular prism has a net with two equilateral triangle bases (base 4 cm, height 3.5 cm) and three identical rectangle side faces (4 cm by 10 cm). What is the TOTAL surface area?',
    option_a: '134 cm²', option_b: '120 cm²', option_c: '148 cm²', option_d: '127 cm²',
    correct_answer: 'A',
    explanation: 'Area of 2 triangles = 2 × (1/2 × 4 × 3.5) = 14 cm². Area of 3 rectangles = 3 × (4 × 10) = 120 cm². Total Surface Area = 14 + 120 = 134 cm².',
    distractor_diagnostics: {
      B: { error: 'The student calculated only the rectangular faces (120 cm²), omitting both triangular bases.', remediation: 'Add the areas of the two triangular ends: 120 + 14 = 134 cm².' },
      C: { error: 'The student calculated triangles without dividing by 2.', remediation: 'Each triangle area is 1/2 × 4 × 3.5 = 7 cm²; both triangles = 14 cm².' },
      D: { error: 'The student included only 1 triangular base.', remediation: 'A prism has two triangular bases: 7 + 7 = 14 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 294,
    question_text: 'A rectangular fish tank is 2 1/2 feet long, 1 1/4 feet wide, and 1 1/2 feet high. What is the total volume of water it can hold when full?',
    option_a: '4 11/16 cubic feet', option_b: '4 3/8 cubic feet', option_c: '5 1/4 cubic feet', option_d: '3 5/8 cubic feet',
    correct_answer: 'A',
    explanation: 'Convert to improper fractions: 5/2 × 5/4 × 3/2 = (5 × 5 × 3) / (2 × 4 × 2) = 75/16 = 4 11/16 cubic feet.',
    distractor_diagnostics: {
      B: { error: 'The student miscalculated the fraction product.', remediation: 'Multiply all three: 5/2 × 5/4 × 3/2 = 75/16 = 4 11/16 cu ft.' },
      C: { error: 'The student added the fractions.', remediation: 'Multiply length × width × height to calculate volume.' },
      D: { error: 'The student made an arithmetic error in 75 ÷ 16.', remediation: '16 × 4 = 64; 75 - 64 = 11, giving 4 11/16.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Area of Polygons', subtopic_id: 291,
    question_text: 'On a coordinate grid, a polygon has vertices at A(1, 4), B(5, 4), C(7, 1), and D(1, 1). What is the area of this trapezoid?',
    option_a: '15 square units', option_b: '18 square units', option_c: '30 square units', option_d: '12 square units',
    correct_answer: 'A',
    explanation: 'Top base b1 = 5 - 1 = 4. Bottom base b2 = 7 - 1 = 6. Height h = 4 - 1 = 3. Area = 1/2 × (b1 + b2) × h = 1/2 × (4 + 6) × 3 = 1/2 × 10 × 3 = 15 square units.',
    distractor_diagnostics: {
      B: { error: 'The student used 6 × 3 = 18 without averaging bases.', remediation: 'Use the trapezoid formula: A = ((b1 + b2)/2) × h = (10/2) × 3 = 15.' },
      C: { error: 'The student forgot to divide by 2: 10 × 3 = 30.', remediation: 'Multiply the average of bases by height: 5 × 3 = 15 square units.' },
      D: { error: 'The student used 4 × 3 = 12.', remediation: 'Both bases must be included: 1/2 × (4 + 6) × 3 = 15.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Area of Polygons', subtopic_id: 291,
    question_text: 'A wall is 12 feet long and 9 feet high. It has a rectangular window measuring 4 feet by 3 feet. What is the area of the wall that needs to be painted (excluding the window)?',
    option_a: '96 square feet', option_b: '108 square feet', option_c: '12 square feet', option_d: '92 square feet',
    correct_answer: 'A',
    explanation: 'Total wall area = 12 × 9 = 108 sq ft. Window area = 4 × 3 = 12 sq ft. Paint area = 108 - 12 = 96 sq ft.',
    distractor_diagnostics: {
      B: { error: 'The student calculated total wall area without subtracting the window.', remediation: 'Subtract the window cutout: 108 - 12 = 96 sq ft.' },
      C: { error: 'The student gave only the window area.', remediation: 'Subtract window from wall: 108 - 12 = 96 sq ft.' },
      D: { error: 'The student made an arithmetic subtraction error.', remediation: '108 - 12 = 96 sq ft.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Surface Area', subtopic_id: 293,
    question_text: 'A cardboard box with NO LID (open top) has length 10 inches, width 6 inches, and height 4 inches. What is the surface area of the cardboard used?',
    option_a: '188 square inches', option_b: '248 square inches', option_c: '240 square inches', option_d: '128 square inches',
    correct_answer: 'A',
    explanation: 'Bottom = 10 × 6 = 60. Front & Back = 2 × (10 × 4) = 80. Left & Right = 2 × (6 × 4) = 48. Open top has no lid. Total = 60 + 80 + 48 = 188 sq inches.',
    distractor_diagnostics: {
      B: { error: 'The student included the top lid (calculated full closed box SA = 248).', remediation: 'The box has no lid, so subtract the top face (60): 248 - 60 = 188 sq inches.' },
      C: { error: 'The student calculated volume: 10 × 6 × 4 = 240 cu inches.', remediation: 'Calculate the area of the 5 open-box faces: 60 + 80 + 48 = 188 sq in.' },
      D: { error: 'The student omitted both front and back faces.', remediation: 'Add all 5 faces: bottom (60) + two sides (48) + front & back (80) = 188.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 294,
    question_text: 'A rectangular container with volume 84 cubic feet has a length of 7 feet and a width of 4 feet. What is the HEIGHT of the container?',
    option_a: '3 feet', option_b: '4 feet', option_c: '28 feet', option_d: '6 feet',
    correct_answer: 'A',
    explanation: 'Base Area = 7 × 4 = 28 sq ft. Height = Volume ÷ Base Area = 84 ÷ 28 = 3 feet.',
    distractor_diagnostics: {
      B: { error: 'The student guessed 4 feet.', remediation: 'Check: 7 × 4 × 4 = 112, which is too large. 84 ÷ 28 = 3 feet.' },
      C: { error: 'The student calculated the base area (28) instead of height.', remediation: 'Divide volume by base area: 84 ÷ 28 = 3 feet.' },
      D: { error: 'The student divided 84 by 14.', remediation: 'Divide 84 by 28: 84 ÷ 28 = 3 feet.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Area of Polygons', subtopic_id: 291,
    question_text: 'A regular hexagon can be decomposed into 6 identical equilateral triangles. If each triangle has an area of 14 cm², what is the total area of the hexagon?',
    option_a: '84 cm²', option_b: '70 cm²', option_c: '42 cm²', option_d: '96 cm²',
    correct_answer: 'A',
    explanation: 'Multiply the area of one triangle by 6: 6 × 14 = 84 cm².',
    distractor_diagnostics: {
      B: { error: 'The student multiplied by 5.', remediation: 'A hexagon has 6 triangles: 6 × 14 = 84 cm².' },
      C: { error: 'The student multiplied by 3.', remediation: 'All 6 triangles make up the full hexagon: 6 × 14 = 84 cm².' },
      D: { error: 'The student made a multiplication error.', remediation: '6 × 14 = 84 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Area of Triangles', subtopic_id: 289,
    question_text: 'If you double BOTH the base and the height of a triangle, how does its area change?',
    option_a: 'The area becomes 4 times larger', option_b: 'The area doubles (2 times larger)', option_c: 'The area becomes 8 times larger', option_d: 'The area stays the same',
    correct_answer: 'A',
    explanation: 'New Area = 1/2 × (2b) × (2h) = 4 × (1/2 bh) = 4 times the original area.',
    distractor_diagnostics: {
      B: { error: 'The student thought doubling linear dimensions only doubles area.', remediation: 'Area is 2-dimensional: doubling both dimensions multiplies area by 2 × 2 = 4.' },
      C: { error: 'The student cubed the factor (confused with 3D volume).', remediation: 'For 2D area, scale factor squared is 2² = 4.' },
      D: { error: 'The student thought area is unchanged.', remediation: 'Scaling base and height directly scales the area by factor 4.' }
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

  const allQuestions = [...g5Questions, ...g6Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 5 & Grade 6 Geometry...`);

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

  console.log(`Grade 5 & 6 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
