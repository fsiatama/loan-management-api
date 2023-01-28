declare namespace API {
  type Response<Entity> = {
    data: Entity[];
    current: number;
    pageSize: number;
    success: boolean;
    total: number;
  };

  type Address = {
    street: String;
    city: String;
    state: String;
    zip: String;
    phone: String;
    phone2?: String;
    phone3?: String;
  };

  type PayloadToken = {
    username: string;
    sub: string;
  };
}
