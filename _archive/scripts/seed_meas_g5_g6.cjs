const mysql = require('mysql2/promise');
require('dotenv').config();

const g5Questions = [
  // Low (8)
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'How many centimeters are equal to 4 meters?',
    option_a: '400 cm', option_b: '40 cm', option_c: '4,000 cm', option_d: '0.04 cm',
    correct_answer: 'A',
    explanation: 'There are 100 centimeters in 1 meter. Therefore, 4 meters = 4 × 100 = 400 centimeters.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied by 10 instead of 100.', remediation: 'Recall that 1 meter = 100 centimeters (centi- means one hundredth).' },
      C: { error: 'Student multiplied by 1,000 (confused centi- with milli-).', remediation: '1 meter = 100 centimeters, whereas 1 meter = 1,000 millimeters.' },
      D: { error: 'Student divided by 100 instead of multiplying.', remediation: 'Converting from a larger unit (meters) to a smaller unit (centimeters) requires multiplication.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A pitcher holds 3,000 milliliters of juice. How many liters is this?',
    option_a: '3 L', option_b: '30 L', option_c: '300 L', option_d: '0.3 L',
    correct_answer: 'A',
    explanation: '1 liter = 1,000 milliliters. Dividing 3,000 mL by 1,000 gives 3 L.',
    distractor_diagnostics: {
      B: { error: 'Student divided by 100 instead of 1,000.', remediation: 'Recall that milli- means 1/1,000, so 1 liter = 1,000 milliliters.' },
      C: { error: 'Student divided by 10.', remediation: 'There are 1,000 milliliters in a liter, so divide 3,000 by 1,000 = 3 L.' },
      D: { error: 'Student divided by 10,000.', remediation: '3,000 ÷ 1,000 = 3 L.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'How many ounces are in 5 pounds? (1 pound = 16 ounces)',
    option_a: '80 oz', option_b: '50 oz', option_c: '85 oz', option_d: '32 oz',
    correct_answer: 'A',
    explanation: '5 pounds × 16 ounces per pound = 80 ounces.',
    distractor_diagnostics: {
      B: { error: 'Student assumed 1 pound = 10 ounces.', remediation: 'In customary units, 1 pound = 16 ounces. 5 × 16 = 80 oz.' },
      C: { error: 'Student made a multiplication error.', remediation: 'Multiply 5 × 16: 5 × 10 = 50, 5 × 6 = 30; 50 + 30 = 80 oz.' },
      D: { error: 'Student doubled 16 instead of multiplying by 5.', remediation: 'Multiply by 5 pounds: 5 × 16 = 80 oz.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Unit Cubes', subtopic_id: 249,
    question_text: 'A solid rectangular prism is packed completely with 1-centimeter unit cubes with no gaps or overlaps. If it takes 24 cubes to fill it, what is its volume?',
    option_a: '24 cubic centimeters', option_b: '24 square centimeters', option_c: '48 cubic centimeters', option_d: '12 cubic centimeters',
    correct_answer: 'A',
    explanation: 'Volume is the number of unit cubes needed to fill a 3D space. 24 unit cubes of 1 cm each give a volume of 24 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student used units of area (square centimeters) instead of volume.', remediation: 'Volume measures 3D space and uses cubic units (cm³).' },
      C: { error: 'Student doubled the count of unit cubes.', remediation: 'The volume simply equals the total count of unit cubes: 24 cm³.' },
      D: { error: 'Student halved the number of unit cubes.', remediation: 'Each unit cube contributes 1 cubic centimeter; 24 cubes = 24 cm³.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Volume Concepts', subtopic_id: 248,
    question_text: 'What kind of units are used to measure the volume of a solid object?',
    option_a: 'Cubic units', option_b: 'Square units', option_c: 'Linear units', option_d: 'Degree units',
    correct_answer: 'A',
    explanation: 'Volume measures the amount of three-dimensional space occupied by an object, which is measured in cubic units.',
    distractor_diagnostics: {
      B: { error: 'Square units measure 2D surface area, not 3D volume.', remediation: 'Volume measures 3D capacity using cubic units (e.g., cubic inches, cm³).' },
      C: { error: 'Linear units measure 1D length or perimeter.', remediation: 'Length is 1D, area is 2D (square units), and volume is 3D (cubic units).' },
      D: { error: 'Degrees measure angles or temperature.', remediation: 'Volume is measured in cubic units.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 250,
    question_text: 'A rectangular box has a length of 5 cm, width of 2 cm, and height of 3 cm. What is its volume?',
    option_a: '30 cubic cm', option_b: '10 cubic cm', option_c: '20 cubic cm', option_d: '60 cubic cm',
    correct_answer: 'A',
    explanation: 'Volume of a rectangular prism = length × width × height = 5 × 2 × 3 = 30 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student only added the dimensions (5 + 2 + 3 = 10).', remediation: 'Volume is calculated by multiplying dimensions: V = l × w × h.' },
      C: { error: 'Student multiplied only two dimensions or calculated perimeter.', remediation: 'Multiply all three dimensions: 5 × 2 = 10; 10 × 3 = 30 cm³.' },
      D: { error: 'Student doubled the volume.', remediation: 'The formula is V = l × w × h = 30 cm³.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 250,
    question_text: 'A rectangular box has a base area of 20 square inches and a height of 4 inches. What is its volume?',
    option_a: '80 cubic inches', option_b: '24 cubic inches', option_c: '40 cubic inches', option_d: '160 cubic inches',
    correct_answer: 'A',
    explanation: 'Volume = Base Area × Height = 20 × 4 = 80 cubic inches.',
    distractor_diagnostics: {
      B: { error: 'Student added base area and height (20 + 4).', remediation: 'Volume is Base Area multiplied by height: V = B × h.' },
      C: { error: 'Student multiplied base area by 2 instead of 4.', remediation: 'Multiply 20 by the full height 4: 20 × 4 = 80 cubic inches.' },
      D: { error: 'Student doubled the correct product.', remediation: 'Volume = 20 × 4 = 80 cubic inches.' }
    }
  },
  {
    grade: 5, difficulty: 'Low', subtopic_name: 'Line Plots & Fraction Measurements', subtopic_id: 247,
    question_text: 'Four pencils have lengths of 1/2 inch, 1/2 inch, 3/4 inch, and 1/4 inch. What is the total length of the two 1/2-inch pencils combined?',
    option_a: '1 inch', option_b: '1/2 inch', option_c: '2/4 inch', option_d: '1 1/2 inches',
    correct_answer: 'A',
    explanation: '1/2 + 1/2 = 2/2 = 1 whole inch.',
    distractor_diagnostics: {
      B: { error: 'Student took the length of only one pencil.', remediation: 'Add both pencils together: 1/2 + 1/2 = 1.' },
      C: { error: 'Student added denominators (1/2 + 1/2 = 2/4).', remediation: 'When adding fractions with like denominators, add only the numerators: 1/2 + 1/2 = 2/2 = 1.' },
      D: { error: 'Student included an extra half.', remediation: '1/2 + 1/2 = 1 inch.' }
    }
  },

  // Medium (9)
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A runner completes a 3.5-kilometer race. How many meters did the runner complete?',
    option_a: '3,500 meters', option_b: '350 meters', option_c: '35,000 meters', option_d: '0.0035 meters',
    correct_answer: 'A',
    explanation: '1 kilometer = 1,000 meters. 3.5 × 1,000 = 3,500 meters.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied by 100 instead of 1,000.', remediation: 'Kilo- means 1,000; multiply 3.5 by 1,000 by shifting decimal 3 places right: 3,500 m.' },
      C: { error: 'Student multiplied by 10,000.', remediation: '1 km = 1,000 m: 3.5 × 1,000 = 3,500 m.' },
      D: { error: 'Student divided instead of multiplying.', remediation: 'Converting from a larger unit (km) to a smaller unit (m) requires multiplying.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A board is 8 feet and 6 inches long. What is the total length in inches?',
    option_a: '102 inches', option_b: '96 inches', option_c: '86 inches', option_d: '108 inches',
    correct_answer: 'A',
    explanation: '1 foot = 12 inches. 8 feet = 8 × 12 = 96 inches. Adding the remaining 6 inches gives 96 + 6 = 102 inches.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to add the extra 6 inches.', remediation: '8 feet = 96 inches. Add the 6 inches: 96 + 6 = 102 inches.' },
      C: { error: 'Student simply joined the numbers 8 and 6.', remediation: 'Convert feet to inches first: 8 × 12 = 96, then add 6 = 102.' },
      D: { error: 'Student calculated 9 × 12.', remediation: '8 × 12 = 96; 96 + 6 = 102.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A recipe calls for 2.4 kilograms of flour. How many grams of flour is this?',
    option_a: '2,400 grams', option_b: '240 grams', option_c: '24,000 grams', option_d: '0.0024 grams',
    correct_answer: 'A',
    explanation: '1 kilogram = 1,000 grams. 2.4 × 1,000 = 2,400 grams.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied by 100 instead of 1,000.', remediation: '1 kg = 1,000 g: shift the decimal point 3 places to the right: 2,400 g.' },
      C: { error: 'Student shifted decimal point 4 places instead of 3.', remediation: '2.4 × 1,000 = 2,400 grams.' },
      D: { error: 'Student divided by 1,000 instead of multiplying.', remediation: 'Kilograms to grams is large to small: multiply by 1,000.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Volume Concepts', subtopic_id: 248,
    question_text: 'A prism is built using 3 layers of unit cubes. Each layer has 4 rows with 5 cubes in each row. What is the volume of the prism?',
    option_a: '60 unit cubes', option_b: '20 unit cubes', option_c: '35 unit cubes', option_d: '23 unit cubes',
    correct_answer: 'A',
    explanation: 'Each layer has 4 × 5 = 20 cubes. With 3 layers, the total volume is 20 × 3 = 60 unit cubes.',
    distractor_diagnostics: {
      B: { error: 'Student only found the number of cubes in one layer.', remediation: 'Multiply the cubes per layer by the number of layers: 20 × 3 = 60.' },
      C: { error: 'Student computed (4 + 5) × 3 or made a calculation error.', remediation: 'Find layer area (4 × 5 = 20) and multiply by height (3): 20 × 3 = 60.' },
      D: { error: 'Student added all dimensions: 4 + 5 + 3 = 12 or 20 + 3 = 23.', remediation: 'Multiply dimensions: 4 × 5 × 3 = 60.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 250,
    question_text: 'A storage container has a length of 12 inches, a width of 8 inches, and a height of 5 inches. What is its volume?',
    option_a: '480 cubic inches', option_b: '240 cubic inches', option_c: '960 cubic inches', option_d: '25 cubic inches',
    correct_answer: 'A',
    explanation: 'V = l × w × h = 12 × 8 × 5 = 96 × 5 = 480 cubic inches.',
    distractor_diagnostics: {
      B: { error: 'Student halved the correct volume or made a calculation error.', remediation: '12 × 8 = 96; 96 × 5 = 480 cubic inches.' },
      C: { error: 'Student doubled the volume.', remediation: 'V = 12 × 8 × 5 = 480 cubic inches.' },
      D: { error: 'Student added the dimensions: 12 + 8 + 5 = 25.', remediation: 'Volume requires multiplication of dimensions, not addition.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 250,
    question_text: 'A rectangular aquarium has a volume of 720 cubic inches. If the base area is 60 square inches, what is its height?',
    option_a: '12 inches', option_b: '10 inches', option_c: '660 inches', option_d: '15 inches',
    correct_answer: 'A',
    explanation: 'Height = Volume ÷ Base Area = 720 ÷ 60 = 12 inches.',
    distractor_diagnostics: {
      B: { error: 'Student miscalculated 720 ÷ 60 as 10 (or 600 ÷ 60).', remediation: 'Divide 720 by 60: 72 ÷ 6 = 12 inches.' },
      C: { error: 'Student subtracted base area from volume (720 - 60).', remediation: 'Since V = B × h, height is found by division: h = V ÷ B.' },
      D: { error: 'Student miscalculated division.', remediation: '720 ÷ 60 = 12.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Composite Volume', subtopic_id: 251,
    question_text: 'An L-shaped solid is composed of two rectangular prisms. Prism A has dimensions 4 cm × 3 cm × 2 cm. Prism B has dimensions 2 cm × 3 cm × 5 cm. What is the total volume?',
    option_a: '54 cubic cm', option_b: '24 cubic cm', option_c: '30 cubic cm', option_d: '60 cubic cm',
    correct_answer: 'A',
    explanation: 'Volume of Prism A = 4 × 3 × 2 = 24 cm³. Volume of Prism B = 2 × 3 × 5 = 30 cm³. Total volume = 24 + 30 = 54 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the volume of Prism A.', remediation: 'Add the volumes of both prisms: Volume A (24) + Volume B (30) = 54 cm³.' },
      C: { error: 'Student calculated only the volume of Prism B.', remediation: 'Add the volumes of both prisms: 24 + 30 = 54 cm³.' },
      D: { error: 'Student added dimensions incorrectly.', remediation: 'Prism A = 24 cm³, Prism B = 30 cm³; 24 + 30 = 54 cm³.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Line Plots & Fraction Measurements', subtopic_id: 247,
    question_text: 'A scientist measured liquid amounts in 4 test tubes: 1/4 cup, 1/4 cup, 3/8 cup, and 3/8 cup. What is the total amount of liquid in all 4 tubes?',
    option_a: '1 1/4 cups', option_b: '1 cup', option_c: '8/8 cup', option_d: '1 1/2 cups',
    correct_answer: 'A',
    explanation: 'Convert to common denominator eighths: 1/4 = 2/8. So total = 2/8 + 2/8 + 3/8 + 3/8 = 10/8 = 1 2/8 = 1 1/4 cups.',
    distractor_diagnostics: {
      B: { error: 'Student rounded or truncated 10/8 to 1 whole cup.', remediation: '10/8 = 1 and 2/8, which simplifies to 1 1/4 cups.' },
      C: { error: 'Student computed 2/8 + 6/8 = 8/8 = 1 cup.', remediation: 'Add all four: 2/8 + 2/8 + 3/8 + 3/8 = 10/8 = 1 1/4 cups.' },
      D: { error: 'Student miscalculated 10/8 as 1 1/2 (12/8).', remediation: '10/8 = 1 2/8 = 1 1/4.' }
    }
  },
  {
    grade: 5, difficulty: 'Medium', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A water bottle contains 750 mL of water. How many such bottles are needed to fill a 6-liter dispenser?',
    option_a: '8 bottles', option_b: '6 bottles', option_c: '10 bottles', option_d: '4 bottles',
    correct_answer: 'A',
    explanation: '6 liters = 6,000 milliliters. 6,000 ÷ 750 = 8 bottles.',
    distractor_diagnostics: {
      B: { error: 'Student assumed 1 bottle per liter.', remediation: 'Each bottle has 750 mL (0.75 L). 6 ÷ 0.75 = 8 bottles.' },
      C: { error: 'Student divided by 600 or guessed 10.', remediation: '6,000 mL ÷ 750 mL = 8.' },
      D: { error: 'Student calculated 3,000 ÷ 750 (for 3 liters).', remediation: 'The dispenser is 6 L (6,000 mL). 6,000 ÷ 750 = 8.' }
    }
  },

  // High (8)
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A rectangular garden path is 15 meters long and 80 centimeters wide. What is the area of the path in square meters?',
    option_a: '12 square meters', option_b: '1,200 square meters', option_c: '120 square meters', option_d: '1.2 square meters',
    correct_answer: 'A',
    explanation: 'First convert 80 cm to meters: 80 cm = 0.8 m. Area = 15 m × 0.8 m = 12 square meters.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 15 × 80 without converting centimeters to meters.', remediation: 'Always convert dimensions to the same unit before multiplying: 80 cm = 0.8 m; 15 × 0.8 = 12 m².' },
      C: { error: 'Student converted 80 cm to 8 m.', remediation: '80 cm = 0.8 m (since 100 cm = 1 m). 15 × 0.8 = 12 m².' },
      D: { error: 'Student misplaced the decimal point.', remediation: '15 × 0.8 = 12.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A package weighs 3 pounds and 12 ounces. If shipping costs $0.50 per ounce, what is the shipping cost?',
    option_a: '$30.00', option_b: '$24.00', option_c: '$18.00', option_d: '$36.00',
    correct_answer: 'A',
    explanation: 'Convert 3 pounds to ounces: 3 × 16 = 48 ounces. Total weight = 48 + 12 = 60 ounces. Cost = 60 × $0.50 = $30.00.',
    distractor_diagnostics: {
      B: { error: 'Student only calculated cost for the 3 pounds (48 × $0.50 = $24.00).', remediation: 'Include the 12 ounces: 48 + 12 = 60 oz; 60 × $0.50 = $30.00.' },
      C: { error: 'Student assumed 1 pound = 12 ounces (48 oz total).', remediation: '1 pound = 16 ounces. 3 lb = 48 oz, plus 12 oz = 60 oz.' },
      D: { error: 'Student calculated 3 × 12 = 36 or made an arithmetic error.', remediation: '3 × 16 = 48; 48 + 12 = 60; 60 × 0.5 = $30.00.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 250,
    question_text: 'A rectangular shipping container has a volume of 480 cubic feet. Its length is 10 feet and its height is 6 feet. What is its width?',
    option_a: '8 feet', option_b: '6 feet', option_c: '48 feet', option_d: '12 feet',
    correct_answer: 'A',
    explanation: 'V = l × w × h. 480 = 10 × w × 6 = 60w. Dividing both sides by 60 gives w = 480 ÷ 60 = 8 feet.',
    distractor_diagnostics: {
      B: { error: 'Student guessed the width equals height.', remediation: 'Divide volume by (length × height): 480 ÷ (10 × 6) = 480 ÷ 60 = 8 ft.' },
      C: { error: 'Student divided 480 by 10 but forgot to divide by 6.', remediation: 'Divide by both known dimensions: 480 ÷ 60 = 8 feet.' },
      D: { error: 'Student divided 480 by 40 instead of 60.', remediation: '10 × 6 = 60. 480 ÷ 60 = 8 feet.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 250,
    question_text: 'If each edge of a cube is doubled from 3 cm to 6 cm, how does the volume change?',
    option_a: 'The volume increases by 8 times (multiplied by 8)', option_b: 'The volume doubles (multiplied by 2)', option_c: 'The volume quadruples (multiplied by 4)', option_d: 'The volume increases by 6 times',
    correct_answer: 'A',
    explanation: 'Original volume = 3³ = 27 cm³. New volume = 6³ = 216 cm³. 216 ÷ 27 = 8 times larger (since 2³ = 8).',
    distractor_diagnostics: {
      B: { error: 'Student thought volume scales linearly with edge length.', remediation: 'Volume scales with the cube of the scale factor: 2³ = 8 times.' },
      C: { error: 'Student thought volume scales like area (2² = 4).', remediation: 'Area scales by factor², but volume scales by factor³: 2³ = 8.' },
      D: { error: 'Student multiplied 2 by 3.', remediation: 'When dimensions double, volume is multiplied by 2 × 2 × 2 = 8.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Composite Volume', subtopic_id: 251,
    question_text: 'A concrete step is formed by two rectangular prisms stacked together. The bottom prism is 10 in wide, 30 in long, and 6 in high. The top prism is 10 in wide, 15 in long, and 6 in high. What is the total volume of concrete needed?',
    option_a: '2,700 cubic inches', option_b: '1,800 cubic inches', option_c: '900 cubic inches', option_d: '3,600 cubic inches',
    correct_answer: 'A',
    explanation: 'Bottom prism: 10 × 30 × 6 = 1,800 in³. Top prism: 10 × 15 × 6 = 900 in³. Total volume = 1,800 + 900 = 2,700 cubic inches.',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the volume of the bottom step.', remediation: 'Add both steps: Bottom (1,800) + Top (900) = 2,700 in³.' },
      C: { error: 'Student calculated only the volume of the top step.', remediation: 'Both steps require concrete: 1,800 + 900 = 2,700 in³.' },
      D: { error: 'Student doubled the bottom step volume.', remediation: 'The top step has length 15 in (half of 30 in), so total is 1,800 + 900 = 2,700 in³.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Composite Volume', subtopic_id: 251,
    question_text: 'A hollow rectangular wooden box has outer dimensions 10 cm × 8 cm × 6 cm. If a solid block of dimensions 6 cm × 4 cm × 3 cm is removed from its center, what is the remaining volume of wood?',
    option_a: '408 cubic cm', option_b: '480 cubic cm', option_c: '72 cubic cm', option_d: '360 cubic cm',
    correct_answer: 'A',
    explanation: 'Outer volume = 10 × 8 × 6 = 480 cm³. Inner removed volume = 6 × 4 × 3 = 72 cm³. Remaining volume = 480 - 72 = 408 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student found only the outer volume and did not subtract the removed part.', remediation: 'Subtract the hollow interior: 480 - 72 = 408 cm³.' },
      C: { error: 'Student found only the inner removed volume.', remediation: 'The question asks for the remaining volume of wood: Outer - Inner = 480 - 72 = 408 cm³.' },
      D: { error: 'Student miscalculated the subtraction.', remediation: '480 - 72 = 408 cm³.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Line Plots & Fraction Measurements', subtopic_id: 247,
    question_text: 'A student recorded lengths of 8 ribbons on a line plot: two at 1/8 yd, three at 3/8 yd, and three at 5/8 yd. If all 8 ribbons are placed end-to-end, what is the total length?',
    option_a: '3 1/4 yards', option_b: '3 yards', option_c: '2 5/8 yards', option_d: '3 1/2 yards',
    correct_answer: 'A',
    explanation: 'Total = 2(1/8) + 3(3/8) + 3(5/8) = 2/8 + 9/8 + 15/8 = 26/8 = 3 2/8 = 3 1/4 yards.',
    distractor_diagnostics: {
      B: { error: 'Student rounded down or miscalculated 26/8 as 24/8 = 3.', remediation: '26/8 = 3 with remainder 2/8 = 3 1/4 yards.' },
      C: { error: 'Student missed one of the data points.', remediation: 'Sum: 2/8 + 9/8 + 15/8 = 26/8 = 3 1/4 yards.' },
      D: { error: 'Student computed 28/8 = 3 1/2.', remediation: '2 + 9 + 15 = 26; 26/8 = 3 1/4 yards.' }
    }
  },
  {
    grade: 5, difficulty: 'High', subtopic_name: 'Measurement Unit Conversion', subtopic_id: 246,
    question_text: 'A water tank has dimensions 2 meters by 1.5 meters by 1 meter. How many liters of water can it hold when completely full? (1 cubic meter = 1,000 liters)',
    option_a: '3,000 liters', option_b: '300 liters', option_c: '30,000 liters', option_d: '3.0 liters',
    correct_answer: 'A',
    explanation: 'Volume in m³ = 2 × 1.5 × 1 = 3 m³. Since 1 m³ = 1,000 L, capacity = 3 × 1,000 = 3,000 liters.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 3 by 100 instead of 1,000.', remediation: '1 cubic meter = 1,000 liters. 3 × 1,000 = 3,000 L.' },
      C: { error: 'Student multiplied by 10,000.', remediation: '3 m³ × 1,000 L/m³ = 3,000 L.' },
      D: { error: 'Student gave the volume in cubic meters without converting to liters.', remediation: 'The question asks for liters: 3 m³ = 3,000 L.' }
    }
  }
];

const g6Questions = [
  // Low (8)
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Triangles', subtopic_id: 252,
    question_text: 'What is the area of a right triangle with a base of 8 cm and a height of 6 cm?',
    option_a: '24 square cm', option_b: '48 square cm', option_c: '14 square cm', option_d: '28 square cm',
    correct_answer: 'A',
    explanation: 'Area of a triangle = 1/2 × base × height = 1/2 × 8 × 6 = 24 cm².',
    distractor_diagnostics: {
      B: { error: 'Student forgot to multiply by 1/2 (used formula for rectangle).', remediation: 'The area of a triangle is half that of a rectangle: A = 1/2 × b × h.' },
      C: { error: 'Student added base and height: 8 + 6 = 14.', remediation: 'Area requires multiplying base and height, then dividing by 2.' },
      D: { error: 'Student calculated perimeter or made an arithmetic error.', remediation: '1/2 × 8 × 6 = 4 × 6 = 24 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Triangles', subtopic_id: 252,
    question_text: 'A triangle has a base of 10 inches and an area of 35 square inches. What is its height?',
    option_a: '7 inches', option_b: '3.5 inches', option_c: '14 inches', option_d: '70 inches',
    correct_answer: 'A',
    explanation: 'Area = 1/2 × b × h. 35 = 1/2 × 10 × h = 5h. Height = 35 ÷ 5 = 7 inches.',
    distractor_diagnostics: {
      B: { error: 'Student divided area by base directly without accounting for 1/2 (35 ÷ 10 = 3.5).', remediation: 'Since A = 1/2 × b × h, 2A = b × h: h = (2 × 35) ÷ 10 = 70 ÷ 10 = 7 inches.' },
      C: { error: 'Student doubled the height: 7 × 2 = 14.', remediation: 'h = (2 × A) ÷ b = 70 ÷ 10 = 7 inches.' },
      D: { error: 'Student calculated 2A but did not divide by base.', remediation: 'Divide 2A by base: 70 ÷ 10 = 7 inches.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Polygons', subtopic_id: 253,
    question_text: 'What is the area of a parallelogram with a base of 9 cm and a height of 5 cm?',
    option_a: '45 square cm', option_b: '22.5 square cm', option_c: '28 square cm', option_d: '90 square cm',
    correct_answer: 'A',
    explanation: 'Area of a parallelogram = base × height = 9 × 5 = 45 cm².',
    distractor_diagnostics: {
      B: { error: 'Student applied triangle formula (divided by 2).', remediation: 'A parallelogram formula is A = base × height, without dividing by 2.' },
      C: { error: 'Student added base and height or calculated perimeter.', remediation: 'Multiply base by perpendicular height: 9 × 5 = 45 cm².' },
      D: { error: 'Student doubled the area.', remediation: 'A = b × h = 45 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Area of Polygons', subtopic_id: 253,
    question_text: 'A trapezoid has parallel bases of lengths 6 cm and 10 cm, and a height of 4 cm. What is its area?',
    option_a: '32 square cm', option_b: '64 square cm', option_c: '24 square cm', option_d: '40 square cm',
    correct_answer: 'A',
    explanation: 'Area of a trapezoid = 1/2 × (b1 + b2) × h = 1/2 × (6 + 10) × 4 = 1/2 × 16 × 4 = 32 cm².',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 2: (6 + 10) × 4 = 64.', remediation: 'Remember the trapezoid formula divides by 2: A = 1/2 × (b1 + b2) × h = 32 cm².' },
      C: { error: 'Student used only the first base: 6 × 4 = 24.', remediation: 'Add both bases together first: (6 + 10) = 16.' },
      D: { error: 'Student used only the second base: 10 × 4 = 40.', remediation: 'Average the two bases: (6 + 10)/2 = 8, then multiply by height 4 = 32 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Surface Area', subtopic_id: 254,
    question_text: 'A cube has an edge length of 3 inches. What is the total surface area of the cube?',
    option_a: '54 square inches', option_b: '27 square inches', option_c: '36 square inches', option_d: '18 square inches',
    correct_answer: 'A',
    explanation: 'A cube has 6 identical faces. Each face has area 3 × 3 = 9 sq in. Total surface area = 6 × 9 = 54 sq in.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the volume (3³ = 27) instead of surface area.', remediation: 'Surface area is the total area of all 6 faces: 6 × (side²) = 6 × 9 = 54 sq in.' },
      C: { error: 'Student multiplied side length by 6 faces or calculated 4 faces (lateral area).', remediation: 'Total surface area includes all 6 faces: 6 × 9 = 54 sq in.' },
      D: { error: 'Student multiplied 6 faces by 3 inches.', remediation: 'Each face area is 3 × 3 = 9 sq in, then multiply by 6: 54 sq in.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 255,
    question_text: 'What is the volume of a rectangular prism with length 1/2 ft, width 1/3 ft, and height 1/4 ft?',
    option_a: '1/24 cubic ft', option_b: '3/9 cubic ft', option_c: '1/12 cubic ft', option_d: '1/9 cubic ft',
    correct_answer: 'A',
    explanation: 'Volume = length × width × height = (1/2) × (1/3) × (1/4) = 1/(2 × 3 × 4) = 1/24 cubic ft.',
    distractor_diagnostics: {
      B: { error: 'Student added fractions incorrectly.', remediation: 'Multiply all three fractions: numerator 1 × 1 × 1 = 1; denominator 2 × 3 × 4 = 24.' },
      C: { error: 'Student multiplied only two dimensions: 1/3 × 1/4 = 1/12.', remediation: 'Multiply all three dimensions: (1/2) × (1/12) = 1/24.' },
      D: { error: 'Student added denominators: 2 + 3 + 4 = 9.', remediation: 'Multiply denominators together: 2 × 3 × 4 = 24.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Coordinate Plane & Area', subtopic_id: 257,
    question_text: 'A rectangle on the coordinate plane has vertices at (1, 1), (5, 1), (5, 4), and (1, 4). What is its area?',
    option_a: '12 square units', option_b: '14 square units', option_c: '16 square units', option_d: '20 square units',
    correct_answer: 'A',
    explanation: 'Base length = 5 - 1 = 4 units. Height = 4 - 1 = 3 units. Area = base × height = 4 × 3 = 12 square units.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the perimeter: 2(4 + 3) = 14.', remediation: 'Area is length × width = 4 × 3 = 12 square units.' },
      C: { error: 'Student squared the base: 4² = 16.', remediation: 'Multiply width (4) by height (3): 4 × 3 = 12.' },
      D: { error: 'Student multiplied coordinates 5 × 4 = 20.', remediation: 'Subtract vertex coordinates to find side lengths first: length is 5 - 1 = 4, height is 4 - 1 = 3.' }
    }
  },
  {
    grade: 6, difficulty: 'Low', subtopic_name: 'Surface Area', subtopic_id: 254,
    question_text: 'Which 2D representation can be folded to form a 3-dimensional solid?',
    option_a: 'A net', option_b: 'A cross-section', option_c: 'A perimeter', option_d: 'A line plot',
    correct_answer: 'A',
    explanation: 'A net is an unfolded, flat 2D pattern that can be folded along edges to form a 3D solid.',
    distractor_diagnostics: {
      B: { error: 'A cross-section is a 2D slice through a 3D solid.', remediation: 'A net unfolds a 3D solid into a 2D shape that can fold back up.' },
      C: { error: 'Perimeter is the 1D distance around a shape.', remediation: 'A net is the 2D pattern used to find surface area and build solids.' },
      D: { error: 'A line plot displays statistical frequency.', remediation: 'A net is the geometric term for an unfolded 3D shape.' }
    }
  },

  // Medium (9)
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Area of Triangles', subtopic_id: 252,
    question_text: 'An obtuse triangle has a base of 12 cm and a corresponding height (drawn outside the triangle) of 7 cm. What is its area?',
    option_a: '42 square cm', option_b: '84 square cm', option_c: '19 square cm', option_d: '38 square cm',
    correct_answer: 'A',
    explanation: 'The area formula A = 1/2 × b × h holds regardless of whether the triangle is acute, right, or obtuse: A = 1/2 × 12 × 7 = 42 cm².',
    distractor_diagnostics: {
      B: { error: 'Student forgot to multiply by 1/2: 12 × 7 = 84.', remediation: 'Always multiply base by height and divide by 2 for any triangle: 84 ÷ 2 = 42 cm².' },
      C: { error: 'Student added base and height: 12 + 7 = 19.', remediation: 'Area is half the product of base and height: 1/2 × 12 × 7 = 42 cm².' },
      D: { error: 'Student made an arithmetic error in division.', remediation: '12 × 7 = 84; 84 ÷ 2 = 42 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Area of Polygons', subtopic_id: 253,
    question_text: 'A rhombus has diagonals of length 14 cm and 8 cm. What is the area of the rhombus?',
    option_a: '56 square cm', option_b: '112 square cm', option_c: '22 square cm', option_d: '44 square cm',
    correct_answer: 'A',
    explanation: 'The area of a rhombus = 1/2 × d1 × d2 = 1/2 × 14 × 8 = 56 cm².',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 2 (calculated d1 × d2).', remediation: 'The diagonals decompose the rhombus into 4 congruent right triangles; total area is (d1 × d2) / 2 = 56 cm².' },
      C: { error: 'Student added the diagonals: 14 + 8 = 22.', remediation: 'Use the formula Area = 1/2 × d1 × d2.' },
      D: { error: 'Student subtracted or miscalculated: 56 is correct.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Surface Area', subtopic_id: 254,
    question_text: 'A rectangular prism has length 5 cm, width 4 cm, and height 2 cm. What is its total surface area?',
    option_a: '76 square cm', option_b: '40 square cm', option_c: '38 square cm', option_d: '88 square cm',
    correct_answer: 'A',
    explanation: 'Surface Area = 2(lw + lh + wh) = 2(5×4 + 5×2 + 4×2) = 2(20 + 10 + 8) = 2(38) = 76 cm².',
    distractor_diagnostics: {
      B: { error: 'Student calculated the volume (5 × 4 × 2 = 40 cm³) instead of surface area.', remediation: 'Surface area is the sum of the areas of all 6 faces: 2(lw + lh + wh) = 76 cm².' },
      C: { error: 'Student forgot to multiply by 2 (summed only 3 faces: 20 + 10 + 8 = 38).', remediation: 'A rectangular prism has 6 faces (3 pairs of equal faces), so multiply the sum of the 3 faces by 2: 38 × 2 = 76 cm².' },
      D: { error: 'Student made an addition or multiplication error.', remediation: '2 × (20 + 10 + 8) = 2 × 38 = 76 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 255,
    question_text: 'A rectangular prism with dimensions 2 1/2 inches by 4 inches by 1 1/2 inches is filled with unit cubes of edge length 1/2 inch. How many 1/2-inch cubes will it take to fill the prism?',
    option_a: '120 cubes', option_b: '15 cubes', option_c: '60 cubes', option_d: '30 cubes',
    correct_answer: 'A',
    explanation: 'Number of cubes along length = 2.5 ÷ 0.5 = 5. Along width = 4 ÷ 0.5 = 8. Along height = 1.5 ÷ 0.5 = 3. Total cubes = 5 × 8 × 3 = 120 cubes.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the volume in cubic inches (2.5 × 4 × 1.5 = 15 cubic inches) instead of the number of 1/2-inch cubes.', remediation: 'Each 1/2-inch cube has a volume of 1/8 cubic inch. 15 ÷ (1/8) = 15 × 8 = 120 cubes.' },
      C: { error: 'Student divided 15 by 1/4 instead of 1/8.', remediation: 'The volume of a 1/2-inch cube is (1/2)³ = 1/8 cubic inch. 15 × 8 = 120 cubes.' },
      D: { error: 'Student calculated 5 × 8 = 40 or made a multiplication error.', remediation: 'Multiply cubes along each dimension: 5 × 8 × 3 = 120 cubes.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Volume of Composite Figures', subtopic_id: 256,
    question_text: 'A building step consists of two rectangular prisms. Box 1 measures 6 ft by 4 ft by 1 ft. Box 2 on top measures 4 ft by 4 ft by 1 ft. What is the total volume?',
    option_a: '40 cubic ft', option_b: '24 cubic ft', option_c: '16 cubic ft', option_d: '48 cubic ft',
    correct_answer: 'A',
    explanation: 'Volume of Box 1 = 6 × 4 × 1 = 24 ft³. Volume of Box 2 = 4 × 4 × 1 = 16 ft³. Total volume = 24 + 16 = 40 cubic ft.',
    distractor_diagnostics: {
      B: { error: 'Student calculated only Box 1.', remediation: 'Add the volumes of both boxes: 24 + 16 = 40 ft³.' },
      C: { error: 'Student calculated only Box 2.', remediation: 'Total volume is Box 1 (24) + Box 2 (16) = 40 ft³.' },
      D: { error: 'Student doubled Box 1.', remediation: 'Box 1 is 24 ft³ and Box 2 is 16 ft³: 24 + 16 = 40 ft³.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Coordinate Plane & Area', subtopic_id: 257,
    question_text: 'A triangle on a coordinate grid has vertices at A(2, 2), B(8, 2), and C(5, 7). What is the area of triangle ABC?',
    option_a: '15 square units', option_b: '30 square units', option_c: '18 square units', option_d: '21 square units',
    correct_answer: 'A',
    explanation: 'Base AB lies along y = 2, so base length = 8 - 2 = 6 units. Height is the vertical distance from y = 2 to vertex C(5, 7), which is 7 - 2 = 5 units. Area = 1/2 × 6 × 5 = 15 square units.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 2 (6 × 5 = 30).', remediation: 'For a triangle, Area = 1/2 × base × height = 1/2 × 6 × 5 = 15 sq units.' },
      C: { error: 'Student miscalculated the base or height.', remediation: 'Base = 8 - 2 = 6; Height = 7 - 2 = 5; Area = 1/2 × 6 × 5 = 15.' },
      D: { error: 'Student added dimensions: 6 + 5 = 11 or made an arithmetic slip.', remediation: 'Area = 1/2 × 6 × 5 = 15 sq units.' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Surface Area', subtopic_id: 254,
    question_text: 'The net of a right triangular prism consists of two congruent right triangular bases (legs 3 cm and 4 cm) and three rectangular faces (widths 3 cm, 4 cm, and 5 cm, all with length 10 cm). What is the total surface area?',
    option_a: '132 square cm', option_b: '120 square cm', option_c: '60 square cm', option_d: '144 square cm',
    correct_answer: 'A',
    explanation: 'Area of 2 triangular bases = 2 × (1/2 × 3 × 4) = 12 cm². Area of 3 rectangular faces = (3 × 10) + (4 × 10) + (5 × 10) = 30 + 40 + 50 = 120 cm². Total surface area = 12 + 120 = 132 cm².',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the lateral area (the 3 rectangles: 120 cm²) and omitted the two triangular bases.', remediation: 'Surface area includes all faces: lateral area (120) + 2 bases (12) = 132 cm².' },
      C: { error: 'Student calculated volume (1/2 × 3 × 4 × 10 = 60 cm³) instead of surface area.', remediation: 'Surface area is the sum of face areas: 12 + 120 = 132 cm².' },
      D: { error: 'Student added bases incorrectly: 120 + 24 = 144.', remediation: 'Area of one triangle is 1/2 × 3 × 4 = 6. Two triangles = 12 cm²; 120 + 12 = 132 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Area of Polygons', subtopic_id: 253,
    question_text: 'A wall is in the shape of a rectangle 8 meters wide and 5 meters high, with a triangular gable on top having base 8 meters and height 3 meters. What is the total area of the wall?',
    option_a: '52 square meters', option_b: '64 square meters', option_c: '40 square meters', option_d: '46 square meters',
    correct_answer: 'A',
    explanation: 'Area of rectangle = 8 × 5 = 40 m². Area of triangular gable = 1/2 × 8 × 3 = 12 m². Total area = 40 + 12 = 52 m².',
    distractor_diagnostics: {
      B: { error: 'Student did not divide the triangle area by 2 (40 + 24 = 64).', remediation: 'The triangular top area is 1/2 × 8 × 3 = 12 m²; total = 40 + 12 = 52 m².' },
      C: { error: 'Student only calculated the rectangular wall area.', remediation: 'Add the triangular gable area: 40 + 12 = 52 m².' },
      D: { error: 'Student miscalculated the triangle area as 6.', remediation: '1/2 × 8 × 3 = 12; 40 + 12 = 52 m².' }
    }
  },
  {
    grade: 6, difficulty: 'Medium', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 255,
    question_text: 'A rectangular cereal box has a volume of 360 cubic inches. If its height is 12 inches and width is 3 inches, what is its length?',
    option_a: '10 inches', option_b: '12 inches', option_c: '30 inches', option_d: '8 inches',
    correct_answer: 'A',
    explanation: 'Volume = l × w × h. 360 = l × 3 × 12 = 36l. Dividing by 36 gives l = 360 ÷ 36 = 10 inches.',
    distractor_diagnostics: {
      B: { error: 'Student guessed 12 inches.', remediation: 'Divide 360 by (3 × 12 = 36): 360 ÷ 36 = 10 inches.' },
      C: { error: 'Student divided 360 by 12 but forgot to divide by 3.', remediation: 'Divide by both dimensions: 360 ÷ 36 = 10 inches.' },
      D: { error: 'Student miscalculated division.', remediation: '360 ÷ 36 = 10 inches.' }
    }
  },

  // High (8)
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Area of Polygons', subtopic_id: 253,
    question_text: 'A regular hexagon can be decomposed into 6 equilateral triangles. If each equilateral triangle has a base of 6 cm and a height of approximately 5.2 cm, what is the total area of the hexagon?',
    option_a: '93.6 square cm', option_b: '46.8 square cm', option_c: '187.2 square cm', option_d: '31.2 square cm',
    correct_answer: 'A',
    explanation: 'Area of 1 triangle = 1/2 × 6 × 5.2 = 15.6 cm². Area of 6 triangles = 6 × 15.6 = 93.6 cm².',
    distractor_diagnostics: {
      B: { error: 'Student calculated the area of only 3 triangles (half the hexagon).', remediation: 'A regular hexagon has 6 equilateral triangles: 6 × 15.6 = 93.6 cm².' },
      C: { error: 'Student forgot to divide each triangle by 2: 6 × (6 × 5.2) = 187.2 cm².', remediation: 'Remember triangle area is 1/2 × base × height: 1/2 × 6 × 5.2 = 15.6; 15.6 × 6 = 93.6 cm².' },
      D: { error: 'Student calculated perimeter or only 2 triangles.', remediation: '6 × (1/2 × 6 × 5.2) = 93.6 cm².' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Surface Area', subtopic_id: 254,
    question_text: 'An open-top wooden rectangular box (no lid) has length 8 inches, width 5 inches, and height 4 inches. What is the total outside surface area to be painted?',
    option_a: '144 square inches', option_b: '184 square inches', option_c: '160 square inches', option_d: '104 square inches',
    correct_answer: 'A',
    explanation: 'Since there is no top lid, Surface Area = bottom + 2(front/back) + 2(sides) = (8×5) + 2(8×4) + 2(5×4) = 40 + 64 + 40 = 144 square inches.',
    distractor_diagnostics: {
      B: { error: 'Student included the top lid (calculated standard 6-sided surface area: 184 sq in).', remediation: 'The box is open-top, so include only 1 bottom face (40) instead of 2: 184 - 40 = 144 sq in.' },
      C: { error: 'Student calculated volume (8 × 5 × 4 = 160 cubic inches) instead of surface area.', remediation: 'Surface area measures the outer surface: 40 + 64 + 40 = 144 sq in.' },
      D: { error: 'Student calculated only the 4 side walls (lateral area: 64 + 40 = 104) and omitted the bottom.', remediation: 'Do not forget the bottom face: 104 + 40 = 144 sq in.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Coordinate Plane & Area', subtopic_id: 257,
    question_text: 'A trapezoid on a coordinate grid has vertices at P(-3, 2), Q(5, 2), R(3, -2), and S(-1, -2). What is the area of trapezoid PQRS?',
    option_a: '24 square units', option_b: '48 square units', option_c: '16 square units', option_d: '32 square units',
    correct_answer: 'A',
    explanation: 'Top base PQ length = 5 - (-3) = 8 units. Bottom base RS length = 3 - (-1) = 4 units. Height is the vertical distance between y = 2 and y = -2: 2 - (-2) = 4 units. Area = 1/2 × (8 + 4) × 4 = 1/2 × 12 × 4 = 24 square units.',
    distractor_diagnostics: {
      B: { error: 'Student forgot to divide by 2: (8 + 4) × 4 = 48.', remediation: 'Area of a trapezoid is 1/2 × (b1 + b2) × h = 1/2 × 12 × 4 = 24 sq units.' },
      C: { error: 'Student used only the bottom base: 4 × 4 = 16.', remediation: 'Average both bases: (8 + 4)/2 = 6, then multiply by height 4 = 24 sq units.' },
      D: { error: 'Student used only the top base: 8 × 4 = 32.', remediation: 'Use both parallel bases in the formula: 1/2 × (8 + 4) × 4 = 24 sq units.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Volume of Rectangular Prisms', subtopic_id: 255,
    question_text: 'A rectangular container is 2 1/4 feet long, 1 1/3 feet wide, and 3 feet tall. What is the volume of the container in cubic feet?',
    option_a: '9 cubic feet', option_b: '6 3/4 cubic feet', option_c: '7 1/2 cubic feet', option_d: '18 cubic feet',
    correct_answer: 'A',
    explanation: 'Convert to improper fractions: 2 1/4 = 9/4, 1 1/3 = 4/3. Volume = (9/4) × (4/3) × 3 = (9 × 4 × 3) / (4 × 3) = 9 cubic feet.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied only length and height (9/4 × 3 = 27/4 = 6 3/4).', remediation: 'Multiply all three dimensions: (9/4) × (4/3) × 3 = 9 cubic feet.' },
      C: { error: 'Student made an error multiplying fractions.', remediation: 'Notice the 4 in numerator and denominator cancels, and the 3 cancels: remaining value is 9.' },
      D: { error: 'Student doubled the volume.', remediation: 'V = (9/4) × (4/3) × 3 = 9 cubic feet.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Volume of Composite Figures', subtopic_id: 256,
    question_text: 'A metal bracket is formed by cutting a rectangular prism hole of 2 cm × 2 cm × 5 cm out of a solid rectangular metal block of 6 cm × 4 cm × 5 cm. What is the volume of metal in the bracket?',
    option_a: '100 cubic cm', option_b: '120 cubic cm', option_c: '20 cubic cm', option_d: '140 cubic cm',
    correct_answer: 'A',
    explanation: 'Solid block volume = 6 × 4 × 5 = 120 cm³. Volume of hole = 2 × 2 × 5 = 20 cm³. Remaining volume = 120 - 20 = 100 cm³.',
    distractor_diagnostics: {
      B: { error: 'Student calculated the solid block volume without subtracting the hole.', remediation: 'Subtract the removed hole: 120 - 20 = 100 cm³.' },
      C: { error: 'Student calculated only the hole volume.', remediation: 'The metal volume is the solid minus the hole: 120 - 20 = 100 cm³.' },
      D: { error: 'Student added the hole volume instead of subtracting: 120 + 20 = 140.', remediation: 'The hole removes material, so subtract: 120 - 20 = 100 cm³.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Surface Area', subtopic_id: 254,
    question_text: 'A gift box shaped like a rectangular prism measures 10 inches by 6 inches by 4 inches. If wrapping paper costs $0.02 per square inch, how much does it cost to cover the entire surface of the box?',
    option_a: '$4.96', option_b: '$2.48', option_c: '$4.80', option_d: '$9.92',
    correct_answer: 'A',
    explanation: 'Surface area = 2(10×6 + 10×4 + 6×4) = 2(60 + 40 + 24) = 2(124) = 248 square inches. Cost = 248 × $0.02 = $4.96.',
    distractor_diagnostics: {
      B: { error: 'Student multiplied 124 by $0.02 (omitted factor of 2 for pairs of faces).', remediation: 'A prism has 6 faces: total surface area = 248 sq in. 248 × $0.02 = $4.96.' },
      C: { error: 'Student used volume (10 × 6 × 4 = 240) × $0.02 = $4.80.', remediation: 'Wrapping covers the surface area, not volume. SA = 248 sq in; cost = $4.96.' },
      D: { error: 'Student doubled the cost.', remediation: 'SA = 248 sq in. 248 × 0.02 = $4.96.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Area of Triangles', subtopic_id: 252,
    question_text: 'A triangular pennant has an area of 84 square inches and a base of 14 inches. What is the perpendicular height of the pennant?',
    option_a: '12 inches', option_b: '6 inches', option_c: '24 inches', option_d: '14 inches',
    correct_answer: 'A',
    explanation: 'A = 1/2 × b × h. 84 = 1/2 × 14 × h = 7h. h = 84 ÷ 7 = 12 inches.',
    distractor_diagnostics: {
      B: { error: 'Student divided area by base without multiplying by 2 (84 ÷ 14 = 6).', remediation: 'Since A = 1/2 × b × h, h = (2 × A) ÷ b = 168 ÷ 14 = 12 inches.' },
      C: { error: 'Student multiplied height by 2: 12 × 2 = 24.', remediation: 'h = (2 × 84) ÷ 14 = 168 ÷ 14 = 12 inches.' },
      D: { error: 'Student assumed height equals base.', remediation: 'h = (2 × 84) ÷ 14 = 12 inches.' }
    }
  },
  {
    grade: 6, difficulty: 'High', subtopic_name: 'Area of Polygons', subtopic_id: 253,
    question_text: 'A large banner is composed of a rectangle 12 feet long and 4 feet wide, with two identical triangles attached at either end, each having base 4 feet and height 3 feet. What is the total area of the banner?',
    option_a: '60 square feet', option_b: '48 square feet', option_c: '54 square feet', option_d: '72 square feet',
    correct_answer: 'A',
    explanation: 'Area of central rectangle = 12 × 4 = 48 sq ft. Area of one triangle = 1/2 × 4 × 3 = 6 sq ft. Area of two triangles = 2 × 6 = 12 sq ft. Total area = 48 + 12 = 60 square feet.',
    distractor_diagnostics: {
      B: { error: 'Student calculated only the rectangle area (48 sq ft).', remediation: 'Add the two end triangles: 48 + 2(6) = 60 sq ft.' },
      C: { error: 'Student included only one of the two end triangles: 48 + 6 = 54 sq ft.', remediation: 'There are two end triangles: 48 + 6 + 6 = 60 sq ft.' },
      D: { error: 'Student did not divide the triangle areas by 2 (48 + 24 = 72).', remediation: 'Each triangle area is 1/2 × 4 × 3 = 6 sq ft; 48 + 12 = 60 sq ft.' }
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

  console.log('Starting insertion of 50 questions for Grade 5 & Grade 6 Measurement...');
  const allQuestions = [...g5Questions, ...g6Questions];
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

  console.log(`Grade 5 & 6 Complete! Inserted: ${inserted}, Updated: ${updated}`);
  await connection.end();
}

seed().catch(err => {
  console.error('Error seeding:', err);
  process.exit(1);
});
