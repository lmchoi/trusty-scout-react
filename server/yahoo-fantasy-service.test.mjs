import { parseSchedule } from './predictions-service.mjs'

test('parse schedule', async () => {
  const game = await parseSchedule();
  // console.log(game);
  expect(true).toBeTruthy();
});