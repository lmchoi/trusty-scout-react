import parser from 'fast-xml-parser';
import fs from 'fs';

function sameDate(date1, date2) {
    return date1.getUTCFullYear() === date2.getUTCFullYear() &&
        date1.getUTCMonth() === date2.getUTCMonth() &&
        date1.getUTCDate() === date2.getUTCDate();
}

function parseScheduleGame(game) {
    return {
        week: game.week,
        date: new Date(game.gameDate),
        home: game.home,
        away: game.away
    }
}

export default class ScheduleService {
    async refresh() {
        const fsPromises = fs.promises;
        const scheduleXml = await fsPromises.readFile('resources/schedule.xml');

        this.scheduleFile = parser.parse(scheduleXml.toString())
            .FantasyBasketballNerd.Game
            .map(game => parseScheduleGame(game));
    }

    retrieveSchedule(dateToReport) {
        const schedule = new Map();
        const matchupsOnTheDay = new Map();

        this.scheduleFile.filter(game => sameDate(game.date, dateToReport))
            .forEach(game => {
                matchupsOnTheDay.set(game.home, game.away);
                matchupsOnTheDay.set(game.away, game.home);
            });

        schedule.set(dateToReport.getTime(), matchupsOnTheDay);

        return schedule;
    }
}