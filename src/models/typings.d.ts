declare namespace API {
  type Response<Entity> = {
    data: Entity[];
    current: number;
    pageSize: number;
    success: boolean;
    total: number;
  };
}
