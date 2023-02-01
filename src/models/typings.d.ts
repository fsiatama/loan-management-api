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
}
