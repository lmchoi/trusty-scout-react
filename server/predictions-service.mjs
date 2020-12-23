import parser from 'fast-xml-parser';
import fs from 'fs';
const fsPromises = fs.promises;

async function parseSchedule() {
  const data = await fsPromises.readFile('resources/schedule.xml');
  const schedule = parser.parse(data.toString());
  // console.log(schedule.FantasyBasketballNerd.Game);
  return schedule;
}

export { parseSchedule }