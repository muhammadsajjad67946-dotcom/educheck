const question = (id, topic, subtopic, difficulty, text, options, answer) => ({
  id, grade: 3, topic, subtopic, difficulty, question: text, options, answer,
})

const numberQuestions = [
  ['Ali buys 4 packets of pencils. Each packet has 6 pencils. How many pencils does Ali buy altogether?', ['10', '20', '24', '28'], 'C'],
  ['A teacher has 36 stickers and wants to give them equally to 6 students. How many stickers will each student get?', ['5', '6', '7', '8'], 'B'],
  ['Sara has 25 apples. Her mother gives her 18 more apples. How many apples does Sara have now?', ['33', '40', '43', '45'], 'C'],
  ['Ahmed has 50 rupees and spends 23 rupees on a snack. How much money does he have left?', ['17 rupees', '27 rupees', '33 rupees', '37 rupees'], 'B'],
  ['A baker cuts a cake into 8 equal pieces. Hamza eats 3 pieces. What fraction of the cake did Hamza eat?', ['3/5', '3/8', '5/8', '8/3'], 'B'],
  ['A shopkeeper puts 5 oranges in each bag. If there are 7 bags, how many oranges are there?', ['30', '32', '35', '40'], 'C'],
  ['A school has 125 boys and 138 girls. How many students are there altogether?', ['253', '263', '273', '283'], 'B'],
  ['A farmer has 48 eggs. He puts 6 eggs in each box. How many boxes can he fill?', ['6', '7', '8', '9'], 'C'],
  ['A ribbon is divided into 5 equal parts. A student uses 2 parts. What fraction of the ribbon is used?', ['2/5', '3/5', '2/3', '5/2'], 'A'],
  ['A library has 300 books. Students borrow 125 books. How many books are left?', ['165', '175', '185', '195'], 'B'],
]

const algebraQuestions = [
  ['A shop packs 4 candies in each bag. If there are 6 bags, how many candies are packed?', ['20', '24', '28', '30'], 'B'],
  ['Ali saves 5 rupees every day. How much does he save in 6 days?', ['25 rupees', '30 rupees', '35 rupees', '40 rupees'], 'B'],
  ['Sara puts 3 books on each shelf. If she has 7 shelves, how many books can she place?', ['18', '21', '24', '27'], 'B'],
  ['A bus has 10 passengers at the first stop. At each next stop, 5 more passengers get on. How many passengers are there after the second stop?', ['10', '15', '20', '25'], 'B'],
  ['A child climbs 2 steps at a time. The numbers of steps reached are 2, 4, 6, 8. What number comes next?', ['9', '10', '11', '12'], 'B'],
  ['A farmer plants 4 trees in each row. If he has 5 rows, how many trees does he plant?', ['9', '15', '20', '25'], 'C'],
  ['Ahmed has some pencils. His teacher gives him 5 more, making 12 pencils. How many pencils did Ahmed have before?', ['5', '6', '7', '8'], 'C'],
  ['A child reads 3 pages on Monday, 6 pages on Tuesday, and 9 pages on Wednesday. If the pattern continues, how many pages will the child read on Thursday?', ['10', '11', '12', '13'], 'C'],
  ['A bakery puts 6 cupcakes in each box. If there are 42 cupcakes, how many boxes are needed?', ['5', '6', '7', '8'], 'C'],
  ['A family buys 2 bottles of water each day. How many bottles will they buy in 7 days?', ['12', '14', '16', '18'], 'B'],
]

const geometryQuestions = [
  ['Ahmed has a square tile. How many sides does the tile have?', ['3', '4', '5', '6'], 'B'],
  ['A classroom door is shaped like a rectangle. How many corners does it have?', ['2', '3', '4', '5'], 'C'],
  ['Sara has a round plate. Which shape is the plate most like?', ['Triangle', 'Square', 'Circle', 'Rectangle'], 'C'],
  ['A sandwich is cut into a triangular shape. How many sides does the triangle have?', ['2', '3', '4', '5'], 'B'],
  ['A floor has 4 rows of tiles with 5 tiles in each row. How many tiles are there?', ['9', '15', '20', '25'], 'C'],
  ['A square garden has sides of 5 meters. What is its perimeter?', ['10 meters', '15 meters', '20 meters', '25 meters'], 'C'],
  ['A rectangular table is 6 feet long and 3 feet wide. What is its area?', ['9 square feet', '12 square feet', '18 square feet', '24 square feet'], 'C'],
  ['A window has 4 equal sides. Which shape is it most likely to be?', ['Circle', 'Square', 'Triangle', 'Pentagon'], 'B'],
  ['A picture frame is 8 inches long and 4 inches wide. What is its perimeter?', ['12 inches', '20 inches', '24 inches', '32 inches'], 'C'],
  ['A playground is shaped like a rectangle. Which measurement tells the distance around the playground?', ['Area', 'Perimeter', 'Mass', 'Volume'], 'B'],
]

const measurementQuestions = [
  ['A recipe needs 2 liters of water. Which measurement is being used?', ['Mass', 'Length', 'Liquid volume', 'Time'], 'C'],
  ['A watermelon weighs 4 kilograms. What is being measured?', ['Length', 'Mass', 'Area', 'Time'], 'B'],
  ['Ahmed measures his pencil with a ruler. Which unit is most suitable?', ['Centimeters', 'Liters', 'Kilograms', 'Hours'], 'A'],
  ['A movie starts at 3:00 PM and ends at 4:30 PM. How long is the movie?', ['30 minutes', '1 hour', '1 hour 30 minutes', '2 hours'], 'C'],
  ['Sara fills a bottle with 1 liter of water. Which unit is she using?', ['Liter', 'Meter', 'Kilogram', 'Centimeter'], 'A'],
  ['A table is 2 meters long. What is being measured?', ['Mass', 'Length', 'Volume', 'Time'], 'B'],
  ['A baker weighs flour before making bread. Which unit could be used?', ['Kilograms', 'Liters', 'Meters', 'Minutes'], 'A'],
  ['A school class starts at 8:00 AM and lasts 1 hour. What time does it end?', ['8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM'], 'B'],
  ['A rectangular carpet is 5 meters long and 3 meters wide. What is its area?', ['8 square meters', '12 square meters', '15 square meters', '20 square meters'], 'C'],
  ['A garden has a length of 7 meters and a width of 2 meters. What is its perimeter?', ['9 meters', '14 meters', '18 meters', '20 meters'], 'C'],
]

const dataQuestions = [
  ['A class asks students about their favorite fruit. 8 students choose apples and 5 choose bananas. Which fruit is more popular?', ['Apples', 'Bananas', 'Both', 'Neither'], 'A'],
  ['A teacher records the number of books read by students: Ali = 4, Sara = 7, Ahmed = 5. Who read the most books?', ['Ali', 'Sara', 'Ahmed', 'They are equal'], 'B'],
  ['A shop records the number of toys sold: Monday = 6, Tuesday = 9. How many more toys were sold on Tuesday?', ['2', '3', '4', '5'], 'B'],
  ['A class survey shows 10 students like football and 6 like cricket. How many students were surveyed altogether?', ['14', '15', '16', '17'], 'C'],
  ['A pictograph uses a star to represent 2 students. If there are 5 stars for apples, how many students chose apples?', ['5', '7', '10', '12'], 'C'],
  ['A family records glasses of water: Monday = 6, Tuesday = 8, Wednesday = 5. On which day did they drink the most?', ['Monday', 'Tuesday', 'Wednesday', 'All days'], 'B'],
  ['A teacher records test scores: 7, 9, 6, 9. What is the highest score?', ['6', '7', '8', '9'], 'D'],
  ['A grocery shop sells 12 apples and 7 oranges in one hour. How many fruits were sold altogether?', ['17', '18', '19', '20'], 'C'],
  ['A survey shows 15 students like cats and 10 students like dogs. How many more students like cats?', ['3', '4', '5', '6'], 'C'],
  ["A teacher makes a table showing students' favorite sports. Which question can the table answer?", ['Which sport is most popular?', 'How long is a pencil?', 'How heavy is a bag?', 'What time is lunch?'], 'A'],
]

function buildSection(startId, topic, subtopic, rows) {
  return rows.map(([text, values, answer], index) => question(startId + index, topic, subtopic, index < 4 ? 'Low' : index < 7 ? 'Medium' : 'High', text, Object.fromEntries(values.map((value, optionIndex) => [String.fromCharCode(65 + optionIndex), value])), answer))
}

export const grade3Questions = [
  ...buildSection(331, 'Number & Operations', 'Multiplication, Division & Fractions', numberQuestions),
  ...buildSection(341, 'Algebra', 'Patterns, Multiplication & Unknowns', algebraQuestions),
  ...buildSection(351, 'Geometry', 'Shapes, Area & Perimeter', geometryQuestions),
  ...buildSection(361, 'Measurement', 'Units, Time, Area & Perimeter', measurementQuestions),
  ...buildSection(371, 'Data Analysis', 'Data Representation & Interpretation', dataQuestions),
]
