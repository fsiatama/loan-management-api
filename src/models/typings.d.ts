declare namespace API {
  type Response<Entity> = {
    data: Entity[];
    current: number;
    pageSize: number;
    success: boolean;
    total: number;
  };

  type PayloadToken = {
    username: string;
    sub: string;
  };

  type ComparativeStatistic = {
    id: number;
    value: number;
    prevValue: number;
    unit: string;
  };

  type ProjectionRow = {
    date: string;
    initBalance: number;
    pastDueInstallments: number;
    lastPaymentDate: string;
    ideaPayment: number;
    realPayment: number;
    appliedToInterest: number;
    appliedToPrincipal: number;
    endingBalance: number;
    totalArrears: number;
    monthTransactions: (Transaction & { concept: Concept })[];
    installment: string;
  };

  type InstallmentRow = {
    date: string;
    beginning: number;
    monthlyAmount: number;
    toInterest: number;
    toPrincipal: number;
    ending: number;
  };
}
