const mysql = require('mysql2/promise');
require('dotenv').config();

const g1Questions = [
  // Low (8)
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'Which shape has exactly 3 straight sides and 3 corners?',
    option_a: 'Triangle', option_b: 'Square', option_c: 'Circle', option_d: 'Rectangle',
    correct_answer: 'A',
    explanation: 'A triangle is a closed shape with exactly 3 straight sides and 3 corners (vertices).',
    distractor_diagnostics: {
      B: { error: 'The student selected a square, which has 4 sides and 4 corners.', remediation: 'Count the sides: a triangle has 3 sides, while a square has 4 sides.' },
      C: { error: 'The student selected a circle, which has curved sides and 0 corners.', remediation: 'A circle has no straight sides and no corners.' },
      D: { error: 'The student selected a rectangle, which has 4 straight sides.', remediation: 'Triangles have 3 sides, rectangles have 4 sides.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'Which of the following is a DEFINING attribute of a square?',
    option_a: 'It has 4 equal straight sides and 4 square corners', option_b: 'It is colored blue', option_c: 'It is very large', option_d: 'It is turned sideways',
    correct_answer: 'A',
    explanation: 'Defining attributes determine what a shape is (4 equal sides, 4 square corners). Color and size do not change the shape name.',
    distractor_diagnostics: {
      B: { error: 'The student confused color (non-defining) with a defining attribute.', remediation: 'A square can be any color; color does not define the shape.' },
      C: { error: 'The student confused size with a defining attribute.', remediation: 'A square can be big or small; size does not change its shape.' },
      D: { error: 'The student confused orientation with a defining attribute.', remediation: 'Turning a shape does not change what shape it is.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'Which 3D solid shape looks like a party hat or ice cream cone?',
    option_a: 'Cone', option_b: 'Cube', option_c: 'Cylinder', option_d: 'Sphere',
    correct_answer: 'A',
    explanation: 'A cone has a flat circular base and points to a single tip (vertex) at the top, like an ice cream cone.',
    distractor_diagnostics: {
      B: { error: 'The student selected a cube, which looks like a box with square faces.', remediation: 'A cube has 6 flat square faces, like a playing die.' },
      C: { error: 'The student selected a cylinder, which looks like a can with two circular faces.', remediation: 'A cylinder has 2 circular bases and does not point to a tip.' },
      D: { error: 'The student selected a sphere, which is completely round like a ball.', remediation: 'A sphere has no flat faces and no tip.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'Which 3D solid shape has 6 flat square faces that are all the same size?',
    option_a: 'Cube', option_b: 'Cylinder', option_c: 'Cone', option_d: 'Sphere',
    correct_answer: 'A',
    explanation: 'A cube has 6 identical flat square faces, 12 edges, and 8 vertices.',
    distractor_diagnostics: {
      B: { error: 'The student selected a cylinder.', remediation: 'A cylinder has only 2 circular flat faces and 1 curved surface.' },
      C: { error: 'The student selected a cone.', remediation: 'A cone has only 1 flat face and 1 point.' },
      D: { error: 'The student selected a sphere.', remediation: 'A sphere has 0 flat faces.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Halves & Fourths', subtopic_id: 271,
    question_text: 'A round cookie is cut into 2 EQUAL parts. What do we call each part?',
    option_a: 'One half', option_b: 'One fourth', option_c: 'One third', option_d: 'One whole',
    correct_answer: 'A',
    explanation: 'When a whole is divided into 2 equal shares, each share is called one half.',
    distractor_diagnostics: {
      B: { error: 'The student confused halves (2 parts) with fourths (4 parts).', remediation: 'Halves mean 2 equal parts; fourths mean 4 equal parts.' },
      C: { error: 'The student confused halves with thirds (3 parts).', remediation: '2 equal parts are called halves.' },
      D: { error: 'The student chose whole instead of the part.', remediation: 'The whole cookie was cut, so each piece is a half.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Halves & Fourths', subtopic_id: 271,
    question_text: 'How many equal fourths make up one whole circle?',
    option_a: '4', option_b: '2', option_c: '3', option_d: '1',
    correct_answer: 'A',
    explanation: 'Four fourths combine together to make 1 whole: 4/4 = 1.',
    distractor_diagnostics: {
      B: { error: 'The student confused fourths with halves (2 halves = 1 whole).', remediation: 'Fourths come in groups of 4 to make 1 whole.' },
      C: { error: 'The student guessed 3.', remediation: 'Fourths means 4 equal pieces.' },
      D: { error: 'The student stated 1 instead of counting all pieces.', remediation: 'It takes 4 fourths pieces to make the complete circle.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'Which shape is a closed shape with NO straight sides and NO corners?',
    option_a: 'Circle', option_b: 'Rectangle', option_c: 'Square', option_d: 'Triangle',
    correct_answer: 'A',
    explanation: 'A circle is completely round with zero straight sides and zero corners.',
    distractor_diagnostics: {
      B: { error: 'The student chose rectangle.', remediation: 'Rectangles have 4 straight sides and 4 corners.' },
      C: { error: 'The student chose square.', remediation: 'Squares have 4 straight sides.' },
      D: { error: 'The student chose triangle.', remediation: 'Triangles have 3 straight sides.' }
    }
  },
  {
    grade: 1, difficulty: 'Low', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'What 3D solid shape is shaped like a soup can?',
    option_a: 'Cylinder', option_b: 'Cube', option_c: 'Cone', option_d: 'Pyramid',
    correct_answer: 'A',
    explanation: 'A cylinder has two flat circular faces at top and bottom with a smooth curved body, like a soup can.',
    distractor_diagnostics: {
      B: { error: 'The student chose cube.', remediation: 'A cube has square flat faces, not circular.' },
      C: { error: 'The student chose cone.', remediation: 'A cone comes to a point, but a soup can is flat on both ends.' },
      D: { error: 'The student chose pyramid.', remediation: 'Pyramids have triangular faces.' }
    }
  },

  // Medium (9)
  {
    grade: 1, difficulty: 'Medium', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'If you put two identical right triangles together along their longest sides, which shape can you make?',
    option_a: 'Rectangle', option_b: 'Circle', option_c: 'Cone', option_d: 'Hexagon',
    correct_answer: 'A',
    explanation: 'Combining two right triangles along their diagonals creates a 4-sided rectangle.',
    distractor_diagnostics: {
      B: { error: 'The student chose circle.', remediation: 'Triangles have straight sides and cannot form a curved circle.' },
      C: { error: 'The student chose a 3D solid (cone) from 2D shapes.', remediation: 'Putting flat 2D shapes together makes another flat 2D shape.' },
      D: { error: 'The student chose hexagon (6 sides).', remediation: 'Two triangles have fewer sides and form a 4-sided rectangle.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Halves & Fourths', subtopic_id: 271,
    question_text: 'Which is larger: one half of a sandwich or one fourth of the SAME sandwich?',
    option_a: 'One half of the sandwich', option_b: 'One fourth of the sandwich', option_c: 'They are the exact same size', option_d: 'Cannot be determined',
    correct_answer: 'A',
    explanation: 'Cutting into fewer pieces (2) leaves bigger pieces than cutting into more pieces (4). One half is larger than one fourth.',
    distractor_diagnostics: {
      B: { error: 'The student thought fourth is larger because 4 is greater than 2.', remediation: 'Sharing among more pieces makes each piece SMALLER.' },
      C: { error: 'The student assumed all fraction shares are equal.', remediation: 'Halves (2 pieces) are twice as large as fourths (4 pieces).' },
      D: { error: 'The student thought it cannot be compared.', remediation: 'When referring to the same whole, halves are always bigger than fourths.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'A shape has 4 straight sides. Two opposite sides are long, and the other two opposite sides are short. All 4 corners are square corners. What shape is it?',
    option_a: 'Rectangle', option_b: 'Square', option_c: 'Triangle', option_d: 'Rhombus',
    correct_answer: 'A',
    explanation: 'A rectangle has 4 square corners and opposite sides that are equal (long sides and short sides).',
    distractor_diagnostics: {
      B: { error: 'The student chose square, but a square must have all 4 sides equal in length.', remediation: 'In a square, all 4 sides are equal; this shape has long and short sides.' },
      C: { error: 'The student chose triangle.', remediation: 'Triangles have only 3 sides.' },
      D: { error: 'The student chose rhombus.', remediation: 'A rhombus has all 4 sides equal and does not require square corners.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'Which of the following is NOT an open shape?',
    option_a: 'A complete circle with connected line', option_b: 'A circle with a gap in the line', option_c: 'A horseshoe shape', option_d: 'A letter U',
    correct_answer: 'A',
    explanation: 'A complete circle is a CLOSED shape because its outline connects all the way around with no gaps.',
    distractor_diagnostics: {
      B: { error: 'The student chose a shape with a gap.', remediation: 'A gap means the shape is open, not closed.' },
      C: { error: 'The student selected an open curve.', remediation: 'A horseshoe has open ends.' },
      D: { error: 'The student selected an open letter.', remediation: 'The letter U is open at the top.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'How many flat circular faces does a cylinder have?',
    option_a: '2', option_b: '1', option_c: '0', option_d: '6',
    correct_answer: 'A',
    explanation: 'A cylinder has 2 flat circular faces (one on the top and one on the bottom).',
    distractor_diagnostics: {
      B: { error: 'The student chose 1 (confused cylinder with cone).', remediation: 'A cone has 1 flat face, but a cylinder has 2 (top and bottom).' },
      C: { error: 'The student chose 0 (confused with sphere).', remediation: 'A cylinder has 2 flat circle ends.' },
      D: { error: 'The student chose 6 (confused with cube).', remediation: 'A cube has 6 flat faces, a cylinder has 2.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Halves & Fourths', subtopic_id: 271,
    question_text: 'Ali divides a rectangle into 2 parts. One part is very big and one part is very small. Are the parts halves?',
    option_a: 'No, because halves must be EQUAL in size', option_b: 'Yes, because there are 2 parts', option_c: 'Yes, because it is a rectangle', option_d: 'No, because rectangles cannot have halves',
    correct_answer: 'A',
    explanation: 'To be called halves, the 2 parts must be equal in area and size.',
    distractor_diagnostics: {
      B: { error: 'The student thought any 2 pieces are halves regardless of equality.', remediation: 'Halves MUST be equal shares. Unequal pieces cannot be called halves.' },
      C: { error: 'The student based the answer on the shape name.', remediation: 'The parts must be equal shares.' },
      D: { error: 'The student thought rectangles cannot be divided into halves.', remediation: 'Rectangles can easily be divided in half down the middle.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'Which 3D solid shape can roll smoothly in ANY direction?',
    option_a: 'Sphere', option_b: 'Cylinder', option_c: 'Cube', option_d: 'Cone',
    correct_answer: 'A',
    explanation: 'A sphere is completely round in all directions like a basketball, so it rolls in any direction.',
    distractor_diagnostics: {
      B: { error: 'The student chose cylinder.', remediation: 'A cylinder rolls only along its curved side, not on its flat ends.' },
      C: { error: 'The student chose cube.', remediation: 'A cube has flat square faces and slides or tumbles, it does not roll.' },
      D: { error: 'The student chose cone.', remediation: 'A cone rolls in a circle around its tip.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'Which shape has 6 straight sides and 6 vertices?',
    option_a: 'Hexagon', option_b: 'Pentagon', option_c: 'Square', option_d: 'Octagon',
    correct_answer: 'A',
    explanation: 'A hexagon is a 2D closed polygon that has exactly 6 straight sides and 6 vertices.',
    distractor_diagnostics: {
      B: { error: 'The student chose pentagon.', remediation: 'A pentagon has 5 sides and 5 vertices.' },
      C: { error: 'The student chose square.', remediation: 'A square has 4 sides.' },
      D: { error: 'The student chose octagon.', remediation: 'An octagon has 8 sides like a stop sign.' }
    }
  },
  {
    grade: 1, difficulty: 'Medium', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'If you trace the bottom flat face of a soup can on paper, what 2D shape will you draw?',
    option_a: 'Circle', option_b: 'Square', option_c: 'Triangle', option_d: 'Oval',
    correct_answer: 'A',
    explanation: 'The flat face of a cylinder is a circle.',
    distractor_diagnostics: {
      B: { error: 'The student chose square.', remediation: 'Tracing a cube makes a square; tracing a cylinder makes a circle.' },
      C: { error: 'The student chose triangle.', remediation: 'A cylinder has round circle ends with no straight sides.' },
      D: { error: 'The student chose oval.', remediation: 'The base of a cylinder is a perfect circle.' }
    }
  },

  // High (8)
  {
    grade: 1, difficulty: 'High', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'How many smaller triangles can be put together to compose a regular hexagon using pattern blocks?',
    option_a: '6 green triangles', option_b: '4 green triangles', option_c: '3 green triangles', option_d: '8 green triangles',
    correct_answer: 'A',
    explanation: '6 equilateral green triangles fit together around a center point to compose 1 yellow hexagon.',
    distractor_diagnostics: {
      B: { error: 'The student thought 4 triangles make a hexagon.', remediation: 'A hexagon has 6 sides; 6 triangles are needed to fill it completely.' },
      C: { error: 'The student chose 3 triangles (confused with 3 triangles making a trapezoid).', remediation: '3 triangles make a trapezoid (half of a hexagon).' },
      D: { error: 'The student chose 8 triangles.', remediation: 'Count the 6 triangular sections meeting at the center.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Halves & Fourths', subtopic_id: 271,
    question_text: 'Zain has a square paper. He folds it diagonally from corner to corner and cuts it. What shapes are the two equal halves?',
    option_a: '2 Triangles', option_b: '2 Rectangles', option_c: '2 Smaller squares', option_d: '2 Circles',
    correct_answer: 'A',
    explanation: 'Folding a square along its diagonal divides it into 2 equal right triangles.',
    distractor_diagnostics: {
      B: { error: 'The student thought folding diagonally makes rectangles.', remediation: 'Folding side-to-side makes rectangles; folding corner-to-corner makes triangles.' },
      C: { error: 'The student thought it makes smaller squares.', remediation: 'Cutting along a diagonal creates 3-sided triangles.' },
      D: { error: 'The student chose circles.', remediation: 'Straight cuts cannot create curved circles.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'A student looks at a shape and says: "This is NOT a triangle because it is pointing down." Is the student correct?',
    option_a: 'No, because orientation does not change a shape if it still has 3 closed straight sides', option_b: 'Yes, triangles must always point straight up', option_c: 'Yes, upside-down shapes change their name', option_d: 'No, but only if it is blue',
    correct_answer: 'A',
    explanation: 'Orientation is a non-defining attribute. Any closed shape with 3 straight sides is a triangle, no matter which direction it points.',
    distractor_diagnostics: {
      B: { error: 'The student believes triangles must point up.', remediation: 'A triangle can point up, down, left, or right; orientation does not matter.' },
      C: { error: 'The student thinks turning a shape changes its identity.', remediation: 'Rotating a shape keeps it the same geometric shape.' },
      D: { error: 'The student attached color as a requirement.', remediation: 'Color is never a defining attribute of geometric shapes.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'Which 3D solid has 1 flat circular face and 1 sharp vertex at the top?',
    option_a: 'Cone', option_b: 'Cylinder', option_c: 'Pyramid', option_d: 'Prism',
    correct_answer: 'A',
    explanation: 'A cone has exactly 1 flat circular face and 1 vertex.',
    distractor_diagnostics: {
      B: { error: 'The student chose cylinder.', remediation: 'A cylinder has 2 flat circular faces and 0 sharp vertices.' },
      C: { error: 'The student chose pyramid.', remediation: 'A pyramid has a polygon base (like a square or triangle), not a circular face.' },
      D: { error: 'The student chose prism.', remediation: 'Prisms have polygon faces and 2 identical bases.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Halves & Fourths', subtopic_id: 271,
    question_text: 'Four friends want to share a large square pizza equally. How should they cut it so each friend gets a fair share?',
    option_a: 'Cut it into 4 equal quarters', option_b: 'Cut it into 2 equal halves', option_c: 'Cut it into 3 equal pieces', option_d: 'Cut it into 4 different sized pieces',
    correct_answer: 'A',
    explanation: 'Sharing among 4 friends equally requires partitioning the pizza into 4 equal fourths (quarters).',
    distractor_diagnostics: {
      B: { error: 'The student chose 2 halves, which provides only 2 pieces for 4 friends.', remediation: '4 friends need 4 equal pieces (fourths).' },
      C: { error: 'The student chose 3 pieces.', remediation: '4 people need 4 shares.' },
      D: { error: 'The student allowed different sizes.', remediation: 'Fair sharing requires all 4 pieces to be equal in size.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Shapes & Attributes', subtopic_id: 268,
    question_text: 'What is the total number of corners (vertices) on two separate triangles combined?',
    option_a: '6 corners', option_b: '5 corners', option_c: '3 corners', option_d: '8 corners',
    correct_answer: 'A',
    explanation: 'Each triangle has 3 corners. Two triangles have 3 + 3 = 6 corners.',
    distractor_diagnostics: {
      B: { error: 'The student made an addition error (3 + 2 = 5).', remediation: 'Add the corners of both triangles: 3 + 3 = 6 corners.' },
      C: { error: 'The student counted corners for only 1 triangle.', remediation: 'Multiply by 2 for two triangles: 2 × 3 = 6.' },
      D: { error: 'The student counted 4 corners per triangle.', remediation: 'Triangles have 3 corners, not 4.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: '2D & 3D Shapes', subtopic_id: 269,
    question_text: 'How many edges does a cube have in total?',
    option_a: '12 edges', option_b: '6 edges', option_c: '8 edges', option_d: '4 edges',
    correct_answer: 'A',
    explanation: 'A cube has 6 faces, 8 vertices (corners), and 12 straight edges.',
    distractor_diagnostics: {
      B: { error: 'The student confused edges with faces (a cube has 6 faces).', remediation: 'A cube has 6 faces, but 12 straight edges where faces meet.' },
      C: { error: 'The student confused edges with vertices (corners).', remediation: 'A cube has 8 corners and 12 edges.' },
      D: { error: 'The student counted edges on only 1 square face.', remediation: 'Count all edges around top, bottom, and vertical sides: 4 + 4 + 4 = 12.' }
    }
  },
  {
    grade: 1, difficulty: 'High', subtopic_name: 'Halves & Fourths', subtopic_id: 271,
    question_text: 'Sara cuts an apple in half. Then she cuts each half in half again. How many equal pieces does Sara have now?',
    option_a: '4 equal fourths', option_b: '2 equal halves', option_c: '3 pieces', option_d: '8 pieces',
    correct_answer: 'A',
    explanation: 'Cutting each of the 2 halves in half produces 2 × 2 = 4 equal fourths.',
    distractor_diagnostics: {
      B: { error: 'The student stopped after the first cut (2 halves).', remediation: 'Cutting the halves again doubles the number of pieces to 4.' },
      C: { error: 'The student miscounted pieces.', remediation: '2 pieces cut in half make 4 equal pieces.' },
      D: { error: 'The student doubled twice.', remediation: 'Only one additional cut was made, producing 4 fourths.' }
    }
  }
];

const g2Questions = [
  // Low (8)
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'Which shape is a polygon with exactly 5 sides and 5 angles?',
    option_a: 'Pentagon', option_b: 'Hexagon', option_c: 'Quadrilateral', option_d: 'Triangle',
    correct_answer: 'A',
    explanation: 'A pentagon is a 5-sided polygon with 5 interior angles.',
    distractor_diagnostics: {
      B: { error: 'The student chose hexagon (6 sides).', remediation: 'A hexagon has 6 sides; a pentagon has 5 sides.' },
      C: { error: 'The student chose quadrilateral (4 sides).', remediation: 'Quadrilaterals have 4 sides; pentagons have 5.' },
      D: { error: 'The student chose triangle (3 sides).', remediation: 'Triangles have 3 sides.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'Which shape has exactly 6 sides and 6 angles?',
    option_a: 'Hexagon', option_b: 'Pentagon', option_c: 'Octagon', option_d: 'Trapezoid',
    correct_answer: 'A',
    explanation: 'A hexagon has 6 straight sides and 6 angles.',
    distractor_diagnostics: {
      B: { error: 'The student chose pentagon (5 sides).', remediation: 'Hexagons have 6 sides; pentagons have 5.' },
      C: { error: 'The student chose octagon (8 sides).', remediation: 'Octagons have 8 sides.' },
      D: { error: 'The student chose trapezoid (4 sides).', remediation: 'A trapezoid has 4 sides.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Equal Rows & Columns', subtopic_id: 273,
    question_text: 'A rectangle is partitioned into 3 rows and 4 columns of same-size squares. How many total squares are there?',
    option_a: '12 squares', option_b: '7 squares', option_c: '14 squares', option_d: '16 squares',
    correct_answer: 'A',
    explanation: 'Multiply rows by columns: 3 rows × 4 columns = 12 total squares (or 4 + 4 + 4 = 12).',
    distractor_diagnostics: {
      B: { error: 'The student added rows and columns (3 + 4 = 7) instead of multiplying.', remediation: 'Count by rows: each row has 4 squares, so 4 + 4 + 4 = 12 squares.' },
      C: { error: 'The student added 3 + 4 and doubled it (perimeter confusion).', remediation: 'Total squares inside the grid is rows × columns = 12.' },
      D: { error: 'The student calculated 4 × 4 = 16.', remediation: 'There are only 3 rows: 3 × 4 = 12.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Fractions of Shapes', subtopic_id: 274,
    question_text: 'A circular pie is divided into 3 equal slices. What fraction word describes each slice?',
    option_a: 'One third', option_b: 'One half', option_c: 'One fourth', option_d: 'One fifth',
    correct_answer: 'A',
    explanation: 'When a shape is divided into 3 equal shares, each share is called one third.',
    distractor_diagnostics: {
      B: { error: 'The student chose half (2 parts).', remediation: 'Halves are 2 equal parts; 3 equal parts are called thirds.' },
      C: { error: 'The student chose fourth (4 parts).', remediation: 'Fourths are 4 parts; thirds are 3 parts.' },
      D: { error: 'The student chose fifth.', remediation: '3 parts are called thirds.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'How many angles does any quadrilateral have?',
    option_a: '4 angles', option_b: '3 angles', option_c: '5 angles', option_d: '6 angles',
    correct_answer: 'A',
    explanation: 'The prefix "quad" means four. Every quadrilateral has 4 straight sides and 4 angles.',
    distractor_diagnostics: {
      B: { error: 'The student chose 3 (confused with triangle).', remediation: 'Triangles have 3 angles; quadrilaterals have 4.' },
      C: { error: 'The student chose 5 (confused with pentagon).', remediation: 'Pentagons have 5 angles; quadrilaterals have 4.' },
      D: { error: 'The student chose 6.', remediation: 'Quadrilaterals always have 4 angles.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Equal Rows & Columns', subtopic_id: 273,
    question_text: 'An array of square tiles has 2 rows with 5 tiles in each row. Which addition sentence shows the total number of tiles?',
    option_a: '5 + 5 = 10', option_b: '2 + 5 = 7', option_c: '2 + 2 = 4', option_d: '5 + 5 + 5 = 15',
    correct_answer: 'A',
    explanation: '2 rows of 5 tiles means repeated addition of 5 two times: 5 + 5 = 10.',
    distractor_diagnostics: {
      B: { error: 'The student added the row count to the column count.', remediation: 'Each row contains 5 tiles, so add 5 + 5 = 10.' },
      C: { error: 'The student repeated the row count only 2 times.', remediation: 'There are 5 tiles per row, so add 5s.' },
      D: { error: 'The student added 3 rows instead of 2.', remediation: 'There are only 2 rows: 5 + 5 = 10.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Fractions of Shapes', subtopic_id: 274,
    question_text: 'How many equal thirds make one whole rectangle?',
    option_a: '3 thirds', option_b: '2 thirds', option_c: '4 thirds', option_d: '1 third',
    correct_answer: 'A',
    explanation: 'Three thirds combine to form the complete whole: 3/3 = 1.',
    distractor_diagnostics: {
      B: { error: 'The student chose 2.', remediation: '3 equal parts (thirds) are needed to make 1 whole.' },
      C: { error: 'The student chose 4.', remediation: 'Four fourths make 1 whole; three thirds make 1 whole.' },
      D: { error: 'The student selected a single part.', remediation: 'All 3 thirds are needed to complete the whole.' }
    }
  },
  {
    grade: 2, difficulty: 'Low', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'How many faces does a cube have?',
    option_a: '6 faces', option_b: '8 faces', option_c: '12 faces', option_d: '4 faces',
    correct_answer: 'A',
    explanation: 'A cube has 6 flat square faces (top, bottom, and 4 sides).',
    distractor_diagnostics: {
      B: { error: 'The student confused faces with vertices (corners).', remediation: 'A cube has 8 corners, but 6 flat faces.' },
      C: { error: 'The student confused faces with edges.', remediation: 'A cube has 12 edges, but 6 faces.' },
      D: { error: 'The student counted only side faces.', remediation: 'Include the top and bottom faces: 4 + 2 = 6 faces.' }
    }
  },

  // Medium (9)
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'Which group contains ONLY shapes that are quadrilaterals?',
    option_a: 'Square, Rectangle, Trapezoid, Rhombus', option_b: 'Triangle, Square, Hexagon', option_c: 'Pentagon, Rectangle, Circle', option_d: 'Cube, Cylinder, Cone',
    correct_answer: 'A',
    explanation: 'A quadrilateral must have exactly 4 sides. Square, rectangle, trapezoid, and rhombus are all 4-sided polygons.',
    distractor_diagnostics: {
      B: { error: 'The student included triangle (3 sides) and hexagon (6 sides).', remediation: 'Quadrilaterals must have exactly 4 sides.' },
      C: { error: 'The student included pentagon (5 sides) and circle.', remediation: 'All shapes in the group must have 4 straight sides.' },
      D: { error: 'The student selected 3D solids instead of 2D quadrilaterals.', remediation: 'Quadrilaterals are flat 2D polygons.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Fractions of Shapes', subtopic_id: 274,
    question_text: 'Two identical square sheets of paper are folded in half. Sheet A is folded into two rectangles. Sheet B is folded diagonally into two triangles. Are the halves of Sheet A equal in area to the halves of Sheet B?',
    option_a: 'Yes, because both represent one half of identical whole squares', option_b: 'No, because triangles can never equal rectangles in area', option_c: 'No, because triangles have 3 sides and rectangles have 4', option_d: 'Cannot be determined',
    correct_answer: 'A',
    explanation: 'Equal shares of identical wholes have the same area, even if they have different shapes (both are half of the same square).',
    distractor_diagnostics: {
      B: { error: 'The student assumed different shapes must have different areas.', remediation: 'Two shapes with different appearances can have the exact same area.' },
      C: { error: 'The student confused side count with area.', remediation: 'Area is the amount of surface; both are half of the same whole.' },
      D: { error: 'The student thought it is unknown.', remediation: 'Since the whole squares are identical, half of each is identical in area.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Equal Rows & Columns', subtopic_id: 273,
    question_text: 'A grid has 4 rows and 5 columns of square units. What is the total area of the grid in square units?',
    option_a: '20 square units', option_b: '9 square units', option_c: '18 square units', option_d: '25 square units',
    correct_answer: 'A',
    explanation: '4 rows × 5 columns = 20 square units (or skip count by 5s: 5, 10, 15, 20).',
    distractor_diagnostics: {
      B: { error: 'The student added rows and columns (4 + 5 = 9).', remediation: 'Multiply rows by columns: 4 × 5 = 20 square units.' },
      C: { error: 'The student calculated perimeter (4 + 5 + 4 + 5 = 18).', remediation: 'Area is the total squares inside: 4 × 5 = 20.' },
      D: { error: 'The student squared 5 (5 × 5 = 25).', remediation: 'There are only 4 rows: 4 × 5 = 20.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'How many more sides does a hexagon have than a triangle?',
    option_a: '3 more sides', option_b: '2 more sides', option_c: '4 more sides', option_d: '1 more side',
    correct_answer: 'A',
    explanation: 'A hexagon has 6 sides. A triangle has 3 sides. 6 - 3 = 3 more sides.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted incorrectly.', remediation: 'Hexagon (6) minus triangle (3) = 3.' },
      C: { error: 'The student miscounted the sides of one of the shapes.', remediation: 'Hexagon = 6 sides, triangle = 3 sides; 6 - 3 = 3.' },
      D: { error: 'The student subtracted pentagon from hexagon (6 - 5 = 1).', remediation: 'Compare hexagon (6) to triangle (3).' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Fractions of Shapes', subtopic_id: 274,
    question_text: 'A rectangle is shaded so that 2 out of 4 equal parts are colored blue. What fraction of the rectangle is blue?',
    option_a: 'Two fourths (or one half)', option_b: 'Two thirds', option_c: 'One fourth', option_d: 'Four halves',
    correct_answer: 'A',
    explanation: '2 parts out of 4 equal parts is two fourths, which is equal to one half of the rectangle.',
    distractor_diagnostics: {
      B: { error: 'The student used denominator 3.', remediation: 'There are 4 total parts, so the fraction is 2 fourths.' },
      C: { error: 'The student counted only 1 shaded part.', remediation: 'There are 2 shaded parts: 2/4.' },
      D: { error: 'The student inverted the fraction.', remediation: 'The numerator is 2 and denominator is 4.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Equal Rows & Columns', subtopic_id: 273,
    question_text: 'Hassan wants to tile a rectangle that is 3 squares high and 3 squares wide. How many square tiles does he need?',
    option_a: '9 tiles', option_b: '6 tiles', option_c: '12 tiles', option_d: '8 tiles',
    correct_answer: 'A',
    explanation: '3 rows of 3 squares: 3 × 3 = 9 tiles.',
    distractor_diagnostics: {
      B: { error: 'The student added 3 + 3 = 6 instead of multiplying.', remediation: 'Each row has 3 tiles, so 3 + 3 + 3 = 9 tiles.' },
      C: { error: 'The student calculated perimeter of the rectangle.', remediation: 'Count all square tiles covering the area: 3 × 3 = 9.' },
      D: { error: 'The student made an arithmetic error.', remediation: '3 rows of 3 = 9.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'Which statement correctly describes the faces of a cube?',
    option_a: 'All 6 faces are identical squares', option_b: 'All 6 faces are rectangles with different lengths', option_c: 'It has 2 circles and 1 rectangle', option_d: 'It has 4 triangles and 1 square',
    correct_answer: 'A',
    explanation: 'A cube is a special rectangular prism where all 6 faces are equal squares.',
    distractor_diagnostics: {
      B: { error: 'The student described a general rectangular prism.', remediation: 'In a cube, all faces must be EQUAL squares.' },
      C: { error: 'The student described a cylinder.', remediation: 'A cylinder has circular faces; a cube has square faces.' },
      D: { error: 'The student described a square pyramid.', remediation: 'A pyramid has triangle faces; a cube has square faces.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Fractions of Shapes', subtopic_id: 274,
    question_text: 'A circular clock face is shaded from 12:00 to 4:00. What fraction of the clock face is shaded?',
    option_a: 'One third', option_b: 'One half', option_c: 'One fourth', option_d: 'One sixth',
    correct_answer: 'A',
    explanation: 'A clock has 12 hours. 4 hours out of 12 is 4/12 = 1/3 of the circle.',
    distractor_diagnostics: {
      B: { error: 'The student chose one half (which would be 6 hours, to 6:00).', remediation: 'Half of a clock is 6 hours; 4 hours is 1/3 of the clock.' },
      C: { error: 'The student chose one fourth (which would be 3 hours, to 3:00).', remediation: 'One fourth is 3 hours; 4 hours represents one third.' },
      D: { error: 'The student divided 12 by 2.', remediation: '4 out of 12 simplifies to 1 third.' }
    }
  },
  {
    grade: 2, difficulty: 'Medium', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'How many vertices (corners) does a pentagon have?',
    option_a: '5 vertices', option_b: '6 vertices', option_c: '4 vertices', option_d: '8 vertices',
    correct_answer: 'A',
    explanation: 'A polygon always has the same number of vertices as its sides. A pentagon has 5 sides and 5 vertices.',
    distractor_diagnostics: {
      B: { error: 'The student chose 6 (hexagon).', remediation: 'A pentagon has 5 vertices.' },
      C: { error: 'The student chose 4 (quadrilateral).', remediation: 'Quadrilaterals have 4 vertices; pentagons have 5.' },
      D: { error: 'The student chose 8.', remediation: 'Count the 5 sharp corners of a pentagon.' }
    }
  },

  // High (8)
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Equal Rows & Columns', subtopic_id: 273,
    question_text: 'A chocolate bar is broken into 5 equal rows with 4 squares in each row. If Maria eats 1 entire row, how many squares of chocolate are left?',
    option_a: '16 squares', option_b: '15 squares', option_c: '19 squares', option_d: '12 squares',
    correct_answer: 'A',
    explanation: 'Total squares = 5 rows × 4 = 20 squares. 1 row = 4 squares. Left = 20 - 4 = 16 squares (or 4 remaining rows × 4 = 16).',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 5 instead of 4.', remediation: 'Each row contains 4 squares, so subtract 4 from 20 to get 16.' },
      C: { error: 'The student subtracted only 1 square instead of 1 entire row.', remediation: '1 entire row has 4 squares.' },
      D: { error: 'The student subtracted 2 rows.', remediation: 'Only 1 row was eaten; 4 rows of 4 remain (16 squares).' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'Which shape can have 4 equal sides, but does NOT need to have 4 right angles?',
    option_a: 'Rhombus', option_b: 'Square', option_c: 'Rectangle', option_d: 'Trapezoid',
    correct_answer: 'A',
    explanation: 'A rhombus has 4 equal straight sides, but its angles can be acute and obtuse (slanted), unlike a square which must have right angles.',
    distractor_diagnostics: {
      B: { error: 'The student chose square, which MUST have 4 right angles.', remediation: 'A square must have 4 right angles; a rhombus does not require right angles.' },
      C: { error: 'The student chose rectangle, which does not have 4 equal sides.', remediation: 'A rectangle has opposite sides equal, not all 4 sides.' },
      D: { error: 'The student chose trapezoid.', remediation: 'A trapezoid does not have 4 equal sides.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Fractions of Shapes', subtopic_id: 274,
    question_text: 'A teacher asks: "Can a circle be divided into 4 equal shares where each share has a different shape?" What is the correct answer?',
    option_a: 'No, in circles, 4 equal shares partitioned from the center must have the same shape', option_b: 'Yes, circles can be cut into any shapes with equal area', option_c: 'Circles can never have 4 equal shares', option_d: 'Only rectangles can be partitioned',
    correct_answer: 'A',
    explanation: 'Because a circle has rotational symmetry, partitioning from the center into 4 equal shares creates 4 identical wedge quadrants.',
    distractor_diagnostics: {
      B: { error: 'The student applied rectangle rules to circles.', remediation: 'While rectangles can be cut into different shapes with equal area, standard radial cuts of circles produce identical quadrant wedges.' },
      C: { error: 'The student stated circles cannot be divided into fourths.', remediation: 'A circle can easily be cut into 4 equal quadrants.' },
      D: { error: 'The student claimed only rectangles can be partitioned.', remediation: 'Both circles and rectangles can be partitioned into equal shares.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Equal Rows & Columns', subtopic_id: 273,
    question_text: 'Two students build rectangular arrays with 12 square tiles each. Student A builds 2 rows of 6. Student B builds 3 rows of 4. Which student used more total tiles?',
    option_a: 'Both students used the exact same number of tiles (12)', option_b: 'Student A used more tiles', option_c: 'Student B used more tiles', option_d: 'Student B used 1 more tile',
    correct_answer: 'A',
    explanation: 'Both arrays have the same total area: 2 × 6 = 12 and 3 × 4 = 12 tiles.',
    distractor_diagnostics: {
      B: { error: 'The student thought having 6 columns means more total tiles.', remediation: '2 × 6 = 12 and 3 × 4 = 12; both arrays use exactly 12 tiles.' },
      C: { error: 'The student thought 3 rows means more tiles.', remediation: 'Multiply rows by columns: both equal 12.' },
      D: { error: 'The student made an arithmetic error.', remediation: 'Both total to 12.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'What is the sum of the angles of a triangle plus the angles of a quadrilateral?',
    option_a: '7 angles', option_b: '6 angles', option_c: '8 angles', option_d: '5 angles',
    correct_answer: 'A',
    explanation: 'A triangle has 3 angles. A quadrilateral has 4 angles. 3 + 4 = 7 angles.',
    distractor_diagnostics: {
      B: { error: 'The student miscounted angles.', remediation: 'Triangle (3) + Quadrilateral (4) = 7 angles.' },
      C: { error: 'The student counted 4 for both shapes.', remediation: 'Triangles have 3 angles, so 3 + 4 = 7.' },
      D: { error: 'The student subtracted instead of adding.', remediation: 'Add the angles: 3 + 4 = 7.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Fractions of Shapes', subtopic_id: 274,
    question_text: 'Which phrase describes a shape partitioned into 4 equal shares where all 4 shares are colored?',
    option_a: 'Four fourths (one whole)', option_b: 'Three fourths', option_c: 'One fourth', option_d: 'Four halves',
    correct_answer: 'A',
    explanation: 'When all 4 equal shares are colored, it represents four fourths, which is equal to 1 whole.',
    distractor_diagnostics: {
      B: { error: 'The student selected three fourths.', remediation: 'All 4 parts are shaded, which is 4 fourths (1 whole).' },
      C: { error: 'The student selected only 1 part.', remediation: 'All parts are colored, meaning 4/4.' },
      D: { error: 'The student confused fourths with halves.', remediation: '4 equal parts are fourths, so 4 fourths make 1 whole.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Shape Identification', subtopic_id: 272,
    question_text: 'How many total edges do two cubes have combined?',
    option_a: '24 edges', option_b: '12 edges', option_c: '16 edges', option_d: '20 edges',
    correct_answer: 'A',
    explanation: 'One cube has 12 edges. Two cubes have 12 + 12 = 24 edges.',
    distractor_diagnostics: {
      B: { error: 'The student counted edges for only one cube.', remediation: 'Multiply by 2 for two cubes: 12 × 2 = 24 edges.' },
      C: { error: 'The student counted 8 edges per cube (confused with vertices).', remediation: 'A cube has 12 edges, so two cubes have 24 edges.' },
      D: { error: 'The student made an addition error.', remediation: '12 + 12 = 24.' }
    }
  },
  {
    grade: 2, difficulty: 'High', subtopic_name: 'Equal Rows & Columns', subtopic_id: 273,
    question_text: 'A rectangular garden bed is 4 feet long and 2 feet wide. It is partitioned into 1-foot square sections. If carrots are planted in 3 of the squares, how many squares do NOT have carrots?',
    option_a: '5 squares', option_b: '8 squares', option_c: '3 squares', option_d: '6 squares',
    correct_answer: 'A',
    explanation: 'Total square sections = 4 × 2 = 8 squares. Unplanted squares = 8 - 3 = 5 squares.',
    distractor_diagnostics: {
      B: { error: 'The student gave the total squares without subtracting the planted ones.', remediation: 'Subtract the 3 planted squares from the total of 8: 8 - 3 = 5 squares.' },
      C: { error: 'The student gave the number of planted squares.', remediation: 'The question asks for squares that do NOT have carrots: 8 - 3 = 5.' },
      D: { error: 'The student subtracted from 9 by mistake.', remediation: 'Total area is 4 × 2 = 8, and 8 - 3 = 5.' }
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

  const allQuestions = [...g1Questions, ...g2Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 1 & Grade 2 Geometry...`);

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

  console.log(`Grade 1 & 2 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
