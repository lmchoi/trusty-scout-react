import ScheduleService from './schedule-service.mjs'

test('parse schedule', async () => {
    const dateToReport = new Date('2020-12-23');
    const scheduleService = new ScheduleService();

    const schedule = await scheduleService.retrieveSchedule(dateToReport);

    const scheduleOnDate = schedule.get(dateToReport);
    expect(scheduleOnDate.get('POR')).toEqual('UTA');
    expect(scheduleOnDate.get('UTA')).toEqual('POR');
    expect(scheduleOnDate.get('MEM')).toEqual('SAS');
    expect(scheduleOnDate.get('SAS')).toEqual('MEM');
});