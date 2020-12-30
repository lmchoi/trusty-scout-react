import {stringToDate, utcMsToEstDate} from './fancy-date.mjs'

test('drops time component from date string', () => {
    const utcDate = stringToDate('2020-12-23 22:00:00');
    expect(utcDate.toString()).toEqual('Wed Dec 23 2020 00:00:00 GMT+0000 (Greenwich Mean Time)');
})

test('drops time component from date string - dst', () => {
    const utcDate = stringToDate('2021-03-04 22:00:00');
    expect(utcDate.toString()).toEqual('Thu Mar 04 2021 00:00:00 GMT+0000 (Greenwich Mean Time)');
})

test('convert utc millis to est then get date', () => {
    const estDate = utcMsToEstDate(1614895200000)
    expect(estDate.toString()).toEqual('Thu Mar 04 2021 00:00:00 GMT+0000 (Greenwich Mean Time)');
})

