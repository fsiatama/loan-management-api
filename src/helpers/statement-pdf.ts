import { Template, generate } from '@pdfme/generator';
import { readFileSync } from 'fs';
import { join } from 'path';
import { STATEMENT_PDF_SCHEMAS } from './constants';
import {
  Borrower,
  Concept,
  Loan,
  Term,
  Transaction,
  TermPaymentAssociatedConcepts,
} from '@prisma/client';
import { DateHelpers } from './date-helpers';

type CurrentLoan = Loan & {
  borrower1: Borrower;
  transactions: (Transaction & {
    concept: Concept;
  })[];
};

export class StatementPDF {
  private static getSchemas() {
    return STATEMENT_PDF_SCHEMAS;
  }

  private static async getFont() {
    const font = {
      metropolis_thin: {
        data: readFileSync(
          join(
            __dirname,
            '../../../',
            'static/pdf-templates/fonts/Metropolis-Thin.otf',
          ),
        ),
        fallback: true,
        subset: false,
      },
      metropolis_medium: {
        data: readFileSync(
          join(
            __dirname,
            '../../../',
            'static/pdf-templates/fonts/Metropolis-Medium.otf',
          ),
        ),
        subset: false,
      },
      metropolis_regular: {
        data: readFileSync(
          join(
            __dirname,
            '../../../',
            'static/pdf-templates/fonts/Metropolis-Regular.otf',
          ),
        ),
        subset: false,
      },
    };
    return font;
  }

  private static async getTemplate(schemas) {
    const data = readFileSync(
      join(
        __dirname,
        '../../../',
        'static/pdf-templates/statement-template.pdf',
      ),
    );
    const buff = Buffer.from(data);
    const base64pdf = 'data:application/pdf;base64,' + buff.toString('base64');

    const template: Template = {
      basePdf: base64pdf,
      schemas,
    };
    return template;
  }

  private static getInputs({
    loan,
    projection,
    date,
    term,
  }: {
    loan: CurrentLoan;
    projection: API.ProjectionRow[];
    date: string;
    term: Term & {
      paymentAscConcepts: (Partial<TermPaymentAssociatedConcepts> & {
        concept: Partial<Concept>;
      })[];
    };
  }) {
    const { amount, borrower1 } = loan;

    const {
      months,
      cutOffDay,
      annualInterestRate,
      paymentDay,
      paymentAscConcepts,
    } = term;

    const [initDate, finalDate] = DateHelpers.getCutOffDates(date, cutOffDay);

    const statementDate = initDate.add(1, 'day');

    const currentDate = DateHelpers.parse(date);
    const previousDate = currentDate.subtract(1, 'month').add(1, 'day');
    const nextPaymentDate = currentDate.date(paymentDay).format('MM/DD/YYYY');

    const previousStatement: API.ProjectionRow = projection.find((trn) =>
      DateHelpers.parse(trn.date).isSame(previousDate, 'month'),
    );
    const currentStatement: API.ProjectionRow = projection.find((trn) =>
      DateHelpers.parse(trn.date).isSame(currentDate, 'month'),
    );

    const {
      pastDueInstallments,
      initBalance: prevInitBalance,
      realPayment: prevRealPayment,
      appliedToPrincipal: prevAppliedToPrincipal,
      appliedToInterest: prevAppliedToInterest,
      endingBalance: prevEndingBalance,
      monthTransactions: prevMonthTransactions,
      lateFee: prevLateFee,
      lastPaymentDate,
    } = previousStatement ?? {
      pastDueInstallments: 0,
      initBalance: amount,
      realPayment: 0,
      appliedToPrincipal: 0,
      appliedToInterest: 0,
      endingBalance: amount,
      monthTransactions: [],
      lastPaymentDate: '',
    };
    const {
      installment: installments,
      totalArrears: totalInArreas,
      appliedToInterest: nextAppliedToInterest,
      ideaPayment: nextIdeaPayment,
      endingBalance: nextEndingBalance,
    } = currentStatement;

    const nextAppliedToPrincipal = nextIdeaPayment - nextAppliedToInterest;

    const borrowers = `${borrower1.firstName} ${borrower1.lastName}`;
    const borrowersStreet = `${borrower1.address.street}`;
    const borrowersCity = `${borrower1.address.city}, ${borrower1.address.state} ${borrower1.address.zip}`;
    const borrowersPhone = `${borrower1.address.phone}`
      .replace(/\D/g, '')
      .replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '($2) $3-$4');
    const USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });

    const loanAmount = USDollar.format(amount);
    const interest = `${annualInterestRate}%`;

    let initialIndex = 5;
    let lateFeeConcept = {};

    if (prevLateFee > 0) {
      initialIndex = 6;
      lateFeeConcept = {
        concept5red: 'Late fee for no payment',
        prevInst5red: USDollar.format(prevLateFee),
      };
    }

    const othersConcepts = paymentAscConcepts.reduce(
      (obj: { [key: string]: string }, item) => {
        obj[`concept${initialIndex}`] = item.concept?.name;
        obj[`nextInst${initialIndex}`] = USDollar.format(item.amount);

        const totalConceptPrevMonth = prevMonthTransactions
          .filter((trn) => trn.concept.id === item.concept?.id)
          .reduce((total, item) => {
            return total + item.amount;
          }, 0);

        obj[`prevInst${initialIndex}`] = USDollar.format(totalConceptPrevMonth);
        initialIndex += 1;

        return obj;
      },
      {},
    );

    const inputs = [
      {
        borrowers,
        borrowersStreet,
        borrowersCity,
        borrowersPhone,
        loanAmount,
        interest,
        installments,
        nextPaymentDate,
        lastPaymentDate,
        pastDue: `${pastDueInstallments}`,
        totalInArreas: USDollar.format(totalInArreas),
        concept1: 'Previous Balance',
        prevInst1: USDollar.format(prevInitBalance),
        concept2: 'Amount of last Payment',
        prevInst2: USDollar.format(prevRealPayment),
        concept3: 'Principal',
        prevInst3: USDollar.format(prevAppliedToPrincipal),
        nextInst3: USDollar.format(nextAppliedToPrincipal),
        concept4: 'Interest',
        prevInst4: USDollar.format(prevAppliedToInterest),
        nextInst4: USDollar.format(nextAppliedToInterest),
        concept11: 'Current Balance Due',
        prevInst11: USDollar.format(prevEndingBalance),
        concept12: 'Amount to be paid',
        nextInst12: USDollar.format(nextIdeaPayment),
        concept13: 'Balance after next payment',
        nextInst13: USDollar.format(nextEndingBalance),
        statementDate: statementDate.format('MM/DD/YYYY'),
        ...othersConcepts,
        ...lateFeeConcept,
      },
    ];

    return inputs;
  }

  static async generate({
    loan,
    projection,
    date,
    term,
  }: {
    loan: CurrentLoan;
    projection: API.ProjectionRow[];
    date: string;
    term: Term & {
      paymentAscConcepts: (Partial<TermPaymentAssociatedConcepts> & {
        concept: Partial<Concept>;
      })[];
    };
  }) {
    const schemas = this.getSchemas();
    const template: Template = await this.getTemplate(schemas);
    const font = await this.getFont();
    const inputs = this.getInputs({ loan, projection, date, term });

    const stream = await generate({ template, inputs, options: { font } });
    return stream;
  }
}
