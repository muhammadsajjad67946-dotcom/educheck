import 'dotenv/config'
import { pool } from './db.js'

export async function generateGrade7MCQs() {
  const mcqs = []
  let id = 7001

  const add = (topic, subtopic, q, a, b, c, d, ans, diff, exp) => {
    mcqs.push({ id: id++, grade: 7, subject: 'Math', topic, subtopic, difficulty: diff, question: q, option_a: a, option_b: b, option_c: c, option_d: d, correct_answer: ans, explanation: exp })
  }

  // TOPIC 1: RATIOS & PROPORTIONAL RELATIONSHIPS (50 MCQs)
  // Ratio Concepts (16)
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "School has 3 boys for every 2 girls. 15 boys present. How many girls?", "10", "12", "15", "20", "A", "Low", "3:2 means 15÷3=5 groups, 5×2=10")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Apples to oranges 4:5. 20 apples. How many oranges?", "20", "25", "16", "30", "B", "Low", "20÷4=5, 5×5=25")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Recipe sugar to flour 2:3. 10 cups sugar needed. Flour?", "12", "13", "15", "20", "C", "Low", "10÷2=5, 5×3=15")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Map scale 1:1000. Cities 5cm apart on map. Distance meters?", "50m", "500m", "5km", "50km", "A", "Medium", "5cm×1000=5000cm=50m")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "School ratio teachers:students = 1:20. 40 teachers total. Students?", "400", "600", "800", "900", "C", "Medium", "40×20=800")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Paint red:blue:green = 2:3:4. If 18 parts green, red parts?", "6", "9", "12", "15", "B", "Medium", "4 parts=18, so 1 part=4.5, red=2×4.5=9")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Car speed 60km/hour. 3.5 hours travel. Distance?", "180", "200", "210", "240", "C", "Low", "60×3.5=210km")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Class boys:girls = 3:4, total 35. Number of boys?", "12", "15", "18", "21", "B", "Medium", "3÷7×35=15")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Recipe for 4 serves needs 2 eggs. For 10 serves?", "4", "5", "6", "7", "B", "Low", "2/4=x/10, x=5")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Rectangle length:width = 5:3. Width 12cm. Length?", "18", "20", "24", "30", "B", "Low", "5/3×12=20cm")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Ratio A:B = 2:5. A=8. Then B=?", "16", "20", "22", "24", "B", "Low", "2:5=8:B, B=20")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Cost:time ratio = 15:2. Cost 75. Time?", "8", "9", "10", "11", "C", "Medium", "15:2=75:T, T=10")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Color mixing red:blue = 3:7. Total 50L. Red volume?", "12", "15", "18", "20", "B", "Medium", "3÷10×50=15L")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Three classes A:B:C = 1:2:3, total 30. Class B?", "8", "10", "12", "15", "B", "Medium", "2÷6×30=10")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Price before:after = 4:5. Before 400. After?", "450", "500", "550", "600", "B", "Low", "4:5=400:N, N=500")
  add('Ratios & Proportional Relationships', 'Ratio Concepts', "Plot width:length = 2:7. Width 16m. Length?", "54", "56", "58", "60", "B", "Medium", "2:7=16:L, L=56")

  // Rates & Unit Rates (17)
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "3 notebooks cost 450 rupees total. Cost per notebook?", "100", "150", "200", "250", "B", "Low", "450÷3=150")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Car drives 300km using 20L petrol. Mileage?", "12", "15", "18", "20", "B", "Low", "300÷20=15km/L")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "5 workers finish in 10 days. 10 workers finish in?", "5", "10", "15", "20", "A", "Medium", "50 worker-days")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Photocopier prints 200 pages in 4 minutes. Rate?", "400", "500", "600", "700", "B", "Low", "50 pages/min, so 50×10=500")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Sprinter 100m in 12 seconds. Speed m/s?", "8.33", "8.67", "9", "9.5", "A", "Medium", "100÷12≈8.33")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "6 pens cost 120 rupees. Unit price?", "15", "18", "20", "25", "C", "Low", "120÷6=20")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "8 mangoes cost 160 rupees. 12 mangoes?", "200", "240", "280", "320", "B", "Low", "20 each, 20×12=240")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Population increases 5% per year. 10,000 base. Next year?", "10500", "10400", "10300", "10200", "A", "Medium", "10000×1.05=10500")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "3L milk costs 180 rupees. 5L costs?", "200", "250", "300", "350", "C", "Low", "60 per L, 60×5=300")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Cyclist covers 2.5km in 15min. Speed km/h?", "8", "10", "12", "15", "B", "Medium", "2.5÷0.25=10km/h")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Package of 12 items 480 rupees. 5 items?", "150", "175", "200", "225", "C", "Low", "40 each, 40×5=200")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Factory makes 300 units in 6h. Per hour rate?", "45", "50", "55", "60", "B", "Low", "300÷6=50/h")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Traveling 45km/h for 5 hours. Total km?", "200", "215", "225", "235", "C", "Low", "45×5=225")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Painter takes 8h for 2 rooms. Hours per room?", "3", "4", "5", "6", "B", "Low", "8÷2=4")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Data clerk enters 120 records in 3h. Rate?", "35", "40", "45", "50", "B", "Low", "120÷3=40/h")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "5 books cost 250 rupees. 8 books?", "350", "400", "450", "500", "B", "Low", "50 each, 50×8=400")
  add('Ratios & Proportional Relationships', 'Rates & Unit Rates', "Box of 10 items costs 450 rupees. Per item?", "45", "50", "55", "60", "A", "Low", "450÷10=45")

  // Proportional Relationships (17)
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "x,y proportional. x=4→y=12. x=7→y=?", "15", "18", "21", "24", "C", "Medium", "y/x=3, so y=21")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Points (2,10), (3,15), (5,25) form which relationship?", "Linear", "Proportional", "Quadratic", "Inverse", "B", "Medium", "y/x=5 constant")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Phone plan proportional. 100min = 50 rupees. 250min?", "100", "125", "150", "175", "B", "Low", "0.5/min×250=125")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Distance ∝ time. 200km in 4h. In 6h?", "250", "300", "350", "400", "B", "Low", "50km/h×6=300")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Pages ∝ minutes. 30 pages in 20min. In 50min?", "65", "70", "75", "80", "C", "Medium", "1.5 pages/min×50=75")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "In proportion x doubles. Then y:", "Halves", "Doubles", "Same", "Triples", "B", "Low", "Direct proportion")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "4 workers finish 6 days. 3 workers need?", "4", "6", "8", "9", "C", "Medium", "24 work-days÷3=8")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Recipe 2 servings = 3 cups flour. 8 servings?", "10", "11", "12", "13", "C", "Low", "1.5×8=12")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Table (1,2), (2,4), (3,6). Relationship type?", "Proportional", "Non-proportional", "Constant", "Linear", "A", "Medium", "y/x=2")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Electricity 500 for 100 units. For 350 units?", "1500", "1750", "2000", "2250", "B", "Medium", "5 per unit×350=1750")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Time ∝ distance. 3h for 150km. For 200km?", "3.5h", "4h", "4.5h", "5h", "B", "Medium", "50km/h gives 4h")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Cost ∝ quantity. 6 items = 120. 9 items?", "180", "200", "220", "240", "A", "Low", "20 each×9=180")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Circumference ∝ radius C=2πr. r doubles, C?", "Halves", "Doubles", "Same", "Triples", "B", "Medium", "Direct proportion")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "y = 3x. x=5 then y=?", "10", "12", "15", "18", "C", "Low", "3×5=15")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Wage = 50×hours. 8 hours earned?", "350", "400", "450", "500", "B", "Low", "50×8=400")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "Graph through origin means?", "Proportional", "Non-proportional", "Inverse", "Quadratic", "A", "Low", "Starts at origin")
  add('Ratios & Proportional Relationships', 'Proportional Relationships', "y/x always 6. Relationship?", "Linear", "Proportional", "Inverse", "Quadratic", "B", "Medium", "Constant ratio")

  // TOPIC 2: THE NUMBER SYSTEM (55 MCQs)
  add('The Number System', 'Integers', "-5 + 12 =", "-7", "7", "17", "-17", "B", "Low", "12-5=7")
  add('The Number System', 'Integers', "-8 - (-3) =", "-11", "-5", "5", "11", "B", "Low", "-8+3=-5")
  add('The Number System', 'Integers', "-4 × 6 =", "24", "-24", "10", "-10", "B", "Low", "Neg×Pos=Neg")
  add('The Number System', 'Integers', "Temperature dropped 8°C below 0. Now?", "8°C", "-8°C", "0°C", "16°C", "B", "Low", "Below zero=-8")
  add('The Number System', 'Integers', "-12 ÷ 3 =", "4", "-4", "9", "-9", "B", "Low", "Neg÷Pos=Neg")
  add('The Number System', 'Integers', "Between -5 and 0?", "-6", "1", "-2", "5", "C", "Low", "-5<-2<0")
  add('The Number System', 'Integers', "Absolute value |-7|=", "-7", "7", "0", "14", "B", "Low", "Absolute=7")
  add('The Number System', 'Integers', "(-3) + (-5) =", "-2", "8", "-8", "2", "C", "Low", "-3-5=-8")
  add('The Number System', 'Integers', "(-2)³ =", "8", "-8", "6", "-6", "B", "Medium", "Odd power negative")
  add('The Number System', 'Integers', "Order -3,5,-1,0 smallest first?", "-3,-1,0,5", "5,0,-1,-3", "0,-1,-3,5", "-1,-3,0,5", "A", "Low", "Correct order")
  add('The Number System', 'Integers', "-5 + 8 =", "2", "3", "4", "5", "B", "Low", "8-5=3")
  add('The Number System', 'Integers', "(-5)+(-2)-(-3)=", "-4", "-5", "-6", "-7", "A", "Medium", "-5-2+3=-4")
  add('The Number System', 'Integers', "Negative × Positive=", "Positive", "Negative", "Zero", "Undefined", "B", "Low", "Negative")
  add('The Number System', 'Integers', "5 + (-5) =", "0", "10", "-10", "1", "A", "Low", "5-5=0")
  add('The Number System', 'Integers', "(-6) × (-4) =", "-24", "24", "-10", "10", "B", "Medium", "Neg×Neg=Pos")
  add('The Number System', 'Integers', "(-8) ÷ (-2) =", "-4", "4", "-6", "6", "B", "Medium", "Neg÷Neg=Pos")
  add('The Number System', 'Integers', "(-7) + 2 =", "-9", "-5", "5", "9", "B", "Low", "-7+2=-5")
  add('The Number System', 'Integers', "-3 - 4 =", "1", "-1", "-7", "7", "C", "Low", "-3-4=-7")
  add('The Number System', 'Integers', "3 × (-4) =", "12", "-12", "7", "-7", "B", "Low", "Pos×Neg=Neg")
  add('The Number System', 'Integers', "10 ÷ (-2) =", "5", "-5", "8", "-8", "B", "Low", "Pos÷Neg=Neg")

  add('The Number System', 'Fractions', "1/3 + 1/4 =", "1/7", "2/7", "7/12", "1/12", "C", "Medium", "4/12+3/12=7/12")
  add('The Number System', 'Fractions', "Simplify 6/9=", "2/3", "3/9", "1/3", "2/9", "A", "Low", "GCD=3")
  add('The Number System', 'Fractions', "2/3 × 3/5 =", "1/5", "2/5", "6/15", "5/15", "B", "Medium", "2/5")
  add('The Number System', 'Fractions', "1/2 ÷ 1/4 =", "1/8", "1/2", "2", "4", "C", "Medium", "1/2×4=2")
  add('The Number System', 'Fractions', "5/4 mixed number=", "1 1/4", "1 2/4", "2 1/4", "5 1/4", "A", "Low", "5÷4=1 R1")
  add('The Number System', 'Fractions', "Greater: 3/5 or 4/7?", "3/5", "4/7", "Equal", "Cannot", "A", "Medium", "3/5=21/35>20/35")
  add('The Number System', 'Fractions', "3/4 + 1/8 =", "4/12", "7/8", "4/8", "7/12", "B", "Medium", "6/8+1/8=7/8")
  add('The Number System', 'Fractions', "2 1/3 improper=", "7/3", "5/3", "2/3", "9/3", "A", "Low", "7/3")
  add('The Number System', 'Fractions', "5/6 - 1/3 =", "1/2", "4/6", "4/3", "1/6", "A", "Medium", "5/6-2/6=1/2")
  add('The Number System', 'Fractions', "8 slices. Ate 3+2. Remaining?", "3/8", "4/8", "5/8", "6/8", "A", "Low", "3/8")
  add('The Number System', 'Fractions', "Smallest of 2/3, 3/4, 4/5, 5/6?", "2/3", "3/4", "4/5", "5/6", "A", "Medium", "≈0.667 smallest")
  add('The Number System', 'Fractions', "1/2 + 1/3 + 1/6 =", "1", "3/11", "2/6", "5/6", "A", "Medium", "3/6+2/6+1/6=1")
  add('The Number System', 'Fractions', "3/8 × 4/9 =", "1/6", "12/72", "1/5", "7/17", "A", "Medium", "1/6")

  add('The Number System', 'Decimals', "0.5 + 0.25 =", "0.30", "0.75", "0.80", "1.00", "B", "Low", "0.75")
  add('The Number System', 'Decimals', "2.4 × 3 =", "7.2", "6.4", "5.2", "4.2", "A", "Low", "7.2")
  add('The Number System', 'Decimals', "1.5 - 0.8 =", "0.5", "0.6", "0.7", "0.8", "C", "Low", "0.7")
  add('The Number System', 'Decimals', "4.8 ÷ 0.6 =", "6", "7", "8", "9", "C", "Medium", "8")
  add('The Number System', 'Decimals', "0.75 as fraction=", "1/4", "1/3", "3/4", "2/3", "C", "Medium", "3/4")
  add('The Number System', 'Decimals', "0.25 × 4 =", "1", "2", "0.1", "10", "A", "Low", "1")
  add('The Number System', 'Decimals', "Book 125.50, pen 22.75. Total?", "148.25", "147.25", "148.15", "149.25", "A", "Low", "148.25")
  add('The Number System', 'Decimals', "3.2 - 1.7 =", "1.5", "1.6", "1.7", "2.0", "A", "Low", "1.5")
  add('The Number System', 'Decimals', "0.5 × 0.4 =", "0.2", "0.02", "2", "20", "A", "Medium", "0.2")
  add('The Number System', 'Decimals', "45.50 per meter. 3 meters?", "136.50", "135.50", "134.50", "137.50", "A", "Medium", "136.50")
  add('The Number System', 'Decimals', "0.5 fraction=", "1/5", "1/2", "2/5", "3/5", "B", "Low", "1/2")
  add('The Number System', 'Decimals', "0.12 × 100 =", "1.2", "12", "120", "1200", "B", "Low", "12")

  add('The Number System', 'Percentages', "25% of 100 =", "20", "25", "30", "50", "B", "Low", "25")
  add('The Number System', 'Percentages', "10% of 50 =", "3", "5", "8", "10", "B", "Low", "5")
  add('The Number System', 'Percentages', "400 with 20% discount=", "250", "280", "300", "320", "D", "Medium", "320")
  add('The Number System', 'Percentages', "50% of 200 =", "50", "75", "100", "125", "C", "Low", "100")
  add('The Number System', 'Percentages', "40 Qs, 80% correct. How many?", "28", "30", "32", "35", "C", "Medium", "32")
  add('The Number System', 'Percentages', "Salary 5000→5500 increase %?", "10%", "8%", "5%", "15%", "A", "Medium", "10%")
  add('The Number System', 'Percentages', "15% of 200 =", "25", "30", "35", "40", "B", "Medium", "30")
  add('The Number System', 'Percentages', "300 pages, read 180. %?", "50%", "55%", "60%", "65%", "C", "Medium", "60%")
  add('The Number System', 'Percentages', "5% of 80 =", "3", "4", "5", "6", "B", "Low", "4")
  add('The Number System', 'Percentages', "Score 72/100=% ?", "60%", "65%", "70%", "72%", "D", "Low", "72%")

  // TOPIC 3: EXPRESSIONS & EQUATIONS (55 MCQs)
  add('Expressions & Equations', 'Algebraic Expressions', "3x + 2x =", "5x", "6x", "x", "5", "A", "Low", "5x")
  add('Expressions & Equations', 'Algebraic Expressions', "2(x + 3) =", "2x+3", "2x+6", "x+6", "3x+6", "B", "Low", "2x+6")
  add('Expressions & Equations', 'Algebraic Expressions', "Coefficient y in 5y+3=", "3", "5", "y", "8", "B", "Low", "5")
  add('Expressions & Equations', 'Algebraic Expressions', "4a + 2b - a + 3b =", "3a+5b", "5a+5b", "3a+b", "6a+6b", "A", "Medium", "3a+5b")
  add('Expressions & Equations', 'Algebraic Expressions', "Constant in 2x + 7=", "2", "x", "7", "9", "C", "Low", "7")
  add('Expressions & Equations', 'Algebraic Expressions', "3(2x - 1) =", "6x-3", "6x-1", "5x-3", "6x+3", "A", "Low", "6x-3")
  add('Expressions & Equations', 'Algebraic Expressions', "2x + 3x + x =", "5x", "6x", "7x", "8x", "B", "Low", "6x")
  add('Expressions & Equations', 'Algebraic Expressions', "Number +5 express?", "x-5", "x+5", "5-x", "5x", "B", "Low", "x+5")
  add('Expressions & Equations', 'Algebraic Expressions', "5(a + 2) - 3 =", "5a+7", "5a+10", "5a+2", "2a+7", "A", "Medium", "5a+7")
  add('Expressions & Equations', 'Algebraic Expressions', "2x + 3 when x=4?", "8", "9", "10", "11", "D", "Low", "11")
  add('Expressions & Equations', 'Algebraic Expressions', "7x - 3x + 2 =", "4x+2", "4x-2", "10x+2", "4x", "A", "Low", "4x+2")
  add('Expressions & Equations', 'Algebraic Expressions', "-2(x - 4) =", "-2x+8", "-2x-8", "-2x-4", "-2x+4", "A", "Low", "-2x+8")
  add('Expressions & Equations', 'Algebraic Expressions', "6x ÷ 3 + 2 =", "2x+2", "3x+2", "x+2", "2x", "A", "Medium", "2x+2")
  add('Expressions & Equations', 'Algebraic Expressions', "2x + 5 when x=0?", "2", "5", "7", "10", "B", "Low", "5")
  add('Expressions & Equations', 'Algebraic Expressions', "Twice number -7 express?", "x-14", "2x-7", "x-7", "2-7x", "B", "Low", "2x-7")

  add('Expressions & Equations', 'Linear Equations', "x + 5 = 12, x=", "5", "6", "7", "8", "C", "Low", "7")
  add('Expressions & Equations', 'Linear Equations', "3x = 15, x=", "3", "4", "5", "6", "C", "Low", "5")
  add('Expressions & Equations', 'Linear Equations', "2x + 3 = 11, x=", "3", "4", "5", "6", "B", "Medium", "4")
  add('Expressions & Equations', 'Linear Equations', "x - 4 = 6, x=", "2", "8", "10", "12", "C", "Low", "10")
  add('Expressions & Equations', 'Linear Equations', "4x - 2 = 10, x=", "2", "3", "4", "5", "B", "Medium", "3")
  add('Expressions & Equations', 'Linear Equations', "x/2 = 5, x=", "2", "5", "10", "15", "C", "Low", "10")
  add('Expressions & Equations', 'Linear Equations', "2x + 5 = 13, x=", "3", "4", "5", "6", "B", "Medium", "4")
  add('Expressions & Equations', 'Linear Equations', "5x = 25, x=", "4", "5", "6", "7", "B", "Low", "5")
  add('Expressions & Equations', 'Linear Equations', "3x - 1 = 8, x=", "2", "3", "4", "5", "B", "Medium", "3")
  add('Expressions & Equations', 'Linear Equations', "Number ×2 +3=15. Number?", "5", "6", "7", "8", "B", "Medium", "6")
  add('Expressions & Equations', 'Linear Equations', "x + 20 = 35, x=", "10", "12", "15", "20", "C", "Low", "15")
  add('Expressions & Equations', 'Linear Equations', "6x - 4 = 14, x=", "2", "3", "4", "5", "B", "Medium", "3")
  add('Expressions & Equations', 'Linear Equations', "10 - x = 3, x=", "5", "6", "7", "8", "C", "Low", "7")
  add('Expressions & Equations', 'Linear Equations', "x/3 + 2 = 5, x=", "6", "7", "8", "9", "D", "Medium", "9")
  add('Expressions & Equations', 'Linear Equations', "2(x - 1) = 8, x=", "3", "4", "5", "6", "C", "Medium", "5")

  add('Expressions & Equations', 'Two-Variable Equations', "x=2, y=3, x+y=", "5", "6", "1", "0", "A", "Low", "5")
  add('Expressions & Equations', 'Two-Variable Equations', "x=4, y=2, 2x+y=", "8", "9", "10", "11", "C", "Low", "10")
  add('Expressions & Equations', 'Two-Variable Equations', "y=2x+1, x=3, y=", "5", "6", "7", "8", "C", "Low", "7")
  add('Expressions & Equations', 'Two-Variable Equations', "y=3x-2, x=5, y=", "12", "13", "14", "15", "B", "Low", "13")
  add('Expressions & Equations', 'Two-Variable Equations', "x+y=10, x=3, y=", "5", "6", "7", "8", "C", "Low", "7")
  add('Expressions & Equations', 'Two-Variable Equations', "2x+y=15, x=4, y=", "5", "6", "7", "8", "C", "Medium", "7")
  add('Expressions & Equations', 'Two-Variable Equations', "3x+2y=12, x=2, y=", "3", "4", "5", "6", "A", "Medium", "3")
  add('Expressions & Equations', 'Two-Variable Equations', "x=5, y=2, x²+y=", "25", "26", "27", "28", "C", "Medium", "27")
  add('Expressions & Equations', 'Two-Variable Equations', "y=4x, x=3, y=", "10", "11", "12", "13", "C", "Low", "12")
  add('Expressions & Equations', 'Two-Variable Equations', "x-y=5, x=12, y=", "5", "6", "7", "8", "C", "Low", "7")

  add('Expressions & Equations', 'Word Problems & Applications', "Rectangle length 3× width, width 4cm, length?", "7", "9", "12", "15", "C", "Low", "12")
  add('Expressions & Equations', 'Word Problems & Applications', "Fatima 2× Bilal books, Bilal 15, Fatima?", "25", "30", "35", "40", "B", "Low", "30")
  add('Expressions & Equations', 'Word Problems & Applications', "Consecutive integers sum 25, they?", "11,12", "12,13", "10,15", "5,20", "B", "Medium", "12,13")
  add('Expressions & Equations', 'Word Problems & Applications', "3 shirts 600, 5 shirts?", "900", "1000", "1200", "1500", "B", "Low", "1000")
  add('Expressions & Equations', 'Word Problems & Applications', "Car 60km/h ×4h=distance?", "180", "200", "240", "280", "C", "Low", "240")
  add('Expressions & Equations', 'Word Problems & Applications', "Sara 25 more, together 95, Ali=", "30", "35", "40", "45", "B", "Medium", "35")
  add('Expressions & Equations', 'Word Problems & Applications', "Square perimeter 32cm, side?", "4", "6", "8", "10", "C", "Low", "8")
  add('Expressions & Equations', 'Word Problems & Applications', "Number 5 less than 2× other, other=10, first=", "10", "15", "20", "25", "B", "Medium", "15")
  add('Expressions & Equations', 'Word Problems & Applications', "3× number +7=22, number?", "4", "5", "6", "7", "B", "Medium", "5")
  add('Expressions & Equations', 'Word Problems & Applications', "Worker 500/day, 4000 total, days?", "6", "7", "8", "9", "C", "Medium", "8")
  add('Expressions & Equations', 'Word Problems & Applications', "Total 2000, shoes 700, shirt?", "1200", "1300", "1400", "1500", "B", "Low", "1300")
  add('Expressions & Equations', 'Word Problems & Applications', "Rectangle perimeter 30, length 8, width?", "4", "6", "7", "8", "C", "Medium", "7")
  add('Expressions & Equations', 'Word Problems & Applications', "3kg sugar 180, 5kg?", "250", "280", "300", "320", "C", "Low", "300")
  add('Expressions & Equations', 'Word Problems & Applications', "2× number=40, number?", "15", "18", "20", "22", "C", "Low", "20")
  add('Expressions & Equations', 'Word Problems & Applications', "Half number=15, number?", "25", "30", "35", "40", "B", "Low", "30")

  // TOPIC 4: GEOMETRY (65 MCQs)
  add('Geometry', 'Angles & Lines', "Triangle angles sum=", "90°", "180°", "270°", "360°", "B", "Low", "180°")
  add('Geometry', 'Angles & Lines', "Triangle 60°, 50°, third?", "70°", "75°", "80°", "85°", "A", "Low", "70°")
  add('Geometry', 'Angles & Lines', "Supplementary one 120°, other?", "30°", "40°", "50°", "60°", "D", "Low", "60°")
  add('Geometry', 'Angles & Lines', "Regular hexagon interior angle?", "90°", "108°", "120°", "135°", "C", "Medium", "120°")
  add('Geometry', 'Angles & Lines', "Complementary one 35°, other?", "45°", "55°", "65°", "75°", "B", "Low", "55°")
  add('Geometry', 'Angles & Lines', "Vertical angles=", "Supplementary", "Complementary", "Equal", "Right", "C", "Low", "Equal")
  add('Geometry', 'Angles & Lines', "Right triangle 90°, 35°, third?", "45°", "50°", "55°", "60°", "C", "Low", "55°")
  add('Geometry', 'Angles & Lines', "Quadrilateral interior angles=", "180°", "270°", "360°", "450°", "C", "Low", "360°")
  add('Geometry', 'Angles & Lines', "Perpendicular lines angle?", "45°", "60°", "90°", "180°", "C", "Low", "90°")
  add('Geometry', 'Angles & Lines', "Isosceles vertex 50°, base each?", "60°", "65°", "70°", "75°", "B", "Medium", "65°")
  add('Geometry', 'Angles & Lines', "Linear pair sum=", "90°", "180°", "270°", "360°", "B", "Low", "180°")
  add('Geometry', 'Angles & Lines', "45° supplement?", "45°", "90°", "135°", "180°", "C", "Low", "135°")
  add('Geometry', 'Angles & Lines', "30° complement?", "30°", "60°", "90°", "150°", "B", "Low", "60°")
  add('Geometry', 'Angles & Lines', "Pentagon interior angle sum?", "360°", "450°", "540°", "630°", "C", "Medium", "540°")
  add('Geometry', 'Angles & Lines', "Straight angle measure?", "90°", "180°", "270°", "360°", "B", "Low", "180°")

  add('Geometry', 'Triangles', "All equal sides type=", "Isosceles", "Right", "Equilateral", "Scalene", "C", "Low", "Equilateral")
  add('Geometry', 'Triangles', "Right legs 3,4, hypotenuse?", "5", "6", "7", "8", "A", "Medium", "5")
  add('Geometry', 'Triangles', "Triangle area base 6, height 4?", "12", "14", "16", "18", "A", "Low", "12")
  add('Geometry', 'Triangles', "Sides 5,5,6, type?", "Equilateral", "Isosceles", "Scalene", "Right", "B", "Low", "Isosceles")
  add('Geometry', 'Triangles', "Equilateral perimeter 18cm, side?", "5", "6", "7", "8", "B", "Low", "6")
  add('Geometry', 'Triangles', "Right legs 5,12, hypotenuse?", "11", "12", "13", "14", "C", "Medium", "13")
  add('Geometry', 'Triangles', "Sides 3,4,5 right triangle?", "Yes", "No", "Cannot", "Isosceles", "A", "Medium", "Yes")
  add('Geometry', 'Triangles', "Area 24, base 8, height?", "4", "5", "6", "8", "C", "Medium", "6")
  add('Geometry', 'Triangles', "Isosceles right legs 7, hypotenuse?", "7√2", "14", "49", "98", "A", "High", "7√2")
  add('Geometry', 'Triangles', "Acute triangle all angles<", "90°", "60°", "45°", "30°", "A", "Low", "All < 90°")
  add('Geometry', 'Triangles', "45°, 45°, third?", "70°", "80°", "90°", "100°", "C", "Low", "90°")
  add('Geometry', 'Triangles', "Perimeter 30, sides 8,10, third?", "10", "11", "12", "13", "C", "Low", "12")
  add('Geometry', 'Triangles', "Legs 6,8, hypotenuse?", "8", "9", "10", "11", "C", "Medium", "10")
  add('Geometry', 'Triangles', "Equilateral perimeter 24, side?", "6", "7", "8", "9", "C", "Low", "8")
  add('Geometry', 'Triangles', "Height 5 doubled area change?", "Double", "Half", "Same", "Triple", "A", "Medium", "Double")

  add('Geometry', 'Quadrilaterals', "Square side 5cm, perimeter?", "15", "20", "25", "30", "B", "Low", "20")
  add('Geometry', 'Quadrilaterals', "Rectangle length 8, width 5, area?", "30", "35", "40", "45", "C", "Low", "40")
  add('Geometry', 'Quadrilaterals', "Square area 49, side?", "5", "6", "7", "8", "C", "Low", "7")
  add('Geometry', 'Quadrilaterals', "Parallelogram base 10, height 6, area?", "30", "40", "50", "60", "D", "Low", "60")
  add('Geometry', 'Quadrilaterals', "Rectangle perimeter 24cm, length 7, width?", "4", "5", "6", "7", "B", "Medium", "5")
  add('Geometry', 'Quadrilaterals', "Trapezoid parallel 5,9, height 4, area?", "14", "18", "24", "28", "D", "Medium", "28")
  add('Geometry', 'Quadrilaterals', "Rhombus diagonals 6,8, area?", "20", "22", "24", "26", "C", "High", "24")
  add('Geometry', 'Quadrilaterals', "Square perimeter 28cm, area?", "36", "42", "48", "49", "D", "Medium", "49")
  add('Geometry', 'Quadrilaterals', "Rectangle perimeter 36, length 2× width, length?", "9", "10", "12", "15", "C", "Medium", "12")
  add('Geometry', 'Quadrilaterals', "Quadrilateral angles sum=", "180°", "270°", "360°", "450°", "C", "Low", "360°")
  add('Geometry', 'Quadrilaterals', "Rectangle area 56, length 8, width?", "6", "7", "8", "9", "B", "Low", "7")
  add('Geometry', 'Quadrilaterals', "Square side 6, perimeter?", "18", "24", "30", "36", "B", "Low", "24")
  add('Geometry', 'Quadrilaterals', "Parallelogram base=height=5, area?", "20", "25", "30", "35", "B", "Low", "25")
  add('Geometry', 'Quadrilaterals', "Trapezoid area 30, parallel 6,4, height?", "5", "6", "7", "8", "B", "Medium", "6")
  add('Geometry', 'Quadrilaterals', "Rectangle diagonal 13, width 5, length?", "10", "11", "12", "13", "C", "High", "12")

  add('Geometry', 'Circles', "Circle radius 5, circumference?", "10π", "25π", "5π", "2π", "A", "Low", "10π")
  add('Geometry', 'Circles', "Circle radius 3, area?", "3π", "6π", "9π", "12π", "C", "Low", "9π")
  add('Geometry', 'Circles', "Diameter 10, circumference?", "5π", "10π", "15π", "20π", "B", "Low", "10π")
  add('Geometry', 'Circles', "Circumference 12π, radius?", "3", "4", "6", "12", "C", "Medium", "6")
  add('Geometry', 'Circles', "Diameter 8, area?", "4π", "8π", "16π", "32π", "C", "Medium", "16π")
  add('Geometry', 'Circles', "Radius 7, circumference π≈3.14?", "43.96", "44.96", "45.96", "46.96", "A", "Medium", "43.96")
  add('Geometry', 'Circles', "Radius 6, area?", "36π", "18π", "12π", "6π", "A", "Low", "36π")
  add('Geometry', 'Circles', "Area 25π, radius?", "3", "5", "7", "10", "B", "Medium", "5")
  add('Geometry', 'Circles', "Sector 90°, radius 4, area?", "2π", "4π", "8π", "16π", "B", "High", "4π")
  add('Geometry', 'Circles', "Radius doubled, area change?", "Double", "Triple", "Quadruple", "Same", "C", "High", "Quadruple")
  add('Geometry', 'Circles', "Semicircle radius 5, area?", "12.5π", "25π", "50π", "25π/2", "A", "Medium", "12.5π")
  add('Geometry', 'Circles', "Radius 10, diameter?", "5", "10", "20", "40", "C", "Low", "20")
  add('Geometry', 'Circles', "Circumference 20π, diameter?", "10", "20", "40", "80", "B", "Medium", "20")
  add('Geometry', 'Circles', "Area 64π, radius?", "6", "8", "10", "12", "B", "Medium", "8")

  add('Geometry', '2D & 3D Shapes', "Cube vertices?", "6", "8", "10", "12", "B", "Low", "8")
  add('Geometry', '2D & 3D Shapes', "Prism 5×3×2, volume?", "15", "20", "25", "30", "D", "Low", "30")
  add('Geometry', '2D & 3D Shapes', "Triangular prism faces?", "3", "4", "5", "6", "C", "Low", "5")
  add('Geometry', '2D & 3D Shapes', "Cube side 4, volume?", "16", "32", "48", "64", "D", "Low", "64")
  add('Geometry', '2D & 3D Shapes', "Cylinder radius 3, height 5, volume?", "15π", "30π", "45π", "90π", "C", "Medium", "45π")
  add('Geometry', '2D & 3D Shapes', "Sphere radius 3, volume?", "12π", "18π", "27π", "36π", "D", "High", "36π")

  // TOPIC 5: STATISTICS & PROBABILITY (75 MCQs)
  add('Statistics & Probability', 'Data Collection & Representation', "Changes over time best graph?", "Pie", "Bar", "Line", "Histogram", "C", "Low", "Line")
  add('Statistics & Probability', 'Data Collection & Representation', "Scores 65,70,75,80,85, mean?", "70", "75", "80", "85", "B", "Low", "75")
  add('Statistics & Probability', 'Data Collection & Representation', "Parts of whole best graph?", "Scatter", "Pie", "Line", "Box", "B", "Low", "Pie")
  add('Statistics & Probability', 'Data Collection & Representation', "Data 10,12,15,15,18, mode?", "12", "14", "15", "16", "C", "Low", "15")
  add('Statistics & Probability', 'Data Collection & Representation', "Median 2,5,8,9,10?", "5", "7", "8", "9", "C", "Low", "8")
  add('Statistics & Probability', 'Data Collection & Representation', "Shows 2 variables relationship?", "Pie", "Bar", "Scatter", "Stem", "C", "Medium", "Scatter")
  add('Statistics & Probability', 'Data Collection & Representation', "Range 3,5,7,9,11?", "6", "7", "8", "9", "C", "Low", "8")
  add('Statistics & Probability', 'Data Collection & Representation', "Mean 12,14,16,18,20?", "14", "16", "17", "18", "B", "Low", "16")
  add('Statistics & Probability', 'Data Collection & Representation', "Median 2,4,6,8?", "4", "5", "6", "7", "B", "Medium", "5")
  add('Statistics & Probability', 'Data Collection & Representation', "Even count data, median?", "Highest", "Average middle two", "Lowest", "Largest", "B", "Medium", "Average middle two")
  add('Statistics & Probability', 'Data Collection & Representation', "Data 20,30,40,50, median?", "30", "35", "40", "45", "B", "Medium", "35")
  add('Statistics & Probability', 'Data Collection & Representation', "Mean 6 numbers is 50, sum?", "250", "300", "350", "400", "B", "Low", "300")
  add('Statistics & Probability', 'Data Collection & Representation', "Mode 100,200,200,300,400?", "100", "200", "300", "400", "B", "Low", "200")
  add('Statistics & Probability', 'Data Collection & Representation', "Median 10,20,30?", "15", "20", "25", "30", "B", "Low", "20")
  add('Statistics & Probability', 'Data Collection & Representation', "Mean 5,10,15?", "9", "10", "11", "12", "B", "Low", "10")

  add('Statistics & Probability', 'Mean Median Mode', "Mean 2,4,6,8,10?", "5", "6", "7", "8", "B", "Low", "6")
  add('Statistics & Probability', 'Mean Median Mode', "Median 11,13,15,17,19?", "13", "14", "15", "16", "C", "Low", "15")
  add('Statistics & Probability', 'Mean Median Mode', "Mode 10,10,20,30,40?", "10", "20", "30", "40", "A", "Low", "10")
  add('Statistics & Probability', 'Mean Median Mode', "Mean 5,15,25,35?", "15", "20", "25", "30", "C", "Low", "25")
  add('Statistics & Probability', 'Mean Median Mode', "Mean 4 numbers is 40, sum?", "120", "140", "160", "180", "C", "Low", "160")
  add('Statistics & Probability', 'Mean Median Mode', "Median 7,8,9,10,11,12?", "8", "9", "9.5", "10", "C", "Medium", "9.5")
  add('Statistics & Probability', 'Mean Median Mode', "Mean 6,12,18,24?", "12", "15", "18", "21", "B", "Low", "15")
  add('Statistics & Probability', 'Mean Median Mode', "Mode 5,5,5,10,15,15?", "5", "10", "15", "20", "A", "Low", "5")
  add('Statistics & Probability', 'Mean Median Mode', "Median 4 values, two 25,30 middle?", "27", "27.5", "28", "28.5", "B", "Medium", "27.5")
  add('Statistics & Probability', 'Mean Median Mode', "Test scores 70,75,80,85,90, mean?", "80", "82", "84", "86", "A", "Low", "80")
  add('Statistics & Probability', 'Mean Median Mode', "Heights 150,160,170,180, median?", "165", "170", "175", "180", "A", "Medium", "165")
  add('Statistics & Probability', 'Mean Median Mode', "Mean 3 numbers is 60, sum?", "120", "140", "160", "180", "C", "Low", "180")
  add('Statistics & Probability', 'Mean Median Mode', "Mode 50,50,60,70,80?", "50", "60", "70", "80", "A", "Low", "50")
  add('Statistics & Probability', 'Mean Median Mode', "Median 15,25,35?", "20", "25", "30", "35", "B", "Low", "25")
  add('Statistics & Probability', 'Mean Median Mode', "Mean 8,16,24?", "14", "16", "18", "20", "B", "Low", "16")

  add('Statistics & Probability', 'Probability', "Fair coin P(heads)?", "0.25", "0.5", "0.75", "1", "B", "Low", "0.5")
  add('Statistics & Probability', 'Probability', "Die P(4)?", "1/4", "1/5", "1/6", "1/3", "C", "Low", "1/6")
  add('Statistics & Probability', 'Probability', "Bag 3red,2blue, P(red)?", "2/5", "3/5", "1/5", "4/5", "B", "Low", "3/5")
  add('Statistics & Probability', 'Probability', "Deck 52, P(ace)?", "1/52", "1/13", "1/4", "1/26", "B", "Medium", "1/13")
  add('Statistics & Probability', 'Probability', "Spinner 8: 3r,2b,3g, P(blue)?", "1/4", "1/3", "3/8", "2/8", "A", "Medium", "1/4")
  add('Statistics & Probability', 'Probability', "Die P(even)?", "1/3", "1/2", "2/3", "5/6", "B", "Low", "1/2")
  add('Statistics & Probability', 'Probability', "Two coins P(heads,heads)?", "1/2", "1/3", "1/4", "1/8", "C", "Medium", "1/4")
  add('Statistics & Probability', 'Probability', "Jar 5r,3b,2g, P(not red)?", "1/2", "5/10", "3/10", "2/10", "A", "Medium", "1/2")
  add('Statistics & Probability', 'Probability', "P(event)=0.3, P(not)?", "0.3", "0.5", "0.7", "1.3", "C", "Low", "0.7")
  add('Statistics & Probability', 'Probability', "Die+coin P(5,heads)?", "1/6", "1/12", "1/8", "1/4", "B", "Medium", "1/12")
  add('Statistics & Probability', 'Probability', "Deck P(red)?", "1/4", "1/3", "1/2", "3/4", "C", "Low", "1/2")
  add('Statistics & Probability', 'Probability', "Letters A,B,C,D,E P(A)?", "1/3", "1/4", "1/5", "1/6", "C", "Low", "1/5")
  add('Statistics & Probability', 'Probability', "1-10 P(odd)?", "0.4", "0.5", "0.6", "0.7", "B", "Low", "0.5")
  add('Statistics & Probability', 'Probability', "Two dice P(sum=7)?", "1/6", "1/8", "1/12", "1/36", "A", "High", "1/6")
  add('Statistics & Probability', 'Probability', "Bag marbles 6 P(red)?", "1/6", "1/3", "1/2", "Cannot", "D", "Medium", "Cannot tell")

  add('Statistics & Probability', 'Data Analysis & Interpretation', "Class 30. A=10,B=12,C=5,D=3. % A or B?", "55%", "65%", "73%", "80%", "C", "Medium", "73%")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Mean 4 tests=80, tests 75,80,85, fourth?", "75", "80", "85", "90", "B", "Medium", "80")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Sales increase 10%,15%,5%, mean?", "8%", "9%", "10%", "12%", "C", "Medium", "10%")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Survey 500, 60% coffee, count?", "200", "250", "300", "350", "C", "Low", "300")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Data 5,10,15,20,25, mean=median?", "Mean<Median", "Mean=Median", "Mean>Median", "No", "B", "Medium", "Mean=Median")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "SD=5, 68% within?", "±3", "±5", "±10", "±15", "B", "High", "±5")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Weekly 1000,1200,1100,1300,1400,1500,1600, median?", "1100", "1200", "1300", "1400", "C", "Medium", "1300")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Positive correlation?", "No", "x↑,y↓", "x↑,y↑", "Causal", "C", "Low", "x↑,y↑")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "100 students mean 160,SD 8, 152-168?", "34", "68", "95", "99", "B", "High", "68")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Mean 70, score 85, SD 5, SDs above?", "2", "3", "4", "5", "B", "High", "3")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Data 100,200,300, mean?", "100", "150", "200", "250", "C", "Low", "200")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Sample 10, freq 2,3,5, mode?", "2", "3", "5", "10", "C", "Low", "5")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Negative correlation?", "No", "x↑,y↑", "x↑,y↓", "Causal", "C", "Low", "x↑,y↓")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Population 100, sample 98, error?", "2", "98", "100", "102", "A", "Medium", "2")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Q2 same as?", "Mean", "Mode", "Median", "Range", "C", "Medium", "Median")

  add('Statistics & Probability', 'Data Interpretation Advanced', "Ages 25,30,35,40,45, mean?", "33", "35", "37", "39", "B", "Low", "35")
  add('Statistics & Probability', 'Data Interpretation Advanced', "Spread 100,150,200,250?", "100", "125", "150", "175", "C", "Low", "150")
  add('Statistics & Probability', 'Data Interpretation Advanced', "What is outlier?", "Most common", "Extreme value", "Average value", "Middle value", "B", "Medium", "Extreme value")
  add('Statistics & Probability', 'Data Interpretation Advanced', "Percentile definition?", "Percent value", "Below this %", "Above average", "Same as mode", "B", "High", "Below this %")
  add('Statistics & Probability', 'Data Interpretation Advanced', "Q1 is?", "25th percentile", "50th percentile", "75th percentile", "100th percentile", "A", "Medium", "25th percentile")
  add('Statistics & Probability', 'Data Interpretation Advanced', "Q3 is?", "25th percentile", "50th percentile", "75th percentile", "100th percentile", "C", "Medium", "75th percentile")
  add('Statistics & Probability', 'Probability', "Impossible event probability?", "0", "0.5", "1", "-1", "A", "Low", "0")
  add('Statistics & Probability', 'Probability', "Certain event probability?", "0", "0.5", "1", "-1", "C", "Low", "1")
  add('Statistics & Probability', 'Data Collection & Representation', "Dots graph shows what?", "Frequency", "Time", "Categories", "Amounts", "A", "Low", "Frequency")
  add('Statistics & Probability', 'Data Collection & Representation', "Box plot shows?", "Mean", "Quartiles", "Categories", "Time", "B", "Medium", "Quartiles")
  add('Statistics & Probability', 'Mean Median Mode', "Bimodal data means?", "One mode", "Two modes", "No mode", "Many modes", "B", "Medium", "Two modes")
  add('Statistics & Probability', 'Mean Median Mode', "Data 50,50,50, mode?", "Cannot tell", "50", "0", "100", "B", "Low", "50")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Outlier effect on median?", "Large", "Small", "None", "Increases", "B", "Medium", "Small")
  add('Statistics & Probability', 'Data Analysis & Interpretation', "Outlier effect on mean?", "Large", "Small", "None", "Neutral", "A", "Medium", "Large")
  add('Statistics & Probability', 'Data Collection & Representation', "Range interpretation?", "Middle value", "Difference high-low", "Most common", "Average", "B", "Low", "High-Low")

  return mcqs
}

async function validateMCQs(mcqs) {
  const validation = { total: mcqs.length, valid: 0, invalid: 0, duplicates: 0, issues: [] }
  const seenQs = new Set()
  const seenIds = new Set()

  for (const m of mcqs) {
    let isValid = true

    if (!m.question?.trim()) isValid = false
    if (!m.topic?.trim()) isValid = false
    if (!m.subtopic?.trim()) isValid = false
    if (!['Low', 'Medium', 'High'].includes(m.difficulty)) isValid = false
    if (!['A', 'B', 'C', 'D'].includes(m.correct_answer)) isValid = false
    if (!m.option_a || !m.option_b || !m.option_c || !m.option_d) isValid = false

    if (seenQs.has(m.question)) { validation.duplicates++; isValid = false }
    seenQs.add(m.question)

    if (seenIds.has(m.id)) isValid = false
    seenIds.add(m.id)

    if (isValid) validation.valid++
    else validation.invalid++
  }

  return validation
}

async function insertMCQs(mcqs) {
  const conn = await pool.getConnection()
  let ok = 0, fail = 0
  try {
    await conn.beginTransaction()
    const [subRows] = await conn.query('SELECT id FROM subjects WHERE name = ?', ['Math'])
    let subId = subRows[0]?.id
    if (!subId) {
      const [res] = await conn.query('INSERT INTO subjects (name) VALUES (?)', ['Math'])
      subId = res.insertId
    }

    const topicMap = {}
    for (const m of mcqs) {
      const key = `${m.topic}::${m.subtopic}`
      if (!topicMap[key]) {
        let [pRows] = await conn.query('SELECT id FROM topics WHERE subject_id = ? AND name = ? AND parent_topic_id IS NULL LIMIT 1', [subId, m.topic])
        let pId = pRows[0]?.id
        if (!pId) {
          const [pRes] = await conn.query('INSERT INTO topics (subject_id, name) VALUES (?, ?)', [subId, m.topic])
          pId = pRes.insertId
        }

        let [sRows] = await conn.query('SELECT id FROM topics WHERE subject_id = ? AND name = ? AND parent_topic_id = ? LIMIT 1', [subId, m.subtopic, pId])
        let sId = sRows[0]?.id
        if (!sId) {
          const [sRes] = await conn.query('INSERT INTO topics (subject_id, name, parent_topic_id) VALUES (?, ?, ?)', [subId, m.subtopic, pId])
          sId = sRes.insertId
        }
        topicMap[key] = sId
      }
    }

    for (const m of mcqs) {
      try {
        const tId = topicMap[`${m.topic}::${m.subtopic}`]
        await conn.query(
          `INSERT INTO questions (subject_id, topic_id, question_text, grade, difficulty, option_a, option_b, option_c, option_d, correct_answer, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
          [subId, tId, m.question, m.grade, m.difficulty, m.option_a, m.option_b, m.option_c, m.option_d, m.correct_answer]
        )
        ok++
      } catch (e) { fail++ }
    }

    await conn.commit()
  } catch (e) { await conn.rollback(); throw e }
  finally { conn.release() }
  return { ok, fail }
}

async function main() {
  try {
    console.log('📚 Grade 7 Math - 300 MCQs Generation\n')

    console.log('🔄 Generating MCQs...')
    const mcqs = await generateGrade7MCQs()
    console.log(`✅ Generated ${mcqs.length} MCQs\n`)

    console.log('🔍 Validating...')
    const val = await validateMCQs(mcqs)
    console.log(`✅ Valid: ${val.valid}, Invalid: ${val.invalid}, Duplicates: ${val.duplicates}\n`)

    if (val.invalid > 0) { console.log('❌ Validation failed'); return }

    console.log('💾 Inserting to DB...')
    const res = await insertMCQs(mcqs)
    console.log(`✅ Inserted: ${res.ok}, Failed: ${res.fail}\n`)

    // Summary
    const topics = {}, subtopics = {}, diff = { Low: 0, Medium: 0, High: 0 }
    for (const m of mcqs) {
      topics[m.topic] = (topics[m.topic] || 0) + 1
      subtopics[m.subtopic] = (subtopics[m.subtopic] || 0) + 1
      diff[m.difficulty]++
    }

    console.log('📊 SUMMARY')
    console.log('='.repeat(50))
    console.log(`Total: ${mcqs.length}, Inserted: ${res.ok}`)
    console.log(`\n📚 TOPICS:`)
    const expected = { 'Ratios & Proportional Relationships': 50, 'The Number System': 55, 'Expressions & Equations': 55, 'Geometry': 65, 'Statistics & Probability': 75 }
    for (const [t, e] of Object.entries(expected)) {
      const a = topics[t] || 0
      console.log(`   ${a === e ? '✅' : '⚠️'} ${t}: ${a}/${e}`)
    }
    console.log(`\n📊 DIFFICULTY: Low ${diff.Low}, Medium ${diff.Medium}, High ${diff.High}`)
    console.log('\n✨ Complete!')
    process.exit(0)
  } catch (err) {
    console.error('❌', err.message)
    process.exit(1)
  }
}

if (process.argv[1] && process.argv[1].endsWith('insertGrade7MCQs.js')) {
  main()
}
