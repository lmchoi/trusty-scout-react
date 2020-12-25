import ScheduleService from './schedule-service.mjs'

// TODO test daylight saving 30 March etc

test('parse schedule', async () => {
    const dateToReport = new Date('2020-12-23');
    const scheduleService = new ScheduleService();

    await scheduleService.refresh();
    const schedule = scheduleService.retrieveSchedule(dateToReport);

    const scheduleOnDate = schedule.get(dateToReport.getTime());
    expect(scheduleOnDate.get('POR')).toEqual('UTA');
    expect(scheduleOnDate.get('UTA')).toEqual('POR');
    expect(scheduleOnDate.get('MEM')).toEqual('SAS');
    expect(scheduleOnDate.get('SAS')).toEqual('MEM');
});