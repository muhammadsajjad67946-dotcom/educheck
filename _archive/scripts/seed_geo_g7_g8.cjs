const mysql = require('mysql2/promise');
require('dotenv').config();

const g7Questions = [
  // Low (8)
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'On a map, the scale is 1 inch = 5 miles. If two cities are 3 inches apart on the map, what is the actual distance between them?',
    option_a: '15 miles', option_b: '8 miles', option_c: '12 miles', option_d: '5 miles',
    correct_answer: 'A',
    explanation: 'Multiply the map distance by the scale ratio: 3 inches × 5 miles/inch = 15 miles.',
    distractor_diagnostics: {
      B: { error: 'The student added 3 + 5.', remediation: 'Multiply the map measurement by the number of miles per inch.' },
      C: { error: 'The student made a multiplication error.', remediation: '3 × 5 = 15 miles.' },
      D: { error: 'The student just took the unit scale distance.', remediation: 'Multiply 1 inch = 5 miles by 3 to find 15 miles.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A blueprint uses a scale of 1 cm = 4 meters. If a room has a length of 6 cm on the blueprint, what is the actual length of the room?',
    option_a: '24 meters', option_b: '10 meters', option_c: '20 meters', option_d: '1.5 meters',
    correct_answer: 'A',
    explanation: 'Actual length = 6 cm × 4 meters/cm = 24 meters.',
    distractor_diagnostics: {
      B: { error: 'The student added 6 + 4 instead of multiplying.', remediation: 'Multiply the blueprint measure by the scale value (6 × 4 = 24).' },
      C: { error: 'The student calculated incorrectly.', remediation: '6 × 4 = 24 meters.' },
      D: { error: 'The student divided 6 by 4.', remediation: 'To go from drawing units to actual units, multiply by 4.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A model car is built using a scale factor of 1/20 of the real car. If the real car is 180 inches long, how long is the model car?',
    option_a: '9 inches', option_b: '160 inches', option_c: '3,600 inches', option_d: '18 inches',
    correct_answer: 'A',
    explanation: 'Length of model = 180 × (1/20) = 180 / 20 = 9 inches.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 20 from 180.', remediation: 'Multiply the actual length by the fractional scale factor 1/20.' },
      C: { error: 'The student multiplied 180 by 20.', remediation: 'The model is smaller than the real car, so divide by 20.' },
      D: { error: 'The student divided by 10 instead of 20.', remediation: '180 divided by 20 equals 9 inches.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'What does a scale factor greater than 1 represent in a scale drawing or model?',
    option_a: 'An enlargement', option_b: 'A reduction', option_c: 'No change in size', option_d: 'A rotation',
    correct_answer: 'A',
    explanation: 'A scale factor greater than 1 makes the copy larger than the original, which is an enlargement.',
    distractor_diagnostics: {
      B: { error: 'The student confused enlargement with reduction.', remediation: 'A scale factor between 0 and 1 creates a reduction; greater than 1 creates an enlargement.' },
      C: { error: 'The student thought scale factor 1 meant greater than 1.', remediation: 'Scale factor 1 preserves size; greater than 1 enlarges.' },
      D: { error: 'The student chose a transformation of orientation.', remediation: 'Scale factor controls size change, not rotation.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'Can a triangle have sides of lengths 3 cm, 4 cm, and 10 cm?',
    option_a: 'No, because 3 + 4 is less than 10', option_b: 'Yes, because all numbers are positive', option_c: 'Yes, because 3 + 10 is greater than 4', option_d: 'No, because all sides must be equal',
    correct_answer: 'A',
    explanation: 'According to the Triangle Inequality Theorem, the sum of any two side lengths must be strictly greater than the third side. Here, 3 + 4 = 7, which is not greater than 10.',
    distractor_diagnostics: {
      B: { error: 'The student assumed any positive lengths can form a triangle.', remediation: 'Check the Triangle Inequality: the sum of the two shorter sides must exceed the longest side.' },
      C: { error: 'The student checked only one pair including the longest side.', remediation: 'You must check if the sum of the two shorter sides is greater than the longest side.' },
      D: { error: 'The student thought triangles require equal sides.', remediation: 'Scalene triangles have unequal sides, but they still must obey the Triangle Inequality Theorem.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'What is the sum of the interior angle measures of any triangle?',
    option_a: '180°', option_b: '360°', option_c: '90°', option_d: '270°',
    correct_answer: 'A',
    explanation: 'The interior angles of every Euclidean triangle always sum up to exactly 180°.',
    distractor_diagnostics: {
      B: { error: 'The student gave the angle sum for a quadrilateral.', remediation: 'A quadrilateral has 360°, but a triangle has 180°.' },
      C: { error: 'The student gave the measure of a right angle.', remediation: 'The sum of all three angles in a triangle is 180°.' },
      D: { error: 'The student chose 270°.', remediation: 'Remember the angle sum property of triangles: sum = 180°.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'A triangle has angle measures of 50° and 60°. What is the measure of the third angle?',
    option_a: '70°', option_b: '110°', option_c: '80°', option_d: '60°',
    correct_answer: 'A',
    explanation: 'The sum of angles in a triangle is 180°. Third angle = 180° - (50° + 60°) = 180° - 110° = 70°.',
    distractor_diagnostics: {
      B: { error: 'The student calculated the sum of the two given angles without subtracting from 180°.', remediation: 'Subtract 110° from 180° to find the missing third angle.' },
      C: { error: 'The student subtracted incorrectly.', remediation: '180 - 110 = 70°.' },
      D: { error: 'The student guessed 60° assuming an isosceles triangle.', remediation: 'Use 180° - 50° - 60° = 70°.' }
    }
  },
  {
    grade: 7, difficulty: 'Low', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'Which 2D shape is formed by slicing a rectangular prism horizontally parallel to its base?',
    option_a: 'A rectangle', option_b: 'A triangle', option_c: 'A circle', option_d: 'A trapezoid',
    correct_answer: 'A',
    explanation: 'A cross-section parallel to the base of a prism always has the exact same shape as the base, which is a rectangle.',
    distractor_diagnostics: {
      B: { error: 'The student guessed a triangle.', remediation: 'A slice parallel to the base of a prism matches the base shape (rectangle).' },
      C: { error: 'The student thought of a cylinder slice.', remediation: 'A rectangular prism has flat rectangular faces and cross-sections.' },
      D: { error: 'The student chose a trapezoid.', remediation: 'A parallel horizontal slice directly mirrors the rectangular base.' }
    }
  },

  // Medium (9)
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A map has a scale of 1 inch = 8 miles. If the actual distance between two towns is 56 miles, how many inches apart are they on the map?',
    option_a: '7 inches', option_b: '6 inches', option_c: '8 inches', option_d: '448 inches',
    correct_answer: 'A',
    explanation: 'Divide the actual distance by the scale rate: 56 miles ÷ 8 miles/inch = 7 inches.',
    distractor_diagnostics: {
      B: { error: 'The student made a division error.', remediation: '56 divided by 8 is 7.' },
      C: { error: 'The student repeated the scale number 8.', remediation: 'Calculate 56 / 8 = 7 inches.' },
      D: { error: 'The student multiplied 56 by 8 instead of dividing.', remediation: 'To convert from actual miles to map inches, divide by 8.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A drawing of a garden has dimensions 4 inches by 6 inches. The scale is 1 inch = 3 feet. What is the ACTUAL perimeter of the garden?',
    option_a: '60 feet', option_b: '20 feet', option_c: '72 feet', option_d: '216 feet',
    correct_answer: 'A',
    explanation: 'Actual dimensions are 4 × 3 = 12 feet and 6 × 3 = 18 feet. Perimeter = 2(12 + 18) = 2(30) = 60 feet. (Or drawing perimeter = 20 inches × 3 = 60 feet).',
    distractor_diagnostics: {
      B: { error: 'The student calculated the drawing perimeter in inches without applying the scale.', remediation: 'Multiply the drawing perimeter of 20 inches by 3 feet/inch to get 60 feet.' },
      C: { error: 'The student calculated the area in square feet instead of perimeter.', remediation: 'Perimeter is the distance around: 2(12 + 18) = 60 feet.' },
      D: { error: 'The student calculated actual area (12 × 18 = 216).', remediation: 'Perimeter is 2 × length + 2 × width = 60 feet.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A rectangle has an area of 12 square centimeters. If a scale factor of 3 is applied to enlarge both its length and width, what is the area of the new rectangle?',
    option_a: '108 square centimeters', option_b: '36 square centimeters', option_c: '72 square centimeters', option_d: '24 square centimeters',
    correct_answer: 'A',
    explanation: 'When linear dimensions are multiplied by a scale factor k, the area is multiplied by k². Here, area = 12 × 3² = 12 × 9 = 108 cm².',
    distractor_diagnostics: {
      B: { error: 'The student multiplied the area by k (3) instead of k² (9).', remediation: 'Area scales by the square of the scale factor: 12 × 3² = 108.' },
      C: { error: 'The student doubled the multiplied value.', remediation: 'Multiply 12 by 3² = 9 to get 108.' },
      D: { error: 'The student multiplied by 2 instead of scaling by 3.', remediation: 'New area = original area × (scale factor)².' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'On a blueprint, a wall that is 5 inches long represents an actual wall of 15 feet. What is the scale of the blueprint in inches to feet in simplest form?',
    option_a: '1 inch = 3 feet', option_b: '1 inch = 5 feet', option_c: '3 inches = 1 foot', option_d: '1 inch = 15 feet',
    correct_answer: 'A',
    explanation: 'Divide both quantities by 5: 5 inches / 5 = 1 inch, 15 feet / 5 = 3 feet. The scale is 1 inch = 3 feet.',
    distractor_diagnostics: {
      B: { error: 'The student took the drawing measurement as the scale.', remediation: 'Divide 15 feet by 5 inches to get 3 feet per inch.' },
      C: { error: 'The student inverted the relationship.', remediation: '1 inch represents 3 feet, not 3 inches to 1 foot.' },
      D: { error: 'The student did not reduce the ratio.', remediation: 'Simplify 5 inches : 15 feet to 1 inch : 3 feet.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A photo that is 4 inches wide and 6 inches long is enlarged so that its width is 10 inches. What is the length of the enlarged photo?',
    option_a: '15 inches', option_b: '12 inches', option_c: '14 inches', option_d: '16 inches',
    correct_answer: 'A',
    explanation: 'The scale factor is 10 ÷ 4 = 2.5. Multiply the length by the scale factor: 6 × 2.5 = 15 inches.',
    distractor_diagnostics: {
      B: { error: 'The student added 6 to width and length.', remediation: 'Scaling requires multiplying by a ratio, not adding a constant: (10/4) × 6 = 15.' },
      C: { error: 'The student made an estimation error.', remediation: '6 × (10 / 4) = 6 × 2.5 = 15 inches.' },
      D: { error: 'The student multiplied 4 by 4 and subtracted.', remediation: 'Set up a proportion: 4/6 = 10/x, so 4x = 60 and x = 15.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'Which set of three side lengths CAN form a valid triangle?',
    option_a: '6 cm, 8 cm, 11 cm', option_b: '2 cm, 5 cm, 8 cm', option_c: '4 cm, 4 cm, 9 cm', option_d: '3 cm, 7 cm, 10 cm',
    correct_answer: 'A',
    explanation: 'In option A, 6 + 8 = 14 > 11, so it satisfies the Triangle Inequality Theorem. In B: 2 + 5 = 7 < 8. In C: 4 + 4 = 8 < 9. In D: 3 + 7 = 10 (not greater).',
    distractor_diagnostics: {
      B: { error: '2 + 5 = 7 is less than 8.', remediation: 'The sum of the two shorter sides must be strictly greater than the third side.' },
      C: { error: '4 + 4 = 8 is less than 9.', remediation: 'The two shorter sides must add to more than 9.' },
      D: { error: '3 + 7 = 10 is equal to, not greater than, 10.', remediation: 'The sum must be strictly greater than the third side (a degenerate line results if equal).' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'How many unique triangles can be constructed with angle measures 40°, 60°, and 80°?',
    option_a: 'Infinitely many triangles', option_b: 'Exactly one unique triangle', option_c: 'No triangles', option_d: 'Exactly two triangles',
    correct_answer: 'A',
    explanation: 'Since the angles sum to 180°, valid triangles can be formed. However, specifying only three angles determines shape (similarity) but not size, so infinitely many triangles of different sizes can be created.',
    distractor_diagnostics: {
      B: { error: 'The student thought three angles fix a unique triangle.', remediation: 'Three angles determine shape (AAA similarity), but you can scale it to infinitely many sizes.' },
      C: { error: 'The student thought the angles do not add to 180°.', remediation: '40 + 60 + 80 = 180°, so triangles do exist.' },
      D: { error: 'The student thought there are two triangles.', remediation: 'Without any fixed side length, infinitely many scaled triangles exist.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'If a right circular cylinder is sliced vertically perpendicular to its circular bases, what 2D cross-section is produced?',
    option_a: 'A rectangle', option_b: 'A circle', option_c: 'An ellipse', option_d: 'A triangle',
    correct_answer: 'A',
    explanation: 'A vertical cut perpendicular to the bases of a cylinder cuts straight down through the curved surface, forming a flat rectangle.',
    distractor_diagnostics: {
      B: { error: 'The student chose a circle, which is the horizontal cross-section.', remediation: 'Horizontal cuts parallel to bases give circles; vertical cuts perpendicular to bases give rectangles.' },
      C: { error: 'The student chose an ellipse, which is an angled slice.', remediation: 'A perpendicular vertical slice through a cylinder yields a rectangle.' },
      D: { error: 'The student thought of slicing a cone.', remediation: 'A cylinder has straight parallel sides, producing a rectangle.' }
    }
  },
  {
    grade: 7, difficulty: 'Medium', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'Two sides of a triangle measure 7 inches and 10 inches. What is the range of possible lengths for the third side, x?',
    option_a: '3 < x < 17', option_b: '3 <= x <= 17', option_c: '7 < x < 10', option_d: '0 < x < 17',
    correct_answer: 'A',
    explanation: 'The third side must be greater than the difference (10 - 7 = 3) and less than the sum (10 + 7 = 17). Thus, 3 < x < 17.',
    distractor_diagnostics: {
      B: { error: 'The student included endpoints with <=.', remediation: 'The inequalities must be strict (> and <), because if x = 3 or 17, the triangle collapses into a line segment.' },
      C: { error: 'The student thought the third side must fall between the two given sides.', remediation: 'The third side can be longer than 10 or shorter than 7, as long as 3 < x < 17.' },
      D: { error: 'The student used 0 as the lower bound.', remediation: 'The lower bound is the difference between the two known sides: 10 - 7 = 3.' }
    }
  },

  // High (8)
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A rectangular patio is drawn at a scale of 1/4 inch = 2 feet. If the drawing is 2 inches wide by 3.5 inches long, what is the ACTUAL area of the patio in square feet?',
    option_a: '448 square feet', option_b: '112 square feet', option_c: '224 square feet', option_d: '896 square feet',
    correct_answer: 'A',
    explanation: 'Since 1/4 inch = 2 feet, 1 inch = 8 feet. Actual width = 2 × 8 = 16 feet. Actual length = 3.5 × 8 = 28 feet. Actual area = 16 × 28 = 448 square feet.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied by 4 instead of 8.', remediation: '1/4 inch = 2 feet means 1 full inch = 8 feet. Width = 16 ft, length = 28 ft, area = 448 sq ft.' },
      C: { error: 'The student forgot to scale both dimensions.', remediation: 'Area scale factor is 8² = 64. Drawing area = 7 sq in × 64 = 448 sq ft.' },
      D: { error: 'The student doubled the correct area.', remediation: '16 × 28 = 448 square feet.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'The area of a park on a map is 6 square inches. The map scale is 1 inch = 4 miles. What is the ACTUAL area of the park in square miles?',
    option_a: '96 square miles', option_b: '24 square miles', option_c: '48 square miles', option_d: '384 square miles',
    correct_answer: 'A',
    explanation: 'Since 1 inch = 4 miles, 1 square inch = 4² = 16 square miles. Actual area = 6 × 16 = 96 square miles.',
    distractor_diagnostics: {
      B: { error: 'The student multiplied 6 by 4 instead of 4².', remediation: 'When converting area, square the linear scale factor: 4² = 16, so 6 × 16 = 96 sq miles.' },
      C: { error: 'The student multiplied by 8.', remediation: 'Square the scale factor: 4 × 4 = 16, then 6 × 16 = 96.' },
      D: { error: 'The student multiplied by 64.', remediation: 'The area conversion factor is 4² = 16, giving 96 square miles.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'A scale model of a building is 18 inches tall. The actual building is 90 feet tall. If a door on the actual building is 8 feet tall, what is the height of the door on the model?',
    option_a: '1.6 inches', option_b: '1.2 inches', option_c: '2.0 inches', option_d: '0.8 inches',
    correct_answer: 'A',
    explanation: 'Scale ratio = 18 inches / 90 feet = 0.2 inches per foot. Door height on model = 8 feet × 0.2 inches/foot = 1.6 inches.',
    distractor_diagnostics: {
      B: { error: 'The student made an arithmetic error.', remediation: '8 × (18 / 90) = 8 × 0.2 = 1.6 inches.' },
      C: { error: 'The student rounded up to 2.0 inches.', remediation: 'Calculate exact proportion: 18/90 = x/8 -> x = 144/90 = 1.6 inches.' },
      D: { error: 'The student divided 8 by 10.', remediation: 'Use the scale factor 18/90 = 1/5: 8 / 5 = 1.6 inches.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Scale Drawings', subtopic_id: 295,
    question_text: 'An architect redraws a floor plan changing the scale from 1 inch = 10 feet to 1 inch = 5 feet. How does the area of the floor plan drawing change?',
    option_a: 'The drawing area becomes 4 times larger', option_b: 'The drawing area becomes 2 times larger', option_c: 'The drawing area becomes half as large', option_d: 'The drawing area does not change',
    correct_answer: 'A',
    explanation: 'At 1 inch = 5 feet, each linear inch represents half as many feet, so each linear dimension on the paper doubles (2×). Therefore, the area on the paper increases by 2² = 4 times.',
    distractor_diagnostics: {
      B: { error: 'The student considered linear dimensions instead of area.', remediation: 'Linear lengths double (2×), so area multiplies by 2² = 4.' },
      C: { error: 'The student thought the drawing gets smaller.', remediation: 'A smaller scale number means more drawing inches per foot, making the drawing larger.' },
      D: { error: 'The student thought changing the scale does not affect drawing size.', remediation: 'Changing the scale directly alters the size of the drawing.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'A triangle has two sides of length 8 cm and 13 cm, with an included angle of 65° between them. How many unique triangles can be constructed with these given conditions?',
    option_a: 'Exactly one unique triangle', option_b: 'More than one triangle', option_c: 'No triangle', option_d: 'Exactly two different triangles',
    correct_answer: 'A',
    explanation: 'By the Side-Angle-Side (SAS) congruence criterion, specifying two side lengths and the included angle uniquely determines exactly one triangle.',
    distractor_diagnostics: {
      B: { error: 'The student thought SAS allows multiple triangles.', remediation: 'The SAS condition fixes all three vertices, creating exactly one unique triangle.' },
      C: { error: 'The student thought a triangle cannot be formed.', remediation: 'Any two positive side lengths with an included angle between 0° and 180° always form a valid triangle.' },
      D: { error: 'The student confused SAS with the ambiguous SSA case.', remediation: 'Here the angle is INCLUDED between the two sides (SAS), so only one triangle is possible.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'A right square pyramid is sliced by a plane that passes through its top apex and cuts through the base perpendicular to the base. What shape is the cross-section?',
    option_a: 'An isosceles triangle', option_b: 'A square', option_c: 'A rectangle', option_d: 'A trapezoid',
    correct_answer: 'A',
    explanation: 'The plane passes through the apex (a single point at top) and a line across the base, with two equal slanted edges, producing an isosceles triangle.',
    distractor_diagnostics: {
      B: { error: 'The student thought of a horizontal cut parallel to the base.', remediation: 'A horizontal cut yields a square, but a vertical cut through the apex yields a triangle.' },
      C: { error: 'The student guessed a rectangle.', remediation: 'The cross-section reaches a point at the apex, making it a triangle.' },
      D: { error: 'The student thought of a cut that does not pass through the apex.', remediation: 'Since the plane passes directly through the top apex, the cross-section is a triangle.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'Which combination of conditions determines NO possible triangle?',
    option_a: 'Side lengths of 5 cm, 9 cm, and 15 cm', option_b: 'Side lengths of 7 cm, 7 cm, and 7 cm', option_c: 'Angles of 35°, 55°, and 90°', option_d: 'Sides of 6 cm and 8 cm with an included angle of 90°',
    correct_answer: 'A',
    explanation: 'In option A, 5 + 9 = 14 < 15, which violates the Triangle Inequality Theorem, making it impossible to form a triangle.',
    distractor_diagnostics: {
      B: { error: 'This forms an equilateral triangle.', remediation: '7, 7, 7 satisfies 7 + 7 > 7 and forms a valid triangle.' },
      C: { error: 'This forms valid right triangles (35 + 55 + 90 = 180°).', remediation: 'The angle sum is 180°, so infinitely many triangles can be formed.' },
      D: { error: 'This forms a unique right triangle by SAS.', remediation: '6, 8 with 90° included forms a classic 6-8-10 right triangle.' }
    }
  },
  {
    grade: 7, difficulty: 'High', subtopic_name: 'Triangle Construction', subtopic_id: 296,
    question_text: 'A cone is sliced by a flat plane that cuts completely through both sides without intersecting the base, at an angle not parallel to the base. What 2D shape is the cross-section?',
    option_a: 'An ellipse', option_b: 'A circle', option_c: 'A parabola', option_d: 'A triangle',
    correct_answer: 'A',
    explanation: 'A cross-section of a cone cut at an angle to the base that passes through opposite sides of the cone without hitting the base forms an ellipse.',
    distractor_diagnostics: {
      B: { error: 'A circle is formed only when the plane is parallel to the circular base.', remediation: 'An angled cut through the cone produces an elongated curve called an ellipse.' },
      C: { error: 'A parabola is formed when the plane is parallel to the slant height and cuts the base.', remediation: 'A cut through both sides that does not touch the base forms a closed ellipse.' },
      D: { error: 'A triangle is formed when the cut passes through the vertex.', remediation: 'A slice through both sides of a cone without touching the vertex or base produces an ellipse.' }
    }
  }
];

const g8Questions = [
  // Low (8)
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Transformations', subtopic_id: 298,
    question_text: 'Point A is located at (3, 5). If it is translated 4 units right and 2 units down, what are the coordinates of the image A\'?',
    option_a: '(7, 3)', option_b: '(-1, 7)', option_c: '(7, 7)', option_d: '(-1, 3)',
    correct_answer: 'A',
    explanation: 'Translating 4 units right adds 4 to x: 3 + 4 = 7. Translating 2 units down subtracts 2 from y: 5 - 2 = 3. The image is (7, 3).',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 4 from x and added 2 to y.', remediation: 'Moving right means adding to x; moving down means subtracting from y.' },
      C: { error: 'The student added 2 to y instead of subtracting.', remediation: 'Moving down decreases the y-coordinate: 5 - 2 = 3.' },
      D: { error: 'The student subtracted 4 from x.', remediation: 'Moving right increases the x-coordinate: 3 + 4 = 7.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Transformations', subtopic_id: 298,
    question_text: 'What is the coordinate rule when a point (x, y) is reflected over the x-axis?',
    option_a: '(x, -y)', option_b: '(-x, y)', option_c: '(-x, -y)', option_d: '(y, x)',
    correct_answer: 'A',
    explanation: 'Reflecting over the x-axis keeps the x-coordinate unchanged and negates the y-coordinate: (x, y) → (x, -y).',
    distractor_diagnostics: {
      B: { error: 'The student gave the rule for reflection over the y-axis.', remediation: 'Reflecting over the x-axis changes the sign of y, keeping x the same: (x, -y).' },
      C: { error: 'The student gave the rule for a 180° rotation about the origin.', remediation: 'Reflecting across the x-axis only changes the sign of the y-coordinate.' },
      D: { error: 'The student gave the rule for reflection over the line y = x.', remediation: 'Over the x-axis, (x, y) maps to (x, -y).' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Similarity & Dilations', subtopic_id: 299,
    question_text: 'A dilation centered at the origin has a scale factor of k = 3. What are the coordinates of the image of point P(2, -4)?',
    option_a: '(6, -12)', option_b: '(5, -1)', option_c: '(2/3, -4/3)', option_d: '(-6, 12)',
    correct_answer: 'A',
    explanation: 'Multiply both coordinates by the scale factor k = 3: (2 × 3, -4 × 3) = (6, -12).',
    distractor_diagnostics: {
      B: { error: 'The student added 3 to each coordinate.', remediation: 'Dilation is multiplication by scale factor k: (kx, ky), not addition.' },
      C: { error: 'The student divided by 3 instead of multiplying.', remediation: 'Scale factor k = 3 means multiplying by 3: 2 × 3 = 6, -4 × 3 = -12.' },
      D: { error: 'The student multiplied by -3.', remediation: 'The scale factor is positive 3, so signs remain unchanged: (6, -12).' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Angles & Parallel Lines', subtopic_id: 300,
    question_text: 'Two parallel lines are cut by a transversal. If one alternate interior angle measures 65°, what is the measure of the other alternate interior angle?',
    option_a: '65°', option_b: '115°', option_c: '25°', option_d: '180°',
    correct_answer: 'A',
    explanation: 'When two parallel lines are cut by a transversal, alternate interior angles are congruent (equal in measure). Therefore, the other angle is also 65°.',
    distractor_diagnostics: {
      B: { error: 'The student calculated the supplementary angle (180° - 65° = 115°).', remediation: 'Alternate interior angles are congruent (equal), so both are 65°.' },
      C: { error: 'The student subtracted from 90°.', remediation: 'Alternate interior angles are equal: both are 65°.' },
      D: { error: 'The student gave the total line angle sum.', remediation: 'The angle measure is identical: 65°.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Angles & Parallel Lines', subtopic_id: 300,
    question_text: 'In triangle ABC, angle A measures 50° and angle B measures 75°. What is the measure of the exterior angle adjacent to angle C?',
    option_a: '125°', option_b: '55°', option_c: '130°', option_d: '105°',
    correct_answer: 'A',
    explanation: 'By the Exterior Angle Theorem, an exterior angle of a triangle equals the sum of its two remote interior angles: 50° + 75° = 125°.',
    distractor_diagnostics: {
      B: { error: 'The student found the interior angle C (180 - 125 = 55°).', remediation: 'The exterior angle is supplementary to interior angle C, or simply 50° + 75° = 125°.' },
      C: { error: 'The student made an addition error.', remediation: '50 + 75 = 125°.' },
      D: { error: 'The student subtracted 75 from 180.', remediation: 'Add the two remote interior angles: 50° + 75° = 125°.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Pythagorean Theorem', subtopic_id: 301,
    question_text: 'In a right triangle, the two legs have lengths a = 3 and b = 4. What is the length of the hypotenuse c?',
    option_a: '5', option_b: '7', option_c: '25', option_d: '12',
    correct_answer: 'A',
    explanation: 'By the Pythagorean Theorem: c² = a² + b² = 3² + 4² = 9 + 16 = 25. Taking the square root, c = √25 = 5.',
    distractor_diagnostics: {
      B: { error: 'The student added 3 + 4.', remediation: 'Do not add side lengths directly; use a² + b² = c², so c = √(3² + 4²) = 5.' },
      C: { error: 'The student forgot to take the square root of 25.', remediation: 'c² = 25, so c = √25 = 5.' },
      D: { error: 'The student multiplied 3 × 4.', remediation: 'Use the Pythagorean Theorem formula: c = √(a² + b²).' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Pythagorean Theorem', subtopic_id: 301,
    question_text: 'Which equation correctly states the Pythagorean Theorem for a right triangle with legs a and b and hypotenuse c?',
    option_a: 'a² + b² = c²', option_b: 'a + b = c', option_c: 'a² - b² = c²', option_d: 'a² + b² = 2c',
    correct_answer: 'A',
    explanation: 'The Pythagorean Theorem states that in any right triangle, the sum of the squares of the legs equals the square of the hypotenuse: a² + b² = c².',
    distractor_diagnostics: {
      B: { error: 'The student omitted the exponents.', remediation: 'The theorem involves the squares of the sides: a² + b² = c².' },
      C: { error: 'The student subtracted instead of adding.', remediation: 'The squares of the two legs are added: a² + b² = c².' },
      D: { error: 'The student multiplied c by 2 instead of squaring it.', remediation: 'The hypotenuse is squared (c²), not multiplied by 2.' }
    }
  },
  {
    grade: 8, difficulty: 'Low', subtopic_name: 'Volume of Cylinders, Cones & Spheres', subtopic_id: 302,
    question_text: 'What is the formula for the volume of a cylinder with radius r and height h?',
    option_a: 'V = πr²h', option_b: 'V = (1/3)πr²h', option_c: 'V = (4/3)πr³', option_d: 'V = 2πrh',
    correct_answer: 'A',
    explanation: 'The volume of a cylinder is base area times height: V = πr²h.',
    distractor_diagnostics: {
      B: { error: 'The student gave the formula for the volume of a cone.', remediation: 'A cone is (1/3)πr²h; a cylinder is simply πr²h.' },
      C: { error: 'The student gave the formula for the volume of a sphere.', remediation: 'A cylinder volume formula is base area × height = πr²h.' },
      D: { error: 'The student gave the formula for the lateral surface area of a cylinder.', remediation: 'Volume requires squaring the radius: V = πr²h.' }
    }
  },

  // Medium (9)
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Transformations', subtopic_id: 298,
    question_text: 'What are the coordinates of point Q(-3, 4) after a 90° counterclockwise rotation about the origin?',
    option_a: '(-4, -3)', option_b: '(4, 3)', option_c: '(3, -4)', option_d: '(-3, -4)',
    correct_answer: 'A',
    explanation: 'The rule for a 90° counterclockwise rotation about the origin is (x, y) → (-y, x). Applying this to (-3, 4) gives (-4, -3).',
    distractor_diagnostics: {
      B: { error: 'The student negated both and flipped incorrectly.', remediation: 'Use rule (x, y) → (-y, x): the new x is -4 and new y is -3.' },
      C: { error: 'The student used the rule for 270° counterclockwise rotation (y, -x).', remediation: 'A 90° counterclockwise rotation maps (x, y) to (-y, x).' },
      D: { error: 'The student just negated the y-coordinate.', remediation: 'Remember to switch the coordinates and negate the new first term: (-y, x).' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Transformations', subtopic_id: 298,
    question_text: 'Triangle XYZ is translated 5 units left and then reflected over the y-axis to create triangle X\'Y\'Z\'. Which statement is TRUE about the two triangles?',
    option_a: 'They are congruent because rigid transformations preserve side lengths and angle measures', option_b: 'They are similar but not congruent', option_c: 'They have different angle measures', option_d: 'The area of triangle X\'Y\'Z\' is larger than triangle XYZ',
    correct_answer: 'A',
    explanation: 'Translations and reflections are rigid motions (isometries). They preserve side lengths, angle measures, and area, meaning the preimage and image are congruent.',
    distractor_diagnostics: {
      B: { error: 'The student thought reflections change size.', remediation: 'Rigid motions (translations, reflections, rotations) preserve exact size, so shapes are congruent.' },
      C: { error: 'The student thought transformations distort angles.', remediation: 'Rigid motions preserve all angle measures.' },
      D: { error: 'The student thought the area changes.', remediation: 'Area remains identical after translations and reflections.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Similarity & Dilations', subtopic_id: 299,
    question_text: 'A triangle with vertices at (0, 0), (2, 4), and (6, 2) is dilated by a scale factor of 1/2 centered at the origin. What are the coordinates of the new vertices?',
    option_a: '(0, 0), (1, 2), and (3, 1)', option_b: '(0, 0), (4, 8), and (12, 4)', option_c: '(0, 0), (1.5, 3.5), and (5.5, 1.5)', option_d: '(0, 0), (-2, -4), and (-6, -2)',
    correct_answer: 'A',
    explanation: 'Multiply each coordinate by 1/2: (0×0.5, 0×0.5) = (0, 0); (2×0.5, 4×0.5) = (1, 2); (6×0.5, 2×0.5) = (3, 1).',
    distractor_diagnostics: {
      B: { error: 'The student multiplied by 2 instead of 1/2.', remediation: 'A scale factor of 1/2 cuts each coordinate in half.' },
      C: { error: 'The student subtracted 0.5 from coordinates.', remediation: 'Dilation multiplies coordinates by the scale factor: multiply each by 1/2.' },
      D: { error: 'The student negated the coordinates.', remediation: 'A positive scale factor does not change signs.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Similarity & Dilations', subtopic_id: 299,
    question_text: 'If rectangle ABCD is dilated by a scale factor of 4 to form rectangle A\'B\'C\'D\', what happens to its area?',
    option_a: 'The area is multiplied by 16', option_b: 'The area is multiplied by 4', option_c: 'The area is multiplied by 8', option_d: 'The area increases by 4 square units',
    correct_answer: 'A',
    explanation: 'When linear dimensions are scaled by factor k, area scales by k². With k = 4, the area is multiplied by 4² = 16.',
    distractor_diagnostics: {
      B: { error: 'The student scaled the area by k instead of k².', remediation: 'Both length and width are multiplied by 4, so area multiplies by 4 × 4 = 16.' },
      C: { error: 'The student multiplied 4 by 2.', remediation: 'Square the scale factor: 4² = 16.' },
      D: { error: 'The student added 4 instead of multiplying by k².', remediation: 'Dilation affects area multiplicatively by k² = 16.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Angles & Parallel Lines', subtopic_id: 300,
    question_text: 'Two parallel lines are intersected by a transversal. If two consecutive interior (same-side interior) angles are represented by (3x + 10)° and (2x + 20)°, what is the value of x?',
    option_a: '30', option_b: '10', option_c: '36', option_d: '15',
    correct_answer: 'A',
    explanation: 'Same-side interior angles are supplementary (sum to 180°): (3x + 10) + (2x + 20) = 180 → 5x + 30 = 180 → 5x = 150 → x = 30.',
    distractor_diagnostics: {
      B: { error: 'The student set the two angles equal to each other (3x + 10 = 2x + 20 → x = 10).', remediation: 'Same-side interior angles are supplementary (add to 180°), not congruent.' },
      C: { error: 'The student made an algebraic error dividing 180 by 5.', remediation: 'Subtract 30 first: 180 - 30 = 150, then 150 / 5 = 30.' },
      D: { error: 'The student divided 150 by 10.', remediation: '5x = 150, so x = 150 / 5 = 30.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Pythagorean Theorem', subtopic_id: 301,
    question_text: 'A 13-foot ladder is leaning against a vertical wall. The base of the ladder is 5 feet away from the base of the wall. How high up the wall does the ladder reach?',
    option_a: '12 feet', option_b: '8 feet', option_c: '14 feet', option_d: '18 feet',
    correct_answer: 'A',
    explanation: 'The ladder is the hypotenuse (c = 13) and distance from wall is a leg (a = 5). b² = c² - a² = 13² - 5² = 169 - 25 = 144. b = √144 = 12 feet.',
    distractor_diagnostics: {
      B: { error: 'The student subtracted 13 - 5.', remediation: 'Use the Pythagorean theorem: b = √(13² - 5²) = √(169 - 25) = √144 = 12.' },
      C: { error: 'The student added 13² + 5².', remediation: 'The ladder is the hypotenuse, so subtract the leg squared from the hypotenuse squared.' },
      D: { error: 'The student added 13 + 5.', remediation: 'Use the formula a² + b² = c² to solve for the vertical leg: b = 12.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Pythagorean Theorem', subtopic_id: 301,
    question_text: 'What is the distance between points (1, 2) and (4, 6) on a coordinate plane?',
    option_a: '5', option_b: '7', option_c: '25', option_d: '4',
    correct_answer: 'A',
    explanation: 'Use the distance formula: d = √[(4 - 1)² + (6 - 2)²] = √[3² + 4²] = √[9 + 16] = √25 = 5.',
    distractor_diagnostics: {
      B: { error: 'The student added the differences 3 + 4.', remediation: 'Square the differences first: 3² + 4² = 25, then take the square root (d = 5).' },
      C: { error: 'The student forgot to take the square root of 25.', remediation: 'd² = 25, so d = √25 = 5.' },
      D: { error: 'The student picked the largest difference.', remediation: 'Apply the distance formula d = √[(Δx)² + (Δy)²] = 5.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Volume of Cylinders, Cones & Spheres', subtopic_id: 302,
    question_text: 'A cone has a radius of 3 cm and a height of 10 cm. Using π ≈ 3.14, what is the volume of the cone to the nearest whole number?',
    option_a: '94 cm³', option_b: '283 cm³,', option_c: '314 cm³', option_d: '188 cm³',
    correct_answer: 'A',
    explanation: 'V = (1/3)πr²h = (1/3) × 3.14 × 3² × 10 = (1/3) × 3.14 × 9 × 10 = 3 × 3.14 × 10 = 94.2 ≈ 94 cm³.',
    distractor_diagnostics: {
      B: { error: 'The student forgot to divide by 3 (calculated cylinder volume: 282.6 ≈ 283).', remediation: 'Remember the volume of a cone is 1/3 of a cylinder with the same base and height.' },
      C: { error: 'The student calculated π × 10².', remediation: 'The formula is (1/3)πr²h with r = 3 and h = 10, giving approximately 94 cm³.' },
      D: { error: 'The student multiplied by 2/3 instead of 1/3.', remediation: 'Use V = (1/3)πr²h: 94.2 cm³.' }
    }
  },
  {
    grade: 8, difficulty: 'Medium', subtopic_name: 'Volume of Cylinders, Cones & Spheres', subtopic_id: 302,
    question_text: 'A cylinder and a cone have the exact same radius and height. If the cylinder has a volume of 72 cubic inches, what is the volume of the cone?',
    option_a: '24 cubic inches', option_b: '36 cubic inches', option_c: '144 cubic inches', option_d: '216 cubic inches',
    correct_answer: 'A',
    explanation: 'The volume of a cone is exactly one-third (1/3) the volume of a cylinder with identical radius and height: 72 ÷ 3 = 24 cubic inches.',
    distractor_diagnostics: {
      B: { error: 'The student divided by 2 instead of 3.', remediation: 'A cone has 1/3 the volume of a cylinder with the same dimensions: 72 / 3 = 24.' },
      C: { error: 'The student doubled the cylinder volume.', remediation: 'A cone is smaller than the cylinder: divide by 3.' },
      D: { error: 'The student multiplied 72 by 3.', remediation: 'The cone is 1/3 of the cylinder: 72 × (1/3) = 24 cubic inches.' }
    }
  },

  // High (8)
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Transformations', subtopic_id: 298,
    question_text: 'Point M(2, -3) is reflected over the line y = x and then translated along the vector <-1, 4>. What are the coordinates of the final image?',
    option_a: '(-4, 6)', option_b: '(-3, 2)', option_c: '(1, 1)', option_d: '(6, -4)',
    correct_answer: 'A',
    explanation: 'Reflecting (x, y) over line y = x swaps coordinates: (2, -3) becomes (-3, 2). Then translate by <-1, 4>: (-3 - 1, 2 + 4) = (-4, 6).',
    distractor_diagnostics: {
      B: { error: 'The student stopped after the reflection without applying the translation.', remediation: 'Apply the translation <-1, 4> to (-3, 2): -3 - 1 = -4, 2 + 4 = 6.' },
      C: { error: 'The student applied the translation to the original point without reflecting.', remediation: 'First reflect over y = x to get (-3, 2), then add <-1, 4>.' },
      D: { error: 'The student inverted the coordinates of the final result.', remediation: 'Final image is (-4, 6).' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Similarity & Dilations', subtopic_id: 299,
    question_text: 'Triangle ABC has side lengths 5, 12, and 13. A sequence of a reflection, a rotation, and a dilation produces triangle DEF with side lengths 15, 36, and 39. Which statement is fully accurate?',
    option_a: 'Triangles ABC and DEF are similar with a scale factor of 3', option_b: 'Triangles ABC and DEF are congruent', option_c: 'Triangle DEF has angle measures 3 times larger than triangle ABC', option_d: 'Triangles ABC and DEF are neither congruent nor similar',
    correct_answer: 'A',
    explanation: 'Each side length is scaled by exactly 3 (15/5 = 36/12 = 39/13 = 3). Because dilations preserve angle measures and create proportional sides, the triangles are similar with scale factor 3.',
    distractor_diagnostics: {
      B: { error: 'The student confused similarity with congruence.', remediation: 'Since side lengths changed by a factor of 3, the triangles are similar, not congruent.' },
      C: { error: 'The student thought dilation multiplies angle measures.', remediation: 'Dilation preserves angle measures; only side lengths are multiplied by 3.' },
      D: { error: 'The student failed to see the proportional relationship.', remediation: 'All corresponding sides have the ratio 3 : 1, confirming similarity.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Similarity & Dilations', subtopic_id: 299,
    question_text: 'Point A(4, 8) is dilated with a scale factor of 3 using center of dilation C(1, 2). What are the coordinates of the image A\'?',
    option_a: '(10, 20)', option_b: '(12, 24)', option_c: '(13, 26)', option_d: '(9, 18)',
    correct_answer: 'A',
    explanation: 'Vector CA = (4 - 1, 8 - 2) = (3, 6). Scale by 3: 3 × (3, 6) = (9, 18). Add back to center C: (1 + 9, 2 + 18) = (10, 20).',
    distractor_diagnostics: {
      B: { error: 'The student dilated from origin (0, 0) instead of center C(1, 2).', remediation: 'When center is (a, b), the rule is A\' = (a + k(x - a), b + k(y - b)): 1 + 3(3) = 10, 2 + 3(6) = 20.' },
      C: { error: 'The student added 3 to each coordinate.', remediation: 'Find the distance from center C, multiply that distance by 3, and add to C.' },
      D: { error: 'The student found the displacement vector without adding the center.', remediation: 'Add the scaled vector (9, 18) back to the center C(1, 2) to get (10, 20).' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Angles & Parallel Lines', subtopic_id: 300,
    question_text: 'In triangle PQR, the interior angles are in the ratio 2 : 3 : 5. What is the measure of the smallest exterior angle of triangle PQR?',
    option_a: '90°', option_b: '36°', option_c: '144°', option_d: '126°',
    correct_answer: 'A',
    explanation: 'Sum of ratio parts = 2 + 3 + 5 = 10. Each part = 180° ÷ 10 = 18°. Interior angles are 36°, 54°, and 90°. The smallest exterior angle corresponds to the largest interior angle: 180° - 90° = 90°.',
    distractor_diagnostics: {
      B: { error: 'The student identified the smallest interior angle instead of the smallest exterior angle.', remediation: 'The smallest exterior angle is supplementary to the largest interior angle (90°): 180° - 90° = 90°.' },
      C: { error: 'The student found the largest exterior angle (180° - 36° = 144°).', remediation: 'The question asks for the smallest exterior angle, which is 180° - 90° = 90°.' },
      D: { error: 'The student calculated 180° - 54° = 126°.', remediation: 'The smallest exterior angle is 180° - 90° = 90°.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Angles & Parallel Lines', subtopic_id: 300,
    question_text: 'Two parallel lines l and m are cut by a transversal t. Two alternate exterior angles are given by (5x - 20)° and (3x + 16)°. What is the measure of these angles?',
    option_a: '70°', option_b: '18°', option_c: '110°', option_d: '38°',
    correct_answer: 'A',
    explanation: 'Alternate exterior angles are equal: 5x - 20 = 3x + 16 → 2x = 36 → x = 18. Angle measure = 5(18) - 20 = 90 - 20 = 70°.',
    distractor_diagnostics: {
      B: { error: 'The student found the value of x (18) instead of the angle measure.', remediation: 'Substitute x = 18 back into the angle expression: 5(18) - 20 = 70°.' },
      C: { error: 'The student calculated the supplementary angle (180° - 70° = 110°).', remediation: 'The question asks for the measure of the alternate exterior angles, which is 70°.' },
      D: { error: 'The student subtracted 16 from 54 incorrectly.', remediation: '5(18) - 20 = 70°.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Pythagorean Theorem', subtopic_id: 301,
    question_text: 'A rectangular box has dimensions 3 inches by 4 inches by 12 inches. What is the length of the 3D diagonal connecting two opposite corners of the box?',
    option_a: '13 inches', option_b: '15 inches', option_c: '19 inches', option_d: '169 inches',
    correct_answer: 'A',
    explanation: 'Use the 3D Pythagorean theorem: d = √(l² + w² + h²) = √(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13 inches.',
    distractor_diagnostics: {
      B: { error: 'The student made an arithmetic error.', remediation: '3² + 4² + 12² = 9 + 16 + 144 = 169. √169 = 13.' },
      C: { error: 'The student added 3 + 4 + 12 directly.', remediation: 'Use d = √(l² + w² + h²), not the sum of edge lengths.' },
      D: { error: 'The student forgot to take the square root of 169.', remediation: 'd² = 169, so d = √169 = 13 inches.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Volume of Cylinders, Cones & Spheres', subtopic_id: 302,
    question_text: 'A sphere has a radius of 6 cm. What is its volume in terms of π?',
    option_a: '288π cm³', option_b: '144π cm³', option_c: '864π cm³', option_d: '576π cm³',
    correct_answer: 'A',
    explanation: 'V = (4/3)πr³ = (4/3)π(6)³ = (4/3)π(216) = 4 × 72π = 288π cm³.',
    distractor_diagnostics: {
      B: { error: 'The student calculated the surface area 4πr² = 4π(36) = 144π.', remediation: 'Volume formula uses r cubed: V = (4/3)πr³ = 288π cm³.' },
      C: { error: 'The student multiplied 4 × 216 without dividing by 3.', remediation: 'Remember to multiply by 4/3: (4/3) × 216 = 288.' },
      D: { error: 'The student multiplied 288 by 2.', remediation: '(4/3) × 216 = 288π cm³.' }
    }
  },
  {
    grade: 8, difficulty: 'High', subtopic_name: 'Volume of Cylinders, Cones & Spheres', subtopic_id: 302,
    question_text: 'A solid metal sphere with radius 3 cm is melted down and recast into a solid cone with base radius 3 cm. What is the height of the cone?',
    option_a: '12 cm', option_b: '4 cm', option_c: '9 cm', option_d: '6 cm',
    correct_answer: 'A',
    explanation: 'Volume of sphere = (4/3)π(3)³ = 36π. Volume of cone = (1/3)π(3)²h = 3πh. Setting them equal: 3πh = 36π → h = 12 cm.',
    distractor_diagnostics: {
      B: { error: 'The student divided 36 by 9.', remediation: 'Cone volume is (1/3)πr²h = 3πh. Setting 3πh = 36π gives h = 12 cm.' },
      C: { error: 'The student guessed 9 cm.', remediation: 'Sphere volume is 36π. Cone volume is 3πh. 36 / 3 = 12 cm.' },
      D: { error: 'The student equated diameter to height.', remediation: 'Calculate volumes and solve 3πh = 36π to find h = 12 cm.' }
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

  const allQuestions = [...g7Questions, ...g8Questions];
  console.log(`Starting insertion of ${allQuestions.length} questions for Grade 7 & Grade 8 Geometry...`);

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

  console.log(`Grade 7 & 8 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await pool.end();
}

seed().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
