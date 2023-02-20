import * as dayjs from 'dayjs';

export class DateHelpers {
  static getCutOffDates(
    currentDate: string,
    cutOffDay: number,
  ): [dayjs.Dayjs, dayjs.Dayjs] {
    const date = dayjs(currentDate);

    let initDate = date.date(cutOffDay + 1);

    if (initDate.isAfter(date)) {
      initDate = initDate.subtract(1, 'month');
    }

    const finalDate = initDate.add(1, 'month').date(cutOffDay);

    return [initDate, finalDate];
  }
}
