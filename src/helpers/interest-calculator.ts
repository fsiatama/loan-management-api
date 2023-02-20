import * as dayjs from 'dayjs';

export class InterestCalculator {
  static calculateMonthlyAmount(
    rate: number,
    months: number,
    principal: number,
  ): number {
    return (
      ((-rate * (principal * Math.pow(1 + rate, months))) /
        (Math.pow(1 + rate, months) - 1)) *
      -1
    );
  }

  static calculateMonthlyRate(annualRate: number): number {
    return annualRate / 100 / 12;
  }

  static projectInstallments(
    rate: number,
    months: number,
    principal: number,
    startDate: Date,
    paymentDay: number,
  ) {
    const initDate = dayjs(startDate).add(1, 'month').date(paymentDay);

    const monthlyAmount = this.calculateMonthlyAmount(rate, months, principal);
    let date: string, toInterest: number, toPrincipal: number, ending: number;
    let beginning = principal;

    const installment = Array.from({ length: months }, (elm, index) => {
      date = initDate.add(index, 'month').format('MM/DD/YYYY');
      toInterest = beginning * rate;
      toPrincipal = monthlyAmount - toInterest;
      ending = beginning - toPrincipal;

      const row: API.InstallmentRow = {
        date,
        beginning,
        monthlyAmount,
        toInterest,
        toPrincipal,
        ending,
      };

      beginning = ending;

      return row;
    });

    return installment;
  }

  static getFutureValue(interestRate: number, principal: number, term: number) {
    return principal * Math.pow(1 + interestRate, term);
  }
}
