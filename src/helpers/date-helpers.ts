import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(utc);
dayjs.extend(isBetween);

export class DateHelpers {
  static parse(dateString: string | Date) {
    return dayjs.utc(dateString);
  }
  static getCutOffDates(
    currentDate: string,
    cutOffDay: number,
  ): [dayjs.Dayjs, dayjs.Dayjs] {
    const date = dayjs.utc(currentDate);

    let initDate = date.date(cutOffDay + 1);

    if (initDate.isAfter(date)) {
      initDate = initDate.subtract(1, 'month');
    }

    const finalDate = initDate.add(1, 'month').date(cutOffDay);

    return [initDate, finalDate];
  }

  static getLastOfMonth(dateString: string): string {
    const date = this.parse(dateString);
    return date.endOf('month').format('MM/DD/YYYY');
  }
}
