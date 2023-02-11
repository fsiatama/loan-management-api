import { Template, generate } from '@pdfme/generator';
import * as dayjs from 'dayjs';
import { readFileSync } from 'fs';
import { join } from 'path';
import { STATEMENT_PDF_SCHEMAS } from './constants';
import { Borrower, Concept, Loan, Term, Transaction } from '@prisma/client';

type CurrentLoan = Loan & {
  terms: Term[];
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
  }: {
    loan: CurrentLoan;
    projection: API.ProjectionRow[];
    date: string;
  }) {
    const { terms, amount, startDate, borrower1 } = loan;
    const term = terms[0];
    const { months, cutOffDay, annualInterestRate, paymentDay } = term;

    const currentDate = dayjs(date).date(cutOffDay);
    const previousDate = currentDate.subtract(1, 'month').add(1, 'day');
    const nextPaymentDate = currentDate.date(paymentDay).format('MM/DD/YYYY');

    const previousStatement = projection.find((trn) =>
      dayjs(trn.date).isSame(previousDate, 'month'),
    );
    const currentStatement = projection.find((trn) =>
      dayjs(trn.date).isSame(currentDate, 'month'),
    );

    const {
      pastDueInstallments,
      initBalance: prevInitBalance,
      realPayment: prevRealPayment,
      appliedToPrincipal: prevAppliedToPrincipal,
      appliedToInterest: prevAppliedToInterest,
      endingBalance: prevEndingBalance,
    } = previousStatement ?? {
      pastDueInstallments: 0,
      initBalance: amount,
      realPayment: 0,
      appliedToPrincipal: 0,
      appliedToInterest: 0,
      endingBalance: amount,
    };
    const {
      installment: installments,
      totalArrears: totalInArreas,
      appliedToPrincipal: nextAppliedToPrincipal,
      appliedToInterest: nextAppliedToInterest,
      ideaPayment: nextIdeaPayment,
      endingBalance: nextEndingBalance,
      lastPaymentDate,
    } = currentStatement;

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

    //console.log(borrower1.address.phone, borrowersPhone);

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
        concept10: 'Balance at the cut-off date',
        prevInst10: USDollar.format(prevEndingBalance),
        concept11: 'Amount to be paid',
        nextInst11: USDollar.format(nextIdeaPayment),
        concept12: 'Balance after this payment',
        nextInst12: USDollar.format(nextEndingBalance),
        statementDate: currentDate.format('MM/DD/YYYY'),
      },
    ];

    return inputs;
  }

  static async generate({
    loan,
    projection,
    date,
  }: {
    loan: CurrentLoan;
    projection: API.ProjectionRow[];
    date: string;
  }) {
    const schemas = this.getSchemas();
    const template: Template = await this.getTemplate(schemas);
    const font = await this.getFont();
    const inputs = this.getInputs({ loan, projection, date });

    const stream = await generate({ template, inputs, options: { font } });
    return stream;
  }
}
