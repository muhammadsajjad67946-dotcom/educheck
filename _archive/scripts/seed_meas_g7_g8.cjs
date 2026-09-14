const mysql = require('mysql2/promise');
require('dotenv').config();

const g7Questions = [
  // Low (8)
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Circumference', subtopic_id: 259,
    question_text: 'What is the circumference of a circle with a diameter of 10 cm? (Use π ≈ 3.14)',
    option_a: '31.4 cm', option_b: '62.8 cm', option_c: '78.5 cm', option_d: '15.7 cm',
    correct_answer: 'A',
    explanation: 'Circumference C = π × d = 3.14 × 10 = 31.4 cm.',
    distractor_diagnostics: {
      B: { error: 'Student used radius formula with diameter: C = 2πd instead of πd (doubled diameter).', remediation: 'The formula using diameter is C = π × d (or C = 2πr). For d = 10, C = 3.14 × 10 = 31.4 cm.' },
      C: { error: 'Student calculated the area (π × r² = 3.14 × 25 = 78.5) instead of circumference.', remediation: 'Circumference is the distance around a circle: C = π × d = 31.4 cm.' },
      D: { error: 'Student halved the circumference.', remediation: 'C = π × d = 3.14 × 10 = 31.4 cm.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Circumference', subtopic_id: 259,
    question_text: 'A circular bicycle wheel has a radius of 14 inches. What is its circumference? (Use π ≈ 22/7)',
    option_a: '88 inches', option_b: '44 inches', option_c: '616 inches', option_d: '28 inches',
    correct_answer: 'A',
    explanation: 'Circumference C = 2πr = 2 × (22/7) × 14 = 2 × 22 × 2 = 88 inches.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to multiply by 2 (calculated πr instead of 2πr).', remediation: 'Circumference formula with radius is C = 2πr: 2 × (22/7) × 14 = 88 inches.' },
      C: { error: 'Student calculated area (πr² = 22/7 × 196 = 616).', remediation: 'Circumference is C = 2πr = 88 inches, not πr².' },
      D: { error: 'Student only doubled the radius (found diameter).', remediation: 'Multiply diameter by π: 28 × (22/7) = 88 inches.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Area of Circles', subtopic_id: 258,
    question_text: 'What is the area of a circle with a radius of 5 meters? (Use π ≈ 3.14)',
    option_a: '78.5 square meters', option_b: '31.4 square meters', option_c: '15.7 square meters', option_d: '100 square meters',
    correct_answer: 'A',
    explanation: 'Area = π × r² = 3.14 × 5² = 3.14 × 25 = 78.5 square meters.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the circumference (2πr = 2 × 3.14 × 5 = 31.4) instead of area.', remediation: 'Area is π × r² = 3.14 × 25 = 78.5 m².' },
      C: { error: 'Student multiplied π by r (3.14 × 5 = 15.7).', remediation: 'Remember to square the radius first: r² = 25, then 3.14 × 25 = 78.5 m².' },
      D: { error: 'Student squared diameter or approximated incorrectly.', remediation: 'Area = π × r² = 3.14 × 25 = 78.5 m².' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Area of Circles', subtopic_id: 258,
    question_text: 'A circular pond has a diameter of 8 meters. What is its radius?',
    option_a: '4 meters', option_b: '16 meters', option_c: '8 meters', option_d: '2 meters',
    correct_answer: 'A',
    explanation: 'The radius is half of the diameter: r = d ÷ 2 = 8 ÷ 2 = 4 meters.',
    distractor_diagnostics: {
      B: { error: 'Student doubled the diameter instead of halving it.', remediation: 'Radius is half the diameter: r = d / 2 = 4 m.' },
      C: { error: 'Student confused radius with diameter.', remediation: 'Diameter is across the whole circle; radius is from center to edge (half of diameter).' },
      D: { error: 'Student divided by 4.', remediation: 'Divide diameter by 2: 8 ÷ 2 = 4 m.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Area of Composite Figures', subtopic_id: 260,
    question_text: 'A figure consists of a rectangle of 6 cm by 4 cm attached to a square of 3 cm by 3 cm. What is the total area?',
    option_a: '33 square cm', option_b: '24 square cm', option_c: '9 square cm', option_d: '42 square cm',
    correct_answer: 'A',
    explanation: 'Rectangle area = 6 × 4 = 24 cm². Square area = 3 × 3 = 9 cm². Total area = 24 + 9 = 33 cm².',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the rectangle area.', remediation: 'Add the square area to the rectangle: 24 + 9 = 33 cm².' },
      C: { error: 'Student calculated only the square area.', remediation: 'Add both areas together: 24 + 9 = 33 cm².' },
      D: { error: 'Student added dimensions incorrectly.', remediation: '24 + 9 = 33 cm².' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Scale & Measurement Applications', subtopic_id: 261,
    question_text: 'On a map, 1 inch represents 20 miles. If two cities are 3 inches apart on the map, what is the actual distance between them?',
    option_a: '60 miles', option_b: '23 miles', option_c: '40 miles', option_d: '20 miles',
    correct_answer: 'A',
    explanation: 'Actual distance = 3 inches × 20 miles per inch = 60 miles.',
    distractor_diagnostics: {
      B: { error: 'Student added 20 + 3 instead of multiplying.', remediation: 'Multiply map distance by the scale factor: 3 × 20 = 60 miles.' },
      C: { error: 'Student multiplied 20 by 2 instead of 3.', remediation: '3 inches × 20 miles/inch = 60 miles.' },
      D: { error: 'Student used the unit rate directly without scaling.', remediation: '3 inches × 20 = 60 miles.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Scale & Measurement Applications', subtopic_id: 261,
    question_text: 'A blueprint uses a scale where 1 centimeter represents 4 meters. A room is 5 cm long on the blueprint. What is the actual length of the room?',
    option_a: '20 meters', option_b: '9 meters', option_c: '1.25 meters', option_d: '25 meters',
    correct_answer: 'A',
    explanation: 'Actual length = 5 cm × 4 meters per cm = 20 meters.',
    distractor_diagnostics: {
      B: { error: 'Student added 5 + 4 = 9.', remediation: 'Multiply blueprint measurement by scale factor: 5 × 4 = 20 meters.' },
      C: { error: 'Student divided 5 by 4.', remediation: 'Blueprint to actual requires multiplying: 5 × 4 = 20 m.' },
      D: { error: 'Student multiplied 5 by 5.', remediation: 'Scale is 4 m per cm: 5 × 4 = 20 m.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Circumference', subtopic_id: 259,
    question_text: 'What is the relationship between the circumference C and the diameter d of any circle?',
    option_a: 'C / d = π', option_b: 'C × d = π', option_c: 'C - d = π', option_d: 'd / C = π',
    correct_answer: 'A',
    explanation: 'Pi (π) is defined as the ratio of a circle\'s circumference to its diameter: C / d = π, which gives C = πd.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied circumference by diameter.', remediation: 'Pi is the quotient of circumference divided by diameter: C / d = π.' },
      C: { error: 'Student subtracted diameter from circumference.', remediation: 'Pi is a constant ratio (division), not a difference.' },
      D: { error: 'Student inverted the ratio (d / C = 1/π).', remediation: 'Circumference is larger than diameter: C / d = π ≈ 3.14.' }
    }
  },

  // Medium (9)
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Area of Circles', subtopic_id: 258,
    question_text: 'What is the area of a circle with a diameter of 12 inches? (Use π ≈ 3.14)',
    option_a: '113.04 square inches', option_b: '452.16 square inches', option_c: '37.68 square inches', option_d: '75.36 square inches',
    correct_answer: 'A',
    explanation: 'Radius r = 12 ÷ 2 = 6 inches. Area = πr² = 3.14 × 6² = 3.14 × 36 = 113.04 square inches.',
    distractor_diagnostics: {
      B: { error: 'Student used diameter directly in formula without halving to radius: π × 12² = 452.16.', remediation: 'Always halve the diameter first to find radius: r = 6; Area = 3.14 × 6² = 113.04 sq in.' },
      C: { error: 'Student calculated circumference: 3.14 × 12 = 37.68.', remediation: 'Area is π × r² = 3.14 × 36 = 113.04 sq in.' },
      D: { error: 'Student calculated 2 × circumference.', remediation: 'Area = π × r² = 113.04 sq in.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Circumference', subtopic_id: 259,
    question_text: 'A circular track has a circumference of 62.8 meters. What is its diameter? (Use π ≈ 3.14)',
    option_a: '20 meters', option_b: '10 meters', option_c: '40 meters', option_d: '31.4 meters',
    correct_answer: 'A',
    explanation: 'd = C ÷ π = 62.8 ÷ 3.14 = 20 meters.',
    distractor_diagnostics: {
      B: { error: 'Student calculated radius instead of diameter (62.8 ÷ 6.28 = 10).', remediation: 'The question asks for diameter: d = C / π = 20 meters.' },
      C: { error: 'Student doubled the diameter: 20 × 2 = 40.', remediation: 'd = C / π = 62.8 ÷ 3.14 = 20 meters.' },
      D: { error: 'Student halved the circumference: 62.8 ÷ 2 = 31.4.', remediation: 'Divide by π (3.14), not 2: 62.8 ÷ 3.14 = 20 meters.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Area of Composite Figures', subtopic_id: 260,
    question_text: 'A basketball court key is shaped like a rectangle 19 feet long and 12 feet wide, topped with a semicircle of diameter 12 feet. What is the total area of the key? (Use π ≈ 3.14)',
    option_a: '284.52 square feet', option_b: '228.00 square feet', option_c: '341.04 square feet', option_d: '454.56 square feet',
    correct_answer: 'A',
    explanation: 'Rectangle area = 19 × 12 = 228 sq ft. Semicircle radius = 12 ÷ 2 = 6 ft. Semicircle area = 1/2 × π × 6² = 0.5 × 3.14 × 36 = 56.52 sq ft. Total area = 228 + 56.52 = 284.52 sq ft.',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the rectangle area and omitted the semicircle.', remediation: 'Add the semicircle area (56.52) to the rectangle (228): 284.52 sq ft.' },
      C: { error: 'Student added a full circle area instead of a semicircle (228 + 113.04 = 341.04).', remediation: 'A semicircle is half a circle: divide the circle area by 2: 113.04 ÷ 2 = 56.52 sq ft.' },
      D: { error: 'Student used diameter in circle formula and added to rectangle.', remediation: 'Radius is 6 ft; semicircle is 56.52 sq ft; total is 284.52 sq ft.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Scale & Measurement Applications', subtopic_id: 261,
    question_text: 'A scale drawing of a rectangular park has a length of 8 cm and a width of 5 cm. The scale is 1 cm = 15 meters. What is the actual area of the park in square meters?',
    option_a: '9,000 square meters', option_b: '600 square meters', option_c: '40 square meters', option_d: '4,500 square meters',
    correct_answer: 'A',
    explanation: 'Actual length = 8 × 15 = 120 m. Actual width = 5 × 15 = 75 m. Actual area = 120 × 75 = 9,000 m². (Or drawing area = 40 cm², scaled by 15² = 225: 40 × 225 = 9,000 m²).',
    distractor_diagnostics: {
      B: { error: 'Student multiplied drawing area (40) by scale factor 15 instead of 15² (40 × 15 = 600).', remediation: 'Area scales by the square of the scale factor: 15² = 225; 40 × 225 = 9,000 m².' },
      C: { error: 'Student gave the drawing area without scaling.', remediation: 'Convert dimensions to actual meters first: 120 m × 75 m = 9,000 m².' },
      D: { error: 'Student halved the actual area.', remediation: 'Actual dimensions are 120 m and 75 m; 120 × 75 = 9,000 m².' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Circumference', subtopic_id: 259,
    question_text: 'A car tire has a radius of 0.35 meters. How far does the car travel in 100 complete rotations of the tire? (Use π ≈ 22/7)',
    option_a: '220 meters', option_b: '110 meters', option_c: '440 meters', option_d: '77 meters',
    correct_answer: 'A',
    explanation: 'Circumference = 2πr = 2 × (22/7) × 0.35 = 2 × 22 × 0.05 = 2.2 meters. In 100 rotations: 100 × 2.2 = 220 meters.',
    distractor_diagnostics: {
      B: { error: 'Student forgot factor of 2 in circumference (used πr × 100).', remediation: 'Circumference is 2πr = 2.2 m; 2.2 × 100 = 220 m.' },
      C: { error: 'Student doubled the distance.', remediation: 'C = 2.2 m; 100 × 2.2 = 220 meters.' },
      D: { error: 'Student calculated area multiplied by rotations.', remediation: 'Distance traveled per rotation equals circumference: 2πr × 100 = 220 m.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Area of Composite Figures', subtopic_id: 260,
    question_text: 'A square metal sheet has sides of 10 cm. A circular hole with radius 3 cm is punched out of the center. What is the area of the remaining metal sheet? (Use π ≈ 3.14)',
    option_a: '71.74 square cm', option_b: '100 square cm', option_c: '28.26 square cm', option_d: '81.16 square cm',
    correct_answer: 'A',
    explanation: 'Square area = 10 × 10 = 100 cm². Circle area = π × 3² = 3.14 × 9 = 28.26 cm². Remaining area = 100 - 28.26 = 71.74 cm².',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the original square area.', remediation: 'Subtract the area of the circle punched out: 100 - 28.26 = 71.74 cm².' },
      C: { error: 'Student gave the hole area instead of the remaining area.', remediation: 'The question asks for the remaining metal: 100 - 28.26 = 71.74 cm².' },
      D: { error: 'Student subtracted circumference (3.14 × 6 = 18.84) instead of area.', remediation: 'Subtract area πr² = 28.26 from 100: 100 - 28.26 = 71.74 cm².' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Area of Circles', subtopic_id: 258,
    question_text: 'If the radius of a circle is doubled, what happens to its area?',
    option_a: 'The area is multiplied by 4', option_b: 'The area is multiplied by 2', option_c: 'The area is multiplied by 8', option_d: 'The area stays the same',
    correct_answer: 'A',
    explanation: 'Area = πr². If radius becomes 2r, new area = π(2r)² = 4πr², which is 4 times the original area.',
    distractor_diagnostics: {
      B: { error: 'Student assumed area scales linearly with radius.', remediation: 'Area depends on radius squared (r²), so doubling radius increases area by 2² = 4 times.' },
      C: { error: 'Student confused area with 3D volume (2³ = 8).', remediation: 'Volume multiplies by 8, but 2D area multiplies by 2² = 4.' },
      D: { error: 'Student thought area is independent of radius.', remediation: 'When radius changes, area changes by the square of the scale factor: 2² = 4.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Scale & Measurement Applications', subtopic_id: 261,
    question_text: 'A model airplane is built using a scale of 1:48. If the wingspan of the real airplane is 36 feet, what is the wingspan of the model in inches?',
    option_a: '9 inches', option_b: '0.75 inches', option_c: '12 inches', option_d: '18 inches',
    correct_answer: 'A',
    explanation: 'Convert real wingspan to inches: 36 feet × 12 inches/ft = 432 inches. Scale is 1:48: Model wingspan = 432 ÷ 48 = 9 inches.',
    distractor_diagnostics: {
      B: { error: 'Student divided 36 feet by 48 and left the answer in feet (0.75 feet) instead of converting to inches.', remediation: '0.75 feet × 12 inches/ft = 9 inches.' },
      C: { error: 'Student calculated 48 ÷ 4 = 12.', remediation: 'Convert 36 ft to 432 inches, then 432 ÷ 48 = 9 inches.' },
      D: { error: 'Student made an arithmetic slip in division.', remediation: '432 ÷ 48 = 9 inches.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Area of Composite Figures', subtopic_id: 260,
    question_text: 'A swimming pool border is shaped like a rectangle of 10 m by 6 m with two identical semicircles on its shorter ends (diameter 6 m). What is the total area? (Use π ≈ 3.14)',
    option_a: '88.26 square meters', option_b: '60.00 square meters', option_c: '116.52 square meters', option_d: '74.13 square meters',
    correct_answer: 'A',
    explanation: 'Rectangle area = 10 × 6 = 60 m². Two semicircles of diameter 6 m (radius 3 m) combine to form 1 full circle. Circle area = π × 3² = 3.14 × 9 = 28.26 m². Total area = 60 + 28.26 = 88.26 m².',
    distractor_diagnostics: {
      B: { error: 'Student only calculated the rectangle area.', remediation: 'Add the two semicircles (one full circle = 28.26): 60 + 28.26 = 88.26 m².' },
      C: { error: 'Student used diameter 6 as radius in circle formula: π × 6² = 113.04.', remediation: 'Radius is half the diameter: r = 3 m; π × 3² = 28.26 m²; total = 88.26 m².' },
      D: { error: 'Student added only one semicircle: 60 + 14.13 = 74.13.', remediation: 'There are two semicircles, one at each short end: together they make 1 full circle (28.26 m²).' }
    }
  },

  // High (8)
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Area of Circles', subtopic_id: 258,
    question_text: 'A circular running track has an outer radius of 25 meters and an inner radius of 20 meters. What is the area of the track itself (the ring between the circles)? (Use π ≈ 3.14)',
    option_a: '706.5 square meters', option_b: '1,962.5 square meters', option_c: '1,256.0 square meters', option_d: '157.0 square meters',
    correct_answer: 'A',
    explanation: 'Outer circle area = π × 25² = 3.14 × 625 = 1,962.5 m². Inner circle area = π × 20² = 3.14 × 400 = 1,256 m². Area of ring = 1,962.5 - 1,256 = 706.5 m².',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the outer circle area.', remediation: 'Subtract the inner field area: 1,962.5 - 1,256 = 706.5 m².' },
      C: { error: 'Student calculated only the inner circle area.', remediation: 'The track area is the difference between outer and inner circles: 1,962.5 - 1,256 = 706.5 m².' },
      D: { error: 'Student squared the difference of radii: π × (25 - 20)² = 3.14 × 25 = 78.5 or multiplied by 2.', remediation: 'The area of an annulus is π(R² - r²), which is NOT π(R - r)²: 3.14 × (625 - 400) = 706.5 m².' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Circumference', subtopic_id: 259,
    question_text: 'A semicircular window has a diameter of 14 inches. What is the total perimeter of the window (including the straight bottom edge)? (Use π ≈ 22/7)',
    option_a: '36 inches', option_b: '22 inches', option_c: '44 inches', option_d: '58 inches',
    correct_answer: 'A',
    explanation: 'Curved arc length = 1/2 × π × d = 1/2 × (22/7) × 14 = 22 inches. Straight bottom edge = diameter = 14 inches. Total perimeter = 22 + 14 = 36 inches.',
    distractor_diagnostics: {
      B: { error: 'Student only found the curved semicircular arc (22 inches) and forgot the straight base.', remediation: 'The perimeter must enclose the entire figure: add the diameter base: 22 + 14 = 36 inches.' },
      C: { error: 'Student calculated full circle circumference (44 inches).', remediation: 'A semicircle arc is half the circumference: 44 ÷ 2 = 22, plus the base: 22 + 14 = 36 inches.' },
      D: { error: 'Student added full circumference to diameter: 44 + 14 = 58.', remediation: 'Curved arc is only half the circle: 22 + 14 = 36 inches.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Area of Composite Figures', subtopic_id: 260,
    question_text: 'A square lawn has side length 14 meters. A sprinkler placed at each of the 4 corners waters a quarter-circle of radius 7 meters. What is the unwatered area in the middle of the lawn? (Use π ≈ 22/7)',
    option_a: '42 square meters', option_b: '154 square meters', option_c: '196 square meters', option_d: '84 square meters',
    correct_answer: 'A',
    explanation: 'Total lawn area = 14 × 14 = 196 m². Four quarter-circles of radius 7 m combine into 1 full circle of radius 7 m. Watered area = πr² = (22/7) × 7² = 154 m². Unwatered area = 196 - 154 = 42 square meters.',
    distractor_diagnostics: {
      B: { error: 'Student found the watered area (154 m²) instead of the unwatered area.', remediation: 'Subtract watered area from total area: 196 - 154 = 42 m².' },
      C: { error: 'Student found only the total area of the square.', remediation: 'Subtract the circle watered by the sprinklers: 196 - 154 = 42 m².' },
      D: { error: 'Student doubled the remaining area.', remediation: 'Total (196) - Watered (154) = 42 m².' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Scale & Measurement Applications', subtopic_id: 261,
    question_text: 'A blueprint has a scale of 1/4 inch = 1 foot. If an architectural floor plan shows a room as 3 inches by 4 inches, what will it cost to carpet the actual room at $4.50 per square foot?',
    option_a: '$864.00', option_b: '$54.00', option_c: '$216.00', option_d: '$432.00',
    correct_answer: 'A',
    explanation: 'Scale factor: 1 inch = 4 feet. Actual length = 4 × 4 = 16 ft. Actual width = 3 × 4 = 12 ft. Actual area = 16 × 12 = 192 sq ft. Total cost = 192 × $4.50 = $864.00.',
    distractor_diagnostics: {
      B: { error: 'Student used drawing area directly: 3 × 4 = 12; 12 × $4.50 = $54.00.', remediation: 'Convert drawing dimensions to feet first: 12 ft by 16 ft = 192 sq ft; 192 × $4.50 = $864.00.' },
      C: { error: 'Student scaled area by 4 instead of 4² = 16: 12 × 4 = 48 sq ft; 48 × $4.50 = $216.00.', remediation: 'Area scales by factor squared (4² = 16): 12 × 16 = 192 sq ft; 192 × $4.50 = $864.00.' },
      D: { error: 'Student halved the total cost.', remediation: '192 sq ft × $4.50/sq ft = $864.00.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Area of Circles', subtopic_id: 258,
    question_text: 'Two concentric circles have circumferences of 31.4 cm and 62.8 cm. What is the width of the ring between them? (Use π ≈ 3.14)',
    option_a: '5 cm', option_b: '10 cm', option_c: '3.14 cm', option_d: '2.5 cm',
    correct_answer: 'A',
    explanation: 'Inner radius r1 = 31.4 ÷ (2 × 3.14) = 5 cm. Outer radius r2 = 62.8 ÷ (2 × 3.14) = 10 cm. Ring width = r2 - r1 = 10 - 5 = 5 cm.',
    distractor_diagnostics: {
      B: { error: 'Student gave the outer radius (10 cm) or difference in diameters (10 cm).', remediation: 'Ring width is the difference in radii: r2 - r1 = 10 - 5 = 5 cm.' },
      C: { error: 'Student guessed π.', remediation: 'Radius difference: (62.8 - 31.4) / (2π) = 31.4 / 6.28 = 5 cm.' },
      D: { error: 'Student halved the width.', remediation: 'r2 - r1 = 10 - 5 = 5 cm.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Area of Composite Figures', subtopic_id: 260,
    question_text: 'A decorative garden plot is formed by an equilateral triangle with base 10 m and height 8.66 m, and a rectangle of 10 m by 6 m attached to its base. What is the total area of the garden?',
    option_a: '103.3 square meters', option_b: '146.6 square meters', option_c: '86.6 square meters', option_d: '120.0 square meters',
    correct_answer: 'A',
    explanation: 'Triangle area = 1/2 × 10 × 8.66 = 43.3 m². Rectangle area = 10 × 6 = 60 m². Total area = 43.3 + 60 = 103.3 square meters.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide triangle by 2 (86.6 + 60 = 146.6).', remediation: 'Triangle area is 1/2 × base × height = 43.3; 43.3 + 60 = 103.3 m².' },
      C: { error: 'Student used base × height without 1/2 and omitted the rectangle.', remediation: 'Add triangle (43.3) and rectangle (60): 103.3 m².' },
      D: { error: 'Student rounded or estimated incorrectly.', remediation: '43.3 + 60 = 103.3 m².' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Circumference', subtopic_id: 259,
    question_text: 'A circular pizza has a circumference of 44 inches. What is the area of the pizza? (Use π ≈ 22/7)',
    option_a: '154 square inches', option_b: '308 square inches', option_c: '616 square inches', option_d: '88 square inches',
    correct_answer: 'A',
    explanation: 'Circumference C = 2πr. 44 = 2 × (22/7) × r = (44/7)r. r = 7 inches. Area = πr² = (22/7) × 7² = (22/7) × 49 = 154 square inches.',
    distractor_diagnostics: {
      B: { error: 'Student doubled the correct area.', remediation: 'r = 7; Area = (22/7) × 49 = 154 sq in.' },
      C: { error: 'Student used diameter (14) as radius: (22/7) × 14² = 616.', remediation: 'Diameter is 14, so radius is 7: Area = (22/7) × 49 = 154 sq in.' },
      D: { error: 'Student doubled the circumference.', remediation: 'Find radius first: r = 7 in, then A = πr² = 154 sq in.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Scale & Measurement Applications', subtopic_id: 261,
    question_text: 'On a city map with scale 1 cm : 250 m, a rectangular park measures 4 cm by 2.4 cm. What is the actual perimeter of the park in meters?',
    option_a: '3,200 meters', option_b: '1,600 meters', option_c: '600,000 meters', option_d: '2,400 meters',
    correct_answer: 'A',
    explanation: 'Map perimeter = 2(4 + 2.4) = 2(6.4) = 12.8 cm. Actual perimeter = 12.8 × 250 = 3,200 meters.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to multiply by 2 (added length and width only: 6.4 × 250 = 1,600).', remediation: 'Perimeter includes all four sides: 2(l + w) = 12.8 cm; 12.8 × 250 = 3,200 m.' },
      C: { error: 'Student calculated the area instead of perimeter (4 × 2.4 × 250² = 600,000).', remediation: 'The question asks for perimeter (linear distance): 3,200 m.' },
      D: { error: 'Student made an arithmetic error.', remediation: '12.8 × 250 = 3,200 meters.' }
    }
  }
];

const g8Questions = [
  // Low (8)
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Volume of Cylinders', subtopic_id: 262,
    question_text: 'What is the formula for the volume of a cylinder with radius r and height h?',
    option_a: 'V = πr²h', option_b: 'V = 2πrh', option_c: 'V = 1/3 πr²h', option_d: 'V = 4/3 πr³',
    correct_answer: 'A',
    explanation: 'The volume of a cylinder equals base area times height: V = (πr²) × h = πr²h.',
    distractor_diagnostics: {
      B: { error: 'This is the lateral surface area formula of a cylinder.', remediation: 'Volume is base area times height: V = πr²h.' },
      C: { error: 'This is the volume formula for a cone.', remediation: 'A cylinder has three times the volume of a cone with the same base and height: V = πr²h.' },
      D: { error: 'This is the volume formula for a sphere.', remediation: 'A cylinder formula is V = πr²h.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Volume of Cylinders', subtopic_id: 262,
    question_text: 'A cylinder has a radius of 3 cm and a height of 10 cm. What is its volume? (Use π ≈ 3.14)',
    option_a: '282.6 cubic cm', option_b: '94.2 cubic cm', option_c: '188.4 cubic cm', option_d: '942 cubic cm',
    correct_answer: 'A',
    explanation: 'V = πr²h = 3.14 × 3² × 10 = 3.14 × 9 × 10 = 282.6 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student calculated 1/3 of the volume (used cone formula).', remediation: 'Cylinder volume is V = πr²h = 282.6 cm³ (not divided by 3).' },
      C: { error: 'Student used 2πrh (surface area) instead of πr²h.', remediation: 'V = πr²h = 3.14 × 9 × 10 = 282.6 cm³.' },
      D: { error: 'Student did not square the radius or made a decimal error.', remediation: 'r² = 9; 3.14 × 9 × 10 = 282.6 cm³.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Volume of Cones', subtopic_id: 263,
    question_text: 'What is the volume of a cone with radius 3 cm and height 10 cm? (Use π ≈ 3.14)',
    option_a: '94.2 cubic cm', option_b: '282.6 cubic cm', option_c: '31.4 cubic cm', option_d: '188.4 cubic cm',
    correct_answer: 'A',
    explanation: 'V = 1/3 πr²h = 1/3 × 3.14 × 3² × 10 = 1/3 × 282.6 = 94.2 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 3 (used cylinder volume formula).', remediation: 'A cone volume is exactly one-third of a cylinder: V = 1/3 πr²h = 94.2 cm³.' },
      C: { error: 'Student divided by 9 instead of 3.', remediation: 'Divide cylinder volume by 3: 282.6 ÷ 3 = 94.2 cm³.' },
      D: { error: 'Student multiplied by 2/3 instead of 1/3.', remediation: 'V = (1/3) × 282.6 = 94.2 cm³.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Volume of Spheres', subtopic_id: 264,
    question_text: 'What is the formula for the volume of a sphere of radius r?',
    option_a: 'V = 4/3 πr³', option_b: 'V = 4πr²', option_c: 'V = πr²h', option_d: 'V = 2/3 πr³',
    correct_answer: 'A',
    explanation: 'The volume of a sphere is given by V = (4/3)πr³.',
    distractor_diagnostics: {
      B: { error: '4πr² is the surface area of a sphere, not volume.', remediation: 'Volume requires cubic units (r³) and the 4/3 coefficient: V = 4/3 πr³.' },
      C: { error: 'πr²h is the volume of a cylinder.', remediation: 'Sphere volume is V = 4/3 πr³.' },
      D: { error: '2/3 πr³ is the volume of a hemisphere.', remediation: 'A full sphere has volume 4/3 πr³.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Volume of Spheres', subtopic_id: 264,
    question_text: 'A sphere has a radius of 3 inches. What is its volume in terms of π?',
    option_a: '36π cubic inches', option_b: '108π cubic inches', option_c: '12π cubic inches', option_d: '27π cubic inches',
    correct_answer: 'A',
    explanation: 'V = 4/3 π r³ = 4/3 × π × 3³ = 4/3 × π × 27 = 36π cubic inches.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 3: 4 × 27π = 108π.', remediation: 'Remember the formula has 4/3: (4 × 27) / 3 = 36π cubic inches.' },
      C: { error: 'Student multiplied 4/3 by 3² instead of 3³.', remediation: 'Radius must be cubed: 3³ = 27; 4/3 × 27 = 36π.' },
      D: { error: 'Student omitted the 4/3 coefficient.', remediation: 'Multiply r³ (27) by 4/3: 36π cubic inches.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Cross-Sections', subtopic_id: 265,
    question_text: 'What 2D shape is formed by slicing a right cylinder parallel to its base?',
    option_a: 'A circle', option_b: 'A rectangle', option_c: 'An oval/ellipse', option_d: 'A triangle',
    correct_answer: 'A',
    explanation: 'A cross-section parallel to the circular base of a right cylinder is a circle identical to the base.',
    distractor_diagnostics: {
      B: { error: 'A slice perpendicular to the base produces a rectangle.', remediation: 'Slicing parallel to the base yields a circle congruent to the base.' },
      C: { error: 'An angled slice produces an ellipse.', remediation: 'A slice parallel to the circular base is a circle.' },
      D: { error: 'Cylinders do not have triangular cross-sections.', remediation: 'Parallel to base = circle.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Cross-Sections', subtopic_id: 265,
    question_text: 'What 2D shape is formed by slicing a right rectangular prism perpendicular to its base?',
    option_a: 'A rectangle', option_b: 'A circle', option_c: 'A triangle', option_d: 'A sphere',
    correct_answer: 'A',
    explanation: 'Any planar slice perpendicular to the base of a rectangular prism produces a rectangle.',
    distractor_diagnostics: {
      B: { error: 'Rectangular prisms have flat faces and cannot produce circular cross-sections.', remediation: 'Cross-sections of a rectangular prism are polygons, specifically rectangles when cut perpendicular to faces.' },
      C: { error: 'An angled slice across three faces could produce a triangle, but perpendicular cuts give rectangles.', remediation: 'A slice perpendicular to the base is a rectangle.' },
      D: { error: 'A sphere is a 3D solid, not a 2D cross-section.', remediation: 'Cross-sections are 2D shapes: here, a rectangle.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Real-World Volume Applications', subtopic_id: 267,
    question_text: 'A soup can is in the shape of a cylinder with diameter 8 cm and height 10 cm. What is its radius?',
    option_a: '4 cm', option_b: '8 cm', option_c: '16 cm', option_d: '2 cm',
    correct_answer: 'A',
    explanation: 'The radius is half of the diameter: 8 ÷ 2 = 4 cm.',
    distractor_diagnostics: {
      B: { error: 'Student used diameter instead of radius.', remediation: 'Radius is half of diameter: r = 8 ÷ 2 = 4 cm.' },
      C: { error: 'Student doubled the diameter.', remediation: 'Radius = diameter ÷ 2 = 4 cm.' },
      D: { error: 'Student divided by 4.', remediation: 'Divide by 2: 8 ÷ 2 = 4 cm.' }
    }
  },

  // Medium (9)
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Volume of Cylinders', subtopic_id: 262,
    question_text: 'A cylinder has a volume of 500π cubic meters and a height of 20 meters. What is its radius?',
    option_a: '5 meters', option_b: '25 meters', option_c: '10 meters', option_d: '2.5 meters',
    correct_answer: 'A',
    explanation: 'V = πr²h. 500π = πr²(20). Divide both sides by 20π: r² = 25. Taking the square root gives r = 5 meters.',
    distractor_diagnostics: {
      B: { error: 'Student found r² = 25 but forgot to take the square root.', remediation: 'Since r² = 25, take the square root to find radius: r = √25 = 5 meters.' },
      C: { error: 'Student divided 500 by 50 or guessed 10.', remediation: 'r² = 500 / 20 = 25; r = 5 meters.' },
      D: { error: 'Student halved the radius.', remediation: 'r = √25 = 5 meters.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Volume of Cones', subtopic_id: 263,
    question_text: 'A cone has a diameter of 12 inches and a height of 8 inches. What is the volume of the cone? (Use π ≈ 3.14)',
    option_a: '301.44 cubic inches', option_b: '1,205.76 cubic inches', option_c: '904.32 cubic inches', option_d: '602.88 cubic inches',
    correct_answer: 'A',
    explanation: 'Radius r = 12 ÷ 2 = 6 inches. V = 1/3 πr²h = 1/3 × 3.14 × 6² × 8 = 1/3 × 3.14 × 36 × 8 = 1/3 × 904.32 = 301.44 cubic inches.',
    distractor_diagnostics: {
      B: { error: 'Student used diameter in cylinder formula: 3.14 × 144 × 8 = 1,205.76 (did not halve diameter and did not divide by 3).', remediation: 'Halve diameter to find r = 6, and divide by 3 for cone: V = 1/3 πr²h = 301.44 cu in.' },
      C: { error: 'Student forgot to divide by 3 (calculated cylinder volume for r = 6).', remediation: 'Cone volume is one-third cylinder volume: 904.32 ÷ 3 = 301.44 cu in.' },
      D: { error: 'Student multiplied by 2/3 instead of 1/3.', remediation: 'V = 1/3 πr²h = 301.44 cu in.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Volume of Spheres', subtopic_id: 264,
    question_text: 'A basketball has a diameter of 20 cm. What is its volume? (Use π ≈ 3.14, round to nearest whole number)',
    option_a: '4,187 cubic cm', option_b: '33,493 cubic cm', option_c: '1,256 cubic cm', option_d: '8,373 cubic cm',
    correct_answer: 'A',
    explanation: 'Radius r = 20 ÷ 2 = 10 cm. V = 4/3 πr³ = 4/3 × 3.14 × 10³ = 4/3 × 3.14 × 1,000 ≈ 4,186.67 ≈ 4,187 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student used diameter 20 as radius: 4/3 × 3.14 × 8,000 = 33,493.', remediation: 'Always halve diameter to get radius: r = 10 cm; V = 4/3 × 3.14 × 1,000 ≈ 4,187 cm³.' },
      C: { error: 'Student calculated surface area (4πr² = 4 × 3.14 × 100 = 1,256) instead of volume.', remediation: 'Volume formula is 4/3 πr³ = 4,187 cm³.' },
      D: { error: 'Student forgot to divide by 3 (4πr³ / 1).', remediation: 'V = (4/3) × π × r³ ≈ 4,187 cm³.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Composite 3D Figures', subtopic_id: 266,
    question_text: 'A silo is formed by a cylinder of radius 4 meters and height 10 meters, topped with a hemisphere of radius 4 meters. What is the total volume in terms of π?',
    option_a: '202.67π cubic meters (or 608π/3)', option_b: '160π cubic meters', option_c: '245.33π cubic meters', option_d: '181.33π cubic meters',
    correct_answer: 'A',
    explanation: 'Cylinder volume = π × 4² × 10 = 160π. Hemisphere volume = 1/2 × (4/3 π × 4³) = 2/3 π × 64 = 128π/3 ≈ 42.67π. Total = 160π + 42.67π = 202.67π m³ (608π/3).',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the cylinder volume and omitted the hemisphere top.', remediation: 'Add the hemisphere volume: Cylinder (160π) + Hemisphere (42.67π) = 202.67π m³.' },
      C: { error: 'Student added a full sphere instead of a hemisphere: 160π + 85.33π = 245.33π.', remediation: 'A hemisphere is half a sphere: 85.33π ÷ 2 = 42.67π; total = 202.67π m³.' },
      D: { error: 'Student made an arithmetic calculation slip.', remediation: '160π + 42.67π = 202.67π m³.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Real-World Volume Applications', subtopic_id: 267,
    question_text: 'A cylindrical water tank has radius 5 feet and height 12 feet. If water is pumped in at a rate of 15 cubic feet per minute, approximately how many minutes will it take to fill the tank? (Use π ≈ 3.14)',
    option_a: '62.8 minutes', option_b: '31.4 minutes', option_c: '125.6 minutes', option_d: '20.9 minutes',
    correct_answer: 'A',
    explanation: 'Volume = πr²h = 3.14 × 25 × 12 = 942 cubic feet. Time = 942 ÷ 15 = 62.8 minutes.',
    distractor_diagnostics: {
      B: { error: 'Student halved the time or used radius 5 as diameter.', remediation: 'V = 3.14 × 25 × 12 = 942 cu ft; 942 ÷ 15 = 62.8 minutes.' },
      C: { error: 'Student doubled the time.', remediation: 'Time = Volume / Rate = 942 / 15 = 62.8 min.' },
      D: { error: 'Student used cone volume (divided by 3): 314 ÷ 15 = 20.9 min.', remediation: 'The tank is a cylinder, not a cone: V = πr²h = 942 cu ft.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Volume of Cylinders', subtopic_id: 262,
    question_text: 'A cylinder and a cone have the same base radius and the same height. If the cylinder has a volume of 72 cubic inches, what is the volume of the cone?',
    option_a: '24 cubic inches', option_b: '36 cubic inches', option_c: '216 cubic inches', option_d: '18 cubic inches',
    correct_answer: 'A',
    explanation: 'The volume of a cone is exactly 1/3 the volume of a cylinder with identical base and height: 72 ÷ 3 = 24 cubic inches.',
    distractor_diagnostics: {
      B: { error: 'Student divided by 2 instead of 3.', remediation: 'A cone is 1/3 of a cylinder\'s volume, not 1/2: 72 ÷ 3 = 24 cu in.' },
      C: { error: 'Student multiplied by 3 instead of dividing by 3.', remediation: 'A cone is smaller than a cylinder: divide by 3: 72 ÷ 3 = 24 cu in.' },
      D: { error: 'Student divided by 4.', remediation: 'The cone-to-cylinder volume ratio is 1:3: 72 ÷ 3 = 24 cu in.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Cross-Sections', subtopic_id: 265,
    question_text: 'What 2D cross-section is produced when a plane passes through the apex and base of a right circular cone perpendicular to the base?',
    option_a: 'An isosceles triangle', option_b: 'A circle', option_c: 'A parabola', option_d: 'A trapezoid',
    correct_answer: 'A',
    explanation: 'A vertical cut passing through the apex of a right circular cone produces an isosceles triangle.',
    distractor_diagnostics: {
      B: { error: 'A circle is produced by a horizontal slice parallel to the base.', remediation: 'Cutting vertically through the apex creates an isosceles triangle with legs along the slant height.' },
      C: { error: 'A parabola is produced by slicing parallel to the slant height, not through the apex.', remediation: 'Passing through the apex yields a triangle.' },
      D: { error: 'A truncated cone (frustum) slice might give a trapezoid, but through the apex gives a triangle.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Volume of Cones', subtopic_id: 263,
    question_text: 'A conical paper cup has a volume of 48π cubic cm. If its height is 9 cm, what is the radius of the top circular opening?',
    option_a: '4 cm', option_b: '16 cm', option_c: '8 cm', option_d: '2 cm',
    correct_answer: 'A',
    explanation: 'V = 1/3 πr²h. 48π = 1/3 π r² (9) = 3π r². Divide by 3π: r² = 16. Therefore, r = √16 = 4 cm.',
    distractor_diagnostics: {
      B: { error: 'Student found r² = 16 but forgot to take the square root.', remediation: 'Since r² = 16, take the square root: r = 4 cm.' },
      C: { error: 'Student divided 16 by 2 instead of taking square root.', remediation: '√16 = 4, not 8.' },
      D: { error: 'Student took square root twice.', remediation: 'r = √16 = 4 cm.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Composite 3D Figures', subtopic_id: 266,
    question_text: 'An ice cream cone consists of a waffle cone of radius 3 cm and height 12 cm, filled to the brim and topped with a hemisphere of ice cream of radius 3 cm. What is the total volume of ice cream in terms of π?',
    option_a: '54π cubic cm', option_b: '36π cubic cm', option_c: '72π cubic cm', option_d: '90π cubic cm',
    correct_answer: 'A',
    explanation: 'Cone volume = 1/3 πr²h = 1/3 × π × 9 × 12 = 36π. Hemisphere volume = 1/2 × (4/3 π × 3³) = 2/3 π × 27 = 18π. Total volume = 36π + 18π = 54π cubic cm.',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the cone volume (36π).', remediation: 'Add the hemisphere scoop on top (18π): 36π + 18π = 54π cubic cm.' },
      C: { error: 'Student added a full sphere (36π) instead of a hemisphere: 36π + 36π = 72π.', remediation: 'The scoop on top is a hemisphere: half of 36π = 18π; 36π + 18π = 54π.' },
      D: { error: 'Student calculated cylinder plus sphere.', remediation: 'Cone is 36π, hemisphere is 18π: total = 54π cm³.' }
    }
  },

  // High (8)
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Real-World Volume Applications', subtopic_id: 267,
    question_text: 'A cylindrical glass of water has radius 4 cm and is filled with water to a height of 10 cm. A solid metal spherical ball of radius 3 cm is dropped into the glass and sinks to the bottom. How much does the water level rise? (Leave answer in fractional/decimal form)',
    option_a: '2.25 cm', option_b: '3.00 cm', option_c: '4.50 cm', option_d: '1.50 cm',
    correct_answer: 'A',
    explanation: 'Sphere volume = 4/3 π × 3³ = 36π cm³. The water displaced has volume = π × r_cylinder² × Δh = π × 16 × Δh. Equating volumes: 16π Δh = 36π => Δh = 36 / 16 = 2.25 cm.',
    distractor_diagnostics: {
      B: { error: 'Student assumed water rise equals the radius of the sphere (3 cm).', remediation: 'The volume displaced must match the sphere\'s volume: Δh = V_sphere / (π × r_glass²) = 36π / 16π = 2.25 cm.' },
      C: { error: 'Student divided 36 by 8 instead of 16.', remediation: 'Glass base area is π × 4² = 16π. 36π ÷ 16π = 2.25 cm.' },
      D: { error: 'Student made an arithmetic slip in division.', remediation: '36 / 16 = 9 / 4 = 2.25 cm.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Volume of Spheres', subtopic_id: 264,
    question_text: 'A large spherical balloon has a radius of 6 feet. A smaller balloon has a radius of 2 feet. How many times greater is the volume of the larger balloon compared to the smaller balloon?',
    option_a: '27 times greater', option_b: '3 times greater', option_c: '9 times greater', option_d: '81 times greater',
    correct_answer: 'A',
    explanation: 'Ratio of radii = 6 / 2 = 3. Volume scales with the cube of the scale factor: 3³ = 27 times greater.',
    distractor_diagnostics: {
      B: { error: 'Student compared radii linearly (6 / 2 = 3).', remediation: 'Volume scales with the cube of the scale factor: (scale)³ = 3³ = 27.' },
      C: { error: 'Student compared surface areas (scale factor squared: 3² = 9).', remediation: 'Area scales by factor², but volume scales by factor³: 3³ = 27.' },
      D: { error: 'Student calculated 3⁴ = 81.', remediation: 'Volume ratio is 3³ = 27.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Volume of Cones', subtopic_id: 263,
    question_text: 'A conical tank has a base radius of 5 meters and a slant height of 13 meters. What is the volume of the cone in terms of π? (Recall: slant height s, radius r, and height h form a right triangle: r² + h² = s²)',
    option_a: '100π cubic meters', option_b: '300π cubic meters', option_c: '108.33π cubic meters', option_d: '65π cubic meters',
    correct_answer: 'A',
    explanation: 'First find vertical height h using Pythagorean theorem: h = √(13² - 5²) = √(169 - 25) = √144 = 12 meters. Volume = 1/3 π r² h = 1/3 × π × 25 × 12 = 100π cubic meters.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 3 (used cylinder formula: π × 25 × 12 = 300π).', remediation: 'Cone volume is 1/3 πr²h = (1/3) × 300π = 100π m³.' },
      C: { error: 'Student used slant height 13 instead of vertical height 12 in formula: 1/3 × 25 × 13 = 108.33π.', remediation: 'Volume requires the perpendicular vertical height h (12 m), not slant height (13 m).' },
      D: { error: 'Student multiplied 5 × 13 = 65π.', remediation: 'Find h = 12 m first: V = 1/3 π (25) (12) = 100π m³.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Volume of Cylinders', subtopic_id: 262,
    question_text: 'A metal pipe has an outer radius of 5 cm, an inner radius of 3 cm, and a length of 20 cm. What is the volume of metal in the pipe in terms of π?',
    option_a: '320π cubic cm', option_b: '500π cubic cm', option_c: '180π cubic cm', option_d: '80π cubic cm',
    correct_answer: 'A',
    explanation: 'Outer cylinder volume = π × 5² × 20 = 500π. Inner hollow cylinder volume = π × 3² × 20 = 180π. Volume of metal = 500π - 180π = 320π cubic cm (or π(5² - 3²) × 20 = π(25 - 9) × 20 = 16 × 20π = 320π).',
    distractor_diagnostics: {
      B: { error: 'Student calculated outer volume without subtracting inner hollow core.', remediation: 'Subtract inner volume: 500π - 180π = 320π cm³.' },
      C: { error: 'Student calculated only the inner core volume.', remediation: 'Subtract inner from outer: 500π - 180π = 320π cm³.' },
      D: { error: 'Student squared the difference of radii: π(5 - 3)² × 20 = 80π.', remediation: 'Difference of squares is (R² - r²), NOT (R - r)²: (25 - 9) × 20 = 320π cm³.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Cross-Sections', subtopic_id: 265,
    question_text: 'A plane slices through a cube so that it passes through exactly three vertices that share a common corner. What 2D cross-section is formed?',
    option_a: 'An equilateral triangle', option_b: 'A right triangle', option_c: 'A square', option_d: 'A regular hexagon',
    correct_answer: 'A',
    explanation: 'The three vertices are endpoints of three equal cube edges originating from the common corner. The connecting line segments are face diagonals of the cube faces, all having equal length (s√2). Therefore, the slice forms an equilateral triangle.',
    distractor_diagnostics: {
      B: { error: 'Student thought the faces meet at 90 degrees so the triangle must be a right triangle.', remediation: 'The cross-section sides are face diagonals of equal length s√2, making all three sides equal (equilateral).' },
      C: { error: 'A slice through 3 vertices can only produce a 3-sided polygon (a triangle).', remediation: 'Three coplanar points form a triangle, not a quadrilateral.' },
      D: { error: 'A hexagon requires slicing through 6 faces of the cube.', remediation: 'Slicing through 3 corner-adjacent vertices produces an equilateral triangle.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Composite 3D Figures', subtopic_id: 266,
    question_text: 'A capsule is made of a cylinder of radius 3 mm and height 10 mm, with two hemispheres (each of radius 3 mm) attached to both ends. What is the total volume of the capsule in terms of π?',
    option_a: '126π cubic mm', option_b: '90π cubic mm', option_c: '108π cubic mm', option_d: '144π cubic mm',
    correct_answer: 'A',
    explanation: 'Cylinder volume = π × 3² × 10 = 90π mm³. The two hemispheres combine to form 1 complete sphere of radius 3 mm. Sphere volume = 4/3 π × 3³ = 36π mm³. Total volume = 90π + 36π = 126π cubic mm.',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the cylinder and forgot both hemispheres.', remediation: 'Add the two hemispherical ends (1 complete sphere = 36π): 90π + 36π = 126π mm³.' },
      C: { error: 'Student added only one hemisphere: 90π + 18π = 108π.', remediation: 'There are two hemispherical ends, forming one whole sphere: 90π + 36π = 126π mm³.' },
      D: { error: 'Student added two full spheres.', remediation: 'Two hemispheres equal one full sphere (36π): 90π + 36π = 126π mm³.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Real-World Volume Applications', subtopic_id: 267,
    question_text: 'A company sells coffee beans in two cylindrical containers. Container A has radius 3 inches and height 8 inches. Container B has radius 4 inches and height 4.5 inches. Which container holds more coffee beans and by how much?',
    option_a: 'Both hold the exact same volume (72π cubic inches)', option_b: 'Container A holds 18π cubic inches more', option_c: 'Container B holds 8π cubic inches more', option_d: 'Container A holds 8π cubic inches more',
    correct_answer: 'A',
    explanation: 'Volume of A = π × 3² × 8 = 72π cu in. Volume of B = π × 4² × 4.5 = π × 16 × 4.5 = 72π cu in. Both hold identical volumes.',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated 16 × 4.5 as 54π.', remediation: '16 × 4.5 = 72; both volumes are exactly 72π cubic inches.' },
      C: { error: 'Student miscalculated Container A: 9 × 8 = 72π, Container B = 16 × 4.5 = 72π.', remediation: 'Compare both: 9 × 8 = 72 and 16 × 4.5 = 72, they are equal.' },
      D: { error: 'Student thought height matters more than radius.', remediation: 'Calculate each: A = π(9)(8) = 72π, B = π(16)(4.5) = 72π.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Volume of Cones', subtopic_id: 263,
    question_text: 'If both the radius and the height of a cone are doubled, by what factor does its volume increase?',
    option_a: '8 times', option_b: '4 times', option_c: '2 times', option_d: '16 times',
    correct_answer: 'A',
    explanation: 'V = 1/3 π r² h. If r becomes 2r and h becomes 2h, V_new = 1/3 π (2r)² (2h) = 1/3 π (4r²) (2h) = 8 × (1/3 π r² h) = 8 times the original volume.',
    distractor_diagnostics: {
      B: { error: 'Student only accounted for radius squared (2² = 4) and forgot the height factor.', remediation: 'Volume is proportional to r² × h: (2²) × (2) = 4 × 2 = 8 times.' },
      C: { error: 'Student assumed volume increases linearly by 2.', remediation: 'Radius is squared, so (2)² × 2 = 8.' },
      D: { error: 'Student computed 2⁴ = 16.', remediation: 'The dimension power sum is 2 (radius) + 1 (height) = 3; 2³ = 8.' }
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

  console.log('Starting insertion of 50 questions for Grade 7 & Grade 8 Measurement...');
  const allQuestions = [...g7Questions, ...g8Questions];
  let inserted = 0;
  let updated = 0;

  for (const q of allQuestions) {
    const [existing] = await connection.execute(
      'SELECT id FROM questions WHERE question_text = ? AND grade = ? AND topic_id = 4',
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

  console.log(`Grade 7 & 8 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await connection.end();
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
